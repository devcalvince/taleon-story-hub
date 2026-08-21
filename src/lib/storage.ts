import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getStorageProvider } from "@/lib/storage-adapter";
import type { StorageProvider, UploadOptions, UploadResult, DeleteResult } from "@/lib/storage-types";

const IMAGE_BUCKET = "story-assets";
const AUDIO_BUCKET = "story-audio";
const VIDEO_BUCKET = "story-video";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/m4a", "audio/aac", "audio/ogg"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_AUDIO_SIZE = parseInt(process.env["MAX_AUDIO_UPLOAD_MB"] || "200") * 1024 * 1024;
const MAX_VIDEO_SIZE = parseInt(process.env["MAX_VIDEO_UPLOAD_MB"] || "500") * 1024 * 1024;

const BUCKET = "story-assets";

export interface StoragePath {
  storyId: string;
  chapterId?: string;
  sceneId?: string;
  characterId?: string;
  locationId?: string;
  kind:
    | "covers"
    | "chapters"
    | "scenes"
    | "characters"
    | "locations"
    | "social"
    | "thumbnails"
    | "uploads"
    | "audio"
    | "video";
  filename: string;
}

export function buildStoragePath(p: StoragePath): string {
  const parts = [`stories/${p.storyId}`];

  if (p.kind === "covers") parts.push("covers");
  else if (p.kind === "characters") parts.push("characters");
  else if (p.kind === "locations") parts.push("locations");
  else if (p.kind === "social") parts.push("social");
  else if (p.kind === "thumbnails") parts.push("thumbnails");
  else if (p.kind === "uploads") parts.push("uploads");
  else if (p.kind === "audio") {
    parts.push("audio");
    if (p.chapterId) parts.push(`chapters/${p.chapterId}`);
  }
  else if (p.kind === "video") {
    parts.push("video");
    if (p.chapterId) parts.push(`chapters/${p.chapterId}`);
  }
  else if (p.chapterId) {
    parts.push(`chapters/${p.chapterId}`);
    if (p.kind === "scenes" && p.sceneId) parts.push(`scenes/${p.sceneId}`);
  }

  parts.push(p.filename);
  return parts.join("/");
}

export function sanitizeFilename(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export function validateFileUpload(
  file: File | ArrayBuffer,
  filename: string,
  type: "image" | "audio" | "video"
): { valid: boolean; error?: string } {
  const name = filename.toLowerCase();
  
  if (type === "image") {
    const ext = name.split(".").pop() || "";
    if (!["jpg", "jpeg", "png", "webp", "avif"].includes(ext)) {
      return { valid: false, error: "Unsupported image format. Use JPEG, PNG, WebP, or AVIF." };
    }
    if (file instanceof File && file.size > MAX_IMAGE_SIZE) {
      return { valid: false, error: `Image exceeds ${MAX_IMAGE_SIZE / 1024 / 1024} MB limit.` };
    }
    if (file instanceof ArrayBuffer && file.byteLength > MAX_IMAGE_SIZE) {
      return { valid: false, error: `Image exceeds ${MAX_IMAGE_SIZE / 1024 / 1024} MB limit.` };
    }
  } else if (type === "audio") {
    const ext = name.split(".").pop() || "";
    if (!["mp3", "m4a", "aac", "ogg", "mp4"].includes(ext)) {
      return { valid: false, error: "Unsupported audio format. Use MP3, M4A, AAC, OGG." };
    }
    if (file instanceof File && file.size > MAX_AUDIO_SIZE) {
      return { valid: false, error: `Audio exceeds ${MAX_AUDIO_SIZE / 1024 / 1024} MB limit.` };
    }
    if (file instanceof ArrayBuffer && file.byteLength > MAX_AUDIO_SIZE) {
      return { valid: false, error: `Audio exceeds ${MAX_AUDIO_SIZE / 1024 / 1024} MB limit.` };
    }
  } else if (type === "video") {
    const ext = name.split(".").pop() || "";
    if (!["mp4", "webm", "mov", "avi"].includes(ext)) {
      return { valid: false, error: "Unsupported video format. Use MP4, WebM, MOV." };
    }
    if (file instanceof File && file.size > MAX_VIDEO_SIZE) {
      return { valid: false, error: `Video exceeds ${MAX_VIDEO_SIZE / 1024 / 1024} MB limit.` };
    }
    if (file instanceof ArrayBuffer && file.byteLength > MAX_VIDEO_SIZE) {
      return { valid: false, error: `Video exceeds ${MAX_VIDEO_SIZE / 1024 / 1024} MB limit.` };
    }
  }

  return { valid: true };
}

export async function detectMimeType(buffer: ArrayBuffer): Promise<string | null> {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return "image/webp";
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return "audio/mpeg";
  if (bytes[0] === 0x66 && bytes[1] === 0x74 && bytes[2] === 0x79 && bytes[3] === 0x70) {
    const brand = new TextDecoder().decode(bytes.slice(4, 12));
    if (brand.includes("mp4") || brand.includes("m4a") || brand.includes("isom")) return "audio/mp4";
    if (brand.includes("qt")) return "video/quicktime";
  }
  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x00 && bytes[3] === 0x1c &&
      bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return "video/mp4";
  }
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return "video/webm";
  
  return null;
}

export async function uploadAsset(
  bucket: string,
  path: string,
  data: ArrayBuffer | Blob,
  contentType: string,
  options?: { upsert?: boolean; cacheControl?: string }
): Promise<UploadResult> {
  const provider = getStorageProvider();
  return provider.upload({
    bucket,
    path,
    data,
    contentType,
    upsert: options?.upsert ?? true,
    cacheControl: options?.cacheControl ?? "3600",
  });
}

export async function deleteAsset(path: string): Promise<DeleteResult> {
  const provider = getStorageProvider();
  return provider.delete(path);
}

export async function replaceAsset(
  oldPath: string,
  bucket: string,
  newPath: string,
  data: ArrayBuffer | Blob,
  contentType: string
): Promise<UploadResult> {
  const provider = getStorageProvider();
  return provider.replace(oldPath, { bucket, path: newPath, data, contentType });
}

export async function getAssetPublicUrl(path: string): Promise<string | null> {
  const provider = getStorageProvider();
  const result = provider.getPublicUrl(path);
  return result.success ? result.url ?? null : null;
}

export async function getAssetSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
  const provider = getStorageProvider();
  const result = await provider.getSignedUrl(path, expiresIn);
  return result.success ? result.url ?? null : null;
}

export async function ensureBuckets(): Promise<void> {
  const provider = getStorageProvider();
  await Promise.all([
    provider.createBucketIfNotExists(IMAGE_BUCKET),
    provider.createBucketIfNotExists(AUDIO_BUCKET),
    provider.createBucketIfNotExists(VIDEO_BUCKET),
  ]);
}

export async function ensureBucket(bucket: string): Promise<void> {
  const provider = getStorageProvider();
  await provider.createBucketIfNotExists(bucket);
}

export function getBucketForAssetType(assetType: string): string {
  if (assetType === "audio") return AUDIO_BUCKET;
  if (assetType === "video") return VIDEO_BUCKET;
  return IMAGE_BUCKET;
}

export function getMaxSizeForAssetType(assetType: string): number {
  if (assetType === "audio") return MAX_AUDIO_SIZE;
  if (assetType === "video") return MAX_VIDEO_SIZE;
  return MAX_IMAGE_SIZE;
}

export function getAllowedTypesForAssetType(assetType: string): string[] {
  if (assetType === "audio") return ALLOWED_AUDIO_TYPES;
  if (assetType === "video") return ALLOWED_VIDEO_TYPES;
  return ALLOWED_IMAGE_TYPES;
}

export { IMAGE_BUCKET, AUDIO_BUCKET, VIDEO_BUCKET };

export async function uploadToStorage(
  path: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  const bucket = BUCKET; // Use the default story-assets bucket
  await ensureBucket(bucket);

  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, data, {
    contentType,
    upsert: true,
  });

  if (error) return { error: error.message };

  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return { path, publicUrl: urlData.publicUrl };
}

export async function deleteFromStorage(path: string): Promise<void> {
  const bucket = BUCKET; // Use the default story-assets bucket
  await supabaseAdmin.storage.from(bucket).remove([path]);
}
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "story-assets";

export interface StoragePath {
  storyId: string;
  chapterId?: string;
  sceneId?: string;
  characterId?: string;
  locationId?: string;
  kind: "covers" | "chapters" | "scenes" | "characters" | "locations" | "social" | "thumbnails" | "uploads";
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

export async function ensureBucket(): Promise<void> {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await supabaseAdmin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    });
  }
}

export async function uploadToStorage(
  path: string,
  data: ArrayBuffer,
  contentType: string
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  await ensureBucket();

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, data, {
      contentType,
      upsert: true,
    });

  if (error) return { error: error.message };

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return { path, publicUrl: urlData.publicUrl };
}

export async function deleteFromStorage(path: string): Promise<void> {
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}

export function getPublicUrl(path: string): string {
  const { data } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

export { BUCKET };

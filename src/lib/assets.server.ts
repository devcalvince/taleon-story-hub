import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  uploadToStorage,
  deleteFromStorage,
  buildStoragePath,
  sanitizeFilename,
} from "@/lib/storage";
import { importExternalImage, sanitizeImportFilename } from "@/lib/image-import";
import { getActiveProvider, type GenerateRequest } from "@/lib/providers";

export interface AssetCreateInput {
  storyId?: string;
  chapterId?: string;
  sceneId?: string;
  characterId?: string;
  locationId?: string;
  assetType: string;
  title: string;
  description?: string;
  prompt?: string;
  negativePrompt?: string;
  sourceType: string;
  sourceUrl?: string;
  createdBy?: string;
}

export async function createAsset(input: AssetCreateInput) {
  const { data, error } = await supabaseAdmin
    .from("media_assets")
    .insert({
      story_id: input.storyId || null,
      chapter_id: input.chapterId || null,
      scene_id: input.sceneId || null,
      character_id: input.characterId || null,
      location_id: input.locationId || null,
      asset_type: input.assetType as any,
      title: input.title,
      description: input.description || null,
      prompt: input.prompt || null,
      negative_prompt: input.negativePrompt || null,
      provider: "manual",
      source_type: input.sourceType as any,
      source_url: input.sourceUrl || null,
      status: "draft",
      version: 1,
      approved: false,
      created_by: input.createdBy || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function uploadImageAsset(
  assetId: string,
  file: File | ArrayBuffer,
  filename: string,
  contentType: string,
  storyId: string,
  kind: string = "uploads",
) {
  const buffer = file instanceof File ? await file.arrayBuffer() : file;
  const safe = sanitizeFilename(filename);
  const path = buildStoragePath({ storyId, kind: kind as any, filename: safe });

  const result = await uploadToStorage(path, buffer, contentType);
  if ("error" in result) return { error: result.error };

  let metadata: any = null;
  try {
    const res = await supabaseAdmin.rpc("storage.get_bucket" as any, { name: "story-assets" });
    metadata = res.data;
  } catch {
    /* ignore */
  }

  const { error: updateErr } = await supabaseAdmin
    .from("media_assets")
    .update({
      original_storage_path: result.path,
      public_url: result.publicUrl,
      status: "ready" as any,
      source_type: "upload" as any,
    } as any)
    .eq("id", assetId);

  if (updateErr) return { error: updateErr.message };

  return { path: result.path, publicUrl: result.publicUrl };
}

export async function importExternalUrlAsset(assetId: string, url: string, storyId: string) {
  const result = await importExternalImage(url);
  if (!result.ok) return { error: result.error };

  const filename = sanitizeImportFilename(url, result.format);
  const path = buildStoragePath({ storyId, kind: "uploads", filename });

  const uploadResult = await uploadToStorage(path, result.data, result.contentType);
  if ("error" in uploadResult) return { error: uploadResult.error };

  const { error: updateErr } = await supabaseAdmin
    .from("media_assets")
    .update({
      original_storage_path: uploadResult.path,
      public_url: uploadResult.publicUrl,
      source_url: url,
      width: result.width || null,
      height: result.height || null,
      format: result.format,
      file_size: Number(BigInt(result.fileSize)),
      status: "ready" as any,
      source_type: "external_url" as any,
    } as any)
    .eq("id", assetId);

  if (updateErr) return { error: updateErr.message };

  return {
    path: uploadResult.path,
    publicUrl: uploadResult.publicUrl,
    width: result.width,
    height: result.height,
    format: result.format,
    fileSize: result.fileSize,
  };
}

export async function approveAsset(assetId: string, userId: string) {
  const { error } = await supabaseAdmin
    .from("media_assets")
    .update({
      status: "approved",
      approved: true,
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", assetId);

  return { error };
}

export async function rejectAsset(assetId: string) {
  const { error } = await supabaseAdmin
    .from("media_assets")
    .update({
      status: "rejected",
      approved: false,
    })
    .eq("id", assetId);

  return { error };
}

export async function archiveAsset(assetId: string) {
  const { error } = await supabaseAdmin
    .from("media_assets")
    .update({ status: "archived" })
    .eq("id", assetId);

  return { error };
}

export async function deleteAsset(assetId: string) {
  const { data: asset } = await supabaseAdmin
    .from("media_assets")
    .select("original_storage_path, processed_storage_path, thumbnail_storage_path")
    .eq("id", assetId)
    .single();

  if (asset) {
    const paths = [
      asset.original_storage_path,
      asset.processed_storage_path,
      asset.thumbnail_storage_path,
    ].filter(Boolean);
    for (const p of paths) await deleteFromStorage(p!);
  }

  const { error } = await supabaseAdmin.from("media_assets").delete().eq("id", assetId);

  return { error };
}

export async function getAssets(filters: {
  storyId?: string;
  chapterId?: string;
  sceneId?: string;
  characterId?: string;
  locationId?: string;
  assetType?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let query = supabaseAdmin
    .from("media_assets")
    .select("*, story:stories(id,title,slug)", { count: "exact" });

  if (filters.storyId) query = query.eq("story_id", filters.storyId);
  if (filters.chapterId) query = query.eq("chapter_id", filters.chapterId);
  if (filters.sceneId) query = query.eq("scene_id", filters.sceneId);
  if (filters.characterId) query = query.eq("character_id", filters.characterId);
  if (filters.locationId) query = query.eq("location_id", filters.locationId);
  if (filters.assetType) query = query.eq("asset_type", filters.assetType as any);
  if (filters.status) query = query.eq("status", filters.status as any);
  if (filters.search)
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

  const page = filters.page || 1;
  const limit = filters.limit || 24;
  const from = (page - 1) * limit;

  query = query.order("created_at", { ascending: false }).range(from, from + limit - 1);

  const { data, error, count } = await query;
  return { data, error, count, page, limit };
}

export async function getAsset(assetId: string) {
  const { data, error } = await supabaseAdmin
    .from("media_assets")
    .select(
      `
      *,
      story:stories(id, title, slug),
      chapter:chapters(id, title, chapter_number),
      scene:scenes(id, title, scene_number),
      character:characters(id, name),
      location:locations(id, name)
    `,
    )
    .eq("id", assetId)
    .single();

  return { data, error };
}

export async function getAssetVersions(storyId: string, sceneId?: string) {
  let query = supabaseAdmin
    .from("media_assets")
    .select("id, title, asset_type, status, version, approved, created_at, public_url")
    .eq("story_id", storyId)
    .order("version", { ascending: false });

  if (sceneId) query = query.eq("scene_id", sceneId);

  const { data, error } = await query;
  return { data, error };
}

export async function createGenerationJob(input: {
  mediaAssetId?: string;
  storyId?: string;
  chapterId?: string;
  sceneId?: string;
  prompt: string;
  provider?: string;
  model?: string;
  createdBy?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("generation_jobs")
    .insert({
      media_asset_id: input.mediaAssetId || null,
      story_id: input.storyId || null,
      chapter_id: input.chapterId || null,
      scene_id: input.sceneId || null,
      prompt: input.prompt,
      provider: input.provider || "manual",
      model: input.model || null,
      status: "queued",
      created_by: input.createdBy || null,
    })
    .select()
    .single();

  return { data, error };
}

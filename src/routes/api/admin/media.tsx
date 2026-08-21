import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth.server";
import {
  uploadToStorage,
  buildStoragePath,
  sanitizeFilename,
  ensureBucket,
  validateMediaUpload,
  getBucketForAssetType,
  deleteFromStorage,
} from "@/lib/storage";
import { importExternalImage, sanitizeImportFilename } from "@/lib/image-import";

export const Route = createFileRoute("/api/admin/media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Verified admin identity — used for created_by/uploaded_by.
          // Client-supplied user IDs are never trusted for attribution.
          const admin = await requireAdmin(request);
          const formData = await request.formData();
          const action = formData.get("action") as string;

          if (action === "upload") {
            const file = formData.get("file") as File;
            const storyId = formData.get("storyId") as string;
            const assetType = (formData.get("assetType") as string) || "other";
            const title = (formData.get("title") as string) || file.name;
            const chapterId = (formData.get("chapterId") as string) || null;
            const sceneId = (formData.get("sceneId") as string) || null;
            const characterId = (formData.get("characterId") as string) || null;
            const locationId = (formData.get("locationId") as string) || null;
            const description = (formData.get("description") as string) || null;
            const prompt = (formData.get("prompt") as string) || null;

            if (!file || !storyId) {
              return new Response(JSON.stringify({ error: "file and storyId required" }), {
                status: 400,
              });
            }

            // Size gate BEFORE buffering the body into memory.
            if (file.size <= 0) {
              return new Response(JSON.stringify({ error: "Empty file." }), { status: 400 });
            }

            const buffer = await file.arrayBuffer();
            const safe = sanitizeFilename(file.name);

            // Full server-side validation: extension, declared MIME,
            // magic-byte content sniffing, size limit, asset-type allowlist.
            const validation = validateMediaUpload({
              buffer,
              filename: safe,
              declaredMime: file.type,
              assetType,
            });
            if (!validation.ok) {
              return new Response(JSON.stringify({ error: validation.error }), { status: 400 });
            }

            // Bucket follows the asset class (images / audio / video).
            const bucket = getBucketForAssetType(assetType);
            const pathProps: Parameters<typeof buildStoragePath>[0] = {
              storyId,
              kind: assetType === "audio" ? "audio" : assetType === "video" ? "video" : "uploads",
              filename: safe,
            };
            if (chapterId) pathProps.chapterId = chapterId;
            const path = buildStoragePath(pathProps);
            await ensureBucket(bucket);
            const upload = await uploadToStorage(path, buffer, validation.detectedMime, bucket);
            if ("error" in upload) {
              return new Response(JSON.stringify({ error: upload.error }), { status: 500 });
            }

            const { data: asset, error: insertErr } = await supabaseAdmin
              .from("media_assets")
              .insert({
                story_id: storyId,
                chapter_id: chapterId,
                scene_id: sceneId,
                character_id: characterId,
                location_id: locationId,
                asset_type: assetType,
                title,
                description,
                prompt,
                source_type: "upload",
                original_storage_path: upload.path,
                storage_bucket: bucket,
                storage_path: upload.path,
                mime_type: validation.detectedMime,
                file_size: buffer.byteLength,
                public_url: upload.publicUrl,
                status: "ready",
                version: 1,
                approved: false,
                created_by: admin.id,
                uploaded_by: admin.id,
              } as any)
              .select()
              .single();

            if (insertErr) {
              // DB write failed after a successful storage upload — remove the
              // object so orphans do not accumulate.
              await deleteFromStorage(upload.path, bucket).catch(() => undefined);
              return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });
            }

            return new Response(JSON.stringify({ success: true, asset }), { status: 200 });
          }

          if (action === "import_url") {
            const url = formData.get("url") as string;
            const storyId = formData.get("storyId") as string;
            const assetType = (formData.get("assetType") as string) || "other";
            const title = (formData.get("title") as string) || "Imported image";
            const chapterId = (formData.get("chapterId") as string) || null;
            const sceneId = (formData.get("sceneId") as string) || null;
            const characterId = (formData.get("characterId") as string) || null;
            const locationId = (formData.get("locationId") as string) || null;
            const description = (formData.get("description") as string) || null;
            const prompt = (formData.get("prompt") as string) || null;

            if (!url || !storyId) {
              return new Response(JSON.stringify({ error: "url and storyId required" }), {
                status: 400,
              });
            }

            const imported = await importExternalImage(url);
            if (!imported.ok) {
              return new Response(JSON.stringify({ error: imported.error }), { status: 400 });
            }

            const filename = sanitizeImportFilename(url, imported.format);
            const path = buildStoragePath({ storyId, kind: "uploads", filename });

            await ensureBucket("story-assets");
            const upload = await uploadToStorage(path, imported.data, imported.contentType);
            if ("error" in upload) {
              return new Response(JSON.stringify({ error: upload.error }), { status: 500 });
            }

            const { data: asset, error: insertErr } = await supabaseAdmin
              .from("media_assets")
              .insert({
                story_id: storyId,
                chapter_id: chapterId,
                scene_id: sceneId,
                character_id: characterId,
                location_id: locationId,
                asset_type: assetType,
                title,
                description,
                prompt,
                source_type: "external_url",
                source_url: url,
                original_storage_path: upload.path,
                storage_bucket: "story-assets",
                storage_path: upload.path,
                mime_type: imported.contentType,
                file_size: imported.fileSize,
                public_url: upload.publicUrl,
                width: imported.width || null,
                height: imported.height || null,
                format: imported.format,
                status: "ready",
                version: 1,
                approved: false,
                created_by: admin.id,
                uploaded_by: admin.id,
              } as any)
              .select()
              .single();

            if (insertErr) {
              // Cleanup on failed DB write (orphan prevention).
              await deleteFromStorage(upload.path, "story-assets").catch(() => undefined);
              return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });
            }

            return new Response(JSON.stringify({ success: true, asset }), { status: 200 });
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        } catch (e: any) {
          if (e instanceof Response) return e;
          return new Response(JSON.stringify({ error: e.message || "Internal error" }), {
            status: 500,
          });
        }
      },

      GET: async ({ request }) => {
        try {
          await requireAdmin(request);
          const url = new URL(request.url);
          const storyId = url.searchParams.get("storyId") || undefined;
          const chapterId = url.searchParams.get("chapterId") || undefined;
          const sceneId = url.searchParams.get("sceneId") || undefined;
          const characterId = url.searchParams.get("characterId") || undefined;
          const locationId = url.searchParams.get("locationId") || undefined;
          const assetType = url.searchParams.get("assetType") || undefined;
          const status = url.searchParams.get("status") || undefined;
          const search = url.searchParams.get("search") || undefined;
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "24");

          let query = supabaseAdmin
            .from("media_assets")
            .select("*, story:stories(id,title,slug)", { count: "exact" });

          if (storyId) query = query.eq("story_id", storyId);
          if (chapterId) query = query.eq("chapter_id", chapterId);
          if (sceneId) query = query.eq("scene_id", sceneId);
          if (characterId) query = query.eq("character_id", characterId);
          if (locationId) query = query.eq("location_id", locationId);
          if (assetType) query = query.eq("asset_type", assetType as any);
          if (status) query = query.eq("status", status as any);
          if (search) {
            // Escape PostgREST filter metacharacters — the value is spliced
            // into an or() filter string, not a parameterized value.
            const safeSearch = search.replace(/[%,()]/g, " ").trim();
            if (safeSearch) {
              query = query.or(`title.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`);
            }
          }

          const from = (page - 1) * limit;
          query = query.order("created_at", { ascending: false }).range(from, from + limit - 1);

          const { data, error, count } = await query;
          if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

          return new Response(JSON.stringify({ data, count, page, limit }), { status: 200 });
        } catch (e: any) {
          if (e instanceof Response) return e;
          return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
      },
    },
  },
});

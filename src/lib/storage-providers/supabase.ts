import type { 
  StorageProvider, 
  UploadOptions, 
  UploadResult, 
  DeleteResult, 
  MetadataResult, 
  PublicUrlResult, 
  BucketOptions 
} from "@/lib/storage-types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export class SupabaseStorageProvider implements StorageProvider {
  async upload(options: UploadOptions): Promise<UploadResult> {
    try {
      await this.createBucketIfNotExists(options.bucket, {
        public: true,
        allowedMimeTypes: this.getAllowedMimeTypes(options.bucket),
      });

      const uploadData = options.data instanceof File 
        ? await options.data.arrayBuffer() 
        : typeof options.data === "string" 
          ? Buffer.from(options.data) 
          : (options.data as ArrayBuffer);

      const { data, error } = await supabaseAdmin.storage
        .from(options.bucket)
        .upload(options.path, uploadData, {
          contentType: options.contentType,
          upsert: options.upsert ?? true,
          cacheControl: options.cacheControl ?? "3600",
          metadata: options.metadata ?? {},
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(options.bucket)
        .getPublicUrl(data.path);

      return {
        success: true,
        path: data.path,
        publicUrl: urlData.publicUrl,
        metadata: {
          size: uploadData.byteLength,
          contentType: options.contentType,
          lastModified: new Date().toISOString(),
        },
      };
    } catch (e: any) {
      return { success: false, error: e.message || "Upload failed" };
    }
  }

  async delete(path: string): Promise<DeleteResult> {
    try {
      const bucket = this.extractBucketFromPath(path);
      const storagePath = this.extractStoragePath(path);

      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([storagePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Delete failed" };
    }
  }

  async replace(oldPath: string, newOptions: UploadOptions): Promise<UploadResult> {
    const uploadResult = await this.upload(newOptions);
    if (!uploadResult.success) {
      return uploadResult;
    }

    const deleteResult = await this.delete(oldPath);
    if (!deleteResult.success) {
      console.warn(`Failed to delete old asset after replacement: ${deleteResult.error}`);
    }

    return uploadResult;
  }

  getPublicUrl(path: string): PublicUrlResult {
    try {
      const bucket = this.extractBucketFromPath(path);
      const storagePath = this.extractStoragePath(path);

      const { data } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(storagePath);

      return { success: true, url: data.publicUrl };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to get public URL" };
    }
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<PublicUrlResult> {
    try {
      const bucket = this.extractBucketFromPath(path);
      const storagePath = this.extractStoragePath(path);

      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(storagePath, expiresIn);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, url: data.signedUrl };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to create signed URL" };
    }
  }

  async getMetadata(path: string): Promise<MetadataResult> {
    try {
      const bucket = this.extractBucketFromPath(path);
      const storagePath = this.extractStoragePath(path);

      let metadataResult: any;
      try {
        metadataResult = await (supabaseAdmin.storage.from(bucket) as any).getMetadata(storagePath);
      } catch {
        metadataResult = { data: [{ size: 0, mimetype: "application/octet-stream" }] };
      }

      if (metadataResult && metadataResult.data) {
        const metadata = metadataResult.data[0] || metadataResult.data;
        return {
          success: true,
          metadata: {
            size: metadata.size || 0,
            contentType: metadata.mimetype || metadata.contentType || "application/octet-stream",
            lastModified: metadata.lastModified || metadata.updated_at || new Date().toISOString(),
            etag: metadata.etag,
            width: metadata.width,
            height: metadata.height,
            duration: metadata.duration,
            bitrate: metadata.bitrate,
          },
        };
      }
      return { success: false, error: "Metadata not available" };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const bucket = "story-assets";
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .list(prefix, { limit: 1000 });

      if (error) {
        return [];
      }

      return data.map((file) => `${prefix ? prefix + "/" : ""}${file.name}`).filter(Boolean);
    } catch {
      return [];
    }
  }

  async createBucketIfNotExists(bucket: string, options?: BucketOptions): Promise<void> {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === bucket);

    if (!exists) {
      await supabaseAdmin.storage.createBucket(bucket, {
        public: options?.public ?? true,
        fileSizeLimit: options?.fileSizeLimit ?? this.getDefaultFileSizeLimit(bucket),
        allowedMimeTypes: options?.allowedMimeTypes ?? this.getAllowedMimeTypes(bucket),
      });
    }
  }

  async bucketExists(bucket: string): Promise<boolean> {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    return buckets?.some((b) => b.name === bucket) ?? false;
  }

  private extractBucketFromPath(path: string): string {
    if (path.startsWith("story-audio/")) return "story-audio";
    if (path.startsWith("story-video/")) return "story-video";
    return "story-assets";
  }

  private extractStoragePath(path: string): string {
    const bucket = this.extractBucketFromPath(path);
    return path.replace(`${bucket}/`, "");
  }

  private getDefaultFileSizeLimit(bucket: string): number {
    switch (bucket) {
      case "story-audio":
        return parseInt(process.env["MAX_AUDIO_UPLOAD_MB"] || "200") * 1024 * 1024;
      case "story-video":
        return parseInt(process.env["MAX_VIDEO_UPLOAD_MB"] || "500") * 1024 * 1024;
      default:
        return 10 * 1024 * 1024;
    }
  }

  private getAllowedMimeTypes(bucket: string): string[] {
    switch (bucket) {
      case "story-audio":
        return ["audio/mpeg", "audio/mp4", "audio/m4a", "audio/aac", "audio/ogg", "audio/wav"];
      case "story-video":
        return ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
      default:
        return ["image/jpeg", "image/png", "image/webp", "image/avif"];
    }
  }
}
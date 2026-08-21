const CLOUDINARY_ENABLED = process.env["CLOUDINARY_ENABLED"] === "true";
const CLOUDINARY_CLOUD_NAME = process.env["CLOUDINARY_CLOUD_NAME"] || "";
const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"] || "";
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"] || "";

export function isCloudinaryEnabled(): boolean {
  return (
    CLOUDINARY_ENABLED && !!CLOUDINARY_CLOUD_NAME && !!CLOUDINARY_API_KEY && !!CLOUDINARY_API_SECRET
  );
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function cloudinaryUpload(
  filePath: string,
  options?: { folder?: string; transformation?: string },
): Promise<CloudinaryUploadResult | { error: string }> {
  if (!isCloudinaryEnabled()) {
    return { error: "Cloudinary is not enabled" };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = options?.folder || "taleon";

  // Build signature
  const crypto = await import("crypto");
  const paramsToSign = `folder=${folder}&public_id=${filePath}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const formData = new FormData();
  formData.append("file", ""); // Will be replaced with actual file data
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  if (options?.transformation) formData.append("transformation", options.transformation);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await res.json();
    if (data.error) return { error: data.error.message };
    return data as CloudinaryUploadResult;
  } catch (e: any) {
    return { error: e.message || "Cloudinary upload failed" };
  }
}

export function cloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; quality?: string; format?: string },
): string {
  if (!isCloudinaryEnabled()) return "";
  const parts = [`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`];
  const transforms: string[] = [];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.quality) transforms.push(`q_${options.quality}`);
  if (options?.format) transforms.push(`f_${options.format}`);
  if (transforms.length > 0) parts.push(transforms.join(","));
  parts.push(publicId);
  return parts.join("/");
}

export function cloudinaryThumbnail(publicId: string): string {
  return cloudinaryUrl(publicId, { width: 400, height: 300, quality: "auto", format: "auto" });
}

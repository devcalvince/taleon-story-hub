export interface StorageProvider {
  upload(options: UploadOptions): Promise<UploadResult>;
  delete(path: string): Promise<DeleteResult>;
  replace(oldPath: string, newOptions: UploadOptions): Promise<UploadResult>;
  getPublicUrl(path: string): PublicUrlResult;
  getSignedUrl(path: string, expiresIn?: number): Promise<PublicUrlResult>;
  getMetadata(path: string): Promise<MetadataResult>;
  listFiles(prefix?: string): Promise<string[]>;
  createBucketIfNotExists(bucket: string, options?: BucketOptions): Promise<void>;
  bucketExists(bucket: string): Promise<boolean>;
}

export interface BucketOptions {
  public?: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
}

export interface UploadOptions {
  bucket: string;
  path: string;
  data: ArrayBuffer | Blob | ReadableStream;
  contentType: string;
  cacheControl?: string;
  upsert?: boolean;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  success: boolean;
  path?: string;
  publicUrl?: string;
  signedUrl?: string;
  error?: string;
  metadata?: {
    size: number;
    contentType: string;
    lastModified: string;
    etag?: string;
  };
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface PublicUrlResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface MetadataResult {
  success: boolean;
  metadata?: {
    size: number;
    contentType: string;
    lastModified: string;
    etag?: string;
    width?: number;
    height?: number;
    duration?: number;
    bitrate?: number;
  };
  error?: string;
}

export interface StorageConfig {
  provider: "supabase" | "cloudflare_r2" | "aws_s3";
  supabase?: {
    url: string;
    serviceRoleKey: string;
  };
  cloudflareR2?: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    publicUrl: string;
  };
  awsS3?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    publicUrl: string;
  };
}
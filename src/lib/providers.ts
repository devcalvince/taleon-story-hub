export interface GenerateRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  storyId?: string;
  chapterId?: string;
  sceneId?: string;
}

export type GenerateResult = {
  ok: true;
  imageUrl: string;
  provider: string;
  model: string;
  generationDurationMs?: number;
  estimatedCost?: number;
  currency?: string;
} | {
  ok: false;
  error: string;
  provider: string;
}

export interface ImageProvider {
  name: string;
  generate(request: GenerateRequest): Promise<GenerateResult>;
  supportsGeneration: boolean;
}

// ============================================================
// MANUAL UPLOAD — Default $0 provider
// ============================================================
export class ManualUploadProvider implements ImageProvider {
  name = "manual";
  supportsGeneration = false;

  async generate(_req: GenerateRequest): Promise<GenerateResult> {
    return {
      ok: false,
      error: "Manual provider does not support automatic generation. Use external tools and upload/import results.",
      provider: this.name,
    };
  }
}

// ============================================================
// EXTERNAL URL IMPORT
// ============================================================
export class ExternalUrlProvider implements ImageProvider {
  name = "external_url";
  supportsGeneration = false;

  async generate(_req: GenerateRequest): Promise<GenerateResult> {
    return {
      ok: false,
      error: "External URL provider does not support automatic generation.",
      provider: this.name,
    };
  }
}

// ============================================================
// PROVIDER REGISTRY
// ============================================================
const providers: Record<string, ImageProvider> = {
  manual: new ManualUploadProvider(),
  external_url: new ExternalUrlProvider(),
};

export function getProvider(name: string): ImageProvider {
  return providers[name] ?? providers["manual"]!;
}

export function registerProvider(provider: ImageProvider): void {
  providers[provider.name] = provider;
}

export function listProviders(): string[] {
  return Object.keys(providers);
}

export function getActiveProvider(): ImageProvider {
  const name = process.env["IMAGE_PROVIDER"] || "manual";
  return getProvider(name);
}

export type { GenerateRequest as ImageGenerateRequest };

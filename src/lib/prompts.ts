export interface TaleonStyle {
  cinematic: boolean;
  premium: boolean;
  atmospheric: boolean;
  dramatic: boolean;
  realistic: boolean;
  contemporary: boolean;
  immersive: boolean;
  sophisticated: boolean;
  strong_composition: boolean;
  natural_skin_texture: boolean;
  believable_environments: boolean;
  controlled_highlights: boolean;
  rich_shadows: boolean;
  subtle_film_grain: boolean;
  cinematic_depth: boolean;
  editorial_quality: boolean;
}

export const DEFAULT_TALEON_STYLE: TaleonStyle = {
  cinematic: true,
  premium: true,
  atmospheric: true,
  dramatic: true,
  realistic: true,
  contemporary: true,
  immersive: true,
  sophisticated: true,
  strong_composition: true,
  natural_skin_texture: true,
  believable_environments: true,
  controlled_highlights: true,
  rich_shadows: true,
  subtle_film_grain: true,
  cinematic_depth: true,
  editorial_quality: true,
};

const STYLE_PREFIX_PARTS: Record<keyof TaleonStyle, string> = {
  cinematic: "cinematic composition",
  premium: "premium quality",
  atmospheric: "atmospheric lighting",
  dramatic: "dramatic mood",
  realistic: "photorealistic",
  contemporary: "contemporary setting",
  immersive: "immersive depth",
  sophisticated: "sophisticated aesthetic",
  strong_composition: "strong composition",
  natural_skin_texture: "natural skin texture",
  believable_environments: "believable environment",
  controlled_highlights: "controlled highlights",
  rich_shadows: "rich shadows",
  subtle_film_grain: "subtle film grain",
  cinematic_depth: "cinematic depth of field",
  editorial_quality: "editorial quality",
};

const STYLE_NEGATIVE = [
  "AI artifacts",
  "distorted anatomy",
  "extra fingers",
  "extra limbs",
  "blurry face",
  "watermark",
  "text overlay",
  "logo",
  "generic stock photo",
  "oversaturated",
  "cartoonish",
  "anime style",
  "HBO",
  "Netflix",
  "Disney",
  "Marvel",
];

export interface PromptContext {
  story?: {
    title?: string;
    description?: string;
    short_description?: string;
    author?: string;
  };
  chapter?: {
    title?: string;
    content?: string;
  };
  scene?: {
    title?: string;
    description?: string;
    mood?: string;
    location_name?: string;
    characters_in_scene?: string;
    camera_direction?: string;
    lighting_direction?: string;
  };
  characters?: Array<{
    name?: string;
    age?: string;
    appearance?: string;
    personality?: string;
    clothing?: string;
    visual_prompt?: string;
  }>;
  location?: {
    name?: string;
    description?: string;
    visual_prompt?: string;
  };
  style?: Partial<TaleonStyle>;
  assetType?: string;
}

export function buildTaleonVisualPrompt(ctx: PromptContext): string {
  const parts: string[] = [];

  // Style prefix
  const style = { ...DEFAULT_TALEON_STYLE, ...ctx.style };
  const styleParts = Object.entries(style)
    .filter(([, v]) => v)
    .map(([k]) => STYLE_PREFIX_PARTS[k as keyof TaleonStyle])
    .filter(Boolean);
  if (styleParts.length > 0) {
    parts.push(styleParts.join(", "));
  }

  // Location
  if (ctx.location) {
    const locParts: string[] = [];
    if (ctx.location.name) locParts.push(ctx.location.name);
    if (ctx.location.visual_prompt) locParts.push(ctx.location.visual_prompt);
    else if (ctx.location.description) locParts.push(ctx.location.description);
    if (locParts.length > 0) parts.push(locParts.join(": "));
  }

  // Scene
  if (ctx.scene) {
    if (ctx.scene.description) parts.push(ctx.scene.description);
    if (ctx.scene.mood) parts.push(`mood: ${ctx.scene.mood}`);
    if (ctx.scene.location_name && !ctx.location)
      parts.push(`location: ${ctx.scene.location_name}`);
    if (ctx.scene.camera_direction) parts.push(`camera: ${ctx.scene.camera_direction}`);
    if (ctx.scene.lighting_direction) parts.push(`lighting: ${ctx.scene.lighting_direction}`);
  }

  // Characters
  if (ctx.characters && ctx.characters.length > 0) {
    for (const char of ctx.characters) {
      const charParts: string[] = [];
      if (char.name) charParts.push(char.name);
      if (char.visual_prompt) charParts.push(char.visual_prompt);
      else {
        if (char.age) charParts.push(char.age);
        if (char.appearance) charParts.push(char.appearance);
        if (char.clothing) charParts.push(`wearing ${char.clothing}`);
      }
      if (charParts.length > 0) parts.push(charParts.join(", "));
    }
  } else if (ctx.scene?.characters_in_scene) {
    parts.push(ctx.scene.characters_in_scene);
  }

  // Story context for mood/genre
  if (ctx.story) {
    if (ctx.story.description && !ctx.scene) {
      parts.push(ctx.story.description.slice(0, 200));
    }
  }

  // Asset-type specific additions
  if (ctx.assetType === "cover" || ctx.assetType === "story_cover") {
    parts.push("book cover composition, title-safe area, dramatic focal point");
  } else if (ctx.assetType === "banner" || ctx.assetType === "story_cinematic") {
    parts.push("wide cinematic framing, dramatic panorama");
  } else if (ctx.assetType === "poster") {
    parts.push("movie poster composition, striking visual hierarchy");
  } else if (ctx.assetType === "social_vertical") {
    parts.push("vertical composition, 9:16 aspect ratio, mobile-optimized");
  } else if (ctx.assetType === "youtube_thumbnail") {
    parts.push("YouTube thumbnail composition, bold readable focal point, 16:9");
  }

  return parts.join(". ") + ".";
}

export function buildTaleonNegativePrompt(additionalNegatives?: string[]): string {
  const negatives = [...STYLE_NEGATIVE];
  if (additionalNegatives) negatives.push(...additionalNegatives);
  return negatives.join(", ");
}

export function buildScenePrompt(scene: PromptContext["scene"]): string {
  const parts: string[] = [];
  if (scene?.title) parts.push(`Scene: ${scene.title}`);
  if (scene?.description) parts.push(scene.description);
  if (scene?.mood) parts.push(`Mood: ${scene.mood}`);
  if (scene?.location_name) parts.push(`Location: ${scene.location_name}`);
  if (scene?.characters_in_scene) parts.push(`Characters: ${scene.characters_in_scene}`);
  if (scene?.camera_direction) parts.push(`Camera: ${scene.camera_direction}`);
  if (scene?.lighting_direction) parts.push(`Lighting: ${scene.lighting_direction}`);
  return parts.join("\n");
}

export function buildCharacterPrompt(char: any): string {
  const parts: string[] = [];
  if (char?.name) parts.push(`Character: ${char.name}`);
  if (char?.age) parts.push(`Age: ${char.age}`);
  if (char?.appearance) parts.push(`Appearance: ${char.appearance}`);
  if (char?.personality) parts.push(`Personality: ${char.personality}`);
  if (char?.clothing) parts.push(`Clothing: ${char.clothing}`);
  if (char?.visual_prompt) parts.push(`Visual prompt: ${char.visual_prompt}`);
  return parts.join("\n");
}

export function buildCoverPrompt(ctx: PromptContext): string {
  return buildTaleonVisualPrompt({ ...ctx, assetType: "cover" });
}

export function buildSocialPrompt(ctx: PromptContext, platform: string): string {
  const assetType =
    platform === "youtube"
      ? "youtube_thumbnail"
      : platform === "tiktok"
        ? "social_vertical"
        : "social_square";
  return buildTaleonVisualPrompt({ ...ctx, assetType });
}

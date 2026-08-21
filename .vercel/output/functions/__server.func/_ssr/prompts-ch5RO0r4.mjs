import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { L as Copy } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prompts-ch5RO0r4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_TALEON_STYLE = {
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
	editorial_quality: true
};
var STYLE_PREFIX_PARTS = {
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
	editorial_quality: "editorial quality"
};
var STYLE_NEGATIVE = [
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
	"Marvel"
];
function buildTaleonVisualPrompt(ctx) {
	const parts = [];
	const style = {
		...DEFAULT_TALEON_STYLE,
		...ctx.style
	};
	const styleParts = Object.entries(style).filter(([, v]) => v).map(([k]) => STYLE_PREFIX_PARTS[k]).filter(Boolean);
	if (styleParts.length > 0) parts.push(styleParts.join(", "));
	if (ctx.location) {
		const locParts = [];
		if (ctx.location.name) locParts.push(ctx.location.name);
		if (ctx.location.visual_prompt) locParts.push(ctx.location.visual_prompt);
		else if (ctx.location.description) locParts.push(ctx.location.description);
		if (locParts.length > 0) parts.push(locParts.join(": "));
	}
	if (ctx.scene) {
		if (ctx.scene.description) parts.push(ctx.scene.description);
		if (ctx.scene.mood) parts.push(`mood: ${ctx.scene.mood}`);
		if (ctx.scene.location_name && !ctx.location) parts.push(`location: ${ctx.scene.location_name}`);
		if (ctx.scene.camera_direction) parts.push(`camera: ${ctx.scene.camera_direction}`);
		if (ctx.scene.lighting_direction) parts.push(`lighting: ${ctx.scene.lighting_direction}`);
	}
	if (ctx.characters && ctx.characters.length > 0) for (const char of ctx.characters) {
		const charParts = [];
		if (char.name) charParts.push(char.name);
		if (char.visual_prompt) charParts.push(char.visual_prompt);
		else {
			if (char.age) charParts.push(char.age);
			if (char.appearance) charParts.push(char.appearance);
			if (char.clothing) charParts.push(`wearing ${char.clothing}`);
		}
		if (charParts.length > 0) parts.push(charParts.join(", "));
	}
	else if (ctx.scene?.characters_in_scene) parts.push(ctx.scene.characters_in_scene);
	if (ctx.story) {
		if (ctx.story.description && !ctx.scene) parts.push(ctx.story.description.slice(0, 200));
	}
	if (ctx.assetType === "cover" || ctx.assetType === "story_cover") parts.push("book cover composition, title-safe area, dramatic focal point");
	else if (ctx.assetType === "banner" || ctx.assetType === "story_cinematic") parts.push("wide cinematic framing, dramatic panorama");
	else if (ctx.assetType === "poster") parts.push("movie poster composition, striking visual hierarchy");
	else if (ctx.assetType === "social_vertical") parts.push("vertical composition, 9:16 aspect ratio, mobile-optimized");
	else if (ctx.assetType === "youtube_thumbnail") parts.push("YouTube thumbnail composition, bold readable focal point, 16:9");
	return parts.join(". ") + ".";
}
function buildTaleonNegativePrompt(additionalNegatives) {
	const negatives = [...STYLE_NEGATIVE];
	if (additionalNegatives) negatives.push(...additionalNegatives);
	return negatives.join(", ");
}
function buildCharacterPrompt(char) {
	const parts = [];
	if (char?.name) parts.push(`Character: ${char.name}`);
	if (char?.age) parts.push(`Age: ${char.age}`);
	if (char?.appearance) parts.push(`Appearance: ${char.appearance}`);
	if (char?.personality) parts.push(`Personality: ${char.personality}`);
	if (char?.clothing) parts.push(`Clothing: ${char.clothing}`);
	if (char?.visual_prompt) parts.push(`Visual prompt: ${char.visual_prompt}`);
	return parts.join("\n");
}
function buildCoverPrompt(ctx) {
	return buildTaleonVisualPrompt({
		...ctx,
		assetType: "cover"
	});
}
function buildSocialPrompt(ctx, platform) {
	const assetType = platform === "youtube" ? "youtube_thumbnail" : platform === "tiktok" ? "social_vertical" : "social_square";
	return buildTaleonVisualPrompt({
		...ctx,
		assetType
	});
}
function AdminPromptsPage() {
	const { isAdmin, loading } = useSession();
	const [activeTab, setActiveTab] = (0, import_react.useState)("scene");
	const [storyTitle, setStoryTitle] = (0, import_react.useState)("The Last Signal");
	const [storyDesc, setStoryDesc] = (0, import_react.useState)("In Nairobi, 2047, every phone in the city receives the same message at exactly 2:17 AM.");
	const [chapterTitle, setChapterTitle] = (0, import_react.useState)("2:17 AM");
	const [sceneTitle, setSceneTitle] = (0, import_react.useState)("The Message");
	const [sceneDesc, setSceneDesc] = (0, import_react.useState)("Every screen in the apartment goes white. The message appears on all devices simultaneously.");
	const [sceneMood, setSceneMood] = (0, import_react.useState)("tense, atmospheric, urgent");
	const [sceneLocation, setSceneLocation] = (0, import_react.useState)("Nairobi apartment");
	const [sceneCharacters, setSceneCharacters] = (0, import_react.useState)("Amara Otieno");
	const [sceneCamera, setSceneCamera] = (0, import_react.useState)("wide shot, close-up on phone screen");
	const [sceneLighting, setSceneLighting] = (0, import_react.useState)("neon glow, screen light, low-key");
	const [charName, setCharName] = (0, import_react.useState)("Amara Otieno");
	const [charAge, setCharAge] = (0, import_react.useState)("21-year-old Kenyan");
	const [charAppearance, setCharAppearance] = (0, import_react.useState)("short natural hair, brown eyes, medium build, focused expression");
	const [charClothing, setCharClothing] = (0, import_react.useState)("oversized hoodie, cargo pants");
	const [socialPlatform, setSocialPlatform] = (0, import_react.useState)("youtube");
	const [styleOverrides, setStyleOverrides] = (0, import_react.useState)({});
	const ctx = {
		story: {
			title: storyTitle,
			description: storyDesc
		},
		chapter: { title: chapterTitle },
		scene: {
			title: sceneTitle,
			description: sceneDesc,
			mood: sceneMood,
			location_name: sceneLocation,
			characters_in_scene: sceneCharacters,
			camera_direction: sceneCamera,
			lighting_direction: sceneLighting
		},
		characters: [{
			name: charName,
			age: charAge,
			appearance: charAppearance,
			clothing: charClothing
		}],
		style: styleOverrides
	};
	const scenePrompt = buildTaleonVisualPrompt(ctx);
	const negPrompt = buildTaleonNegativePrompt();
	const coverPrompt = buildCoverPrompt(ctx);
	const socialPrompt = buildSocialPrompt(ctx, socialPlatform);
	function copyText(text) {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Admins only" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin",
		title: "Prompt Library",
		lede: "Taleon visual prompt builder and style system."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					{
						key: "scene",
						label: "Scene Prompt"
					},
					{
						key: "character",
						label: "Character Prompt"
					},
					{
						key: "cover",
						label: "Cover Prompt"
					},
					{
						key: "social",
						label: "Social Prompt"
					},
					{
						key: "style",
						label: "Taleon Style"
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab(t.key),
					className: `rounded-md px-4 py-2 text-sm transition-colors ${activeTab === t.key ? "bg-gold text-gold-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`,
					children: t.label
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Story Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: storyTitle,
						onChange: (e) => setStoryTitle(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Chapter Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: chapterTitle,
						onChange: (e) => setChapterTitle(e.target.value)
					})]
				})]
			}),
			activeTab === "scene" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Scene Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sceneTitle,
								onChange: (e) => setSceneTitle(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Mood"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sceneMood,
								onChange: (e) => setSceneMood(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Location"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sceneLocation,
								onChange: (e) => setSceneLocation(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Characters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sceneCharacters,
								onChange: (e) => setSceneCharacters(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Camera"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sceneCamera,
								onChange: (e) => setSceneCamera(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Lighting"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sceneLighting,
								onChange: (e) => setSceneLighting(e.target.value)
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Scene Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: sceneDesc,
						onChange: (e) => setSceneDesc(e.target.value),
						rows: 2
					})]
				})]
			}),
			activeTab === "character" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: charName,
								onChange: (e) => setCharName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Age/Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: charAge,
								onChange: (e) => setCharAge(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Appearance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: charAppearance,
								onChange: (e) => setCharAppearance(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Clothing"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: charClothing,
								onChange: (e) => setCharClothing(e.target.value)
							})]
						})
					]
				})
			}),
			activeTab === "social" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Platform"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: socialPlatform,
						onChange: (e) => setSocialPlatform(e.target.value),
						className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "youtube",
								children: "YouTube Thumbnail"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "tiktok",
								children: "TikTok (9:16)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "instagram",
								children: "Instagram (1:1)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "facebook",
								children: "Facebook"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					activeTab === "scene" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptCard, {
						title: "Scene Visual Prompt",
						prompt: scenePrompt,
						onCopy: () => copyText(scenePrompt)
					}),
					activeTab === "character" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptCard, {
						title: "Character Visual Prompt",
						prompt: buildCharacterPrompt({
							name: charName,
							age: charAge,
							appearance: charAppearance,
							clothing: charClothing
						}),
						onCopy: () => copyText(buildCharacterPrompt({
							name: charName,
							age: charAge,
							appearance: charAppearance,
							clothing: charClothing
						}))
					}),
					activeTab === "cover" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptCard, {
						title: "Cover Visual Prompt",
						prompt: coverPrompt,
						onCopy: () => copyText(coverPrompt)
					}),
					activeTab === "social" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptCard, {
						title: `${socialPlatform} Prompt`,
						prompt: socialPrompt,
						onCopy: () => copyText(socialPrompt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptCard, {
						title: "Negative Prompt",
						prompt: negPrompt,
						onCopy: () => copyText(negPrompt)
					})
				]
			}),
			activeTab === "style" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Toggle Taleon style attributes for prompt generation:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: Object.keys(DEFAULT_TALEON_STYLE).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: styleOverrides[key] !== false,
							onChange: (e) => setStyleOverrides((prev) => ({
								...prev,
								[key]: e.target.checked
							})),
							className: "accent-gold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize",
							children: key.replace(/_/g, " ")
						})]
					}, key))
				})]
			})
		]
	})] });
}
function PromptCard({ title, prompt, onCopy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface-2 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onCopy,
				className: "gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Copy"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground whitespace-pre-wrap",
			children: prompt
		})]
	});
}
//#endregion
export { AdminPromptsPage as component };

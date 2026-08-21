import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  buildTaleonVisualPrompt,
  buildTaleonNegativePrompt,
  buildScenePrompt,
  buildCharacterPrompt,
  buildCoverPrompt,
  buildSocialPrompt,
  DEFAULT_TALEON_STYLE,
  type TaleonStyle,
  type PromptContext,
} from "@/lib/prompts";

export const Route = createFileRoute("/_authenticated/admin/prompts")({
  head: () => ({
    meta: [{ title: "Prompt Library | Taleon Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPromptsPage,
});

function AdminPromptsPage() {
  const { isAdmin, loading } = useSession();
  const [activeTab, setActiveTab] = useState<"scene" | "character" | "cover" | "social" | "style">(
    "scene",
  );

  // Shared context
  const [storyTitle, setStoryTitle] = useState("The Last Signal");
  const [storyDesc, setStoryDesc] = useState(
    "In Nairobi, 2047, every phone in the city receives the same message at exactly 2:17 AM.",
  );
  const [chapterTitle, setChapterTitle] = useState("2:17 AM");
  const [sceneTitle, setSceneTitle] = useState("The Message");
  const [sceneDesc, setSceneDesc] = useState(
    "Every screen in the apartment goes white. The message appears on all devices simultaneously.",
  );
  const [sceneMood, setSceneMood] = useState("tense, atmospheric, urgent");
  const [sceneLocation, setSceneLocation] = useState("Nairobi apartment");
  const [sceneCharacters, setSceneCharacters] = useState("Amara Otieno");
  const [sceneCamera, setSceneCamera] = useState("wide shot, close-up on phone screen");
  const [sceneLighting, setSceneLighting] = useState("neon glow, screen light, low-key");

  // Character
  const [charName, setCharName] = useState("Amara Otieno");
  const [charAge, setCharAge] = useState("21-year-old Kenyan");
  const [charAppearance, setCharAppearance] = useState(
    "short natural hair, brown eyes, medium build, focused expression",
  );
  const [charClothing, setCharClothing] = useState("oversized hoodie, cargo pants");

  // Social
  const [socialPlatform, setSocialPlatform] = useState("youtube");

  // Style overrides
  const [styleOverrides, setStyleOverrides] = useState<Partial<TaleonStyle>>({});

  const ctx: PromptContext = {
    story: { title: storyTitle, description: storyDesc },
    chapter: { title: chapterTitle },
    scene: {
      title: sceneTitle,
      description: sceneDesc,
      mood: sceneMood,
      location_name: sceneLocation,
      characters_in_scene: sceneCharacters,
      camera_direction: sceneCamera,
      lighting_direction: sceneLighting,
    },
    characters: [
      { name: charName, age: charAge, appearance: charAppearance, clothing: charClothing },
    ],
    style: styleOverrides,
  };

  const scenePrompt = buildTaleonVisualPrompt(ctx);
  const negPrompt = buildTaleonNegativePrompt();
  const coverPrompt = buildCoverPrompt(ctx);
  const socialPrompt = buildSocialPrompt(ctx, socialPlatform);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">Loading…</div>
    );
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <EmptyState title="Admins only" />
      </div>
    );

  const tabs = [
    { key: "scene" as const, label: "Scene Prompt" },
    { key: "character" as const, label: "Character Prompt" },
    { key: "cover" as const, label: "Cover Prompt" },
    { key: "social" as const, label: "Social Prompt" },
    { key: "style" as const, label: "Taleon Style" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Prompt Library"
        lede="Taleon visual prompt builder and style system."
      />
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-20 sm:px-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`rounded-md px-4 py-2 text-sm transition-colors ${activeTab === t.key ? "bg-gold text-gold-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Context inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Story Title</label>
            <Input value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Chapter Title</label>
            <Input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} />
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "scene" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Scene Title</label>
                <Input value={sceneTitle} onChange={(e) => setSceneTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Mood</label>
                <Input value={sceneMood} onChange={(e) => setSceneMood(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Location</label>
                <Input value={sceneLocation} onChange={(e) => setSceneLocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Characters</label>
                <Input
                  value={sceneCharacters}
                  onChange={(e) => setSceneCharacters(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Camera</label>
                <Input value={sceneCamera} onChange={(e) => setSceneCamera(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Lighting</label>
                <Input value={sceneLighting} onChange={(e) => setSceneLighting(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Scene Description</label>
              <Textarea value={sceneDesc} onChange={(e) => setSceneDesc(e.target.value)} rows={2} />
            </div>
          </div>
        )}

        {activeTab === "character" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Name</label>
                <Input value={charName} onChange={(e) => setCharName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Age/Description</label>
                <Input value={charAge} onChange={(e) => setCharAge(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Appearance</label>
                <Input value={charAppearance} onChange={(e) => setCharAppearance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Clothing</label>
                <Input value={charClothing} onChange={(e) => setCharClothing(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Platform</label>
              <select
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
              >
                <option value="youtube">YouTube Thumbnail</option>
                <option value="tiktok">TikTok (9:16)</option>
                <option value="instagram">Instagram (1:1)</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>
        )}

        {/* Generated prompts */}
        <div className="space-y-4">
          {activeTab === "scene" && (
            <PromptCard
              title="Scene Visual Prompt"
              prompt={scenePrompt}
              onCopy={() => copyText(scenePrompt)}
            />
          )}
          {activeTab === "character" && (
            <PromptCard
              title="Character Visual Prompt"
              prompt={buildCharacterPrompt({
                name: charName,
                age: charAge,
                appearance: charAppearance,
                clothing: charClothing,
              })}
              onCopy={() =>
                copyText(
                  buildCharacterPrompt({
                    name: charName,
                    age: charAge,
                    appearance: charAppearance,
                    clothing: charClothing,
                  }),
                )
              }
            />
          )}
          {activeTab === "cover" && (
            <PromptCard
              title="Cover Visual Prompt"
              prompt={coverPrompt}
              onCopy={() => copyText(coverPrompt)}
            />
          )}
          {activeTab === "social" && (
            <PromptCard
              title={`${socialPlatform} Prompt`}
              prompt={socialPrompt}
              onCopy={() => copyText(socialPrompt)}
            />
          )}
          <PromptCard
            title="Negative Prompt"
            prompt={negPrompt}
            onCopy={() => copyText(negPrompt)}
          />
        </div>

        {/* Style overrides */}
        {activeTab === "style" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Toggle Taleon style attributes for prompt generation:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(DEFAULT_TALEON_STYLE) as (keyof TaleonStyle)[]).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={styleOverrides[key] !== false}
                    onChange={(e) =>
                      setStyleOverrides((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                    className="accent-gold"
                  />
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function PromptCard({
  title,
  prompt,
  onCopy,
}: {
  title: string;
  prompt: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button variant="outline" size="sm" onClick={onCopy} className="gap-1">
          <Copy className="h-3 w-3" /> Copy
        </Button>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{prompt}</p>
    </div>
  );
}

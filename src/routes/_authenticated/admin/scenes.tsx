import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Film } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/scenes")({
  head: () => ({ meta: [{ title: "Scenes | Taleon Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminScenesPage,
});

interface Scene {
  id: string;
  chapter_id: string;
  scene_number: number;
  title: string;
  description: string | null;
  mood: string | null;
  location_name: string | null;
  characters_in_scene: string | null;
  visual_prompt: string | null;
  camera_direction: string | null;
  lighting_direction: string | null;
  status: string;
  chapters?: { title: string; chapter_number: number; stories?: { title: string; slug: string } };
}

function AdminScenesPage() {
  const { isAdmin, loading } = useSession();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Scene | null>(null);
  const [saving, setSaving] = useState(false);

  const [formChapterId, setFormChapterId] = useState("");
  const [formNumber, setFormNumber] = useState(1);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formMood, setFormMood] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCharacters, setFormCharacters] = useState("");
  const [formVisualPrompt, setFormVisualPrompt] = useState("");
  const [formCamera, setFormCamera] = useState("");
  const [formLighting, setFormLighting] = useState("");

  useEffect(() => { if (isAdmin) { fetchScenes(); fetchChapters(); } }, [isAdmin]);

  async function fetchScenes() {
    setLoadingData(true);
    const { data } = await supabase
      .from("scenes")
      .select("*, chapters(title, chapter_number, stories(title, slug))")
      .order("created_at", { ascending: false });
    setScenes(data ?? []);
    setLoadingData(false);
  }

  async function fetchChapters() {
    const { data } = await supabase
      .from("chapters")
      .select("id, title, chapter_number, stories(title, slug)")
      .order("chapter_number");
    setChapters(data ?? []);
  }

  function openCreate() {
    setEditing(null);
    setFormChapterId(chapters[0]?.id || "");
    setFormNumber(1);
    setFormTitle("");
    setFormDesc("");
    setFormMood("");
    setFormLocation("");
    setFormCharacters("");
    setFormVisualPrompt("");
    setFormCamera("");
    setFormLighting("");
    setDialogOpen(true);
  }

  function openEdit(s: Scene) {
    setEditing(s);
    setFormChapterId(s.chapter_id);
    setFormNumber(s.scene_number);
    setFormTitle(s.title);
    setFormDesc(s.description || "");
    setFormMood(s.mood || "");
    setFormLocation(s.location_name || "");
    setFormCharacters(s.characters_in_scene || "");
    setFormVisualPrompt(s.visual_prompt || "");
    setFormCamera(s.camera_direction || "");
    setFormLighting(s.lighting_direction || "");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formTitle.trim() || !formChapterId) { toast.error("Title and chapter required"); return; }
    setSaving(true);
    const data = {
      chapter_id: formChapterId,
      scene_number: formNumber,
      title: formTitle,
      description: formDesc || null,
      mood: formMood || null,
      location_name: formLocation || null,
      characters_in_scene: formCharacters || null,
      visual_prompt: formVisualPrompt || null,
      camera_direction: formCamera || null,
      lighting_direction: formLighting || null,
    };
    if (editing) {
      const { error } = await supabase.from("scenes").update(data).eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Scene updated");
    } else {
      const { error } = await supabase.from("scenes").insert(data);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Scene created");
    }
    setDialogOpen(false); setSaving(false); fetchScenes();
  }

  async function deleteScene(id: string) {
    if (!confirm("Delete this scene?")) return;
    await supabase.from("scenes").delete().eq("id", id);
    toast.success("Scene deleted"); fetchScenes();
  }

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) return <div className="mx-auto max-w-7xl px-4 py-24"><EmptyState title="Admins only" body="Restricted area." /></div>;

  return (
    <>
      <PageHeader eyebrow="Admin" title="Scenes" lede="Manage chapter scenes for visual production." />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="flex justify-end"><Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> New Scene</Button></div>
        {loadingData ? <div className="text-center py-8 text-muted-foreground">Loading...</div>
        : scenes.length === 0 ? <EmptyState title="No scenes" body="Create scenes to organize visual assets per chapter." />
        : (
          <div className="space-y-2">
            {scenes.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Film className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">Scene {s.scene_number}: {s.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.chapters?.stories?.title} → Ch. {s.chapters?.chapter_number}: {s.chapters?.title}
                      {s.mood && ` • ${s.mood}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(s)} className="p-1 text-muted-foreground hover:text-gold"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteScene(s.id)} className="p-1 text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Scene" : "Create Scene"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chapter *</label>
                  <select value={formChapterId} onChange={(e) => setFormChapterId(e.target.value)} className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm">
                    {chapters.map((c) => <option key={c.id} value={c.id}>Ch. {c.chapter_number}: {c.title} ({c.stories?.title})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scene Number *</label>
                  <Input type="number" value={formNumber} onChange={(e) => setFormNumber(parseInt(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Nairobi at 2:17 AM" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Mood</label><Input value={formMood} onChange={(e) => setFormMood(e.target.value)} placeholder="e.g. tense, atmospheric" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Location</label><Input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g. Nairobi" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Characters in Scene</label><Input value={formCharacters} onChange={(e) => setFormCharacters(e.target.value)} placeholder="e.g. Amara, Detective Barasa" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Visual Prompt</label><Textarea value={formVisualPrompt} onChange={(e) => setFormVisualPrompt(e.target.value)} rows={3} placeholder="Scene visual description for image generation" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Camera Direction</label><Input value={formCamera} onChange={(e) => setFormCamera(e.target.value)} placeholder="e.g. wide shot, close-up" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Lighting Direction</label><Input value={formLighting} onChange={(e) => setFormLighting(e.target.value)} placeholder="e.g. low-key, neon" /></div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
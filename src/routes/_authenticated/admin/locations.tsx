import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminLocations, useAdminStoriesDropdown } from "@/hooks/use-admin-data";
import { invalidateStoryData } from "@/lib/query-keys";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/locations")({
  head: () => ({ meta: [{ title: "Locations | Taleon Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminLocationsPage,
});

interface Location {
  id: string; story_id: string; name: string; description: string | null;
  visual_prompt: string | null; reference_image_url: string | null; notes: string | null;
  stories?: { title: string; slug: string };
}

function AdminLocationsPage() {
  const { isAdmin, loading } = useSession();
  const qc = useQueryClient();
  const { query: locationsQuery, invalidate } = useAdminLocations();
  const { data: stories = [] } = useAdminStoriesDropdown();
  const locations = (locationsQuery.data ?? []) as Location[];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);

  const [fStory, setFStory] = useState(""); const [fName, setFName] = useState("");
  const [fDesc, setFDesc] = useState(""); const [fVisualPrompt, setFVisualPrompt] = useState("");
  const [fRefImage, setFRefImage] = useState(""); const [fNotes, setFNotes] = useState("");

  function openCreate() {
    setEditing(null); setFStory(stories[0]?.id || ""); setFName(""); setFDesc(""); setFVisualPrompt(""); setFRefImage(""); setFNotes(""); setDialogOpen(true);
  }
  function openEdit(loc: Location) {
    setEditing(loc); setFStory(loc.story_id); setFName(loc.name); setFDesc(loc.description || "");
    setFVisualPrompt(loc.visual_prompt || ""); setFRefImage(loc.reference_image_url || ""); setFNotes(loc.notes || ""); setDialogOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (editing) {
        const { error } = await supabase.from("locations").update(data as any).eq("id", editing.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("locations").insert(data as any);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Location updated" : "Location created");
      setDialogOpen(false);
      invalidate();
      invalidateStoryData(qc);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Location deleted");
      invalidate();
      invalidateStoryData(qc);
    },
  });

  function handleSave() {
    if (!fName.trim() || !fStory) { toast.error("Name and story required"); return; }
    saveMutation.mutate({ story_id: fStory, name: fName, description: fDesc || null, visual_prompt: fVisualPrompt || null, reference_image_url: fRefImage || null, notes: fNotes || null });
  }

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) return <div className="mx-auto max-w-7xl px-4 py-24"><EmptyState title="Admins only" /></div>;

  return (
    <>
      <PageHeader eyebrow="Admin" title="Location Bible" lede="Reusable environments for visual consistency." />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="flex justify-end"><Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> New Location</Button></div>
        {locationsQuery.isLoading ? <div className="text-center py-8 text-muted-foreground">Loading...</div>
        : locations.length === 0 ? <EmptyState title="No locations" body="Create location profiles for consistent scene environments." />
        : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <div key={loc.id} className="rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /><p className="font-medium">{loc.name}</p></div>
                    <p className="mt-1 text-xs text-muted-foreground">{loc.stories?.title}</p>
                    {loc.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{loc.description}</p>}
                    {loc.visual_prompt && <p className="mt-1 text-xs text-gold/70 line-clamp-2 italic">Prompt: {loc.visual_prompt}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(loc)} className="p-1 text-muted-foreground hover:text-gold"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm("Delete this location?")) deleteMutation.mutate(loc.id); }} className="p-1 text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Location" : "Create Location"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><label className="text-sm font-medium">Story *</label>
                <select value={fStory} onChange={(e) => setFStory(e.target.value)} className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm">
                  {(stories as any[]).map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select></div>
              <div className="space-y-2"><label className="text-sm font-medium">Name *</label><Input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="e.g. Nairobi — 2047" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label><Textarea value={fDesc} onChange={(e) => setFDesc(e.target.value)} rows={2} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Visual Prompt</label><Textarea value={fVisualPrompt} onChange={(e) => setFVisualPrompt(e.target.value)} rows={2} placeholder="Environment visual description" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Reference Image URL</label><Input value={fRefImage} onChange={(e) => setFRefImage(e.target.value)} placeholder="https://..." /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Notes</label><Textarea value={fNotes} onChange={(e) => setFNotes(e.target.value)} rows={2} /></div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

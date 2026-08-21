import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminCharacters, useAdminStoriesDropdown } from "@/hooks/use-admin-data";
import { invalidateStoryData } from "@/lib/query-keys";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/characters")({
  head: () => ({
    meta: [{ title: "Character Bible | Taleon Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminCharactersPage,
});

interface Character {
  id: string;
  story_id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  age: string | null;
  appearance: string | null;
  personality: string | null;
  clothing: string | null;
  visual_prompt: string | null;
  reference_image_url: string | null;
  notes: string | null;
  sort_order: number;
  stories?: { title: string; slug: string };
}

function AdminCharactersPage() {
  const { isAdmin, loading } = useSession();
  const qc = useQueryClient();
  const { query: charactersQuery, invalidate } = useAdminCharacters();
  const { data: stories = [] } = useAdminStoriesDropdown();
  const characters = (charactersQuery.data ?? []) as Character[];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Character | null>(null);

  const [fStory, setFStory] = useState("");
  const [fName, setFName] = useState("");
  const [fRole, setFRole] = useState("");
  const [fBio, setFBio] = useState("");
  const [fAge, setFAge] = useState("");
  const [fAppearance, setFAppearance] = useState("");
  const [fPersonality, setFPersonality] = useState("");
  const [fClothing, setFClothing] = useState("");
  const [fVisualPrompt, setFVisualPrompt] = useState("");
  const [fRefImage, setFRefImage] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [fOrder, setFOrder] = useState(0);

  function openCreate() {
    setEditing(null);
    setFStory(stories[0]?.id || "");
    setFName("");
    setFRole("");
    setFBio("");
    setFAge("");
    setFAppearance("");
    setFPersonality("");
    setFClothing("");
    setFVisualPrompt("");
    setFRefImage("");
    setFNotes("");
    setFOrder(characters.length);
    setDialogOpen(true);
  }
  function openEdit(c: Character) {
    setEditing(c);
    setFStory(c.story_id);
    setFName(c.name);
    setFRole(c.role || "");
    setFBio(c.bio || "");
    setFAge(c.age || "");
    setFAppearance(c.appearance || "");
    setFPersonality(c.personality || "");
    setFClothing(c.clothing || "");
    setFVisualPrompt(c.visual_prompt || "");
    setFRefImage(c.reference_image_url || "");
    setFNotes(c.notes || "");
    setFOrder(c.sort_order);
    setDialogOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (editing) {
        const { error } = await supabase
          .from("characters")
          .update(data as any)
          .eq("id", editing.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("characters").insert(data as any);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Character updated" : "Character created");
      setDialogOpen(false);
      invalidate();
      invalidateStoryData(qc);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("characters").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Character deleted");
      invalidate();
      invalidateStoryData(qc);
    },
  });

  function handleSave() {
    if (!fName.trim() || !fStory) {
      toast.error("Name and story required");
      return;
    }
    saveMutation.mutate({
      story_id: fStory,
      name: fName,
      role: fRole || null,
      bio: fBio || null,
      age: fAge || null,
      appearance: fAppearance || null,
      personality: fPersonality || null,
      clothing: fClothing || null,
      visual_prompt: fVisualPrompt || null,
      reference_image_url: fRefImage || null,
      notes: fNotes || null,
      sort_order: fOrder,
    });
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

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Character Bible"
        lede="Visual consistency guides for every character."
      />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="flex justify-end">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New Character
          </Button>
        </div>
        {charactersQuery.isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : characters.length === 0 ? (
          <EmptyState
            title="No characters"
            body="Create character profiles for visual consistency."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {c.image_url || c.reference_image_url ? (
                        <img
                          src={c.image_url || c.reference_image_url!}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-1 text-xs text-muted-foreground">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{c.name}</p>
                        {c.role && <p className="text-xs text-muted-foreground">{c.role}</p>}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.stories?.title}</p>
                    {c.appearance && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {c.appearance}
                      </p>
                    )}
                    {c.visual_prompt && (
                      <p className="mt-1 text-xs text-gold/70 line-clamp-2 italic">
                        Prompt: {c.visual_prompt}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1 text-muted-foreground hover:text-gold"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this character?")) deleteMutation.mutate(c.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Character" : "Create Character"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Story *</label>
                  <select
                    value={fStory}
                    onChange={(e) => setFStory(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                  >
                    {(stories as any[]).map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input value={fName} onChange={(e) => setFName(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={fRole}
                    onChange={(e) => setFRole(e.target.value)}
                    placeholder="Protagonist, Antagonist..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <Input value={fAge} onChange={(e) => setFAge(e.target.value)} placeholder="21" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea value={fBio} onChange={(e) => setFBio(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Appearance</label>
                <Textarea
                  value={fAppearance}
                  onChange={(e) => setFAppearance(e.target.value)}
                  rows={2}
                  placeholder="Short natural hair, brown eyes, medium build..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Personality</label>
                  <Input value={fPersonality} onChange={(e) => setFPersonality(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clothing</label>
                  <Input value={fClothing} onChange={(e) => setFClothing(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Visual Prompt</label>
                <Textarea
                  value={fVisualPrompt}
                  onChange={(e) => setFVisualPrompt(e.target.value)}
                  rows={2}
                  placeholder="Description for consistent image generation"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reference Image URL</label>
                <Input
                  value={fRefImage}
                  onChange={(e) => setFRefImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea value={fNotes} onChange={(e) => setFNotes(e.target.value)} rows={2} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

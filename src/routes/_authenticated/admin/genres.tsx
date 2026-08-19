import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminGenres } from "@/hooks/use-admin-data";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/genres")({
  head: () => ({
    meta: [
      { title: "Manage Genres | Taleon Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminGenresPage,
});

interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accent: string;
  sort_order: number;
  story_count?: number;
}

function AdminGenresPage() {
  const { isAdmin, loading } = useSession();
  const { query, invalidate } = useAdminGenres();
  const genres = query.data ?? [];
  const loadingData = query.isLoading;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAccent, setFormAccent] = useState("#7C3AED");
  const [formSortOrder, setFormSortOrder] = useState(0);

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function openCreate() {
    setEditingGenre(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormAccent("#7C3AED");
    setFormSortOrder(genres.length);
    setDialogOpen(true);
  }

  function openEdit(genre: Genre) {
    setEditingGenre(genre);
    setFormName(genre.name);
    setFormSlug(genre.slug);
    setFormDescription(genre.description || "");
    setFormAccent(genre.accent);
    setFormSortOrder(genre.sort_order);
    setDialogOpen(true);
  }

  const createMutation = useMutation({
    mutationFn: async (genreData: { name: string; slug: string; description: string | null; accent: string; sort_order: number }) => {
      const { error } = await supabase.from("genres").insert(genreData);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Genre created");
      setDialogOpen(false);
      await invalidate();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...genreData }: { id: string; name: string; slug: string; description: string | null; accent: string; sort_order: number }) => {
      const { error } = await supabase.from("genres").update(genreData).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Genre updated");
      setDialogOpen(false);
      await invalidate();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("story_genres").delete().eq("genre_id", id);
      const { error } = await supabase.from("genres").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Genre deleted");
      await invalidate();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleSave() {
    if (!formName.trim()) {
      toast.error("Name is required");
      return;
    }
    const slug = formSlug || generateSlug(formName);
    const genreData = {
      name: formName,
      slug,
      description: formDescription || null,
      accent: formAccent,
      sort_order: formSortOrder,
    };

    if (editingGenre) {
      updateMutation.mutate({ id: editingGenre.id, ...genreData });
    } else {
      createMutation.mutate(genreData);
    }
  }

  function deleteGenre(id: string) {
    if (!confirm("Delete this genre? Stories with this genre will lose the association.")) return;
    deleteMutation.mutate(id);
  }

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground sm:px-6">Loading…</div>;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <EmptyState title="Admins only" body="This area is restricted to Taleon administrators.">
          <Link to="/account" className="rounded-md border border-border px-5 py-2.5 text-sm">Back to my library</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Manage Genres" lede="Create and organize story genres." />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="flex justify-end">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New Genre
          </Button>
        </div>

        {loadingData ? (
          <div className="text-center py-8 text-muted-foreground">Loading genres...</div>
        ) : genres.length === 0 ? (
          <EmptyState title="No genres" body="Create your first genre to get started." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {genres.map((g) => (
              <div key={g.id} className="rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: g.accent }} />
                      <h3 className="font-medium">{g.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">/{g.slug}</p>
                    {g.description && <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">{g.story_count} stories</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(g)} className="p-1 text-muted-foreground hover:text-gold">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteGenre(g.id)} className="p-1 text-muted-foreground hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGenre ? "Edit Genre" : "Create Genre"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input value={formName} onChange={(e) => { setFormName(e.target.value); if (!editingGenre) setFormSlug(generateSlug(e.target.value)); }} placeholder="Genre name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="auto-generated" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2} placeholder="Brief description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={formAccent} onChange={(e) => setFormAccent(e.target.value)} className="h-8 w-8 rounded border-0" />
                    <Input value={formAccent} onChange={(e) => setFormAccent(e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort Order</label>
                  <Input type="number" value={formSortOrder} onChange={(e) => setFormSortOrder(parseInt(e.target.value))} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : editingGenre ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

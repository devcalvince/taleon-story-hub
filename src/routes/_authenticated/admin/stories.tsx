import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, Star, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/stories")({
  head: () => ({
    meta: [
      { title: "Manage Stories | Taleon Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminStoriesPage,
});

interface Story {
  id: string;
  title: string;
  slug: string;
  status: string;
  is_premium: boolean;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  read_count: number;
  author: string;
  published_at: string | null;
  created_at: string;
  cover_url: string | null;
  short_description: string | null;
  description: string | null;
}

interface Genre {
  id: string;
  name: string;
  slug: string;
}

function AdminStoriesPage() {
  const { isAdmin, loading } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formAuthor, setFormAuthor] = useState("Taleon Studios");
  const [formDescription, setFormDescription] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formStatus, setFormStatus] = useState("ongoing");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formBannerUrl, setFormBannerUrl] = useState("");
  const [formIsPremium, setFormIsPremium] = useState(false);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsOriginal, setFormIsOriginal] = useState(true);
  const [formGenreIds, setFormGenreIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  async function fetchData() {
    setLoadingData(true);
    const [storiesRes, genresRes] = await Promise.all([
      supabase.from("stories").select("*").order("created_at", { ascending: false }),
      supabase.from("genres").select("id, name, slug").order("sort_order"),
    ]);
    setStories(storiesRes.data ?? []);
    setGenres(genresRes.data ?? []);
    setLoadingData(false);
  }

  function openCreate() {
    setEditingStory(null);
    setFormTitle("");
    setFormSlug("");
    setFormAuthor("Taleon Studios");
    setFormDescription("");
    setFormShortDesc("");
    setFormStatus("ongoing");
    setFormCoverUrl("");
    setFormBannerUrl("");
    setFormIsPremium(false);
    setFormIsFeatured(false);
    setFormIsOriginal(true);
    setFormGenreIds([]);
    setDialogOpen(true);
  }

  function openEdit(story: Story) {
    setEditingStory(story);
    setFormTitle(story.title);
    setFormSlug(story.slug);
    setFormAuthor(story.author || "Taleon Studios");
    setFormDescription(story.description || "");
    setFormShortDesc(story.short_description || "");
    setFormStatus(story.status);
    setFormCoverUrl(story.cover_url || "");
    setFormBannerUrl("");
    setFormIsPremium(story.is_premium);
    setFormIsFeatured(story.is_featured);
    setFormIsOriginal(true);
    setFormGenreIds([]);
    setDialogOpen(true);
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSave() {
    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const slug = formSlug || generateSlug(formTitle);

    const storyData = {
      title: formTitle,
      slug,
      author: formAuthor,
      description: formDescription || null,
      short_description: formShortDesc || null,
      status: formStatus as any,
      cover_url: formCoverUrl || null,
      banner_url: formBannerUrl || null,
      is_premium: formIsPremium,
      is_featured: formIsFeatured,
      is_original: formIsOriginal,
      is_published: true,
    };

    if (editingStory) {
      const { error } = await supabase.from("stories").update(storyData).eq("id", editingStory.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      // Update genres
      await supabase.from("story_genres").delete().eq("story_id", editingStory.id);
      if (formGenreIds.length) {
        await supabase.from("story_genres").insert(formGenreIds.map(gid => ({ story_id: editingStory.id, genre_id: gid })));
      }
      toast.success("Story updated");
    } else {
      const { data, error } = await supabase.from("stories").insert(storyData).select().single();
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      if (formGenreIds.length && data) {
        await supabase.from("story_genres").insert(formGenreIds.map(gid => ({ story_id: data.id, genre_id: gid })));
      }
      toast.success("Story created");
    }

    setDialogOpen(false);
    setSaving(false);
    fetchData();
  }

  async function deleteStory(id: string) {
    if (!confirm("Delete this story and all its chapters?")) return;
    await supabase.from("story_genres").delete().eq("story_id", id);
    await supabase.from("chapters").delete().eq("story_id", id);
    await supabase.from("stories").delete().eq("id", id);
    toast.success("Story deleted");
    fetchData();
  }

  async function toggleFeatured(story: Story) {
    await supabase.from("stories").update({ is_featured: !story.is_featured }).eq("id", story.id);
    fetchData();
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
      <PageHeader eyebrow="Admin" title="Manage Stories" lede="Create, edit, and publish stories." />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="flex justify-end">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New Story
          </Button>
        </div>

        {loadingData ? (
          <div className="text-center py-8 text-muted-foreground">Loading stories...</div>
        ) : stories.length === 0 ? (
          <EmptyState title="No stories" body="Create your first story to get started." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Access</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stories.map((s) => (
                  <tr key={s.id} className="bg-surface-2/40">
                    <td className="px-4 py-3 font-medium">{s.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.author}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === "ongoing" ? "default" : s.status === "completed" ? "secondary" : "outline"}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.is_premium ? "Premium" : "Free"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.view_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(s)} className={s.is_featured ? "text-gold" : "text-muted-foreground hover:text-gold"}>
                        <Star className={`h-4 w-4 ${s.is_featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.published_at ? new Date(s.published_at).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to="/story/$slug" params={{ slug: s.slug }} className="p-1 text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button onClick={() => openEdit(s)} className="p-1 text-muted-foreground hover:text-gold">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteStory(s.id)} className="p-1 text-muted-foreground hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStory ? "Edit Story" : "Create Story"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input value={formTitle} onChange={(e) => { setFormTitle(e.target.value); if (!editingStory) setFormSlug(generateSlug(e.target.value)); }} placeholder="Story title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="auto-generated" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Input value={formShortDesc} onChange={(e) => setFormShortDesc(e.target.value)} placeholder="One-line description for cards" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description</label>
                <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={4} placeholder="Full story description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Image URL</label>
                  <Input value={formCoverUrl} onChange={(e) => setFormCoverUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Banner Image URL</label>
                  <Input value={formBannerUrl} onChange={(e) => setFormBannerUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setFormGenreIds(prev => prev.includes(g.id) ? prev.filter(id => id !== g.id) : [...prev, g.id])}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        formGenreIds.includes(g.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formIsPremium} onChange={(e) => setFormIsPremium(e.target.checked)} className="rounded" />
                  Premium
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formIsFeatured} onChange={(e) => setFormIsFeatured(e.target.checked)} className="rounded" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formIsOriginal} onChange={(e) => setFormIsOriginal(e.target.checked)} className="rounded" />
                  Taleon Original
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : editingStory ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
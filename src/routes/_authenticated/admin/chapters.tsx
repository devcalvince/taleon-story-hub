import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/chapters")({
  head: () => ({
    meta: [
      { title: "Manage Chapters | Taleon Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminChaptersPage,
});

interface Chapter {
  id: string;
  title: string;
  chapter_number: number;
  story_id: string;
  content: string;
  word_count: number;
  is_premium: boolean;
  is_published: boolean;
  published_at: string | null;
  audio_url: string | null;
  video_url: string | null;
  stories: { title: string; slug: string } | null;
}

interface Story {
  id: string;
  title: string;
  slug: string;
}

function AdminChaptersPage() {
  const { isAdmin, loading } = useSession();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formStoryId, setFormStoryId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formChapterNumber, setFormChapterNumber] = useState(1);
  const [formContent, setFormContent] = useState("");
  const [formIsPremium, setFormIsPremium] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formAudioUrl, setFormAudioUrl] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  async function fetchData() {
    setLoadingData(true);
    const [chaptersRes, storiesRes] = await Promise.all([
      supabase.from("chapters").select("*, stories(title, slug)").order("chapter_number"),
      supabase.from("stories").select("id, title, slug").order("title"),
    ]);
    setChapters(chaptersRes.data ?? []);
    setStories(storiesRes.data ?? []);
    setLoadingData(false);
  }

  function openCreate() {
    setEditingChapter(null);
    setFormStoryId(stories[0]?.id || "");
    setFormTitle("");
    setFormChapterNumber(1);
    setFormContent("");
    setFormIsPremium(false);
    setFormIsPublished(true);
    setFormAudioUrl("");
    setFormVideoUrl("");
    setDialogOpen(true);
  }

  function openEdit(ch: Chapter) {
    setEditingChapter(ch);
    setFormStoryId(ch.story_id);
    setFormTitle(ch.title);
    setFormChapterNumber(ch.chapter_number);
    setFormContent(ch.content || "");
    setFormIsPremium(ch.is_premium);
    setFormIsPublished(ch.is_published);
    setFormAudioUrl(ch.audio_url || "");
    setFormVideoUrl(ch.video_url || "");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formStoryId || !formTitle.trim()) {
      toast.error("Story and title are required");
      return;
    }
    setSaving(true);
    const wordCount = formContent ? formContent.split(/\s+/).filter(Boolean).length : 0;

    const chapterData = {
      story_id: formStoryId,
      title: formTitle,
      chapter_number: formChapterNumber,
      content: formContent,
      word_count: wordCount,
      is_premium: formIsPremium,
      is_published: formIsPublished,
      published_at: formIsPublished ? new Date().toISOString() : null,
      audio_url: formAudioUrl || null,
      video_url: formVideoUrl || null,
    };

    if (editingChapter) {
      const { error } = await supabase.from("chapters").update(chapterData).eq("id", editingChapter.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      toast.success("Chapter updated");
    } else {
      const { error } = await supabase.from("chapters").insert(chapterData);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      toast.success("Chapter created");
    }

    setDialogOpen(false);
    setSaving(false);
    fetchData();
  }

  async function deleteChapter(id: string) {
    if (!confirm("Delete this chapter?")) return;
    await supabase.from("chapters").delete().eq("id", id);
    toast.success("Chapter deleted");
    fetchData();
  }

  async function togglePublished(ch: Chapter) {
    await supabase.from("chapters").update({
      is_published: !ch.is_published,
      published_at: !ch.is_published ? new Date().toISOString() : null,
    }).eq("id", ch.id);
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
      <PageHeader eyebrow="Admin" title="Manage Chapters" lede="Create, edit, and publish chapters." />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="flex justify-end">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New Chapter
          </Button>
        </div>

        {loadingData ? (
          <div className="text-center py-8 text-muted-foreground">Loading chapters...</div>
        ) : chapters.length === 0 ? (
          <EmptyState title="No chapters" body="Create your first chapter to get started." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Story</th>
                  <th className="px-4 py-3">Ch #</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Words</th>
                  <th className="px-4 py-3">Access</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {chapters.map((ch) => (
                  <tr key={ch.id} className="bg-surface-2/40">
                    <td className="px-4 py-3 text-muted-foreground">{ch.stories?.title || "—"}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">#{ch.chapter_number}</td>
                    <td className="px-4 py-3 font-medium">{ch.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{ch.word_count?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ch.is_premium ? "default" : "secondary"}>{ch.is_premium ? "Premium" : "Free"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublished(ch)}>
                        <Badge variant={ch.is_published ? "default" : "outline"} className="cursor-pointer">
                          {ch.is_published ? "Published" : "Draft"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {ch.stories?.slug && (
                          <Link to="/story/$slug/chapter/$chapterNumber" params={{ slug: ch.stories.slug, chapterNumber: ch.chapter_number }} className="p-1 text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <button onClick={() => openEdit(ch)} className="p-1 text-muted-foreground hover:text-gold">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteChapter(ch.id)} className="p-1 text-muted-foreground hover:text-red-500">
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingChapter ? "Edit Chapter" : "Create Chapter"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Story *</label>
                  <select
                    value={formStoryId}
                    onChange={(e) => setFormStoryId(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                  >
                    <option value="">Select story...</option>
                    {stories.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chapter Number</label>
                  <Input type="number" value={formChapterNumber} onChange={(e) => setFormChapterNumber(parseInt(e.target.value))} min={1} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Chapter title" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Content</label>
                  <span className="text-xs text-muted-foreground">{formContent ? formContent.split(/\s+/).filter(Boolean).length : 0} words</span>
                </div>
                <Textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={16}
                  placeholder="Write your chapter content here... (supports markdown)"
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Audio URL</label>
                  <Input value={formAudioUrl} onChange={(e) => setFormAudioUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video URL</label>
                  <Input value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formIsPremium} onChange={(e) => setFormIsPremium(e.target.checked)} className="rounded" />
                  Premium Chapter
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formIsPublished} onChange={(e) => setFormIsPublished(e.target.checked)} className="rounded" />
                  Published
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : editingChapter ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminMedia, useAdminStoriesDropdown } from "@/hooks/use-admin-data";
import { invalidateMediaData, invalidateStoryData } from "@/lib/query-keys";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Upload,
  Link2,
  Eye,
  Check,
  X,
  Archive,
  Trash2,
  Copy,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/media")({
  head: () => ({
    meta: [{ title: "Media Studio | Taleon Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminMediaPage,
});

interface MediaAsset {
  id: string;
  story_id: string | null;
  chapter_id: string | null;
  scene_id: string | null;
  character_id: string | null;
  location_id: string | null;
  asset_type: string;
  title: string;
  description: string | null;
  prompt: string | null;
  source_type: string;
  source_url: string | null;
  public_url: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  file_size: number | null;
  status: string;
  version: number;
  approved: boolean;
  created_at: string;
  story?: { id: string; title: string; slug: string } | null;
}

const assetTypes = [
  "cover",
  "scene",
  "character",
  "location",
  "thumbnail",
  "banner",
  "poster",
  "social_vertical",
  "social_square",
  "youtube_thumbnail",
  "story_cinematic",
  "story_cover",
  "other",
];
const statuses = [
  "draft",
  "processing",
  "ready",
  "approved",
  "published",
  "rejected",
  "failed",
  "archived",
];

function AdminMediaPage() {
  const { isAdmin, user, loading } = useSession();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStory, setFilterStory] = useState("");
  const [search, setSearch] = useState("");

  const assetsQuery = useAdminMedia({ page, filterType, filterStatus, filterStory, search });
  const { data: stories = [] } = useAdminStoriesDropdown();
  const assets = (assetsQuery.data?.data ?? []) as MediaAsset[];
  const count = assetsQuery.data?.count ?? 0;
  const totalPages = Math.ceil(count / 24);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadType, setUploadType] = useState("other");
  const [uploadStory, setUploadStory] = useState("");
  const [uploadChapter, setUploadChapter] = useState("");
  const [uploadScene, setUploadScene] = useState("");
  const [uploadCharacter, setUploadCharacter] = useState("");
  const [uploadLocation, setUploadLocation] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: chapters = [] } = useQuery({
    queryKey: ["admin", "media", "chapters", uploadStory],
    queryFn: async () => {
      if (!uploadStory) return [];
      const { data } = await supabase
        .from("chapters")
        .select("id, title, chapter_number")
        .eq("story_id", uploadStory)
        .order("chapter_number");
      return data ?? [];
    },
    enabled: !!uploadStory,
  });

  const { data: storyCharacters = [] } = useQuery({
    queryKey: ["admin", "media", "characters", uploadStory],
    queryFn: async () => {
      if (!uploadStory) return [];
      const { data } = await supabase
        .from("characters")
        .select("id, name")
        .eq("story_id", uploadStory)
        .order("name");
      return data ?? [];
    },
    enabled: !!uploadStory,
  });

  const { data: storyLocations = [] } = useQuery({
    queryKey: ["admin", "media", "locations", uploadStory],
    queryFn: async () => {
      if (!uploadStory) return [];
      const { data } = await supabase
        .from("locations")
        .select("id, name")
        .eq("story_id", uploadStory)
        .order("name");
      return data ?? [];
    },
    enabled: !!uploadStory,
  });

  const { data: storyScenes = [] } = useQuery({
    queryKey: ["admin", "media", "scenes", uploadStory],
    queryFn: async () => {
      if (!uploadStory) return [];
      const chRes = await supabase.from("chapters").select("id").eq("story_id", uploadStory);
      const chIds = (chRes.data ?? []).map((c) => c.id);
      if (chIds.length === 0) return [];
      const { data } = await supabase
        .from("scenes")
        .select("id, title, scene_number, chapter_id")
        .in("chapter_id", chIds)
        .order("scene_number");
      return data ?? [];
    },
    enabled: !!uploadStory,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("action", uploadMode === "file" ? "upload" : "import_url");
      fd.append("storyId", uploadStory);
      fd.append("assetType", uploadType);
      fd.append(
        "title",
        uploadTitle || (uploadMode === "file" && uploadFile ? uploadFile.name : "Imported"),
      );
      fd.append("description", uploadDesc);
      if (uploadChapter) fd.append("chapterId", uploadChapter);
      if (uploadScene) fd.append("sceneId", uploadScene);
      if (uploadCharacter) fd.append("characterId", uploadCharacter);
      if (uploadLocation) fd.append("locationId", uploadLocation);
      if (uploadMode === "file" && uploadFile) fd.append("file", uploadFile);
      else fd.append("url", uploadUrl);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
    },
    onSuccess: () => {
      toast.success("Asset created");
      setUploadOpen(false);
      resetUpload();
      invalidateMediaData(qc);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const actionMutation = useMutation({
    mutationFn: async ({ assetId, action }: { assetId: string; action: string }) => {
      const res = await fetch(`/api/admin/media/${assetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId: user?.id }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
    },
    onSuccess: () => {
      toast.success("Asset updated");
      invalidateMediaData(qc);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (assetId: string) => {
      const res = await fetch(`/api/admin/media/${assetId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidateMediaData(qc);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function resetUpload() {
    setUploadFile(null);
    setUploadUrl("");
    setUploadTitle("");
    setUploadDesc("");
    setUploadType("other");
    setUploadStory("");
    setUploadChapter("");
    setUploadScene("");
    setUploadCharacter("");
    setUploadLocation("");
  }

  function handleUpload() {
    if (uploadMode === "file" && !uploadFile) {
      toast.error("Select a file");
      return;
    }
    if (uploadMode === "url" && !uploadUrl) {
      toast.error("Enter a URL");
      return;
    }
    if (!uploadStory) {
      toast.error("Select a story");
      return;
    }
    uploadMutation.mutate();
  }

  const [detailAsset, setDetailAsset] = useState<MediaAsset | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  function statusColor(s: string) {
    switch (s) {
      case "approved":
      case "published":
        return "bg-green-500/10 text-green-400";
      case "ready":
        return "bg-blue-500/10 text-blue-400";
      case "draft":
        return "bg-yellow-500/10 text-yellow-400";
      case "rejected":
      case "failed":
        return "bg-red-500/10 text-red-400";
      case "archived":
        return "bg-gray-500/10 text-gray-400";
      default:
        return "bg-muted text-muted-foreground";
    }
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
        title="Media Studio"
        lede={`${count} asset${count !== 1 ? "s" : ""} in library.`}
      />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              resetUpload();
              setUploadOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Upload / Import
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 w-48"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              {assetTypes.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterStory}
              onChange={(e) => {
                setFilterStory(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
            >
              <option value="">All Stories</option>
              {(stories as any[]).map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {assetsQuery.isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : assets.length === 0 ? (
          <EmptyState
            title="No assets"
            body="Upload or import images to start building your visual library."
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {assets.map((a) => (
                <div
                  key={a.id}
                  className="group rounded-lg border border-border bg-surface-2 overflow-hidden"
                >
                  <div className="aspect-square bg-surface-1 flex items-center justify-center overflow-hidden">
                    {a.public_url ? (
                      <img
                        src={a.public_url}
                        alt={a.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{a.asset_type.replace(/_/g, " ")}</span>
                      <span>•</span>
                      <span>v{a.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${statusColor(a.status)}`}>{a.status}</Badge>
                      {a.approved && (
                        <Badge className="text-xs bg-green-500/10 text-green-400">✓</Badge>
                      )}
                    </div>
                    <div className="flex gap-1 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDetailAsset(a);
                          setDetailOpen(true);
                        }}
                        className="h-7 px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {a.status === "ready" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            actionMutation.mutate({ assetId: a.id, action: "approve" })
                          }
                          className="h-7 px-2 text-green-400"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      {a.status !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actionMutation.mutate({ assetId: a.id, action: "reject" })}
                          className="h-7 px-2 text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      {a.status !== "archived" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            actionMutation.mutate({ assetId: a.id, action: "archive" })
                          }
                          className="h-7 px-2"
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload / Import Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Button
                  variant={uploadMode === "file" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadMode("file")}
                >
                  <Upload className="h-4 w-4 mr-1" /> File
                </Button>
                <Button
                  variant={uploadMode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadMode("url")}
                >
                  <Link2 className="h-4 w-4 mr-1" /> External URL
                </Button>
              </div>
              {uploadMode === "file" ? (
                <div className="space-y-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setUploadFile(f);
                        if (!uploadTitle) setUploadTitle(f.name.replace(/\.[^.]+$/, ""));
                      }
                    }}
                    className="hidden"
                  />
                  <Button variant="outline" onClick={() => fileRef.current?.click()}>
                    {uploadFile ? uploadFile.name : "Choose image..."}
                  </Button>
                  {uploadFile && (
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                  >
                    {assetTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Story *</label>
                  <select
                    value={uploadStory}
                    onChange={(e) => setUploadStory(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                  >
                    <option value="">Select story...</option>
                    {(stories as any[]).map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {uploadStory && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapter</label>
                    <select
                      value={uploadChapter}
                      onChange={(e) => setUploadChapter(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                    >
                      <option value="">None</option>
                      {chapters.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          Ch. {c.chapter_number}: {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scene</label>
                    <select
                      value={uploadScene}
                      onChange={(e) => setUploadScene(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                    >
                      <option value="">None</option>
                      {storyScenes.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          Scene {s.scene_number}: {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Character</label>
                    <select
                      value={uploadCharacter}
                      onChange={(e) => setUploadCharacter(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                    >
                      <option value="">None</option>
                      {storyCharacters.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <select
                      value={uploadLocation}
                      onChange={(e) => setUploadLocation(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                    >
                      <option value="">None</option>
                      {storyLocations.map((l: any) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {detailAsset && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{detailAsset.title}</DialogTitle>
                </DialogHeader>
                {detailAsset.public_url && (
                  <div className="rounded-lg overflow-hidden bg-surface-1">
                    <img
                      src={detailAsset.public_url}
                      alt={detailAsset.title}
                      className="w-full object-contain max-h-96"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    {detailAsset.asset_type.replace(/_/g, " ")}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <Badge className={statusColor(detailAsset.status)}>{detailAsset.status}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source:</span>{" "}
                    {detailAsset.source_type.replace(/_/g, " ")}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Version:</span> {detailAsset.version}
                  </div>
                  {detailAsset.width && (
                    <div>
                      <span className="text-muted-foreground">Dimensions:</span> {detailAsset.width}
                      ×{detailAsset.height}
                    </div>
                  )}
                  {detailAsset.format && (
                    <div>
                      <span className="text-muted-foreground">Format:</span>{" "}
                      {detailAsset.format.toUpperCase()}
                    </div>
                  )}
                  {detailAsset.file_size && (
                    <div>
                      <span className="text-muted-foreground">Size:</span>{" "}
                      {(Number(detailAsset.file_size) / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}
                  {detailAsset.story && (
                    <div>
                      <span className="text-muted-foreground">Story:</span>{" "}
                      {detailAsset.story.title}
                    </div>
                  )}
                </div>
                {detailAsset.prompt && (
                  <div className="rounded-lg border border-border bg-surface-2 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Prompt</p>
                    <p className="text-sm whitespace-pre-wrap">{detailAsset.prompt}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        navigator.clipboard.writeText(detailAsset.prompt!);
                        toast.success("Copied");
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy Prompt
                    </Button>
                  </div>
                )}
                {detailAsset.source_url && (
                  <div className="text-xs text-muted-foreground">
                    Source URL:{" "}
                    <a
                      href={detailAsset.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      {detailAsset.source_url}
                    </a>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  {detailAsset.status === "ready" && (
                    <Button
                      onClick={() => {
                        actionMutation.mutate({ assetId: detailAsset.id, action: "approve" });
                        setDetailOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  )}
                  {detailAsset.status !== "rejected" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        actionMutation.mutate({ assetId: detailAsset.id, action: "reject" });
                        setDetailOpen(false);
                      }}
                      className="text-red-400"
                    >
                      Reject
                    </Button>
                  )}
                  {detailAsset.status !== "archived" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        actionMutation.mutate({ assetId: detailAsset.id, action: "archive" });
                        setDetailOpen(false);
                      }}
                    >
                      Archive
                    </Button>
                  )}
                  {detailAsset.public_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(detailAsset.public_url!, "_blank")}
                    >
                      View Full Size
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

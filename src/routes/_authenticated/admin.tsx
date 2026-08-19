import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { PageHeader, EmptyState } from "@/components/site/Section";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Taleon Media" },
      { name: "description", content: "Taleon Media administration dashboard." },
      { property: "og:title", content: "Admin | Taleon Media" },
      { property: "og:description", content: "Taleon Media administration dashboard." },
      { property: "og:url", content: "/admin" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useSession();
  const [stories, setStories] = useState<any[]>([]);
  const [counts, setCounts] = useState({ stories: 0, chapters: 0, videos: 0, genres: 0 });

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("stories")
      .select("id, title, slug, status, is_premium, view_count, published_at")
      .order("published_at", { ascending: false })
      .then(({ data }) => setStories(data ?? []));

    (async () => {
      const tables = ["stories", "chapters", "videos", "genres"] as const;
      const results = await Promise.all(
        tables.map((t) => supabase.from(t).select("id", { count: "exact", head: true })),
      );
      setCounts({
        stories: results[0]?.count ?? 0,
        chapters: results[1]?.count ?? 0,
        videos: results[2]?.count ?? 0,
        genres: results[3]?.count ?? 0,
      });
    })();
  }, [isAdmin]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground sm:px-6">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <EmptyState title="Admins only" body="This area is restricted to Taleon administrators.">
          <Link to="/account" className="rounded-md border border-border px-5 py-2.5 text-sm">
            Back to my library
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Taleon control room" lede="Catalogue overview and publishing status." />
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 pb-20 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {[
            { k: "Stories", v: counts.stories },
            { k: "Chapters", v: counts.chapters },
            { k: "Videos", v: counts.videos },
            { k: "Genres", v: counts.genres },
          ].map((s) => (
            <div key={s.k} className="bg-surface-2 p-6">
              <p className="eyebrow">{s.k}</p>
              <p className="mt-2 font-display text-3xl">{s.v}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="mb-4 text-xl tracking-wide">Catalogue</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Access</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stories.map((s) => (
                  <tr key={s.id} className="bg-surface-2/40">
                    <td className="px-4 py-3">{s.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.is_premium ? "Premium" : "Free"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.view_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <Link to="/story/$slug" params={{ slug: s.slug }} className="text-gold">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

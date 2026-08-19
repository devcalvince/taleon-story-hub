import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "@/hooks/useSession";
import { useAdminCounts, useAdminRecentStories } from "@/hooks/use-admin-data";
import { useRealtimeAdmin } from "@/hooks/useRealtimeAdmin";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { BookOpen, Users, BarChart3, FolderTree, Mail, Newspaper, Image, Film, MapPin, User, Wand2 } from "lucide-react";

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
  const countsQuery = useAdminCounts();
  const recentStoriesQuery = useAdminRecentStories();

  useRealtimeAdmin(["stories", "chapters", "profiles", "analytics_events"]);

  const counts = countsQuery.data ?? { stories: 0, chapters: 0, users: 0, genres: 0 };
  const stories = recentStoriesQuery.data ?? [];

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
        {/* Quick Nav */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Stories", icon: BookOpen, to: "/admin/stories" as const, color: "bg-blue-500/10 text-blue-400" },
            { label: "Media Studio", icon: Image, to: "/admin/media" as const, color: "bg-purple-500/10 text-purple-400" },
            { label: "Scenes", icon: Film, to: "/admin/scenes" as const, color: "bg-amber-500/10 text-amber-400" },
            { label: "Characters", icon: User, to: "/admin/characters" as const, color: "bg-cyan-500/10 text-cyan-400" },
            { label: "Locations", icon: MapPin, to: "/admin/locations" as const, color: "bg-emerald-500/10 text-emerald-400" },
            { label: "Prompts", icon: Wand2, to: "/admin/prompts" as const, color: "bg-rose-500/10 text-rose-400" },
            { label: "Analytics", icon: BarChart3, to: "/admin/analytics" as const, color: "bg-green-500/10 text-green-400" },
            { label: "Genres", icon: FolderTree, to: "/admin/genres" as const, color: "bg-violet-500/10 text-violet-400" },
            { label: "Users", icon: Users, to: "/admin/users" as const, color: "bg-orange-500/10 text-orange-400" },
            { label: "Contacts", icon: Mail, to: "/admin/contacts" as const, color: "bg-teal-500/10 text-teal-400" },
            { label: "Newsletter", icon: Newspaper, to: "/admin/newsletter" as const, color: "bg-pink-500/10 text-pink-400" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-4 transition-colors hover:border-gold/50`}
            >
              <div className={`rounded-md p-2 ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {[
            { k: "Stories", v: counts.stories },
            { k: "Chapters", v: counts.chapters },
            { k: "Users", v: counts.users },
            { k: "Genres", v: counts.genres },
          ].map((s) => (
            <div key={s.k} className="bg-surface-2 p-6">
              <p className="eyebrow">{s.k}</p>
              <p className="mt-2 font-display text-3xl">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Recent Stories */}
        <section>
          <h2 className="mb-4 text-xl tracking-wide">Recent Stories</h2>
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
                    <td className="px-4 py-3 text-muted-foreground">{s.views ?? 0}</td>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdminCounts, useAdminRecentStories } from "@/hooks/use-admin-data";
import { PageHeader } from "@/components/site/Section";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Taleon Media" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const countsQuery = useAdminCounts();
  const recentStoriesQuery = useAdminRecentStories();

  const counts = countsQuery.data ?? { stories: 0, chapters: 0, users: 0, genres: 0 };
  const stories = recentStoriesQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Taleon control room"
        lede="Catalogue overview and publishing status."
      />
      <div className="space-y-10">
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
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.is_premium ? "Premium" : "Free"}
                    </td>
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

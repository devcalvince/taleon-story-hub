import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "@/hooks/useSession";
import { useAdminAnalytics } from "@/hooks/use-admin-data";
import { useRealtimeAdmin } from "@/hooks/useRealtimeAdmin";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Eye, BookOpen, Users, TrendingUp, Headphones, Play, UserPlus, MousePointer } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | Taleon Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAnalyticsPage,
});

const COLORS = ["#7C3AED", "#F4C95D", "#10B981", "#3B82F6", "#EF4444", "#F59E0B"];

function AdminAnalyticsPage() {
  const { isAdmin, loading } = useSession();
  const { data, isLoading: loadingData } = useAdminAnalytics();

  useRealtimeAdmin(["analytics_events"]);

  const stats = data?.stats ?? {
    totalViews: 0, totalReads: 0, totalFollows: 0, totalSignups: 0,
    totalChapterReads: 0, totalAudioPlays: 0, totalVideoPlays: 0,
    totalSearches: 0, totalShares: 0,
  };
  const dailyVisitors = data?.dailyVisitors ?? [];
  const topStories = data?.topStories ?? [];
  const recentEvents = data?.recentEvents ?? [];
  const eventBreakdown = data?.eventBreakdown ?? [];

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
      <PageHeader eyebrow="Admin" title="Analytics" lede="Track engagement, conversions, and content performance." />
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 sm:px-6">
        {loadingData ? (
          <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Page Views", value: stats.totalViews, icon: Eye, color: "text-blue-400" },
                { label: "Chapter Reads", value: stats.totalChapterReads, icon: BookOpen, color: "text-green-400" },
                { label: "Follows", value: stats.totalFollows, icon: UserPlus, color: "text-purple-400" },
                { label: "Signups", value: stats.totalSignups, icon: Users, color: "text-yellow-400" },
                { label: "Audio Plays", value: stats.totalAudioPlays, icon: Headphones, color: "text-pink-400" },
                { label: "Video Plays", value: stats.totalVideoPlays, icon: Play, color: "text-red-400" },
                { label: "Searches", value: stats.totalSearches, icon: MousePointer, color: "text-cyan-400" },
                { label: "Shares", value: stats.totalShares, icon: TrendingUp, color: "text-orange-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-surface-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <p className="mt-2 font-display text-2xl">{s.value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Daily Visitors */}
              <div className="rounded-lg border border-border bg-surface-2 p-6">
                <h3 className="mb-4 text-lg font-medium">Daily Events (14 days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dailyVisitors}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitors" stroke="#7C3AED" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Event Breakdown */}
              <div className="rounded-lg border border-border bg-surface-2 p-6">
                <h3 className="mb-4 text-lg font-medium">Event Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={eventBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {eventBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Stories */}
            <div className="rounded-lg border border-border bg-surface-2 p-6">
              <h3 className="mb-4 text-lg font-medium">Top Stories by Engagement</h3>
              {topStories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No story data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topStories}>
                    <XAxis dataKey="title" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#7C3AED" name="Views" />
                    <Bar dataKey="reads" fill="#F4C95D" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top Stories Table */}
            <div className="rounded-lg border border-border bg-surface-2 p-6">
              <h3 className="mb-4 text-lg font-medium">Story Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-muted-foreground uppercase">
                    <tr>
                      <th className="pb-3">Story</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3">Completed</th>
                      <th className="pb-3">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topStories.map((s, i) => (
                      <tr key={i}>
                        <td className="py-2">
                          <Link to="/story/$slug" params={{ slug: s.slug }} className="hover:text-gold">
                            {s.title || "Unknown"}
                          </Link>
                        </td>
                        <td className="py-2 text-muted-foreground">{s.views}</td>
                        <td className="py-2 text-muted-foreground">{s.reads}</td>
                        <td className="py-2">
                          <span className={s.completionRate > 50 ? "text-green-400" : s.completionRate > 20 ? "text-yellow-400" : "text-red-400"}>
                            {s.completionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Events */}
            <div className="rounded-lg border border-border bg-surface-2 p-6">
              <h3 className="mb-4 text-lg font-medium">Recent Events</h3>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {recentEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events tracked yet</p>
                ) : (
                  recentEvents.map((e) => (
                    <div key={e.id} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
                      <Badge variant={
                        e.event_name.includes("view") ? "default" :
                        e.event_name.includes("read") || e.event_name.includes("completed") ? "secondary" :
                        e.event_name.includes("follow") ? "outline" :
                        "default"
                      }>
                        {e.event_name.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(e.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

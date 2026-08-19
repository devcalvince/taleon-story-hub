import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
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

interface Stats {
  totalViews: number;
  totalReads: number;
  totalFollows: number;
  totalSignups: number;
  totalChapterReads: number;
  totalAudioPlays: number;
  totalVideoPlays: number;
  totalSearches: number;
  totalShares: number;
}

interface DailyVisitors {
  date: string;
  visitors: number;
}

interface TopStory {
  title: string;
  slug: string;
  views: number;
  reads: number;
  completionRate: number;
}

interface RecentEvent {
  id: number;
  event_name: string;
  created_at: string;
  metadata: any;
}

const COLORS = ["#7C3AED", "#F4C95D", "#10B981", "#3B82F6", "#EF4444", "#F59E0B"];

function AdminAnalyticsPage() {
  const { isAdmin, loading } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalViews: 0, totalReads: 0, totalFollows: 0, totalSignups: 0,
    totalChapterReads: 0, totalAudioPlays: 0, totalVideoPlays: 0,
    totalSearches: 0, totalShares: 0,
  });
  const [dailyVisitors, setDailyVisitors] = useState<DailyVisitors[]>([]);
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [eventBreakdown, setEventBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAnalytics();
  }, [isAdmin]);

  async function fetchAnalytics() {
    setLoadingData(true);

    // Fetch all analytics events
    const { data: events } = await supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    // Fetch counts
    const [followsRes, profilesRes] = await Promise.all([
      supabase.from("follows").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    // Calculate stats from events
    const allEvents = events ?? [];
    const views = allEvents.filter(e => e.event_name === "page_view" || e.event_name === "story_view").length;
    const chapterReads = allEvents.filter(e => e.event_name === "chapter_started" || e.event_name === "chapter_completed").length;
    const audioPlays = allEvents.filter(e => e.event_name === "audio_started").length;
    const videoPlays = allEvents.filter(e => e.event_name === "video_started").length;
    const searches = allEvents.filter(e => e.event_name === "search").length;
    const shares = allEvents.filter(e => e.event_name === "share").length;

    setStats({
      totalViews: views,
      totalReads: allEvents.filter(e => e.event_name === "chapter_completed").length,
      totalFollows: followsRes.count ?? 0,
      totalSignups: profilesRes.count ?? 0,
      totalChapterReads: chapterReads,
      totalAudioPlays: audioPlays,
      totalVideoPlays: videoPlays,
      totalSearches: searches,
      totalShares: shares,
    });

    // Daily visitors (last 14 days)
    const dailyMap = new Map<string, number>();
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap.set(d.toISOString().slice(0, 10), 0);
    }
    for (const e of allEvents) {
      const day = e.created_at?.slice(0, 10);
      if (dailyMap.has(day)) {
        dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
      }
    }
    setDailyVisitors(Array.from(dailyMap.entries()).map(([date, visitors]) => ({ date: date.slice(5), visitors })));

    // Top stories
    const storyViews = new Map<string, { title: string; slug: string; views: number; reads: number }>();
    for (const e of allEvents) {
      if (e.event_name === "story_view" && e.story_id) {
        const existing = storyViews.get(e.story_id) ?? { title: "", slug: "", views: 0, reads: 0 };
        existing.views++;
        storyViews.set(e.story_id, existing);
      }
      if (e.event_name === "chapter_completed" && e.story_id) {
        const existing = storyViews.get(e.story_id) ?? { title: "", slug: "", views: 0, reads: 0 };
        existing.reads++;
        storyViews.set(e.story_id, existing);
      }
    }

    // Enrich with story titles
    const storyIds = Array.from(storyViews.keys());
    if (storyIds.length) {
      const { data: storyData } = await supabase.from("stories").select("id, title, slug").in("id", storyIds);
      for (const s of storyData ?? []) {
        const existing = storyViews.get(s.id);
        if (existing) {
          existing.title = s.title;
          existing.slug = s.slug;
        }
      }
    }

    const topStoriesArr = Array.from(storyViews.values())
      .map(s => ({ ...s, completionRate: s.views > 0 ? Math.round((s.reads / s.views) * 100) : 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
    setTopStories(topStoriesArr);

    // Event breakdown for pie chart
    const eventCounts = new Map<string, number>();
    for (const e of allEvents) {
      eventCounts.set(e.event_name, (eventCounts.get(e.event_name) ?? 0) + 1);
    }
    setEventBreakdown(
      Array.from(eventCounts.entries())
        .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    );

    // Recent events
    setRecentEvents(allEvents.slice(0, 20));

    setLoadingData(false);
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
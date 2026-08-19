import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/query-keys";

// ─── Stories ────────────────────────────────────────────────────
export function useAdminStories() {
  return useQuery({
    queryKey: queryKeys.adminStories,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useAdminGenres() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.adminGenres,
      queryFn: async () => {
        const { data } = await supabase.from("genres").select("*").order("sort_order");
        const enriched = await Promise.all(
          (data ?? []).map(async (g) => {
            const { count } = await supabase
              .from("story_genres")
              .select("id", { count: "exact", head: true })
              .eq("genre_id", g.id);
            return { ...g, story_count: count ?? 0 };
          })
        );
        return enriched;
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),
    invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminGenres }),
  };
}

export function useAdminChapters() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.adminChapters,
      queryFn: async () => {
        const { data, error } = await supabase
          .from("chapters")
          .select("*, stories(title, slug)")
          .order("chapter_number");
        if (error) throw new Error(error.message);
        return data ?? [];
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),
    invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminChapters }),
  };
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .order("created_at", { ascending: false });

      const enriched = await Promise.all(
        (profiles ?? []).map(async (p) => {
          const [followsRes, bookmarksRes] = await Promise.all([
            supabase.from("follows").select("id", { count: "exact", head: true }).eq("user_id", p.id),
            supabase.from("bookmarks").select("id", { count: "exact", head: true }).eq("user_id", p.id),
          ]);
          return {
            ...p,
            _follows: followsRes.count ?? 0,
            _bookmarks: bookmarksRes.count ?? 0,
          };
        })
      );
      return enriched;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useAdminContacts() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.adminContacts,
      queryFn: async () => {
        const { data } = await supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false });
        return data ?? [];
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),
    invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminContacts }),
  };
}

export function useAdminNewsletter() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.adminNewsletter,
      queryFn: async () => {
        const { data } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false });
        return data ?? [];
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),
    invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminNewsletter }),
  };
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: queryKeys.adminAnalytics,
    queryFn: async () => {
      const { data: events } = await supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      const [followsRes, profilesRes] = await Promise.all([
        supabase.from("follows").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      const allEvents = events ?? [];

      const views = allEvents.filter(e => e.event_name === "page_view" || e.event_name === "story_view").length;
      const chapterReads = allEvents.filter(e => e.event_name === "chapter_started" || e.event_name === "chapter_completed").length;
      const audioPlays = allEvents.filter(e => e.event_name === "audio_started").length;
      const videoPlays = allEvents.filter(e => e.event_name === "video_started").length;
      const searches = allEvents.filter(e => e.event_name === "search").length;
      const shares = allEvents.filter(e => e.event_name === "share").length;

      const stats = {
        totalViews: views,
        totalReads: allEvents.filter(e => e.event_name === "chapter_completed").length,
        totalFollows: followsRes.count ?? 0,
        totalSignups: profilesRes.count ?? 0,
        totalChapterReads: chapterReads,
        totalAudioPlays: audioPlays,
        totalVideoPlays: videoPlays,
        totalSearches: searches,
        totalShares: shares,
      };

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
      const dailyVisitors = Array.from(dailyMap.entries()).map(([date, visitors]) => ({ date: date.slice(5), visitors }));

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
      const storyIds = Array.from(storyViews.keys());
      if (storyIds.length) {
        const { data: storyData } = await supabase.from("stories").select("id, title, slug").in("id", storyIds);
        for (const s of storyData ?? []) {
          const existing = storyViews.get(s.id);
          if (existing) { existing.title = s.title; existing.slug = s.slug; }
        }
      }
      const topStories = Array.from(storyViews.values())
        .map(s => ({ ...s, completionRate: s.views > 0 ? Math.round((s.reads / s.views) * 100) : 0 }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 8);

      const eventCounts = new Map<string, number>();
      for (const e of allEvents) {
        eventCounts.set(e.event_name, (eventCounts.get(e.event_name) ?? 0) + 1);
      }
      const eventBreakdown = Array.from(eventCounts.entries())
        .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      const recentEvents = allEvents.slice(0, 20);

      return { stats, dailyVisitors, topStories, eventBreakdown, recentEvents };
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });
}

export function useAdminCounts() {
  return useQuery({
    queryKey: queryKeys.adminCounts,
    queryFn: async () => {
      const tables = ["stories", "chapters", "profiles", "genres"] as const;
      const results = await Promise.all(
        tables.map((t) => supabase.from(t).select("id", { count: "exact", head: true })),
      );
      return {
        stories: results[0]?.count ?? 0,
        chapters: results[1]?.count ?? 0,
        users: results[2]?.count ?? 0,
        genres: results[3]?.count ?? 0,
      };
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useAdminRecentStories() {
  return useQuery({
    queryKey: [...queryKeys.adminStories, "recent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stories")
        .select("id, title, slug, status, is_premium, view_count, published_at")
        .order("published_at", { ascending: false });
      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

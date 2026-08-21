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
          }),
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
        .select("*")
        .order("created_at", { ascending: false });

      const { data: roles } = await supabase.from("user_roles").select("user_id, role");

      const roleMap = new Map<string, string[]>();
      for (const r of roles ?? []) {
        const existing = roleMap.get(r.user_id) ?? [];
        existing.push(r.role);
        roleMap.set(r.user_id, existing);
      }

      const enriched = await Promise.all(
        (profiles ?? []).map(async (p) => {
          const [followsRes, bookmarksRes] = await Promise.all([
            supabase
              .from("follows")
              .select("id", { count: "exact", head: true })
              .eq("user_id", p.id),
            supabase
              .from("bookmarks")
              .select("id", { count: "exact", head: true })
              .eq("user_id", p.id),
          ]);
          return {
            ...p,
            user_roles: (roleMap.get(p.id) ?? []).map((role) => ({ role })),
            _follows: followsRes.count ?? 0,
            _bookmarks: bookmarksRes.count ?? 0,
          };
        }),
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
      const [eventsRes, followsRes, profilesRes] = await Promise.all([
        supabase
          .from("analytics_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(2000),
        supabase.from("follows").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      const allEvents = eventsRes.data ?? [];
      const eventNames = new Set(allEvents.map((e) => e.event_name));

      // Filter out admin and system events for public metrics
      const publicEvents = allEvents.filter((e: any) => e.actor_type !== "admin" && e.actor_type !== "system");

      // Support both old and new event names (backward compatibility)
      const isStoryView = (e: any) => e.event_name === "story_view" || e.event_name === "page_view";
      const isChapterStart = (e: any) =>
        e.event_name === "chapter_started" || e.event_name === "chapter_start";
      const isChapterComplete = (e: any) =>
        e.event_name === "chapter_completed" || e.event_name === "chapter_complete";

      const views = publicEvents.filter(isStoryView).length;
      const chapterStarts = publicEvents.filter(isChapterStart).length;
      const chapterCompletions = publicEvents.filter(isChapterComplete).length;
      const audioPlays = publicEvents.filter(
        (e: any) => e.event_name === "audio_started" || e.event_name === "audio_play",
      ).length;
      const videoPlays = publicEvents.filter(
        (e: any) => e.event_name === "video_started" || e.event_name === "video_play",
      ).length;
      const searches = publicEvents.filter((e: any) => e.event_name === "search").length;
      const shares = publicEvents.filter((e: any) => e.event_name === "share").length;
      const signups = publicEvents.filter((e: any) => e.event_name === "signup").length;

      const stats = {
        totalVisitors:
          publicEvents.filter((e: any) => e.anonymous_id).length + (profilesRes.count ?? 0),
        totalStoryViews: views,
        totalChapterStarts: chapterStarts,
        totalChapterReads: chapterCompletions,
        totalFollows: followsRes.count ?? 0,
        totalSignups: signups,
        totalAudioPlays: audioPlays,
        totalVideoPlays: videoPlays,
        totalSearches: searches,
        totalShares: shares,
        // Legacy aliases for dashboard compatibility
        totalViews: views,
        totalReads: chapterCompletions,
      };

      // Daily events chart (last 14 days)
      const dailyMap = new Map<string, number>();
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dailyMap.set(d.toISOString().slice(0, 10), 0);
      }
      for (const e of publicEvents) {
        const day = e.created_at?.slice(0, 10);
        if (day && dailyMap.has(day)) {
          dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
        }
      }
      const dailyVisitors = Array.from(dailyMap.entries()).map(([date, visitors]) => ({
        date: date.slice(5),
        visitors,
      }));

      // Top stories by views and completions
      const storyStats = new Map<
        string,
        { title: string; slug: string; views: number; reads: number; starts: number }
      >();
      for (const e of publicEvents) {
        if (!e.story_id) continue;
        if (e.event_name === "story_view") {
          const existing = storyStats.get(e.story_id) ?? {
            title: "",
            slug: "",
            views: 0,
            reads: 0,
            starts: 0,
          };
          existing.views++;
          storyStats.set(e.story_id, existing);
        }
        if (isChapterStart(e)) {
          const existing = storyStats.get(e.story_id) ?? {
            title: "",
            slug: "",
            views: 0,
            reads: 0,
            starts: 0,
          };
          existing.starts++;
          storyStats.set(e.story_id, existing);
        }
        if (isChapterComplete(e)) {
          const existing = storyStats.get(e.story_id) ?? {
            title: "",
            slug: "",
            views: 0,
            reads: 0,
            starts: 0,
          };
          existing.reads++;
          storyStats.set(e.story_id, existing);
        }
      }
      const storyIds = Array.from(storyStats.keys());
      if (storyIds.length) {
        const { data: storyData } = await supabase
          .from("stories")
          .select("id, title, slug")
          .in("id", storyIds);
        for (const s of storyData ?? []) {
          const existing = storyStats.get(s.id);
          if (existing) {
            existing.title = s.title;
            existing.slug = s.slug;
          }
        }
      }
      const topStories = Array.from(storyStats.values())
        .map((s) => ({
          ...s,
          completionRate: s.starts > 0 ? Math.round((s.reads / s.starts) * 100) : 0,
        }))
        .sort((a, b) => b.starts - a.starts)
        .slice(0, 8);

      // Chapter funnel (last 30 days)
      const funnelEvents = publicEvents.filter(
        (e: any) =>
          e.event_name === "chapter_25" ||
          e.event_name === "chapter_50" ||
          e.event_name === "chapter_75" ||
          isChapterComplete(e),
      );
      const funnelCounts = {
        started: chapterStarts,
        reached25: funnelEvents.filter((e: any) => e.event_name === "chapter_25").length,
        reached50: funnelEvents.filter((e: any) => e.event_name === "chapter_50").length,
        reached75: funnelEvents.filter((e: any) => e.event_name === "chapter_75").length,
        completed: funnelEvents.filter(isChapterComplete).length,
      };

      // Attribution breakdown
      const attributionMap = new Map<
        string,
        { visits: number; starts: number; completions: number }
      >();
      for (const e of publicEvents) {
        const source = (e as any).attribution?.source || "direct";
        const entry = attributionMap.get(source) ?? { visits: 0, starts: 0, completions: 0 };
        entry.visits++;
        if (isChapterStart(e)) entry.starts++;
        if (isChapterComplete(e)) entry.completions++;
        attributionMap.set(source, entry);
      }
      const attributionData = Array.from(attributionMap.entries())
        .map(([source, data]) => ({ source, ...data }))
        .sort((a, b) => b.visits - a.visits);

      // Event breakdown
      const eventCounts = new Map<string, number>();
      for (const e of publicEvents) {
        eventCounts.set(e.event_name, (eventCounts.get(e.event_name) ?? 0) + 1);
      }
      const eventBreakdown = Array.from(eventCounts.entries())
        .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 12);

      // Recent events for live feed
      const recentEvents = publicEvents.slice(0, 50);

      return {
        stats,
        dailyVisitors,
        topStories,
        eventBreakdown,
        recentEvents,
        funnelCounts,
        attributionData,
      };
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
        .select("id, title, slug, status, is_premium, views, published_at")
        .order("published_at", { ascending: false });
      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// ─── Stories dropdown (lightweight) ─────────────────────────────
export function useAdminStoriesDropdown() {
  return useQuery({
    queryKey: [...queryKeys.adminStories, "dropdown"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("id, title, slug")
        .order("title");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// ─── Scenes ─────────────────────────────────────────────────────
export function useAdminScenes() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.adminScenes,
      queryFn: async () => {
        const { data, error } = await supabase
          .from("scenes")
          .select("*, chapters(title, chapter_number, stories(title, slug))")
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data ?? [];
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),
    invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminScenes }),
  };
}

// ─── Characters ─────────────────────────────────────────────────
export function useAdminCharacters() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.adminCharacters,
      queryFn: async () => {
        const { data, error } = await supabase
          .from("characters")
          .select("*, stories(title, slug)")
          .order("sort_order");
        if (error) throw new Error(error.message);
        return data ?? [];
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),
    invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminCharacters }),
  };
}

// ─── Locations ──────────────────────────────────────────────────
export function useAdminLocations() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.adminLocations,
      queryFn: async () => {
        const { data, error } = await supabase
          .from("locations")
          .select("*, stories(title, slug)")
          .order("name");
        if (error) throw new Error(error.message);
        return data ?? [];
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),
    invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminLocations }),
  };
}

// ─── Chapters dropdown (for media page) ─────────────────────────
export function useAdminChaptersDropdown(storyId?: string) {
  return useQuery({
    queryKey: [...queryKeys.adminChapters, "dropdown", storyId],
    queryFn: async () => {
      let q = supabase
        .from("chapters")
        .select("id, title, chapter_number, story_id")
        .order("chapter_number");
      if (storyId) q = q.eq("story_id", storyId);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: true,
  });
}

// ─── Media assets ───────────────────────────────────────────────
export function useAdminMedia(
  opts: {
    page?: number;
    filterType?: string;
    filterStatus?: string;
    filterStory?: string;
    search?: string;
  } = {},
) {
  return useQuery({
    queryKey: [...queryKeys.adminMedia, opts],
    queryFn: async () => {
      let query = supabase
        .from("media_assets")
        .select("*, story:stories(id,title,slug)", { count: "exact" });
      if (opts.filterType) query = query.eq("asset_type", opts.filterType as any);
      if (opts.filterStatus) query = query.eq("status", opts.filterStatus as any);
      if (opts.filterStory) query = query.eq("story_id", opts.filterStory);
      if (opts.search) query = query.or(`title.ilike.%${opts.search}%`);
      const from = ((opts.page ?? 1) - 1) * 24;
      query = query.order("created_at", { ascending: false }).range(from, from + 23);
      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { data: data ?? [], count: count ?? 0 };
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

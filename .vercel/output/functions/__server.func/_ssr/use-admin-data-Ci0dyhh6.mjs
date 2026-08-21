import { t as supabase } from "./client-DpjBY_Px.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-admin-data-Ci0dyhh6.js
var queryKeys = {
	adminStories: ["admin", "stories"],
	adminChapters: ["admin", "chapters"],
	adminGenres: ["admin", "genres"],
	adminUsers: ["admin", "users"],
	adminContacts: ["admin", "contacts"],
	adminNewsletter: ["admin", "newsletter"],
	adminAnalytics: ["admin", "analytics"],
	adminMedia: ["admin", "media"],
	adminScenes: ["admin", "scenes"],
	adminCharacters: ["admin", "characters"],
	adminLocations: ["admin", "locations"],
	adminCounts: ["admin", "counts"],
	home: ["home"],
	stories: (params) => ["stories", params],
	story: (slug) => ["story", slug],
	chapter: (slug, num) => [
		"chapter",
		slug,
		num
	],
	genres: ["genres"],
	search: (q) => ["search", q],
	readingProgress: ["reading", "progress"]
};
/**
* After a story or chapter mutation, invalidate every query that could be affected.
* Story mutations affect: stories list, individual story pages, chapters list,
* counts, analytics, public home/catalogue/search, and audio/video.
* Chapter mutations additionally affect the parent story's chapter list.
*/
function invalidateStoryData(qc) {
	return Promise.all([
		qc.invalidateQueries({ queryKey: ["admin", "stories"] }),
		qc.invalidateQueries({ queryKey: ["admin", "chapters"] }),
		qc.invalidateQueries({ queryKey: ["admin", "counts"] }),
		qc.invalidateQueries({ queryKey: ["admin", "analytics"] }),
		qc.invalidateQueries({ queryKey: ["admin", "media"] }),
		qc.invalidateQueries({ queryKey: ["home"] }),
		qc.invalidateQueries({ queryKey: ["stories"] }),
		qc.invalidateQueries({ queryKey: ["story"] }),
		qc.invalidateQueries({ queryKey: ["chapter"] }),
		qc.invalidateQueries({ queryKey: ["genres"] }),
		qc.invalidateQueries({ queryKey: ["search"] })
	]);
}
/**
* After a chapter publish/unpublish, invalidate story + chapter data
* plus the specific story page and chapter pages.
*/
function invalidateChapterData(qc) {
	return Promise.all([
		qc.invalidateQueries({ queryKey: ["admin", "chapters"] }),
		qc.invalidateQueries({ queryKey: ["admin", "stories"] }),
		qc.invalidateQueries({ queryKey: ["admin", "counts"] }),
		qc.invalidateQueries({ queryKey: ["story"] }),
		qc.invalidateQueries({ queryKey: ["chapter"] }),
		qc.invalidateQueries({ queryKey: ["home"] }),
		qc.invalidateQueries({ queryKey: ["search"] })
	]);
}
/**
* After a genre mutation, invalidate genre lists (admin + public) and
* story lists (genres affect story cards).
*/
function invalidateGenreData(qc) {
	return Promise.all([
		qc.invalidateQueries({ queryKey: ["admin", "genres"] }),
		qc.invalidateQueries({ queryKey: ["genres"] }),
		qc.invalidateQueries({ queryKey: ["stories"] }),
		qc.invalidateQueries({ queryKey: ["home"] }),
		qc.invalidateQueries({ queryKey: ["admin", "counts"] })
	]);
}
/**
* After a media asset change.
*/
function invalidateMediaData(qc) {
	return Promise.all([qc.invalidateQueries({ queryKey: ["admin", "media"] })]);
}
function useAdminStories() {
	return useQuery({
		queryKey: queryKeys.adminStories,
		queryFn: async () => {
			const { data, error } = await supabase.from("stories").select("*").order("created_at", { ascending: false });
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		staleTime: 0,
		refetchOnWindowFocus: true
	});
}
function useAdminGenres() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: queryKeys.adminGenres,
			queryFn: async () => {
				const { data } = await supabase.from("genres").select("*").order("sort_order");
				return await Promise.all((data ?? []).map(async (g) => {
					const { count } = await supabase.from("story_genres").select("id", {
						count: "exact",
						head: true
					}).eq("genre_id", g.id);
					return {
						...g,
						story_count: count ?? 0
					};
				}));
			},
			staleTime: 0,
			refetchOnWindowFocus: true
		}),
		invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminGenres })
	};
}
function useAdminChapters() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: queryKeys.adminChapters,
			queryFn: async () => {
				const { data, error } = await supabase.from("chapters").select("*, stories(title, slug)").order("chapter_number");
				if (error) throw new Error(error.message);
				return data ?? [];
			},
			staleTime: 0,
			refetchOnWindowFocus: true
		}),
		invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminChapters })
	};
}
function useAdminUsers() {
	return useQuery({
		queryKey: queryKeys.adminUsers,
		queryFn: async () => {
			const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
			const { data: roles } = await supabase.from("user_roles").select("user_id, role");
			const roleMap = /* @__PURE__ */ new Map();
			for (const r of roles ?? []) {
				const existing = roleMap.get(r.user_id) ?? [];
				existing.push(r.role);
				roleMap.set(r.user_id, existing);
			}
			return await Promise.all((profiles ?? []).map(async (p) => {
				const [followsRes, bookmarksRes] = await Promise.all([supabase.from("follows").select("id", {
					count: "exact",
					head: true
				}).eq("user_id", p.id), supabase.from("bookmarks").select("id", {
					count: "exact",
					head: true
				}).eq("user_id", p.id)]);
				return {
					...p,
					user_roles: (roleMap.get(p.id) ?? []).map((role) => ({ role })),
					_follows: followsRes.count ?? 0,
					_bookmarks: bookmarksRes.count ?? 0
				};
			}));
		},
		staleTime: 0,
		refetchOnWindowFocus: true
	});
}
function useAdminContacts() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: queryKeys.adminContacts,
			queryFn: async () => {
				const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
				return data ?? [];
			},
			staleTime: 0,
			refetchOnWindowFocus: true
		}),
		invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminContacts })
	};
}
function useAdminNewsletter() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: queryKeys.adminNewsletter,
			queryFn: async () => {
				const { data } = await supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });
				return data ?? [];
			},
			staleTime: 0,
			refetchOnWindowFocus: true
		}),
		invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminNewsletter })
	};
}
function useAdminAnalytics() {
	return useQuery({
		queryKey: queryKeys.adminAnalytics,
		queryFn: async () => {
			const [eventsRes, followsRes, profilesRes] = await Promise.all([
				supabase.from("analytics_events").select("*").order("created_at", { ascending: false }).limit(2e3),
				supabase.from("follows").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("profiles").select("id", {
					count: "exact",
					head: true
				})
			]);
			const allEvents = eventsRes.data ?? [];
			new Set(allEvents.map((e) => e.event_name));
			const publicEvents = allEvents.filter((e) => e.actor_type !== "admin" && e.actor_type !== "system");
			const isStoryView = (e) => e.event_name === "story_view" || e.event_name === "page_view";
			const isChapterStart = (e) => e.event_name === "chapter_started" || e.event_name === "chapter_start";
			const isChapterComplete = (e) => e.event_name === "chapter_completed" || e.event_name === "chapter_complete";
			const views = publicEvents.filter(isStoryView).length;
			const chapterStarts = publicEvents.filter(isChapterStart).length;
			const chapterCompletions = publicEvents.filter(isChapterComplete).length;
			const audioPlays = publicEvents.filter((e) => e.event_name === "audio_started" || e.event_name === "audio_play").length;
			const videoPlays = publicEvents.filter((e) => e.event_name === "video_started" || e.event_name === "video_play").length;
			const searches = publicEvents.filter((e) => e.event_name === "search").length;
			const shares = publicEvents.filter((e) => e.event_name === "share").length;
			const signups = publicEvents.filter((e) => e.event_name === "signup").length;
			const stats = {
				totalVisitors: publicEvents.filter((e) => e.anonymous_id).length + (profilesRes.count ?? 0),
				totalStoryViews: views,
				totalChapterStarts: chapterStarts,
				totalChapterReads: chapterCompletions,
				totalFollows: followsRes.count ?? 0,
				totalSignups: signups,
				totalAudioPlays: audioPlays,
				totalVideoPlays: videoPlays,
				totalSearches: searches,
				totalShares: shares,
				totalViews: views,
				totalReads: chapterCompletions
			};
			const dailyMap = /* @__PURE__ */ new Map();
			const now = /* @__PURE__ */ new Date();
			for (let i = 13; i >= 0; i--) {
				const d = new Date(now);
				d.setDate(d.getDate() - i);
				dailyMap.set(d.toISOString().slice(0, 10), 0);
			}
			for (const e of publicEvents) {
				const day = e.created_at?.slice(0, 10);
				if (day && dailyMap.has(day)) dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
			}
			const dailyVisitors = Array.from(dailyMap.entries()).map(([date, visitors]) => ({
				date: date.slice(5),
				visitors
			}));
			const storyStats = /* @__PURE__ */ new Map();
			for (const e of publicEvents) {
				if (!e.story_id) continue;
				if (e.event_name === "story_view") {
					const existing = storyStats.get(e.story_id) ?? {
						title: "",
						slug: "",
						views: 0,
						reads: 0,
						starts: 0
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
						starts: 0
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
						starts: 0
					};
					existing.reads++;
					storyStats.set(e.story_id, existing);
				}
			}
			const storyIds = Array.from(storyStats.keys());
			if (storyIds.length) {
				const { data: storyData } = await supabase.from("stories").select("id, title, slug").in("id", storyIds);
				for (const s of storyData ?? []) {
					const existing = storyStats.get(s.id);
					if (existing) {
						existing.title = s.title;
						existing.slug = s.slug;
					}
				}
			}
			const topStories = Array.from(storyStats.values()).map((s) => ({
				...s,
				completionRate: s.starts > 0 ? Math.round(s.reads / s.starts * 100) : 0
			})).sort((a, b) => b.starts - a.starts).slice(0, 8);
			const funnelEvents = publicEvents.filter((e) => e.event_name === "chapter_25" || e.event_name === "chapter_50" || e.event_name === "chapter_75" || isChapterComplete(e));
			const funnelCounts = {
				started: chapterStarts,
				reached25: funnelEvents.filter((e) => e.event_name === "chapter_25").length,
				reached50: funnelEvents.filter((e) => e.event_name === "chapter_50").length,
				reached75: funnelEvents.filter((e) => e.event_name === "chapter_75").length,
				completed: funnelEvents.filter(isChapterComplete).length
			};
			const attributionMap = /* @__PURE__ */ new Map();
			for (const e of publicEvents) {
				const source = e.attribution?.source || "direct";
				const entry = attributionMap.get(source) ?? {
					visits: 0,
					starts: 0,
					completions: 0
				};
				entry.visits++;
				if (isChapterStart(e)) entry.starts++;
				if (isChapterComplete(e)) entry.completions++;
				attributionMap.set(source, entry);
			}
			const attributionData = Array.from(attributionMap.entries()).map(([source, data]) => ({
				source,
				...data
			})).sort((a, b) => b.visits - a.visits);
			const eventCounts = /* @__PURE__ */ new Map();
			for (const e of publicEvents) eventCounts.set(e.event_name, (eventCounts.get(e.event_name) ?? 0) + 1);
			return {
				stats,
				dailyVisitors,
				topStories,
				eventBreakdown: Array.from(eventCounts.entries()).map(([name, value]) => ({
					name: name.replace(/_/g, " "),
					value
				})).sort((a, b) => b.value - a.value).slice(0, 12),
				recentEvents: publicEvents.slice(0, 50),
				funnelCounts,
				attributionData
			};
		},
		staleTime: 0,
		refetchOnWindowFocus: true,
		refetchInterval: 3e4
	});
}
function useAdminCounts() {
	return useQuery({
		queryKey: queryKeys.adminCounts,
		queryFn: async () => {
			const results = await Promise.all([
				"stories",
				"chapters",
				"profiles",
				"genres"
			].map((t) => supabase.from(t).select("id", {
				count: "exact",
				head: true
			})));
			return {
				stories: results[0]?.count ?? 0,
				chapters: results[1]?.count ?? 0,
				users: results[2]?.count ?? 0,
				genres: results[3]?.count ?? 0
			};
		},
		staleTime: 0,
		refetchOnWindowFocus: true
	});
}
function useAdminRecentStories() {
	return useQuery({
		queryKey: [...queryKeys.adminStories, "recent"],
		queryFn: async () => {
			const { data } = await supabase.from("stories").select("id, title, slug, status, is_premium, views, published_at").order("published_at", { ascending: false });
			return data ?? [];
		},
		staleTime: 0,
		refetchOnWindowFocus: true
	});
}
function useAdminStoriesDropdown() {
	return useQuery({
		queryKey: [...queryKeys.adminStories, "dropdown"],
		queryFn: async () => {
			const { data, error } = await supabase.from("stories").select("id, title, slug").order("title");
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		staleTime: 0,
		refetchOnWindowFocus: true
	});
}
function useAdminScenes() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: queryKeys.adminScenes,
			queryFn: async () => {
				const { data, error } = await supabase.from("scenes").select("*, chapters(title, chapter_number, stories(title, slug))").order("created_at", { ascending: false });
				if (error) throw new Error(error.message);
				return data ?? [];
			},
			staleTime: 0,
			refetchOnWindowFocus: true
		}),
		invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminScenes })
	};
}
function useAdminCharacters() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: queryKeys.adminCharacters,
			queryFn: async () => {
				const { data, error } = await supabase.from("characters").select("*, stories(title, slug)").order("sort_order");
				if (error) throw new Error(error.message);
				return data ?? [];
			},
			staleTime: 0,
			refetchOnWindowFocus: true
		}),
		invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminCharacters })
	};
}
function useAdminLocations() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: queryKeys.adminLocations,
			queryFn: async () => {
				const { data, error } = await supabase.from("locations").select("*, stories(title, slug)").order("name");
				if (error) throw new Error(error.message);
				return data ?? [];
			},
			staleTime: 0,
			refetchOnWindowFocus: true
		}),
		invalidate: () => qc.invalidateQueries({ queryKey: queryKeys.adminLocations })
	};
}
function useAdminChaptersDropdown(storyId) {
	return useQuery({
		queryKey: [
			...queryKeys.adminChapters,
			"dropdown",
			storyId
		],
		queryFn: async () => {
			let q = supabase.from("chapters").select("id, title, chapter_number, story_id").order("chapter_number");
			if (storyId) q = q.eq("story_id", storyId);
			const { data, error } = await q;
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		staleTime: 0,
		refetchOnWindowFocus: true,
		enabled: true
	});
}
function useAdminMedia(opts = {}) {
	return useQuery({
		queryKey: [...queryKeys.adminMedia, opts],
		queryFn: async () => {
			let query = supabase.from("media_assets").select("*, story:stories(id,title,slug)", { count: "exact" });
			if (opts.filterType) query = query.eq("asset_type", opts.filterType);
			if (opts.filterStatus) query = query.eq("status", opts.filterStatus);
			if (opts.filterStory) query = query.eq("story_id", opts.filterStory);
			if (opts.search) query = query.or(`title.ilike.%${opts.search}%`);
			const from = ((opts.page ?? 1) - 1) * 24;
			query = query.order("created_at", { ascending: false }).range(from, from + 23);
			const { data, error, count } = await query;
			if (error) throw new Error(error.message);
			return {
				data: data ?? [],
				count: count ?? 0
			};
		},
		staleTime: 0,
		refetchOnWindowFocus: true
	});
}
//#endregion
export { useAdminScenes as _, queryKeys as a, useAdminUsers as b, useAdminChaptersDropdown as c, useAdminCounts as d, useAdminGenres as f, useAdminRecentStories as g, useAdminNewsletter as h, invalidateStoryData as i, useAdminCharacters as l, useAdminMedia as m, invalidateGenreData as n, useAdminAnalytics as o, useAdminLocations as p, invalidateMediaData as r, useAdminChapters as s, invalidateChapterData as t, useAdminContacts as u, useAdminStories as v, useAdminStoriesDropdown as y };

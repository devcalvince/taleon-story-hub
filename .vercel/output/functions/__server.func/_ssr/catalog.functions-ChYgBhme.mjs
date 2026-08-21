import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-QX_qkvv7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog.functions-ChYgBhme.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Server-side, publishable-key client. Public catalogue reads only (RLS as anon). */
function db() {
	return createClient(process.env["SUPABASE_URL"], process.env["SUPABASE_PUBLISHABLE_KEY"], { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
var STORY_FIELDS = "id,slug,title,short_description,description,cover_url,banner_url,author,status,is_featured,is_premium,has_audio,has_video,trending_score,views,reads,listens,rating,published_at";
var SORTS = {
	trending: {
		column: "trending_score",
		ascending: false
	},
	newest: {
		column: "published_at",
		ascending: false
	},
	most_read: {
		column: "reads",
		ascending: false
	},
	most_listened: {
		column: "listens",
		ascending: false
	},
	top_rated: {
		column: "rating",
		ascending: false
	}
};
async function withGenres(rows) {
	if (!rows.length) return [];
	const ids = rows.map((r) => r.id);
	const { data } = await db().from("story_genres").select("story_id, genres(slug,name,accent)").in("story_id", ids);
	const map = /* @__PURE__ */ new Map();
	for (const row of data ?? []) {
		const list = map.get(row.story_id) ?? [];
		if (row.genres) list.push(row.genres);
		map.set(row.story_id, list);
	}
	const counts = await chapterCounts(ids);
	return rows.map((r) => ({
		...r,
		genres: map.get(r.id) ?? [],
		chapter_count: counts.get(r.id) ?? 0
	}));
}
async function chapterCounts(storyIds) {
	const { data } = await db().from("chapters").select("story_id").in("story_id", storyIds).eq("is_published", true);
	const counts = /* @__PURE__ */ new Map();
	for (const row of data ?? []) counts.set(row.story_id, (counts.get(row.story_id) ?? 0) + 1);
	return counts;
}
async function listStories(opts = {}) {
	const sort = SORTS[opts.sort ?? "trending"];
	let ids = null;
	if (opts.genre) {
		const { data } = await db().from("story_genres").select("story_id, genres!inner(slug)").eq("genres.slug", opts.genre);
		ids = (data ?? []).map((r) => r.story_id);
		if (!ids.length) return [];
	}
	let query = db().from("stories").select(STORY_FIELDS).eq("is_published", true).order(sort.column, { ascending: sort.ascending }).limit(opts.limit ?? 48);
	if (ids) query = query.in("id", ids);
	if (opts.status) query = query.eq("status", opts.status);
	if (opts.q) query = query.or(`title.ilike.%${opts.q}%,short_description.ilike.%${opts.q}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return withGenres(data ?? []);
}
async function listGenres() {
	const { data, error } = await db().from("genres").select("*").order("sort_order");
	if (error) throw new Error(error.message);
	return data ?? [];
}
async function getHome() {
	const [featuredRows, trending, newest, popular, genres] = await Promise.all([
		db().from("stories").select(STORY_FIELDS).eq("is_featured", true).eq("is_published", true).limit(1),
		listStories({
			sort: "trending",
			limit: 8
		}),
		listStories({
			sort: "newest",
			limit: 8
		}),
		listStories({
			sort: "most_read",
			limit: 6
		}),
		listGenres()
	]);
	return {
		featured: (await withGenres(featuredRows.data ?? []))[0] ?? trending[0] ?? null,
		trending,
		newest,
		popular,
		genres
	};
}
async function getStory(slug) {
	const { data: story } = await db().from("stories").select(STORY_FIELDS).eq("slug", slug).eq("is_published", true).maybeSingle();
	if (!story) return null;
	const [enriched] = await withGenres([story]);
	const [chapters, characters, videos] = await Promise.all([
		db().from("chapters").select("id,chapter_number,title,word_count,audio_url,video_url,is_premium,published_at").eq("story_id", story.id).eq("is_published", true).order("chapter_number"),
		db().from("characters").select("*").eq("story_id", story.id).order("sort_order"),
		db().from("videos").select("*").eq("story_id", story.id).eq("is_published", true)
	]);
	const genreSlugs = (enriched.genres ?? []).map((g) => g.slug);
	let related = [];
	if (genreSlugs.length) related = (await listStories({
		genre: genreSlugs[0],
		limit: 6
	})).filter((s) => s.id !== story.id).slice(0, 4);
	return {
		story: enriched,
		chapters: chapters.data ?? [],
		characters: characters.data ?? [],
		videos: videos.data ?? [],
		related
	};
}
async function getChapter(slug, chapterNumber) {
	const { data: story } = await db().from("stories").select("id,slug,title,author,cover_url,has_audio").eq("slug", slug).eq("is_published", true).maybeSingle();
	if (!story) return null;
	const { data: chapters } = await db().from("chapters").select("id,chapter_number,title,content,word_count,audio_url,video_url,media_asset_id,is_premium").eq("story_id", story.id).eq("is_published", true).order("chapter_number");
	const list = chapters ?? [];
	const index = list.findIndex((c) => c.chapter_number === chapterNumber);
	if (index === -1) return null;
	return {
		story,
		chapter: list[index],
		total: list.length,
		prev: index > 0 ? list[index - 1].chapter_number : null,
		next: index < list.length - 1 ? list[index + 1].chapter_number : null
	};
}
async function listAudio() {
	const { data } = await db().from("chapters").select("id,chapter_number,title,audio_url,video_url,media_asset_id,story_id,stories(slug,title,cover_url,author)").eq("is_published", true).order("chapter_number");
	const stories = await listStories({
		sort: "most_listened",
		limit: 12
	});
	return {
		chapters: data ?? [],
		stories: stories.filter((s) => s.has_audio)
	};
}
async function listVideos() {
	const { data } = await db().from("videos").select("*, stories(slug,title,cover_url)").eq("is_published", true).order("created_at", { ascending: false });
	return data ?? [];
}
async function searchAll(q) {
	const term = q.trim();
	if (!term) return {
		stories: [],
		chapters: [],
		characters: [],
		genres: []
	};
	const [stories, chapters, characters, genres] = await Promise.all([
		listStories({
			q: term,
			limit: 12
		}),
		db().from("chapters").select("id,title,chapter_number,stories(slug,title),media_asset_id").ilike("title", `%${term}%`).eq("is_published", true).limit(10),
		db().from("characters").select("id,name,role,stories(slug,title)").ilike("name", `%${term}%`).limit(10),
		db().from("genres").select("*").ilike("name", `%${term}%`).limit(10)
	]);
	return {
		stories,
		chapters: chapters.data ?? [],
		characters: characters.data ?? [],
		genres: genres.data ?? []
	};
}
var fetchHome_createServerFn_handler = createServerRpc({
	id: "45542b4d7e9455295ccfc71fbb3aaf52d6d252e915768984ff41c7698053ffcb",
	name: "fetchHome",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchHome.__executeServer(opts));
var fetchHome = createServerFn({ method: "GET" }).handler(fetchHome_createServerFn_handler, async () => getHome());
var fetchGenres_createServerFn_handler = createServerRpc({
	id: "ad648885fb2cbfd310ac1a20ed3fc846844a8d4970bec7a4c244e9544ef84258",
	name: "fetchGenres",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchGenres.__executeServer(opts));
var fetchGenres = createServerFn({ method: "GET" }).handler(fetchGenres_createServerFn_handler, async () => listGenres());
var fetchStories_createServerFn_handler = createServerRpc({
	id: "8566508aa4d5fe91ad57a2f6071a6dce2e618b6d82abee70e44fb42d417c743b",
	name: "fetchStories",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchStories.__executeServer(opts));
var fetchStories = createServerFn({ method: "GET" }).validator((data) => data ?? {}).handler(fetchStories_createServerFn_handler, async ({ data }) => listStories(data));
var fetchStory_createServerFn_handler = createServerRpc({
	id: "6807633485cae9a9e8f528393cc925a14cf6facc250b00f305015f2a0a5b2a46",
	name: "fetchStory",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchStory.__executeServer(opts));
var fetchStory = createServerFn({ method: "GET" }).validator((data) => data).handler(fetchStory_createServerFn_handler, async ({ data }) => getStory(data.slug));
var fetchChapter_createServerFn_handler = createServerRpc({
	id: "c2d008e00f69c4f19ff38bc311ebbd6d95a0294961431580a7d4e471be88f927",
	name: "fetchChapter",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchChapter.__executeServer(opts));
var fetchChapter = createServerFn({ method: "GET" }).validator((data) => data).handler(fetchChapter_createServerFn_handler, async ({ data }) => getChapter(data.slug, data.chapterNumber));
var fetchAudio_createServerFn_handler = createServerRpc({
	id: "57439f67b857ba20b4966dd61bbcd7fe66f05ede7f039ce5697da86858bf4898",
	name: "fetchAudio",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchAudio.__executeServer(opts));
var fetchAudio = createServerFn({ method: "GET" }).handler(fetchAudio_createServerFn_handler, async () => listAudio());
var fetchVideos_createServerFn_handler = createServerRpc({
	id: "758363bc23b450c329ceb6abb739d3c0f5b173e62e720f53f36d5ea83b820b9e",
	name: "fetchVideos",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchVideos.__executeServer(opts));
var fetchVideos = createServerFn({ method: "GET" }).handler(fetchVideos_createServerFn_handler, async () => listVideos());
var fetchSearch_createServerFn_handler = createServerRpc({
	id: "0504c74ebe6f22fd5ba858d4261545edb46008ca419c59379df73f7b5fbdf926",
	name: "fetchSearch",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => fetchSearch.__executeServer(opts));
var fetchSearch = createServerFn({ method: "GET" }).validator((data) => data).handler(fetchSearch_createServerFn_handler, async ({ data }) => searchAll(data.q));
//#endregion
export { fetchAudio_createServerFn_handler, fetchChapter_createServerFn_handler, fetchGenres_createServerFn_handler, fetchHome_createServerFn_handler, fetchSearch_createServerFn_handler, fetchStories_createServerFn_handler, fetchStory_createServerFn_handler, fetchVideos_createServerFn_handler };

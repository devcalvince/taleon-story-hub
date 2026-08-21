import { createClient } from "@supabase/supabase-js";

/** Server-side, publishable-key client. Public catalogue reads only (RLS as anon). */
function db() {
  return createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const STORY_FIELDS =
  "id,slug,title,short_description,description,cover_url,banner_url,author,status,is_featured,is_premium,has_audio,has_video,trending_score,views,reads,listens,rating,published_at";

export type SortKey = "trending" | "newest" | "most_read" | "most_listened" | "top_rated";

const SORTS: Record<SortKey, { column: string; ascending: boolean }> = {
  trending: { column: "trending_score", ascending: false },
  newest: { column: "published_at", ascending: false },
  most_read: { column: "reads", ascending: false },
  most_listened: { column: "listens", ascending: false },
  top_rated: { column: "rating", ascending: false },
};

async function withGenres(rows: any[]) {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const { data } = await db()
    .from("story_genres")
    .select("story_id, genres(slug,name,accent)")
    .in("story_id", ids);
  const map = new Map<string, any[]>();
  for (const row of data ?? []) {
    const list = map.get(row.story_id) ?? [];
    if (row.genres) list.push(row.genres);
    map.set(row.story_id, list);
  }
  const counts = await chapterCounts(ids);
  return rows.map((r) => ({
    ...r,
    genres: map.get(r.id) ?? [],
    chapter_count: counts.get(r.id) ?? 0,
  }));
}

async function chapterCounts(storyIds: string[]) {
  const { data } = await db()
    .from("chapters")
    .select("story_id")
    .in("story_id", storyIds)
    .eq("is_published", true);
  const counts = new Map<string, number>();
  for (const row of data ?? []) counts.set(row.story_id, (counts.get(row.story_id) ?? 0) + 1);
  return counts;
}

export async function listStories(
  opts: {
    sort?: SortKey;
    genre?: string;
    q?: string;
    status?: string;
    limit?: number;
  } = {},
) {
  const sort = SORTS[opts.sort ?? "trending"];
  let ids: string[] | null = null;
  if (opts.genre) {
    const { data } = await db()
      .from("story_genres")
      .select("story_id, genres!inner(slug)")
      .eq("genres.slug", opts.genre);
    ids = (data ?? []).map((r: any) => r.story_id);
    if (!ids.length) return [];
  }
  let query = db()
    .from("stories")
    .select(STORY_FIELDS)
    .eq("is_published", true)
    .order(sort.column, { ascending: sort.ascending })
    .limit(opts.limit ?? 48);
  if (ids) query = query.in("id", ids);
  if (opts.status) query = query.eq("status", opts.status);
  if (opts.q) query = query.or(`title.ilike.%${opts.q}%,short_description.ilike.%${opts.q}%`);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return withGenres(data ?? []);
}

export async function listGenres() {
  const { data, error } = await db().from("genres").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getHome() {
  const [featuredRows, trending, newest, popular, genres] = await Promise.all([
    db()
      .from("stories")
      .select(STORY_FIELDS)
      .eq("is_featured", true)
      .eq("is_published", true)
      .limit(1),
    listStories({ sort: "trending", limit: 8 }),
    listStories({ sort: "newest", limit: 8 }),
    listStories({ sort: "most_read", limit: 6 }),
    listGenres(),
  ]);
  const featured = (await withGenres(featuredRows.data ?? []))[0] ?? trending[0] ?? null;
  return { featured, trending, newest, popular, genres };
}

export async function getStory(slug: string) {
  const { data: story } = await db()
    .from("stories")
    .select(STORY_FIELDS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!story) return null;
  const [enriched] = await withGenres([story]);
  const [chapters, characters, videos] = await Promise.all([
    db()
      .from("chapters")
      .select("id,chapter_number,title,word_count,audio_url,video_url,is_premium,published_at")
      .eq("story_id", story.id)
      .eq("is_published", true)
      .order("chapter_number"),
    db().from("characters").select("*").eq("story_id", story.id).order("sort_order"),
    db().from("videos").select("*").eq("story_id", story.id).eq("is_published", true),
  ]);
  const genreSlugs = (enriched.genres ?? []).map((g: any) => g.slug);
  let related: any[] = [];
  if (genreSlugs.length) {
    const all = await listStories({ genre: genreSlugs[0], limit: 6 });
    related = all.filter((s: any) => s.id !== story.id).slice(0, 4);
  }
  return {
    story: enriched,
    chapters: chapters.data ?? [],
    characters: characters.data ?? [],
    videos: videos.data ?? [],
    related,
  };
}

export async function getChapter(slug: string, chapterNumber: number) {
  // Genre is embedded through story_genres in the same query — no extra
  // roundtrip — so chapter analytics can attribute story_genre.
  const { data: story } = await db()
    .from("stories")
    .select("id,slug,title,author,cover_url,has_audio,story_genres(genres(slug,name))")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!story) return null;
  const embedded = story as typeof story & {
    story_genres?: Array<{ genres?: { slug?: string; name?: string } | null } | null>;
  };
  const genreSlug = embedded.story_genres?.[0]?.genres?.slug ?? null;
  const storyWithGenre = { ...story, genre: genreSlug };
  const { data: chapters } = await db()
    .from("chapters")
    .select("id,chapter_number,title,content,word_count,audio_url,video_url,media_asset_id,is_premium")
    .eq("story_id", story.id)
    .eq("is_published", true)
    .order("chapter_number");
  const list = chapters ?? [];
  const index = list.findIndex((c) => c.chapter_number === chapterNumber);
  if (index === -1) return null;
  return {
    story: storyWithGenre,
    chapter: list[index],
    total: list.length,
    prev: index > 0 ? list[index - 1]!.chapter_number : null,
    next: index < list.length - 1 ? list[index + 1]!.chapter_number : null,
  };
}

export async function listAudio() {
  const { data } = await db()
    .from("chapters")
    .select(
      "id,chapter_number,title,audio_url,video_url,media_asset_id,story_id,stories(slug,title,cover_url,author)",
    )
    .eq("is_published", true)
    .order("chapter_number");
  const stories = await listStories({ sort: "most_listened", limit: 12 });
  return { chapters: data ?? [], stories: stories.filter((s: any) => s.has_audio) };
}

export async function listVideos() {
  const { data } = await db()
    .from("videos")
    .select("*, stories(slug,title,cover_url)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function searchAll(q: string) {
  const term = q.trim();
  if (!term) return { stories: [], chapters: [], characters: [], genres: [] };
  const [stories, chapters, characters, genres] = await Promise.all([
    listStories({ q: term, limit: 12 }),
    db()
      .from("chapters")
      .select("id,title,chapter_number,stories(slug,title),media_asset_id")
      .ilike("title", `%${term}%`)
      .eq("is_published", true)
      .limit(10),
    db()
      .from("characters")
      .select("id,name,role,stories(slug,title)")
      .ilike("name", `%${term}%`)
      .limit(10),
    db().from("genres").select("*").ilike("name", `%${term}%`).limit(10),
  ]);
  return {
    stories,
    chapters: chapters.data ?? [],
    characters: characters.data ?? [],
    genres: genres.data ?? [],
  };
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Headphones, Heart, Play, Plus } from "lucide-react";
import { fetchStory } from "@/lib/catalog.functions";
import { bannerFor, coverFor } from "@/lib/artwork";
import { StoryCard, type StorySummary } from "@/components/site/StoryCard";
import { ShareRow } from "@/components/site/ShareRow";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/story/$slug")({
  loader: async ({ params }) => {
    const data = await fetchStory({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Story unavailable | Taleon Media" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.story;
    const title = `${s.title} | Taleon Media`;
    const description = s.short_description ?? "A Taleon Original story.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/story/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/story/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: s.title,
            author: { "@type": "Organization", name: s.author },
            description,
          }),
        },
      ],
    };
  },
  component: StoryPage,
});

function StoryPage() {
  const { story, chapters, characters, videos, related } = Route.useLoaderData();
  const { user } = useSession();
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    track("story_view", { storyId: story.id });
  }, [story.id]);

  useEffect(() => {
    if (!user) return;
    supabase.from("follows").select("story_id").eq("story_id", story.id).maybeSingle().then(({ data }) => setFollowing(Boolean(data)));
    supabase.from("bookmarks").select("story_id").eq("story_id", story.id).maybeSingle().then(({ data }) => setSaved(Boolean(data)));
  }, [user, story.id]);

  async function toggleFollow() {
    if (!user) return;
    if (following) {
      await supabase.from("follows").delete().eq("story_id", story.id).eq("user_id", user.id);
      setFollowing(false);
    } else {
      await supabase.from("follows").insert({ story_id: story.id, user_id: user.id });
      setFollowing(true);
      track("story_followed", { storyId: story.id });
    }
  }

  async function toggleSave() {
    if (!user) return;
    if (saved) {
      await supabase.from("bookmarks").delete().eq("story_id", story.id).eq("user_id", user.id);
      setSaved(false);
    } else {
      await supabase.from("bookmarks").insert({ story_id: story.id, user_id: user.id });
      setSaved(true);
      track("story_saved", { storyId: story.id });
    }
  }

  const firstChapter = chapters[0]?.chapter_number ?? 1;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={bannerFor(story)}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[260px_1fr] md:py-20">
          <img
            src={coverFor(story)}
            alt={`Cover art for ${story.title}`}
            width={768}
            height={1024}
            className="w-40 rounded-lg border border-border shadow-[var(--shadow-cinema)] md:w-full"
          />
          <div>
            <p className="eyebrow">{story.author}</p>
            <h1 className="mt-2 text-4xl tracking-wide sm:text-5xl">{story.title}</h1>
            <p className="mt-3 text-xs tracking-[0.2em] text-gold uppercase">
              {(story.genres ?? []).map((g: any) => g.name).join(" • ")}
            </p>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground">{story.description}</p>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="eyebrow">Chapters</dt>
                <dd>{chapters.length}</dd>
              </div>
              <div>
                <dt className="eyebrow">Status</dt>
                <dd className="capitalize">{String(story.status).replace("_", " ")}</dd>
              </div>
              <div>
                <dt className="eyebrow">Audio</dt>
                <dd>{story.has_audio ? "Available" : "In production"}</dd>
              </div>
              <div>
                <dt className="eyebrow">Video</dt>
                <dd>{story.has_video ? "Available" : "In production"}</dd>
              </div>
              <div>
                <dt className="eyebrow">Rating</dt>
                <dd>{Number(story.rating) > 0 ? `${story.rating} / 5` : "Unrated"}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              {chapters.length > 0 && (
                <Link
                  to="/story/$slug/chapter/$chapterNumber"
                  params={{ slug: story.slug, chapterNumber: String(firstChapter) }}
                  className="flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90"
                >
                  <BookOpen className="size-4" /> Start Reading
                </Link>
              )}
              <Link
                to="/audio"
                className="flex items-center gap-2 rounded-md border border-border-strong px-6 py-3 text-sm tracking-wider uppercase hover:bg-surface-2"
              >
                <Headphones className="size-4" /> Listen
              </Link>
              <Link
                to="/watch"
                className="flex items-center gap-2 rounded-md border border-border-strong px-6 py-3 text-sm tracking-wider uppercase hover:bg-surface-2"
              >
                <Play className="size-4" /> Watch
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {user ? (
                <>
                  <button
                    onClick={toggleFollow}
                    className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong"
                  >
                    <Plus className="size-4" /> {following ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={toggleSave}
                    className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong"
                  >
                    <Heart className={`size-4 ${saved ? "fill-current text-gold" : ""}`} /> {saved ? "Saved" : "Save"}
                  </button>
                </>
              ) : (
                <Link to="/login" className="rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong">
                  Sign in to follow and save
                </Link>
              )}
            </div>

            <div className="mt-6">
              <ShareRow title={story.title} storyId={story.id} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {characters.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl tracking-wide">Characters</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((c: any) => (
                <div key={c.id} className="panel p-5">
                  <p className="font-display text-lg">{c.name}</p>
                  <p className="text-xs tracking-widest text-gold uppercase">{c.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{c.bio}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-14">
          <h2 className="text-2xl tracking-wide">Chapters</h2>
          {chapters.length === 0 ? (
            <p className="panel mt-5 px-6 py-12 text-center text-sm text-muted-foreground">
              The first chapter is being finished. Follow this story to be notified.
            </p>
          ) : (
            <ol className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {chapters.map((c: any) => (
                <li key={c.id}>
                  <Link
                    to="/story/$slug/chapter/$chapterNumber"
                    params={{ slug: story.slug, chapterNumber: String(c.chapter_number) }}
                    className="flex items-center gap-4 bg-surface-2/50 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <span className="font-display w-10 shrink-0 text-sm text-muted-foreground">
                      {String(c.chapter_number).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{c.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {c.word_count} words{c.audio_url ? " • Audio" : ""}
                      </span>
                    </span>
                    {c.is_premium && (
                      <span className="rounded-full border border-gold px-2.5 py-1 text-[10px] tracking-widest text-gold uppercase">
                        Plus
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="mb-14">
          <h2 className="text-2xl tracking-wide">Audio</h2>
          {chapters.some((c: any) => c.audio_url) ? (
            <ul className="mt-5 space-y-2">
              {chapters
                .filter((c: any) => c.audio_url)
                .map((c: any) => (
                  <li key={c.id} className="panel px-5 py-4 text-sm">
                    Chapter {c.chapter_number} — {c.title}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="panel mt-5 px-6 py-10 text-center text-sm text-muted-foreground">
              Narration for this story is in production. Audio chapters will appear here on release.
            </p>
          )}
        </section>

        <section className="mb-14">
          <h2 className="text-2xl tracking-wide">Videos</h2>
          {videos.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v: any) => (
                <article key={v.id} className="panel overflow-hidden">
                  <div className="flex aspect-video items-center justify-center bg-surface">
                    <Play className="size-6 text-gold" aria-hidden />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium">{v.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{v.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="panel mt-5 px-6 py-10 text-center text-sm text-muted-foreground">
              No video yet for this story.
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-2xl tracking-wide">Related Stories</h2>
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {(related as StorySummary[]).map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

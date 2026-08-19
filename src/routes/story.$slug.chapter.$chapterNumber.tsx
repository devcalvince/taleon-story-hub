import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Headphones, Minus, Plus, Sun } from "lucide-react";
import { fetchChapter } from "@/lib/catalog.functions";
import { ShareRow } from "@/components/site/ShareRow";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/story/$slug/chapter/$chapterNumber")({
  loader: async ({ params }) => {
    const data = await fetchChapter({
      data: { slug: params.slug, chapterNumber: Number(params.chapterNumber) },
    });
    if (!data || !data.chapter) throw notFound();
    return { ...data, chapter: data.chapter! };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Chapter unavailable | Taleon Media" }, { name: "robots", content: "noindex" }] };
    }
    const { story, chapter } = loaderData;
    const title = `${story.title} — Chapter ${chapter.chapter_number} | Taleon Media`;
    const description = `Read Chapter ${chapter.chapter_number}, "${chapter.title}", of ${story.title} on Taleon Media.`;
    const url = `/story/${params.slug}/chapter/${params.chapterNumber}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ChapterPage,
});

function ChapterPage() {
  const { story, chapter, prev, next, total } = Route.useLoaderData();
  const { user } = useSession();
  const [fontSize, setFontSize] = useState(18);
  const [wide, setWide] = useState(false);
  const [light, setLight] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    track("chapter_started", { storyId: story.id, chapterId: chapter.id });
  }, [story.id, chapter.id]);

  useEffect(() => {
    function onScroll() {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0;
      setProgress(pct);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapter.id]);

  // Save reading position for signed-in members.
  useEffect(() => {
    if (!user || progress < 5) return;
    const timer = setTimeout(() => {
      supabase.from("reading_progress").upsert({
        user_id: user.id,
        story_id: story.id,
        chapter_id: chapter.id,
        chapter_number: chapter.chapter_number,
        percent: Math.round(progress),
        completed: progress > 92,
        updated_at: new Date().toISOString(),
      });
      if (progress > 92) track("chapter_completed", { storyId: story.id, chapterId: chapter.id });
    }, 4000);
    return () => clearTimeout(timer);
  }, [user, progress, story.id, chapter.id, chapter.chapter_number]);

  const paragraphs = String(chapter.content).split(/\n\s*\n/).filter(Boolean);

  return (
    <div className={light ? "reader-light bg-background text-foreground" : ""}>
      <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent" aria-hidden>
        <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className={`mx-auto px-4 pt-10 pb-24 sm:px-6 ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
        <Link to="/story/$slug" params={{ slug: story.slug }} className="eyebrow hover:text-foreground">
          ← {story.title}
        </Link>

        <header className="mt-6 border-b border-border pb-8">
          <p className="text-xs tracking-[0.28em] text-gold uppercase">
            Chapter {chapter.chapter_number} of {total}
          </p>
          <h1 className="mt-3 text-3xl tracking-wide sm:text-4xl">{chapter.title}</h1>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 rounded-md border border-border p-1">
            <button onClick={() => setFontSize((s) => Math.max(15, s - 1))} aria-label="Decrease font size" className="p-1.5">
              <Minus className="size-3.5" />
            </button>
            <span className="px-1 text-muted-foreground">Aa</span>
            <button onClick={() => setFontSize((s) => Math.min(26, s + 1))} aria-label="Increase font size" className="p-1.5">
              <Plus className="size-3.5" />
            </button>
          </div>
          <button
            onClick={() => setWide((v) => !v)}
            className="rounded-md border border-border px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            {wide ? "Narrow" : "Wide"}
          </button>
          <button
            onClick={() => setLight((v) => !v)}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-muted-foreground hover:text-foreground"
            aria-pressed={light}
          >
            <Sun className="size-3.5" /> {light ? "Dark mode" : "Light mode"}
          </button>
          {user && (
            <button
              onClick={async () => {
                await supabase.from("bookmarks").upsert({
                  user_id: user.id,
                  story_id: story.id,
                  chapter_id: chapter.id,
                });
                setBookmarked(true);
              }}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Bookmark className={`size-3.5 ${bookmarked ? "fill-current text-gold" : ""}`} />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          )}
        </div>

        {chapter.is_premium ? (
          <div className="panel mt-10 px-6 py-14 text-center">
            <p className="eyebrow">Taleon Plus</p>
            <h2 className="mt-3 text-2xl">This chapter is for members</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Members read new chapters first, ad-free, with full narration.
            </p>
            <Link
              to="/pricing"
              className="mt-6 inline-block rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase"
            >
              See membership
            </Link>
          </div>
        ) : (
          <article
            className="mt-10 space-y-6 leading-[1.85]"
            style={{ fontSize: `${fontSize}px` }}
          >
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
        )}

        {chapter.audio_url ? (
          <a
            href={chapter.audio_url}
            className="mt-10 flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm hover:border-border-strong"
          >
            <Headphones className="size-4" /> Listen to this chapter
          </a>
        ) : (
          <Link to="/audio" className="mt-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Headphones className="size-4" /> Narration coming soon — browse the audio library
          </Link>
        )}

        <div className="mt-10">
          <ShareRow title={`${story.title} — Chapter ${chapter.chapter_number}`} storyId={story.id} />
        </div>

        <nav className="mt-12 flex items-center justify-between border-t border-border pt-8" aria-label="Chapter navigation">
          {prev ? (
            <Link
              to="/story/$slug/chapter/$chapterNumber"
              params={{ slug: story.slug, chapterNumber: String(prev) }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Previous
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/story/$slug/chapter/$chapterNumber"
              params={{ slug: story.slug, chapterNumber: String(next) }}
              className="flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90"
            >
              Continue reading <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Link to="/story/$slug" params={{ slug: story.slug }} className="text-sm text-muted-foreground hover:text-foreground">
              Back to story
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

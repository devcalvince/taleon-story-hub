import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Headphones, Play } from "lucide-react";
import { fetchHome } from "@/lib/catalog.functions";
import { bannerFor } from "@/lib/artwork";
import { StoryCard, StoryGrid, type StorySummary } from "@/components/site/StoryCard";
import { Section } from "@/components/site/Section";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  loader: () => fetchHome(),
  head: () => ({
    meta: [
      { title: "Taleon Media — Stories that come alive." },
      {
        name: "description",
        content:
          "Discover Taleon Originals: cinematic stories you can read, listen to and watch. Start with The Last Signal.",
      },
      { property: "og:title", content: "Taleon Media — Stories that come alive." },
      {
        property: "og:description",
        content: "Cinematic original stories to read, listen to and watch.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { featured, trending, newest, popular, genres } = Route.useLoaderData();

  return (
    <>
      {featured && <Hero story={featured as StorySummary & { description?: string }} />}

      <ContinueReading />

      <Section title="Trending" eyebrow="Right now" href="/stories" hrefLabel="All stories">
        <StoryGrid stories={trending as StorySummary[]} />
      </Section>

      <Section title="New Stories" eyebrow="Just released" href="/stories">
        <StoryGrid stories={newest as StorySummary[]} />
      </Section>

      <Formats />

      <Section title="Popular This Week" eyebrow="Most read">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(popular as StorySummary[]).map((s, i) => (
            <Link
              key={s.id}
              to="/story/$slug"
              params={{ slug: s.slug }}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface-2/60 p-4 transition-colors hover:border-border-strong"
            >
              <span className="font-display text-2xl text-gold">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{s.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {(s.genres ?? []).map((g) => g.name).join(" / ")}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Genres" eyebrow="Find your world" href="/genres">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {genres.map((g: any) => (
            <Link
              key={g.id}
              to="/stories"
              search={{ genre: g.slug }}
              className="group relative overflow-hidden rounded-lg border border-border bg-surface-2 px-4 py-8 text-center transition-colors hover:border-border-strong"
            >
              <span
                className="absolute inset-x-0 bottom-0 h-px opacity-60"
                style={{ background: g.accent }}
                aria-hidden
              />
              <span className="font-display text-sm tracking-wide">{g.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Originals stories={[...(trending as StorySummary[])].slice(0, 6)} />

      <Newsletter />
    </>
  );
}

function Hero({ story }: { story: StorySummary & { description?: string } }) {
  useEffect(() => {
    track("landing_page_view", { metadata: { page: "home" } });
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={bannerFor(story)}
        alt={`Key art for ${story.title}`}
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} aria-hidden />
      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pt-28 pb-16 sm:px-6 md:min-h-[86vh]">
        <p className="eyebrow">Taleon Originals</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] tracking-wide sm:text-6xl md:text-7xl">
          {story.title}
        </h1>
        <p className="mt-4 text-xs tracking-[0.2em] text-gold uppercase">
          {(story.genres ?? []).map((g) => g.name).join(" • ")}
        </p>
        <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">{story.short_description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/story/$slug/chapter/$chapterNumber"
            params={{ slug: story.slug, chapterNumber: "1" }}
            className="flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90"
          >
            <BookOpen className="size-4" /> Read Story
          </Link>
          <Link
            to="/audio"
            className="flex items-center gap-2 rounded-md border border-border-strong bg-background/40 px-6 py-3 text-sm tracking-wider uppercase backdrop-blur hover:bg-background/70"
          >
            <Headphones className="size-4" /> Listen
          </Link>
          <Link
            to="/watch"
            className="flex items-center gap-2 rounded-md border border-border-strong bg-background/40 px-6 py-3 text-sm tracking-wider uppercase backdrop-blur hover:bg-background/70"
          >
            <Play className="size-4" /> Watch
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContinueReading() {
  const { user } = useSession();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setRows([]);
      return;
    }
    supabase
      .from("reading_progress")
      .select("chapter_number, percent, stories(slug,title,cover_url)")
      .order("updated_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setRows(data ?? []));
  }, [user]);

  if (!user || !rows.length) return null;

  return (
    <Section title="Continue Reading" eyebrow="Pick up where you stopped" href="/continue">
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map((row) => (
          <div key={row.stories?.slug} className="panel flex flex-col gap-3 p-5">
            <p className="font-display text-lg">{row.stories?.title}</p>
            <p className="text-sm text-muted-foreground">Chapter {row.chapter_number}</p>
            <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-gold" style={{ width: `${Math.min(100, Number(row.percent) || 0)}%` }} />
            </div>
            <Link
              to="/story/$slug/chapter/$chapterNumber"
              params={{ slug: row.stories?.slug, chapterNumber: String(row.chapter_number) }}
              className="mt-1 text-xs tracking-widest text-gold uppercase hover:opacity-80"
            >
              Continue reading
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Formats() {
  const items = [
    { icon: BookOpen, title: "Read", body: "Serialized stories and novels, released chapter by chapter.", to: "/stories" },
    { icon: Headphones, title: "Listen", body: "Narrated chapters, audiobooks and audio drama.", to: "/audio" },
    { icon: Play, title: "Watch", body: "Cinematic story videos, trailers and adaptations.", to: "/watch" },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
        {items.map((item) => (
          <Link key={item.title} to={item.to} className="group bg-surface-2 p-8 transition-colors hover:bg-surface">
            <item.icon className="size-5 text-gold" aria-hidden />
            <h2 className="mt-5 text-2xl tracking-[0.2em] uppercase">{item.title}</h2>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{item.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Originals({ stories }: { stories: StorySummary[] }) {
  return (
    <section className="relative border-y border-border bg-surface-2/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="eyebrow">Original intellectual property</p>
        <h2 className="mt-2 text-3xl tracking-wide sm:text-4xl">
          <span className="gold-text">Taleon Originals</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          Worlds created, written and produced in-house — built to be read, heard and seen.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {stories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
      <h2 className="text-3xl tracking-wide">Never miss the next chapter.</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Join Taleon for new chapters, narrated releases and story videos.
      </p>
      <form
        className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return;
          setDone(true);
        }}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
        />
        <button className="rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90">
          Join Taleon
        </button>
      </form>
      {done && <p className="mt-4 text-sm text-gold">You're on the list. Welcome to Taleon.</p>}
    </section>
  );
}

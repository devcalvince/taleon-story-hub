import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { fetchAudio } from "@/lib/catalog.functions";
import { PageHeader } from "@/components/site/Section";
import { AudioPlayer, type AudioTrack } from "@/components/site/AudioPlayer";
import { StoryGrid, type StorySummary } from "@/components/site/StoryCard";

export const Route = createFileRoute("/audio")({
  loader: () => fetchAudio(),
  head: () => ({
    meta: [
      { title: "Audio Library | Taleon Media" },
      { name: "description", content: "Listen to narrated Taleon chapters, audiobooks and audio drama." },
      { property: "og:title", content: "Audio Library | Taleon Media" },
      { property: "og:description", content: "Narrated Taleon stories and audiobooks." },
      { property: "og:url", content: "/audio" },
    ],
    links: [{ rel: "canonical", href: "/audio" }],
  }),
  component: AudioPage,
});

function AudioPage() {
  const { chapters, stories } = Route.useLoaderData();
  const [index, setIndex] = useState(0);

  const tracks: AudioTrack[] = (chapters as any[]).map((c) => ({
    id: c.id,
    title: `Chapter ${c.chapter_number} — ${c.title}`,
    subtitle: c.stories?.title ?? "",
    src: c.audio_url,
    storyId: c.story_id,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Listen"
        title="Audio Library"
        lede="Narrated chapters and audiobooks from the Taleon catalogue. Your place is saved automatically when you're signed in."
      />

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_380px]">
        <section>
          <h2 className="text-xl tracking-wide">Chapters</h2>
          {tracks.length === 0 ? (
            <p className="panel mt-4 px-6 py-14 text-center text-sm text-muted-foreground">
              No narrated chapters are published yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {tracks.map((t, i) => (
                <li key={t.id}>
                  <button
                    onClick={() => setIndex(i)}
                    className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${i === index ? "bg-surface-2" : "bg-surface-2/40 hover:bg-surface-2"}`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{t.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{t.subtitle}</span>
                    </span>
                    <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                      {t.src ? "Play" : "Soon"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AudioPlayer
            track={tracks[index] ?? null}
            {...(index > 0 ? { onPrev: () => setIndex((i) => i - 1) } : {})}
            {...(index < tracks.length - 1 ? { onNext: () => setIndex((i) => i + 1) } : {})}
          />
        </aside>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <h2 className="text-xl tracking-wide">Stories with narration</h2>
        <div className="mt-5">
          <StoryGrid
            stories={stories as StorySummary[]}
            empty="Narration is in production for the first Taleon Originals."
          />
        </div>
      </section>
    </>
  );
}

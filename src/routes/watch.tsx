import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { fetchVideos } from "@/lib/catalog.functions";
import { EmptyState, PageHeader } from "@/components/site/Section";

export const Route = createFileRoute("/watch")({
  loader: () => fetchVideos(),
  head: () => ({
    meta: [
      { title: "Watch | Taleon Media" },
      { name: "description", content: "Story trailers, cinematic chapters and shorts from Taleon Originals." },
      { property: "og:title", content: "Watch | Taleon Media" },
      { property: "og:description", content: "Cinematic story videos from Taleon Originals." },
      { property: "og:url", content: "/watch" },
    ],
    links: [{ rel: "canonical", href: "/watch" }],
  }),
  component: WatchPage,
});

function WatchPage() {
  const videos = Route.useLoaderData() as any[];

  return (
    <>
      <PageHeader eyebrow="Watch" title="Story Videos" lede="Trailers, cinematic chapters and shorts from the Taleon universe." />
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        {videos.length === 0 ? (
          <EmptyState title="No videos published yet" body="Taleon story videos are in production. Follow @taleonmedia for release news." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <article key={v.id} className="panel overflow-hidden">
                <div className="relative flex aspect-video items-center justify-center bg-surface">
                  <Play className="size-8 text-gold" aria-hidden />
                  <span className="absolute right-3 bottom-3 rounded bg-background/80 px-2 py-1 text-[10px] tracking-widest uppercase">
                    {v.kind}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-base leading-tight font-medium">{v.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                  {v.stories?.slug && (
                    <Link
                      to="/story/$slug"
                      params={{ slug: v.stories.slug }}
                      className="mt-4 inline-block text-xs tracking-widest text-gold uppercase hover:opacity-80"
                    >
                      Related story
                    </Link>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Playback opens when this release goes live.
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

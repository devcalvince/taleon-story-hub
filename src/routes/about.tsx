import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Taleon Media" },
      {
        name: "description",
        content:
          "Taleon Media is an original digital storytelling and entertainment company creating worlds to read, hear and watch.",
      },
      { property: "og:title", content: "About | Taleon Media" },
      { property: "og:description", content: "An original storytelling and entertainment company." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Stories that come alive."
        lede="Taleon Media is an original digital storytelling and entertainment company."
      />
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-20 text-base leading-relaxed text-muted-foreground sm:px-6">
        <p>
          We create original worlds and release them in the three ways people actually experience stories today:
          reading, listening and watching. Every Taleon Original is written, produced and owned in-house.
        </p>
        <p>
          Our first flagship world is <span className="text-foreground">The Last Signal</span> — a sci-fi mystery set in
          Nairobi in 2047, released chapter by chapter, with narration and cinematic adaptations following each release.
        </p>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {[
            { k: "Read", v: "Serialized stories and novels" },
            { k: "Listen", v: "Narrated chapters and audiobooks" },
            { k: "Watch", v: "Cinematic story videos" },
          ].map((i) => (
            <div key={i.k} className="bg-surface-2 p-6">
              <p className="font-display text-lg tracking-[0.2em] text-foreground uppercase">{i.k}</p>
              <p className="mt-2 text-sm">{i.v}</p>
            </div>
          ))}
        </div>
        <p>
          Taleon is built for a mobile-first audience discovering stories on TikTok, Instagram and YouTube — and built
          to grow into a full storytelling ecosystem with membership, community and a mobile app.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/stories" className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground">
            Explore the catalogue
          </Link>
          <Link to="/contact" className="rounded-md border border-border px-6 py-3 text-sm">
            Work with us
          </Link>
        </div>
      </div>
    </>
  );
}

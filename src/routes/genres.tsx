import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchGenres } from "@/lib/catalog.functions";
import { PageHeader } from "@/components/site/Section";

export const Route = createFileRoute("/genres")({
  loader: () => fetchGenres(),
  head: () => ({
    meta: [
      { title: "Genres | Taleon Media" },
      { name: "description", content: "Explore Taleon stories by genre — sci-fi, horror, romance, African stories and more." },
      { property: "og:title", content: "Genres | Taleon Media" },
      { property: "og:description", content: "Explore Taleon stories by genre." },
      { property: "og:url", content: "/genres" },
    ],
    links: [{ rel: "canonical", href: "/genres" }],
  }),
  component: GenresPage,
});

function GenresPage() {
  const genres = Route.useLoaderData();

  return (
    <>
      <PageHeader eyebrow="Discover" title="Genres" lede="Choose the kind of world you want to disappear into." />
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {genres.map((g: any) => (
          <Link
            key={g.id}
            to="/stories"
            search={{ genre: g.slug }}
            className="group relative overflow-hidden rounded-lg border border-border bg-surface-2 p-8 transition-colors hover:border-border-strong"
          >
            <span
              className="absolute top-0 left-0 h-full w-1 opacity-70 transition-opacity group-hover:opacity-100"
              style={{ background: g.accent }}
              aria-hidden
            />
            <h2 className="text-2xl tracking-wide">{g.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

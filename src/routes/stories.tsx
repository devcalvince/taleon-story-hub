import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { fetchGenres, fetchStories } from "@/lib/catalog.functions";
import { StoryGrid, type StorySummary } from "@/components/site/StoryCard";
import { PageHeader } from "@/components/site/Section";

type StoriesSearch = {
  genre?: string | undefined;
  sort?: string | undefined;
  q?: string | undefined;
  status?: string | undefined;
};

const SORTS = [
  { key: "trending", label: "Trending" },
  { key: "newest", label: "Newest" },
  { key: "most_read", label: "Most Read" },
  { key: "most_listened", label: "Most Listened" },
  { key: "top_rated", label: "Highest Rated" },
] as const;

export const Route = createFileRoute("/stories")({
  validateSearch: (search: Record<string, unknown>): StoriesSearch => ({
    genre: typeof search["genre"] === "string" ? (search["genre"] as string) : undefined,
    sort: typeof search["sort"] === "string" ? (search["sort"] as string) : undefined,
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
    status: typeof search["status"] === "string" ? (search["status"] as string) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({
    stories: await fetchStories({ data: deps as never }),
    genres: await fetchGenres(),
  }),
  head: () => ({
    meta: [
      { title: "All Stories | Taleon Media" },
      {
        name: "description",
        content:
          "Browse the full Taleon catalogue — original serialized stories, audiobooks and story videos.",
      },
      { property: "og:title", content: "All Stories | Taleon Media" },
      { property: "og:description", content: "Browse every Taleon original story." },
      { property: "og:url", content: "/stories" },
    ],
    links: [{ rel: "canonical", href: "/stories" }],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const { stories, genres } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/stories" });

  const setSearch = (next: Partial<StoriesSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Stories"
        lede="Every world Taleon has opened so far."
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearch({ genre: undefined })}
              className={`rounded-md border px-3 py-1.5 text-xs ${!search.genre ? "border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              All genres
            </button>
            {genres.map((g: any) => (
              <button
                key={g.id}
                onClick={() => setSearch({ genre: g.slug })}
                className={`rounded-md border px-3 py-1.5 text-xs ${search.genre === g.slug ? "border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 lg:ml-auto">
            <label htmlFor="sort" className="text-xs text-muted-foreground">
              Sort
            </label>
            <select
              id="sort"
              value={search.sort ?? "trending"}
              onChange={(e) => setSearch({ sort: e.target.value })}
              className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {stories.length === 0 ? (
          <div className="panel px-6 py-16 text-center">
            <h2 className="text-lg">No stories match those filters</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another genre, or browse everything.
            </p>
            <Link
              to="/stories"
              search={{}}
              className="mt-6 inline-block rounded-md border border-border px-5 py-2.5 text-sm hover:border-border-strong"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <StoryGrid stories={stories as StorySummary[]} />
        )}
      </div>
    </>
  );
}

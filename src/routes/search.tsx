import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { fetchSearch } from "@/lib/catalog.functions";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { StoryGrid, type StorySummary } from "@/components/site/StoryCard";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q ?? "" }),
  loader: ({ deps }) => fetchSearch({ data: { q: deps.q } }),
  head: () => ({
    meta: [
      { title: "Search | Taleon Media" },
      { name: "description", content: "Search Taleon stories, chapters, characters and genres." },
      { property: "og:title", content: "Search | Taleon Media" },
      { property: "og:description", content: "Search the Taleon catalogue." },
      { property: "og:url", content: "/search" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const results = Route.useLoaderData() as any;
  const { q } = Route.useSearch();
  const [term, setTerm] = useState(q ?? "");
  const navigate = useNavigate({ from: "/search" });

  const nothing =
    !results.stories.length &&
    !results.chapters.length &&
    !results.characters.length &&
    !results.genres.length;

  // Fire the search event exactly once per submitted query, after results
  // are available (so result_count is accurate). Ref-guard prevents
  // re-render duplication.
  const trackedQuery = useRef<string | null>(null);
  useEffect(() => {
    if (!q || trackedQuery.current === q) return;
    trackedQuery.current = q;
    track("search", {
      metadata: {
        query: q,
        result_count:
          results.stories.length +
          results.chapters.length +
          results.characters.length +
          results.genres.length,
      },
    });
  }, [q]);

  return (
    <>
      <PageHeader eyebrow="Search" title={q ? `Results for “${q}”` : "Search Taleon"} />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { q: term.trim() } });
          }}
          className="flex gap-3"
        >
          <label htmlFor="search-input" className="sr-only">
            Search stories, chapters and characters
          </label>
          <input
            id="search-input"
            value={term}
            maxLength={120}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search stories, chapters, characters"
            className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
          />
          <button className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground">
            Search
          </button>
        </form>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6">
        {!q ? (
          <EmptyState
            title="What are you looking for?"
            body="Search across every Taleon story, chapter, character and genre."
          />
        ) : nothing ? (
          <EmptyState
            title="No results"
            body={`Nothing matched “${q}”. Try a different title, character or genre.`}
          >
            <Link to="/stories" className="rounded-md border border-border px-5 py-2.5 text-sm">
              Browse all stories
            </Link>
          </EmptyState>
        ) : (
          <>
            {results.stories.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl tracking-wide">Stories</h2>
                <StoryGrid stories={results.stories as StorySummary[]} />
              </section>
            )}
            {results.chapters.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl tracking-wide">Chapters</h2>
                <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                  {(results.chapters as any[]).map((c) => (
                    <li key={c.id}>
                      <Link
                        to="/story/$slug/chapter/$chapterNumber"
                        params={{
                          slug: c.stories?.slug ?? "",
                          chapterNumber: String(c.chapter_number),
                        }}
                        className="block bg-surface-2/50 px-5 py-4 text-sm hover:bg-surface-2"
                      >
                        {c.stories?.title} — Chapter {c.chapter_number}: {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.characters.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl tracking-wide">Characters</h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(results.characters as any[]).map((c) => (
                    <li key={c.id} className="panel p-5">
                      <p className="font-display">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.role} • {c.stories?.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.genres.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl tracking-wide">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {(results.genres as any[]).map((g) => (
                    <Link
                      key={g.id}
                      to="/stories"
                      search={{ genre: g.slug }}
                      className="rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { coverFor } from "@/lib/artwork";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Library | Taleon Media" },
      {
        name: "description",
        content: "Your Taleon library: saved stories, follows and reading progress.",
      },
      { property: "og:title", content: "My Library | Taleon Media" },
      { property: "og:description", content: "Your Taleon library." },
      { property: "og:url", content: "/account" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

type Row = { story_id: string; stories: any };

function AccountPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bookmarks, setBookmarks] = useState<Row[]>([]);
  const [follows, setFollows] = useState<Row[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"reading" | "saved" | "following" | "profile">("reading");

  useEffect(() => {
    if (!user) return;
    const select = "story_id, stories:story_id (id, slug, title, tagline, cover_url)";
    supabase
      .from("bookmarks")
      .select(select)
      .eq("user_id", user.id)
      .then(({ data }) => setBookmarks((data as any) ?? []));
    supabase
      .from("follows")
      .select(select)
      .eq("user_id", user.id)
      .then(({ data }) => setFollows((data as any) ?? []));
    supabase
      .from("reading_progress")
      .select(
        "story_id, percent, chapter_number, updated_at, stories:story_id (id, slug, title, cover_url)",
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => setProgress((data as any) ?? []));
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setDisplayName((data as any)?.display_name ?? ""));
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ display_name: displayName.trim().slice(0, 60) })
      .eq("id", user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  const TABS = [
    { key: "reading", label: "Continue reading" },
    { key: "saved", label: "Saved" },
    { key: "following", label: "Following" },
    { key: "profile", label: "Profile" },
  ] as const;

  return (
    <>
      <PageHeader eyebrow="My library" title={displayName || user?.email || "Your account"} />

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 border-y border-border py-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md border px-4 py-2 text-xs ${tab === t.key ? "border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={signOut}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>

        <div className="py-10">
          {tab === "reading" &&
            (progress.length === 0 ? (
              <EmptyState
                title="Nothing in progress"
                body="Open a story and your place will be saved automatically."
              >
                <Link to="/stories" className="rounded-md border border-border px-5 py-2.5 text-sm">
                  Browse stories
                </Link>
              </EmptyState>
            ) : (
              <ul className="space-y-3">
                {progress.map((p) => (
                  <li key={p.story_id}>
                    <Link
                      to="/story/$slug/chapter/$chapterNumber"
                      params={{
                        slug: p.stories?.slug ?? "",
                        chapterNumber: String(p.chapter_number ?? 1),
                      }}
                      className="flex items-center gap-4 rounded-lg border border-border bg-surface-2/50 p-4 hover:bg-surface-2"
                    >
                      <img
                        src={coverFor({
                          slug: p.stories?.slug ?? "",
                          cover_url: p.stories?.cover_url,
                        })}
                        alt=""
                        className="h-20 w-14 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display">{p.stories?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Chapter {p.chapter_number} • {Math.round(p.percent ?? 0)}% read
                        </p>
                        <div className="mt-2 h-1 w-full rounded bg-border">
                          <div
                            className="h-1 rounded bg-gold"
                            style={{ width: `${Math.min(100, p.percent ?? 0)}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}

          {(tab === "saved" || tab === "following") &&
            (() => {
              const rows = tab === "saved" ? bookmarks : follows;
              if (rows.length === 0)
                return (
                  <EmptyState
                    title={tab === "saved" ? "No saved stories" : "Not following anything yet"}
                    body="Use the save and follow buttons on any story page."
                  >
                    <Link
                      to="/stories"
                      className="rounded-md border border-border px-5 py-2.5 text-sm"
                    >
                      Browse stories
                    </Link>
                  </EmptyState>
                );
              return (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                  {rows.map((r) => (
                    <Link
                      key={r.story_id}
                      to="/story/$slug"
                      params={{ slug: r.stories?.slug ?? "" }}
                      className="group block"
                    >
                      <img
                        src={coverFor({
                          slug: r.stories?.slug ?? "",
                          cover_url: r.stories?.cover_url,
                        })}
                        alt={r.stories?.title ?? ""}
                        className="aspect-2/3 w-full rounded-lg object-cover"
                      />
                      <p className="mt-2 truncate text-sm group-hover:text-gold">
                        {r.stories?.title}
                      </p>
                    </Link>
                  ))}
                </div>
              );
            })()}

          {tab === "profile" && (
            <form onSubmit={saveProfile} className="max-w-md space-y-4">
              <div>
                <label htmlFor="display" className="eyebrow block">
                  Display name
                </label>
                <input
                  id="display"
                  value={displayName}
                  maxLength={60}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
                />
              </div>
              <div>
                <p className="eyebrow">Email</p>
                <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <button className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground">
                Save profile
              </button>
              {saved && <p className="text-sm text-gold">Profile updated.</p>}
            </form>
          )}
        </div>
      </div>
    </>
  );
}

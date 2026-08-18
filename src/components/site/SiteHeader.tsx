import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import wordmark from "@/assets/primary_logo.png.asset.json";

const NAV = [
  { to: "/stories", label: "Stories" },
  { to: "/audio", label: "Audio" },
  { to: "/watch", label: "Watch" },
  { to: "/genres", label: "Genres" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAdmin } = useSession();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: query.trim() } });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Taleon Media home">
          <img src={wordmark.url} alt="Taleon Media" className="h-5 w-auto sm:h-6" width={320} height={64} />
        </Link>

        <nav className="ml-4 hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden items-center md:flex" role="search">
          <label htmlFor="site-search" className="sr-only">
            Search Taleon
          </label>
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stories"
              className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground lg:w-52"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="hidden text-sm text-muted-foreground hover:text-foreground lg:block">
                  Admin
                </Link>
              )}
              <Link
                to="/account"
                className="hidden rounded-md border border-border px-3 py-2 text-sm hover:border-border-strong md:block"
              >
                My Taleon
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/", replace: true });
                }}
                className="hidden text-sm text-muted-foreground hover:text-foreground md:block"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden px-2 text-sm text-muted-foreground hover:text-foreground md:block">
                Log In
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-md bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90 md:block"
              >
                Join Taleon
              </Link>
            </>
          )}
          <button
            className="rounded-md border border-border p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-4 px-4 py-5">
            <form onSubmit={submitSearch} role="search">
              <label htmlFor="mobile-search" className="sr-only">
                Search Taleon
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-3">
                <Search className="size-4 text-muted-foreground" aria-hidden />
                <input
                  id="mobile-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stories, chapters, characters"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </form>
            <nav className="grid gap-1" aria-label="Mobile">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-base hover:bg-surface-2"
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/account" onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-base hover:bg-surface-2">
                    My Taleon
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-base hover:bg-surface-2">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await supabase.auth.signOut();
                      navigate({ to: "/", replace: true });
                    }}
                    className="rounded-md px-2 py-3 text-left text-base hover:bg-surface-2"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="mt-2 grid gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-border px-4 py-3 text-center text-sm"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-gold px-4 py-3 text-center text-sm font-medium text-gold-foreground"
                  >
                    Join Taleon
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

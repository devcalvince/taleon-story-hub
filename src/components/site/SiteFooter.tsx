import { Link } from "@tanstack/react-router";

const SOCIALS = [
  { label: "TikTok", href: "https://www.tiktok.com/@taleonmedia" },
  { label: "Instagram", href: "https://instagram.com/taleonmedia" },
  { label: "YouTube", href: "https://youtube.com/@taleonmedia" },
  { label: "Facebook", href: "https://facebook.com/taleonmedia" },
  { label: "X", href: "https://x.com/taleonmedia" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-2/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="font-display text-2xl tracking-widest text-gold">TALEON</span>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            An original storytelling and entertainment company. Read, listen and watch original
            worlds.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/stories" className="hover:text-foreground">
                Stories
              </Link>
            </li>
            <li>
              <Link to="/audio" className="hover:text-foreground">
                Audio
              </Link>
            </li>
            <li>
              <Link to="/watch" className="hover:text-foreground">
                Watch
              </Link>
            </li>
            <li>
              <Link to="/genres" className="hover:text-foreground">
                Genres
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Membership
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="eyebrow">Follow @taleonmedia</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Taleon Media. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-foreground">
              Cookies
            </Link>
            <Link to="/copyright" className="hover:text-foreground">
              Copyright
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

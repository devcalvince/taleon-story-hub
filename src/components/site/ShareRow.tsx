import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { track } from "@/lib/analytics";

const TARGETS = [
  { label: "WhatsApp", url: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
  { label: "X", url: (u: string, t: string) => `https://x.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { label: "Facebook", url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
];

const PROFILES = [
  { label: "TikTok", href: "https://www.tiktok.com/@taleonmedia" },
  { label: "Instagram", href: "https://instagram.com/taleonmedia" },
  { label: "YouTube", href: "https://youtube.com/@taleonmedia" },
];

export function ShareRow({ title, storyId }: { title: string; storyId?: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? "" : window.location.href;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="eyebrow mr-1">Share</span>
      {TARGETS.map((t) => (
        <a
          key={t.label}
          href={t.url(url, title)}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => track("share", { storyId, metadata: { target: t.label } })}
          className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground"
        >
          {t.label}
        </a>
      ))}
      {PROFILES.map((p) => (
        <a
          key={p.label}
          href={p.href}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground"
        >
          {p.label}
        </a>
      ))}
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          track("share", { storyId, metadata: { target: "copy_link" } });
          setTimeout(() => setCopied(false), 2000);
        }}
        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

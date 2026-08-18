import { Link } from "@tanstack/react-router";
import { Headphones, Play } from "lucide-react";
import { coverFor } from "@/lib/artwork";

export type StorySummary = {
  id: string;
  slug: string;
  title: string;
  short_description?: string | null;
  cover_url?: string | null;
  status: string;
  has_audio?: boolean;
  has_video?: boolean;
  chapter_count?: number;
  genres?: { slug: string; name: string }[];
};

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
  coming_soon: "Coming Soon",
};

export function StoryCard({ story, action }: { story: StorySummary; action?: string }) {
  return (
    <article className="group">
      <Link
        to="/story/$slug"
        params={{ slug: story.slug }}
        className="block focus-visible:outline-none"
        aria-label={story.title}
      >
        <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-border bg-surface-2">
          <img
            src={coverFor(story)}
            alt={`Cover art for ${story.title}`}
            loading="lazy"
            width={768}
            height={1024}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent opacity-80" />
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-[11px] text-muted-foreground">
            {story.has_audio && <Headphones className="size-3.5 text-gold" aria-label="Audio available" />}
            {story.has_video && <Play className="size-3.5 text-gold" aria-label="Video available" />}
            <span className="ml-auto">{STATUS_LABEL[story.status] ?? story.status}</span>
          </div>
        </div>
        <h3 className="mt-3 text-base leading-tight font-semibold">{story.title}</h3>
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">
        {(story.genres ?? []).map((g) => g.name).slice(0, 2).join(" / ")}
        {story.chapter_count ? ` • ${story.chapter_count} chapters` : ""}
      </p>
      {story.short_description && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{story.short_description}</p>
      )}
      {action && (
        <Link
          to="/story/$slug"
          params={{ slug: story.slug }}
          className="mt-3 inline-block text-xs font-medium tracking-widest text-gold uppercase hover:opacity-80"
        >
          {action}
        </Link>
      )}
    </article>
  );
}

export function StoryGrid({ stories, empty }: { stories: StorySummary[]; empty?: string }) {
  if (!stories.length) {
    return (
      <div className="panel px-6 py-14 text-center">
        <p className="text-sm text-muted-foreground">{empty ?? "Nothing here yet. New Taleon stories are on the way."}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {stories.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </div>
  );
}

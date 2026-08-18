import coverLastSignal from "@/assets/cover-last-signal.jpg";
import coverKilimanjaro from "@/assets/cover-kilimanjaro.jpg";
import coverSector9 from "@/assets/cover-sector9.jpg";
import coverRedDoor from "@/assets/cover-red-door.jpg";
import coverMaua from "@/assets/cover-maua.jpg";
import coverLastGuardian from "@/assets/cover-last-guardian.jpg";
import heroLastSignal from "@/assets/hero-last-signal.jpg";

/**
 * Placeholder production artwork, keyed by story slug.
 * Once a story has a `cover_url` in the database that value wins, so
 * final artwork can be uploaded from the admin dashboard without code changes.
 */
const covers: Record<string, string> = {
  "the-last-signal": coverLastSignal,
  "shadow-of-kilimanjaro": coverKilimanjaro,
  "the-girl-from-sector-9": coverSector9,
  "the-red-door": coverRedDoor,
  maua: coverMaua,
  "the-last-guardian": coverLastGuardian,
};

const banners: Record<string, string> = {
  "the-last-signal": heroLastSignal,
};

export function coverFor(story: { slug: string; cover_url?: string | null }) {
  return story.cover_url || covers[story.slug] || coverLastSignal;
}

export function bannerFor(story: { slug: string; banner_url?: string | null; cover_url?: string | null }) {
  return story.banner_url || banners[story.slug] || coverFor(story);
}

export { heroLastSignal };

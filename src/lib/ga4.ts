/**
 * TALEON — Google Analytics 4 integration layer.
 *
 * Architecture:
 *   - GA4 handles audience/acquisition/attribution (marketing analytics).
 *   - Supabase analytics_events remains the application telemetry store.
 *   - Both systems are fed from the common helpers in src/lib/analytics.ts,
 *     so components never call GA4 directly.
 *
 * Rules enforced here:
 *   - Browser-only initialization; never during SSR.
 *   - Measurement ID comes from VITE_GA_MEASUREMENT_ID (never hard-coded).
 *   - Automatic page_view is disabled; exactly one manual page_view is sent
 *     per route navigation from usePageTracking (no duplicates).
 *   - Every operation is wrapped so GA4 failure can never break the app.
 *   - No PII: no emails, names, user IDs, tokens, message contents.
 *   - No actor_type/admin/role parameters — internal traffic filtering is a
 *     GA4 admin-side concern (data filters), not an app-side flag.
 */

const MEASUREMENT_ID = (import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined)?.trim();

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

let initialized = false;

/** True when GA4 can run in the current environment. */
export function isGA4Enabled(): boolean {
  return typeof window !== "undefined" && !!window.gtag && !!MEASUREMENT_ID;
}

/**
 * Inject the Google tag once, client-side only.
 * Safe to call repeatedly; safe during SSR (no-op).
 */
export function initGA4(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (!MEASUREMENT_ID) return;
  initialized = true;

  try {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      } as GtagFn;
    }

    window.gtag("js", new Date());
    // Disable automatic page_view — usePageTracking sends exactly one
    // manual page_view per navigation (initial load included).
    window.gtag("config", MEASUREMENT_ID, { send_page_view: false });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      MEASUREMENT_ID,
    )}`;
    document.head.appendChild(script);
  } catch {
    /* analytics failure must never break the site */
  }
}

/** Core sender — strips empty values, never throws. */
function send(eventName: string, params: object): void {
  try {
    if (!isGA4Enabled()) return;
    const clean: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
      if (value === undefined || value === null || value === "") continue;
      if (typeof value === "number" && !Number.isFinite(value)) continue;
      clean[key] = value as string | number;
    }
    window.gtag?.("event", eventName, clean);
  } catch {
    /* non-fatal */
  }
}

// ------------------------------------------------------------------
// Shared parameter shapes (names match GA4 custom definitions exactly)
// ------------------------------------------------------------------

export interface StoryParams {
  story_id?: string | undefined;
  story_slug?: string | undefined;
  story_title?: string | undefined;
  story_genre?: string | undefined;
}

export interface ChapterParams extends StoryParams {
  chapter_id?: string | undefined;
  chapter_number?: number | undefined;
}

export interface MediaParams extends ChapterParams {
  media_title?: string | undefined;
}

// ------------------------------------------------------------------
// Page views
// ------------------------------------------------------------------

export function ga4PageView(pathname: string): void {
  send("page_view", { page_path: pathname });
}

// ------------------------------------------------------------------
// Story events
// ------------------------------------------------------------------

export function ga4StoryView(p: StoryParams): void {
  send("story_view", p);
}

export function ga4StoryFollow(p: StoryParams): void {
  send("story_follow", p);
}

export function ga4StoryBookmark(
  p: Omit<StoryParams, "story_genre"> & { bookmark_action: "add" | "remove" },
): void {
  send("story_bookmark", p);
}

// ------------------------------------------------------------------
// Chapter funnel — progress_percentage is NUMERIC (custom metric)
// ------------------------------------------------------------------

export function ga4ChapterStart(p: ChapterParams): void {
  send("chapter_start", p);
}

export function ga4ChapterProgress(p: ChapterParams & { progress_percentage: 25 | 50 | 75 }): void {
  send("chapter_progress", p);
}

export function ga4ChapterComplete(p: ChapterParams): void {
  send("chapter_complete", { ...p, progress_percentage: 100 });
}

// ------------------------------------------------------------------
// Search / Share (official GA4 recommended events)
// ------------------------------------------------------------------

export function ga4Search(searchTerm: string): void {
  send("search", { search_term: searchTerm });
}

export function ga4Share(p: {
  method: string;
  content_type: "story" | "chapter";
  item_id: string;
}): void {
  send("share", p);
}

// ------------------------------------------------------------------
// Auth (recommended events — no identifiers, method only)
// ------------------------------------------------------------------

export function ga4SignUp(method: string): void {
  send("sign_up", { method });
}

export function ga4Login(method: string): void {
  send("login", { method });
}

// ------------------------------------------------------------------
// Audio
// ------------------------------------------------------------------

export function ga4AudioPlay(p: MediaParams): void {
  send("audio_play", p);
}

export function ga4AudioProgress(p: MediaParams & { progress_percentage: 25 | 50 | 75 }): void {
  send("audio_progress", p);
}

export function ga4AudioComplete(p: MediaParams): void {
  send("audio_complete", { ...p, progress_percentage: 100 });
}

// ------------------------------------------------------------------
// Video (Taleon-owned custom players only)
// ------------------------------------------------------------------

export function ga4VideoStart(p: MediaParams): void {
  send("video_start", p);
}

export function ga4VideoProgress(p: MediaParams & { progress_percentage: 25 | 50 | 75 }): void {
  send("video_progress", p);
}

export function ga4VideoComplete(p: MediaParams): void {
  send("video_complete", { ...p, progress_percentage: 100 });
}

// ------------------------------------------------------------------
// Forms (no contents, no PII — classification only)
// ------------------------------------------------------------------

export function ga4NewsletterSubscribe(formType: string, formLocation: string): void {
  send("newsletter_subscribe", { form_type: formType, form_location: formLocation });
}

export function ga4GenerateLead(formType: string, formLocation: string): void {
  send("generate_lead", { form_type: formType, form_location: formLocation });
}

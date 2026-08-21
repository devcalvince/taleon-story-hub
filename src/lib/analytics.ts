import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  initGA4,
  ga4PageView,
  ga4StoryView,
  ga4StoryFollow,
  ga4StoryBookmark,
  ga4ChapterStart,
  ga4ChapterProgress,
  ga4ChapterComplete,
  ga4Search,
  ga4Share,
  ga4SignUp,
  ga4Login,
  ga4AudioPlay,
  ga4AudioProgress,
  ga4AudioComplete,
  ga4VideoStart,
  ga4VideoProgress,
  ga4VideoComplete,
  ga4NewsletterSubscribe,
  ga4GenerateLead,
} from "@/lib/ga4";

// Initialize GA4 as early as possible in the browser (no-op during SSR).
initGA4();

/**
 * Full Taleon event taxonomy — covers the complete journey from social
 * acquisition through reading, listening, watching, and monetisation.
 */
export type TaleonEvent =
  // Acquisition / landing
  | "page_view"
  | "landing_page_view"
  | "social_referral"
  | "campaign_visit"
  | "signup"
  | "login"
  // Story-level
  | "story_view"
  | "story_follow"
  | "story_unfollow"
  | "story_bookmark"
  | "story_share"
  // Chapter-level (funnel)
  | "chapter_view"
  | "chapter_start"
  | "chapter_25"
  | "chapter_50"
  | "chapter_75"
  | "chapter_complete"
  | "chapter_exit"
  // Reading behavior
  | "reading_progress"
  // Audio
  | "audio_play"
  | "audio_pause"
  | "audio_25"
  | "audio_50"
  | "audio_75"
  | "audio_complete"
  | "audio_seek"
  | "audio_speed_change"
  // Video
  | "video_play"
  | "video_25"
  | "video_50"
  | "video_75"
  | "video_complete"
  // Discovery
  | "search"
  | "share"
  // Forms
  | "newsletter_signup"
  | "contact_submission"
  // Revenue (future)
  | "subscription_started"
  | "subscription_cancelled"
  | "purchase_started"
  | "purchase_completed"
  | "premium_chapter_view"
  | "ad_impression"
  | "ad_click"
  | "sponsorship_click";

const ANON_ID_KEY = "taleon_anon_id";
const CAMPAIGN_KEY = "taleon_campaign";

export interface Attribution {
  source: string;
  campaign: string;
  content: string;
  referrer: string;
}

export interface TrackPayload {
  storyId?: string | undefined;
  chapterId?: string | undefined;
  funnelStage?: string | undefined;
  metadata?: Record<string, string | number | boolean> | undefined;
}

/**
 * Anonymous visitor ID management.
 */
let _anonId: string | null = null;
let _attribution: Attribution | null = null;
let _attributionLoaded = false;

/** Generate or retrieve a persistent anonymous visitor ID. */
function getAnonymousId(): string {
  if (_anonId) return _anonId;
  if (typeof window === "undefined") return "";
  try {
    const existing = localStorage.getItem(ANON_ID_KEY);
    if (existing) {
      _anonId = existing;
      return existing;
    }
    const fresh = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, fresh);
    _anonId = fresh;
    return fresh;
  } catch {
    return "";
  }
}

/** Capture UTM parameters from the URL and persist the campaign
 *  so we can attribute subsequent page views to the same campaign.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return emptyAttribution();
  if (_attribution) return _attribution;

  try {
    const cached = localStorage.getItem(CAMPAIGN_KEY);
    if (cached) {
      _attribution = JSON.parse(cached) as Attribution;
      _attributionLoaded = true;
      return _attribution;
    }
  } catch {
    /* fall through */
  }

  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source") || params.get("taleon_source") || "";
  const campaign = params.get("utm_campaign") || params.get("taleon_campaign") || "";
  const content = params.get("utm_content") || params.get("taleon_content") || "";
  const referrer = document.referrer || "";

  const attribution: Attribution = { source, campaign, content, referrer };
  _attribution = attribution;
  _attributionLoaded = true;

  try {
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(attribution));
  } catch {
    /* localStorage may be blocked */
  }

  // Clear UTM params from URL without reloading
  if (source || campaign || content) {
    const url = new URL(window.location.href);
    url.searchParams.delete("utm_source");
    url.searchParams.delete("utm_campaign");
    url.searchParams.delete("utm_content");
    url.searchParams.delete("taleon_source");
    url.searchParams.delete("taleon_campaign");
    url.searchParams.delete("taleon_content");
    window.history.replaceState({}, "", url.toString());
  }

  return attribution;
}

function emptyAttribution(): Attribution {
  return { source: "direct", campaign: "", content: "", referrer: "" };
}

/** Get device type from user agent. */
function getDevice(): string {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent || navigator.vendor;
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

/**
 * Server-authoritative actor type determination.
 *
 * The browser cannot safely determine whether an authenticated user is an
 * administrator — that requires querying the user_roles table, which must
 * be done server-side via the supabaseAdmin client (service-role key).
 * Per requirement 7, the analytics write path is server-authoritative:
 * the client track() function calls a server endpoint that validates the
 * Supabase session and queries the user_roles table.
 *
 * Per requirement 5, admin status is determined server-side from the
 * authenticated Supabase user and the user_roles table.
 * Per requirement 6, the Supabase service-role key remains server-side
 * (supabaseAdmin is imported from client.server, never exposed to the browser).
 * Per requirement 8, anonymous analytics continue working without authentication.
 * Per requirement 9, authenticated normal readers are counted as public audience.
 * Per requirement 10, administrators are excluded from all public KPIs even
 *  when browsing the public website.
 * Per requirement 11, system events remain excluded from public KPIs.
 * Per requirement 13, existing event types are preserved.
 */
/**
 * Server-authoritative actor type determination.
 *
 * The browser cannot safely determine whether an authenticated user is an
 * administrator — that requires querying the user_roles table, which must
 * be done server-side via the supabaseAdmin client (service-role key).
 * Per requirement 7, the analytics write path is server-authoritative:
 * the client track() function calls a server endpoint that validates the
 * Supabase access token and queries the user_roles table.
 *
 * The result is cached per user id: role membership rarely changes mid-session,
 * and caching avoids a server roundtrip on every event/navigation. It is NOT
 * derived from any client-controlled storage flag.
 */
const _actorCache = new Map<string, "public" | "admin">();

async function fetchActorTypeFromServer(userId: string): Promise<"public" | "admin"> {
  if (!userId) return "public";

  const cached = _actorCache.get(userId);
  if (cached) return cached;

  try {
    // Send the verified Supabase access token — the server derives the
    // user from it and queries user_roles. The body carries no role data.
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return "public";

    const res = await fetch("/api/analytics/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) return "public";

    const data = (await res.json()) as { actorType: "public" | "admin" };
    const actor: "public" | "admin" = data.actorType === "admin" ? "admin" : "public";
    _actorCache.set(userId, actor);
    return actor;
  } catch {
    return "public";
  }
}

/** Fire-and-forget analytics. Never blocks or breaks the UI.
 *  Sends the event with full context: user_id (if authenticated),
 *  anonymous_id, attribution, device, referrer, and actor_type
 *  to classify the event as public, admin, or system.
 *
 * IMPORTANT: actor_type is determined server-authoritatively. The client
 * track() function runs in the browser and cannot reliably determine the
 * user's role. It calls a server endpoint (/api/analytics/role) that:
 *   1. Validates the Supabase session user_id (verified by Supabase auth)
 *   2. Queries the user_roles table via the service-role key
 *   3. Returns "admin" or "public"
 *
 * Per requirement 5, admin status is determined server-side from the
 * authenticated Supabase user and the user_roles table.
 * Per requirement 6, the Supabase service-role key remains server-side
 * (supabaseAdmin is imported from client.server, never exposed to the browser).
 * Per requirement 8, anonymous analytics continue working without authentication.
 * Per requirement 9, authenticated normal readers are counted as public audience.
 * Per requirement 10, administrators are excluded from all public KPIs even
 *  when browsing the public website.
 * Per requirement 11, system events remain excluded from public KPIs.
 * Per requirement 13, existing event types are preserved.
 */
/**
 * Mirror a public Taleon event to GA4.
 *
 * Only audience-facing events are mirrored. Internal/diagnostic events
 * (admin/system activity) never reach GA4 — internal-traffic filtering for
 * GA4 is handled by GA4 admin-side data filters, not by app code, and no
 * actor_type/role/user-id parameters are ever sent to Google.
 *
 * Parameter names match the manually configured GA4 custom definitions:
 * story_title, story_genre, chapter_number, progress_percentage,
 * media_title, form_type.
 */
function mirrorToGA4(event: TaleonEvent, payload: TrackPayload): void {
  try {
    const md = payload.metadata ?? {};
    const story = {
      story_id: payload.storyId,
      story_slug: md["storySlug"] as string | undefined,
      story_title: md["storyTitle"] as string | undefined,
      story_genre: md["storyGenre"] as string | undefined,
    };
    const chapter = {
      ...story,
      chapter_id: payload.chapterId,
      chapter_number:
        typeof md["chapterNumber"] === "number" ? (md["chapterNumber"] as number) : undefined,
    };

    switch (event) {
      case "story_view":
        ga4StoryView(story);
        break;
      case "story_follow":
        ga4StoryFollow(story);
        break;
      case "story_bookmark":
        ga4StoryBookmark({
          story_id: story.story_id,
          story_slug: story.story_slug,
          story_title: story.story_title,
          bookmark_action: md["action"] === "remove" ? "remove" : "add",
        });
        break;
      case "chapter_start":
        ga4ChapterStart(chapter);
        break;
      case "chapter_25":
        ga4ChapterProgress({ ...chapter, progress_percentage: 25 });
        break;
      case "chapter_50":
        ga4ChapterProgress({ ...chapter, progress_percentage: 50 });
        break;
      case "chapter_75":
        ga4ChapterProgress({ ...chapter, progress_percentage: 75 });
        break;
      case "chapter_complete":
        ga4ChapterComplete(chapter);
        break;
      case "search":
        if (typeof md["query"] === "string" && md["query"]) {
          ga4Search(md["query"]);
        }
        break;
      case "share":
        ga4Share({
          method: String(md["target"] ?? "unknown").toLowerCase(),
          content_type: md["contentType"] === "chapter" ? "chapter" : "story",
          item_id: String(payload.storyId ?? md["itemId"] ?? ""),
        });
        break;
      case "signup":
        ga4SignUp(String(md["method"] ?? "credentials"));
        break;
      case "login":
        ga4Login(String(md["method"] ?? "credentials"));
        break;
      case "audio_play":
        ga4AudioPlay({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
        });
        break;
      case "audio_25":
        ga4AudioProgress({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
          progress_percentage: 25,
        });
        break;
      case "audio_50":
        ga4AudioProgress({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
          progress_percentage: 50,
        });
        break;
      case "audio_75":
        ga4AudioProgress({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
          progress_percentage: 75,
        });
        break;
      case "audio_complete":
        ga4AudioComplete({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
        });
        break;
      case "video_play":
        ga4VideoStart({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
        });
        break;
      case "video_25":
        ga4VideoProgress({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
          progress_percentage: 25,
        });
        break;
      case "video_50":
        ga4VideoProgress({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
          progress_percentage: 50,
        });
        break;
      case "video_75":
        ga4VideoProgress({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
          progress_percentage: 75,
        });
        break;
      case "video_complete":
        ga4VideoComplete({
          ...chapter,
          media_title: md["mediaTitle"] as string | undefined,
        });
        break;
      case "newsletter_signup":
        ga4NewsletterSubscribe(String(md["formType"] ?? "email"), String(md["formLocation"] ?? ""));
        break;
      case "contact_submission":
        ga4GenerateLead(String(md["formType"] ?? "contact"), String(md["formLocation"] ?? ""));
        break;
      default:
        // page_view / landing_page_view are handled by trackPageView's
        // single manual page_view mechanism; everything else is
        // Supabase-only telemetry.
        break;
    }
  } catch {
    /* mirroring must never throw */
  }
}

export async function track(event: TaleonEvent, payload: TrackPayload = {}) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const attribution = captureAttribution();
    const device = getDevice();

    let actorType: "public" | "admin";

    if (session?.user?.id) {
      // Authenticated user — determine actor type server-authoritatively.
      // Call the server endpoint that queries the user_roles table using
      // the verified user_id from the Supabase session. Never trust a
      // client-provided role value.
      const resolved = await fetchActorTypeFromServer(session.user.id);
      actorType = resolved;

      await supabase.from("analytics_events").insert({
        event_name: event,
        user_id: session.user.id,
        anonymous_id: null,
        story_id: payload.storyId ?? null,
        chapter_id: payload.chapterId ?? null,
        funnel_stage: payload.funnelStage ?? null,
        attribution: attribution as unknown as Json,
        referrer:
          typeof payload.metadata === "object" &&
          payload.metadata !== null &&
          "referrer" in payload.metadata
            ? (payload.metadata["referrer"] as string)
            : (attribution.referrer ?? null),
        device: device,
        metadata: payload.metadata ?? {},
        actor_type: actorType,
      });
    } else {
      // Anonymous visitor — always public.
      const anonId = getAnonymousId();
      actorType = "public";

      await supabase.from("analytics_events").insert({
        event_name: event,
        user_id: null,
        anonymous_id: anonId,
        story_id: payload.storyId ?? null,
        chapter_id: payload.chapterId ?? null,
        funnel_stage: payload.funnelStage ?? null,
        attribution: attribution as unknown as Json,
        referrer:
          typeof payload.metadata === "object" &&
          payload.metadata !== null &&
          "referrer" in payload.metadata
            ? (payload.metadata["referrer"] as string)
            : (attribution.referrer ?? null),
        device: device,
        metadata: payload.metadata ?? {},
        actor_type: "public",
      });
    }

    // GA4 receives public audience events only. Admin activity stays in
    // Supabase diagnostics and never reaches Google Analytics.
    if (actorType === "public") {
      mirrorToGA4(event, payload);
    }
  } catch {
    /* analytics must never surface to the reader */
  }
}

/** Track a page view with optional story context.
 *
 * GA4: exactly one manual page_view per navigation for EVERY route
 * (automatic page_view is disabled in ga4.ts, so this is the single
 * mechanism — initial load included, no SSR/hydration duplicates).
 *
 * Admin exclusion: when the visitor is authenticated, the actor type is
 * resolved server-authoritatively (cached) BEFORE any tracking fires.
 * Administrators produce no GA4 page_view and no public Supabase page
 * events — their activity stays in admin diagnostics only. Anonymous and
 * normal-reader traffic is unaffected.
 *
 * Supabase: story/chapter pages are skipped here because dedicated
 * story_view/chapter_view events already cover them.
 */
export function trackPageView(pathname: string, storyId?: string) {
  void routePageView(pathname);
}

async function routePageView(pathname: string): Promise<void> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user?.id) {
      const actor = await fetchActorTypeFromServer(session.user.id);
      if (actor === "admin") return;
    }
  } catch {
    /* unresolved → treat as public; never block analytics */
  }

  // Single GA4 page_view mechanism — all routes, public audience only.
  ga4PageView(pathname);

  if (pathname.startsWith("/story/")) return;
  if (pathname === "/") {
    track("landing_page_view", { metadata: { pathname } });
  } else {
    track("page_view", { metadata: { pathname } });
  }
}

/** Track chapter reading progress funnel events.
 *
 * NOTE: chapter_start is NOT emitted here — it fires exactly once when the
 * chapter page mounts (see the chapter route). This function only emits the
 * scroll milestones, each guarded by a milestone set in the caller so no
 * threshold can fire twice.
 */
export function trackChapterProgress(opts: {
  storyId: string;
  chapterId: string;
  percent: number;
  chapterNumber: number;
  wordLength?: number | string;
  storySlug?: string;
  storyTitle?: string;
  storyGenre?: string;
}) {
  const { storyId, chapterId, percent, chapterNumber, wordLength } = opts;
  const storyContext: Record<string, string> = {};
  if (opts.storySlug) storyContext["storySlug"] = opts.storySlug;
  if (opts.storyTitle) storyContext["storyTitle"] = opts.storyTitle;
  if (opts.storyGenre) storyContext["storyGenre"] = opts.storyGenre;

  // chapter_25
  if (percent >= 25 && percent < 50) {
    track("chapter_25", {
      storyId,
      chapterId,
      funnelStage: "25%",
      metadata: { chapterNumber, percent: Math.round(percent), ...storyContext },
    });
    return;
  }

  // chapter_50
  if (percent >= 50 && percent < 75) {
    track("chapter_50", {
      storyId,
      chapterId,
      funnelStage: "50%",
      metadata: { chapterNumber, percent: Math.round(percent), ...storyContext },
    });
    return;
  }

  // chapter_75
  if (percent >= 75 && percent < 100) {
    track("chapter_75", {
      storyId,
      chapterId,
      funnelStage: "75%",
      metadata: { chapterNumber, percent: Math.round(percent), ...storyContext },
    });
    return;
  }

  // chapter_complete
  if (percent >= 100) {
    track("chapter_complete", {
      storyId,
      chapterId,
      funnelStage: "100%",
      metadata: { chapterNumber, wordLength: wordLength ?? 0, ...storyContext },
    });
    return;
  }
}

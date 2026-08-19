import { supabase } from "@/integrations/supabase/client";

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

/**
 * Capture UTM parameters from the URL and persist the campaign
 * so we can attribute subsequent page views to the same campaign.
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
 * Fire-and-forget analytics. Never blocks or breaks the UI.
 * Sends the event with full context: user_id (if authenticated),
 * anonymous_id, attribution, device, referrer.
 */
export async function track(
  event: TaleonEvent,
  payload: TrackPayload = {},
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const attribution = captureAttribution();
    const device = getDevice();

    await supabase.from("analytics_events").insert({
      event_name: event,
      user_id: session?.user?.id ?? null,
      anonymous_id: session?.user?.id ? null : getAnonymousId(),
      story_id: payload.storyId ?? null,
      chapter_id: payload.chapterId ?? null,
      funnel_stage: payload.funnelStage ?? null,
      attribution: attribution,
      referrer: typeof payload.metadata === "object" && payload.metadata !== null && "referrer" in payload.metadata ? payload.metadata["referrer"] as string : attribution.referrer ?? null,
      device: device,
      metadata: payload.metadata ?? {},
    } as any);
  } catch {
    /* analytics must never surface to the reader */
  }
}

/** Track a page view with optional story context. */
export function trackPageView(pathname: string, storyId?: string) {
  const isStory = pathname.startsWith("/story/");
  if (isStory && storyId) {
    track("story_view", { storyId, metadata: { pathname } });
  } else if (pathname === "/") {
    track("landing_page_view", { metadata: { pathname } });
  } else {
    track("page_view", { metadata: { pathname } });
  }
}

/** Track chapter reading progress funnel events. */
export function trackChapterProgress(opts: {
  storyId: string;
  chapterId: string;
  percent: number;
  chapterNumber: number;
  wordLength?: number | string;
}) {

  const { storyId, chapterId, percent, chapterNumber, wordLength } = opts;

  // chapter_start (first time reaching >5%)
  if (percent > 5 && percent < 25) {
    track("chapter_start", {
      storyId, chapterId,
      funnelStage: "started",
      metadata: { chapterNumber, wordLength: wordLength ?? 0 },
    });
    return;
  }

  // chapter_25
  if (percent >= 25 && percent < 50) {
    track("chapter_25", {
      storyId, chapterId,
      funnelStage: "25%",
      metadata: { chapterNumber, percent: Math.round(percent) },
    });
    return;
  }

  // chapter_50
  if (percent >= 50 && percent < 75) {
    track("chapter_50", {
      storyId, chapterId,
      funnelStage: "50%",
      metadata: { chapterNumber, percent: Math.round(percent) },
    });
    return;
  }

  // chapter_75
  if (percent >= 75 && percent < 100) {
    track("chapter_75", {
      storyId, chapterId,
      funnelStage: "75%",
      metadata: { chapterNumber, percent: Math.round(percent) },
    });
    return;
  }

  // chapter_complete
  if (percent >= 100) {
    track("chapter_complete", {
      storyId, chapterId,
      funnelStage: "100%",
      metadata: { chapterNumber, wordLength: wordLength ?? 0 },
    });
    return;
  }
}

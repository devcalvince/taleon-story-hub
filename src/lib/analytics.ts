import { supabase } from "@/integrations/supabase/client";

export type TaleonEvent =
  | "page_view"
  | "story_view"
  | "chapter_started"
  | "chapter_completed"
  | "audio_started"
  | "audio_completed"
  | "video_started"
  | "story_followed"
  | "story_saved"
  | "signup"
  | "login"
  | "search"
  | "share"
  | "premium_chapter_view";

/** Fire-and-forget analytics. Never blocks or breaks the UI. */
export async function track(
  event: TaleonEvent,
  payload: { storyId?: string; chapterId?: string; metadata?: Record<string, unknown> } = {},
) {
  try {
    const { data } = await supabase.auth.getSession();
    await supabase.from("analytics_events").insert({
      event_name: event,
      user_id: data.session?.user?.id ?? null,
      story_id: payload.storyId ?? null,
      chapter_id: payload.chapterId ?? null,
      metadata: payload.metadata ?? {},
    });
  } catch {
    /* analytics must never surface to the reader */
  }
}

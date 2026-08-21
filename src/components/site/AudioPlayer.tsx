import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
// Aliased: the component prop `track` (AudioTrack) shadows this name.
import { track as trackEvent } from "@/lib/analytics";

export type AudioTrack = {
  id: string;
  title: string;
  subtitle?: string;
  src?: string | null;
  storyId?: string;
};

function fmt(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer({
  track,
  onPrev,
  onNext,
}: {
  track: AudioTrack | null;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const { user } = useSession();

  // Analytics guards — one play per playback start, one event per milestone.
  const playTrackedFor = useRef<string | null>(null);
  const milestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    setPlaying(false);
    setPosition(0);
    playTrackedFor.current = null;
    milestones.current = new Set();
  }, [track?.id]);

  function mediaMetadata() {
    return {
      mediaTitle: track?.title ?? "",
      chapterNumber: 0,
    };
  }

  /** Fire milestone events once each, based on actual playback position. */
  function handleMilestones(current: number, total: number) {
    if (!track || !total || total <= 0) return;
    const pct = (current / total) * 100;
    for (const m of [25, 50, 75]) {
      if (pct >= m && !milestones.current.has(m)) {
        milestones.current.add(m);
        trackEvent(m === 25 ? "audio_25" : m === 50 ? "audio_50" : "audio_75", {
          storyId: track.storyId,
          chapterId: track.id,
          metadata: mediaMetadata(),
        });
      }
    }
  }

  // Persist listening position for signed-in members.
  useEffect(() => {
    if (!user || !track?.id || !track.storyId || position < 5) return;
    const timer = setTimeout(() => {
      supabase.from("listening_progress").upsert({
        user_id: user.id,
        chapter_id: track.id,
        story_id: track.storyId!,
        position_seconds: position,
        updated_at: new Date().toISOString(),
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [user, track?.id, track?.storyId, position]);

  if (!track) {
    return (
      <div className="panel px-5 py-6 text-sm text-muted-foreground">
        Select a chapter to start listening.
      </div>
    );
  }

  const unavailable = !track.src;

  return (
    <div className="panel p-5">
      <p className="eyebrow">Now playing</p>
      <h3 className="mt-1 text-lg leading-tight">{track.title}</h3>
      {track.subtitle && <p className="text-sm text-muted-foreground">{track.subtitle}</p>}

      {unavailable ? (
        <p className="mt-5 rounded-md border border-border bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
          Narration for this chapter is being recorded. It will appear here as soon as it is
          released.
        </p>
      ) : (
        <>
          <audio
            ref={audioRef}
            src={track.src ?? undefined}
            preload="none"
            onPlay={() => {
              // Fires only when playback actually begins — never on render.
              if (playTrackedFor.current !== track.id) {
                playTrackedFor.current = track.id;
                trackEvent("audio_play", {
                  storyId: track.storyId,
                  chapterId: track.id,
                  metadata: mediaMetadata(),
                });
              }
            }}
            onTimeUpdate={(e) => {
              setPosition(e.currentTarget.currentTime);
              handleMilestones(e.currentTarget.currentTime, e.currentTarget.duration);
            }}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => {
              setPlaying(false);
              if (playTrackedFor.current === track.id) {
                trackEvent("audio_complete", {
                  storyId: track.storyId,
                  chapterId: track.id,
                  metadata: mediaMetadata(),
                });
              }
            }}
          />
          <div className="mt-5 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={position}
              aria-label="Seek"
              onChange={(e) => {
                const next = Number(e.target.value);
                setPosition(next);
                if (audioRef.current) audioRef.current.currentTime = next;
              }}
              className="w-full accent-[var(--color-gold)]"
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{fmt(position)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={onPrev}
          disabled={!onPrev}
          aria-label="Previous chapter"
          className="rounded-md border border-border p-2 disabled:opacity-40"
        >
          <SkipBack className="size-4" />
        </button>
        <button
          onClick={() => {
            if (!audioRef.current) return;
            if (playing) {
              audioRef.current.pause();
              setPlaying(false);
            } else {
              void audioRef.current.play();
              setPlaying(true);
            }
          }}
          disabled={unavailable}
          aria-label={playing ? "Pause" : "Play"}
          className="rounded-md bg-gold p-3 text-gold-foreground disabled:opacity-40"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          onClick={onNext}
          disabled={!onNext}
          aria-label="Next chapter"
          className="rounded-md border border-border p-2 disabled:opacity-40"
        >
          <SkipForward className="size-4" />
        </button>

        <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          Speed
          <select
            value={rate}
            onChange={(e) => {
              const next = Number(e.target.value);
              setRate(next);
              if (audioRef.current) audioRef.current.playbackRate = next;
            }}
            className="rounded-md border border-border bg-surface-2 px-2 py-1 text-foreground"
          >
            {[0.75, 1, 1.25, 1.5, 2].map((r) => (
              <option key={r} value={r}>
                {r}×
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="size-4" aria-hidden />
          <span className="sr-only">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => {
              const next = Number(e.target.value);
              setVolume(next);
              if (audioRef.current) audioRef.current.volume = next;
            }}
            className="w-20 accent-[var(--color-gold)]"
          />
        </label>
      </div>
    </div>
  );
}

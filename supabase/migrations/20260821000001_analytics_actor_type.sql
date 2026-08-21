-- ============================================================
-- TALEON ANALYTICS ACTOR TYPE — Migration 6
-- Adds actor_type column to analytics_events to classify
-- events as public, admin, or system for separation of concerns
-- Idempotent: safe to re-run
-- ============================================================

-- Add actor_type enum type
DO $$ BEGIN
  CREATE TYPE public.analytics_actor_type AS ENUM (
    'public',
    'admin',
    'system'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add actor_type column to analytics_events (default 'public' for backward compatibility)
ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS actor_type public.analytics_actor_type NOT NULL DEFAULT 'public';

-- Update existing records to have default actor_type
UPDATE public.analytics_events SET actor_type = 'public' WHERE actor_type IS NULL;

-- Create index for querying by actor type
CREATE INDEX IF NOT EXISTS idx_analytics_events_actor_type ON public.analytics_events(actor_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_actor ON public.analytics_events(event_name, actor_type);

-- Comment: This enables separation of public audience metrics from
-- internal admin activity and system automation events.
-- Extend analytics_events to support full funnel tracking
-- Adds anonymous visitor ID, attribution, and funnel context columns

-- Add columns for anonymous tracking
ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS anonymous_id uuid,
  ADD COLUMN IF NOT EXISTS attribution jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS funnel_stage text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS device text,
  ADD COLUMN IF NOT EXISTS country text;

-- Index for funnel queries
CREATE INDEX IF NOT EXISTS idx_analytics_funnel ON public.analytics_events(story_id, funnel_stage, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_anonymous ON public.analytics_events(anonymous_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);

-- Allow anon to insert with anonymous_id (already has INSERT WITH CHECK (true))
-- The analytics_insert_any policy already permits all inserts.

-- Add index for attribution queries
CREATE INDEX IF NOT EXISTS idx_analytics_attribution ON public.analytics_events USING gin(attribution);

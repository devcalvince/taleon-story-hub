-- ============================================================
-- TALEON PRODUCTION RLS HARDENING
-- Remediation for verified production findings:
--   1. Public INSERT missing on newsletter_subscribers / contact_submissions
--   2. Public INSERT missing on analytics_events (browser tracking dropped)
--   3. Anonymous SELECT allowed on analytics_events (privacy hole)
--   4. No guarantee that non-admins cannot modify analytics events
--
-- Idempotent: safe to re-run. Existing policies are INSPECTED at runtime
-- via pg_policies before any drop; nothing is dropped blindly.
-- service_role bypasses RLS by design and is unaffected.
-- ============================================================

-- ------------------------------------------------------------
-- 1. NEWSLETTER SUBSCRIBERS — public may subscribe; admins manage
-- ------------------------------------------------------------
DO $$ BEGIN
  CREATE POLICY "Anyone can subscribe"
    ON public.newsletter_subscribers
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins read subscribers"
    ON public.newsletter_subscribers
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins manage subscribers"
    ON public.newsletter_subscribers
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins delete subscribers"
    ON public.newsletter_subscribers
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- 2. CONTACT SUBMISSIONS — public may submit; admins manage
-- ------------------------------------------------------------
DO $$ BEGIN
  CREATE POLICY "Anyone can submit contact form"
    ON public.contact_submissions
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins read contact submissions"
    ON public.contact_submissions
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins update contact submissions"
    ON public.contact_submissions
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins delete contact submissions"
    ON public.contact_submissions
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- 3. ANALYTICS EVENTS
--    - anyone (anon + authenticated) may INSERT (public audience tracking)
--    - only admins may SELECT (raw events are internal)
--    - no UPDATE/DELETE for non-admins (readers cannot alter events)
-- ------------------------------------------------------------

-- 3a. Drop every existing SELECT policy on analytics_events that grants the
--     anon role OR the implicit PUBLIC role (runtime inspection — never a
--     blind drop). Policies scoped to authenticated admins are preserved.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'analytics_events'
      AND cmd = 'SELECT'
      AND (
        'anon' = ANY (roles::text[])
        OR 'public' = ANY (roles::text[])
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.analytics_events', pol.policyname);
    RAISE NOTICE 'Dropped permissive analytics SELECT policy: %', pol.policyname;
  END LOOP;
END $$;

-- Revoke table-level SELECT from anon/public as well (a grant can permit
-- reads even when no policy matches, and vice versa).
REVOKE SELECT ON public.analytics_events FROM anon, PUBLIC;

-- 3b. Drop any permissive UPDATE/DELETE policies granted to anon or all
--     authenticated users (non-admins must not modify events).
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'analytics_events'
      AND cmd IN ('UPDATE', 'DELETE')
      AND (
        'anon' = ANY (roles::text[])
        OR (
          'authenticated' = ANY (roles::text[])
          AND NOT ('admin' = ANY (roles::text[]))
        )
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.analytics_events', pol.policyname);
  END LOOP;
END $$;

-- 3c. Public insert policy (idempotent).
DO $$ BEGIN
  CREATE POLICY "analytics_public_insert"
    ON public.analytics_events
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3d. Admin-only read policy (idempotent).
DO $$ BEGIN
  CREATE POLICY "analytics_admin_select"
    ON public.analytics_events
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3e. Admin-only maintenance (cleanup/archival jobs run as admin).
DO $$ BEGIN
  CREATE POLICY "analytics_admin_delete"
    ON public.analytics_events
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- 4. ANALYTICS ACTOR TYPE (verified un-applied in production)
--    Local migration 20260821000001 was never applied remotely; without
--    this column every tracked event insert fails. Idempotent re-statement.
-- ------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.analytics_actor_type AS ENUM (
    'public',
    'admin',
    'system'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS actor_type public.analytics_actor_type NOT NULL DEFAULT 'public';

CREATE INDEX IF NOT EXISTS idx_analytics_events_actor_type ON public.analytics_events(actor_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_actor ON public.analytics_events(event_name, actor_type);

-- ------------------------------------------------------------
-- 5. CHAPTERS.MEDIA_ASSET_ID (verified missing in production)
--    Code (getChapter / listAudio) selects this column; without it every
--    chapter query errors and all chapter pages 404. Idempotent re-statement
--    of the intended schema.
-- ------------------------------------------------------------
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS media_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_chapters_media_asset ON public.chapters(media_asset_id);

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT INSERT ON public.analytics_events TO anon, authenticated;


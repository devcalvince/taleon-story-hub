-- ============================================================
-- TALEON MEDIA STORAGE ARCHITECTURE — Migration 5
-- Extends media_assets with storage abstraction fields,
-- adds audio/video buckets, updates enums and policies
-- Idempotent: safe to re-run
-- ============================================================

-- ============================================================
-- EXTEND ENUMS
-- ============================================================

-- Extend asset_type enum
DO $$ BEGIN
  ALTER TYPE public.asset_type ADD VALUE IF NOT EXISTS 'illustration';
  ALTER TYPE public.asset_type ADD VALUE IF NOT EXISTS 'background';
  ALTER TYPE public.asset_type ADD VALUE IF NOT EXISTS 'audio';
  ALTER TYPE public.asset_type ADD VALUE IF NOT EXISTS 'video';
  ALTER TYPE public.asset_type ADD VALUE IF NOT EXISTS 'social_video';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Extend asset_status enum to match lifecycle states
DO $$ BEGIN
  ALTER TYPE public.asset_status ADD VALUE IF NOT EXISTS 'pending';
  ALTER TYPE public.asset_status ADD VALUE IF NOT EXISTS 'processing';
  ALTER TYPE public.asset_status ADD VALUE IF NOT EXISTS 'ready';
  ALTER TYPE public.asset_status ADD VALUE IF NOT EXISTS 'failed';
  ALTER TYPE public.asset_status ADD VALUE IF NOT EXISTS 'deleted';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create storage_provider enum
DO $$ BEGIN
  CREATE TYPE public.storage_provider AS ENUM (
    'supabase',
    'cloudflare_r2',
    'aws_s3',
    'external'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- EXTEND MEDIA_ASSETS TABLE
-- ============================================================

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS storage_provider public.storage_provider NOT NULL DEFAULT 'supabase',
  ADD COLUMN IF NOT EXISTS storage_bucket text,
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS mime_type text,
  ADD COLUMN IF NOT EXISTS duration numeric,
  ADD COLUMN IF NOT EXISTS bitrate int,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS original_filename text,
  ADD COLUMN IF NOT EXISTS checksum text,
  ADD COLUMN IF NOT EXISTS uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update existing records to have default storage_provider
UPDATE public.media_assets
SET storage_provider = 'supabase',
    storage_bucket = 'story-assets'
WHERE storage_provider IS NULL;

-- Make storage_bucket NOT NULL after backfill
ALTER TABLE public.media_assets
  ALTER COLUMN storage_bucket SET NOT NULL;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_media_assets_storage_provider ON public.media_assets(storage_provider);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON public.media_assets(status);
CREATE INDEX IF NOT EXISTS idx_media_assets_checksum ON public.media_assets(checksum);

-- ============================================================
-- STORAGE BUCKETS (to be created via Supabase Dashboard or RPC)
-- ============================================================
-- story-assets (already exists via storage.ts ensureBucket)
-- story-audio (new - for audio files)
-- story-video (new - for direct video uploads, optional)

-- ============================================================
-- RLS POLICIES UPDATE
-- ============================================================

-- Update public read policy to only allow 'ready' and 'published' status
DROP POLICY IF EXISTS "media_assets_public_read" ON public.media_assets;
CREATE POLICY "media_assets_public_read" ON public.media_assets FOR SELECT
  USING (status IN ('ready', 'approved', 'published'));

-- Admin read/write policies remain (already exist)

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to get asset with signed URL for private assets
CREATE OR REPLACE FUNCTION public.get_media_asset_with_url(asset_id uuid)
RETURNS TABLE (
  id uuid,
  story_id uuid,
  chapter_id uuid,
  scene_id uuid,
  character_id uuid,
  location_id uuid,
  asset_type public.asset_type,
  title text,
  description text,
  prompt text,
  negative_prompt text,
  provider text,
  model text,
  source_type public.source_type,
  source_url text,
  original_storage_path text,
  processed_storage_path text,
  public_url text,
  thumbnail_storage_path text,
  thumbnail_url text,
  width int,
  height int,
  format text,
  file_size bigint,
  mime_type text,
  duration numeric,
  bitrate int,
  status public.asset_status,
  version int,
  approved boolean,
  approved_by uuid,
  approved_at timestamptz,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  storage_provider public.storage_provider,
  storage_bucket text,
  storage_path text,
  signed_url text
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  asset_record RECORD;
  signed_url_text text;
BEGIN
  SELECT * INTO asset_record FROM public.media_assets WHERE id = asset_id;
  
  IF asset_record IS NULL THEN
    RETURN;
  END IF;
  
  -- For public assets, use public_url
  IF asset_record.status IN ('ready', 'approved', 'published') THEN
    signed_url_text := asset_record.public_url;
  ELSE
    -- For non-public assets, admin would need signed URL via service role
    signed_url_text := asset_record.public_url;
  END IF;
  
  RETURN QUERY SELECT 
    asset_record.id,
    asset_record.story_id,
    asset_record.chapter_id,
    asset_record.scene_id,
    asset_record.character_id,
    asset_record.location_id,
    asset_record.asset_type,
    asset_record.title,
    asset_record.description,
    asset_record.prompt,
    asset_record.negative_prompt,
    asset_record.provider,
    asset_record.model,
    asset_record.source_type,
    asset_record.source_url,
    asset_record.original_storage_path,
    asset_record.processed_storage_path,
    asset_record.public_url,
    asset_record.thumbnail_storage_path,
    asset_record.thumbnail_url,
    asset_record.width,
    asset_record.height,
    asset_record.format,
    asset_record.file_size,
    asset_record.mime_type,
    asset_record.duration,
    asset_record.bitrate,
    asset_record.status,
    asset_record.version,
    asset_record.approved,
    asset_record.approved_by,
    asset_record.approved_at,
    asset_record.created_by,
    asset_record.created_at,
    asset_record.updated_at,
    asset_record.storage_provider,
    asset_record.storage_bucket,
    asset_record.storage_path,
    signed_url_text;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_media_asset_with_url(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_media_asset_with_url(uuid) TO service_role;

-- Function to mark asset as deleted (soft delete)
CREATE OR REPLACE FUNCTION public.soft_delete_media_asset(asset_id uuid, deleted_by uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.media_assets
  SET status = 'deleted',
      updated_at = now()
  WHERE id = asset_id;
  
  -- Log the deletion
  INSERT INTO public.analytics_events (
    event_name,
    user_id,
    metadata
  ) VALUES (
    'asset_deleted',
    deleted_by,
    jsonb_build_object('asset_id', asset_id)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_media_asset(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.soft_delete_media_asset(uuid, uuid) TO service_role;

-- ============================================================
-- AUDIO ASSETS VIEW (for easy querying)
-- ============================================================

CREATE OR REPLACE VIEW public.story_audio_assets AS
SELECT 
  ma.id,
  ma.story_id,
  ma.chapter_id,
  ma.title,
  ma.description,
  ma.public_url,
  ma.mime_type,
  ma.duration,
  ma.bitrate,
  ma.file_size,
  ma.storage_path,
  ma.storage_bucket,
  ma.status,
  ma.created_at,
  s.title AS story_title,
  s.slug AS story_slug,
  c.chapter_number,
  c.title AS chapter_title
FROM public.media_assets ma
LEFT JOIN public.stories s ON ma.story_id = s.id
LEFT JOIN public.chapters c ON ma.chapter_id = c.id
WHERE ma.asset_type = 'audio'
  AND ma.status IN ('ready', 'approved', 'published');

GRANT SELECT ON public.story_audio_assets TO anon;
GRANT SELECT ON public.story_audio_assets TO authenticated;

-- ============================================================
-- VIDEO ASSETS VIEW
-- ============================================================

CREATE OR REPLACE VIEW public.story_video_assets AS
SELECT 
  ma.id,
  ma.story_id,
  ma.chapter_id,
  ma.title,
  ma.description,
  ma.public_url,
  ma.thumbnail_url,
  ma.mime_type,
  ma.duration,
  ma.file_size,
  ma.storage_path,
  ma.storage_bucket,
  ma.source_type,
  ma.source_url,
  ma.status,
  ma.created_at,
  s.title AS story_title,
  s.slug AS story_slug,
  c.chapter_number,
  c.title AS chapter_title
FROM public.media_assets ma
LEFT JOIN public.stories s ON ma.story_id = s.id
LEFT JOIN public.chapters c ON ma.chapter_id = c.id
WHERE ma.asset_type = 'video'
  AND ma.status IN ('ready', 'approved', 'published');

GRANT SELECT ON public.story_video_assets TO anon;
GRANT SELECT ON public.story_video_assets TO authenticated;

-- ============================================================
-- COVER/THUMBNAIL ASSETS VIEW (for public story cards)
-- ============================================================

CREATE OR REPLACE VIEW public.story_cover_assets AS
SELECT 
  ma.id,
  ma.story_id,
  ma.title,
  ma.public_url,
  ma.thumbnail_url,
  ma.width,
  ma.height,
  ma.mime_type,
  ma.file_size,
  ma.asset_type,
  ma.status,
  s.title AS story_title,
  s.slug AS story_slug
FROM public.media_assets ma
LEFT JOIN public.stories s ON ma.story_id = s.id
WHERE ma.asset_type IN ('cover', 'thumbnail', 'banner', 'story_cover', 'poster')
  AND ma.status IN ('ready', 'approved', 'published');

GRANT SELECT ON public.story_cover_assets TO anon;
GRANT SELECT ON public.story_cover_assets TO authenticated;
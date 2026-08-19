-- ============================================================
-- TALEON VISUAL ASSET PIPELINE — Migration 4
-- Scenes, Locations, Media Assets, Generation Jobs
-- ============================================================

-- Enums
CREATE TYPE public.asset_type AS ENUM (
  'cover','scene','character','location','thumbnail','banner',
  'poster','social_vertical','social_square','youtube_thumbnail',
  'story_cinematic','story_cover','other'
);

CREATE TYPE public.source_type AS ENUM (
  'upload','external_url','ai_generated','imported'
);

CREATE TYPE public.asset_status AS ENUM (
  'draft','processing','ready','approved','published','rejected','failed','archived'
);

CREATE TYPE public.generation_job_status AS ENUM (
  'queued','generating','processing','uploading','completed','failed','cancelled'
);

-- ============================================================
-- SCENES
-- ============================================================
CREATE TABLE public.scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  scene_number int NOT NULL,
  title text NOT NULL,
  description text,
  mood text,
  location_name text,
  characters_in_scene text,
  visual_prompt text,
  camera_direction text,
  lighting_direction text,
  status asset_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chapter_id, scene_number)
);
GRANT SELECT ON public.scenes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenes TO authenticated;
GRANT ALL ON public.scenes TO service_role;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scenes_public_read" ON public.scenes FOR SELECT USING (true);
CREATE POLICY "scenes_admin_write" ON public.scenes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER scenes_updated BEFORE UPDATE ON public.scenes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_scenes_chapter ON public.scenes(chapter_id, scene_number);

-- ============================================================
-- LOCATIONS
-- ============================================================
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  visual_prompt text,
  reference_image_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "locations_public_read" ON public.locations FOR SELECT USING (true);
CREATE POLICY "locations_admin_write" ON public.locations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER locations_updated BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_locations_story ON public.locations(story_id);

-- ============================================================
-- Extend CHARACTERS with visual bible fields
-- ============================================================
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS age text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS appearance text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS personality text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS clothing text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS visual_prompt text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS reference_image_url text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS notes text;

-- ============================================================
-- MEDIA ASSETS
-- ============================================================
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES public.stories(id) ON DELETE SET NULL,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  scene_id uuid REFERENCES public.scenes(id) ON DELETE SET NULL,
  character_id uuid REFERENCES public.characters(id) ON DELETE SET NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  asset_type asset_type NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  prompt text,
  negative_prompt text,
  provider text NOT NULL DEFAULT 'manual',
  model text,
  source_type source_type NOT NULL DEFAULT 'upload',
  source_url text,
  original_storage_path text,
  processed_storage_path text,
  public_url text,
  thumbnail_storage_path text,
  width int,
  height int,
  format text,
  file_size bigint,
  status asset_status NOT NULL DEFAULT 'draft',
  version int NOT NULL DEFAULT 1,
  approved boolean NOT NULL DEFAULT false,
  approved_by uuid,
  approved_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_assets_public_read" ON public.media_assets FOR SELECT
  USING (status IN ('approved','published'));
CREATE POLICY "media_assets_admin_read" ON public.media_assets FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "media_assets_admin_write" ON public.media_assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER media_assets_updated BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_media_assets_story ON public.media_assets(story_id);
CREATE INDEX idx_media_assets_chapter ON public.media_assets(chapter_id);
CREATE INDEX idx_media_assets_scene ON public.media_assets(scene_id);
CREATE INDEX idx_media_assets_status ON public.media_assets(status);
CREATE INDEX idx_media_assets_type ON public.media_assets(asset_type);

-- ============================================================
-- GENERATION JOBS
-- ============================================================
CREATE TABLE public.generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  story_id uuid REFERENCES public.stories(id) ON DELETE SET NULL,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  scene_id uuid REFERENCES public.scenes(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'manual',
  model text,
  prompt text NOT NULL,
  status generation_job_status NOT NULL DEFAULT 'queued',
  progress int,
  error_message text,
  estimated_cost numeric,
  actual_cost numeric,
  currency text,
  generation_duration_ms int,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.generation_jobs TO authenticated;
GRANT ALL ON public.generation_jobs TO service_role;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "generation_jobs_admin_read" ON public.generation_jobs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "generation_jobs_admin_write" ON public.generation_jobs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER generation_jobs_updated BEFORE UPDATE ON public.generation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_generation_jobs_status ON public.generation_jobs(status);
CREATE INDEX idx_generation_jobs_story ON public.generation_jobs(story_id);

-- ============================================================
-- PRODUCTION QUOTAS (admin config stored in DB)
-- ============================================================
CREATE TABLE public.production_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.production_config TO authenticated;
GRANT ALL ON public.production_config TO service_role;
ALTER TABLE public.production_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "production_config_admin" ON public.production_config FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.production_config (key, value) VALUES
  ('max_generations_per_day', '{"value": 50}'::jsonb),
  ('max_generations_per_story', '{"value": 20}'::jsonb),
  ('max_generations_per_chapter', '{"value": 10}'::jsonb),
  ('taleon_style', '{"cinematic": true, "premium": true, "atmospheric": true, "dramatic": true, "realistic": true, "contemporary": true, "immersive": true, "sophisticated": true, "strong_composition": true, "natural_skin_texture": true, "believable_environments": true, "controlled_highlights": true, "rich_shadows": true, "subtle_film_grain": true, "cinematic_depth": true, "editorial_quality": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
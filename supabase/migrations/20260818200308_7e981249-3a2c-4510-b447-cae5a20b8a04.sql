
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.story_status AS ENUM ('ongoing','completed','coming_soon');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles_admin_manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- genres
CREATE TABLE public.genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  accent text NOT NULL DEFAULT '#7C3AED',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.genres TO anon, authenticated;
GRANT ALL ON public.genres TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.genres TO authenticated;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "genres_public_read" ON public.genres FOR SELECT USING (true);
CREATE POLICY "genres_admin_write" ON public.genres FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- stories
CREATE TABLE public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  description text,
  cover_url text,
  banner_url text,
  author text NOT NULL DEFAULT 'Taleon Originals',
  status public.story_status NOT NULL DEFAULT 'ongoing',
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_original boolean NOT NULL DEFAULT true,
  is_premium boolean NOT NULL DEFAULT false,
  has_audio boolean NOT NULL DEFAULT false,
  has_video boolean NOT NULL DEFAULT false,
  trending_score numeric NOT NULL DEFAULT 0,
  views int NOT NULL DEFAULT 0,
  reads int NOT NULL DEFAULT 0,
  listens int NOT NULL DEFAULT 0,
  watch_count int NOT NULL DEFAULT 0,
  rating numeric NOT NULL DEFAULT 0,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;
GRANT ALL ON public.stories TO service_role;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stories_public_read" ON public.stories FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "stories_admin_write" ON public.stories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER stories_updated BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.story_genres (
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, genre_id)
);
GRANT SELECT ON public.story_genres TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_genres TO authenticated;
GRANT ALL ON public.story_genres TO service_role;
ALTER TABLE public.story_genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "story_genres_public_read" ON public.story_genres FOR SELECT USING (true);
CREATE POLICY "story_genres_admin_write" ON public.story_genres FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- chapters
CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_number int NOT NULL,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  word_count int NOT NULL DEFAULT 0,
  audio_url text,
  video_url text,
  scene_image_url text,
  is_premium boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  views int NOT NULL DEFAULT 0,
  reads int NOT NULL DEFAULT 0,
  listens int NOT NULL DEFAULT 0,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (story_id, chapter_number)
);
GRANT SELECT ON public.chapters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapters TO authenticated;
GRANT ALL ON public.chapters TO service_role;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapters_public_read" ON public.chapters FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "chapters_admin_write" ON public.chapters FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER chapters_updated BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- characters
CREATE TABLE public.characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  bio text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.characters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.characters TO authenticated;
GRANT ALL ON public.characters TO service_role;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "characters_public_read" ON public.characters FOR SELECT USING (true);
CREATE POLICY "characters_admin_write" ON public.characters FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- videos
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'trailer',
  thumbnail_url text,
  video_url text,
  duration_seconds int,
  is_published boolean NOT NULL DEFAULT true,
  views int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos_public_read" ON public.videos FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "videos_admin_write" ON public.videos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- follows / bookmarks
CREATE TABLE public.follows (
  user_id uuid NOT NULL,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, story_id)
);
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_own" ON public.follows FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.bookmarks (
  user_id uuid NOT NULL,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, story_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookmarks_own" ON public.bookmarks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- progress
CREATE TABLE public.reading_progress (
  user_id uuid NOT NULL,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  chapter_number int NOT NULL DEFAULT 1,
  percent numeric NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, story_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_progress TO authenticated;
GRANT ALL ON public.reading_progress TO service_role;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reading_progress_own" ON public.reading_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.listening_progress (
  user_id uuid NOT NULL,
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  position_seconds numeric NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, chapter_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listening_progress TO authenticated;
GRANT ALL ON public.listening_progress TO service_role;
ALTER TABLE public.listening_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listening_progress_own" ON public.listening_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.watch_history (
  user_id uuid NOT NULL,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  position_seconds numeric NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.watch_history TO authenticated;
GRANT ALL ON public.watch_history TO service_role;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "watch_history_own" ON public.watch_history FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- analytics
CREATE TABLE public.analytics_events (
  id bigserial PRIMARY KEY,
  user_id uuid,
  event_name text NOT NULL,
  story_id uuid,
  chapter_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.analytics_events_id_seq TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics_insert_any" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "analytics_admin_read" ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_chapters_story ON public.chapters(story_id, chapter_number);
CREATE INDEX idx_analytics_event ON public.analytics_events(event_name, created_at DESC);

-- ============ SEED ============
INSERT INTO public.genres (slug, name, description, accent, sort_order) VALUES
('romance','Romance','Love, longing and everything in between.','#F4C95D',1),
('horror','Horror','Stories that keep the lights on.','#7C3AED',2),
('fantasy','Fantasy','Myth, magic and impossible kingdoms.','#7C3AED',3),
('sci-fi','Sci-Fi','Tomorrow, arriving early.','#4C8DF6',4),
('mystery','Mystery','Every answer opens another door.','#F4C95D',5),
('thriller','Thriller','Tension you can feel in your chest.','#E05252',6),
('adventure','Adventure','Journeys worth surviving.','#3FBF9F',7),
('drama','Drama','Ordinary lives, extraordinary weight.','#A1A1AA',8),
('african-stories','African Stories','Voices, cities and legends of the continent.','#F4C95D',9),
('psychological','Psychological','The mind is the darkest room.','#7C3AED',10);

INSERT INTO public.stories (slug,title,short_description,description,author,status,is_featured,has_audio,has_video,trending_score,views,reads,listens,rating,published_at) VALUES
('the-last-signal','The Last Signal','In Nairobi, 2047, every phone in the city receives the same message at exactly 2:17 AM.',
 'In Nairobi, 2047, every phone in the city receives the same message at exactly 2:17 AM: DO NOT TRUST THE PERSON NEXT TO YOU. Amara Otieno, a network forensics analyst, is the only person who can prove the message did not come from any tower on Earth. Tracing it will cost her everything she believes about the city she loves.',
 'Taleon Originals','ongoing',true,true,true,98.4,184230,96120,31240,4.8, now() - interval '40 days'),
('shadow-of-kilimanjaro','Shadow of Kilimanjaro','Something has been walking the mountain since before the ice began to die.',
 'A climbing expedition disappears above the saddle. The only survivor returns speaking a language no linguist can place. As the glaciers retreat, so does the boundary between the living and whatever the mountain has been keeping.',
 'Taleon Originals','ongoing',false,true,false,86.2,91430,42010,10420,4.6, now() - interval '25 days'),
('the-girl-from-sector-9','The Girl From Sector 9','She was never registered. Officially, she does not exist.',
 'In a coastal megacity of registered citizens and licensed identities, a girl with no record at all is found on the sea wall. Every system she touches begins to rewrite itself.',
 'Taleon Originals','ongoing',false,false,false,74.5,52310,20140,0,4.4, now() - interval '14 days'),
('the-red-door','The Red Door','It appears on a different street every night. It only opens once for each person.',
 'A grief-stricken architect starts documenting a door that should not exist. What waits behind it is not a place, but an offer.',
 'Taleon Originals','ongoing',false,true,false,69.1,44120,17330,6110,4.5, now() - interval '9 days'),
('maua','Maua','A florist in Mombasa can read the last wish of anyone who touches her flowers.',
 'Maua sells arrangements for weddings, hospitals and funerals. She never intended to sell secrets. When a stranger buys a bouquet meant for someone still alive, she learns her gift can also be a warning.',
 'Taleon Originals','completed',false,false,false,61.7,38790,22600,0,4.7, now() - interval '70 days'),
('the-last-guardian','The Last Guardian','The final keeper of a broken oath walks toward a war she was built to end.',
 'An epic of duty and inheritance, following the last of an order sworn to protect a border that no longer exists.',
 'Taleon Originals','coming_soon',false,false,false,55.0,12040,0,0,0, now());

INSERT INTO public.story_genres (story_id, genre_id)
SELECT s.id, g.id FROM public.stories s JOIN public.genres g ON true
WHERE (s.slug,g.slug) IN (
 ('the-last-signal','sci-fi'),('the-last-signal','mystery'),('the-last-signal','african-stories'),('the-last-signal','thriller'),
 ('shadow-of-kilimanjaro','horror'),('shadow-of-kilimanjaro','adventure'),('shadow-of-kilimanjaro','african-stories'),
 ('the-girl-from-sector-9','sci-fi'),('the-girl-from-sector-9','mystery'),
 ('the-red-door','horror'),('the-red-door','psychological'),
 ('maua','drama'),('maua','african-stories'),('maua','romance'),
 ('the-last-guardian','fantasy'),('the-last-guardian','adventure'));

INSERT INTO public.characters (story_id,name,role,bio,sort_order)
SELECT s.id, c.name, c.role, c.bio, c.ord FROM public.stories s,
(VALUES
 ('Amara Otieno','Protagonist','A network forensics analyst who can read a city by its traffic patterns.',1),
 ('Detective Kip Barasa','Investigator','Twenty-two years in the service and no patience for impossible evidence.',2),
 ('WACHIRA','Unknown','A signature that appears in every log and belongs to no registered device.',3)
) AS c(name,role,bio,ord)
WHERE s.slug = 'the-last-signal';

INSERT INTO public.chapters (story_id,chapter_number,title,content,word_count,published_at)
SELECT s.id, c.num, c.title, c.body, array_length(regexp_split_to_array(c.body,'\s+'),1), now() - (30 - c.num) * interval '1 day'
FROM public.stories s,
(VALUES
(1,'2:17 AM', $ch$Nairobi does not sleep so much as lower its voice.

At 2:17 in the morning, Amara Otieno was awake because she was always awake at 2:17 in the morning, watching packets crawl across her monitors like insects across a lit window. Then every screen in the apartment went white.

Her phone. Her tablet. The old handset on the shelf that had not held a SIM card in four years. The building intercom. The cracked display of the vending machine two floors below, which she would only learn about later.

DO NOT TRUST THE PERSON NEXT TO YOU.

No sender. No route. No timestamp beyond the one her own device stamped on arrival. Amara sat very still and listened to the city discover it, floor by floor, street by street: a rising sound of three million phones going off at once.

She did what she had been trained to do. She opened a capture window and started recording everything.

By 2:19 the message was gone from every device that had received it. By 2:20 the arguments had started in the corridor. By 2:31 the first fire was burning on Jogoo Road.

Amara looked at the only copy of the signal left in the world, sitting in a buffer on her machine, and understood that it had not come from any tower on Earth.$ch$),
(2,'The Only Copy', $ch$The safest place for a secret in 2047 is a machine that has never touched a network.

Amara owned exactly one: a scavenged tower with its wireless hardware physically removed, which she kept under a desk beneath a stack of unpaid invoices. She moved the capture onto it by cable, then sat back and did not touch anything for eleven minutes while her hands stopped shaking.

The signal was seventy-one bytes long. Seventy-one bytes should not be able to reach a phone with no SIM. Seventy-one bytes should not carry a header format that had been deprecated before she was born, wrapped inside a modulation scheme that had never been standardised at all.

She ran it again. The same seventy-one bytes. And underneath them, in the carrier itself, something that was not payload and not noise.

A name.

WACHIRA.

Outside, a helicopter crossed the estate low enough to move the curtains. Amara did not look up.$ch$),
(3,'Detective Barasa', $ch$Detective Kip Barasa had spent twenty-two years learning that the truth is usually the boring option.

He said so, twice, before Amara finished her sentence. Then she showed him the vending machine.

It stood in the stairwell of her building, a squat orange thing that had sold the same four brands of crisps since 2039. Its display, which was hardwired, unnetworked, and incapable of receiving anything at all, still held nine words in black on white.

DO NOT TRUST THE PERSON NEXT TO YOU.

Barasa looked at it for a long time. Then he took out his notebook, which was paper, and wrote something down, and did not show her what.

'Miss Otieno,' he said. 'Who else knows you kept a copy?'

'Nobody.'

'Good.' He put the notebook away. 'Keep it that way for about six more hours. Then I want you to make me a hundred copies.'$ch$)
) AS c(num,title,body)
WHERE s.slug = 'the-last-signal';

INSERT INTO public.chapters (story_id,chapter_number,title,content,is_premium,published_at)
SELECT s.id, 4, 'The Tower That Was Not There', $ch$Chapter four arrives soon. Taleon members read new chapters first.$ch$, true, now()
FROM public.stories s WHERE s.slug='the-last-signal';

INSERT INTO public.chapters (story_id,chapter_number,title,content,published_at)
SELECT s.id, 1, 'Above the Saddle', $ch$The guides refuse to climb after the second death. They will not say why, only that the mountain has been quiet for a long time and quiet is not the same as empty.$ch$, now() - interval '20 days'
FROM public.stories s WHERE s.slug='shadow-of-kilimanjaro';

INSERT INTO public.chapters (story_id,chapter_number,title,content,published_at)
SELECT s.id, 1, 'Unregistered', $ch$She had no record, no chip, no shadow in any system. The sea wall gave her up at dawn and the city had no idea what to do with her.$ch$, now() - interval '12 days'
FROM public.stories s WHERE s.slug='the-girl-from-sector-9';

INSERT INTO public.chapters (story_id,chapter_number,title,content,published_at)
SELECT s.id, 1, 'First Sighting', $ch$It was on Muranga Road on a Tuesday, painted the colour of something recently alive, and it had not been there the day before.$ch$, now() - interval '8 days'
FROM public.stories s WHERE s.slug='the-red-door';

INSERT INTO public.chapters (story_id,chapter_number,title,content,published_at)
SELECT s.id, 1, 'Jasmine, For a Funeral', $ch$The wish came off the stems the way heat comes off tarmac. Maua wrapped the flowers anyway, because that is what you do when the person in front of you has already decided.$ch$, now() - interval '65 days'
FROM public.stories s WHERE s.slug='maua';

UPDATE public.chapters SET word_count = array_length(regexp_split_to_array(content,'\s+'),1) WHERE word_count = 0;

INSERT INTO public.videos (story_id,title,description,kind,duration_seconds)
SELECT s.id, v.title, v.descr, v.kind, v.dur FROM public.stories s,
(VALUES
 ('The Last Signal — Official Trailer','Nairobi, 2047. Ninety seconds before the city stops trusting itself.','trailer',92),
 ('Chapter 1: 2:17 AM — Cinematic','The opening chapter, told in light and sound.','episode',640),
 ('Inside Taleon: Building Nairobi 2047','A short look at the world behind the story.','short',180)
) AS v(title,descr,kind,dur)
WHERE s.slug='the-last-signal';

INSERT INTO public.videos (story_id,title,description,kind,duration_seconds)
SELECT s.id,'Shadow of Kilimanjaro — Teaser','Something has been walking the mountain.','trailer',58
FROM public.stories s WHERE s.slug='shadow-of-kilimanjaro';

-- Contact form submissions
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamptz not null default now()
);

-- Newsletter subscribers
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  is_active boolean not null default true
);

-- Indexes
create index idx_contact_status on public.contact_submissions(status);
create index idx_contact_created on public.contact_submissions(created_at desc);
create index idx_newsletter_active on public.newsletter_subscribers(is_active) where is_active = true;

-- RLS
alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Anyone can submit contact form
create policy "Anyone can submit contact form"
  on public.contact_submissions for insert
  with check (true);

-- Anyone can subscribe to newsletter
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- Admins can read/manage contact submissions
create policy "Admins read contact submissions"
  on public.contact_submissions for select
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins update contact submissions"
  on public.contact_submissions for update
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins delete contact submissions"
  on public.contact_submissions for delete
  using (public.has_role(auth.uid(),'admin'));

-- Admins can read newsletter subscribers
create policy "Admins read subscribers"
  on public.newsletter_subscribers for select
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins manage subscribers"
  on public.newsletter_subscribers for all
  using (public.has_role(auth.uid(),'admin'));
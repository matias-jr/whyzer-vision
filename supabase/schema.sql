-- whyzer-vision: newsletter CMS schema
-- Paste this into Supabase → SQL Editor → New query → Run

-- =============================================================
-- 1. articles table
-- =============================================================
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  cover_image_url text,
  body          text not null default '',
  author        text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc);

create index if not exists articles_slug_idx
  on public.articles (slug);

-- keep updated_at fresh on every update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- =============================================================
-- 2. Row Level Security
-- =============================================================
alter table public.articles enable row level security;

-- Public (anon) can only read PUBLISHED articles
drop policy if exists "anon reads published" on public.articles;
create policy "anon reads published"
  on public.articles for select
  to anon
  using (status = 'published');

-- Authenticated users (admins) can read everything
drop policy if exists "auth reads all" on public.articles;
create policy "auth reads all"
  on public.articles for select
  to authenticated
  using (true);

-- Authenticated users can insert/update/delete
drop policy if exists "auth writes all" on public.articles;
create policy "auth writes all"
  on public.articles for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================
-- 3. Storage bucket for cover images
-- =============================================================
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

-- Anyone can read images (bucket is public)
drop policy if exists "public reads article-images" on storage.objects;
create policy "public reads article-images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'article-images');

-- Only authenticated users (admins) can upload
drop policy if exists "auth uploads article-images" on storage.objects;
create policy "auth uploads article-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'article-images');

-- Only authenticated users can update/delete their uploads
drop policy if exists "auth modifies article-images" on storage.objects;
create policy "auth modifies article-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'article-images');

drop policy if exists "auth deletes article-images" on storage.objects;
create policy "auth deletes article-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'article-images');

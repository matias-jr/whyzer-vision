-- Allow scheduled publishing: anon only sees published posts whose published_at
-- has already arrived. Posts published with a future published_at stay hidden
-- until that timestamp.

drop policy if exists "anon reads published" on public.articles;

create policy "anon reads published"
  on public.articles for select
  to anon
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  );

-- Helpful for the public listing query
create index if not exists articles_published_at_idx
  on public.articles (published_at desc)
  where status = 'published';

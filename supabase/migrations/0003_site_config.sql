-- Single-row site_config table for tunables editable from /admin.
-- Currently just holds the next live-session date; can be extended later.

create table if not exists public.site_config (
  id              int primary key default 1,
  next_session_at timestamptz,
  updated_at      timestamptz not null default now(),
  constraint site_config_singleton check (id = 1)
);

-- Seed the singleton row if it doesn't exist
insert into public.site_config (id, next_session_at)
values (1, '2026-06-09T16:00:00Z')
on conflict (id) do nothing;

-- updated_at trigger reuses the function from articles
drop trigger if exists site_config_set_updated_at on public.site_config;
create trigger site_config_set_updated_at
  before update on public.site_config
  for each row execute function public.set_updated_at();

-- RLS: anyone can read, only authenticated users can write
alter table public.site_config enable row level security;

drop policy if exists "anyone reads site_config" on public.site_config;
create policy "anyone reads site_config"
  on public.site_config for select
  to anon, authenticated
  using (true);

drop policy if exists "auth writes site_config" on public.site_config;
create policy "auth writes site_config"
  on public.site_config for update
  to authenticated
  using (true)
  with check (true);

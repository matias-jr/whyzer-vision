-- =============================================================
-- Server-side visit capture
--
-- Records every landing on the marketing site from the server, so a visit
-- exists whether or not the browser carries attribution to checkout.
--
-- The gap this closes: of 120 recent checkout contacts, 9 arrived carrying
-- wz_vid and 1 carried the wz_ft_* first-touch params. For the rest, GHL's
-- first recorded touch is the checkout page itself and the campaign that
-- produced them is unrecoverable -- which is why 33 of 38 "Referral" trials
-- are really whyzer.ai -> subscribe.whyzer.ai self-referral.
-- =============================================================

create table if not exists public.visits (
  id                 uuid primary key default gen_random_uuid(),

  -- Random per-browser id minted by src/lib/attribution.ts. The exact join key
  -- to a conversion when it survives the hop to checkout.
  visitor_id         text,

  landing_page       text not null,
  landing_query      text,
  host               text,

  -- Only referrers outside our own estate are stored; an internal hop is not a
  -- referral, and treating it as one is the defect this whole table addresses.
  referrer           text,
  referrer_host      text,

  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_term           text,
  utm_content        text,

  li_fat_id          text,
  gclid              text,
  fbclid             text,
  am_id              text,

  -- The browser's stored FIRST touch, forwarded on every pageview so the
  -- originating campaign survives even when this particular view is untagged.
  first_utm_source   text,
  first_utm_medium   text,
  first_utm_campaign text,

  -- Salted daily hash of IP + user agent. Used only to join a checkout hit to
  -- a site visit when no visitor_id survived; the daily salt stops it becoming
  -- a durable cross-session identifier.
  fingerprint        text,
  user_agent         text,

  occurred_at        timestamptz not null default now(),
  created_at         timestamptz not null default now()
);

create index if not exists visits_visitor_idx     on public.visits (visitor_id);
create index if not exists visits_fingerprint_idx on public.visits (fingerprint);
create index if not exists visits_occurred_idx    on public.visits (occurred_at desc);
create index if not exists visits_utm_source_idx  on public.visits (utm_source);

-- A visitor's earliest campaigned visit: the acquiring touch.
create or replace view public.v_visitor_first_touch as
select distinct on (visitor_id)
  visitor_id,
  coalesce(first_utm_source, utm_source)     as utm_source,
  coalesce(first_utm_medium, utm_medium)     as utm_medium,
  coalesce(first_utm_campaign, utm_campaign) as utm_campaign,
  referrer_host,
  landing_page,
  li_fat_id,
  gclid,
  occurred_at
from public.visits
where visitor_id is not null
order by visitor_id, occurred_at asc;

-- Recovered attribution: GHL contacts whose wz_vid matches a captured visit.
--
-- This is the payoff. A contact GHL filed as "Referral" because the referrer
-- was our own domain gets its real campaign back, provided the visit was
-- captured server-side first.
create or replace view public.v_recovered_attribution as
select
  ae.email,
  ae.ghl_contact_id,
  ae.channel                     as ghl_channel,
  ae.utm_source                  as ghl_utm_source,
  ft.utm_source                  as recovered_utm_source,
  ft.utm_medium                  as recovered_utm_medium,
  ft.utm_campaign                as recovered_utm_campaign,
  ft.referrer_host               as recovered_referrer_host,
  ft.occurred_at                 as first_visit_at,
  (ae.utm_source is null and ft.utm_source is not null) as newly_attributed
from public.attribution_events ae
join public.v_visitor_first_touch ft on ft.visitor_id = ae.visitor_id
where ae.visitor_id is not null;

-- How much of the funnel the server-side capture is actually reaching.
-- Watch stitch_rate_pct climb as the beacon rolls out; it is the honest
-- measure of whether this is working.
create or replace view public.v_capture_health as
select
  date_trunc('day', occurred_at)::date                       as day,
  count(*)                                                   as visits,
  count(distinct visitor_id)                                 as visitors,
  count(*) filter (where utm_source is not null)             as campaigned,
  count(*) filter (where host = 'subscribe.whyzer.ai')       as checkout_visits,
  round(100.0 * count(*) filter (where utm_source is not null)
        / nullif(count(*), 0), 1)                            as tagged_pct
from public.visits
group by 1
order by 1 desc;

alter table public.visits enable row level security;

-- Written by the service role only. Readable by authenticated dashboard users.
drop policy if exists "auth reads visits" on public.visits;
create policy "auth reads visits" on public.visits
  for select to authenticated using (true);

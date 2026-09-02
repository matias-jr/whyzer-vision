-- =============================================================
-- Whyzer analytics warehouse
--
-- Single source of truth for subscriber, attribution and funnel
-- reporting. Paste into Supabase -> SQL Editor -> New query -> Run.
--
-- Design rules, each earned from a defect found during Phase 0/1:
--
--  1. Stripe is authoritative for SUBSCRIPTION STATE (status, trial,
--     cancellation). GHL is authoritative for CONTACT + LIFECYCLE TAGS.
--     Neither overwrites the other; disagreements are surfaced by the
--     reconciliation view rather than silently resolved.
--
--  2. Tier is resolved through tier_dim, not string matching. Both
--     "Elite Sellers Playbook" (a different product) and the high-ticket
--     Vault coaching SKUs contain tier keywords but must be excluded.
--     Unknown SKUs land as 'unmapped' so they surface instead of hiding.
--
--  3. cancel_at_period_end = true counts as churned even while Stripe
--     still reports status 'active'. 16 live subs were in this state at
--     time of writing; GHL reported all of them as plain active.
--
--  4. Join key across systems is lower(trim(email)). GHL subscription
--     ids are Mongo-style and share no identifier with Stripe sub_*.
--
--  5. Every fact table keeps source_system + raw payload so a wrong
--     transform can be re-derived without re-pulling the APIs.
-- =============================================================


-- =============================================================
-- 1. Dimensions
-- =============================================================

-- Canonical tier mapping. Seeded from the 20 GHL line-item names and
-- 5 Stripe price nicknames confirmed 2026-09-01.
create table if not exists public.tier_dim (
  id            uuid primary key default gen_random_uuid(),
  -- Raw name as it appears in the source system.
  raw_name      text not null,
  source_system text not null check (source_system in ('stripe', 'ghl')),
  -- Canonical bucket used by all reporting.
  tier          text not null check (tier in ('premium', 'elite', 'excluded')),
  -- Why an exclusion is excluded, so the decision survives staff turnover.
  note          text,
  created_at    timestamptz not null default now(),
  unique (raw_name, source_system)
);

-- Channel is classified in the ETL by classifyChannel() in
-- api/_attribution-lib.js, which resolves by utm_medium rather than a raw
-- utm_source lookup. That logic already handles cases a lookup table cannot:
-- organic LinkedIn vs paid LinkedIn, and internal CRM imports (manual, csv,
-- zapier) which are not marketing acquisition at all.
--
-- This table therefore holds channel METADATA -- display order, whether a
-- channel counts as acquisition -- not the mapping itself.
create table if not exists public.channel_dim (
  id             uuid primary key default gen_random_uuid(),
  channel        text not null unique,
  -- False for Internal and Unattributed, which must not appear in
  -- acquisition or conversion-rate reporting.
  is_acquisition boolean not null default true,
  display_order  integer not null default 100,
  note           text,
  created_at     timestamptz not null default now()
);


-- =============================================================
-- 2. Facts
-- =============================================================

-- Stripe subscriptions. Source of truth for subscription state.
create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  stripe_subscription_id text not null unique,
  stripe_customer_id    text not null,
  email                 text,                -- lowercased + trimmed on write
  tier                  text not null default 'unmapped',
  price_nickname        text,
  unit_amount_cents     integer,
  billing_interval      text,
  status                text not null,
  cancel_at_period_end  boolean not null default false,
  -- Derived: true when cancelling even if status still reads 'active'.
  is_churned            boolean generated always as (
                          status in ('canceled', 'incomplete_expired')
                          or cancel_at_period_end
                        ) stored,
  trial_start           timestamptz,
  trial_end             timestamptz,
  canceled_at           timestamptz,
  started_at            timestamptz,
  created_at            timestamptz not null,
  raw                   jsonb,
  synced_at             timestamptz not null default now()
);

create index if not exists subscriptions_email_idx on public.subscriptions (email);
create index if not exists subscriptions_tier_status_idx on public.subscriptions (tier, status);
create index if not exists subscriptions_created_idx on public.subscriptions (created_at desc);

-- GHL contacts. Source of truth for lead identity and lifecycle tags.
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  ghl_contact_id  text not null unique,
  email           text,
  name            text,
  contact_type    text,
  tags            text[] not null default '{}',
  -- GHL's own source string. Kept for reference; NOT trusted for
  -- attribution (it reports checkout self-referral as "Referral").
  ghl_source      text,
  created_at      timestamptz not null,
  raw             jsonb,
  synced_at       timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_tags_idx on public.leads using gin (tags);

-- Attribution touches, from GHL attributions[] and the first-party
-- wz_vid capture layer in whyzer-vision/src/lib/attribution.ts.
create table if not exists public.attribution_events (
  id             uuid primary key default gen_random_uuid(),
  email          text,
  visitor_id     text,                 -- wz_vid, joins conversion back to visit
  ghl_contact_id text,
  touch_type     text not null check (touch_type in ('first', 'last')),
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_content    text,
  -- Resolved by classifyChannel(); channel_signal records which rule decided
  -- it, so an unexpected classification can be traced rather than guessed at.
  channel        text,
  channel_signal text,
  landing_page   text,
  referrer       text,
  -- Click identifiers, preserved for ad-platform reconciliation.
  li_fat_id      text,
  gclid          text,
  fbclid         text,
  -- True when the touch was recovered by correcting whyzer.ai ->
  -- subscribe.whyzer.ai being logged as an external referral.
  self_referral_corrected boolean not null default false,
  -- True when the first touch IS the checkout page, meaning the real
  -- journey was lost before GHL ever saw the visitor.
  journey_lost   boolean not null default false,
  occurred_at    timestamptz,
  source_system  text not null default 'ghl',
  raw            jsonb,
  synced_at      timestamptz not null default now(),
  unique (ghl_contact_id, touch_type)
);

create index if not exists attribution_email_idx on public.attribution_events (email);
create index if not exists attribution_visitor_idx on public.attribution_events (visitor_id);
create index if not exists attribution_source_idx on public.attribution_events (utm_source);

-- Open-ended metric store. New sources (email, webinar, ad spend,
-- LinkedIn) land here without a schema change.
create table if not exists public.channel_metrics (
  id            uuid primary key default gen_random_uuid(),
  metric_date   date not null,
  channel       text,
  campaign      text,
  source_system text not null,
  metric_name   text not null,
  metric_value  numeric not null,
  dimensions    jsonb not null default '{}',
  synced_at     timestamptz not null default now(),
  unique (metric_date, source_system, metric_name, channel, campaign)
);

create index if not exists channel_metrics_date_idx on public.channel_metrics (metric_date desc);
create index if not exists channel_metrics_name_idx on public.channel_metrics (metric_name);

-- Every ETL run, so a wrong number can be traced to the sync that made it.
create table if not exists public.sync_runs (
  id            uuid primary key default gen_random_uuid(),
  source_system text not null,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  status        text not null default 'running' check (status in ('running', 'success', 'error')),
  records_read  integer,
  records_written integer,
  error_message text,
  notes         jsonb
);


-- =============================================================
-- 3. Reporting views
-- =============================================================

-- Current subscriber state, tier-filtered, churn applied correctly.
create or replace view public.v_active_subscribers as
select
  tier,
  count(*) filter (where status = 'active' and not cancel_at_period_end) as active_paid,
  count(*) filter (where status = 'trialing')                            as in_trial,
  count(*) filter (where status = 'active' and cancel_at_period_end)     as cancelling,
  count(*) filter (where status in ('active', 'trialing') and not cancel_at_period_end) as true_live,
  count(*) filter (where status = 'past_due')                            as past_due
from public.subscriptions
where tier in ('premium', 'elite')
group by tier;

-- Trial -> paid conversion. Only trials whose outcome is settled.
-- NOTE: trial_start is only populated on recent subscriptions (72 of
-- 1530 at time of writing) because the 14-day trial is a recent change.
-- This view is therefore forward-looking, not a historical trend.
create or replace view public.v_trial_conversion as
select
  tier,
  count(*)                                                          as trials_settled,
  count(*) filter (where not (status = 'canceled'
                              and canceled_at <= trial_end + interval '1 day')) as converted,
  count(*) filter (where status = 'canceled'
                         and canceled_at <= trial_end + interval '1 day')       as churned_in_trial,
  round(
    100.0 * count(*) filter (where not (status = 'canceled'
                                        and canceled_at <= trial_end + interval '1 day'))
    / nullif(count(*), 0), 1
  ) as conversion_pct
from public.subscriptions
where tier in ('premium', 'elite')
  and trial_start is not null
  and trial_end < now()
  and status <> 'incomplete_expired'
group by tier;

-- Subscribers by attributed channel, first touch.
create or replace view public.v_subscribers_by_channel as
select
  coalesce(ae.channel, 'Unattributed')              as channel,
  ae.utm_source                                     as raw_source,
  ae.utm_campaign                                   as campaign,
  s.tier,
  count(distinct s.stripe_subscription_id)          as subscriptions,
  count(distinct s.stripe_subscription_id)
    filter (where s.status = 'trialing')            as in_trial,
  count(distinct s.stripe_subscription_id)
    filter (where s.status = 'active'
                  and not s.cancel_at_period_end)   as paid
from public.subscriptions s
left join public.attribution_events ae
       on ae.email = s.email and ae.touch_type = 'first'
where s.tier in ('premium', 'elite')
group by 1, 2, 3, 4;

-- Full funnel by channel: lead -> trial -> paid, with rates at each stage.
-- Restricted to acquisition channels, so internal CRM imports do not dilute
-- conversion rates.
create or replace view public.v_funnel_by_channel as
with leads_by_channel as (
  select ae.channel, count(distinct l.email) as leads
  from public.leads l
  join public.attribution_events ae
    on ae.ghl_contact_id = l.ghl_contact_id and ae.touch_type = 'first'
  where l.email is not null
  group by ae.channel
),
subs_by_channel as (
  select
    ae.channel,
    count(distinct s.email) filter (where s.trial_start is not null) as trials,
    count(distinct s.email) filter (
      where s.status = 'active' and not s.cancel_at_period_end
    ) as paid
  from public.subscriptions s
  join public.attribution_events ae
    on ae.email = s.email and ae.touch_type = 'first'
  where s.tier in ('premium', 'elite')
  group by ae.channel
)
select
  coalesce(l.channel, s.channel)                    as channel,
  coalesce(l.leads, 0)                              as leads,
  coalesce(s.trials, 0)                             as trials,
  coalesce(s.paid, 0)                               as paid,
  round(100.0 * s.trials / nullif(l.leads, 0), 1)   as lead_to_trial_pct,
  round(100.0 * s.paid / nullif(s.trials, 0), 1)    as trial_to_paid_pct
from leads_by_channel l
full outer join subs_by_channel s on s.channel = l.channel
left join public.channel_dim cd on cd.channel = coalesce(l.channel, s.channel)
where coalesce(cd.is_acquisition, true)
order by coalesce(s.paid, 0) desc;

-- THE TRUST VIEW: where Stripe and GHL disagree. Never auto-resolved.
create or replace view public.v_source_disagreements as
select
  coalesce(s.email, l.email)                          as email,
  s.stripe_subscription_id,
  s.tier,
  s.status                                            as stripe_status,
  s.cancel_at_period_end,
  l.ghl_contact_id,
  l.tags                                              as ghl_tags,
  case
    when s.stripe_subscription_id is not null and l.ghl_contact_id is null
      then 'in_stripe_not_in_ghl'
    when s.stripe_subscription_id is null and l.ghl_contact_id is not null
      then 'in_ghl_not_in_stripe'
    when s.status = 'active' and s.cancel_at_period_end
         and not (l.tags && array['non-renewal', 'non renewal', 'whyzer cancelled'])
      then 'stripe_cancelling_ghl_shows_active'
    when s.is_churned
         and not (l.tags && array['non-renewal', 'non renewal', 'whyzer cancelled'])
      then 'stripe_churned_ghl_untagged'
    else null
  end as disagreement
from public.subscriptions s
full outer join public.leads l on l.email = s.email
where s.tier in ('premium', 'elite') or s.tier is null;

-- Attribution health. The known ceiling on accuracy: localStorage capture
-- cannot survive a cross-device journey (ad on phone, checkout on laptop) and
-- is unavailable in Safari private mode. Those land as Unattributed.
create or replace view public.v_attribution_health as
select
  touch_type,
  count(*)                                                as touches,
  count(*) filter (where utm_source is not null)          as with_utm,
  count(*) filter (where self_referral_corrected)         as self_referral_corrected,
  count(*) filter (where journey_lost)                    as journey_lost,
  count(*) filter (where visitor_id is not null)          as with_visitor_id,
  round(100.0 * count(*) filter (where utm_source is not null)
        / nullif(count(*), 0), 1)                         as utm_coverage_pct
from public.attribution_events
group by touch_type;

-- Raw utm_source values seen in production, with the channel they resolved to.
-- Use this to spot a new campaign convention that classifyChannel() does not
-- yet understand (it will show up as Unattributed with real traffic).
create or replace view public.v_source_channel_audit as
select
  utm_source,
  utm_medium,
  channel,
  channel_signal,
  count(*) as touches
from public.attribution_events
where utm_source is not null or utm_medium is not null
group by 1, 2, 3, 4
order by touches desc;


-- =============================================================
-- 4. Seed data
-- =============================================================

-- Tier mapping, confirmed with Matias 2026-09-01.
insert into public.tier_dim (raw_name, source_system, tier, note) values
  -- GHL line items -> Premium
  ('Whyzer Premium Monthly',                        'ghl', 'premium', null),
  ('Whyzer Premium Yearly Subscription',            'ghl', 'premium', null),
  -- GHL line items -> Elite (includes all legacy Vault bundles)
  ('Whyzer Elite Monthly',                          'ghl', 'elite',   null),
  ('Whyzer Elite Yearly',                           'ghl', 'elite',   null),
  ('Whyzer + Vault Monthly',                        'ghl', 'elite',   null),
  ('Whyzer + Vault - Yearly',                       'ghl', 'elite',   null),
  ('Jamal Reimer''s Vault – Monthly @ 97',          'ghl', 'elite',   'legacy Vault bundle'),
  ('Jamal Reimer''s Vault – Annual @ 997',          'ghl', 'elite',   'legacy Vault bundle'),
  ('The Vault',                                     'ghl', 'elite',   'legacy Vault bundle'),
  ('Monthly Subscription x $97',                    'ghl', 'elite',   'generic name; $97 = Elite monthly'),
  ('Yearly Subscription x $997',                    'ghl', 'elite',   'generic name; $997 = Elite yearly'),
  -- GHL line items -> excluded
  ('The Pipeline Flywheel - Quarterly Payment @ 365','ghl', 'excluded', 'separate product'),
  ('Elite Sellers Playbook - Monthly @ 865',        'ghl', 'excluded', 'separate product; contains "Elite" but is NOT the Elite tier'),
  ('The Vault – Inner Circle @ 2475',               'ghl', 'excluded', 'high-ticket coaching'),
  ('The Vault – Inner Circle 2.0 @ 8400',           'ghl', 'excluded', 'high-ticket coaching'),
  ('The Vault – 1:1 Coaching with Jamal @ 25000',   'ghl', 'excluded', 'high-ticket coaching'),
  ('Test Product – membership @ 1',                 'ghl', 'excluded', 'test data'),
  ('| 12 months',                                   'ghl', 'excluded', 'malformed export row'),
  ('| x12 Installments',                            'ghl', 'excluded', 'malformed export row'),
  ('| x3',                                          'ghl', 'excluded', 'malformed export row'),
  -- Stripe price nicknames
  ('Whyzer Premium Monthly',                        'stripe', 'premium', null),
  ('Whyzer Premium Yearly Subscription',            'stripe', 'premium', null),
  ('Whyzer Elite Monthly',                          'stripe', 'elite',   null),
  ('Whyzer Elite Yearly',                           'stripe', 'elite',   null),
  ('The Vault',                                     'stripe', 'elite',   'legacy Vault bundle')
on conflict (raw_name, source_system) do nothing;

-- Channel metadata. Names must match CHANNELS in api/_attribution-lib.js.
insert into public.channel_dim (channel, is_acquisition, display_order, note) values
  ('Paid',           true,  10, 'utm_source=paid is this account''s convention for LinkedIn ads'),
  ('Organic Social', true,  20, null),
  ('Organic Search', true,  30, null),
  ('Email',          true,  40, 'newsletter and lifecycle email'),
  ('Referral',       true,  50, 'genuine external referrers only; self-referral is corrected in the ETL'),
  ('Direct',         true,  60, null),
  ('Internal',       false, 90, 'manual/CSV/Zapier CRM entry -- not marketing acquisition'),
  ('Unattributed',   false, 99, 'no signal survived; includes cross-device journeys')
on conflict (channel) do nothing;


-- =============================================================
-- 5. Access control
--
-- All tables are service-role only: the ETL writes with the service
-- key, and the dashboard reads through its own authenticated backend.
-- No anon access -- this is revenue data.
-- =============================================================

alter table public.tier_dim           enable row level security;
alter table public.channel_dim        enable row level security;
alter table public.subscriptions      enable row level security;
alter table public.leads              enable row level security;
alter table public.attribution_events enable row level security;
alter table public.channel_metrics    enable row level security;
alter table public.sync_runs          enable row level security;

-- Authenticated dashboard users may read; nobody but the service role writes.
do $$
declare t text;
begin
  foreach t in array array[
    'tier_dim', 'channel_dim', 'subscriptions', 'leads',
    'attribution_events', 'channel_metrics', 'sync_runs'
  ] loop
    execute format('drop policy if exists "auth reads %1$s" on public.%1$I', t);
    execute format(
      'create policy "auth reads %1$s" on public.%1$I for select to authenticated using (true)', t
    );
  end loop;
end $$;

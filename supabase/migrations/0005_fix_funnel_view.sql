-- Fix v_funnel_by_channel: trial_to_paid_pct produced impossible values
-- (up to 1200%) because `trials` counted only subscriptions carrying a
-- trial_start while `paid` counted every active subscription, including the
-- ~95% created before trials existed. The two were never the same cohort.
--
-- Trial-to-paid is now computed strictly within the trial cohort: of the
-- subscriptions that actually started a trial, how many are paying now. The
-- all-time paid count is kept as a separate column rather than being fed into
-- a rate it does not belong to.
-- CREATE OR REPLACE cannot rename or reorder an existing view's columns
-- (Postgres 42P16), and this fix renames `paid` to `paid_all_time` while
-- inserting new columns before it. The view must therefore be dropped first.
-- Nothing depends on it -- the dashboard reads the subscriptions and
-- attribution_events tables directly -- so the drop is safe.
drop view if exists public.v_funnel_by_channel;

create view public.v_funnel_by_channel as
with first_touch as (
  select distinct on (ghl_contact_id)
         ghl_contact_id, email, channel
  from public.attribution_events
  where touch_type = 'first'
  order by ghl_contact_id, occurred_at nulls last
),
leads_by_channel as (
  select ft.channel, count(distinct l.email) as leads
  from public.leads l
  join first_touch ft on ft.ghl_contact_id = l.ghl_contact_id
  where l.email is not null
  group by ft.channel
),
subs_by_channel as (
  select
    ft.channel,
    -- Trial cohort: subscriptions that actually started a trial.
    count(distinct s.stripe_subscription_id)
      filter (where s.trial_start is not null)                     as trials,
    -- Of that cohort, those now paying.
    count(distinct s.stripe_subscription_id)
      filter (where s.trial_start is not null
                    and s.status = 'active'
                    and not s.cancel_at_period_end)                as trials_converted,
    -- Of that cohort, those that ended during or at the trial.
    count(distinct s.stripe_subscription_id)
      filter (where s.trial_start is not null
                    and s.status in ('canceled', 'incomplete_expired'))
                                                                   as trials_lost,
    -- All-time paying subscriptions, trial-era or not. Reported separately.
    count(distinct s.stripe_subscription_id)
      filter (where s.status = 'active' and not s.cancel_at_period_end)
                                                                   as paid_all_time
  from public.subscriptions s
  join first_touch ft on ft.email = s.email
  where s.tier in ('premium', 'elite')
  group by ft.channel
)
select
  coalesce(l.channel, s.channel)                      as channel,
  coalesce(l.leads, 0)                                as leads,
  coalesce(s.trials, 0)                               as trials,
  coalesce(s.trials_converted, 0)                     as trials_converted,
  coalesce(s.trials_lost, 0)                          as trials_lost,
  coalesce(s.paid_all_time, 0)                        as paid_all_time,
  round(100.0 * s.trials / nullif(l.leads, 0), 2)     as lead_to_trial_pct,
  -- Denominator is the trial cohort itself, so this cannot exceed 100.
  round(100.0 * s.trials_converted / nullif(s.trials, 0), 1) as trial_to_paid_pct
from leads_by_channel l
full outer join subs_by_channel s on s.channel = l.channel
left join public.channel_dim cd on cd.channel = coalesce(l.channel, s.channel)
where coalesce(cd.is_acquisition, true)
order by coalesce(s.paid_all_time, 0) desc;

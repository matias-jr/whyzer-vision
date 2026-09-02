# Analytics ETL

Loads GHL and Stripe into the Supabase analytics warehouse
(`supabase/migrations/0004_analytics_warehouse.sql`).

## Division of truth

- **Stripe** is authoritative for subscription state: status, trial dates,
  cancellation. It is the only system that knows `cancel_at_period_end`.
- **GHL** is authoritative for contact identity, lifecycle tags, and the
  attribution touches recorded in `attributions[]`.

Neither overwrites the other. Where they disagree, `v_source_disagreements`
surfaces it rather than picking a winner.

## Running

```sh
node etl/sync-ghl.js --full      # full backfill (~27k contacts)
node etl/sync-ghl.js             # incremental, last 30 days
node etl/sync-stripe.js --full   # full backfill (~1.5k subscriptions)
node etl/sync-stripe.js          # incremental, last 30 days
```

Every run writes a row to `sync_runs`, so a suspect number can be traced back
to the sync that produced it.

## Required environment

Set in `.env.local` (never committed):

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...`; bypasses RLS. Server-side only — never give it a `VITE_` prefix, which would bundle it into the browser build. |
| `GHL_TOKEN` / `GHL_LOCATION_ID` | GHL private integration token |
| `STRIPE_SECRET_KEY` | Restricted key, `rk_live_...`, read access to Subscriptions/Customers/Charges/Prices |

## Known gap: subscription emails

`subscriptions.email` is the join key to `leads` and `attribution_events`.
It is populated by `sync-stripe.js` from the Stripe Customers endpoint.

The Stripe MCP connector redacts PII (`email`, `name`, `metadata` all return
`[REDACTED]`), so the initial subscription load was made without emails. A real
`STRIPE_SECRET_KEY` is required to fill them in; until then the channel and
funnel views return no rows, because they join on email.

## Channel classification

Channels are resolved by `classifyChannel()` in `api/_attribution-lib.js`, not
by a `utm_source` lookup table. That function resolves by `utm_medium`, keeps
organic LinkedIn out of Paid, and separates internal CRM entry (`csv_import`,
`zapier`, `manual`) from real acquisition. `attribution_events.channel_signal`
records which rule fired, so a surprising classification can be explained.

Roughly 83% of contacts are bulk CRM imports. `channel_dim.is_acquisition`
excludes them from funnel reporting; including them would understate every
conversion rate several-fold.

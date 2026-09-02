/**
 * Stripe -> warehouse sync.
 *
 * Stripe is the source of truth for subscription state. Two things it gives us
 * that GHL cannot:
 *
 *   - real trial state (trial_start / trial_end), so trial churn and paid churn
 *     are separable rather than inferred from charge history;
 *   - cancel_at_period_end, which marks a subscription as churned while its
 *     status still reads 'active'. GHL reports these as plainly active.
 *
 * Subscriptions carry a customer id, not an email, so customers are fetched
 * separately and joined in — email being the only key shared with GHL.
 *
 * Usage:
 *   node etl/sync-stripe.js            # incremental (last 30 days)
 *   node etl/sync-stripe.js --full     # full history backfill
 */

import { tierFromStripePrice } from './lib/tier.js';
import { upsert, startRun, finishRun, normalizeEmail, tsToIso } from './lib/warehouse.js';

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const API = 'https://api.stripe.com/v1';

function assertKey() {
  if (!STRIPE_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Create a restricted key in the Stripe ' +
        'dashboard (Developers -> API keys -> Create restricted key) with READ ' +
        'access to Subscriptions, Customers, Charges and Prices. It starts "rk_live_".'
    );
  }
}

async function stripeGet(path, params = {}) {
  assertKey();
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRIPE_KEY}` },
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) {
      throw new Error(
        `Stripe rejected the API key (401). Note that a scope problem returns ` +
          `403, so a 401 means the key itself is not recognised: ${body.slice(0, 200)}`
      );
    }
    throw new Error(`Stripe ${res.status} ${path}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

/** Page through a Stripe list endpoint. */
async function stripeList(path, params = {}, { since = null } = {}) {
  const out = [];
  let startingAfter = null;

  for (;;) {
    const page = await stripeGet(path, {
      ...params,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    const batch = page.data ?? [];
    if (!batch.length) break;

    let hitCutoff = false;
    for (const item of batch) {
      if (since && item.created && item.created < since) {
        hitCutoff = true;
        break;
      }
      out.push(item);
    }

    if (hitCutoff || !page.has_more) break;
    startingAfter = batch[batch.length - 1].id;
  }
  return out;
}

/** customer id -> email, for the subscriptions we actually loaded. */
async function fetchCustomerEmails(customerIds) {
  const emails = new Map();
  const customers = await stripeList('customers', {});
  for (const c of customers) {
    if (customerIds.has(c.id)) emails.set(c.id, normalizeEmail(c.email));
  }
  return emails;
}

function toRow(sub, emailByCustomer) {
  const price = sub.items?.data?.[0]?.price ?? {};
  const tier = tierFromStripePrice({
    nickname: price.nickname,
    unitAmount: price.unit_amount,
    interval: price.recurring?.interval,
  });

  return {
    stripe_subscription_id: sub.id,
    stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
    email: emailByCustomer.get(
      typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
    ) ?? null,
    tier,
    price_nickname: price.nickname ?? null,
    unit_amount_cents: price.unit_amount ?? null,
    billing_interval: price.recurring?.interval ?? null,
    status: sub.status,
    cancel_at_period_end: Boolean(sub.cancel_at_period_end),
    trial_start: tsToIso(sub.trial_start),
    trial_end: tsToIso(sub.trial_end),
    canceled_at: tsToIso(sub.canceled_at),
    started_at: tsToIso(sub.start_date),
    created_at: tsToIso(sub.created),
    raw: sub,
    synced_at: new Date().toISOString(),
  };
}

export async function syncStripe({ full = false } = {}) {
  const runId = await startRun('stripe');
  try {
    const since = full ? null : Math.floor(Date.now() / 1000) - 30 * 86400;
    const subs = await stripeList('subscriptions', { status: 'all' }, { since });

    const customerIds = new Set(
      subs.map((s) => (typeof s.customer === 'string' ? s.customer : s.customer?.id)).filter(Boolean)
    );
    const emailByCustomer = await fetchCustomerEmails(customerIds);

    const rows = subs.map((s) => toRow(s, emailByCustomer));
    const { written } = await upsert('subscriptions', rows, 'stripe_subscription_id');

    const missingEmail = rows.filter((r) => !r.email).length;
    const unmapped = rows.filter((r) => r.tier === 'unmapped').length;

    await finishRun(runId, {
      status: 'success',
      records_read: subs.length,
      records_written: written,
      notes: { full, missing_email: missingEmail, unmapped_tier: unmapped },
    });

    return { read: subs.length, written, missingEmail, unmapped };
  } catch (err) {
    await finishRun(runId, { status: 'error', error_message: String(err.message ?? err) });
    throw err;
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMain) {
  syncStripe({ full: process.argv.includes('--full') })
    .then((r) => {
      console.log(
        `stripe sync ok: read ${r.read}, written ${r.written}, ` +
          `missing email ${r.missingEmail}, unmapped tier ${r.unmapped}`
      );
    })
    .catch((e) => {
      console.error('stripe sync failed:', e.message);
      process.exit(1);
    });
}

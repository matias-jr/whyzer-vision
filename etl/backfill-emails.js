/**
 * Populate subscriptions.email from GHL payment transactions.
 *
 * The Stripe MCP connector redacts PII, so subscriptions were loaded without
 * emails -- which broke every attribution join, since email is the key between
 * Stripe subscriptions and GHL contacts.
 *
 * GHL transactions close that gap: each carries both `contactEmail` and the
 * Stripe `subscriptionId`, so they bridge the two systems directly. This is
 * more reliable than the Stripe Customers endpoint would be, because it is the
 * same email GHL uses for the contact record we are joining to.
 *
 * The /payments/subscriptions endpoint would be the obvious source but the
 * current private integration token lacks that scope; transactions and orders
 * are authorised.
 *
 * Usage: node etl/backfill-emails.js [--days 900]
 */

import { fetchTransactions } from '../api/_attribution-lib.js';

import { select, startRun, finishRun, normalizeEmail, patchByKey } from './lib/warehouse.js';

/**
 * GHL rate-limits burst reads (429). Retry with exponential backoff rather
 * than failing the whole backfill on a transient limit.
 */
async function withRetry(fn, { attempts = 5, baseMs = 4000 } = {}) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (err) {
      const rateLimited = /\b429\b/.test(String(err.message ?? err));
      if (!rateLimited || i === attempts - 1) throw err;
      const wait = baseMs * 2 ** i;
      console.warn(`  rate limited, retrying in ${wait / 1000}s...`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

export async function backfillEmails({ days = 900 } = {}) {
  const runId = await startRun('ghl_tx_email_backfill');
  try {
    // Fetched in 90-day windows: one long pull reliably trips GHL's rate
    // limiter, and a failure mid-way would lose the whole run.
    const WINDOW = 90;
    const txns = [];
    for (let offset = days; offset > 0; offset -= WINDOW) {
      const startAt = iso(Date.now() - offset * 86400 * 1000);
      const endAt = iso(Date.now() - Math.max(0, offset - WINDOW) * 86400 * 1000 + 86400 * 1000);
      const batch = await withRetry(() =>
        fetchTransactions({
          token: process.env.GHL_TOKEN,
          locationId: process.env.GHL_LOCATION_ID,
          startAt,
          endAt,
          maxPages: 40,
        })
      );
      txns.push(...batch);
      console.log(`  ${startAt} .. ${endAt}: ${batch.length} txns (total ${txns.length})`);
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Latest transaction wins, so a corrected email supersedes an older one.
    const emailBySub = new Map();
    for (const t of txns.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))) {
      const email = normalizeEmail(t.contactEmail);
      if (t.subscriptionId && email) emailBySub.set(t.subscriptionId, email);
    }

    // Restrict to subscriptions the warehouse already holds. A GHL transaction
    // can reference a Stripe subscription the Stripe sync never loaded (older
    // than its window, or a non-Stripe provider), and inserting a stub row for
    // one would violate the NOT NULL columns only Stripe can supply.
    const existing = await select('subscriptions', 'select=stripe_subscription_id');
    const known = new Set(existing.map((r) => r.stripe_subscription_id));

    const rows = [...emailBySub.entries()]
      .filter(([subId]) => known.has(subId))
      .map(([subId, email]) => ({ stripe_subscription_id: subId, email }));

    const { updated, missing } = await patchByKey('subscriptions', 'stripe_subscription_id', rows);

    await finishRun(runId, {
      status: 'success',
      records_read: txns.length,
      records_written: updated,
      notes: {
        transactions: txns.length,
        subs_with_email: emailBySub.size,
        matched_in_warehouse: rows.length,
        not_in_warehouse: emailBySub.size - rows.length,
        patch_missed: missing,
      },
    });
    return { txns: txns.length, resolved: emailBySub.size, written: updated };
  } catch (err) {
    await finishRun(runId, { status: 'error', error_message: String(err.message ?? err) });
    throw err;
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMain) {
  const i = process.argv.indexOf('--days');
  backfillEmails({ days: i > -1 ? Number(process.argv[i + 1]) : 900 })
    .then((r) => console.log(`ok: ${r.txns} transactions -> ${r.resolved} subs with email, ${r.written} written`))
    .catch((e) => { console.error('failed:', e.message); process.exit(1); });
}

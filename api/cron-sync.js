/**
 * Scheduled ETL: refreshes the warehouse from GHL and Stripe.
 *
 * Runs incrementally (last 30 days) rather than backfilling. A full sync takes
 * minutes and re-reads two years of history that cannot change; the incremental
 * path finishes in about 6 seconds, which comfortably fits a serverless
 * invocation. Backfills stay manual: `node etl/sync-ghl.js --full`.
 *
 * The dashboard is only worth having if its numbers are current -- the previous
 * dashboard was abandoned partly because nobody refreshed it. This is what
 * keeps that from happening again.
 *
 * Each source runs independently and a failure in one is reported without
 * aborting the others: GHL rate-limits under load, and losing the Stripe
 * refresh because of it would be worse than a partial success.
 */

/**
 * The email backfill dominates the runtime -- it walks GHL transactions in
 * 90-day windows with a pause between each to stay under the rate limiter, so
 * a 45-day lookback still took 82s in testing. Serverless functions are capped
 * well below that on the default plan, so the window is trimmed to the last
 * 14 days: new subscriptions are what need an email attached, and anything
 * older was resolved by the original backfill.
 */
export const config = { maxDuration: 60 };

import { syncGhl } from '../etl/sync-ghl.js';
import { syncStripe } from '../etl/sync-stripe.js';
import { backfillEmails } from '../etl/backfill-emails.js';

/**
 * Vercel signs cron invocations with CRON_SECRET. Without this check the
 * endpoint is a public URL that anyone could hammer, and each call costs real
 * GHL and Stripe rate-limit budget.
 */
function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.authorization || '';
  return header === `Bearer ${secret}`;
}

export default async function handler(req, res) {
  if (!authorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const started = Date.now();
  const results = {};
  let failed = 0;

  // GHL first: it supplies the contacts and attribution touches that the
  // Stripe rows are later joined onto.
  try {
    results.ghl = await syncGhl({ full: false });
  } catch (e) {
    results.ghl = { error: String(e.message ?? e) };
    failed += 1;
  }

  // Stripe is skipped rather than failed when no key is configured: the
  // subscription data is still loaded, just not refreshed, and a hard error
  // here would mask a working GHL sync.
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      results.stripe = await syncStripe({ full: false });
    } catch (e) {
      results.stripe = { error: String(e.message ?? e) };
      failed += 1;
    }
  } else {
    results.stripe = { skipped: 'STRIPE_SECRET_KEY not set' };
  }

  // Emails come from GHL transactions, not Stripe, because the Stripe MCP
  // connector redacts PII. Without this step new subscriptions have no email
  // and cannot be joined to attribution at all.
  try {
    results.emails = await backfillEmails({ days: 14 });
  } catch (e) {
    results.emails = { error: String(e.message ?? e) };
    failed += 1;
  }

  const body = {
    ok: failed === 0,
    failed,
    elapsedMs: Date.now() - started,
    results,
    ranAt: new Date().toISOString(),
  };

  // 207 signals a partial success, so a monitoring check can distinguish
  // "one source is broken" from "the whole sync is down".
  return res.status(failed === 0 ? 200 : 207).json(body);
}

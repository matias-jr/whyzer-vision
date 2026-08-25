import {
  fetchTransactions,
  fetchContactsByIds,
  resolveContactAttribution,
  buildSubscriptionReport,
  DEFAULT_TRIAL_CONVERSION_RATE,
} from './_attribution-lib.js';

/**
 * Subscription and trial-pipeline report for /admin/attribution.
 *
 * Counts ACTIVE subscriptions per source and projects pending trials as
 * expected revenue, rather than treating a $0 trial as either revenue or
 * nothing at all.
 *
 * Subscription state is derived from charge history (GHL exposes no
 * subscription-state endpoint): a subscription is active while its last
 * successful charge sits inside one billing period plus a grace window.
 *
 * Because subscription state depends on the FULL charge history, this endpoint
 * always pulls a long window (default 730 days) regardless of the reporting
 * window — a subscription that started two years ago is still active today.
 *
 * Query params:
 *   model    - 'first' | 'last' (default 'first')
 *   trialCvr - expected trial->paid conversion rate, 0..1 (default 0.5)
 *   days     - history depth in days (default 730, max 1095)
 */

async function verifySupabaseUser(authHeader) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return { ok: false, reason: 'Supabase env not configured' };
  const token = (authHeader || '').replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, reason: 'Missing bearer token' };
  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
  });
  if (!res.ok) return { ok: false, reason: 'Invalid session' };
  return { ok: true };
}

const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifySupabaseUser(req.headers.authorization);
  if (!auth.ok) return res.status(401).json({ error: auth.reason });

  const token = process.env.GHL_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    return res.status(500).json({ error: 'GHL_TOKEN / GHL_LOCATION_ID not configured' });
  }

  const model = req.query.model === 'last' ? 'last' : 'first';
  const days = Math.min(Math.max(parseInt(req.query.days ?? '730', 10) || 730, 30), 1095);

  const parsedCvr = Number.parseFloat(req.query.trialCvr);
  const trialConversionRate =
    Number.isFinite(parsedCvr) && parsedCvr >= 0 && parsedCvr <= 1
      ? parsedCvr
      : DEFAULT_TRIAL_CONVERSION_RATE;

  const now = Date.now();
  const startAt = isoDate(now - days * 24 * 60 * 60 * 1000);
  const endAt = isoDate(now + 24 * 60 * 60 * 1000);

  try {
    const transactions = await fetchTransactions({ token, locationId, startAt, endAt });

    const payerIds = transactions.map((t) => t.contactId).filter(Boolean);
    const contactMap = await fetchContactsByIds({ token, ids: payerIds });
    const resolved = [...contactMap.values()].map(resolveContactAttribution);

    const report = buildSubscriptionReport(resolved, transactions, {
      model,
      trialConversionRate,
      now,
    });

    // The full per-subscription list can be large; return the top slice only.
    const { subscriptions, ...rest } = report;

    res.setHeader('Cache-Control', 'private, max-age=300');
    return res.status(200).json({
      ...rest,
      historyDays: days,
      generatedAt: new Date().toISOString(),
      payersResolved: contactMap.size,
      topSubscriptions: subscriptions.slice(0, 50),
      pendingTrialList: subscriptions
        .filter((s) => s.trialPending)
        .slice(0, 25),
    });
  } catch (err) {
    console.error('subscription report error:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}

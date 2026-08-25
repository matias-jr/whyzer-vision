import {
  fetchTransactions,
  fetchContactsByIds,
  resolveContactAttribution,
  buildRevenueReport,
  effectiveAttribution,
  isRevenue,
  netAmount,
} from './_attribution-lib.js';

/**
 * Revenue-by-source report for /admin/attribution.
 *
 * Joins GHL payment transactions onto contact attribution. Every payer is
 * looked up by contactId rather than relying on a contact-list window, because
 * a payment this month can belong to a contact created long before it — those
 * would otherwise be misfiled as "(unknown contact)".
 *
 * Query params:
 *   days  - lookback window (default 30, max 365)
 *   model - 'first' | 'last' (default 'first')
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

  const days = Math.min(Math.max(parseInt(req.query.days ?? '30', 10) || 30, 1), 365);
  const model = req.query.model === 'last' ? 'last' : 'first';
  const now = Date.now();
  const startAt = isoDate(now - days * 24 * 60 * 60 * 1000);
  const endAt = isoDate(now + 24 * 60 * 60 * 1000);

  try {
    const transactions = await fetchTransactions({ token, locationId, startAt, endAt });

    // Resolve every payer explicitly so revenue is never orphaned.
    const payerIds = transactions.map((t) => t.contactId).filter(Boolean);
    const contactMap = await fetchContactsByIds({ token, ids: payerIds });
    const resolved = [...contactMap.values()].map(resolveContactAttribution);

    const report = buildRevenueReport(resolved, transactions, { model });

    // Name the paying customers we still cannot attribute, so the team can act
    // on them rather than just see a number.
    const byContact = new Map(resolved.map((r) => [r.contactId, r]));
    const unattributedPayers = [];
    const seen = new Set();
    for (const t of transactions) {
      if (!isRevenue(t) || netAmount(t) === 0) continue;
      if (!t.contactId || seen.has(t.contactId)) continue;
      const r = byContact.get(t.contactId);
      const eff = r ? effectiveAttribution(r, model) : null;
      if (!eff || eff.source.startsWith('(')) {
        seen.add(t.contactId);
        unattributedPayers.push({
          contactId: t.contactId,
          name: t.contactName,
          email: t.contactEmail,
          amount: netAmount(t),
          checkoutPage: t.checkoutPage,
          createdAt: t.createdAt,
        });
      }
      if (unattributedPayers.length >= 25) break;
    }

    res.setHeader('Cache-Control', 'private, max-age=300');
    return res.status(200).json({
      ...report,
      windowDays: days,
      generatedAt: new Date().toISOString(),
      payersResolved: contactMap.size,
      unattributedPayers,
    });
  } catch (err) {
    console.error('revenue report error:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}

import {
  fetchAllContacts,
  fetchTransactions,
  resolveContactAttribution,
  buildChannelReport,
  classifyChannel,
  CHANNELS,
} from './_attribution-lib.js';

/**
 * Paid vs organic channel breakdown for /admin/attribution.
 *
 * Rolls source/medium pairs into actionable channels. Internal operations
 * (CSV imports, Zapier, CRM workflows) are reported but excluded from the
 * paid/organic ratio, since they are not marketing acquisition.
 *
 * Query params:
 *   days  - lookback window (default 90, max 365)
 *   model - 'first' | 'last' (default 'first')
 */

const CUSTOMER_TAGS = ['whyzer premium', 'whyzer elite', 'whyzer freemium'];

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

  const days = Math.min(Math.max(parseInt(req.query.days ?? '90', 10) || 90, 1), 365);
  const model = req.query.model === 'last' ? 'last' : 'first';
  const now = Date.now();
  const since = now - days * 24 * 60 * 60 * 1000;

  try {
    const [contacts, transactions] = await Promise.all([
      fetchAllContacts({ token, locationId, since }),
      fetchTransactions({
        token,
        locationId,
        startAt: isoDate(since),
        endAt: isoDate(now + 24 * 60 * 60 * 1000),
      }),
    ]);

    const resolved = contacts.map(resolveContactAttribution);
    const report = buildChannelReport(resolved, transactions, {
      model,
      customerTags: CUSTOMER_TAGS,
    });

    // Paid contacts converting far below other channels is the signature of
    // attribution loss, not ad performance: paid traffic enters with UTMs and
    // then converts without them, so the conversion lands in another channel.
    // Flag it so the number is not read as an ad-spend verdict.
    const paidRow = report.byChannel.find((r) => r.channel === CHANNELS.PAID);
    const organicRows = report.byChannel.filter(
      (r) => r.isAcquisition && r.channel !== CHANNELS.PAID,
    );
    const organicCvr =
      organicRows.reduce((sum, r) => sum + r.customers, 0) /
      Math.max(1, organicRows.reduce((sum, r) => sum + r.contacts, 0));

    const paidUnderReporting =
      Boolean(paidRow) && paidRow.contacts >= 25 && paidRow.conversionRate < organicCvr / 3;

    res.setHeader('Cache-Control', 'private, max-age=300');
    return res.status(200).json({
      ...report,
      windowDays: days,
      generatedAt: new Date().toISOString(),
      paidUnderReporting,
    });
  } catch (err) {
    console.error('channel report error:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}

import {
  fetchAllContacts,
  resolveContactAttribution,
  buildReport,
} from './_attribution-lib.js';

/**
 * Attribution report for /admin/attribution.
 *
 * Reads contacts from GHL (the system of record), resolves each contact's
 * first/last touch, and returns grouped source + campaign performance.
 *
 * Query params:
 *   days   - lookback window in days (default 30, max 365)
 *   model  - 'first' | 'last' attribution model (default 'first')
 *
 * Auth: requires the caller to present the admin's Supabase access token, which
 * is verified against Supabase before any CRM data is returned.
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
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  try {
    const contacts = await fetchAllContacts({ token, locationId, since });
    const resolved = contacts.map(resolveContactAttribution);
    const report = buildReport(resolved, { model, customerTags: CUSTOMER_TAGS });

    // Contacts whose attribution was lost, so the team can see who is affected
    // rather than only a count.
    const lostExamples = resolved
      .filter((r) => r.unattributed && r.type === 'customer')
      .slice(0, 25)
      .map((r) => ({
        contactId: r.contactId,
        email: r.email,
        name: r.name,
        dateAdded: r.dateAdded,
        source: r.source,
        landingPage: r.first?.landingPage ?? null,
      }));

    res.setHeader('Cache-Control', 'private, max-age=300');
    return res.status(200).json({
      ...report,
      windowDays: days,
      generatedAt: new Date().toISOString(),
      lostCustomers: lostExamples,
    });
  } catch (err) {
    console.error('attribution report error:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}

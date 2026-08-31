import {
  fetchAllContacts,
  fetchTransactions,
  resolveContactAttribution,
  effectiveAttribution,
  classifyChannel,
  isRevenue,
  netAmount,
  normalize,
} from './_attribution-lib.js';

/**
 * Contact list filtered by channel, for working a segment or exporting it.
 *
 * Answers "who came in from paid?" with names, emails, campaign, landing page
 * and whether they converted — rather than only a count.
 *
 * Scope: these are CRM contacts, i.e. people who identified themselves by
 * submitting a form or buying. Anonymous visitors who clicked an ad and left
 * are not in GHL and cannot appear here; PostHog holds those.
 *
 * Query params:
 *   channel  - Paid | Organic Social | Organic Search | Referral | Direct |
 *              Email | Internal | Unattributed | all   (default Paid)
 *   days     - lookback window (default 90, max 365)
 *   model    - 'first' | 'last' (default 'first')
 *   campaign - optional exact campaign filter
 *   format   - 'json' (default) or 'csv'
 *   limit    - max rows for json (default 500, max 5000)
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

/** RFC4180-ish escaping: quote when the value contains a comma, quote or newline. */
function csvCell(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows, columns) {
  const head = columns.map((c) => csvCell(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => csvCell(r[c.key])).join(',')).join('\n');
  return `${head}\n${body}`;
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

  const wantChannel = req.query.channel ?? 'Paid';
  const days = Math.min(Math.max(parseInt(req.query.days ?? '90', 10) || 90, 1), 365);
  const model = req.query.model === 'last' ? 'last' : 'first';
  const format = req.query.format === 'csv' ? 'csv' : 'json';
  const limit = Math.min(Math.max(parseInt(req.query.limit ?? '500', 10) || 500, 1), 5000);
  const campaignFilter = req.query.campaign ? normalize(req.query.campaign) : null;

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

    // Revenue per contact, so the list shows who actually paid.
    const revenueByContact = new Map();
    for (const t of transactions) {
      if (!t.contactId || !isRevenue(t)) continue;
      revenueByContact.set(
        t.contactId,
        (revenueByContact.get(t.contactId) || 0) + netAmount(t),
      );
    }

    const resolved = contacts.map(resolveContactAttribution);

    const rows = [];
    for (const r of resolved) {
      const { channel, signal } = classifyChannel(r, model);
      if (wantChannel !== 'all' && channel !== wantChannel) continue;

      const eff = effectiveAttribution(r, model);
      if (campaignFilter && normalize(eff.campaign) !== campaignFilter) continue;

      const revenue = revenueByContact.get(r.contactId) || 0;
      const isCustomer =
        r.type === 'customer' ||
        r.tags.some((tag) => CUSTOMER_TAGS.includes(normalize(tag)));

      rows.push({
        name: r.name ?? '',
        email: r.email ?? '',
        channel,
        source: eff.source,
        medium: eff.medium ?? '',
        campaign: eff.campaign,
        landingPage: r.first?.landingPage ?? '',
        referrer: r.first?.referrer ?? '',
        signal,
        customer: isCustomer ? 'yes' : 'no',
        revenue,
        dateAdded: r.dateAdded ?? '',
        ghlSource: r.source ?? '',
        contactId: r.contactId,
      });
    }

    rows.sort((a, b) => (b.revenue - a.revenue) || String(b.dateAdded).localeCompare(String(a.dateAdded)));

    if (format === 'csv') {
      const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'channel', label: 'Channel' },
        { key: 'source', label: 'Source' },
        { key: 'medium', label: 'Medium' },
        { key: 'campaign', label: 'Campaign' },
        { key: 'landingPage', label: 'Landing page' },
        { key: 'referrer', label: 'Referrer' },
        { key: 'customer', label: 'Customer' },
        { key: 'revenue', label: 'Revenue' },
        { key: 'dateAdded', label: 'Date added' },
        { key: 'ghlSource', label: 'GHL source' },
        { key: 'contactId', label: 'Contact ID' },
      ];
      const stamp = isoDate(now);
      const slug = String(wantChannel).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="whyzer-${slug}-contacts-${stamp}.csv"`,
      );
      return res.status(200).send(toCsv(rows, columns));
    }

    res.setHeader('Cache-Control', 'private, max-age=300');
    return res.status(200).json({
      channel: wantChannel,
      model,
      windowDays: days,
      campaign: req.query.campaign ?? null,
      total: rows.length,
      customers: rows.filter((r) => r.customer === 'yes').length,
      revenue: Math.round(rows.reduce((s, r) => s + r.revenue, 0) * 100) / 100,
      returned: Math.min(rows.length, limit),
      generatedAt: new Date().toISOString(),
      contacts: rows.slice(0, limit),
    });
  } catch (err) {
    console.error('contact list error:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}

import {
  fetchAllContacts,
  resolveContactAttribution,
  effectiveAttribution,
  UTM_FIELD_IDS,
  GHL_API,
  GHL_VERSION,
} from './_attribution-lib.js';

/**
 * Backfill the four existing UTM custom fields from GHL's native attributions[]
 * array.
 *
 * Those fields exist on the location but are populated on 0% of contacts, while
 * the raw pageUrl in attributions[] still carries recoverable UTMs for a share
 * of them. This walks the CRM and writes what can be recovered, so marketing can
 * filter and build smart lists on real values.
 *
 * Defaults to a DRY RUN: it reports what it would change and writes nothing.
 * Pass ?apply=true to commit.
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

async function writeContactFields(token, contactId, values) {
  const customFields = Object.entries(values)
    .filter(([, v]) => Boolean(v))
    .map(([key, value]) => ({ id: UTM_FIELD_IDS[key], value }));
  if (customFields.length === 0) return { skipped: true };

  const res = await fetch(`${GHL_API}/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customFields }),
  });

  if (!res.ok) throw new Error(`GHL update ${contactId} ${res.status}: ${await res.text()}`);
  return { updated: true, fields: customFields.length };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const auth = await verifySupabaseUser(req.headers.authorization);
  if (!auth.ok) return res.status(401).json({ error: auth.reason });

  const token = process.env.GHL_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    return res.status(500).json({ error: 'GHL_TOKEN / GHL_LOCATION_ID not configured' });
  }

  const apply = req.query.apply === 'true';
  const days = Math.min(Math.max(parseInt(req.query.days ?? '90', 10) || 90, 1), 730);
  const limit = Math.min(Math.max(parseInt(req.query.limit ?? '500', 10) || 500, 1), 5000);
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  try {
    const contacts = await fetchAllContacts({ token, locationId, since });
    const resolved = contacts.map(resolveContactAttribution);

    const candidates = [];
    for (const r of resolved) {
      // Already populated — leave it alone.
      if (Object.keys(r.storedFields).length > 0) continue;
      const eff = effectiveAttribution(r, 'first');
      // Only write real UTM values, never the synthetic "(...)" fallbacks.
      if (!eff.source || eff.source.startsWith('(')) continue;

      candidates.push({
        contactId: r.contactId,
        email: r.email,
        values: {
          utm_source: eff.source,
          utm_medium: eff.medium && !eff.medium.startsWith('(') ? eff.medium : '',
          utm_campaign: eff.campaign && eff.campaign !== '(none)' ? eff.campaign : '',
        },
      });
      if (candidates.length >= limit) break;
    }

    if (!apply) {
      return res.status(200).json({
        dryRun: true,
        scanned: resolved.length,
        windowDays: days,
        wouldUpdate: candidates.length,
        preview: candidates.slice(0, 20),
        note: 'No data was written. Re-run with ?apply=true to commit.',
      });
    }

    let updated = 0;
    let skipped = 0;
    const errors = [];
    for (const c of candidates) {
      try {
        const out = await writeContactFields(token, c.contactId, c.values);
        if (out.updated) updated += 1;
        else skipped += 1;
      } catch (err) {
        errors.push({ contactId: c.contactId, error: String(err.message || err) });
      }
      // Stay well inside GHL's rate limits.
      await new Promise((r2) => setTimeout(r2, 120));
    }

    return res.status(200).json({
      dryRun: false,
      scanned: resolved.length,
      updated,
      skipped,
      errorCount: errors.length,
      errors: errors.slice(0, 20),
    });
  } catch (err) {
    console.error('backfill error:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}

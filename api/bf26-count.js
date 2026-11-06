/**
 * GET /api/bf26-count  ->  { count }
 *
 * Number of sellers on the BF26 private list: contacts carrying BF26_TAG in GHL, plus the optional
 * BF26_COUNT_OFFSET. Cached at the edge for 5 minutes so the public page never hammers GHL; the page
 * falls back to its built-in number if this errors.
 */
import { BF26_TAG, GHL_API, bf26Token, ghlHeaders } from './_bf26.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = bf26Token();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) return res.status(503).json({ error: 'Not configured' });

  try {
    const r = await fetch(`${GHL_API}/contacts/search`, {
      method: 'POST',
      headers: ghlHeaders(token),
      body: JSON.stringify({
        locationId,
        page: 1,
        pageLimit: 1, // only the total is needed
        filters: [{ field: 'tags', operator: 'contains', value: [BF26_TAG] }],
      }),
    });
    if (!r.ok) throw new Error(`search ${r.status}: ${await r.text()}`);
    const total = Number((await r.json()).total);
    if (!Number.isFinite(total)) throw new Error('search returned no total');

    const offset = Number(process.env.BF26_COUNT_OFFSET) || 0;
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({ count: total + offset });
  } catch (err) {
    console.error('bf26-count failed:', err);
    return res.status(502).json({ error: 'Count unavailable' });
  }
}

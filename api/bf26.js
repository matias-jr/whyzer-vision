/**
 * Black Friday 2026 private list. One function (Vercel's Hobby plan caps a deployment at 12).
 *
 *  GET  /api/bf26  ->  { count }
 *    Sellers on the list: contacts carrying BF26_TAG in GHL, plus the optional BF26_COUNT_OFFSET.
 *    Cached at the edge for 5 minutes so the public page never hammers GHL; the page falls back
 *    to its built-in number if this errors.
 *
 *  POST /api/bf26  { firstName, email, consent, website }  ->  { ok: true }
 *    Adds the person to the list: upserts the contact in GHL (an existing customer is matched by
 *    email, not duplicated), then adds the BF26 tag, which is what starts the GHL workflow. Tags go
 *    on with the add-tags call rather than the upsert so a returning contact keeps the tags they have.
 *    `website` is a honeypot: people never see the field, bots fill it. Those get a fake success.
 */
import { BF26_TAG, GHL_API, bf26Token, ghlHeaders } from './_bf26.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCE = 'Black Friday 2026 waitlist';

async function getCount(req, res) {
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
    console.error('bf26 count failed:', err);
    return res.status(502).json({ error: 'Count unavailable' });
  }
}

async function signUp(req, res) {
  const { firstName = '', email = '', consent, website } = req.body ?? {};
  if (website) return res.status(200).json({ ok: true });

  const name = String(firstName).trim().slice(0, 60);
  const mail = String(email).trim().toLowerCase().slice(0, 254);
  if (!name) return res.status(400).json({ error: 'Please enter your first name.' });
  if (!EMAIL_RE.test(mail)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (consent !== true) return res.status(400).json({ error: 'Please tick the box to join the private group.' });

  const token = bf26Token();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error('bf26 signup misconfigured: GHL_BF26_TOKEN (or GHL_TOKEN) / GHL_LOCATION_ID missing');
    return res.status(503).json({ error: 'Sign-up is not available right now. Please try again shortly.' });
  }

  try {
    const up = await fetch(`${GHL_API}/contacts/upsert`, {
      method: 'POST',
      headers: ghlHeaders(token),
      body: JSON.stringify({ locationId, firstName: name, email: mail, source: SOURCE }),
    });
    if (!up.ok) throw new Error(`upsert ${up.status}: ${await up.text()}`);
    const body = await up.json();
    const contactId = body.contact?.id ?? body.id;
    if (!contactId) throw new Error('upsert returned no contact id');

    const tag = await fetch(`${GHL_API}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: ghlHeaders(token),
      body: JSON.stringify({ tags: [BF26_TAG] }),
    });
    if (!tag.ok) throw new Error(`add tag ${tag.status}: ${await tag.text()}`);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('bf26 signup failed:', err);
    return res.status(502).json({ error: 'We could not sign you up just now. Please try again.' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') return getCount(req, res);
  if (req.method === 'POST') return signUp(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

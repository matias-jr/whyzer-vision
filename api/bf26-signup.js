/**
 * POST /api/bf26-signup  { firstName, email, consent, website }
 *
 * Adds the person to the BF26 private list in GHL: upserts the contact (so an existing customer
 * is matched by email, not duplicated), then adds the BF26 tag, which is what starts the GHL
 * confirmation email. Tags are added with the add-tags call rather than sent on the upsert so a
 * returning contact never loses the tags they already have.
 *
 * `website` is a honeypot: real people never see the field, bots fill it. Those get a fake success.
 */
import { BF26_TAG, GHL_API, bf26Token, ghlHeaders } from './_bf26.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCE = 'Black Friday 2026 waitlist';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    console.error('bf26-signup misconfigured: GHL_BF26_TOKEN (or GHL_TOKEN) / GHL_LOCATION_ID missing');
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
    console.error('bf26-signup failed:', err);
    return res.status(502).json({ error: 'We could not sign you up just now. Please try again.' });
  }
}

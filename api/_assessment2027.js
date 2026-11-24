/**
 * 2027 Skills Assessment: GHL contact sync.
 *
 * Not a function of its own (the leading underscore keeps Vercel from deploying it): the Hobby plan
 * caps a deployment at 12 functions and main is already at 12, so api/bf26.js hands requests with
 * `form: 'assessment-2027'` to this module. Same GHL token and location as the BF26 list.
 *
 *  POST /api/bf26  { form: 'assessment-2027', stage: 'init', firstName, email, website }
 *    Landing form submitted. Upserts the contact (an existing customer is matched by email, not
 *    duplicated) and adds ASSESSMENT_INIT_TAG.
 *  POST /api/bf26  { form: 'assessment-2027', stage: 'comp', firstName, email }
 *    Results screen reached after all 25 answers. Upserts again (so a contact whose "init" call
 *    failed still exists), writes each skill's result label to its GHL custom field (`results`, keyed
 *    by skill id) and adds ASSESSMENT_COMP_TAG. No numeric scores are sent, only the label.
 *
 * Tags go on with the add-tags call, not the upsert, so a returning contact keeps the tags they have.
 * Location comes from Vercel's edge headers (country, city), so there is no extra lookup and nothing
 * for the browser to send. `website` is a honeypot: bots fill it and get a fake success.
 *
 * Env: GHL_BF26_TOKEN (falls back to GHL_TOKEN) and GHL_LOCATION_ID, as for BF26.
 */
import { GHL_API, bf26Token, ghlHeaders } from './_bf26.js';

export const ASSESSMENT_INIT_TAG = '2027 assessment init';
export const ASSESSMENT_COMP_TAG = '2027 assessment comp';
const SOURCE = 'Academy Skills Assessment 2027';
/** Skill id -> GHL contact custom field (dropdowns in the contact's skills folder). */
export const SKILL_FIELDS = {
  biz: { id: 'Rl0muXrHNHzEYeyIP07P', key: 'contact.executive_business_fluency' },
  disc: { id: 'K3tLtmtaCD6MH2B8hF6U', key: 'contact.insightled_discovery' },
  value: { id: '1yUZ0wdQclz3lx10cENa', key: 'contact.value_clarity' },
  cons: { id: 'mznF3kSUwUspGkf2CIW4', key: 'contact.multithreading__buyinggroup_consensus' },
  risk: { id: 'OwtqysVFGOY2axwk20Ay', key: 'contact.derisking_the_decision' },
};
/** The only values those dropdowns accept. */
export const RESULT_LABELS = ['Strong foundation', 'Solid foundation', 'Developing', 'Priority to develop'];

/** [{ id, field_value }] for the skills present in `results` with a valid label. */
export function customFieldsFromResults(results) {
  if (!results || typeof results !== 'object') return [];
  return Object.entries(SKILL_FIELDS)
    .filter(([skill]) => RESULT_LABELS.includes(results[skill]))
    .map(([skill, f]) => ({ id: f.id, field_value: results[skill] }));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Country (ISO code) and city from Vercel's edge headers. Absent in local dev. */
export function locationFromHeaders(headers = {}) {
  const country = String(headers['x-vercel-ip-country'] || '').trim().toUpperCase();
  let city = String(headers['x-vercel-ip-city'] || '').trim();
  try { city = decodeURIComponent(city); } catch { /* keep the raw value */ }
  const loc = {};
  if (/^[A-Z]{2}$/.test(country)) loc.country = country;
  if (city) loc.city = city.slice(0, 80);
  return loc;
}

export async function handleAssessment(req, res) {
  const { stage, firstName = '', email = '', website, results } = req.body ?? {};
  if (website) return res.status(200).json({ ok: true });
  if (stage !== 'init' && stage !== 'comp') return res.status(400).json({ error: 'Unknown stage.' });

  const name = String(firstName).trim().slice(0, 60);
  const mail = String(email).trim().toLowerCase().slice(0, 254);
  if (!EMAIL_RE.test(mail)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (stage === 'init' && !name) return res.status(400).json({ error: 'Please enter your first name.' });

  const token = bf26Token();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error('assessment-2027 misconfigured: GHL_BF26_TOKEN (or GHL_TOKEN) / GHL_LOCATION_ID missing');
    return res.status(503).json({ error: 'Not available right now.' });
  }

  try {
    const payload = { locationId, email: mail, source: SOURCE, ...locationFromHeaders(req.headers) };
    if (name) payload.firstName = name;
    if (stage === 'comp') {
      const customFields = customFieldsFromResults(results);
      if (customFields.length) payload.customFields = customFields;
    }

    const up = await fetch(`${GHL_API}/contacts/upsert`, {
      method: 'POST',
      headers: ghlHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!up.ok) throw new Error(`upsert ${up.status}: ${await up.text()}`);
    const body = await up.json();
    const contactId = body.contact?.id ?? body.id;
    if (!contactId) throw new Error('upsert returned no contact id');

    const tag = await fetch(`${GHL_API}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: ghlHeaders(token),
      body: JSON.stringify({ tags: [stage === 'init' ? ASSESSMENT_INIT_TAG : ASSESSMENT_COMP_TAG] }),
    });
    if (!tag.ok) throw new Error(`add tag ${tag.status}: ${await tag.text()}`);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(`assessment-2027 ${stage} failed:`, err);
    return res.status(502).json({ error: 'Could not save just now.' });
  }
}

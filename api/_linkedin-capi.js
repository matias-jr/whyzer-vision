/**
 * Shared LinkedIn Conversions API sender for server-side conversion events.
 *
 * LinkedIn matches an event to a person by one or more user ids. We send whatever we have:
 *  - the first-party ads tracking id (li_fat_id, from the LinkedIn click), and/or
 *  - the SHA-256 of the lower-cased, trimmed email (LinkedIn's SHA256_EMAIL id type).
 * eventId makes the call idempotent: LinkedIn deduplicates on it, so a retried webhook
 * does not count the same purchase twice.
 */
import { createHash } from 'node:crypto';

const LINKEDIN_VERSION = '202603';

export const sha256Email = (email) =>
  createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex');

/** Pure payload builder (unit-tested). Returns null when there is nothing to match on. */
export function buildConversionEvent({ conversionId, eventId, happenedAt = Date.now(), liFatId, email, value, currency }) {
  const userIds = [];
  if (liFatId) userIds.push({ idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID', idValue: String(liFatId) });
  if (email) userIds.push({ idType: 'SHA256_EMAIL', idValue: sha256Email(email) });
  if (!userIds.length) return null;

  const event = {
    conversion: `urn:lla:llaPartnerConversion:${conversionId}`,
    conversionHappenedAt: happenedAt,
    eventId,
    user: { userIds },
  };
  const amount = Number(value);
  if (Number.isFinite(amount) && amount > 0 && currency) {
    event.conversionValue = { currencyCode: String(currency).toUpperCase(), amount: amount.toFixed(2) };
  }
  return event;
}

/** Sends one event. Resolves { ok, status, detail }; never throws. */
export async function sendConversionEvent(event, token) {
  try {
    const res = await fetch('https://api.linkedin.com/rest/conversionEvents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Linkedin-Version': LINKEDIN_VERSION,
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(event),
    });
    return { ok: res.ok, status: res.status, detail: res.ok ? '' : await res.text() };
  } catch (err) {
    return { ok: false, status: 0, detail: err.message };
  }
}

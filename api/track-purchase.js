/**
 * LinkedIn conversion for a COMPLETED checkout. The goal we measure is `trial_started`
 * (free-trial signup); `purchase` is supported but optional (leave its conversion id unset to ignore it).
 * "Checkout started" is a click, tracked separately via /api/track-checkout.
 *
 * Live checkouts finish on subscribe.whyzer.ai (GHL order forms), off this site, so the
 * browser cannot report them. A GHL workflow calls this endpoint when an order is
 * submitted / a payment succeeds, and we forward it to LinkedIn's Conversions API.
 *
 * POST /api/track-purchase
 *   Header  x-webhook-secret: <TRACK_PURCHASE_SECRET>
 *   Body    {
 *     event:    'trial_started' | 'purchase'      (required)
 *     email:    contact email                      (email and/or li_fat_id required)
 *     li_fat_id: LinkedIn click id, if GHL kept it
 *     orderId:  GHL order / transaction id         (recommended: makes retries idempotent)
 *     value:    amount paid, e.g. 97              (optional; 0 for a free trial)
 *     currency: 'USD' | 'GBP' | ...               (optional, with value)
 *   }
 *
 * Env: LINKEDIN_ACCESS_TOKEN, TRACK_PURCHASE_SECRET, and one conversion id per event:
 *   LINKEDIN_TRIAL_CONVERSION_ID, LINKEDIN_PURCHASE_CONVERSION_ID
 */
import { timingSafeEqual } from 'node:crypto';
import { buildConversionEvent, sendConversionEvent } from './_linkedin-capi.js';

const CONVERSIONS = {
  trial_started: 'LINKEDIN_TRIAL_CONVERSION_ID',
  purchase: 'LINKEDIN_PURCHASE_CONVERSION_ID',
};

function secretMatches(given, expected) {
  const a = Buffer.from(String(given ?? ''));
  const b = Buffer.from(String(expected ?? ''));
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.TRACK_PURCHASE_SECRET;
  if (!secret) {
    console.error('track-purchase misconfigured: missing TRACK_PURCHASE_SECRET');
    return res.status(503).json({ error: 'Not configured: TRACK_PURCHASE_SECRET' });
  }
  if (!secretMatches(req.headers['x-webhook-secret'], secret)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
  const { event, email, li_fat_id: liFatId, orderId, value, currency } = body;

  const envKey = CONVERSIONS[event];
  if (!envKey) return res.status(400).json({ error: `Unknown event: ${event}. Use trial_started or purchase.` });

  const conversionId = process.env[envKey];
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token || !conversionId) {
    const missing = [!token && 'LINKEDIN_ACCESS_TOKEN', !conversionId && envKey].filter(Boolean).join(', ');
    console.error(`track-purchase misconfigured: missing ${missing}`);
    return res.status(503).json({ error: `Not configured: ${missing}` });
  }

  const payload = buildConversionEvent({
    conversionId,
    // Stable when GHL gives us an order id, so a retried webhook is deduplicated by LinkedIn.
    eventId: orderId ? `${event}-${orderId}` : `${event}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    liFatId,
    email,
    value,
    currency,
  });
  if (!payload) return res.status(400).json({ error: 'Need an email or li_fat_id to match the conversion' });

  const result = await sendConversionEvent(payload, token);
  if (!result.ok) {
    // 401 = lapsed 60-day access token. 503 so the webhook retries once it is replaced.
    console.error(`LinkedIn CAPI ${event} error ${result.status}:`, result.detail);
    return res.status(result.status === 401 ? 503 : 502).json({ error: result.detail });
  }
  return res.status(200).json({ success: true, matchedOn: payload.user.userIds.map((u) => u.idType) });
}

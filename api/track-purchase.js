/**
 * LinkedIn conversion event 2: "Trial subscribed".
 *
 * The checkout finishes on subscribe.whyzer.ai (GHL order forms), off this site, so a GHL
 * workflow calls this endpoint when a trial order is submitted and we forward it to
 * LinkedIn's Conversions API. ("Checkout started" is /api/track-checkout.)
 *
 * POST /api/track-purchase
 *   Header  x-webhook-secret: <TRACK_PURCHASE_SECRET>
 *   Body    { "event": "trial_started", "email": "...", "li_fat_id": "(optional)", "orderId": "..." }
 *
 * Env: LINKEDIN_ACCESS_TOKEN, TRACK_PURCHASE_SECRET, LINKEDIN_TRIAL_CONVERSION_ID
 */
import { timingSafeEqual } from 'node:crypto';
import { buildConversionEvent, sendConversionEvent } from './_linkedin-capi.js';

const CONVERSIONS = {
  trial_started: 'LINKEDIN_TRIAL_CONVERSION_ID',
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
  if (!envKey) return res.status(400).json({ error: `Unknown event: ${event}. Use trial_started.` });

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

/**
 * LinkedIn conversion event 1: "Checkout started" (a click through to subscribe.whyzer.ai).
 * Fired from the browser by the global click listener in src/App.tsx; matched on li_fat_id.
 *
 * Env: LINKEDIN_ACCESS_TOKEN, LINKEDIN_CHECKOUT_CONVERSION_ID
 *      (LINKEDIN_CONVERSION_ID is still read as a fallback for the old name)
 */
import { buildConversionEvent, sendConversionEvent } from './_linkedin-capi.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
  const { li_fat_id } = body;
  if (!li_fat_id) return res.status(400).json({ error: 'Missing li_fat_id' });

  const conversionId = process.env.LINKEDIN_CHECKOUT_CONVERSION_ID || process.env.LINKEDIN_CONVERSION_ID;
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token || !conversionId) {
    console.error('track-checkout misconfigured: missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_CHECKOUT_CONVERSION_ID');
    return res.status(503).json({ error: 'Not configured' });
  }

  const payload = buildConversionEvent({
    conversionId,
    eventId: `checkout-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    liFatId: li_fat_id,
  });

  const result = await sendConversionEvent(payload, token);
  if (!result.ok) {
    console.error(`LinkedIn CAPI checkout error ${result.status}:`, result.detail);
    return res.status(502).json({ error: result.detail });
  }
  return res.status(200).json({ success: true });
}

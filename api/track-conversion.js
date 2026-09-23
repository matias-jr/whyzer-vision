/**
 * LinkedIn Conversions API (server-side conversion events).
 *
 * One endpoint per conversion type, keyed by `event`, so a new conversion
 * needs a env var and a line in CONVERSIONS rather than another handler.
 *
 * The client sends the li_fat_id it holds (first-party ads tracking cookie,
 * set by the Insight Tag). Without one LinkedIn cannot attribute the event,
 * so we skip rather than send an unattributable conversion.
 */

const CONVERSIONS = {
  newsletter: 'LINKEDIN_NEWSLETTER_CONVERSION_ID',
  webinar: 'LINKEDIN_WEBINAR_CONVERSION_ID',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { li_fat_id, event } = req.body ?? {};

  const envKey = CONVERSIONS[event];
  if (!envKey) {
    return res.status(400).json({ error: `Unknown event: ${event}` });
  }
  if (!li_fat_id) return res.status(400).json({ error: 'Missing li_fat_id' });

  const conversionId = process.env[envKey];
  const token = process.env.LINKEDIN_ACCESS_TOKEN;

  // Fail loudly in the logs when the credentials are absent. The previous
  // version returned a bare 500 from LinkedIn's own 401, which is what let a
  // lapsed token go unnoticed: to the browser it looked like any other error.
  if (!token || !conversionId) {
    const missing = [!token && 'LINKEDIN_ACCESS_TOKEN', !conversionId && envKey]
      .filter(Boolean)
      .join(', ');
    console.error(`LinkedIn CAPI misconfigured: missing ${missing}`);
    return res.status(503).json({ error: `Not configured: ${missing}` });
  }

  const body = {
    conversion: `urn:lla:llaPartnerConversion:${conversionId}`,
    conversionHappenedAt: Date.now(),
    eventId: `${event}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user: {
      userIds: [{ idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID', idValue: li_fat_id }],
    },
  };

  let apiRes;
  try {
    apiRes = await fetch('https://api.linkedin.com/rest/conversionEvents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Linkedin-Version': '202603',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error(`LinkedIn CAPI ${event} network error:`, err.message);
    return res.status(502).json({ error: 'Upstream request failed' });
  }

  if (!apiRes.ok) {
    const detail = await apiRes.text();
    // 401 here means the access token has expired: LinkedIn's tokens are
    // 60-day and need regenerating in Campaign Manager.
    console.error(`LinkedIn CAPI ${event} error ${apiRes.status}:`, detail);
    return res.status(apiRes.status === 401 ? 503 : 502).json({ error: detail });
  }

  return res.status(200).json({ success: true });
}

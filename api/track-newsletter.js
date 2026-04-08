export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { li_fat_id } = req.body;
  if (!li_fat_id) return res.status(400).json({ error: 'Missing li_fat_id' });

  const conversionId = process.env.LINKEDIN_NEWSLETTER_CONVERSION_ID;
  const token = process.env.LINKEDIN_ACCESS_TOKEN;

  const body = {
    conversion: `urn:lla:llaPartnerConversion:${conversionId}`,
    conversionHappenedAt: Date.now(),
    eventId: `newsletter-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user: {
      userIds: [{ idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID', idValue: li_fat_id }],
    },
  };

  const apiRes = await fetch('https://api.linkedin.com/rest/conversionEvents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Linkedin-Version': '202603',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!apiRes.ok) {
    const error = await apiRes.text();
    console.error('LinkedIn CAPI newsletter error:', error);
    return res.status(500).json({ error });
  }

  return res.status(200).json({ success: true });
}

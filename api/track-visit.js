/**
 * Server-side visit capture.
 *
 * Why this exists
 * ---------------
 * Attribution currently survives the trip to checkout only if the browser
 * carries it there. src/lib/attribution.ts stores first and last touch in
 * localStorage and replays them onto outbound checkout links, which is the
 * correct cross-domain technique -- subscribe.whyzer.ai is a GHL funnel on a
 * different origin, so it cannot read our storage.
 *
 * In production that chain breaks far more often than it holds. Of 120 recent
 * checkout contacts, only 9 arrived carrying wz_vid and only 1 carried the
 * wz_ft_* first-touch params. The rest reached checkout by a path that never
 * passed through a React CTA: a direct link from an email, an ad pointing
 * straight at subscribe.whyzer.ai, a new device, or a browser that dropped
 * localStorage.
 *
 * When that happens the visit is gone. GHL's first recorded touch becomes the
 * checkout page itself, the referrer is our own domain, and the conversion is
 * filed as "Referral" -- 33 of 38 Referral trials in the last 90 days are this
 * self-referral, not word of mouth.
 *
 * This endpoint records the visit server-side the moment someone lands, so the
 * visit exists independently of whether the browser keeps hold of anything.
 * The conversion is joined back to it later on wz_vid (exact) or IP + user
 * agent (fallback, for visitors who arrive at checkout with no params at all).
 *
 * It stores no names, emails, or cookies -- only a random visitor id, the
 * campaign parameters, and a coarse fingerprint used solely for that fallback
 * join.
 */

import { createHash } from 'node:crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const CLICK_IDS = ['li_fat_id', 'gclid', 'fbclid', 'am_id'];

/** Our own hosts. A referrer from one of these is an internal hop, not a referral. */
const OWN_HOSTS = new Set([
  'whyzer.ai',
  'www.whyzer.ai',
  'subscribe.whyzer.ai',
  'app.whyzer.ai',
  'members.whyzer.ai',
  'console.whyzer.ai',
]);

const norm = (v) => (typeof v === 'string' && v.trim() ? v.trim().toLowerCase() : null);

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * A coarse, non-identifying fingerprint: hashed IP + user agent, salted per
 * day. It exists only to join a checkout hit to a site visit when no wz_vid
 * survived. Rotating the salt daily keeps it from becoming a durable
 * cross-session identifier.
 */
function fingerprint(ip, ua) {
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${day}|${ip || ''}|${ua || ''}`).digest('hex').slice(0, 32);
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || null;
}

export default async function handler(req, res) {
  // The beacon is fire-and-forget from the browser's perspective; never let a
  // tracking failure surface as a visible error on the marketing site.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(200).json({ ok: false, reason: 'not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { href, referrer, visitorId, firstTouch } = body;
    if (!href) return res.status(400).json({ error: 'href required' });

    const url = new URL(href);
    const params = url.searchParams;

    const utm = {};
    for (const k of UTM_KEYS) {
      const v = norm(params.get(k));
      if (v) utm[k] = v;
    }
    const clickIds = {};
    for (const k of CLICK_IDS) {
      const v = params.get(k);
      if (v) clickIds[k] = v.trim();
    }

    // Only a referrer from outside our own estate is a real referrer.
    const refHost = referrer ? hostOf(referrer) : null;
    const externalReferrer = refHost && !OWN_HOSTS.has(refHost) ? referrer : null;

    const ip = clientIp(req);
    const ua = req.headers['user-agent'] || null;

    const row = {
      visitor_id: visitorId || null,
      landing_page: url.origin + url.pathname,
      landing_query: url.search || null,
      host: url.hostname,
      referrer: externalReferrer,
      referrer_host: externalReferrer ? refHost : null,
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_term: utm.utm_term ?? null,
      utm_content: utm.utm_content ?? null,
      li_fat_id: clickIds.li_fat_id ?? null,
      gclid: clickIds.gclid ?? null,
      fbclid: clickIds.fbclid ?? null,
      am_id: clickIds.am_id ?? null,
      // The browser's stored first touch, forwarded so the originating campaign
      // survives even when this particular pageview is untagged.
      first_utm_source: norm(firstTouch?.utm_source),
      first_utm_medium: norm(firstTouch?.utm_medium),
      first_utm_campaign: norm(firstTouch?.utm_campaign),
      fingerprint: fingerprint(ip, ua),
      user_agent: ua ? String(ua).slice(0, 400) : null,
      occurred_at: new Date().toISOString(),
    };

    const r = await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([row]),
    });

    if (!r.ok) {
      console.error('track-visit insert failed:', r.status, (await r.text()).slice(0, 300));
      return res.status(200).json({ ok: false });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('track-visit error:', err?.message ?? err);
    return res.status(200).json({ ok: false });
  }
}

/**
 * Fire-and-forget beacon that records a landing server-side.
 *
 * The localStorage capture in attribution.ts only helps if the same browser
 * later clicks a checkout CTA on our site. This records the visit the moment
 * it happens, so the campaign survives even when the visitor goes to checkout
 * by some other route -- a link from an email, a new device, or a browser that
 * drops storage.
 *
 * Deliberately silent: analytics must never surface an error on the marketing
 * site, so every failure path resolves quietly.
 */

import { captureAttribution, getStoredAttribution } from './attribution';

const ENDPOINT = '/api/track-visit';

/**
 * Guards against a React remount firing the beacon twice for one pageview.
 *
 * Deliberately the LAST href rather than a set of every href seen: a visitor
 * who navigates away and later returns to the same page has made a genuine
 * second visit, and remembering every url would silently discard it.
 */
let lastSentHref: string | null = null;

/** Exposed for tests, which need a clean module between cases. */
export function resetTrackVisit(): void {
  lastSentHref = null;
}

export function trackVisit(): void {
  if (typeof window === 'undefined') return;

  const href = window.location.href;
  if (lastSentHref === href) return;
  lastSentHref = href;

  try {
    // Reuse the existing capture so the visitor id here is the same one that
    // gets appended to checkout links; without that they could not be joined.
    const attribution = captureAttribution(href, document.referrer) ?? getStoredAttribution();

    const payload = {
      href,
      referrer: document.referrer || null,
      visitorId: attribution?.visitorId ?? null,
      firstTouch: attribution
        ? {
            utm_source: attribution.first.utm.utm_source ?? null,
            utm_medium: attribution.first.utm.utm_medium ?? null,
            utm_campaign: attribution.first.utm.utm_campaign ?? null,
          }
        : null,
    };

    const body = JSON.stringify(payload);

    // sendBeacon survives the page being closed mid-request, which a plain
    // fetch does not -- it matters for visitors who bounce immediately, who are
    // exactly the ones current attribution loses.
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      if (ok) return;
    }

    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      /* tracking must never break the page */
    });
  } catch {
    /* tracking must never break the page */
  }
}

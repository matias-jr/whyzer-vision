/**
 * Fires a LinkedIn conversion: the client-side Insight Tag event and the
 * server-side Conversions API event for the same action.
 *
 * Both are sent on purpose. The Insight Tag is blocked for a meaningful share
 * of visitors; CAPI goes server-to-server and is not. LinkedIn deduplicates
 * the pair, so sending both raises the match rate rather than double-counting.
 */

type ConversionEvent = 'newsletter' | 'webinar';

/** The Insight Tag's first-party cookie. LinkedIn cannot attribute without it. */
function readFatId(): string | null {
  const row = document.cookie.split('; ').find((c) => c.startsWith('li_fat_id='));
  if (row) return row.slice('li_fat_id='.length);
  // On the first pageview from an ad click the cookie may not be written yet,
  // but the click id is still on the URL.
  return new URLSearchParams(window.location.search).get('li_fat_id');
}

export function trackLinkedInConversion(event: ConversionEvent, insightTagId?: number) {
  if (typeof window === 'undefined') return;

  if (insightTagId && typeof (window as { lintrk?: unknown }).lintrk === 'function') {
    (window as unknown as { lintrk: (a: string, b: unknown) => void })
      .lintrk('track', { conversion_id: insightTagId });
  }

  const li_fat_id = readFatId();
  if (!li_fat_id) return;

  fetch('/api/track-conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ li_fat_id, event }),
    // The visitor may navigate away mid-request; keepalive lets it finish.
    keepalive: true,
  }).catch(() => {
    /* never let analytics break the page */
  });
}

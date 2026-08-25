/**
 * First-party attribution capture.
 *
 * Why this exists: UTMs used to be read straight off window.location.search at
 * click time. That only attributed visitors who clicked a CTA on the same page
 * they landed on. Anyone who landed on /?utm_source=paid, browsed to another
 * page, and *then* clicked through to subscribe.whyzer.ai arrived with no UTMs
 * at all — GHL recorded their first touch as the checkout page itself and filed
 * the conversion under "Referral" (referrer being our own www.whyzer.ai).
 *
 * We now persist attribution in localStorage the moment a visitor arrives and
 * replay it onto outbound checkout links, so the journey survives navigation.
 *
 * Two touches are kept:
 *   - first touch: the campaign that originally acquired the visitor (never
 *     overwritten while the window is open)
 *   - last touch:  the most recent campaign seen (overwritten on each new
 *     campaigned visit)
 */

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

/** Click identifiers worth preserving alongside UTMs. */
export const CLICK_ID_KEYS = ['li_fat_id', 'gclid', 'fbclid', 'am_id'] as const;

export type Touch = {
  /** Normalized utm_* values. Only keys actually present are set. */
  utm: Partial<Record<UtmKey, string>>;
  /** Click identifiers (li_fat_id, gclid, ...). */
  clickIds: Partial<Record<(typeof CLICK_ID_KEYS)[number], string>>;
  /** Page the visitor landed on for this touch. */
  landingPage: string;
  /** External referrer, or '' when direct / same-origin. */
  referrer: string;
  /** ms epoch. */
  at: number;
};

export type Attribution = {
  first: Touch;
  last: Touch;
  /** Stable per-browser id, so conversions can be joined back to visits. */
  visitorId: string;
};

const STORAGE_KEY = 'whyzer_attribution_v1';

/** Attribution older than this is treated as expired. Matches a 90-day window. */
export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * Campaign values arrive with inconsistent casing — GHL has recorded both
 * "Deal-size" and "deal-size" for the same campaign on a single contact, which
 * fragments any group-by. Normalize to lowercase so reporting collapses them.
 */
export function normalizeUtmValue(value: string): string {
  return value.trim().toLowerCase();
}

/** localStorage throws in Safari private mode and some embedded webviews. */
function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* attribution is best-effort; never break the page over storage */
  }
}

function generateVisitorId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

/**
 * A touch only counts as a new campaign touch if it carries a utm_source or a
 * click id. Plain internal navigation must not overwrite last-touch, or every
 * journey would collapse to "direct".
 */
export function hasCampaignData(touch: Touch): boolean {
  return Boolean(touch.utm.utm_source) || Object.keys(touch.clickIds).length > 0;
}

/** Build a Touch from a URL's query string plus document referrer. */
export function readTouchFromUrl(
  href: string,
  referrer: string,
  now: number = Date.now(),
): Touch {
  const url = new URL(href);
  const search = url.searchParams;

  const utm: Partial<Record<UtmKey, string>> = {};
  UTM_KEYS.forEach((key) => {
    const val = search.get(key);
    if (val) utm[key] = normalizeUtmValue(val);
  });

  const clickIds: Touch['clickIds'] = {};
  CLICK_ID_KEYS.forEach((key) => {
    // Click ids are opaque tokens — preserve their exact casing.
    const val = search.get(key);
    if (val) clickIds[key] = val.trim();
  });

  // Ignore same-origin referrers. www.whyzer.ai -> subscribe.whyzer.ai is an
  // internal handoff, not a referral, and treating it as one is what made paid
  // conversions show up as "Referral" in GHL.
  let externalReferrer = '';
  if (referrer) {
    try {
      if (new URL(referrer).hostname !== url.hostname) externalReferrer = referrer;
    } catch {
      /* malformed referrer — treat as direct */
    }
  }

  return {
    utm,
    clickIds,
    landingPage: url.pathname + url.search,
    referrer: externalReferrer,
    at: now,
  };
}

function isExpired(at: number, now: number): boolean {
  return now - at > ATTRIBUTION_TTL_MS;
}

function parseStored(raw: string | null): Attribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Attribution;
    if (!parsed?.first?.at || !parsed?.last?.at || !parsed.visitorId) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Record the current pageview against stored attribution and return the merged
 * result. Safe to call on every mount — it only mutates storage when there is
 * something new worth recording.
 */
export function captureAttribution(
  href: string,
  referrer: string,
  now: number = Date.now(),
): Attribution {
  const touch = readTouchFromUrl(href, referrer, now);

  // am_id may have been set as a cookie on an earlier visit (affiliate links).
  if (!touch.clickIds.am_id) {
    const cookieAmId = getCookie('am_id');
    if (cookieAmId) touch.clickIds.am_id = cookieAmId;
  }

  const stored = parseStored(safeGetItem(STORAGE_KEY));
  const campaigned = hasCampaignData(touch);

  // No usable history: this visit becomes both first and last touch.
  if (!stored || isExpired(stored.first.at, now)) {
    const fresh: Attribution = {
      first: touch,
      last: touch,
      visitorId: stored?.visitorId ?? generateVisitorId(),
    };
    safeSetItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  // Known visitor arriving without campaign data (internal navigation, direct
  // return). Keep both touches as they are.
  if (!campaigned) return stored;

  // Known visitor arriving on a new campaign: first touch is preserved, last
  // touch advances.
  const updated: Attribution = {
    first: stored.first,
    last: touch,
    visitorId: stored.visitorId,
  };
  safeSetItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/** Read stored attribution without recording a new touch. */
export function getStoredAttribution(now: number = Date.now()): Attribution | null {
  const stored = parseStored(safeGetItem(STORAGE_KEY));
  if (!stored || isExpired(stored.first.at, now)) return null;
  return stored;
}

/**
 * Build the query string appended to outbound checkout links.
 *
 * Last-touch UTMs are sent as the canonical utm_* params, because that is what
 * GHL's order forms read into their own attribution. First touch travels
 * alongside under wz_ft_* so the originating campaign is recoverable even when
 * last touch differs, and wz_vid joins the conversion back to the visit.
 */
export function buildOutboundParams(attribution: Attribution | null): string {
  if (!attribution) return '';
  const out = new URLSearchParams();

  UTM_KEYS.forEach((key) => {
    const val = attribution.last.utm[key];
    if (val) out.set(key, val);
  });

  Object.entries(attribution.last.clickIds).forEach(([key, val]) => {
    if (val) out.set(key, val);
  });

  UTM_KEYS.forEach((key) => {
    const val = attribution.first.utm[key];
    if (val) out.set(`wz_ft_${key.replace('utm_', '')}`, val);
  });

  out.set('wz_vid', attribution.visitorId);

  return out.toString();
}

/** Append attribution params to a URL, preserving any query string it has. */
export function appendParamsToUrl(url: string, params: string): string {
  if (!params) return url;
  return url.includes('?') ? `${url}&${params}` : `${url}?${params}`;
}

/** Clear stored attribution. Exposed for tests and debugging. */
export function clearAttribution(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

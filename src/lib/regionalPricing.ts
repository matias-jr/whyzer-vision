/**
 * Local currency + checkout region for marketing pages that link to subscribe.whyzer.ai.
 *
 * Same rules as the home page pricing (HomeV8.tsx) and the legacy Pricing.tsx: geolocate the
 * visitor by IP, show the same number with their currency symbol (prices are identical in every
 * currency), and point checkout links at the matching regional slug (`elite-annually-uk`).
 * Anything unrecognised, or a failed lookup, stays USD with no suffix.
 *
 * Note: this is deliberately the marketing-site rule set, whose EUR list is wider than
 * currencyForCountry() in checkoutPlans.ts (which serves the in-site checkout).
 */
import { useEffect, useState } from 'react';

export type Region = { currency: 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD'; symbol: string; suffix: '' | '-uk' | '-eu' | '-ca' | '-au' };

export const USD: Region = { currency: 'USD', symbol: '$', suffix: '' };
const GBP: Region = { currency: 'GBP', symbol: '£', suffix: '-uk' };
const EUR: Region = { currency: 'EUR', symbol: '€', suffix: '-eu' };
const CAD: Region = { currency: 'CAD', symbol: 'CA$', suffix: '-ca' };
const AUD: Region = { currency: 'AUD', symbol: 'AU$', suffix: '-au' };

export const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
  'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  // non-EU Europe that uses EUR or is broadly "Europe"
  'CH','NO','IS','AL','BA','ME','MK','RS','MD','UA','BY','GE','AM','AZ',
  'LI','MC','SM','VA','AD','XK',
]);

export function regionForCountry(code: string | null | undefined): Region {
  const c = (code ?? '').toUpperCase();
  if (c === 'GB') return GBP;
  if (EU_COUNTRIES.has(c)) return EUR;
  if (c === 'CA') return CAD;
  if (c === 'AU') return AUD;
  return USD;
}

export const CHECKOUT_BASE = 'https://subscribe.whyzer.ai';

/** `elite`, `year`, UK -> https://subscribe.whyzer.ai/elite-annually-uk */
export const checkoutUrl = (plan: 'premium' | 'elite', annual: boolean, region: Region) =>
  `${CHECKOUT_BASE}/${plan}-${annual ? 'annually' : 'monthly'}${region.suffix}`;

/** "$598.20", "£456", "€1,164". Whole amounts drop the decimals. */
export const formatMoney = (amount: number, region: Region) =>
  region.symbol + (Number.isInteger(amount) ? amount.toLocaleString('en-US') : amount.toFixed(2));

/** Starts as USD (server render and first paint), then switches once the lookup returns. */
export function useRegion(): Region {
  const [region, setRegion] = useState<Region>(USD);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch('https://ipapi.co/json/', { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => setRegion(regionForCountry(data?.country_code)))
      .catch(() => { /* keep USD */ });
    return () => ctrl.abort();
  }, []);
  return region;
}

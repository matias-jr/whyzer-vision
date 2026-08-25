import { describe, it, expect, beforeEach } from 'vitest';
import {
  captureAttribution,
  readTouchFromUrl,
  buildOutboundParams,
  appendParamsToUrl,
  getStoredAttribution,
  clearAttribution,
  normalizeUtmValue,
  ATTRIBUTION_TTL_MS,
} from '@/lib/attribution';

const LANDING = 'https://www.whyzer.ai/?utm_source=paid&utm_medium=linkedin&utm_campaign=deal-size';

beforeEach(() => {
  clearAttribution();
});

describe('readTouchFromUrl', () => {
  it('extracts utm params and normalizes casing', () => {
    const touch = readTouchFromUrl(
      'https://www.whyzer.ai/?utm_source=Paid&utm_campaign=Deal-Size',
      '',
    );
    expect(touch.utm.utm_source).toBe('paid');
    expect(touch.utm.utm_campaign).toBe('deal-size');
  });

  it('captures utm_term, which the previous implementation ignored', () => {
    const touch = readTouchFromUrl('https://www.whyzer.ai/?utm_term=cfo', '');
    expect(touch.utm.utm_term).toBe('cfo');
  });

  it('preserves click id casing', () => {
    const touch = readTouchFromUrl(
      'https://www.whyzer.ai/?li_fat_id=09c504a0-1E2a-4d6b',
      '',
    );
    expect(touch.clickIds.li_fat_id).toBe('09c504a0-1E2a-4d6b');
  });

  it('ignores same-origin referrers so internal handoffs are not "Referral"', () => {
    // The production bug: www.whyzer.ai -> subscribe.whyzer.ai was recorded by
    // GHL as a Referral, burying paid conversions.
    const touch = readTouchFromUrl(
      'https://www.whyzer.ai/elite-upgrade',
      'https://www.whyzer.ai/',
    );
    expect(touch.referrer).toBe('');
  });

  it('keeps genuine external referrers', () => {
    const touch = readTouchFromUrl(
      'https://www.whyzer.ai/',
      'https://www.linkedin.com/',
    );
    expect(touch.referrer).toBe('https://www.linkedin.com/');
  });
});

describe('captureAttribution', () => {
  it('records first and last touch on a fresh visit', () => {
    const attr = captureAttribution(LANDING, 'https://www.linkedin.com/');
    expect(attr.first.utm.utm_source).toBe('paid');
    expect(attr.last.utm.utm_campaign).toBe('deal-size');
    expect(attr.visitorId).toBeTruthy();
  });

  it('survives navigation to a page without utms', () => {
    // This is the Fredrik Flodberg case: landed with campaign data, browsed on,
    // then hit checkout. Previously the UTMs were gone by click time.
    captureAttribution(LANDING, 'https://www.linkedin.com/');
    const later = captureAttribution('https://www.whyzer.ai/newsletter', '');

    expect(later.first.utm.utm_source).toBe('paid');
    expect(later.last.utm.utm_source).toBe('paid');
  });

  it('preserves first touch when a new campaign arrives', () => {
    captureAttribution(LANDING, 'https://www.linkedin.com/');
    const second = captureAttribution(
      'https://www.whyzer.ai/?utm_source=newsletter&utm_campaign=weekly',
      '',
    );

    expect(second.first.utm.utm_source).toBe('paid');
    expect(second.last.utm.utm_source).toBe('newsletter');
  });

  it('keeps a stable visitorId across visits', () => {
    const first = captureAttribution(LANDING, '');
    const second = captureAttribution('https://www.whyzer.ai/newsletter', '');
    expect(second.visitorId).toBe(first.visitorId);
  });

  it('does not let plain navigation overwrite last touch', () => {
    captureAttribution(LANDING, '');
    const nav = captureAttribution('https://www.whyzer.ai/pricing', '');
    expect(nav.last.utm.utm_campaign).toBe('deal-size');
  });

  it('resets attribution once the window expires', () => {
    const now = Date.now();
    captureAttribution(LANDING, '', now);

    const later = now + ATTRIBUTION_TTL_MS + 1;
    const fresh = captureAttribution('https://www.whyzer.ai/', '', later);
    expect(fresh.first.utm.utm_source).toBeUndefined();
  });

  it('treats expired attribution as absent when reading', () => {
    const now = Date.now();
    captureAttribution(LANDING, '', now);
    expect(getStoredAttribution(now + ATTRIBUTION_TTL_MS + 1)).toBeNull();
  });
});

describe('buildOutboundParams', () => {
  it('sends last touch as canonical utms and first touch as wz_ft_*', () => {
    captureAttribution(LANDING, '');
    const attr = captureAttribution(
      'https://www.whyzer.ai/?utm_source=newsletter&utm_campaign=weekly',
      '',
    );
    const params = new URLSearchParams(buildOutboundParams(attr));

    expect(params.get('utm_source')).toBe('newsletter');
    expect(params.get('wz_ft_source')).toBe('paid');
    expect(params.get('wz_ft_campaign')).toBe('deal-size');
    expect(params.get('wz_vid')).toBeTruthy();
  });

  it('forwards click ids', () => {
    const attr = captureAttribution(
      'https://www.whyzer.ai/?utm_source=paid&li_fat_id=abc123',
      '',
    );
    expect(new URLSearchParams(buildOutboundParams(attr)).get('li_fat_id')).toBe('abc123');
  });

  it('returns an empty string when there is no attribution', () => {
    expect(buildOutboundParams(null)).toBe('');
  });
});

describe('appendParamsToUrl', () => {
  it('uses ? for a clean url', () => {
    expect(appendParamsToUrl('https://subscribe.whyzer.ai/elite-monthly', 'utm_source=paid'))
      .toBe('https://subscribe.whyzer.ai/elite-monthly?utm_source=paid');
  });

  it('uses & when the url already has a query', () => {
    expect(appendParamsToUrl('https://subscribe.whyzer.ai/x?a=1', 'utm_source=paid'))
      .toBe('https://subscribe.whyzer.ai/x?a=1&utm_source=paid');
  });

  it('returns the url untouched when there are no params', () => {
    expect(appendParamsToUrl('https://subscribe.whyzer.ai/x', '')).toBe(
      'https://subscribe.whyzer.ai/x',
    );
  });
});

describe('normalizeUtmValue', () => {
  it('collapses the casing variants GHL recorded for one campaign', () => {
    expect(normalizeUtmValue('Deal-size')).toBe(normalizeUtmValue('deal-size'));
  });
});

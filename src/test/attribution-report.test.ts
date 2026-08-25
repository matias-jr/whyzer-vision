import { describe, it, expect } from 'vitest';
import {
  resolveTouch,
  resolveContactAttribution,
  effectiveAttribution,
  buildReport,
  utmsFromUrl,
  isOwnDomain,
  normalize,
} from '../../api/_attribution-lib.js';

/** Shapes below are copied from real GHL API responses. */

const joshJackson = {
  id: 'DB5qEqPbknK3cmZhtYk7',
  contactName: 'josh jackson',
  email: 'josh@example.com',
  type: 'customer',
  tags: ['whyzer premium', 'free trial'],
  attributions: [
    {
      pageUrl:
        'https://subscribe.whyzer.ai/elite-monthly?utm_source=paid&utm_medium=linkedin&utm_campaign=deal-size',
      utmSessionSource: 'Referral',
      utmCampaign: 'Deal-size',
      utmMedium: 'linkedin',
      isFirst: true,
      medium: 'order_form',
      url: 'https://subscribe.whyzer.ai/elite-monthly',
      referrer: 'https://www.whyzer.ai',
      utmSource: 'paid',
    },
    {
      pageUrl:
        'https://subscribe.whyzer.ai/elite-monthly?utm_source=paid&utm_medium=linkedin&utm_campaign=deal-size',
      utmSessionSource: 'Referral',
      utmCampaign: 'deal-size',
      isLast: true,
      url: 'https://subscribe.whyzer.ai/elite-monthly',
      referrer: 'https://www.whyzer.ai',
      utmSource: 'paid',
    },
  ],
  customFields: [],
};

const fredrik = {
  id: 'hFF6jTvHlssAfBg5cHcL',
  contactName: 'fredrik flodberg',
  type: 'customer',
  tags: ['whyzer premium'],
  attributions: [
    {
      pageUrl: 'https://subscribe.whyzer.ai/elite-monthly-eu',
      referrer: 'https://www.whyzer.ai',
      utmSessionSource: 'Referral',
      isFirst: true,
      medium: 'order_form',
      url: 'https://subscribe.whyzer.ai/elite-monthly-eu',
    },
    {
      pageUrl: 'https://subscribe.whyzer.ai/elite-monthly-eu',
      referrer: 'https://www.whyzer.ai',
      utmSessionSource: 'Referral',
      isLast: true,
      url: 'https://subscribe.whyzer.ai/elite-monthly-eu',
    },
  ],
  customFields: [],
};

describe('utmsFromUrl', () => {
  it('parses utms and normalizes casing', () => {
    const u = utmsFromUrl('https://x.com/?utm_source=Paid&utm_campaign=Deal-Size');
    expect(u.utm_source).toBe('paid');
    expect(u.utm_campaign).toBe('deal-size');
  });

  it('reads the first-touch params our capture layer forwards', () => {
    const u = utmsFromUrl('https://x.com/?wz_ft_source=linkedin&wz_ft_campaign=q3&wz_vid=abc');
    expect(u.first_touch_source).toBe('linkedin');
    expect(u.first_touch_campaign).toBe('q3');
    expect(u.visitor_id).toBe('abc');
  });

  it('returns empty for a malformed url', () => {
    expect(utmsFromUrl('not-a-url')).toEqual({});
  });
});

describe('isOwnDomain', () => {
  it('recognizes our domains', () => {
    expect(isOwnDomain('https://subscribe.whyzer.ai/x')).toBe(true);
    expect(isOwnDomain('https://www.whyzer.ai/')).toBe(true);
  });
  it('rejects external domains', () => {
    expect(isOwnDomain('https://www.linkedin.com/')).toBe(false);
  });
});

describe('resolveTouch', () => {
  it('corrects a self-referral that GHL filed as Referral', () => {
    const t = resolveTouch(joshJackson.attributions[0]);
    expect(t.selfReferralCorrected).toBe(true);
    expect(t.sessionSource).not.toBe('Referral');
    expect(t.source).toBe('paid');
  });

  it('collapses the casing drift on one contact', () => {
    const first = resolveTouch(joshJackson.attributions[0]);
    const last = resolveTouch(joshJackson.attributions[1]);
    expect(first.campaign).toBe(last.campaign);
  });

  it('flags a first touch that is already the checkout page', () => {
    expect(resolveTouch(fredrik.attributions[0]).journeyLost).toBe(true);
  });
});

describe('resolveContactAttribution', () => {
  it('attributes a customer whose utms survived', () => {
    const r = resolveContactAttribution(joshJackson);
    expect(r.unattributed).toBe(false);
    expect(effectiveAttribution(r, 'first').source).toBe('paid');
    expect(effectiveAttribution(r, 'first').campaign).toBe('deal-size');
  });

  it('marks a customer whose journey was lost as unattributed', () => {
    const r = resolveContactAttribution(fredrik);
    expect(r.unattributed).toBe(true);
    expect(effectiveAttribution(r, 'first').source).toBe('(unattributed)');
  });

  it('handles a contact with no attributions at all', () => {
    const r = resolveContactAttribution({ id: 'x', tags: [], customFields: [] });
    expect(r.unattributed).toBe(true);
  });

  it('reads stored utm custom fields once backfilled', () => {
    const r = resolveContactAttribution({
      id: 'y',
      tags: [],
      customFields: [{ id: 'DN4PluJwtSZwsmGFFbJa', value: 'LinkedIn' }],
    });
    expect(r.storedFields.utm_source).toBe('linkedin');
    expect(effectiveAttribution(r, 'first').source).toBe('linkedin');
  });
});

describe('buildReport', () => {
  it('counts customers by tag as well as type', () => {
    const rep = buildReport([resolveContactAttribution(joshJackson)], {
      customerTags: ['whyzer premium'],
    });
    expect(rep.totals.customers).toBe(1);
  });

  it('surfaces journey-lost and self-referral counts', () => {
    const rep = buildReport(
      [resolveContactAttribution(joshJackson), resolveContactAttribution(fredrik)],
      { customerTags: ['whyzer premium'] },
    );
    // Both customers are journey-lost: their first recorded touch is already
    // the checkout page, so whatever they did on whyzer.ai beforehand was never
    // captured. Josh differs only in that his UTMs rode along on the URL, so he
    // stays attributable while Fredrik does not.
    expect(rep.totals.journeyLost).toBe(2);
    expect(rep.totals.selfReferralCorrected).toBe(2);
    expect(rep.totals.contacts).toBe(2);
  });

  it('computes attribution coverage', () => {
    const rep = buildReport([
      resolveContactAttribution(joshJackson),
      resolveContactAttribution(fredrik),
    ]);
    expect(rep.totals.attributionCoverage).toBe(0.5);
  });

  it('groups by source with a conversion rate', () => {
    const rep = buildReport([resolveContactAttribution(joshJackson)], {
      customerTags: ['whyzer premium'],
    });
    const paid = rep.bySource.find((r: { source: string }) => r.source === 'paid');
    expect(paid.conversionRate).toBe(1);
  });
});

describe('normalize', () => {
  it('lowercases and trims', () => {
    expect(normalize('  LinkedIn ')).toBe('linkedin');
  });
  it('tolerates non-strings', () => {
    expect(normalize(null)).toBe('');
  });
});

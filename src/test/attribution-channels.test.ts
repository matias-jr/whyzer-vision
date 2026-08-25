import { describe, it, expect } from 'vitest';
import {
  classifyChannel,
  buildChannelReport,
  isAcquisitionChannel,
  resolveContactAttribution,
  CHANNELS,
} from '../../api/_attribution-lib.js';

/** Build a contact whose first touch carries the given attribution. */
const contact = (
  over: Record<string, unknown> = {},
  touch: Record<string, unknown> = {},
) =>
  resolveContactAttribution({
    id: 'c1',
    tags: [],
    customFields: [],
    attributions: [
      {
        isFirst: true,
        url: 'https://www.whyzer.ai/',
        pageUrl: 'https://www.whyzer.ai/',
        ...touch,
      },
    ],
    ...over,
  });

describe('classifyChannel — paid', () => {
  it('treats this account’s utm_source=paid convention as Paid', () => {
    const c = contact({}, { utmSource: 'paid', utmMedium: 'linkedin' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.PAID);
  });

  it('also handles the conventional utm_medium=cpc form', () => {
    const c = contact({}, { utmSource: 'google', utmMedium: 'cpc' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.PAID);
  });

  it('falls back to GHL Paid Social when no utms survived', () => {
    const c = contact({}, { utmSessionSource: 'Paid Social', medium: 'form' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.PAID);
  });

  it('reports which signal decided the classification', () => {
    const c = contact({}, { utmSource: 'paid' });
    expect(classifyChannel(c).signal).toBe('utm_source=paid');
  });
});

describe('classifyChannel — LinkedIn paid vs organic', () => {
  it('classifies a LinkedIn ad click as Paid', () => {
    const c = contact({}, { utmSource: 'paid', utmMedium: 'linkedin' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.PAID);
  });

  it('classifies a LinkedIn DM as Organic Social, not Paid', () => {
    // source=linkedin alone would look paid; the medium is what disambiguates.
    const c = contact({}, { utmSource: 'linkedin', utmMedium: 'dm' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.ORGANIC_SOCIAL);
  });

  it('classifies an organic LinkedIn post as Organic Social', () => {
    const c = contact({}, { utmSource: 'linkedin', utmMedium: 'post' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.ORGANIC_SOCIAL);
  });

  it('classifies profile traffic as Organic Social', () => {
    const c = contact({}, { utmSource: 'linkedin', utmMedium: 'jamalprofile' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.ORGANIC_SOCIAL);
  });
});

describe('classifyChannel — internal operations', () => {
  it.each(['manual', 'csv_import', 'zapier'])('treats medium=%s as Internal', (medium) => {
    const c = contact({}, { medium });
    expect(classifyChannel(c).channel).toBe(CHANNELS.INTERNAL);
  });

  it('treats CRM Workflows as Internal', () => {
    const c = contact({}, { utmSessionSource: 'CRM Workflows' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.INTERNAL);
  });

  it('excludes Internal from acquisition', () => {
    expect(isAcquisitionChannel(CHANNELS.INTERNAL)).toBe(false);
    expect(isAcquisitionChannel(CHANNELS.PAID)).toBe(true);
  });
});

describe('classifyChannel — other channels', () => {
  it('classifies organic search', () => {
    const c = contact({}, { utmSessionSource: 'Organic Search', medium: 'form' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.ORGANIC_SEARCH);
  });

  it('classifies referral', () => {
    const c = contact({}, { utmSessionSource: 'Referral', medium: 'form' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.REFERRAL);
  });

  it('classifies direct traffic', () => {
    const c = contact({}, { utmSessionSource: 'Direct traffic', medium: 'form' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.DIRECT);
  });

  it('classifies email', () => {
    const c = contact({}, { utmSource: 'sales', utmMedium: 'email' });
    expect(classifyChannel(c).channel).toBe(CHANNELS.EMAIL);
  });

  it('returns Unattributed when there is no signal at all', () => {
    const c = resolveContactAttribution({ id: 'x', tags: [], customFields: [] });
    expect(classifyChannel(c).channel).toBe(CHANNELS.UNKNOWN);
    expect(isAcquisitionChannel(CHANNELS.UNKNOWN)).toBe(false);
  });
});

describe('buildChannelReport', () => {
  const mixed = [
    contact({ id: 'p1' }, { utmSource: 'paid', utmMedium: 'linkedin' }),
    contact({ id: 'p2' }, { utmSource: 'paid', utmMedium: 'linkedin' }),
    contact({ id: 'o1' }, { utmSource: 'linkedin', utmMedium: 'post' }),
    contact({ id: 'i1' }, { medium: 'csv_import' }),
  ];

  it('computes the paid vs organic split over acquisition only', () => {
    const rep = buildChannelReport(mixed);
    // The csv_import contact must not dilute the ratio.
    expect(rep.summary.acquisitionContacts).toBe(3);
    expect(rep.summary.paidContacts).toBe(2);
    expect(rep.summary.organicContacts).toBe(1);
    expect(rep.summary.paidShare).toBeCloseTo(2 / 3, 5);
  });

  it('still reports internal contacts in the channel table', () => {
    const rep = buildChannelReport(mixed);
    const internal = rep.byChannel.find(
      (r: { channel: string }) => r.channel === CHANNELS.INTERNAL,
    );
    expect(internal.contacts).toBe(1);
    expect(internal.isAcquisition).toBe(false);
  });

  it('attributes revenue to the right channel', () => {
    const txns = [
      { contactId: 'p1', amount: 97, amountRefunded: 0, currency: 'usd', status: 'succeeded' },
      { contactId: 'o1', amount: 29, amountRefunded: 0, currency: 'usd', status: 'succeeded' },
    ];
    const rep = buildChannelReport(mixed, txns);
    expect(rep.summary.paidRevenue).toBe(97);
    expect(rep.summary.organicRevenue).toBe(29);
    expect(rep.summary.paidRevenueShare).toBeCloseTo(97 / 126, 5);
  });

  it('ignores failed charges when attributing revenue', () => {
    const rep = buildChannelReport(mixed, [
      { contactId: 'p1', amount: 97, amountRefunded: 0, currency: 'usd', status: 'failed' },
    ]);
    expect(rep.summary.paidRevenue).toBe(0);
  });

  it('counts customers by tag', () => {
    const rep = buildChannelReport(
      [
        resolveContactAttribution({
          id: 'c1',
          tags: ['Whyzer Premium'],
          customFields: [],
          attributions: [{ isFirst: true, utmSource: 'paid', utmMedium: 'linkedin' }],
        }),
      ],
      [],
      { customerTags: ['whyzer premium'] },
    );
    expect(rep.byChannel[0].customers).toBe(1);
  });

  it('handles an empty contact list without dividing by zero', () => {
    const rep = buildChannelReport([]);
    expect(rep.summary.paidShare).toBe(0);
    expect(rep.summary.acquisitionContacts).toBe(0);
  });
});

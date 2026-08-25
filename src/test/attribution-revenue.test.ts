import { describe, it, expect } from 'vitest';
import {
  isRevenue,
  netAmount,
  buildRevenueReport,
  resolveContactAttribution,
} from '../../api/_attribution-lib.js';

/** Transaction shapes below mirror real GHL /payments/transactions responses. */

const attributedContact = {
  id: 'c-paid',
  contactName: 'Josh Jackson',
  type: 'customer',
  tags: ['whyzer premium'],
  attributions: [
    {
      pageUrl:
        'https://subscribe.whyzer.ai/elite-monthly?utm_source=paid&utm_medium=linkedin&utm_campaign=deal-size',
      utmSessionSource: 'Referral',
      referrer: 'https://www.whyzer.ai',
      isFirst: true,
      url: 'https://subscribe.whyzer.ai/elite-monthly',
      utmSource: 'paid',
      utmCampaign: 'deal-size',
    },
  ],
  customFields: [],
};

const lostContact = {
  id: 'c-lost',
  contactName: 'Fredrik Flodberg',
  type: 'customer',
  tags: ['whyzer premium'],
  attributions: [
    {
      pageUrl: 'https://subscribe.whyzer.ai/elite-monthly-eu',
      utmSessionSource: 'Referral',
      referrer: 'https://www.whyzer.ai',
      isFirst: true,
      url: 'https://subscribe.whyzer.ai/elite-monthly-eu',
    },
  ],
  customFields: [],
};

const txn = (over: Record<string, unknown> = {}) => ({
  id: 't',
  contactId: 'c-paid',
  amount: 97,
  amountRefunded: 0,
  currency: 'usd',
  status: 'succeeded',
  ...over,
});

describe('isRevenue', () => {
  it('counts a settled charge', () => {
    expect(isRevenue(txn())).toBe(true);
  });

  it('excludes a declined charge', () => {
    // Observed in production: "Your card has insufficient funds."
    expect(isRevenue(txn({ status: 'failed' }))).toBe(false);
  });

  it('excludes a zero-value trial start', () => {
    // Trials arrive as setup_intents with amount 0.
    expect(isRevenue(txn({ amount: 0 }))).toBe(false);
  });
});

describe('netAmount', () => {
  it('subtracts refunds', () => {
    expect(netAmount(txn({ amount: 97, amountRefunded: 40 }))).toBe(57);
  });

  it('never goes negative', () => {
    expect(netAmount(txn({ amount: 29, amountRefunded: 50 }))).toBe(0);
  });
});

describe('buildRevenueReport', () => {
  const resolved = [
    resolveContactAttribution(attributedContact),
    resolveContactAttribution(lostContact),
  ];

  it('credits revenue to the attributed source', () => {
    const rep = buildRevenueReport(resolved, [txn({ amount: 97 })], { model: 'first' });
    const paid = rep.bySource.find((r: { source: string }) => r.source === 'paid');
    expect(paid.revenue).toBe(97);
    expect(rep.totals.revenue).toBe(97);
  });

  it('excludes failed charges from revenue but counts them', () => {
    const rep = buildRevenueReport(resolved, [txn({ status: 'failed' })]);
    expect(rep.totals.revenue).toBe(0);
    expect(rep.totals.failed).toBe(1);
  });

  it('counts trials separately from revenue', () => {
    const rep = buildRevenueReport(resolved, [txn({ amount: 0 })]);
    expect(rep.totals.revenue).toBe(0);
    expect(rep.totals.trials).toBe(1);
  });

  it('nets refunds out of the source total', () => {
    const rep = buildRevenueReport(resolved, [txn({ amount: 97, amountRefunded: 97 })]);
    expect(rep.totals.revenue).toBe(0);
    expect(rep.totals.refunded).toBe(97);
  });

  it('buckets revenue from an unattributed payer', () => {
    const rep = buildRevenueReport(resolved, [txn({ contactId: 'c-lost', amount: 97 })]);
    expect(rep.totals.unattributedRevenue).toBe(97);
    expect(rep.totals.attributedRevenueShare).toBe(0);
  });

  it('reports the attributed share across mixed payers', () => {
    const rep = buildRevenueReport(resolved, [
      txn({ id: 'a', contactId: 'c-paid', amount: 100 }),
      txn({ id: 'b', contactId: 'c-lost', amount: 100 }),
    ]);
    expect(rep.totals.revenue).toBe(200);
    expect(rep.totals.attributedRevenueShare).toBe(0.5);
  });

  it('flags transactions whose contact could not be resolved', () => {
    const rep = buildRevenueReport(resolved, [txn({ contactId: 'nobody' })]);
    expect(rep.totals.unmatchedTransactions).toBe(1);
    expect(rep.bySource[0].source).toBe('(unknown contact)');
  });

  it('ignores currencies other than the reporting currency', () => {
    const rep = buildRevenueReport(resolved, [txn({ currency: 'gbp', amount: 500 })], {
      currency: 'usd',
    });
    expect(rep.totals.revenue).toBe(0);
  });

  it('counts a repeat payer once per source', () => {
    const rep = buildRevenueReport(resolved, [
      txn({ id: 'a', amount: 97 }),
      txn({ id: 'b', amount: 97 }),
    ]);
    const paid = rep.bySource.find((r: { source: string }) => r.source === 'paid');
    expect(paid.customers).toBe(1);
    expect(paid.revenue).toBe(194);
    expect(paid.revenuePerCustomer).toBe(194);
  });

  it('groups revenue by campaign', () => {
    const rep = buildRevenueReport(resolved, [txn({ amount: 97 })], { model: 'first' });
    const row = rep.byCampaign.find(
      (r: { campaign: string }) => r.campaign === 'deal-size',
    );
    expect(row.revenue).toBe(97);
  });
});

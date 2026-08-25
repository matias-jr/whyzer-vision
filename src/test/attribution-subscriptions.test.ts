import { describe, it, expect } from 'vitest';
import {
  groupSubscriptions,
  describeSubscription,
  annualRunRate,
  projectTrialValue,
  planPriceFromCheckout,
  buildSubscriptionReport,
  resolveContactAttribution,
  RENEWAL_GRACE_DAYS,
} from '../../api/_attribution-lib.js';

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-08-25T00:00:00Z').getTime();

const charge = (over: Record<string, unknown> = {}) => ({
  id: 'c',
  contactId: 'c-paid',
  contactName: 'Mark Nicolosi',
  amount: 29,
  amountRefunded: 0,
  currency: 'usd',
  status: 'succeeded',
  subscriptionId: 'sub_1',
  checkoutPage: '/premium-monthly',
  createdAt: new Date(NOW).toISOString(),
  ...over,
});

/** Monthly history ending `endedDaysAgo` before NOW. */
const monthlyHistory = (count: number, endedDaysAgo = 0, amount = 29) =>
  Array.from({ length: count }, (_, i) =>
    charge({
      id: `c${i}`,
      amount,
      createdAt: new Date(NOW - (endedDaysAgo + (count - 1 - i) * 30) * DAY).toISOString(),
    }),
  );

const attributedContact = {
  id: 'c-paid',
  contactName: 'Mark Nicolosi',
  type: 'customer',
  tags: ['whyzer premium'],
  attributions: [
    {
      pageUrl: 'https://www.whyzer.ai/?utm_source=linkedin&utm_campaign=q3',
      referrer: 'https://www.linkedin.com',
      isFirst: true,
      url: 'https://www.whyzer.ai/',
      utmSource: 'linkedin',
      utmCampaign: 'q3',
    },
  ],
  customFields: [],
};

describe('groupSubscriptions', () => {
  it('groups charges by subscription and orders them', () => {
    const subs = groupSubscriptions([
      charge({ id: 'b', createdAt: new Date(NOW).toISOString() }),
      charge({ id: 'a', createdAt: new Date(NOW - 30 * DAY).toISOString() }),
    ]);
    const sub = subs.get('sub_1');
    expect(sub.charges).toHaveLength(2);
    expect(sub.charges[0].id).toBe('a');
  });

  it('ignores one-off charges with no subscription', () => {
    expect(groupSubscriptions([charge({ subscriptionId: null })]).size).toBe(0);
  });
});

describe('describeSubscription', () => {
  it('measures a monthly interval from real cadence', () => {
    // Mirrors the production subscription: 15 consecutive monthly charges.
    const subs = groupSubscriptions(monthlyHistory(15));
    const d = describeSubscription(subs.get('sub_1'), NOW);
    expect(d.intervalLabel).toBe('monthly');
    expect(d.paidCharges).toBe(15);
    expect(d.revenue).toBe(435);
    expect(d.active).toBe(true);
    expect(d.churned).toBe(false);
  });

  it('marks a subscription churned once charges stop', () => {
    const subs = groupSubscriptions(monthlyHistory(15, 180));
    const d = describeSubscription(subs.get('sub_1'), NOW);
    expect(d.active).toBe(false);
    expect(d.churned).toBe(true);
  });

  it('keeps a subscription active inside the grace window', () => {
    const subs = groupSubscriptions(monthlyHistory(3, 30 + RENEWAL_GRACE_DAYS - 1));
    expect(describeSubscription(subs.get('sub_1'), NOW).active).toBe(true);
  });

  it('infers annual billing from a large single charge', () => {
    const subs = groupSubscriptions([charge({ amount: 997 })]);
    const d = describeSubscription(subs.get('sub_1'), NOW);
    expect(d.intervalLabel).toBe('annual');
  });

  it('treats a fresh $0 trial as pending, not churned', () => {
    const subs = groupSubscriptions([charge({ amount: 0 })]);
    const d = describeSubscription(subs.get('sub_1'), NOW);
    expect(d.trialOnly).toBe(true);
    expect(d.trialPending).toBe(true);
    expect(d.churned).toBe(false);
    expect(d.active).toBe(false);
  });

  it('treats a long-stale trial that never converted as churned', () => {
    const subs = groupSubscriptions([
      charge({ amount: 0, createdAt: new Date(NOW - 200 * DAY).toISOString() }),
    ]);
    const d = describeSubscription(subs.get('sub_1'), NOW);
    expect(d.trialPending).toBe(false);
    expect(d.churned).toBe(true);
  });

  it('excludes failed charges from realized revenue', () => {
    const subs = groupSubscriptions([
      charge({ id: 'a', amount: 29 }),
      charge({ id: 'b', amount: 97, status: 'failed' }),
    ]);
    expect(describeSubscription(subs.get('sub_1'), NOW).revenue).toBe(29);
  });

  it('nets refunds out of realized revenue', () => {
    const subs = groupSubscriptions([charge({ amount: 97, amountRefunded: 97 })]);
    expect(describeSubscription(subs.get('sub_1'), NOW).revenue).toBe(0);
  });
});

describe('annualRunRate', () => {
  it('annualizes a monthly subscription from its measured cadence', () => {
    const subs = groupSubscriptions(monthlyHistory(6));
    const rate = annualRunRate(describeSubscription(subs.get('sub_1'), NOW));
    // A 30-day cycle bills 365/30 = 12.17 times a year, so the run rate sits
    // slightly above a naive 12 x price. The production subscription measures a
    // 31-day cadence and lands just under it instead — which is the point of
    // measuring the interval rather than assuming calendar months.
    expect(rate).toBeCloseTo((29 * 365) / 30, 2);
  });

  it('contributes nothing once churned', () => {
    const subs = groupSubscriptions(monthlyHistory(6, 200));
    expect(annualRunRate(describeSubscription(subs.get('sub_1'), NOW))).toBe(0);
  });
});

describe('trial projection', () => {
  it('reads plan prices from the checkout page', () => {
    expect(planPriceFromCheckout('/elite-monthly')).toBe(97);
    expect(planPriceFromCheckout('/elite-annually')).toBe(997);
    expect(planPriceFromCheckout('/premium-monthly')).toBe(57);
    expect(planPriceFromCheckout('/premium-annually')).toBe(570);
    expect(planPriceFromCheckout(null)).toBe(0);
  });

  it('weights the plan price by expected conversion', () => {
    expect(projectTrialValue(97, 0.5)).toBe(48.5);
    expect(projectTrialValue(97, 1)).toBe(97);
    expect(projectTrialValue(0, 0.5)).toBe(0);
  });
});

describe('buildSubscriptionReport', () => {
  const resolved = [resolveContactAttribution(attributedContact)];

  it('counts active subscriptions against the attributed source', () => {
    const rep = buildSubscriptionReport(resolved, monthlyHistory(12), {
      model: 'first',
      now: NOW,
    });
    expect(rep.totals.active).toBe(1);
    expect(rep.bySource[0].source).toBe('linkedin');
    expect(rep.bySource[0].activeSubscriptions).toBe(1);
    expect(rep.bySource[0].annualRunRate).toBeGreaterThan(0);
  });

  it('projects pending trials instead of counting them as revenue', () => {
    const rep = buildSubscriptionReport(
      resolved,
      [charge({ amount: 0, checkoutPage: '/elite-monthly' })],
      { model: 'first', trialConversionRate: 0.5, now: NOW },
    );
    expect(rep.totals.realizedRevenue).toBe(0);
    expect(rep.totals.pendingTrials).toBe(1);
    expect(rep.totals.projectedTrialRevenue).toBe(48.5);
  });

  it('respects a custom conversion rate', () => {
    const rep = buildSubscriptionReport(
      resolved,
      [charge({ amount: 0, checkoutPage: '/elite-monthly' })],
      { trialConversionRate: 0.25, now: NOW },
    );
    expect(rep.totals.projectedTrialRevenue).toBe(24.25);
  });

  it('computes a retention rate across active and churned subs', () => {
    const rep = buildSubscriptionReport(
      resolved,
      [
        ...monthlyHistory(6),
        ...monthlyHistory(6, 300).map((c) => ({ ...c, subscriptionId: 'sub_2' })),
      ],
      { now: NOW },
    );
    expect(rep.totals.active).toBe(1);
    expect(rep.totals.churned).toBe(1);
    expect(rep.totals.retentionRate).toBe(0.5);
  });

  it('buckets subscriptions from unresolvable contacts', () => {
    const rep = buildSubscriptionReport([], monthlyHistory(3), { now: NOW });
    expect(rep.bySource[0].source).toBe('(unknown contact)');
  });
});

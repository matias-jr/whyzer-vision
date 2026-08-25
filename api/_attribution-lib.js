/**
 * Shared attribution logic for the admin reporting endpoints.
 *
 * GHL is the system of record. Every contact carries a native `attributions[]`
 * array with isFirst / isLast touches; this module turns that raw shape into
 * clean, groupable source/campaign data.
 *
 * Three corrections are applied, each fixing a defect observed in production:
 *
 *  1. Self-referral. www.whyzer.ai -> subscribe.whyzer.ai is an internal
 *     handoff, but GHL logs utmSessionSource "Referral" because the referrer is
 *     our own domain. Paid conversions were landing in the Referral bucket.
 *
 *  2. Casing drift. One contact held both "Deal-size" and "deal-size" for the
 *     same campaign, which fragments any group-by.
 *
 *  3. Empty custom fields. The four UTM custom fields are populated on 0% of
 *     contacts, so UTMs are recovered by parsing the raw pageUrl instead.
 */

export const GHL_API = 'https://services.leadconnectorhq.com';
export const GHL_VERSION = '2021-07-28';

/** The UTM custom fields that already exist on the location. */
export const UTM_FIELD_IDS = {
  utm_source: 'DN4PluJwtSZwsmGFFbJa',
  utm_campaign: 'vbmGX5mVHovv2ot8pMSk',
  utm_medium: 'jwL9AATJh3GkWxgpGUHL',
  utm_content: 'jL4yznGSlAo17aR1O7Jy',
};

const OWN_DOMAINS = ['whyzer.ai', 'subscribe.whyzer.ai', 'www.whyzer.ai', 'members.whyzer.ai'];

export function normalize(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function isOwnDomain(url) {
  const host = hostOf(url);
  return Boolean(host) && OWN_DOMAINS.includes(host);
}

/** Pull utm_* values out of a raw pageUrl query string. */
export function utmsFromUrl(pageUrl) {
  const out = {};
  if (!pageUrl) return out;
  try {
    const params = new URL(pageUrl).searchParams;
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = normalize(v);
    });
    // Our own capture layer forwards first touch separately.
    ['source', 'medium', 'campaign'].forEach((k) => {
      const v = params.get(`wz_ft_${k}`);
      if (v) out[`first_touch_${k}`] = normalize(v);
    });
    const vid = params.get('wz_vid');
    if (vid) out.visitor_id = vid;
    ['li_fat_id', 'gclid', 'fbclid', 'am_id'].forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
  } catch {
    /* malformed url */
  }
  return out;
}

/**
 * Resolve one attribution touch into a normalized { source, medium, campaign }.
 * Prefers explicit UTMs, falls back to GHL's own classification.
 */
export function resolveTouch(touch) {
  if (!touch) return null;
  const fromUrl = utmsFromUrl(touch.pageUrl);

  const source =
    fromUrl.utm_source || normalize(touch.utmSource) || '';
  const medium =
    fromUrl.utm_medium || normalize(touch.utmMedium) || normalize(touch.medium) || '';
  const campaign =
    fromUrl.utm_campaign || normalize(touch.utmCampaign) || '';

  let sessionSource = touch.utmSessionSource || '';

  // Correction 1: an internal handoff misfiled as a referral.
  const selfReferral = isOwnDomain(touch.referrer) && sessionSource === 'Referral';
  if (selfReferral) {
    sessionSource = source ? 'Campaign (self-referral corrected)' : 'Unattributed (internal handoff)';
  }

  // A first touch that is already the checkout page means the visitor's real
  // journey was lost before GHL ever saw them.
  const journeyLost = isOwnDomain(touch.url) && hostOf(touch.url) === 'subscribe.whyzer.ai';

  return {
    source: source || null,
    medium: medium || null,
    campaign: campaign || null,
    sessionSource,
    landingPage: touch.url || null,
    referrer: touch.referrer || null,
    firstTouchSource: fromUrl.first_touch_source || null,
    firstTouchCampaign: fromUrl.first_touch_campaign || null,
    visitorId: fromUrl.visitor_id || null,
    clickIds: {
      li_fat_id: fromUrl.li_fat_id || null,
      gclid: fromUrl.gclid || null,
      am_id: fromUrl.am_id || null,
    },
    selfReferralCorrected: selfReferral,
    journeyLost,
    raw: { utmSessionSource: touch.utmSessionSource || null },
  };
}

/** Split a contact's attributions[] into resolved first / last touches. */
export function resolveContactAttribution(contact) {
  const list = Array.isArray(contact.attributions) ? contact.attributions : [];
  const firstRaw = list.find((a) => a.isFirst) || list[0] || null;
  const lastRaw = list.find((a) => a.isLast) || list[list.length - 1] || null;

  const first = resolveTouch(firstRaw);
  const last = resolveTouch(lastRaw);

  // Read whatever the UTM custom fields hold (currently unpopulated, but the
  // backfill writes here, and new conversions will too).
  const fields = {};
  const custom = Array.isArray(contact.customFields) ? contact.customFields : [];
  Object.entries(UTM_FIELD_IDS).forEach(([key, id]) => {
    const hit = custom.find((f) => f.id === id);
    if (hit && hit.value) fields[key] = normalize(String(hit.value));
  });

  return {
    contactId: contact.id,
    email: contact.email || null,
    name: contact.contactName || null,
    type: contact.type || null,
    tags: contact.tags || [],
    dateAdded: contact.dateAdded || null,
    source: contact.source || null,
    first,
    last,
    storedFields: fields,
    /** True when no campaign data exists anywhere for this contact. */
    unattributed: !first?.source && !last?.source && Object.keys(fields).length === 0,
  };
}

/**
 * Effective attribution for revenue reporting: prefer explicit UTMs from the
 * touches, then the stored custom fields, then GHL's session classification.
 */
export function effectiveAttribution(resolved, model = 'first') {
  const primary = model === 'last' ? resolved.last : resolved.first;
  const fallback = model === 'last' ? resolved.first : resolved.last;

  const source =
    primary?.source ||
    primary?.firstTouchSource ||
    resolved.storedFields.utm_source ||
    fallback?.source ||
    null;

  const campaign =
    primary?.campaign ||
    primary?.firstTouchCampaign ||
    resolved.storedFields.utm_campaign ||
    fallback?.campaign ||
    null;

  const medium =
    primary?.medium || resolved.storedFields.utm_medium || fallback?.medium || null;

  return {
    source: source || labelFromSession(primary || fallback),
    medium,
    campaign: campaign || '(none)',
  };
}

/** Human-readable bucket when there are no UTMs at all. */
function labelFromSession(touch) {
  if (!touch) return '(unattributed)';
  const s = touch.sessionSource || '';
  if (s.startsWith('Unattributed')) return '(unattributed)';
  if (!s) return '(unattributed)';
  return `(${s.toLowerCase()})`;
}

/** Paginate GHL contacts. Returns every contact, newest first. */
export async function fetchAllContacts({ token, locationId, limit = 100, maxPages = 50, since = null }) {
  const all = [];
  let startAfter = null;
  let startAfterId = null;

  for (let page = 0; page < maxPages; page += 1) {
    const url = new URL(`${GHL_API}/contacts/`);
    url.searchParams.set('locationId', locationId);
    url.searchParams.set('limit', String(limit));
    if (startAfter) url.searchParams.set('startAfter', String(startAfter));
    if (startAfterId) url.searchParams.set('startAfterId', startAfterId);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`GHL contacts ${res.status}: ${await res.text()}`);
    }

    const body = await res.json();
    const batch = body.contacts || [];
    if (batch.length === 0) break;

    let reachedCutoff = false;
    for (const c of batch) {
      if (since && c.dateAdded && new Date(c.dateAdded).getTime() < since) {
        reachedCutoff = true;
        break;
      }
      all.push(c);
    }
    if (reachedCutoff) break;

    const meta = body.meta || {};
    if (!meta.startAfterId) break;
    startAfter = meta.startAfter;
    startAfterId = meta.startAfterId;
  }

  return all;
}

/** Group resolved contacts into a source/campaign report. */
export function buildReport(resolvedContacts, { model = 'first', customerTags = [] } = {}) {
  const bySource = new Map();
  const byCampaign = new Map();
  let customers = 0;
  let journeyLost = 0;
  let selfReferralCorrected = 0;
  let unattributed = 0;

  const isCustomer = (r) =>
    r.type === 'customer' ||
    (customerTags.length > 0 && r.tags.some((t) => customerTags.includes(normalize(t))));

  for (const r of resolvedContacts) {
    const eff = effectiveAttribution(r, model);
    const customer = isCustomer(r);
    if (customer) customers += 1;
    if (r.first?.journeyLost || r.last?.journeyLost) journeyLost += 1;
    if (r.first?.selfReferralCorrected || r.last?.selfReferralCorrected) selfReferralCorrected += 1;
    if (r.unattributed) unattributed += 1;

    const sKey = eff.source || '(unattributed)';
    const s = bySource.get(sKey) || { source: sKey, contacts: 0, customers: 0 };
    s.contacts += 1;
    if (customer) s.customers += 1;
    bySource.set(sKey, s);

    const cKey = `${sKey} / ${eff.campaign}`;
    const c = byCampaign.get(cKey) || {
      source: sKey,
      campaign: eff.campaign,
      medium: eff.medium,
      contacts: 0,
      customers: 0,
    };
    c.contacts += 1;
    if (customer) c.customers += 1;
    byCampaign.set(cKey, c);
  }

  const withRate = (row) => ({
    ...row,
    conversionRate: row.contacts > 0 ? row.customers / row.contacts : 0,
  });

  return {
    model,
    totals: {
      contacts: resolvedContacts.length,
      customers,
      unattributed,
      journeyLost,
      selfReferralCorrected,
      attributionCoverage:
        resolvedContacts.length > 0
          ? 1 - unattributed / resolvedContacts.length
          : 0,
    },
    bySource: [...bySource.values()].map(withRate).sort((a, b) => b.contacts - a.contacts),
    byCampaign: [...byCampaign.values()].map(withRate).sort((a, b) => b.contacts - a.contacts),
  };
}

/**
 * Fetch payment transactions from GHL, paginated.
 *
 * Notes on the real data shape:
 *  - status is 'succeeded' | 'failed' | ... — failed charges must never count
 *    as revenue (we see genuine card declines in production).
 *  - amount is in major units (29 = $29.00), unlike the Stripe snapshot nested
 *    inside, which is in cents.
 *  - Trial starts arrive as setup_intents with amount 0. They are real
 *    conversions but zero revenue, so they are counted separately.
 *  - amountRefunded must be netted out of revenue.
 */
export async function fetchTransactions({ token, locationId, startAt, endAt, limit = 100, maxPages = 80 }) {
  const all = [];

  for (let page = 0; page < maxPages; page += 1) {
    const url = new URL(`${GHL_API}/payments/transactions`);
    url.searchParams.set('altId', locationId);
    url.searchParams.set('altType', 'location');
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(page * limit));
    url.searchParams.set('paymentMode', 'live');
    if (startAt) url.searchParams.set('startAt', startAt);
    if (endAt) url.searchParams.set('endAt', endAt);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error(`GHL transactions ${res.status}: ${await res.text()}`);

    const body = await res.json();
    const batch = body.data || [];
    if (batch.length === 0) break;

    // Keep only the fields the report needs, so we are not holding 7k full
    // Stripe charge snapshots in memory.
    for (const t of batch) {
      all.push({
        id: t._id,
        contactId: t.contactId || null,
        contactEmail: t.contactEmail || null,
        contactName: t.contactName || null,
        amount: typeof t.amount === 'number' ? t.amount : 0,
        amountRefunded: typeof t.amountRefunded === 'number' ? t.amountRefunded : 0,
        currency: t.currency || 'usd',
        status: t.status || 'unknown',
        subscriptionId: t.subscriptionId || null,
        checkoutPage: t.entitySourceMeta?.pageUrl || null,
        createdAt: t.createdAt || null,
      });
    }

    if (all.length >= (body.totalCount ?? 0)) break;
  }

  return all;
}

/** A transaction counts toward revenue only if it actually settled. */
export function isRevenue(txn) {
  return txn.status === 'succeeded' && txn.amount > 0;
}

/** Net revenue for a transaction, after refunds. */
export function netAmount(txn) {
  return Math.max(0, txn.amount - txn.amountRefunded);
}

/**
 * Join transactions onto resolved contacts and group revenue by attribution.
 *
 * Revenue is credited to the contact's attributed source. Transactions whose
 * contact we cannot resolve are bucketed under '(unknown contact)' so the totals
 * always reconcile against GHL rather than silently dropping money.
 */
export function buildRevenueReport(resolvedContacts, transactions, { model = 'first', currency = 'usd' } = {}) {
  const byContact = new Map(resolvedContacts.map((r) => [r.contactId, r]));

  const bySource = new Map();
  const byCampaign = new Map();

  let grossRevenue = 0;
  let refunded = 0;
  let failedCount = 0;
  let trialCount = 0;
  let unmatched = 0;
  let unattributedRevenue = 0;

  const touch = (map, key, seed) => {
    if (!map.has(key)) map.set(key, seed);
    return map.get(key);
  };

  for (const txn of transactions) {
    if (txn.currency !== currency) continue;

    if (txn.status === 'failed') { failedCount += 1; continue; }
    if (txn.status === 'succeeded' && txn.amount === 0) trialCount += 1;
    if (!isRevenue(txn)) {
      // Zero-value trial: still a conversion worth attributing, but no revenue.
      if (txn.status !== 'succeeded') continue;
    }

    const net = isRevenue(txn) ? netAmount(txn) : 0;
    grossRevenue += net;
    refunded += txn.amountRefunded;

    const resolved = txn.contactId ? byContact.get(txn.contactId) : null;
    if (!resolved) unmatched += 1;

    const eff = resolved
      ? effectiveAttribution(resolved, model)
      : { source: '(unknown contact)', medium: null, campaign: '(none)' };

    const sKey = eff.source || '(unattributed)';
    if (sKey.startsWith('(')) unattributedRevenue += net;

    const s = touch(bySource, sKey, {
      source: sKey, revenue: 0, transactions: 0, trials: 0, customers: new Set(),
    });
    s.revenue += net;
    s.transactions += 1;
    if (net === 0) s.trials += 1;
    if (txn.contactId) s.customers.add(txn.contactId);

    const cKey = `${sKey} / ${eff.campaign}`;
    const c = touch(byCampaign, cKey, {
      source: sKey, campaign: eff.campaign, medium: eff.medium,
      revenue: 0, transactions: 0, trials: 0, customers: new Set(),
    });
    c.revenue += net;
    c.transactions += 1;
    if (net === 0) c.trials += 1;
    if (txn.contactId) c.customers.add(txn.contactId);
  }

  const finalize = (rows) =>
    rows
      .map((r) => {
        const payers = r.customers.size;
        return {
          ...r,
          customers: payers,
          revenue: Math.round(r.revenue * 100) / 100,
          revenuePerCustomer: payers > 0 ? Math.round((r.revenue / payers) * 100) / 100 : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

  return {
    model,
    currency,
    totals: {
      revenue: Math.round(grossRevenue * 100) / 100,
      refunded: Math.round(refunded * 100) / 100,
      transactions: transactions.length,
      failed: failedCount,
      trials: trialCount,
      unmatchedTransactions: unmatched,
      unattributedRevenue: Math.round(unattributedRevenue * 100) / 100,
      attributedRevenueShare:
        grossRevenue > 0 ? 1 - unattributedRevenue / grossRevenue : 0,
    },
    bySource: finalize([...bySource.values()]),
    byCampaign: finalize([...byCampaign.values()]),
  };
}

/**
 * Fetch specific contacts by id.
 *
 * Revenue reporting cannot rely on the contact window overlapping the
 * transaction window: a payment made this month may belong to a contact created
 * a year ago. Without this, those payers fall into "(unknown contact)" and their
 * revenue is misattributed. We therefore look up every payer explicitly.
 */
export async function fetchContactsByIds({ token, ids, concurrency = 5 }) {
  const unique = [...new Set(ids.filter(Boolean))];
  const out = new Map();

  for (let i = 0; i < unique.length; i += concurrency) {
    const slice = unique.slice(i, i + concurrency);
    const results = await Promise.all(
      slice.map(async (id) => {
        try {
          const res = await fetch(`${GHL_API}/contacts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Version: GHL_VERSION,
              Accept: 'application/json',
            },
          });
          if (!res.ok) return null;
          const body = await res.json();
          return body.contact || null;
        } catch {
          return null;
        }
      }),
    );
    results.forEach((c) => { if (c?.id) out.set(c.id, c); });
    // Gentle on the rate limit.
    await new Promise((r) => setTimeout(r, 80));
  }

  return out;
}

/* ============================================================
 * Subscriptions & trial projection
 * ============================================================
 *
 * GHL exposes no subscription-state endpoint, but transactions carry a
 * subscriptionId, so state is derived from payment history. Verified against a
 * real subscription: 15 consecutive $29 charges, median gap 30 days.
 *
 * A subscription counts as ACTIVE when its most recent successful charge falls
 * inside one billing period plus a grace window. Beyond that it has lapsed —
 * either cancelled or dunning.
 *
 * Trials (amount 0) are projected as expected revenue rather than counted as
 * cash: value = plan price x conversion rate. That keeps pipeline visible
 * without inflating settled revenue.
 */

/** Billing intervals inferred from charge history, in days. */
export const MONTHLY_DAYS = 30;
export const ANNUAL_DAYS = 365;

/** Grace period before a lapsed subscription is treated as churned. */
export const RENEWAL_GRACE_DAYS = 10;

/**
 * Share of trials expected to convert to paid. Used to project trial pipeline.
 * Override per call once you have a measured rate.
 */
export const DEFAULT_TRIAL_CONVERSION_RATE = 0.5;

/** Group transactions into per-subscription histories. */
export function groupSubscriptions(transactions) {
  const subs = new Map();

  for (const t of transactions) {
    if (!t.subscriptionId) continue;
    if (!subs.has(t.subscriptionId)) {
      subs.set(t.subscriptionId, {
        subscriptionId: t.subscriptionId,
        contactId: t.contactId || null,
        contactName: t.contactName || null,
        contactEmail: t.contactEmail || null,
        currency: t.currency || 'usd',
        charges: [],
      });
    }
    subs.get(t.subscriptionId).charges.push(t);
  }

  for (const sub of subs.values()) {
    sub.charges.sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    );
  }

  return subs;
}

/** Median of a numeric array. */
function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Derive the state of one subscription from its charge history.
 *
 * Returns the billing interval (measured where possible, inferred from price
 * otherwise), whether it is currently active, its recurring amount, and the
 * revenue it has produced so far.
 */
export function describeSubscription(sub, now = Date.now()) {
  const paid = sub.charges.filter((c) => c.status === 'succeeded' && c.amount > 0);
  const trialOnly = paid.length === 0;

  const paidDates = paid.map((c) => new Date(c.createdAt || 0).getTime());
  const gaps = [];
  for (let i = 1; i < paidDates.length; i += 1) {
    gaps.push((paidDates[i] - paidDates[i - 1]) / (24 * 60 * 60 * 1000));
  }

  // Round to whole days: charge timestamps drift by hours within a billing
  // cycle, and an interval of 30.997 instead of 31 skews the annualized rate.
  const rawInterval = median(gaps);
  const measuredInterval = rawInterval === null ? null : Math.round(rawInterval);
  const lastAmount = paid.length > 0 ? paid[paid.length - 1].amount : 0;

  // With only one charge there is no gap to measure, so infer from price: the
  // annual plans are an order of magnitude above the monthly ones.
  const intervalDays =
    measuredInterval ??
    (lastAmount >= 400 ? ANNUAL_DAYS : MONTHLY_DAYS);

  const lastPaidAt = paidDates.length > 0 ? Math.max(...paidDates) : null;
  const daysSinceLastCharge =
    lastPaidAt === null ? null : (now - lastPaidAt) / (24 * 60 * 60 * 1000);

  const active =
    lastPaidAt !== null && daysSinceLastCharge <= intervalDays + RENEWAL_GRACE_DAYS;

  const revenue = paid.reduce((sum, c) => sum + netAmount(c), 0);

  // A trial that has not yet produced a paid charge is still pending, not
  // churned, while it sits inside its own first billing window.
  const startedAt = sub.charges.length > 0
    ? new Date(sub.charges[0].createdAt || 0).getTime()
    : null;
  const daysSinceStart =
    startedAt === null ? null : (now - startedAt) / (24 * 60 * 60 * 1000);
  const trialPending =
    trialOnly && daysSinceStart !== null && daysSinceStart <= intervalDays + RENEWAL_GRACE_DAYS;

  return {
    subscriptionId: sub.subscriptionId,
    contactId: sub.contactId,
    contactName: sub.contactName,
    contactEmail: sub.contactEmail,
    currency: sub.currency,
    intervalDays,
    intervalLabel: intervalDays >= 200 ? 'annual' : 'monthly',
    recurringAmount: lastAmount,
    paidCharges: paid.length,
    revenue: Math.round(revenue * 100) / 100,
    active,
    trialOnly,
    trialPending,
    churned: !active && !trialPending,
    lastPaidAt: lastPaidAt ? new Date(lastPaidAt).toISOString() : null,
    startedAt: startedAt ? new Date(startedAt).toISOString() : null,
  };
}

/** Annualized run rate for an active subscription. */
export function annualRunRate(desc) {
  if (!desc.active || desc.recurringAmount <= 0) return 0;
  const periodsPerYear = ANNUAL_DAYS / desc.intervalDays;
  return desc.recurringAmount * periodsPerYear;
}

/**
 * Projected value of a pending trial: the plan price it will convert onto,
 * weighted by the expected conversion rate.
 *
 * Trials carry no price of their own (they are $0 setup_intents), so the plan
 * price is passed in by the caller from the checkout page it came from.
 */
export function projectTrialValue(planPrice, conversionRate = DEFAULT_TRIAL_CONVERSION_RATE) {
  if (!planPrice || planPrice <= 0) return 0;
  return Math.round(planPrice * conversionRate * 100) / 100;
}

/**
 * Infer a trial's eventual plan price from the checkout page it started on.
 * Prices mirror the public pricing page.
 */
export function planPriceFromCheckout(checkoutPage) {
  if (!checkoutPage) return 0;
  const page = checkoutPage.toLowerCase();
  const annual = page.includes('annual');
  if (page.includes('elite')) return annual ? 997 : 97;
  if (page.includes('premium')) return annual ? 570 : 57;
  return 0;
}

/**
 * Subscription-aware report: active subscriptions, run rate, and projected
 * trial pipeline, all grouped by attributed source.
 */
export function buildSubscriptionReport(
  resolvedContacts,
  transactions,
  { model = 'first', currency = 'usd', trialConversionRate = DEFAULT_TRIAL_CONVERSION_RATE, now = Date.now() } = {},
) {
  const byContact = new Map(resolvedContacts.map((r) => [r.contactId, r]));
  const subs = groupSubscriptions(transactions.filter((t) => t.currency === currency));

  const bySource = new Map();
  let activeCount = 0;
  let churnedCount = 0;
  let pendingTrials = 0;
  let runRate = 0;
  let projectedTrialRevenue = 0;
  let realizedRevenue = 0;

  const details = [];

  for (const sub of subs.values()) {
    const desc = describeSubscription(sub, now);
    const resolved = sub.contactId ? byContact.get(sub.contactId) : null;
    const eff = resolved
      ? effectiveAttribution(resolved, model)
      : { source: '(unknown contact)', medium: null, campaign: '(none)' };
    const sKey = eff.source || '(unattributed)';

    const arr = annualRunRate(desc);
    // A pending trial's plan price comes from the checkout page it started on.
    const planPrice = desc.trialOnly
      ? planPriceFromCheckout(sub.charges[0]?.checkoutPage)
      : 0;
    const projected = desc.trialPending
      ? projectTrialValue(planPrice, trialConversionRate)
      : 0;

    if (desc.active) activeCount += 1;
    if (desc.churned) churnedCount += 1;
    if (desc.trialPending) pendingTrials += 1;
    runRate += arr;
    projectedTrialRevenue += projected;
    realizedRevenue += desc.revenue;

    if (!bySource.has(sKey)) {
      bySource.set(sKey, {
        source: sKey,
        activeSubscriptions: 0,
        churnedSubscriptions: 0,
        pendingTrials: 0,
        realizedRevenue: 0,
        annualRunRate: 0,
        projectedTrialRevenue: 0,
      });
    }
    const row = bySource.get(sKey);
    if (desc.active) row.activeSubscriptions += 1;
    if (desc.churned) row.churnedSubscriptions += 1;
    if (desc.trialPending) row.pendingTrials += 1;
    row.realizedRevenue += desc.revenue;
    row.annualRunRate += arr;
    row.projectedTrialRevenue += projected;

    details.push({ ...desc, source: sKey, campaign: eff.campaign, projectedValue: projected });
  }

  const round = (n) => Math.round(n * 100) / 100;
  const totalSubs = activeCount + churnedCount;

  return {
    model,
    currency,
    trialConversionRate,
    totals: {
      subscriptions: subs.size,
      active: activeCount,
      churned: churnedCount,
      pendingTrials,
      realizedRevenue: round(realizedRevenue),
      annualRunRate: round(runRate),
      projectedTrialRevenue: round(projectedTrialRevenue),
      retentionRate: totalSubs > 0 ? activeCount / totalSubs : 0,
    },
    bySource: [...bySource.values()]
      .map((r) => ({
        ...r,
        realizedRevenue: round(r.realizedRevenue),
        annualRunRate: round(r.annualRunRate),
        projectedTrialRevenue: round(r.projectedTrialRevenue),
      }))
      .sort((a, b) => b.annualRunRate - a.annualRunRate),
    subscriptions: details.sort((a, b) => b.revenue - a.revenue),
  };
}

/* ============================================================
 * Channel classification (paid vs organic)
 * ============================================================
 *
 * Rolls the long tail of source/medium pairs into a handful of channels a
 * marketer can act on. Three signals are combined, in priority order:
 *
 *   1. medium  — separates real acquisition (form, order_form) from internal
 *      operations (manual, csv_import, zapier). Roughly 30% of contacts in a
 *      90-day window are imports or CRM workflows, not marketing at all.
 *   2. utm_source / utm_medium — the explicit campaign markers we control.
 *   3. utmSessionSource — GHL's own classification, present on ~86% of
 *      contacts, used as the fallback when no UTMs survived.
 *
 * LinkedIn needs the medium to disambiguate: it is the ad platform AND an
 * organic channel (dm, post, jamalprofile). Source alone cannot tell them
 * apart.
 */

export const CHANNELS = {
  PAID: 'Paid',
  ORGANIC_SOCIAL: 'Organic Social',
  ORGANIC_SEARCH: 'Organic Search',
  REFERRAL: 'Referral',
  DIRECT: 'Direct',
  EMAIL: 'Email',
  INTERNAL: 'Internal',
  UNKNOWN: 'Unattributed',
};

/** Mediums that mean "someone put this contact into the CRM", not a campaign. */
const INTERNAL_MEDIUMS = new Set([
  'manual', 'csv_import', 'zapier', 'api', 'import', 'bulk_import',
]);

/** Mediums that indicate a paid click, regardless of source. */
const PAID_MEDIUMS = new Set([
  'cpc', 'ppc', 'paid', 'paidsocial', 'paid_social', 'display', 'banner',
  'linkedin', 'facebook', 'instagram', 'google', 'ads', 'retargeting',
]);

/** Mediums that indicate unpaid social activity. */
const ORGANIC_SOCIAL_MEDIUMS = new Set([
  'dm', 'post', 'social', 'organic_social', 'profile', 'jamalprofile', 'bio',
]);

const EMAIL_MEDIUMS = new Set(['email', 'newsletter', 'e-mail']);

/** GHL's own session classification -> channel, used when UTMs are absent. */
const SESSION_SOURCE_CHANNEL = {
  'paid social': CHANNELS.PAID,
  'paid search': CHANNELS.PAID,
  'organic search': CHANNELS.ORGANIC_SEARCH,
  'social media': CHANNELS.ORGANIC_SOCIAL,
  referral: CHANNELS.REFERRAL,
  'direct traffic': CHANNELS.DIRECT,
  email: CHANNELS.EMAIL,
  'crm workflows': CHANNELS.INTERNAL,
  'crm ui': CHANNELS.INTERNAL,
  'third party': CHANNELS.INTERNAL,
};

/**
 * Classify one contact's attribution into a channel.
 *
 * Returns the channel plus the signal that decided it, so the UI can show why
 * a contact landed where it did rather than being a black box.
 */
export function classifyChannel(resolved, model = 'first') {
  const touch = model === 'last' ? resolved.last : resolved.first;
  const eff = effectiveAttribution(resolved, model);

  const source = normalize(eff.source || '').replace(/^\(|\)$/g, '');
  const medium = normalize(eff.medium || '');
  const sessionSource = normalize(
    touch?.raw?.utmSessionSource || resolved.last?.raw?.utmSessionSource || '',
  );

  // 1. Internal operations never count as marketing acquisition.
  if (INTERNAL_MEDIUMS.has(medium)) {
    return { channel: CHANNELS.INTERNAL, signal: `medium=${medium}` };
  }
  if (SESSION_SOURCE_CHANNEL[sessionSource] === CHANNELS.INTERNAL) {
    return { channel: CHANNELS.INTERNAL, signal: `session=${sessionSource}` };
  }

  // 2. Explicit paid markers. utm_source=paid is this account's convention;
  //    the conventional form (utm_medium=cpc) is handled too.
  if (source === 'paid' || PAID_MEDIUMS.has(medium)) {
    // Guard: an organic LinkedIn medium must not be caught by source=linkedin.
    if (!ORGANIC_SOCIAL_MEDIUMS.has(medium)) {
      return {
        channel: CHANNELS.PAID,
        signal: source === 'paid' ? 'utm_source=paid' : `utm_medium=${medium}`,
      };
    }
  }

  if (EMAIL_MEDIUMS.has(medium)) {
    return { channel: CHANNELS.EMAIL, signal: `medium=${medium}` };
  }

  if (ORGANIC_SOCIAL_MEDIUMS.has(medium)) {
    return { channel: CHANNELS.ORGANIC_SOCIAL, signal: `medium=${medium}` };
  }

  // 3. Fall back to GHL's classification when no UTMs survived.
  const fromSession = SESSION_SOURCE_CHANNEL[sessionSource];
  if (fromSession) return { channel: fromSession, signal: `session=${sessionSource}` };

  return { channel: CHANNELS.UNKNOWN, signal: 'no signal' };
}

/** True for channels that represent real marketing acquisition. */
export function isAcquisitionChannel(channel) {
  return channel !== CHANNELS.INTERNAL && channel !== CHANNELS.UNKNOWN;
}

/**
 * Paid-vs-organic breakdown across contacts, with optional revenue.
 *
 * Internal and unattributed contacts are reported but excluded from the
 * paid/organic ratio, so the headline number reflects acquisition only.
 */
export function buildChannelReport(
  resolvedContacts,
  transactions = [],
  { model = 'first', currency = 'usd', customerTags = [] } = {},
) {
  const revenueByContact = new Map();
  for (const t of transactions) {
    if (t.currency !== currency || !isRevenue(t) || !t.contactId) continue;
    revenueByContact.set(
      t.contactId,
      (revenueByContact.get(t.contactId) || 0) + netAmount(t),
    );
  }

  const rows = new Map();
  const isCustomer = (r) =>
    r.type === 'customer' ||
    (customerTags.length > 0 && r.tags.some((tag) => customerTags.includes(normalize(tag))));

  let paidContacts = 0;
  let organicContacts = 0;
  let paidRevenue = 0;
  let organicRevenue = 0;

  for (const r of resolvedContacts) {
    const { channel, signal } = classifyChannel(r, model);
    const revenue = revenueByContact.get(r.contactId) || 0;
    const customer = isCustomer(r);

    if (!rows.has(channel)) {
      rows.set(channel, {
        channel,
        contacts: 0,
        customers: 0,
        revenue: 0,
        exampleSignals: new Set(),
      });
    }
    const row = rows.get(channel);
    row.contacts += 1;
    if (customer) row.customers += 1;
    row.revenue += revenue;
    if (row.exampleSignals.size < 4) row.exampleSignals.add(signal);

    if (channel === CHANNELS.PAID) {
      paidContacts += 1;
      paidRevenue += revenue;
    } else if (isAcquisitionChannel(channel)) {
      organicContacts += 1;
      organicRevenue += revenue;
    }
  }

  const round = (n) => Math.round(n * 100) / 100;
  const acquisitionContacts = paidContacts + organicContacts;
  const acquisitionRevenue = paidRevenue + organicRevenue;

  return {
    model,
    currency,
    summary: {
      paidContacts,
      organicContacts,
      acquisitionContacts,
      paidShare: acquisitionContacts > 0 ? paidContacts / acquisitionContacts : 0,
      organicShare: acquisitionContacts > 0 ? organicContacts / acquisitionContacts : 0,
      paidRevenue: round(paidRevenue),
      organicRevenue: round(organicRevenue),
      paidRevenueShare: acquisitionRevenue > 0 ? paidRevenue / acquisitionRevenue : 0,
      totalContacts: resolvedContacts.length,
    },
    byChannel: [...rows.values()]
      .map((r) => ({
        ...r,
        revenue: round(r.revenue),
        conversionRate: r.contacts > 0 ? r.customers / r.contacts : 0,
        exampleSignals: [...r.exampleSignals],
        isAcquisition: isAcquisitionChannel(r.channel),
      }))
      .sort((a, b) => b.contacts - a.contacts),
  };
}

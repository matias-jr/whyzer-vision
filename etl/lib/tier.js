/**
 * Canonical tier resolution.
 *
 * Deliberately exact-match rather than substring, because two real SKUs
 * defeat the obvious `contains()` approach:
 *
 *   - "Elite Sellers Playbook - Monthly @ 865" contains "Elite" but is a
 *     separate product.
 *   - "The Vault - 1:1 Coaching with Jamal @ 25000" contains "Vault" but is
 *     $25k coaching; folding it into Elite distorts Elite MRR by orders of
 *     magnitude.
 *
 * Anything unrecognised returns 'unmapped' so it surfaces in reporting
 * instead of being silently bucketed into a tier.
 *
 * Mapping confirmed with Matias 2026-09-01. The authoritative copy lives in
 * the tier_dim table; this module mirrors it so the ETL can classify before
 * the row reaches the database.
 */

export const PREMIUM = 'premium';
export const ELITE = 'elite';
export const EXCLUDED = 'excluded';
export const UNMAPPED = 'unmapped';

/** GHL line-item name -> tier. */
export const GHL_TIER_MAP = new Map([
  ['Whyzer Premium Monthly', PREMIUM],
  ['Whyzer Premium Yearly Subscription', PREMIUM],

  ['Whyzer Elite Monthly', ELITE],
  ['Whyzer Elite Yearly', ELITE],
  ['Whyzer + Vault Monthly', ELITE],
  ['Whyzer + Vault - Yearly', ELITE],
  ["Jamal Reimer's Vault – Monthly @ 97", ELITE],
  ["Jamal Reimer's Vault – Annual @ 997", ELITE],
  ['The Vault', ELITE],
  ['Monthly Subscription x $97', ELITE],
  ['Yearly Subscription x $997', ELITE],

  ['The Pipeline Flywheel - Quarterly Payment @ 365', EXCLUDED],
  ['Elite Sellers Playbook - Monthly @ 865', EXCLUDED],
  ['The Vault – Inner Circle @ 2475', EXCLUDED],
  ['The Vault – Inner Circle 2.0 @ 8400', EXCLUDED],
  ['The Vault – 1:1 Coaching with Jamal @ 25000', EXCLUDED],
  ['Test Product – membership @ 1', EXCLUDED],
  ['| 12 months', EXCLUDED],
  ['| x12 Installments', EXCLUDED],
  ['| x3', EXCLUDED],
]);

/** Stripe price nickname -> tier. Stripe naming is far cleaner than GHL's. */
export const STRIPE_TIER_MAP = new Map([
  ['Whyzer Premium Monthly', PREMIUM],
  ['Whyzer Premium Yearly Subscription', PREMIUM],
  ['Whyzer Elite Monthly', ELITE],
  ['Whyzer Elite Yearly', ELITE],
  ['The Vault', ELITE],
]);

/**
 * Prices that identify a tier when the nickname is missing or generic.
 * Verified against live Stripe prices: $57/mo Premium, $97/mo and $997/yr Elite.
 */
const PRICE_TIERS = [
  { amount: 5700, interval: 'month', tier: PREMIUM },
  { amount: 9700, interval: 'month', tier: ELITE },
  { amount: 99700, interval: 'year', tier: ELITE },
];

export function tierFromGhlLineItem(name) {
  if (!name) return UNMAPPED;
  return GHL_TIER_MAP.get(name.trim()) ?? UNMAPPED;
}

/**
 * Resolve a Stripe subscription's tier from its price.
 * Nickname wins; price is the fallback for the many null-nickname legacy
 * subscriptions (89 of 1530 at time of writing, nearly all high-ticket
 * coaching that should stay excluded).
 */
export function tierFromStripePrice({ nickname, unitAmount, interval }) {
  if (nickname) {
    const hit = STRIPE_TIER_MAP.get(nickname.trim());
    if (hit) return hit;
    // A named SKU we know is not a tier stays excluded rather than falling
    // through to price matching, which would misclassify it.
    if (GHL_TIER_MAP.get(nickname.trim()) === EXCLUDED) return EXCLUDED;
  }
  const byPrice = PRICE_TIERS.find(
    (p) => p.amount === unitAmount && p.interval === interval
  );
  return byPrice ? byPrice.tier : UNMAPPED;
}

/** Tiers that count toward subscriber and MRR reporting. */
export function isReportable(tier) {
  return tier === PREMIUM || tier === ELITE;
}

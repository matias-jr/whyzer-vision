/**
 * Black Friday 2026 private list: shared GHL settings.
 *
 * Everyone who signs up gets BF26_TAG in GHL. The tag is what the Nov 25 workflow and the public
 * seller counter key off, so changing it means changing both places.
 *
 * Env:
 *  GHL_BF26_TOKEN               Private Integration token for this form (scopes: contacts.write + contacts.readonly).
 *                               Falls back to GHL_TOKEN, which is read-only on this account and will 401 on sign-up.
 *  GHL_LOCATION_ID              same location the rest of the site uses
 *  BF26_TAG                     defaults to "bf26-waitlist"
 *  BF26_COUNT_OFFSET            optional: people who joined before the tag existed (added to the count)
 */
export const GHL_API = 'https://services.leadconnectorhq.com';

export const BF26_TAG = process.env.BF26_TAG || 'bf26-waitlist';

export const ghlHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

/** The token for BF26 calls: the dedicated write-enabled one if set. */
export const bf26Token = () => process.env.GHL_BF26_TOKEN || process.env.GHL_TOKEN;

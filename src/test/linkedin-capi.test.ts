import { describe, expect, it } from 'vitest';
import { buildConversionEvent, sha256Email } from '../../api/_linkedin-capi.js';

describe('buildConversionEvent', () => {
  it('hashes the lower-cased, trimmed email', () => {
    expect(sha256Email('  Jane@Example.COM ')).toBe(sha256Email('jane@example.com'));
    expect(sha256Email('a@b.co')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('sends both ids, the conversion urn, a stable event id and the value', () => {
    const e = buildConversionEvent({ conversionId: '123', eventId: 'purchase-9', liFatId: 'abc', email: 'jane@example.com', value: 97, currency: 'usd', happenedAt: 1 });
    expect(e.conversion).toBe('urn:lla:llaPartnerConversion:123');
    expect(e.eventId).toBe('purchase-9');
    expect(e.user.userIds.map((u: { idType: string }) => u.idType)).toEqual(['LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID', 'SHA256_EMAIL']);
    expect(e.conversionValue).toEqual({ currencyCode: 'USD', amount: '97.00' });
  });

  it('omits the value for a free trial and matches on email alone', () => {
    const e = buildConversionEvent({ conversionId: '1', eventId: 'x', email: 'a@b.co', value: 0, currency: 'USD' });
    expect(e.conversionValue).toBeUndefined();
    expect(e.user.userIds).toHaveLength(1);
  });

  it('returns null when there is nothing to match on', () => {
    expect(buildConversionEvent({ conversionId: '1', eventId: 'x' })).toBeNull();
  });
});

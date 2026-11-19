import { describe, it, expect } from 'vitest';
import { checkoutUrl, formatMoney, regionForCountry, USD } from '@/lib/regionalPricing';

describe('regionalPricing', () => {
  it('maps countries to the same currency + checkout suffix as the home page', () => {
    expect(regionForCountry('GB')).toMatchObject({ symbol: '£', suffix: '-uk' });
    expect(regionForCountry('de')).toMatchObject({ symbol: '€', suffix: '-eu' });
    expect(regionForCountry('CH')).toMatchObject({ symbol: '€', suffix: '-eu' });
    expect(regionForCountry('CA')).toMatchObject({ symbol: 'CA$', suffix: '-ca' });
    expect(regionForCountry('AU')).toMatchObject({ symbol: 'AU$', suffix: '-au' });
    for (const c of ['US', 'BR', 'IN', '', undefined, null]) expect(regionForCountry(c)).toBe(USD);
  });

  it('builds the checkout link that matches the price shown', () => {
    expect(checkoutUrl('elite', true, USD)).toBe('https://subscribe.whyzer.ai/elite-annually');
    expect(checkoutUrl('elite', true, regionForCountry('GB'))).toBe('https://subscribe.whyzer.ai/elite-annually-uk');
    expect(checkoutUrl('premium', true, regionForCountry('FR'))).toBe('https://subscribe.whyzer.ai/premium-annually-eu');
    expect(checkoutUrl('premium', false, regionForCountry('AU'))).toBe('https://subscribe.whyzer.ai/premium-monthly-au');
  });

  it('formats the offer amounts', () => {
    expect(formatMoney(598.2, USD)).toBe('$598.20');
    expect(formatMoney(456, regionForCountry('GB'))).toBe('£456');
    expect(formatMoney(997, regionForCountry('CA'))).toBe('CA$997');
  });
});

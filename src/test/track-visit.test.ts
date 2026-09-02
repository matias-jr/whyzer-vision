import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { trackVisit, resetTrackVisit } from '@/lib/trackVisit';
import { clearAttribution } from '@/lib/attribution';

/**
 * The beacon exists to catch the visitors that localStorage replay misses, so
 * these tests focus on the two things that would silently break it: sending
 * the wrong visitor id (which makes the join impossible) and throwing on a
 * page where analytics is blocked.
 */
describe('trackVisit', () => {
  let beacon: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clearAttribution();
    resetTrackVisit();
    beacon = vi.fn(() => true);
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
    Object.defineProperty(document, 'referrer', { value: '', configurable: true });
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // jsdom's Blob has no .text(), so read it through FileReader instead.
  const sentPayload = async () => {
    const blob = beacon.mock.calls[0][1] as Blob;
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    });
    return JSON.parse(text);
  };

  it('posts the landing url and a visitor id', async () => {
    window.history.replaceState({}, '', '/?utm_source=paid&utm_medium=linkedin');
    trackVisit();

    expect(beacon).toHaveBeenCalledOnce();
    const body = await sentPayload();
    expect(body.href).toContain('utm_source=paid');
    expect(body.visitorId).toBeTruthy();
  });

  it('forwards the stored first touch, so an untagged later view keeps its origin', async () => {
    window.history.replaceState({}, '', '/?utm_source=paid&utm_campaign=deal-size');
    trackVisit();
    const first = await sentPayload();

    // A second, untagged pageview must still report the acquiring campaign.
    beacon.mockClear();
    window.history.replaceState({}, '', '/pricing');
    trackVisit();
    const second = await sentPayload();

    expect(second.firstTouch.utm_source).toBe('paid');
    expect(second.firstTouch.utm_campaign).toBe('deal-size');
    // Same browser, so the join key must not change between views.
    expect(second.visitorId).toBe(first.visitorId);
  });

  it('sends once per url, so a remount does not double-count the visit', () => {
    window.history.replaceState({}, '', '/pricing');
    trackVisit();
    trackVisit();
    expect(beacon).toHaveBeenCalledOnce();
  });

  it('records a genuine return visit to a page seen earlier', () => {
    window.history.replaceState({}, '', '/pricing');
    trackVisit();
    window.history.replaceState({}, '', '/about');
    trackVisit();
    window.history.replaceState({}, '', '/pricing');
    trackVisit();
    expect(beacon).toHaveBeenCalledTimes(3);
  });

  it('never throws when the beacon API is unavailable', () => {
    Object.defineProperty(navigator, 'sendBeacon', { value: undefined, configurable: true });
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('blocked'))));
    window.history.replaceState({}, '', '/blocked-analytics');
    expect(() => trackVisit()).not.toThrow();
  });
});

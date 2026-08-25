import { useState, useEffect } from 'react';
import {
  captureAttribution,
  buildOutboundParams,
  appendParamsToUrl,
} from '@/lib/attribution';

/**
 * Returns a function that appends captured attribution to an outbound URL.
 *
 * Attribution is persisted (see lib/attribution.ts), so UTMs survive a visitor
 * navigating across pages before clicking a checkout CTA. Previously this read
 * window.location.search directly, which silently dropped attribution for any
 * multi-page journey.
 *
 * The returned function keeps its original `(url: string) => string` shape, so
 * existing call sites need no changes.
 */
export function useUtmParams(): (url: string) => string {
  const [paramString, setParamString] = useState('');

  useEffect(() => {
    // Runs in an effect: keeps this SSG-safe, since localStorage and document
    // are unavailable during prerender.
    const attribution = captureAttribution(window.location.href, document.referrer);
    setParamString(buildOutboundParams(attribution));
  }, []);

  return (url: string) => appendParamsToUrl(url, paramString);
}

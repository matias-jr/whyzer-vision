import { useState, useEffect } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function getCookie(name: string): string | null {
  const match = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function useUtmParams(): (url: string) => string {
  const [utmString, setUtmString] = useState('');
  // Incrementing this triggers a re-render so am_id is re-read after am.js loads
  const [, setTick] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmParams = new URLSearchParams();
    UTM_KEYS.forEach(key => {
      const val = params.get(key);
      if (val) utmParams.set(key, val);
    });
    setUtmString(utmParams.toString());

    // am.js is async — poll briefly after mount so we catch the cookie once it's written
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (getCookie('am_id') || tries >= 8) clearInterval(interval);
      else setTick(t => t + 1);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // am_id is read fresh on every render so it's never stale
  return (url: string) => {
    const out = new URLSearchParams(utmString);
    const amId = getCookie('am_id');
    if (amId) out.set('am_id', amId);
    const str = out.toString();
    return str ? `${url}?${str}` : url;
  };
}

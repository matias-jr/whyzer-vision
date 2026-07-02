import { useState, useEffect } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function getCookie(name: string): string | null {
  const match = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function useUtmParams(): (url: string) => string {
  const [paramString, setParamString] = useState('');

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const out = new URLSearchParams();

    // UTM params — read from URL
    UTM_KEYS.forEach(key => {
      const val = search.get(key);
      if (val) out.set(key, val);
    });

    // am_id — prefer URL param (user just arrived via affiliate link),
    // fall back to cookie (user arrived in a previous session)
    const amId = search.get('am_id') ?? getCookie('am_id');
    if (amId) out.set('am_id', amId);

    setParamString(out.toString());
  }, []);

  return (url: string) => paramString ? `${url}?${paramString}` : url;
}

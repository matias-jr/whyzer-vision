import { useState, useEffect } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function getCookie(name: string): string | null {
  const match = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return match ? match.split('=')[1] : null;
}

export function useUtmParams(): (url: string) => string {
  const [paramString, setParamString] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const out = new URLSearchParams();

    UTM_KEYS.forEach(key => {
      const val = params.get(key);
      if (val) out.set(key, val);
    });

    // Pass affiliate ID to checkout so subscribe.whyzer.ai can attribute the referral
    const amId = getCookie('am_id');
    if (amId) out.set('am_id', amId);

    setParamString(out.toString());
  }, []);

  return (url: string) => paramString ? `${url}?${paramString}` : url;
}

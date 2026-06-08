import { useState, useEffect } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export function useUtmParams(): (url: string) => string {
  const [utmString, setUtmString] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmParams = new URLSearchParams();
    UTM_KEYS.forEach(key => {
      const val = params.get(key);
      if (val) utmParams.set(key, val);
    });
    setUtmString(utmParams.toString());
  }, []);

  return (url: string) => utmString ? `${url}?${utmString}` : url;
}

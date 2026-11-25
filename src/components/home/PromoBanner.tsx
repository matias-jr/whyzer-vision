import { useEffect, useState } from 'react';

// Thanksgiving / Black Friday 2026 banner. TEMPORARY: remove this file, its import and the
// <PromoBanner /> line in HomeV8View.tsx after the offer ends (see _black-friday-revert/README.md).
// Ends Dec 2 2026, 11:59pm ET (= Dec 3 04:59 UTC, EST is UTC-5); it also hides itself after that.
const ENDS_AT = Date.UTC(2026, 11, 3, 5, 0, 0);
const CODE = 'WHYZER10';

export default function PromoBanner() {
  // Rendered on the server and first paint; hidden client-side once the offer has expired.
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const check = () => setExpired(Date.now() >= ENDS_AT);
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  if (expired) return null;

  return (
    <div
      role="region"
      aria-label="Thanksgiving offer"
      style={{
        position: 'relative',
        zIndex: 61,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, #3a3a9e 0%, #6262e9 50%, #3a3a9e 100%)',
        padding: '10px 16px',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0, color: '#fff', fontSize: 13.5, fontFamily: "'Inter', sans-serif", lineHeight: 1.5, textWrap: 'balance' as const }}>
        <span aria-hidden="true" style={{ marginRight: 6 }}>🦃</span>
        <strong>Happy Thanksgiving.</strong> As a thank-you, take <strong>$87 off</strong> your first month of Whyzer Elite. Use code{' '}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            background: 'rgba(255,255,255,0.18)',
            padding: '1px 7px',
            borderRadius: 4,
            letterSpacing: '0.06em',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {CODE}
        </span>{' '}
        at checkout. Ends Dec 2, 11:59pm ET.
      </p>
    </div>
  );
}

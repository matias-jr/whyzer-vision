import { useEffect, useState } from 'react';

// Thanksgiving / Black Friday 2026 promo: the top banner and the Elite pricing-card chip.
// TEMPORARY: remove this file and its usages in HomeV8View.tsx (<PromoBanner />, <PromoChip />)
// after the offer ends (see _black-friday-revert/README.md).
// Ends Dec 2 2026, 11:59pm ET (= Dec 3 04:59 UTC, EST is UTC-5); both hide themselves after that.
const ENDS_AT = Date.UTC(2026, 11, 3, 5, 0, 0);
const CODE = 'WHYZER10';

/** True until the deadline. Rendered on the server and first paint, then re-checked client-side. */
function usePromoActive() {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const check = () => setExpired(Date.now() >= ENDS_AT);
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return !expired;
}

const MONO = "'JetBrains Mono', monospace";

// Type scales up with the viewport: phone 15px, tablet 17px, desktop 19px.
const CSS = `
.wz-promo{padding:11px 16px}
.wz-promo p{font-size:15px;line-height:1.45}
.wz-promo-code{font-size:.92em}
@media (min-width:768px){.wz-promo{padding:13px 24px}.wz-promo p{font-size:17px}}
@media (min-width:1100px){.wz-promo{padding:15px 32px}.wz-promo p{font-size:19px}}
`;

export default function PromoBanner() {
  if (!usePromoActive()) return null;
  return (
    <div
      className="wz-promo"
      role="region"
      aria-label="Thanksgiving offer"
      style={{
        position: 'relative',
        zIndex: 61,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, #3a3a9e 0%, #6262e9 50%, #3a3a9e 100%)',
        textAlign: 'center',
      }}
    >
      <style>{CSS}</style>
      <p style={{ margin: 0, color: '#fff', fontFamily: "'Inter', sans-serif", textWrap: 'balance' as const }}>
        <strong>Happy Thanksgiving.</strong> As a thank-you, take <strong>$87 off</strong> your first month of Whyzer Elite. Use code{' '}
        <span
          className="wz-promo-code"
          style={{
            fontFamily: MONO,
            background: 'rgba(255,255,255,0.18)',
            padding: '1px 8px',
            borderRadius: 5,
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

/** Offer chip for the top of the Elite monthly pricing card. */
export function PromoChip() {
  if (!usePromoActive()) return null;
  return (
    <div
      style={{
        alignSelf: 'stretch',
        textAlign: 'center',
        background: '#14141F',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.4,
        padding: '9px 14px',
        borderRadius: 10,
        marginBottom: 16,
        position: 'relative',
      }}
    >
      Thanksgiving offer: <span style={{ color: '#FFD36B' }}>$87 off</span> your first month · code{' '}
      <span style={{ fontFamily: MONO, color: '#FFD36B', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{CODE}</span>
    </div>
  );
}

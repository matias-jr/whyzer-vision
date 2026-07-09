import { useEffect, useState } from 'react';
import { useUtmParams } from '@/hooks/useUtmParams';

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
  'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'CH','NO','IS','AL','BA','ME','MK','RS','MD','UA','BY','GE','AM','AZ',
  'LI','MC','SM','VA','AD','XK',
]);

const INK = '#F3F2F8';
const MUTED = '#9C9BAE';
const BODY = '#D3D1DE';
const EYEBROW = '#B3A6FF';
const BORDER = 'rgba(255,255,255,0.08)';

const testimonials = [
  {
    quote: '"I needed to show up to the executive call and define, crystal clear, what was going on with the board. It took me three minutes. Less than it takes me to write the prompt to other LLMs."',
    attribution: 'Danny H. — hit 65% of annual quota by March',
    italic: true,
  },
  {
    quote: '"What used to take a rep a year, I can do in two weeks."',
    attribution: 'Rob Sader',
    italic: true,
  },
  {
    quote: 'Tobia La Marca built a point of view in financial language for a €650M IT CapEx priority at Contentsquare. His team told him they\'d never seen anything like it.',
    attribution: 'Tobia La Marca — Contentsquare',
    italic: false,
  },
];

const WebinarThankYou = () => {
  const appendUtm = useUtmParams();
  const [regionSuffix, setRegionSuffix] = useState('');
  const trialUrl = appendUtm(`https://subscribe.whyzer.ai/premium-monthly${regionSuffix}`);

  useEffect(() => {
    loadCss('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  }, []);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const code: string = data.country_code ?? '';
        if (code === 'GB') setRegionSuffix('-uk');
        else if (EU_COUNTRIES.has(code)) setRegionSuffix('-eu');
        else if (code === 'CA') setRegionSuffix('-ca');
        else if (code === 'AU') setRegionSuffix('-au');
        // else stays USD/default with no suffix
      })
      .catch(() => {/* silently keep default */});
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        color: INK,
        background: '#08080F',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* PRIMING LINE */}
        <section style={{ padding: '88px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -220, left: '50%', transform: 'translateX(-50%)', width: 800, height: 560, background: 'radial-gradient(ellipse at center, rgba(109,95,251,0.36) 0%, rgba(109,95,251,0.12) 40%, transparent 70%)', filter: 'blur(20px)', animation: 'wty-glowPulse 6s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, backgroundImage: 'radial-gradient(rgba(178,166,255,0.5) 1px, transparent 1.5px)', backgroundSize: '28px 28px', WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 15%, black 0%, transparent 75%)', maskImage: 'radial-gradient(ellipse 60% 55% at 50% 15%, black 0%, transparent 75%)', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, position: 'relative', animation: 'wty-fadeInUp 0.7s ease both' }}>
            You're in
          </div>
          <p style={{ fontSize: 21, lineHeight: 1.6, maxWidth: 620, margin: 0, color: BODY, position: 'relative', animation: 'wty-fadeInUp 0.8s ease 0.05s both' }}>
            Before you press play, go pull up that stalled account. The one you've sent three follow-ups to and heard nothing back. You're going to read it the way a CFO would, right alongside me. Twenty minutes, and you'll walk out knowing exactly why they've gone quiet.
          </p>
        </section>

        {/* VIDEO */}
        <section style={{ padding: '16px 24px 56px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 800, aspectRatio: '16/9', borderRadius: 16, position: 'relative', overflow: 'hidden', background: 'repeating-linear-gradient(135deg, #14141E, #14141E 12px, #1A1A26 12px, #1A1A26 24px)', border: `1px solid ${BORDER}`, boxShadow: '0 30px 70px -30px rgba(109,95,251,0.35)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(124,111,255,0.18) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, #7C6FFF, #5B4EF0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px -6px rgba(109,95,251,0.7)' }}>
                <div style={{ width: 0, height: 0, borderTop: '14px solid transparent', borderBottom: '14px solid transparent', borderLeft: '22px solid #FFFFFF', marginLeft: 5 }} />
              </div>
              <div style={{ fontFamily: "'Inter', monospace", fontSize: 13, letterSpacing: '0.06em', color: MUTED, textTransform: 'uppercase' }}>
                webinar video
              </div>
            </div>
          </div>
        </section>

        {/* PROOF BLOCK */}
        <section style={{ padding: '64px 24px', background: 'linear-gradient(180deg, rgba(124,111,255,0.06) 0%, rgba(18,18,28,0.6) 100%)', display: 'flex', justifyContent: 'center', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              I've watched this shift play out on hundreds of sellers now. Here's what it looked like on three of them.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="wty-testimonial" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'linear-gradient(180deg, #7C6FFF, transparent)' }} />
                  <p style={{ fontSize: 18, lineHeight: 1.6, margin: '0 0 12px', fontStyle: t.italic ? 'italic' : 'normal', color: BODY }}>{t.quote}</p>
                  <div style={{ fontSize: 14, fontWeight: 700, color: EYEBROW, marginTop: t.italic ? 0 : 12 }}>{t.attribution}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, fontWeight: 600, color: INK }}>
              None of them got there with a better subject line. They got there by reading the numbers before writing a word.
            </p>
          </div>
        </section>

        {/* WALL / BRIDGE TO OFFER */}
        <section style={{ padding: '76px 24px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '10%', right: '6%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(124,111,255,0.16) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              You just watched what fifteen minutes of reading looks like on one account. Now multiply that by the twenty, forty, sixty accounts you're actually carrying. That's not a skill problem anymore. That's a leverage problem.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              That's the only reason Whyzer exists: the same read you just watched me build, sourced and verified against the actual filings and calls, in under two minutes, on any company you sell to.
            </p>
          </div>
        </section>

        {/* RISK REVERSAL + FINAL CTA */}
        <section style={{ padding: '84px 24px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 22, background: 'linear-gradient(180deg, rgba(124,111,255,0.08) 0%, rgba(10,10,18,0.9) 100%)', borderTop: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -160, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse at center, rgba(124,111,255,0.28) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: EYEBROW, position: 'relative' }}>14-day free trial</div>
          <p style={{ fontSize: 19, lineHeight: 1.7, maxWidth: 600, margin: 0, color: BODY, position: 'relative' }}>
            14 days free on your hardest account. After that, $57 a month in Whyzer Premium, unless you cancel first, in which case you pay nothing.
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3.4vw, 30px)', lineHeight: 1.3, maxWidth: 560, margin: '8px 0 0', position: 'relative' }}>
            Run it on the account that's gone quiet. See if it changes how you'd walk into the room.
          </h2>
          <a
            href={trialUrl}
            className="wty-cta"
            style={{ marginTop: 4, background: 'linear-gradient(135deg, #7C6FFF 0%, #5B4EF0 100%)', color: '#FFFFFF', fontWeight: 600, fontSize: 17, padding: '18px 38px', borderRadius: 999, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 30px -6px rgba(109,95,251,0.6)', position: 'relative' }}
          >
            Start My Free Trial
          </a>
        </section>

      </div>

      <style>{`
        @keyframes wty-fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wty-glowPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
        .wty-cta:hover { box-shadow: 0 10px 36px -4px rgba(109,95,251,0.8); transform: translateY(-1px); }
        .wty-testimonial:hover { border-color: rgba(124,111,255,0.4); }
      `}</style>
    </div>
  );
};

export default WebinarThankYou;

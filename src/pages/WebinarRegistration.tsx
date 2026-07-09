import { useEffect } from 'react';

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

const INK = '#F3F2F8';
const MUTED = '#9C9BAE';
const BODY = '#D3D1DE';
const EYEBROW = '#B3A6FF';
const BORDER = 'rgba(255,255,255,0.08)';

const walkOutItems = [
  {
    num: '01',
    body: "The handful of financial metrics executives actually track, and why they outweigh anything you're currently pitching.",
  },
  {
    num: '02',
    body: 'How those metrics turn into financial triggers: specific, timely reasons a company is primed to buy.',
  },
  {
    num: '03',
    body: 'How you turn a trigger into a point of view you can say out loud, in a meeting or an email, using a five-part structure you can run on any account in about fifteen minutes.',
  },
];

const WebinarRegistration = () => {
  useEffect(() => {
    loadCss('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
    loadScript('https://link.msgsndr.com/js/form_embed.js');
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
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* HERO */}
        <section style={{ padding: '110px 24px 88px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 28, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -220, left: '50%', transform: 'translateX(-50%)', width: 900, height: 620, background: 'radial-gradient(ellipse at center, rgba(109,95,251,0.38) 0%, rgba(109,95,251,0.14) 40%, transparent 70%)', filter: 'blur(20px)', animation: 'wr-glowPulse 6s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: 40, right: -80, width: 420, height: 420, background: 'radial-gradient(circle, rgba(124,111,255,0.22) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 520, backgroundImage: 'radial-gradient(rgba(178,166,255,0.5) 1px, transparent 1.5px)', backgroundSize: '28px 28px', WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 20%, black 0%, transparent 75%)', maskImage: 'radial-gradient(ellipse 60% 55% at 50% 20%, black 0%, transparent 75%)', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, position: 'relative', animation: 'wr-fadeInUp 0.7s ease both' }}>
            Financial Fluency Webinar &middot; Free, 20 minutes
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(34px, 5vw, 54px)', lineHeight: 1.14, maxWidth: 880, margin: 0, letterSpacing: '-0.01em', position: 'relative', animation: 'wr-fadeInUp 0.8s ease 0.05s both' }}>
            Why the C&#8209;Suite Ignores You &mdash; and It's Not Your Outreach, Your Timing, or Your Product
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.55, maxWidth: 640, margin: 0, color: MUTED, position: 'relative', animation: 'wr-fadeInUp 0.8s ease 0.1s both' }}>
            I closed $160M+ in enterprise SaaS after learning this the hard way. Before that, I got fired twice for underperformance.
          </p>
          <a
            href="#register"
            className="wr-cta"
            style={{ marginTop: 12, background: 'linear-gradient(135deg, #7C6FFF 0%, #5B4EF0 100%)', color: '#FFFFFF', fontWeight: 600, fontSize: 17, padding: '18px 38px', borderRadius: 999, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 30px -6px rgba(109,95,251,0.6)', position: 'relative', animation: 'wr-fadeInUp 0.8s ease 0.15s both' }}
          >
            Get Instant Access
          </a>
        </section>

        {/* SECTION 1: THE MISDIAGNOSIS */}
        <section style={{ padding: '64px 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              You've done the work. Pulled up the account's LinkedIn. Noticed the product launch, the leadership hire, the reorg. Worked it into the subject line. Sent it to the VP, maybe straight to the CFO.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>Nothing comes back. Not even an out of office.</p>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              So you send a follow-up. Then another. Somewhere around the third one, you start telling yourself a story: the subject line's weak, you need to personalize more, a different sequence would fix it.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, fontWeight: 600, color: INK }}>
              I want to stop you right there. I used to run that exact story on myself, and it was never the real problem. I'll show you the actual one in twenty minutes. But this only matters if it's your problem too, so let me make sure I'm talking to the right person.
            </p>
          </div>
        </section>

        {/* SECTION 2: WHO THIS IS FOR */}
        <section style={{ padding: '64px 24px', background: 'linear-gradient(180deg, rgba(124,111,255,0.06) 0%, rgba(18,18,28,0.6) 100%)', display: 'flex', justifyContent: 'center', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, position: 'relative' }}>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: EYEBROW }}>Who this is for</div>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              This is for you if you're working deals over $100K that take four to nine months to close. Somewhere in that committee is a CFO or a VP of Finance who decides whether the number gets approved, and right now you don't know how to get them to pay attention.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              You've had deals go quiet for weeks with no explanation. You've lost a deal to a competitor with a worse product, even after rewriting your messaging three different times. You know there are bigger deals sitting in your pipeline you're not getting to, and you don't have an SE or a manager next to you figuring out why.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, fontWeight: 600, color: INK }}>If any of that is your week, keep going. This was built for exactly that seat.</p>
          </div>
        </section>

        {/* SECTION 3: CREDIBILITY */}
        <section style={{ padding: '76px 24px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20%', left: '8%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(124,111,255,0.16) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <div className="wr-credibility" style={{ maxWidth: 720, display: 'flex', gap: 40, alignItems: 'center', position: 'relative' }}>
            <div style={{ flexShrink: 0, width: 140, height: 140, borderRadius: '50%', padding: 3, background: 'linear-gradient(135deg, #7C6FFF, #3D3560)' }}>
              <img
                src="/jr_headshot.webp"
                alt="Jamal Reimer"
                style={{ width: 134, height: 134, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: EYEBROW }}>Jamal Reimer</div>
              <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
                Before I closed $160 million in enterprise deals, some of those $50 million on their own, I got fired. Twice. Both times for underperformance. The gap between that low point and everything that came after is one skill. I've since coached hundreds of sellers through the same shift, and I want to show you what it looked like on three of them, live, in twenty minutes.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE PROMISE */}
        <section style={{ padding: '76px 24px', background: 'linear-gradient(180deg, rgba(124,111,255,0.06) 0%, rgba(18,18,28,0.6) 100%)', display: 'flex', justifyContent: 'center', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: EYEBROW }}>What you'll walk out with</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {walkOutItems.map((item) => (
                <div key={item.num} style={{ display: 'flex', gap: 20, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '22px 24px' }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, background: 'linear-gradient(135deg, #A79BFF, #6D5FFB)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', flexShrink: 0, width: 40 }}>
                    {item.num}
                  </div>
                  <p style={{ fontSize: 19, lineHeight: 1.65, margin: 0, color: BODY }}>{item.body}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, fontWeight: 600, color: INK }}>Then I'll build one live. Cold. On a company neither of us has looked at yet.</p>
          </div>
        </section>

        {/* SECTION 5: WHAT HAPPENS WHEN YOU JOIN */}
        <section style={{ padding: '64px 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 640 }}>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              Before you press play, pull up your hardest account. The one that's stalled. The one where you've sent three follow-ups and heard nothing back. You're going to read it the way a CFO would, right alongside me.
            </p>
          </div>
        </section>

        {/* FINAL CTA + FORM */}
        <section id="register" style={{ padding: '72px 24px 84px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, background: 'linear-gradient(180deg, rgba(124,111,255,0.08) 0%, rgba(10,10,18,0.9) 100%)', borderTop: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -160, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse at center, rgba(124,111,255,0.28) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 36px)', lineHeight: 1.25, maxWidth: 620, margin: 0, position: 'relative' }}>
            If any of this is your week, register below.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 560, margin: '0 0 4px', color: MUTED, position: 'relative' }}>
            Twenty minutes. One live build. Nothing held back on the one trigger I'm teaching you.
          </p>
          <div style={{ width: '100%', maxWidth: 460, background: 'rgba(21,21,31,0.8)', backdropFilter: 'blur(6px)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 2, boxShadow: '0 20px 50px -20px rgba(0,0,0,0.6)', position: 'relative' }}>
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/0IDxoJ7W18vC7OpqJsGu"
              style={{ width: '100%', height: 360, border: 'none', borderRadius: 12, display: 'block' }}
              id="inline-0IDxoJ7W18vC7OpqJsGu"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Evergreen Webinar – Registration Form"
              data-height="360"
              data-layout-iframe-id="inline-0IDxoJ7W18vC7OpqJsGu"
              data-form-id="0IDxoJ7W18vC7OpqJsGu"
              title="Evergreen Webinar – Registration Form"
            />
          </div>
        </section>

      </div>

      <style>{`
        @keyframes wr-fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wr-glowPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
        .wr-cta:hover { box-shadow: 0 10px 36px -4px rgba(109,95,251,0.8); transform: translateY(-1px); }
        @media (max-width: 640px) {
          .wr-credibility { flex-direction: column; text-align: center; gap: 24px; }
        }
      `}</style>
    </div>
  );
};

export default WebinarRegistration;

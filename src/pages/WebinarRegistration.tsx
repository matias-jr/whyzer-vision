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

// ── Palette adopted from whyzer-mockup-v2: a light page (--bg / --bg-alt) with
// --navy reserved for the two sections that stay dark (credibility, final CTA).
const NAVY = '#0B0B18';
const NAVY2 = '#14142B';
const ACCENT = '#6262E9';
const ACCENT_DARK = '#4A4AD1';
const ACCENT_TINT = '#EEEEFC';

// Light-section text
const INK = '#14141F';
const BODY = '#55556B';
const MUTED = '#8A8AA0';
const BG = '#FAFAF9';
const BG_ALT = '#F2F1FB';
const WHITE = '#FFFFFF';
const LINE = '#E4E3F0';

// Dark-section text (used only inside the two navy sections)
const D_INK = '#FFFFFF';
const D_BODY = '#DADAF2';
const D_EYEBROW = '#9C9CE0';
const D_LINE = 'rgba(255,255,255,0.12)';

// Form wrapper — restored to its earlier flat pairing, kept opaque so the
// embedded GHL iframe sits on a solid surface.
const FORM_BG = '#14141F';
const FORM_BORDER = '#1D1D27';

// ── Glass surfaces. Light cards frost against the page tint; dark cards frost
// against navy. Both pair a translucent fill with a blur and a top highlight.
const GLASS_LIGHT = 'rgba(255,255,255,0.55)';
const GLASS_LIGHT_BORDER = 'rgba(255,255,255,0.75)';
const GLASS_LIGHT_SHADOW = '0 8px 32px -12px rgba(20,20,31,0.14)';
const GLASS_DARK = 'rgba(255,255,255,0.06)';
const GLASS_DARK_BORDER = 'rgba(255,255,255,0.14)';
const GLASS_DARK_SHADOW = '0 8px 32px -12px rgba(0,0,0,0.55)';
const GLASS_BLUR = 'blur(12px) saturate(140%)';

const EYEBROW = ACCENT_DARK;
const DISPLAY = "'Space Grotesk', sans-serif";
const CTA_LABEL = 'Take me to the webinar!';

// ── "The real problem" row: four ways sellers misdiagnose the silence.
const problemItems = [
  {
    title: 'Your outreach gets ignored.',
    body: "You're not saying what matters.",
    // Envelope, sent but unopened — flap folded down, no overlapping marks.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="m2 7.5 10 6.5 10-6.5" />
      </svg>
    ),
  },
  {
    title: 'Your timing is off.',
    body: 'You engage too early or too late.',
    // Clock with hands past the hour — timing, not aim.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
  {
    title: 'Your message is weak.',
    body: "It doesn't connect to what they care about.",
    // Speech bubble with a closed outline and tail, text lines drawn inside it.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z" /><path d="M8 8.5h9M8 12h5.5" />
      </svg>
    ),
  },
  {
    title: 'Your product is not the priority.',
    body: "You're solving the wrong problem.",
    // Stacked list with the top item flagged — ranking, not a shipping box.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <path d="M4 6h8M4 12h10M4 18h6" /><path d="M17 4v8l2.5-2 2.5 2V4z" />
      </svg>
    ),
  },
];

// ── "Who this is for": each card now leads with a large typographic stat
// (display font) in place of the icon it used to carry.
const whoItems = [
  {
    stat: '$100K+',
    statNote: 'deal size',
    body: 'You’re working deals over $100K that take four to nine months to close.',
  },
  {
    stat: '4–9 mo',
    statNote: 'to close',
    body: 'You’re selling to CFOs, VP of Finance, or executives.',
  },
  {
    stat: 'Silence',
    statNote: 'what you get back',
    body: 'You don’t know how to get them to pay attention.',
  },
];

// ── "What you'll walk out with": ordered because it IS a sequence — read the
// metrics, turn them into triggers, turn a trigger into a point of view.
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

// ── "Before you press play": a short personal note, read as plain lines.
const primingLines = [
  'Pull up your hardest account — the one that’s stalled.',
  'The one where you’ve sent three follow-ups and heard nothing back.',
  'You’re going to read it the way a CFO would, right alongside me.',
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
        background: BG,
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* NAV — stays navy, as in the mockup */}
      <div style={{ background: NAVY }}>
        <header className="wr-nav" style={{ maxWidth: 1140, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'nowrap', position: 'relative', zIndex: 5 }}>
          <img src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png" alt="Whyzer" style={{ height: 30, width: 'auto', flexShrink: 0 }} />
          <div className="wr-nav-meta" style={{ alignItems: 'center', gap: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C7C7EB', flexShrink: 0 }}>
            <span style={{ whiteSpace: 'nowrap' }}>&#9737; Free Webinar</span>
            <span className="wr-nav-mins" style={{ whiteSpace: 'nowrap' }}>&#8226; 20 Minutes</span>
          </div>
        </header>
      </div>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '64px 0 88px', overflow: 'hidden', background: BG }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'wr-fadeInUp 0.8s ease both' }}>
            <p className="wr-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT_TINT, color: ACCENT_DARK, fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 999, margin: '0 0 20px' }}>Financial Fluency Webinar</p>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(34px, 4.6vw, 54px)', lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-0.01em', color: INK }}>
              Why the <span style={{ color: ACCENT }}>C&#8209;Suite Ignores You &mdash;</span> and It&rsquo;s Not Your Outreach, Your Timing, or Your Product
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 560, margin: '0 0 32px', color: BODY }}>
              I closed $160M+ in enterprise SaaS after learning this the hard way. Before that, I got fired twice for underperformance.
            </p>
            <a href="#register" className="wr-cta" style={{ background: ACCENT, color: '#FFFFFF', fontWeight: 600, fontSize: 16, padding: '15px 30px', borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 20px -8px rgba(98,98,233,0.55)' }}>
              {CTA_LABEL} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* THE REAL PROBLEM */}
      <section style={{ padding: '80px 24px 88px', textAlign: 'center', background: BG_ALT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, position: 'relative', overflow: 'hidden' }}>
        {/* Soft accent blooms give the frosted cards something to refract */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '38%', left: '6%', width: 420, height: 320, background: 'radial-gradient(ellipse at center, rgba(98,98,233,0.20) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '4%', right: '4%', width: 380, height: 300, background: 'radial-gradient(ellipse at center, rgba(98,98,233,0.14) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 16px' }}>The Real Problem</p>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.25, margin: '0 0 48px', color: INK }}>
            You&rsquo;re doing the work.<br />But you&rsquo;re not getting the response.
          </h2>
          <div className="wr-problem-grid">
            {problemItems.map((item, i) => (
              <div key={i} className="wr-glass" style={{ borderRadius: 14, padding: '26px 20px' }}>
                <div style={{ color: ACCENT, display: 'flex', justifyContent: 'center', marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, margin: '0 0 8px', color: INK }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: BODY, margin: 0, lineHeight: 1.55 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section style={{ padding: '88px 24px', display: 'flex', justifyContent: 'center', background: BG, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '30%', right: '2%', width: 460, height: 340, background: 'radial-gradient(ellipse at center, rgba(98,98,233,0.16) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, width: '100%', position: 'relative' }}>
          <div className="wr-who-head">
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 12px' }}>Who this is for</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(26px, 3.2vw, 34px)', lineHeight: 1.2, margin: 0, color: INK }}>This webinar is for you if&hellip;</h2>
          </div>
          <div className="wr-who-grid">
            {whoItems.map((item, i) => (
              <div key={i} className="wr-glass" style={{ borderRadius: 16, padding: '26px 24px' }}>
                {/* Large typographic stat replaces the former icon */}
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(30px, 3.6vw, 40px)', lineHeight: 1, letterSpacing: '-0.02em', color: ACCENT, marginBottom: 6 }}>
                  {item.stat}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 18 }}>{item.statNote}</div>
                <p style={{ fontSize: 15, color: BODY, margin: 0, lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
          {/* Full-width prose — kept exactly as one block, not split into cards */}
          <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 22, marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, margin: 0, color: BODY }}>
              You&rsquo;ve had deals go quiet for weeks with no explanation. You&rsquo;ve lost a deal to a competitor with a worse product, even after rewriting your messaging three different times. You know there are bigger deals sitting in your pipeline you&rsquo;re not getting to, and you don&rsquo;t have an SE or a manager next to you figuring out why.
            </p>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, margin: 0, fontWeight: 600, color: INK }}>If any of that is your week, keep going. This was built for exactly that seat.</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL WALK OUT WITH */}
      <section style={{ padding: '88px 24px', display: 'flex', justifyContent: 'center', background: BG_ALT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 960, width: '100%' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 40px' }}>What you&rsquo;ll walk out with</p>
          {/* Single connected block: three columns split by thin vertical rules */}
          <div className="wr-walk-grid">
            {walkOutItems.map((item, i) => (
              <div key={item.num} className="wr-walk-col" style={{ borderLeft: i === 0 ? 'none' : `1px solid ${LINE}` }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(40px, 4.6vw, 52px)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: ACCENT, marginBottom: 20 }}>
                  {item.num}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, color: BODY }}>{item.body}</p>
              </div>
            ))}
          </div>
          {/* Standalone punchline — full width below the columns */}
          <p style={{ fontSize: 17.5, lineHeight: 1.6, margin: '40px 0 0', paddingTop: 28, borderTop: `1px solid ${LINE}`, fontWeight: 600, color: INK }}>
            Then I&rsquo;ll build one live. Cold. On a company neither of us has looked at yet.
          </p>
        </div>
      </section>

      {/* CREDIBILITY / ABOUT JAMAL — kept dark by request */}
      <section style={{ padding: '90px 24px', display: 'flex', justifyContent: 'center', position: 'relative', background: NAVY, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '8%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(98,98,233,0.20) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div className="wr-credibility" style={{ maxWidth: 1080, width: '100%', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center', position: 'relative' }}>
          <div className="wr-cred-photo wr-glass-dark" style={{ position: 'relative', minHeight: 480, overflow: 'hidden', borderRadius: 20, padding: 0 }}>
            <img src="/jamal%20evergreen%201.png" alt="Jamal Reimer" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%', display: 'block', zIndex: 1 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: D_EYEBROW, margin: 0 }}>Jamal Reimer</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.2, margin: 0, color: D_INK }}>I&rsquo;ve been there.<br />I&rsquo;ll show you exactly what I do now.</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, margin: 0, color: D_BODY }}>
              Before I closed $160 million in enterprise deals, some of those $50 million on their own, I got fired. Twice. Both times for underperformance. The gap between that low point and everything that came after is one skill. I&rsquo;ve since coached hundreds of sellers through the same shift, and I want to show you what it looked like on three of them, live, in twenty minutes.
            </p>
          </div>
        </div>
      </section>

      {/* BEFORE YOU PRESS PLAY */}
      <section style={{ padding: '84px 24px', display: 'flex', justifyContent: 'center', position: 'relative', background: BG }}>
        <div className="wr-priming" style={{ maxWidth: 900, width: '100%', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 14px' }}>Before you press play</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.25, margin: 0, color: INK }}>Bring your hardest account.</h2>
          </div>
          {/* Plain personal note — dashes, no checkbox UI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {primingLines.map((line, i) => (
              <p key={i} style={{ fontSize: 16.5, lineHeight: 1.6, margin: 0, color: BODY, display: 'flex', gap: 14 }}>
                <span aria-hidden="true" style={{ color: ACCENT }}>&mdash;</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA + FORM */}
      <section id="register" style={{ padding: '80px 24px 92px', display: 'flex', justifyContent: 'center', background: NAVY, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -160, left: '30%', width: 640, height: 380, background: 'radial-gradient(ellipse at center, rgba(98,98,233,0.28) 0%, transparent 70%)', filter: 'blur(24px)', pointerEvents: 'none' }} />
        <div className="wr-cta-grid" style={{ maxWidth: 900, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', position: 'relative' }}>
          <div>
            {/* Calendar illustration removed — the eyebrow does the labelling */}
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: D_EYEBROW, margin: '0 0 14px' }}>Save your spot</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 34px)', lineHeight: 1.22, margin: '0 0 16px', color: D_INK }}>If any of this is your week, register below.</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: 0, color: '#B9B9E8' }}>
              Twenty minutes. One live build. Nothing held back on the one trigger I&rsquo;m teaching you.
            </p>
          </div>

          {/* FORM — GHL embed (Evergreen Webinar – Registration Form). The
              form_embed.js script loaded in useEffect handles the auto-resize. */}
          <div
            className="wr-form"
            style={{ background: FORM_BG, border: `1px solid ${FORM_BORDER}`, borderRadius: 16, padding: '28px 26px', boxShadow: '0 20px 50px -20px rgba(0,0,0,0.6)' }}
          >
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/0IDxoJ7W18vC7OpqJsGu"
              style={{ width: '100%', height: 432, border: 'none', borderRadius: 8, display: 'block' }}
              id="inline-0IDxoJ7W18vC7OpqJsGu"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Evergreen Webinar – Registration Form"
              data-height="432"
              data-layout-iframe-id="inline-0IDxoJ7W18vC7OpqJsGu"
              data-form-id="0IDxoJ7W18vC7OpqJsGu"
              title="Evergreen Webinar – Registration Form"
            />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes wr-fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wr-glowPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
        .wr-cta:hover { background: ${ACCENT_DARK}; box-shadow: 0 10px 26px -6px rgba(98,98,233,0.65); transform: translateY(-1px); }
        .wr-cta { transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease; }
        /* Glass surfaces: translucent fill + backdrop blur, with a bright top
           edge so the panel reads as a lit sheet rather than a flat tint. */
        .wr-glass, .wr-glass-dark {
          position: relative;
          backdrop-filter: ${GLASS_BLUR};
          -webkit-backdrop-filter: ${GLASS_BLUR};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wr-glass {
          background: ${GLASS_LIGHT};
          border: 1px solid ${GLASS_LIGHT_BORDER};
          box-shadow: ${GLASS_LIGHT_SHADOW};
        }
        .wr-glass-dark {
          background: ${GLASS_DARK};
          border: 1px solid ${GLASS_DARK_BORDER};
          box-shadow: ${GLASS_DARK_SHADOW};
        }
        .wr-glass::before, .wr-glass-dark::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 42%);
        }
        .wr-glass-dark::before {
          background: linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 46%);
        }
        .wr-glass > *, .wr-glass-dark > * { position: relative; z-index: 1; }
        .wr-glass:hover { transform: translateY(-2px); box-shadow: 0 14px 40px -12px rgba(20,20,31,0.20); }
        /* Fallback: without backdrop-filter the translucent fill reads as washed
           out, so fall back to the solid card colours. */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .wr-glass { background: ${WHITE}; border-color: ${LINE}; }
          .wr-glass-dark { background: ${NAVY2}; border-color: ${D_LINE}; }
        }
        .wr-nav-meta { display: flex; }
        .wr-cred-photo { align-self: stretch; }
        .wr-problem-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .wr-who-head { text-align: left; margin-bottom: 36px; }
        .wr-who-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .wr-walk-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        .wr-walk-col { padding: 4px 28px; }
        .wr-walk-col:first-child { padding-left: 0; }
        input:focus, .wr-form input:focus { outline: none; border-color: ${ACCENT}; box-shadow: 0 0 0 3px rgba(98,98,233,0.22); }
        a:focus-visible, button:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }
        @media (max-width: 640px) {
          /* Keep the nav on one line — shrink the meta rather than wrapping it */
          .wr-nav { flex-wrap: nowrap; gap: 12px; padding: 16px 18px; }
          .wr-nav-meta { gap: 10px; font-size: 10px; letter-spacing: 0.06em; }
          .wr-nav img { height: 24px; }
        }
        @media (max-width: 560px) {
          /* Both labels can't fit beside the logo on phones — drop the duration
             and keep "Free Webinar" legible on the one line. */
          .wr-nav-mins { display: none; }
        }
        @media (max-width: 400px) {
          /* Below this even the single label clips, so the logo stands alone. */
          .wr-nav-meta { display: none; }
        }
        @media (max-width: 900px) {
          .wr-problem-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .wr-who-grid { grid-template-columns: 1fr; }
          .wr-walk-grid { grid-template-columns: 1fr; }
          .wr-walk-col { padding: 24px 0 !important; border-left: none !important; border-top: 1px solid ${LINE}; }
          .wr-walk-col:first-child { border-top: none; padding-top: 0 !important; }
          .wr-priming { grid-template-columns: 1fr !important; gap: 24px !important; }
          .wr-cta-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .wr-credibility { grid-template-columns: 1fr !important; gap: 28px !important; text-align: center; }
          /* Single-column: the row no longer stretches, so give the frame a real
             height and let the portrait fill it rather than collapsing. */
          .wr-cred-photo { min-height: 0 !important; height: 420px; max-width: 340px; width: 100%; margin: 0 auto; align-self: center !important; }
          .wr-cred-photo img { object-position: center 38% !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default WebinarRegistration;

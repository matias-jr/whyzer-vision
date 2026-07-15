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
const ACCENT = '#7C6FFF';
const DISPLAY = "'Space Grotesk', sans-serif";
const CTA_LABEL = 'Take me to the webinar!';

// ── "The real problem" row: four ways sellers misdiagnose the silence.
const problemItems = [
  {
    title: 'Your outreach gets ignored.',
    body: "You're not saying what matters.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /><path d="m15 15 4 4M19 15l-4 4" />
      </svg>
    ),
  },
  {
    title: 'Your timing is off.',
    body: 'You engage too early or too late.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Your message is weak.',
    body: "It doesn't connect to what they care about.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <path d="M8 10h8M8 14h5" /><path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-4a8 8 0 0 1 6-14 8 8 0 0 1 12 7z" />
      </svg>
    ),
  },
  {
    title: 'Your product is not the priority.',
    body: "You're solving the wrong problem.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <path d="m21 16-9 5-9-5V8l9-5 9 5z" /><path d="m3 8 9 5 9-5M12 13v8" />
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
        background: '#08080F',
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* NAV */}
      <header style={{ maxWidth: 1140, margin: '0 auto', padding: '26px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 5 }}>
        <img src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png" alt="Whyzer" style={{ height: 30, width: 'auto' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>
          <span>&#9737; Free Webinar</span>
          <span>&#8226; 20 Minutes</span>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '56px 0 100px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 820, height: 580, background: 'radial-gradient(ellipse at center, rgba(109,95,251,0.30) 0%, rgba(109,95,251,0.10) 42%, transparent 70%)', filter: 'blur(24px)', animation: 'wr-glowPulse 6s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'wr-fadeInUp 0.8s ease both' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 22px' }}>Financial Fluency Webinar</p>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(34px, 4.6vw, 54px)', lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-0.01em' }}>
              Why the <span style={{ color: ACCENT }}>C&#8209;Suite Ignores You &mdash;</span> and It&rsquo;s Not Your Outreach, Your Timing, or Your Product
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, maxWidth: 560, margin: '0 0 36px', color: MUTED }}>
              I closed $160M+ in enterprise SaaS after learning this the hard way. Before that, I got fired twice for underperformance.
            </p>
            <a href="#register" className="wr-cta" style={{ background: 'linear-gradient(135deg, #7C6FFF 0%, #5B4EF0 100%)', color: '#FFFFFF', fontWeight: 600, fontSize: 17, padding: '17px 36px', borderRadius: 999, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px -6px rgba(109,95,251,0.6)' }}>
              {CTA_LABEL} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* THE REAL PROBLEM */}
      <section style={{ padding: '72px 24px 84px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(124,111,255,0.05) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 16px' }}>The Real Problem</p>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.25, margin: '0 0 56px' }}>
            You&rsquo;re doing the work.<br />But you&rsquo;re not getting the response.
          </h2>
          <div className="wr-problem-grid">
            {problemItems.map((item, i) => (
              <div key={i} style={{ padding: '0 22px', borderLeft: i === 0 ? 'none' : `1px solid ${BORDER}` }}>
                <div style={{ color: ACCENT, display: 'flex', justifyContent: 'center', marginBottom: 18 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.5 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section style={{ padding: '80px 24px', display: 'flex', justifyContent: 'center', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, width: '100%' }}>
          <div className="wr-who-head">
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 12px' }}>Who this is for</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(26px, 3.2vw, 34px)', lineHeight: 1.2, margin: 0 }}>This webinar is for you if&hellip;</h2>
          </div>
          <div className="wr-who-grid">
            {whoItems.map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '26px 24px' }}>
                {/* Large typographic stat replaces the former icon */}
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(30px, 3.6vw, 40px)', lineHeight: 1, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #C4BAFF, #7C6FFF)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: 6 }}>
                  {item.stat}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 18 }}>{item.statNote}</div>
                <p style={{ fontSize: 15.5, color: BODY, margin: 0, lineHeight: 1.55 }}>{item.body}</p>
              </div>
            ))}
          </div>
          {/* Full-width prose — kept exactly as one block, not split into cards */}
          <div style={{ borderLeft: `2px solid ${ACCENT}`, paddingLeft: 22, marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 17, lineHeight: 1.7, margin: 0, color: BODY }}>
              You&rsquo;ve had deals go quiet for weeks with no explanation. You&rsquo;ve lost a deal to a competitor with a worse product, even after rewriting your messaging three different times. You know there are bigger deals sitting in your pipeline you&rsquo;re not getting to, and you don&rsquo;t have an SE or a manager next to you figuring out why.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, margin: 0, fontWeight: 600, color: INK }}>If any of that is your week, keep going. This was built for exactly that seat.</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL WALK OUT WITH */}
      <section style={{ padding: '80px 24px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(124,111,255,0.06) 0%, rgba(18,18,28,0.5) 100%)', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, width: '100%' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 40px' }}>What you&rsquo;ll walk out with</p>
          {/* Single connected block: three columns split by thin vertical rules */}
          <div className="wr-walk-grid">
            {walkOutItems.map((item, i) => (
              <div key={item.num} className="wr-walk-col" style={{ borderLeft: i === 0 ? 'none' : `1px solid ${BORDER}` }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(40px, 4.6vw, 52px)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #A79BFF, #6D5FFB)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: 20 }}>
                  {item.num}
                </div>
                <p style={{ fontSize: 15.5, lineHeight: 1.62, margin: 0, color: BODY }}>{item.body}</p>
              </div>
            ))}
          </div>
          {/* Standalone punchline — full width below the columns */}
          <p style={{ fontSize: 18, lineHeight: 1.6, margin: '40px 0 0', paddingTop: 28, borderTop: `1px solid ${BORDER}`, fontWeight: 600, color: INK }}>
            Then I&rsquo;ll build one live. Cold. On a company neither of us has looked at yet.
          </p>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section style={{ padding: '84px 24px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '8%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(124,111,255,0.14) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div className="wr-credibility" style={{ maxWidth: 760, display: 'flex', gap: 44, alignItems: 'center', position: 'relative' }}>
          <div style={{ flexShrink: 0, width: 150, height: 150, borderRadius: '50%', padding: 3, background: 'linear-gradient(135deg, #7C6FFF, #3D3560)' }}>
            <img src="/jr_headshot.webp" alt="Jamal Reimer" style={{ width: 144, height: 144, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: EYEBROW, margin: 0 }}>Jamal Reimer</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.2, margin: 0 }}>I&rsquo;ve been there.<br />I&rsquo;ll show you exactly what I do now.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, margin: 0, color: BODY }}>
              Before I closed $160 million in enterprise deals, some of those $50 million on their own, I got fired. Twice. Both times for underperformance. The gap between that low point and everything that came after is one skill. I&rsquo;ve since coached hundreds of sellers through the same shift, and I want to show you what it looked like on three of them, live, in twenty minutes.
            </p>
          </div>
        </div>
      </section>

      {/* BEFORE YOU PRESS PLAY */}
      <section style={{ padding: '72px 24px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div className="wr-priming" style={{ maxWidth: 900, width: '100%', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 14px' }}>Before you press play</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.25, margin: 0 }}>Bring your hardest account.</h2>
          </div>
          {/* Plain personal note — dashes, no checkbox UI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {primingLines.map((line, i) => (
              <p key={i} style={{ fontSize: 17, lineHeight: 1.6, margin: 0, color: BODY, display: 'flex', gap: 14 }}>
                <span aria-hidden="true" style={{ color: ACCENT }}>&mdash;</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA + FORM */}
      <section id="register" style={{ padding: '72px 24px 88px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(124,111,255,0.08) 0%, rgba(10,10,18,0.9) 100%)', borderTop: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -160, left: '30%', width: 640, height: 380, background: 'radial-gradient(ellipse at center, rgba(124,111,255,0.24) 0%, transparent 70%)', filter: 'blur(24px)', pointerEvents: 'none' }} />
        <div className="wr-cta-grid" style={{ maxWidth: 900, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', position: 'relative' }}>
          <div>
            {/* Calendar illustration removed — the eyebrow does the labelling */}
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: EYEBROW, margin: '0 0 14px' }}>Save your spot</p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 34px)', lineHeight: 1.22, margin: '0 0 16px' }}>If any of this is your week, register below.</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, color: MUTED }}>
              Twenty minutes. One live build. Nothing held back on the one trigger I&rsquo;m teaching you.
            </p>
          </div>

          {/* FORM — unchanged: First Name, Email, consent, submit */}
          <form
            className="wr-form"
            style={{ background: 'rgba(21,21,31,0.8)', backdropFilter: 'blur(6px)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '28px 26px', boxShadow: '0 20px 50px -20px rgba(0,0,0,0.6)' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BODY, margin: '0 0 8px' }}>First Name <span style={{ color: ACCENT }}>*</span></label>
            <input
              type="text"
              placeholder="Enter your first name"
              required
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '13px 15px', fontSize: 15, color: INK, marginBottom: 18, fontFamily: 'inherit' }}
            />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BODY, margin: '0 0 8px' }}>Work Email <span style={{ color: ACCENT }}>*</span></label>
            <input
              type="email"
              placeholder="you@company.com"
              required
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '13px 15px', fontSize: 15, color: INK, marginBottom: 18, fontFamily: 'inherit' }}
            />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BODY, margin: '0 0 8px' }}>Job Title <span style={{ color: ACCENT }}>*</span></label>
            <input
              type="text"
              placeholder="e.g. Enterprise Account Executive"
              required
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '13px 15px', fontSize: 15, color: INK, marginBottom: 18, fontFamily: 'inherit' }}
            />
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: MUTED, margin: '0 0 20px', lineHeight: 1.5, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: ACCENT }} />
              <span>Yes, I want to understand why the C-suite keeps ignoring me.</span>
            </label>
            <button
              type="submit"
              className="wr-cta"
              style={{ width: '100%', background: 'linear-gradient(135deg, #7C6FFF 0%, #5B4EF0 100%)', color: '#FFFFFF', fontWeight: 600, fontSize: 16, padding: '15px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 8px 30px -6px rgba(109,95,251,0.6)' }}
            >
              {CTA_LABEL}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @keyframes wr-fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wr-glowPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
        .wr-cta:hover { box-shadow: 0 10px 36px -4px rgba(109,95,251,0.8); transform: translateY(-1px); }
        .wr-cta { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .wr-problem-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .wr-who-head { text-align: left; margin-bottom: 36px; }
        .wr-who-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .wr-walk-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        .wr-walk-col { padding: 4px 28px; }
        .wr-walk-col:first-child { padding-left: 0; }
        input:focus, .wr-form input:focus { outline: none; border-color: ${ACCENT}; box-shadow: 0 0 0 3px rgba(124,111,255,0.22); }
        a:focus-visible, button:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }
        @media (max-width: 900px) {
          .wr-problem-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 8px; }
          .wr-who-grid { grid-template-columns: 1fr; }
          .wr-walk-grid { grid-template-columns: 1fr; }
          .wr-walk-col { padding: 24px 0 !important; border-left: none !important; border-top: 1px solid ${BORDER}; }
          .wr-walk-col:first-child { border-top: none; padding-top: 0 !important; }
          .wr-priming { grid-template-columns: 1fr !important; gap: 24px !important; }
          .wr-cta-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .wr-credibility { flex-direction: column; text-align: center; gap: 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default WebinarRegistration;

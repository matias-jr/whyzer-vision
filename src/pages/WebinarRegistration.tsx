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

// ── "The real problem": internal dialogue, not a checklist. Each card pairs
// the seller's self-talk with the reflex it triggers, so the icons are gone.
const problemItems = [
  {
    title: 'My outreach isn’t sharp enough.',
    body: 'So you rewrite the subject line.',
  },
  {
    title: 'My timing was off.',
    body: 'So you wait for a better moment.',
  },
  {
    title: 'My message isn’t landing.',
    body: 'So you try a different angle.',
  },
  {
    title: 'My product isn’t the priority.',
    body: 'So you build a better business case.',
  },
];

// ── "Who this is for": each card now leads with a large typographic stat
// (display font) in place of the icon it used to carry.
// ── "Who this is for": three sequential nodes, not parallel cards. Each one
// is the consequence of the one before it, so they render as a chain.
const whoItems = [
  {
    stat: '$100K+',
    statNote: 'Deal size',
    body: 'You’re working deals big enough that a committee has to sign off, not just one buyer.',
  },
  {
    stat: '4–9 months',
    statNote: 'Time to close',
    body: 'Long enough for priorities to shift, budgets to freeze, and champions to go quiet, without you ever finding out why.',
  },
  {
    stat: 'Silence',
    statNote: 'What you’re left with',
    body: 'And when it happens, you don’t know how to get them to pay attention again.',
  },
];

// ── "What you'll walk out with": ordered because it IS a sequence — read the
// metrics, turn them into triggers, turn a trigger into a point of view.
const walkOutItems = [
  {
    num: '01',
    body: (
      <>
        The handful of <b>financial metrics executives</b> actually <b>track,</b> and why they
        outweigh anything you&rsquo;re currently pitching.
      </>
    ),
  },
  {
    num: '02',
    body: (
      <>
        How those metrics <b>turn into financial triggers</b>: specific, timely reasons a company is
        primed to buy.
      </>
    ),
  },
  {
    num: '03',
    body: (
      <>
        How you <b>turn</b> a trigger into a <b>point of view</b> you can say out loud, in a meeting
        or an email, using a five-part structure you can <b>run on any account</b> in about{' '}
        <b>fifteen minutes</b>.
      </>
    ),
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
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.25, margin: '0 0 18px', color: INK }}>
            You&rsquo;re doing the work.<br />But you&rsquo;re not getting the response.
          </h2>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, margin: '0 0 44px', color: BODY }}>
            So you tell yourself it&rsquo;s one of these.
          </p>
          <div className="wr-problem-grid">
            {problemItems.map((item, i) => (
              <div key={i} className="wr-glass" style={{ borderRadius: 14, padding: '28px 22px' }}>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 'clamp(17px, 1.6vw, 19px)', fontWeight: 700, margin: '0 0 12px', color: INK, lineHeight: 1.3 }}>
                  &ldquo;{item.title}&rdquo;
                </h3>
                <p style={{ fontSize: 13.5, color: MUTED, margin: 0, lineHeight: 1.55 }}>{item.body}</p>
              </div>
            ))}
          </div>
          {/* The reveal: everything above is a misdiagnosis. */}
          <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(21px, 2.6vw, 28px)', lineHeight: 1.4, margin: '52px auto 0', maxWidth: 760, color: INK }}>
            None of that is it.{' '}
            <span style={{ color: ACCENT }}>
              You&rsquo;re solving a problem the executive never asked about.
            </span>
          </p>
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
          {/* Chain: the three points are sequential, so a single connecting
              line runs through them. The line is functional here, showing
              cause and consequence, so it carries the accent colour. */}
          <div className="wr-chain">
            {whoItems.map((item, i) => (
              <div key={i} className="wr-node">
                <span className="wr-node-dot" aria-hidden="true" />
                <div className="wr-node-body">
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(28px, 3.4vw, 38px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: ACCENT, marginBottom: 6 }}>
                    {item.stat}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>{item.statNote}</div>
                  <p style={{ fontSize: 15, color: BODY, margin: 0, lineHeight: 1.6 }}>{item.body}</p>
                </div>
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
              Before I <b>closed $160 million</b> in enterprise deals, some of those <b>$50 million on their own</b>, I got fired. <b>Twice.</b> Both times for underperformance. <b>The gap</b> between that low point and everything that came after <b>is one skill.</b> I&rsquo;ve since coached hundreds of sellers through the same shift, and I want to show you <b>what it looked like</b> on three of them, <b>live, in twenty minutes.</b>
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
        /* ── Chain. Nodes sit on a single accent line: horizontal on desktop,
           vertical on mobile. The dot marks each node on the line. */
        .wr-chain { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; position: relative; }
        /* One continuous line behind the nodes, inset so it starts and ends on
           the first and last dot rather than overhanging. */
        /* Columns are (100% - 2*28px)/3 wide. The last dot sits at the start of
           the third column, i.e. 2 columns + 2 gaps from the left edge, so the
           line spans from the first dot to there. */
        .wr-chain::before {
          content: ''; position: absolute; top: 5px; height: 2px; left: 6px;
          width: calc((100% - 56px) / 3 * 2 + 56px);
          background: rgba(98,98,233,0.28);
        }
        .wr-node { position: relative; padding-top: 30px; }
        .wr-node-dot {
          position: absolute; top: 0; left: 0; z-index: 1;
          width: 12px; height: 12px; border-radius: 50%;
          background: ${ACCENT};
          box-shadow: 0 0 0 4px rgba(98,98,233,0.16);
        }
        @media (max-width: 900px) {
          .wr-chain { grid-template-columns: 1fr; gap: 0; }
          .wr-chain::before {
            top: 6px; bottom: auto; left: 5px; right: auto;
            width: 2px; height: auto;
          }
          .wr-node { padding-top: 0; padding-left: 30px; padding-bottom: 30px; }
          .wr-node:last-child { padding-bottom: 0; }
          .wr-node-dot { top: 0; left: 0; }
        }
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

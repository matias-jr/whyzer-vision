import { useEffect, useState } from 'react';
import { Head } from 'vite-react-ssg';
import { FunnelPage } from '@/components/site/FunnelChrome';

// Vimeo embed for the session. Leave empty to show a "coming soon" placeholder instead.
const VIDEO_EMBED_URL = 'https://player.vimeo.com/video/1236544856?badge=0&autopause=0&player_id=0&app_id=58479';
const SESSION_DATE = 'Every Tuesday · 12:00 PM EST';

const NUMBERS = ['Cost Savings', 'Cost Avoidance', 'Total Cost of Ownership', 'Savings Realization Rate', 'Vendor Risk Score'];

const ProcurementSessionWatch = () => {
  // Read after mount so the prerendered markup and first client render match.
  const [name, setName] = useState('');
  useEffect(() => {
    try {
      setName((new URLSearchParams(window.location.search).get('name') || '').trim().slice(0, 40));
    } catch {
      /* no greeting */
    }
  }, []);
  // Prerendered markup has no query string; the greeting fills in after hydration.
  const greeting = name ? `${name}, your session is ready` : 'Your session is ready';

  return (
    <>
      <Head>
        <title>Watch: The Five Numbers Procurement Lives By | Whyzer</title>
        <link rel="canonical" href="https://www.whyzer.ai/procurement-session-watch" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="25 minutes on the math behind every procurement decision." />
      </Head>
      <FunnelPage>
        {/* Player */}
        <section className="wzf-hero" style={{ textAlign: 'left', padding: '64px 0 80px' }}>
          <div className="wzf-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
              <span className="ps-eyebrow">{greeting}</span>
              <h1 className="ps-h1" style={{ fontSize: 'clamp(36px, 4.6vw, 52px)' }}>The Five Numbers Procurement Lives By</h1>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, lineHeight: 1.45, color: '#55556B', margin: 0, maxWidth: '52ch' }}>
                25 minutes on the math behind every procurement decision.
              </p>
            </div>
            <div className="ps-player">
              {VIDEO_EMBED_URL ? (
                <iframe
                  src={VIDEO_EMBED_URL}
                  title="The Five Numbers Procurement Lives By"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#F9FAFC' }}>
                  <span style={{ width: 88, height: 88, borderRadius: 9999, background: '#6262e9', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                  <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, color: '#8F8FD0' }}>Video coming soon · 25:00</span>
                </div>
              )}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 28px', display: VIDEO_EMBED_URL ? 'none' : 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid rgba(255,255,255,.1)', color: '#B9B9E8', fontSize: 14 }}>
                <span>The Five Numbers Procurement Lives By</span>
                <span>Jamal Reimer</span>
              </div>
            </div>
          </div>
        </section>

        {/* In this session */}
        <section className="wzf-wrap" style={{ padding: '96px 32px', display: 'flex', flexWrap: 'wrap', gap: '48px 64px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span className="ps-eyebrow ps-eyebrow--muted">In this session</span>
            <h2 className="ps-h2" style={{ fontSize: 36, textWrap: 'balance' }}>Is this a good place to put the company's money?</h2>
            <p style={{ margin: 0, color: '#55556B', maxWidth: '46ch', textWrap: 'pretty' }}>
              Procurement joins the deal and the first question is about price. The question underneath is bigger. These are the five numbers procurement uses to answer it.
            </p>
          </div>
          <ol style={{ flex: '1 1 380px', listStyle: 'none', margin: 0, padding: 0 }}>
            {NUMBERS.map((t, i) => (
              <li key={t} style={{ display: 'flex', alignItems: 'baseline', gap: 20, padding: '16px 0', borderTop: '1px solid #E4E3F0' }}>
                <span className="ps-num-n" style={{ fontSize: 14, width: 28, flex: 'none', padding: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, lineHeight: 1.3 }}>{t}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* The test */}
        <section className="wzf-wrap" style={{ padding: '0 32px 96px' }}>
          <div className="ps-band" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
            <span style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>The move that ties all five together</span>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 3.6vw, 40px)', lineHeight: 1.15, letterSpacing: '-.02em', margin: 0, maxWidth: '24ch', textWrap: 'balance' }}>
              Bring procurement the first draft. Then remove your logo.
            </p>
            <p style={{ margin: 0, fontSize: 18, maxWidth: '48ch' }}>Would it still hold up?</p>
          </div>
        </section>

        {/* Assignment */}
        <section className="wzf-wrap" style={{ padding: '0 32px 96px', display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '60ch' }}>
            <span className="ps-eyebrow ps-eyebrow--muted">Your next step</span>
            <h2 className="ps-h2">Now put it on a live deal</h2>
            <p style={{ margin: 0, color: '#55556B', textWrap: 'pretty' }}>
              On Tuesdays I'll review submissions live in Deal Coaching and walk through how I'd handle that procurement conversation myself. The goal is to get you out of the discount conversation and into the one where you help them approve a bigger investment.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
            <div className="ps-step">
              <span className="ps-step-n">Step 1</span>
              <h3>Send your deal</h3>
              <p>Pick one deal that's entering procurement or about to. Build out at least three of the five metrics and send your slides.</p>
              <a href="mailto:info@whyzer.ai" style={{ fontWeight: 500 }}>info@whyzer.ai</a>
            </div>
            <div className="ps-step ps-step--feat">
              <span className="ps-step-n">Step 2</span>
              <h3>Start your free trial</h3>
              <p>Live Deal Coaching is part of Whyzer Elite. Your 14-day free trial includes full access, the Tuesday sessions included.</p>
              <a href="/#pricing-monthly" className="ps-btn ps-btn--primary ps-btn--full">Start your free trial</a>
            </div>
            <div className="ps-step">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span className="ps-step-n">Step 3</span>
                <span className="wz-badge wz-badge--accent wz-badge--sm" style={{ background: '#EEEEFC', color: '#2a2665', borderRadius: 9999, padding: '4px 12px', fontSize: 13 }}>Live</span>
              </div>
              <h3>Join me Tuesdays</h3>
              <p>
                Deal Coaching{SESSION_DATE ? <><br /><span style={{ fontFamily: 'ui-monospace, Menlo, monospace', color: '#14141F', fontSize: 14 }}>{SESSION_DATE}</span></> : null}
              </p>
              <p style={{ flex: 'none', color: '#14141F', fontWeight: 500 }}>Save your seat when you become a Whyzer member.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 32, borderTop: '1px solid #E4E3F0' }}>
            <span style={{ flex: 'none', width: 48, height: 48, borderRadius: 9999, background: '#EEEEFC', color: '#2a2665', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16 }}>JR</span>
            <p style={{ margin: 0, fontSize: 14, color: '#55556B', maxWidth: '72ch', textWrap: 'pretty' }}>
              See you there. — Jamal Reimer closed $160M+ in enterprise SaaS as an individual contributor and wrote Mega Deal Secrets. He now coaches sellers through seven- and eight-figure deals.
            </p>
          </div>
        </section>
      </FunnelPage>
    </>
  );
};

export default ProcurementSessionWatch;

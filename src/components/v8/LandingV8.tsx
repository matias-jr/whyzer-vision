import { useState } from 'react';
import {
  TOUR_TABS, TOUR_CAPTIONS, QUOTE_SETS, MARQUEE_CHIPS, FAQ_GROUPS,
  GAUGE_TIERS, VIDEOS, PROOF_STATS,
} from './data';
import {
  useReveal, useCountUp, useTour, useHeroDemo, useExitIntent, useMediaQuery,
  useGauge, useVideoCarousel,
} from './hooks';
import './v8.css';

const CHECKOUT = 'https://subscribe.whyzer.ai';

/** Wraps a block so it fades up the first time it scrolls into view. */
function Reveal({ className = '', children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`wz8-reveal ${shown ? 'is-in' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

function Stat({ value, prefix = '', suffix = '', label, staticText }: {
  value: number; prefix?: string; suffix?: string; label: string; staticText?: string;
}) {
  const { ref, text } = useCountUp(value, prefix, suffix);
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={ref}
        style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, fontWeight: 700,
          color: 'var(--wz-brand)', fontVariantNumeric: 'tabular-nums',
        }}
      >
        {staticText ?? text}
      </div>
      <div style={{ fontSize: 13, color: 'var(--wz-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Check() {
  return (
    <span style={{
      width: 20, height: 20, borderRadius: 6, background: '#EEEEFC', color: 'var(--wz-brand-dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
      fontWeight: 700, flexShrink: 0, marginTop: 1,
    }}>✓</span>
  );
}

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Check />
      <div>
        <b style={{ fontSize: 14, display: 'block' }}>{title}</b>
        <span style={{ fontSize: 13, color: 'var(--wz-muted)' }}>{body}</span>
      </div>
    </div>
  );
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(242,241,251,.9)', borderLeft: '3px solid var(--wz-brand)',
      borderRadius: '0 10px 10px 0', padding: '12px 16px', fontSize: 13, color: 'var(--wz-muted)',
    }}>
      <b style={{ color: 'var(--wz-ink)' }}>{label}</b> {children}
    </div>
  );
}

/** One of the three alternating Research / Write / Position feature blocks. */
function Feature({ tag, title, body, bullets, callout, img, alt, chrome, flip }: {
  tag: string; title: string; body: string;
  bullets: Array<{ title: string; body: string }>;
  callout: { label: string; text: string };
  img: string; alt: string; chrome: string; flip?: boolean;
}) {
  const media = (
    <div className="wz8-media wz8-glass">
      <div className="wz8-chrome">
        <span className="wz8-dot" /><span className="wz8-dot" />
        <span style={{ fontSize: 10.5, color: 'var(--wz-soft)', marginLeft: 6 }}>{chrome}</span>
      </div>
      <img src={img} alt={alt} loading="lazy" width={1600} style={{ width: '100%' }} />
    </div>
  );
  const copy = (
    <div>
      <div style={{
        display: 'inline-block', background: 'var(--wz-night)', color: '#fff', fontSize: 11.5,
        fontWeight: 700, padding: '5px 12px', borderRadius: 100, marginBottom: 14,
      }}>{tag}</div>
      <h3 style={{ fontSize: 26, marginBottom: 10, lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: 14.5, color: 'var(--wz-muted)', marginBottom: 22 }}>{body}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
        {bullets.map((b) => <Bullet key={b.title} {...b} />)}
      </div>
      <Callout label={callout.label}>{callout.text}</Callout>
    </div>
  );
  return (
    <Reveal
      className={`wz8-split ${flip ? 'wz8-split-rev' : ''}`}
      style={{ marginBottom: 84 }}
    >
      {flip ? <>{media}{copy}</> : <>{copy}{media}</>}
    </Reveal>
  );
}

export default function LandingV8() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const motionOk = !reduced;

  const { tab, select } = useTour(TOUR_TABS.length, motionOk);
  const hero = useHeroDemo(motionOk);
  const exit = useExitIntent(motionOk);
  const [qi, setQi] = useState(0);
  const [annual, setAnnual] = useState(false);
  const gauge = useGauge(GAUGE_TIERS.length, motionOk);
  // Both queries run unconditionally; the carousel shows one card on phones,
  // two on tablets, three on desktop, matching the CSS flex-basis breakpoints.
  const isPhone = useMediaQuery('(max-width: 620px)');
  const isTablet = useMediaQuery('(max-width: 980px)');
  const perPage = isPhone ? 1 : isTablet ? 2 : 3;
  const vid = useVideoCarousel(VIDEOS.length, perPage);

  const quotes = QUOTE_SETS[qi];
  const price = { premium: annual ? '$47' : '$57', elite: annual ? '$83' : '$97' };
  const note = {
    premium: annual ? '$567/year, billed annually' : '$684/year if you stay monthly',
    elite: annual ? '$997/year, billed annually' : '$1,164/year if you stay monthly',
  };
  const ctaLabel = annual ? 'Get annual access' : 'Start your free trial';

  return (
    <div className="wz8">
      {/* ---------------- nav ---------------- */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 60, background: 'rgba(9,17,39,.72)',
        backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <div className="wz8-shell" style={{
          padding: '14px 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center' }} aria-label="Whyzer home">
            <img src="/v8/whyzer-logo-white.png" alt="Whyzer" width={104} height={26} style={{ height: 26, width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div className="wz8-nav-links" style={{ display: 'flex', gap: 26 }}>
              <a className="wz8-navlink" href="#tour">Product tour</a>
              <a className="wz8-navlink" href="#features">Features</a>
              <a className="wz8-navlink" href="#value">Why Whyzer</a>
              <a className="wz8-navlink" href="#pricing">Pricing</a>
              <a className="wz8-navlink" href="#elite">Elite</a>
            </div>
            <a className="wz8-navlink" href={CHECKOUT}>Log in</a>
            <a href={CHECKOUT} className="wz8-btn wz8-btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
              Start your free trial
            </a>
          </div>
        </div>
      </nav>

      {/* ---------------- hero ---------------- */}
      <header style={{
        position: 'relative', overflow: 'hidden', padding: '60px 0 56px',
        background: 'radial-gradient(ellipse 900px 620px at 78% 8%, rgba(191,224,253,.55), transparent 62%), radial-gradient(ellipse 820px 560px at 12% 90%, rgba(141,93,184,.28), transparent 60%), #FAFAF9',
      }}>
        <div className="wz8-drift" aria-hidden="true" style={{
          position: 'absolute', top: -90, right: -60, width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(98,98,233,.18), transparent 70%)',
        }} />
        <div className="wz8-shell wz8-hero-grid" style={{ position: 'relative' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.66)',
              backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.8)', color: 'var(--wz-brand-dark)',
              fontSize: 13, fontWeight: 600, padding: '7px 15px', borderRadius: 100, marginBottom: 20,
              boxShadow: '0 8px 24px -16px rgba(20,20,40,.4)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--wz-brand)' }} />
              Built by Jamal Reimer · $160M+ closed
            </div>
            <h1 style={{
              fontSize: 45, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-.015em',
              marginBottom: 18, textWrap: 'pretty',
            }}>
              Walk into any account already knowing what matters to them.
            </h1>
            <p style={{ fontSize: 16.5, color: 'var(--wz-muted)', maxWidth: 470, marginBottom: 26, textWrap: 'pretty' }}>
              Earnings calls, filings and exec priorities across 8,500+ companies — turned into a
              sourced, defensible point of view in under two minutes.
            </p>
            <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <a href={CHECKOUT} className="wz8-btn wz8-btn-primary">Start your free trial</a>
              <a href="#tour" className="wz8-btn wz8-btn-ghost" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 24px',
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#EEEEFC',
                  color: 'var(--wz-brand-dark)', display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 9,
                }}>▶</span>
                Watch the 90-second tour
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--wz-soft)', fontWeight: 500 }}>Trusted by AEs at</span>
              {['MSFT', 'ORCL', 'SAP', 'SFDC', 'SNOW'].map((t) => (
                <span key={t} style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--wz-soft)',
                  background: 'rgba(242,241,251,.9)', padding: '5px 10px', borderRadius: 6,
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="wz8-glass">
              <div className="wz8-chrome">
                <span className="wz8-dot" /><span className="wz8-dot" /><span className="wz8-dot" />
                <div style={{
                  flex: 1, marginLeft: 8, background: 'rgba(242,241,251,.9)', borderRadius: 100,
                  padding: '4px 12px', fontSize: 10.5, color: 'var(--wz-soft)',
                }}>app.whyzer.ai/research</div>
              </div>
              <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden' }}>
                <img
                  src="/v8/app-home.png" alt="Whyzer home — company search" width={1600}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'top center',
                    transition: 'opacity .7s ease', opacity: hero.showResearch ? 0 : 1,
                  }}
                />
                <img
                  src="/v8/app-research.png" alt="Whyzer research view with fit score" width={1600}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'top left',
                    transition: 'opacity .7s ease', opacity: hero.showResearch ? 1 : 0,
                  }}
                />
                {!hero.showResearch && (
                  <div aria-hidden="true" style={{
                    position: 'absolute', left: '23%', top: '54%', width: '56%', height: 32,
                    borderRadius: 100, background: 'rgba(255,255,255,.96)',
                    border: '1px solid rgba(98,98,233,.45)', boxShadow: '0 8px 22px -12px rgba(98,98,233,.65)',
                    display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="10.5" cy="10.5" r="6.5" stroke="#8A8AA0" strokeWidth="2.2" />
                      <path d="M15.5 15.5L21 21" stroke="#8A8AA0" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--wz-ink)' }}>{hero.typed}</span>
                    <span className="wz8-blink" style={{ width: 1.5, height: 13, background: 'var(--wz-brand)' }} />
                  </div>
                )}
              </div>
            </div>

            <div className="wz8-hero-float wz8-float" style={{
              position: 'absolute', left: -26, top: 44, background: 'rgba(255,255,255,.78)',
              backdropFilter: 'blur(18px) saturate(170%)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,.9)', borderRadius: 14, padding: '14px 16px',
              boxShadow: '0 26px 50px -26px rgba(20,20,40,.45)', zIndex: 6,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: 'var(--wz-soft)',
                textTransform: 'uppercase', marginBottom: 8,
              }}>Opportunity score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'conic-gradient(#6262e9 0deg 302deg, #EDEDF7 302deg 360deg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14,
                  }}>4.2</div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>High confidence</div>
                  <div style={{ fontSize: 11, color: 'var(--wz-soft)' }}>Evidence: sourced</div>
                </div>
              </div>
            </div>

            <div className="wz8-hero-float" style={{
              position: 'absolute', right: -30, bottom: -58, width: 240, borderRadius: 14, padding: 15,
              background: 'rgba(9,17,39,.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 30px 56px -26px rgba(11,11,24,.75)', zIndex: 6,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7, fontSize: 10.5, fontWeight: 700,
                color: '#8F8FD0', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 11,
              }}>
                <span className="wz8-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#33D69F' }} />
                Live signals
              </div>
              <div style={{ fontSize: 12, color: '#DADAF2', paddingBottom: 8 }}>
                <b style={{ color: '#fff' }}>Supply constraints</b> flagged on Q1 call
                <div style={{ fontSize: 10, color: '#7B7BB8', marginTop: 2 }}>Earnings call · 2m ago</div>
              </div>
              <div style={{ fontSize: 12, color: '#DADAF2', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.09)' }}>
                <b style={{ color: '#fff' }}>New CFO</b> priorities disclosed
                <div style={{ fontSize: 10, color: '#7B7BB8', marginTop: 2 }}>10-K filing · 14m ago</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- proof bar + stats ---------------- */}
      <section style={{
        background: 'rgba(242,241,251,.85)', borderTop: '1px solid var(--wz-line)',
        borderBottom: '1px solid var(--wz-line)', padding: '24px 0',
      }}>
        <div className="wz8-shell" style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 600 }}>
          Danny H. closed <b style={{ color: 'var(--wz-brand-dark)' }}>$5.7M</b> this year —{' '}
          <b style={{ color: 'var(--wz-brand-dark)' }}>65%</b> traceable to Whyzer POVs.
        </div>
      </section>

      <section style={{ padding: '52px 0 12px' }}>
        <div className="wz8-shell wz8-stats">
          <Stat value={8500} suffix="+" label="Companies covered" />
          <Stat value={150} suffix="+" label="Global markets" />
          <Stat value={5} staticText="5×" label="Faster account prep" />
          <Stat value={160} prefix="$" suffix="M+" label="Closed by Jamal" />
        </div>
      </section>

      {/* ---------------- problem ---------------- */}
      <section style={{ padding: '64px 0 52px' }}>
        <div className="wz8-shell">
          <div style={{ maxWidth: 620, marginBottom: 22 }}>
            <div className="wz8-eyebrow">The problem</div>
            <h2 className="wz8-h2">The intelligence was always public. Nobody had time to read it.</h2>
            <p className="wz8-lede">
              It's in the earnings call. The 10-K. What the CFO says when an analyst asks the wrong
              question. Reading it properly takes three hours you don't have before a call you booked yesterday.
            </p>
          </div>
          <div style={{
            marginTop: 32, overflow: 'hidden', borderRadius: 14, border: '1px solid rgba(228,227,240,.9)',
            background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)', padding: '18px 0',
          }}>
            <div className="wz8-marquee">
              {/* Doubled so the -50% keyframe loops seamlessly. */}
              {[...MARQUEE_CHIPS, ...MARQUEE_CHIPS].map((c, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: c.found ? '#E7F7EF' : 'var(--wz-lilac)', borderRadius: 100,
                  padding: '8px 14px', fontSize: 12.5, fontWeight: 600,
                  color: 'var(--wz-muted)', whiteSpace: 'nowrap',
                }}>
                  <span style={{
                    background: c.found ? '#fff' : '#F7E9E8', color: c.found ? '#1F9D6B' : '#B3413F',
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, letterSpacing: '.03em',
                  }}>{c.found ? 'FOUND' : 'BURIED'}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- product tour ---------------- */}
      <section id="tour" style={{
        padding: '78px 0 88px',
        background: 'radial-gradient(ellipse 900px 500px at 20% 0%, rgba(191,224,253,.45), transparent 62%), #F2F1FB',
      }}>
        <div className="wz8-shell">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 34px' }}>
            <div className="wz8-eyebrow">Product tour</div>
            <h2 className="wz8-h2">This is the actual product. Watch it work.</h2>
            <p className="wz8-lede">
              Search a company, read the signal, map the deal, build the POV. Five screens, one workflow.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div role="tablist" aria-label="Product tour" style={{
              display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 22,
            }}>
              {TOUR_TABS.map((t, i) => (
                <button
                  key={t.label} role="tab" aria-selected={tab === i} aria-controls="wz8-tour-panel"
                  onClick={() => select(i)}
                  style={{
                    border: 0, fontFamily: 'inherit', cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                    padding: '10px 18px', borderRadius: 100, transition: 'all .3s ease',
                    background: tab === i ? 'var(--wz-brand)' : 'rgba(255,255,255,.72)',
                    color: tab === i ? '#fff' : 'var(--wz-muted)',
                    boxShadow: tab === i
                      ? '0 12px 26px -12px rgba(98,98,233,.8)'
                      : '0 6px 18px -14px rgba(20,20,40,.4)',
                  }}
                >{t.label}</button>
              ))}
            </div>

            <div className="wz8-glass" style={{ borderRadius: 18 }}>
              <div className="wz8-chrome" style={{ padding: '12px 16px' }}>
                <span className="wz8-dot" style={{ width: 10, height: 10 }} />
                <span className="wz8-dot" style={{ width: 10, height: 10 }} />
                <span className="wz8-dot" style={{ width: 10, height: 10 }} />
                <div style={{
                  flex: 1, marginLeft: 10, background: 'rgba(242,241,251,.9)', borderRadius: 100,
                  padding: '5px 14px', fontSize: 11, color: 'var(--wz-soft)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>app.whyzer.ai · NVIDIA CORP · selling Tableau</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 700,
                  color: 'var(--wz-brand-dark)', background: '#EEEEFC', padding: '4px 10px',
                  borderRadius: 100, flex: 'none',
                }}>
                  <span className="wz8-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#33D69F' }} />
                  LIVE DEMO
                </div>
              </div>
              <div id="wz8-tour-panel" style={{ overflow: 'hidden' }}>
                <div style={{
                  display: 'flex', width: '500%',
                  transition: 'transform .8s cubic-bezier(.5,0,.2,1)',
                  transform: `translateX(-${tab * 20}%)`,
                }}>
                  {TOUR_TABS.map((t, i) => (
                    <div key={t.label} style={{ flex: '0 0 20%' }}>
                      <img
                        src={t.img} alt={t.alt} width={1600}
                        loading={i === 0 ? undefined : 'lazy'}
                        style={{ width: '100%' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              marginTop: 20, minHeight: 24,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--wz-brand)', flex: 'none' }} />
              <div style={{ fontSize: 14, color: 'var(--wz-muted)', fontWeight: 500 }}>{TOUR_CAPTIONS[tab]}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- features ---------------- */}
      <section id="features" style={{ padding: '88px 0' }}>
        <div className="wz8-shell">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 56px' }}>
            <div className="wz8-eyebrow">Features</div>
            <h2 className="wz8-h2">Everything you need, none of it separate.</h2>
          </div>

          <Feature
            tag="Research"
            title="Know what keeps them up before you say a word."
            body="C-suite quotes, board priorities and investor communications — every claim labeled fact or inference, with the filing it came from."
            bullets={[
              { title: 'Executive intelligence', body: 'C-suite quotes and board priorities, sourced.' },
              { title: 'DealMaps', body: 'Everything the account cares about, visualized.' },
              { title: 'Account audio briefings', body: 'Every account, distilled for your commute.' },
            ]}
            callout={{ label: 'Discovery:', text: 'walk in with a hypothesis about their business, not a list of questions about yours.' }}
            img="/v8/app-dealmap.png"
            alt="DealMap mindmap of NVIDIA strategic and financial themes"
            chrome="DealMap · NVIDIA CORP"
          />

          <Feature
            flip
            tag="Write"
            title="The first email that doesn't sound like the last ten."
            body="Every exec gets messaging built around what they specifically said they care about — not a company-wide template."
            bullets={[
              { title: 'Conversation starters', body: 'Built per contact — a CFO opens differently than a VP of Ops.' },
              { title: 'Sequence builder', body: 'Multi-email sequences, each message advancing one argument.' },
            ]}
            callout={{ label: 'Executive outreach:', text: 'the email grounded in a real financial pressure is the one that gets a reply.' }}
            img="/v8/app-earnings.png"
            alt="Earnings call summary for Q1 2027 with key metrics"
            chrome="Earnings calls · Q1 2027"
          />

          <Feature
            tag="Position"
            title="A case built on their numbers survives the first question."
            body="Pick the POV, pick the executive, and turn the narrative into a deck, infographic or one-pager in one pass."
            bullets={[
              { title: 'Scored POV dossiers', body: "Opportunity score, evidence level and the strategist's summary." },
              { title: 'Decks & infographics', body: 'What used to take a designer three days now takes one pass.' },
            ]}
            callout={{ label: 'Business case:', text: "a case built on their numbers survives the CFO's first question." }}
            img="/v8/app-povstudio.png"
            alt="POV Studio dossier: financial pressure POV with opportunity score 4.2"
            chrome="POV Studio · Dossier"
          />
        </div>
      </section>

      {/* ---------------- why whyzer / gauge ---------------- */}
      <section id="value" style={{
        padding: '86px 0', background: 'var(--wz-night)',
        backgroundImage: 'radial-gradient(ellipse 720px 460px at 14% 92%, rgba(99,73,198,.5), transparent 64%), radial-gradient(ellipse 620px 460px at 88% 4%, rgba(22,105,143,.42), transparent 64%)',
        color: '#fff',
      }}>
        <div className="wz8-shell">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 44px' }}>
            <div className="wz8-eyebrow wz8-eyebrow-dark">Why Whyzer</div>
            <h2 className="wz8-h2" style={{ fontSize: 32, color: '#fff' }}>
              5× faster account prep, without the enterprise price tag.
            </h2>
            <p className="wz8-lede" style={{ color: '#B9B9E8' }}>
              Everyone has the same public data. The question is what it costs you to make it usable.
            </p>
          </div>

          <div className="wz8-value-grid">
            <div style={{
              position: 'relative', borderRadius: 20, padding: '34px 30px 26px',
              background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(18px) saturate(150%)',
              WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,.14)',
              boxShadow: '0 40px 80px -40px rgba(0,0,0,.6)',
            }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 430, margin: '0 auto' }}>
                <svg viewBox="0 0 400 226" style={{ width: '100%', display: 'block', overflow: 'visible' }}
                  role="img"
                  aria-label="Pricing gauge: generic AI at $0, Whyzer at $47 per month, enterprise tools at $44,000 per year">
                  <defs>
                    <linearGradient id="wzArcL" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#5C6178" /><stop offset="1" stopColor="#7C7FA0" />
                    </linearGradient>
                    <linearGradient id="wzArcM" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#8C87F0" /><stop offset="1" stopColor="#6262e9" />
                    </linearGradient>
                    <linearGradient id="wzArcR" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#9A5A82" /><stop offset="1" stopColor="#B3413F" />
                    </linearGradient>
                  </defs>
                  <path d="M30 200 A170 170 0 0 1 96 68" fill="none" stroke="url(#wzArcL)" strokeWidth="22" strokeLinecap="round" />
                  <path d="M118 52 A170 170 0 0 1 282 52" fill="none" stroke="url(#wzArcM)" strokeWidth="26" strokeLinecap="round" />
                  <path d="M304 68 A170 170 0 0 1 370 200" fill="none" stroke="url(#wzArcR)" strokeWidth="22" strokeLinecap="round" />
                  <text x="30" y="222" fill="#8F8FD0" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700">$20 / mo</text>
                  <text x="318" y="222" fill="#8F8FD0" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700">$44K / yr</text>
                  <g style={{
                    transformOrigin: '200px 200px',
                    transition: 'transform 1.15s cubic-bezier(.34,1.06,.32,1)',
                    transform: `rotate(${GAUGE_TIERS[gauge.tier].deg}deg)`,
                  }}>
                    <path d="M200 200 L200 62" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="200" cy="200" r="13" fill="#fff" />
                    <circle cx="200" cy="200" r="6" fill={GAUGE_TIERS[gauge.tier].hub} />
                  </g>
                </svg>
                <div style={{ textAlign: 'center', marginTop: -6 }}>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 56, fontWeight: 700,
                    lineHeight: 1, transition: 'color .5s ease', color: GAUGE_TIERS[gauge.tier].color,
                  }}>
                    {GAUGE_TIERS[gauge.tier].amount}
                    <span style={{ fontSize: 17, color: '#8F8FD0', fontWeight: 500 }}> {GAUGE_TIERS[gauge.tier].unit}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#B9B9E8', marginTop: 8, minHeight: 38 }}>
                    {GAUGE_TIERS[gauge.tier].caption}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {GAUGE_TIERS.map((row, i) => {
                const on = gauge.tier === i;
                const mid = i === 1;
                return (
                  <button
                    key={row.key}
                    className="wz8-tier"
                    aria-pressed={on}
                    onClick={() => gauge.select(i)}
                    style={{
                      background: on
                        ? (mid ? 'rgba(98,98,233,.24)' : 'rgba(255,255,255,.11)')
                        : (mid ? 'rgba(98,98,233,.14)' : 'rgba(255,255,255,.05)'),
                      border: `1px solid ${on
                        ? (mid ? 'rgba(150,145,255,.85)' : 'rgba(255,255,255,.32)')
                        : (mid ? 'rgba(140,135,240,.4)' : 'rgba(255,255,255,.1)')}`,
                      boxShadow: on
                        ? (mid ? '0 26px 54px -22px rgba(98,98,233,.85)' : '0 22px 46px -26px rgba(0,0,0,.7)')
                        : 'none',
                      transform: on ? 'translateX(-6px)' : 'translateX(0)',
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                      gap: 12, marginBottom: 8, flexWrap: 'wrap',
                    }}>
                      <div style={{
                        fontSize: 11.5, fontWeight: 700, letterSpacing: '.05em',
                        textTransform: 'uppercase', color: mid ? '#C9C6FF' : '#8F8FD0',
                      }}>{row.key}</div>
                      <div style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700,
                        color: mid ? '#fff' : '#DADAF2',
                      }}>
                        {mid ? '$57' : row.key === 'Generic AI' ? 'Free–$20' : '$44,000'}
                        <span style={{ fontSize: 12, color: mid ? '#C9C6FF' : '#8F8FD0', fontWeight: 500 }}>
                          {mid ? ' /seat/mo' : row.key === 'Generic AI' ? ' /mo' : ' /yr'}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13.5, color: mid ? '#E4E3FF' : '#B9B9E8' }}>
                      {mid ? (
                        <>
                          Same earnings-call intelligence, sourced and fact-labeled.{' '}
                          <b style={{ color: '#fff' }}>5× faster prep</b>, no contract, no demo,
                          no approval cycle — start today.
                        </>
                      ) : row.body}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- testimonials ---------------- */}
      <section style={{ padding: '88px 0' }}>
        <div className="wz8-shell">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 40px' }}>
            <div className="wz8-eyebrow">Proof</div>
            <h2 className="wz8-h2">Don't take our word for it.</h2>
          </div>

          {/* Video testimonials. Cards are buttons so the lightbox is keyboard
              reachable; the track is paged rather than wrapped. */}
          <div style={{
            borderRadius: 20, padding: 36, marginBottom: 28, background: 'var(--wz-night)',
            backgroundImage: 'radial-gradient(ellipse 420px 300px at 14% 86%, rgba(99,73,198,.5), transparent 66%), radial-gradient(ellipse 350px 280px at 90% 8%, rgba(22,105,143,.45), transparent 66%)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              gap: 16, marginBottom: 22, flexWrap: 'wrap',
            }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: 24, lineHeight: 1.2, marginBottom: 8, textWrap: 'pretty' }}>
                  Hear it from the reps carrying the quota.
                </h3>
                <p style={{ fontSize: 13.5, color: '#B9B9E8' }}>
                  Unscripted, 60–90 seconds each. Pick one and press play.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="wz8-vnav" aria-label="Previous videos" onClick={vid.prev}>←</button>
                <div style={{
                  fontSize: 12, color: '#8F8FD0', fontVariantNumeric: 'tabular-nums',
                  minWidth: 52, textAlign: 'center',
                }}>{vid.page + 1} / {vid.pages}</div>
                <button className="wz8-vnav" aria-label="Next videos" onClick={vid.next}>→</button>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div
                className="wz8-vtrack"
                style={{ transform: `translateX(calc(${-vid.page} * ((100% - ${(perPage - 1) * 18}px) / ${perPage} + 18px)))` }}
              >
                {VIDEOS.map((v) => (
                  <button key={v.i} className="wz8-vcard" onClick={() => vid.setOpen(v.i)}>
                    <div style={{
                      position: 'relative', aspectRatio: '16 / 10', background: v.poster,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,.94)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 14px 32px -12px rgba(0,0,0,.7)',
                      }}>
                        <span style={{ color: 'var(--wz-ink)', fontSize: 16, marginLeft: 3 }}>▶</span>
                      </span>
                      <span style={{
                        position: 'absolute', bottom: 10, right: 10, fontSize: 10.5, fontWeight: 700,
                        color: '#fff', background: 'rgba(11,11,24,.72)', padding: '3px 8px', borderRadius: 6,
                      }}>{v.length}</span>
                    </div>
                    <div style={{ padding: '16px 18px 18px' }}>
                      <div style={{
                        fontSize: 13.5, color: '#DADAF2', lineHeight: 1.5, marginBottom: 12,
                        minHeight: 60, textWrap: 'pretty',
                      }}>“{v.quote}”</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{v.name}</div>
                      <div style={{ fontSize: 11.5, color: '#8F8FD0' }}>{v.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="wz8-proof-stats">
            {PROOF_STATS.map((st) => (
              <div key={st.v} style={{
                textAlign: 'center', background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,.9)', borderRadius: 16, padding: 24,
                boxShadow: '0 26px 54px -34px rgba(20,20,40,.34)',
              }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700,
                  color: 'var(--wz-brand-dark)',
                }}>{st.v}</div>
                <div style={{
                  fontSize: 12, color: 'var(--wz-muted)', textTransform: 'uppercase',
                  letterSpacing: '.04em', marginTop: 4,
                }}>{st.l}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, marginBottom: 20, flexWrap: 'wrap',
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--wz-soft)',
              textTransform: 'uppercase', letterSpacing: '.05em',
            }}>What elite sellers say</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                aria-label="Previous testimonials"
                onClick={() => setQi((i) => (i - 1 + QUOTE_SETS.length) % QUOTE_SETS.length)}
                style={{
                  width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--wz-line)',
                  background: '#fff', cursor: 'pointer', fontSize: 14, color: 'var(--wz-muted)',
                }}
              >←</button>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                {QUOTE_SETS.map((_, i) => (
                  <span key={i} style={{
                    width: 22, height: 6, borderRadius: 100, transition: 'background .3s ease',
                    background: qi === i ? 'var(--wz-brand)' : 'var(--wz-line)',
                  }} />
                ))}
              </div>
              <button
                aria-label="Next testimonials"
                onClick={() => setQi((i) => (i + 1) % QUOTE_SETS.length)}
                style={{
                  width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--wz-line)',
                  background: '#fff', cursor: 'pointer', fontSize: 14, color: 'var(--wz-muted)',
                }}
              >→</button>
            </div>
          </div>

          <div className="wz8-three">
            {[
              { label: 'The product', color: '#4a4ad1', bg: '#EEEEFC' },
              { label: 'The results', color: '#1F9D6B', bg: '#E7F7EF' },
              { label: 'The value', color: '#8A5A1F', bg: '#FBF1E4' },
            ].map((meta, i) => (
              <div key={meta.label} style={{
                background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,.9)', borderRadius: 16, padding: 26,
                boxShadow: '0 26px 54px -34px rgba(20,20,40,.34)', display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
                  color: meta.color, background: meta.bg, alignSelf: 'flex-start',
                  padding: '5px 11px', borderRadius: 100, marginBottom: 16,
                }}>{meta.label}</div>
                <p style={{ fontSize: 14.5, color: 'var(--wz-ink)', lineHeight: 1.6, flex: 1, textWrap: 'pretty' }}>
                  “{quotes[i].q}”
                </p>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 16 }}>
                  {quotes[i].n}
                  <span style={{ display: 'block', fontWeight: 500, fontSize: 12, color: 'var(--wz-soft)' }}>
                    {quotes[i].r}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- elite ---------------- */}
      <section id="elite" style={{
        padding: '88px 0', background: 'var(--wz-night)',
        backgroundImage: 'radial-gradient(ellipse 700px 450px at 10% 90%, rgba(99,73,198,.45), transparent 65%), radial-gradient(ellipse 600px 450px at 92% 5%, rgba(22,105,143,.4), transparent 65%)',
        color: '#fff',
      }}>
        <div className="wz8-shell">
          <div style={{ maxWidth: 660, marginBottom: 20 }}>
            <div className="wz8-eyebrow wz8-eyebrow-dark">Whyzer Elite</div>
            <h2 className="wz8-h2" style={{ fontSize: 32, color: '#fff' }}>
              Premium builds your argument. Elite makes sure you know what to do with it.
            </h2>
            <p className="wz8-lede" style={{ color: '#B9B9E8' }}>
              A POV gets you in the door. The multi-threading, the stall at legal, the champion who
              goes quiet — that's deal-cycle work. It's what Jamal spent two decades learning before
              he built a platform around it.
            </p>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.07)',
            border: '1px solid rgba(255,255,255,.14)', borderRadius: 100, padding: '8px 8px 8px 18px',
            marginBottom: 40, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 13, color: '#B9B9E8' }}>Premium $47 → Elite $97</span>
            <span style={{
              background: 'var(--wz-brand)', color: '#fff', fontSize: 12, fontWeight: 700,
              padding: '6px 14px', borderRadius: 100,
            }}>+$50 buys three things you can't buy anywhere else</span>
          </div>

          <div className="wz8-three">
            {/* Weekly Deal Coaching */}
            <Reveal style={{
              borderRadius: 18, overflow: 'hidden', background: 'rgba(255,255,255,.06)',
              backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 34px 70px -38px rgba(0,0,0,.7)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '24px 24px 18px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '.05em', textTransform: 'uppercase', color: '#FFB4B4',
                  background: 'rgba(179,65,63,.22)', padding: '5px 11px', borderRadius: 100, marginBottom: 14,
                }}>
                  <span className="wz8-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B6B' }} />
                  Live weekly
                </div>
                <h4 style={{ fontSize: 18, marginBottom: 8 }}>Weekly Deal Coaching</h4>
                <p style={{ fontSize: 13, color: '#9C9CE0' }}>
                  Bring a real deal. Jamal works it with you, live, in front of the room.
                </p>
              </div>
              <div style={{
                margin: '0 16px 16px', borderRadius: 12, background: 'rgba(9,17,39,.6)',
                border: '1px solid rgba(255,255,255,.1)', padding: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Thursday · 11:00 PT</div>
                  <div style={{
                    fontSize: 9.5, fontWeight: 700, color: '#33D69F',
                    background: 'rgba(51,214,159,.14)', padding: '3px 8px', borderRadius: 100,
                  }}>ON NOW</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  {[
                    { t: 'JR', bg: '#6262e9' }, { t: 'DH', bg: '#3E7CA8' },
                    { t: 'KG', bg: '#7A5AA8' }, { t: '+31', bg: 'rgba(255,255,255,.12)' },
                  ].map((a, i) => (
                    <span key={a.t} style={{
                      width: 26, height: 26, borderRadius: '50%', background: a.bg,
                      color: a.t === '+31' ? '#DADAF2' : '#fff', fontSize: a.t === '+31' ? 9 : 10,
                      fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid #0B0B18', marginLeft: i === 0 ? 0 : -8, flex: 'none',
                    }}>{a.t}</span>
                  ))}
                  <span style={{ fontSize: 10.5, color: '#7B7BB8', marginLeft: 10 }}>34 sellers in the room</span>
                </div>
                <div style={{ fontSize: 11, color: '#DADAF2', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  On the board now: <b style={{ color: '#fff' }}>$1.4M renewal stalled at legal</b>
                </div>
                <div style={{ fontSize: 11, color: '#8F8FD0', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  Up next: multi-threading past a silent champion
                </div>
              </div>
            </Reveal>

            {/* The Vault */}
            <Reveal style={{
              borderRadius: 18, overflow: 'hidden', background: 'rgba(255,255,255,.06)',
              backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 34px 70px -38px rgba(0,0,0,.7)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '24px 24px 18px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '.05em', textTransform: 'uppercase', color: '#C9C6FF',
                  background: 'rgba(98,98,233,.22)', padding: '5px 11px', borderRadius: 100, marginBottom: 14,
                }}>◆ 22 modules</div>
                <h4 style={{ fontSize: 18, marginBottom: 8 }}>The Vault</h4>
                <p style={{ fontSize: 13, color: '#9C9CE0' }}>
                  Jamal's complete methodology for closing seven- and eight-figure deals.
                </p>
              </div>
              <div style={{
                margin: '0 16px 16px', borderRadius: 12, background: 'rgba(9,17,39,.6)',
                border: '1px solid rgba(255,255,255,.1)', padding: 14,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: 10.5, color: '#7B7BB8', marginBottom: 10,
                }}>
                  <span>YOUR PROGRESS</span><span style={{ color: '#fff', fontWeight: 700 }}>7 / 22</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 100, background: 'rgba(255,255,255,.1)',
                  marginBottom: 14, overflow: 'hidden',
                }}>
                  <div style={{ width: '32%', height: '100%', borderRadius: 100, background: 'linear-gradient(90deg,#8C87F0,#6262e9)' }} />
                </div>
                {[
                  { t: 'Mega Deal anatomy', v: 'DONE', c: '#33D69F', tc: '#DADAF2' },
                  { t: 'Executive access plays', v: '18 MIN', c: '#C9C6FF', tc: '#fff' },
                  { t: 'Pricing the sole-source deal', v: '24 MIN', c: '#8F8FD0', tc: '#8F8FD0' },
                  { t: 'Closing through procurement', v: '31 MIN', c: '#8F8FD0', tc: '#8F8FD0' },
                ].map((m) => (
                  <div key={m.t} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 11.5, color: m.tc, padding: '8px 0', gap: 10,
                    borderTop: '1px solid rgba(255,255,255,.08)',
                  }}>
                    <span>{m.t}</span>
                    <span style={{ color: m.c, fontSize: 10, fontWeight: 700, flex: 'none' }}>{m.v}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Academy */}
            <Reveal style={{
              borderRadius: 18, overflow: 'hidden', background: 'rgba(255,255,255,.06)',
              backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 34px 70px -38px rgba(0,0,0,.7)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '24px 24px 18px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '.05em', textTransform: 'uppercase', color: '#BFE0FD',
                  background: 'rgba(22,105,143,.28)', padding: '5px 11px', borderRadius: 100, marginBottom: 14,
                }}>◈ Monthly live</div>
                <h4 style={{ fontSize: 18, marginBottom: 8 }}>Whyzer Academy</h4>
                <p style={{ fontSize: 13, color: '#9C9CE0' }}>
                  Four courses, live sessions monthly — from financial fluency to executive outreach.
                </p>
              </div>
              <div style={{
                margin: '0 16px 16px', borderRadius: 12, background: 'rgba(9,17,39,.6)',
                border: '1px solid rgba(255,255,255,.1)', padding: 14,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {[
                    { t: 'Pipeline Flywheel', w: '80%' }, { t: 'Executive Outreach', w: '45%' },
                    { t: 'Financial Fluency', w: '60%' }, { t: 'MDA Masterclass', w: '20%' },
                  ].map((c) => (
                    <div key={c.t} style={{ borderRadius: 9, background: 'rgba(255,255,255,.06)', padding: 10 }}>
                      <div style={{ fontSize: 10.5, color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>{c.t}</div>
                      <div style={{
                        height: 4, borderRadius: 100, background: 'rgba(255,255,255,.12)',
                        marginTop: 8, overflow: 'hidden',
                      }}>
                        <div style={{ width: c.w, height: '100%', background: 'var(--wz-brand)' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#DADAF2',
                  paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.08)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#BFE0FD', flex: 'none' }} />
                  Next live session: <b style={{ color: '#fff' }}>22 Sept — reading a 10-K in 20 minutes</b>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="wz8-elite-strip" style={{
            marginTop: 22, borderRadius: 16, background: 'rgba(255,255,255,.05)',
            border: '1px solid rgba(255,255,255,.12)', padding: '22px 24px',
          }}>
            {[
              { t: 'Unlimited AI', b: 'Research, Write and Position with no ceiling.' },
              { t: 'Coach Jamal', b: '24/7 AI mentor trained on $200M+ in closed deals.' },
              { t: 'Unlimited dossiers', b: 'Every account, every quarter, no monthly cap.' },
              { t: 'Unlimited podcasts', b: 'Briefings for every account you touch.' },
            ].map((c) => (
              <div key={c.t}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#8F8FD0', textTransform: 'uppercase',
                  letterSpacing: '.05em', marginBottom: 6,
                }}>{c.t}</div>
                <div style={{ fontSize: 13, color: '#DADAF2' }}>{c.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- pricing ---------------- */}
      <section id="pricing" style={{ padding: '88px 0' }}>
        <div className="wz8-shell">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
            <div className="wz8-eyebrow">Pricing</div>
            <h2 className="wz8-h2">Less than one lost deal.</h2>
            <p className="wz8-lede">
              Premium gets you the full research platform. Elite adds Jamal's entire methodology on
              top — that's the difference.
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
            margin: '34px 0 8px', flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                background: 'none', border: 0, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
                cursor: 'pointer', color: annual ? 'var(--wz-soft)' : 'var(--wz-ink)',
              }}
            >Monthly</button>
            <button
              role="switch" aria-checked={annual} aria-label="Toggle annual billing"
              onClick={() => setAnnual((a) => !a)}
              style={{
                width: 48, height: 27, border: 0, background: 'var(--wz-brand)', borderRadius: 100,
                position: 'relative', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, width: 21, height: 21, background: '#fff',
                borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                transition: 'left .22s ease', left: annual ? 24 : 3,
              }} />
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                background: 'none', border: 0, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                color: annual ? 'var(--wz-ink)' : 'var(--wz-soft)',
              }}
            >
              Annual
              <span style={{
                background: '#E7F7EF', color: '#1F9D6B', fontSize: 11, fontWeight: 700,
                padding: '3px 9px', borderRadius: 100,
              }}>Save up to 17%</span>
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--wz-soft)' }}>
            Monthly plans include a 14-day free trial. Annual plans are billed in full at signup.
          </div>

          <div className="wz8-price-grid">
            {/* Premium */}
            <div style={{
              background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(228,227,240,.9)', borderRadius: 18, padding: 30,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: 'var(--wz-soft)',
                background: 'var(--wz-lilac)', alignSelf: 'flex-start', padding: '5px 11px',
                borderRadius: 100, marginBottom: 12,
              }}>STARTER</div>
              <h4 style={{ fontSize: 17, marginBottom: 4 }}>Whyzer Premium</h4>
              <div style={{ fontSize: 13, color: 'var(--wz-soft)' }}>The full research platform.</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '18px 0 4px' }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 64, fontWeight: 700,
                  lineHeight: .92, letterSpacing: '-.02em',
                }}>{price.premium}</span>
                <span style={{ fontSize: 14, color: 'var(--wz-soft)', fontWeight: 500 }}>/seat/mo</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--wz-soft)' }}>{note.premium}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '22px 0', flex: 1 }}>
                {[
                  'Unlimited company reports', 'Add up to 30 companies/month', 'Unlimited DealMaps',
                  '2 Whyzer & Jamal podcasts/month', '2 Executive POV dossiers',
                  'Email campaign generator', 'Chat with WhyzerAI',
                ].map((f) => (
                  <div key={f} style={{ fontSize: 13, color: 'var(--wz-muted)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--wz-brand)', fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href={CHECKOUT} className="wz8-btn wz8-btn-outline">{ctaLabel}</a>
            </div>

            {/* Elite */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(238,238,252,.9), rgba(255,255,255,.85))',
              backdropFilter: 'blur(18px)', border: '1.5px solid var(--wz-brand)', borderRadius: 18,
              padding: '32px 30px', display: 'flex', flexDirection: 'column',
              boxShadow: '0 30px 70px -34px rgba(98,98,233,.55)', overflow: 'hidden',
            }}>
              <span className="wz8-shine" aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0, width: 70, height: 118,
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', top: -13, left: 30, background: 'var(--wz-brand)', color: '#fff',
                fontSize: 11, fontWeight: 700, padding: '5px 13px', borderRadius: 100,
              }}>Most popular</div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: 'var(--wz-brand-dark)',
                background: '#fff', alignSelf: 'flex-start', padding: '5px 11px',
                borderRadius: 100, marginBottom: 12,
              }}>FULL ACCESS</div>
              <h4 style={{ fontSize: 17, marginBottom: 4 }}>Whyzer Elite</h4>
              <div style={{ fontSize: 13, color: 'var(--wz-muted)' }}>Platform + Jamal's full methodology.</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '18px 0 4px' }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 76, fontWeight: 700,
                  lineHeight: .92, letterSpacing: '-.02em', color: 'var(--wz-ink)',
                }}>{price.elite}</span>
                <span style={{ fontSize: 14, color: 'var(--wz-muted)', fontWeight: 500 }}>/seat/mo</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--wz-muted)' }}>{note.elite}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '22px 0', flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--wz-ink)', fontWeight: 700 }}>Everything in Premium, plus:</div>
                {[
                  <>Unlimited new companies, dossiers &amp; podcasts</>,
                  <><b style={{ color: 'var(--wz-ink)' }}>Weekly Deal Coaching</b> — live with Jamal</>,
                  <><b style={{ color: 'var(--wz-ink)' }}>The Vault</b> — 22-module playbook</>,
                  <><b style={{ color: 'var(--wz-ink)' }}>Whyzer Academy</b> — monthly live sessions</>,
                  <><b style={{ color: 'var(--wz-ink)' }}>Coach Jamal</b>, your AI sales co-pilot</>,
                  <>Pipeline Flywheel, MDA, Outreach &amp; Financial Fluency</>,
                ].map((f, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--wz-muted)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--wz-brand)', fontWeight: 700 }}>✓</span><span>{f}</span>
                  </div>
                ))}
              </div>
              <a href={CHECKOUT} className="wz8-btn wz8-btn-primary" style={{ padding: '15px 24px' }}>{ctaLabel}</a>
            </div>

            {/* Teams */}
            <div style={{
              background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(228,227,240,.9)', borderRadius: 18, padding: 30,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: 'var(--wz-soft)',
                background: 'var(--wz-lilac)', alignSelf: 'flex-start', padding: '5px 11px',
                borderRadius: 100, marginBottom: 12,
              }}>TEAMS</div>
              <h4 style={{ fontSize: 17, marginBottom: 4 }}>Corporate / Teams</h4>
              <div style={{ fontSize: 13, color: 'var(--wz-soft)' }}>Elite, rolled out to the whole floor.</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '18px 0 4px' }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 56, fontWeight: 700,
                  lineHeight: .92, letterSpacing: '-.02em',
                }}>Custom</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--wz-soft)' }}>Volume pricing — talk to Jamal directly.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '22px 0', flex: 1 }}>
                {['Everything in Elite', 'Volume team pricing', 'Dedicated onboarding', '3-hour live session with Jamal'].map((f) => (
                  <div key={f} style={{ fontSize: 13, color: 'var(--wz-muted)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--wz-brand)', fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="mailto:jamal@whyzer.ai" className="wz8-btn wz8-btn-outline">Talk to Jamal directly</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- faq ---------------- */}
      <section style={{ padding: '80px 0', background: 'var(--wz-lilac)' }}>
        <div className="wz8-shell">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <div className="wz8-eyebrow">FAQ</div>
            <h2 className="wz8-h2">Questions, answered.</h2>
          </div>
          <div className="wz8-two">
            {FAQ_GROUPS.map((g) => (
              <div key={g.title} style={{
                background: 'rgba(255,255,255,.8)', backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,.9)', borderRadius: 14, padding: 24,
              }}>
                <h4 style={{ fontSize: 14, marginBottom: 14, color: 'var(--wz-brand-dark)' }}>{g.title}</h4>
                {g.items.map((q, i) => (
                  <div key={q} style={{
                    fontSize: 13.5, padding: '10px 0', display: 'flex',
                    justifyContent: 'space-between', gap: 12,
                    borderTop: i === 0 ? undefined : '1px solid var(--wz-line)',
                  }}>
                    {q}<span style={{ color: 'var(--wz-soft)' }}>＋</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- final cta ---------------- */}
      <section style={{
        padding: '80px 0', textAlign: 'center', background: 'var(--wz-night)',
        backgroundImage: 'radial-gradient(ellipse 600px 400px at 20% 100%, rgba(99,73,198,.5), transparent 65%), radial-gradient(ellipse 500px 400px at 85% 0%, rgba(22,105,143,.45), transparent 65%)',
      }}>
        <div className="wz8-shell">
          <h2 style={{ color: '#fff', fontSize: 33, marginBottom: 12, lineHeight: 1.16, textWrap: 'pretty' }}>
            Someone's closing your next account with a sharper argument than yours.
          </h2>
          <p style={{ color: '#B9B9E8', fontSize: 14.5, marginBottom: 28 }}>
            8,500+ companies · 150+ markets · Built by the seller who closed $160M doing it himself.
          </p>
          <a href={CHECKOUT} className="wz8-btn wz8-btn-primary" style={{ padding: '15px 30px' }}>
            Start your free trial
          </a>
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer style={{
        padding: '34px 0', display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 12, fontSize: 12, color: 'var(--wz-soft)', background: 'var(--wz-paper)',
      }}>
        <img src="/v8/whyzer-logo-dark.png" alt="Whyzer" width={88} height={22} style={{ height: 22, width: 'auto', opacity: .8 }} />
        <div>© {new Date().getFullYear()} Whyzer.ai</div>
      </footer>

      {/* ---------------- video lightbox ---------------- */}
      {vid.open !== null && (
        <div
          role="dialog" aria-modal="true" aria-label={`Video testimonial: ${VIDEOS[vid.open].name}`}
          style={{
            position: 'fixed', inset: 0, zIndex: 95, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 28,
          }}
        >
          <div
            onClick={() => vid.setOpen(null)}
            style={{
              position: 'absolute', inset: 0, background: 'rgba(6,6,14,.82)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}
          />
          <div style={{ position: 'relative', width: '100%', maxWidth: 940 }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              gap: 16, marginBottom: 14,
            }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fff', fontSize: 19 }}>
                  {VIDEOS[vid.open].name}
                </div>
                <div style={{ fontSize: 12.5, color: '#8F8FD0' }}>{VIDEOS[vid.open].role}</div>
              </div>
              <button
                onClick={() => vid.setOpen(null)} aria-label="Close video"
                style={{
                  width: 42, height: 42, borderRadius: 12, background: 'transparent',
                  border: '1px solid var(--wz-brand)', color: '#DADAF2', cursor: 'pointer', fontSize: 17,
                }}
              >✕</button>
            </div>
            <div style={{
              position: 'relative', borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,.14)',
              boxShadow: '0 60px 120px -40px rgba(0,0,0,.85)', aspectRatio: '16 / 9', background: '#000',
            }}>
              <iframe
                key={vid.open}
                src={VIDEOS[vid.open].src}
                title={`Video testimonial: ${VIDEOS[vid.open].name}`}
                allow="autoplay; fullscreen" allowFullScreen
                style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
              />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, marginTop: 14,
            }}>
              <button className="wz8-vstep" onClick={() => vid.step(-1)}>← Previous</button>
              <div style={{ fontSize: 12, color: '#8F8FD0' }}>
                Video {vid.open + 1} of {VIDEOS.length}
              </div>
              <button className="wz8-vstep" onClick={() => vid.step(1)}>Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- exit intent ---------------- */}
      {exit.open && (
        <div
          role="dialog" aria-modal="true" aria-labelledby="wz8-exit-title"
          style={{
            position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 24,
          }}
        >
          <div
            onClick={() => exit.setOpen(false)}
            style={{
              position: 'absolute', inset: 0, background: 'rgba(9,17,39,.62)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            }}
          />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 620, borderRadius: 26,
            padding: '44px 46px 38px',
            background: 'linear-gradient(165deg, rgba(28,28,48,.96), rgba(13,13,26,.97))',
            backdropFilter: 'blur(26px) saturate(160%)', WebkitBackdropFilter: 'blur(26px) saturate(160%)',
            border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 60px 120px -40px rgba(0,0,0,.8)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <button
              onClick={() => exit.setOpen(false)} aria-label="Close"
              style={{
                position: 'absolute', top: 22, right: 22, width: 46, height: 46, borderRadius: 14,
                background: 'transparent', border: '1px solid var(--wz-brand)', color: '#DADAF2',
                cursor: 'pointer', fontSize: 20, lineHeight: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
            <h3 id="wz8-exit-title" style={{
              fontSize: 38, fontWeight: 700, lineHeight: 1.06, letterSpacing: '-.01em',
              textTransform: 'uppercase', color: '#F5F3EE', maxWidth: 460, marginBottom: 26, textWrap: 'pretty',
            }}>
              Before you go: the number one thing CFOs wish sellers understood.
            </h3>
            <div style={{ height: 2, background: 'var(--wz-brand)', marginBottom: 26 }} />
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#A9A9BE', marginBottom: 30, textWrap: 'pretty' }}>
              A free 20-minute webinar on the financial fluency framework enterprise sellers use to
              get taken seriously in the room. Takes less time than the meeting you're about to prep for.
            </p>
            <a
              href="/financial-fluency" className="wz8-btn wz8-btn-primary"
              style={{ display: 'block', width: '100%', fontSize: 16, fontWeight: 700, padding: '20px 24px', borderRadius: 12 }}
            >Show Me The Framework</a>
            <button
              onClick={() => exit.setOpen(false)}
              style={{
                width: '100%', marginTop: 14, border: 0, background: 'transparent', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 16, color: 'var(--wz-soft)', padding: 8,
              }}
            >Not now</button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Head } from 'vite-react-ssg';
import LogoMarquee from '@/components/home/LogoMarquee';
import { useUtmParams } from '@/hooks/useUtmParams';
import { checkoutUrl, formatMoney, useRegion, type Region } from '@/lib/regionalPricing';
import { ProductDemo, DeliverDemo } from './BlackFridayDemo';
import BlackFridayTestimonials from './BlackFridayTestimonials';
import { useReducedMotion } from './shared';
import './bf26-sales.css';

// ── Edit these ───────────────────────────────────────────────────────────────
/** Wed Dec 2 2026, midnight ET (= Dec 3 00:00 EST). */
const DEADLINE = Date.UTC(2026, 11, 3, 5, 0, 0);
/** The 50-seat cap the waitlist promised. false hides every seat line. */
const SHOW_SEATS = true;
const SEATS = 50;
/** true if checkout accepts ?prefilled_promo_code= */
const PREFILL_CODE = false;

const CODES = { elite: 'CYBERELITE40', premium: 'CYBERPREMIUM20' } as const;
type Plan = keyof typeof CODES;

/** Regular annual prices and the discount on year one. Same number in every currency. */
const ELITE = { regular: 997, off: 40 };
const PREMIUM = { regular: 570, off: 20 };
const firstYear = (p: { regular: number; off: number }) => Math.round(p.regular * (100 - p.off)) / 100;

/**
 * FAQ answers still waiting on a decision. While null, the question is left off the page rather
 * than publishing a placeholder. Fill in the answer to show it.
 */
const FAQ_MONTHLY_SWITCH: string | null = null; // "I'm on a monthly plan. Can I switch?"   (was [CONFIRM: new checkout, or Client Portal?])
const FAQ_UPGRADE_LATER: string | null = null; // "Can I start on Premium and upgrade later?" (was [CONFIRM: does the 40% Elite discount still apply after Dec 2?])

// ─────────────────────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, '0');

/** Ticks once a second. Renders 00s on the server and first paint so SSR and hydration agree. */
function useCountdown() {
  const [cd, setCd] = useState({ d: '00', h: '00', m: '00', s: '00', over: false });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, DEADLINE - Date.now());
      const s = Math.floor(diff / 1000);
      setCd((prev) => {
        const next = { d: pad(Math.floor(s / 86400)), h: pad(Math.floor((s % 86400) / 3600)), m: pad(Math.floor((s % 3600) / 60)), s: pad(s % 60), over: diff <= 0 };
        return prev.d === next.d && prev.h === next.h && prev.m === next.m && prev.s === next.s && prev.over === next.over ? prev : next;
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return cd;
}

/** True once the element has scrolled into view (and stays true). Always true under reduced motion. */
function useInViewOnce<T extends HTMLElement>(threshold: number, reduce: boolean) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, reduce]);
  return [ref, seen] as const;
}

const Check = ({ id = 'check', className }: { id?: string; className?: string }) => (
  <svg className={className} aria-hidden="true"><use href={`#bf26s-${id}`} /></svg>
);

/** Copies a promo code; if the clipboard is blocked, selects the code so it can be copied by hand. */
const CopyButton = ({ code, valRef }: { code: string; valRef: React.RefObject<HTMLSpanElement> }) => {
  const [done, setDone] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const select = () => {
    const el = valRef.current;
    if (!el) return;
    const r = document.createRange(); r.selectNodeContents(el);
    const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
  };
  const onClick = () => {
    const ok = () => { setDone(true); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setDone(false), 2000); };
    try { navigator.clipboard.writeText(code).then(ok, select); } catch { select(); }
  };
  return <button className={`copy${done ? ' done' : ''}`} type="button" onClick={onClick}>{done ? 'Copied' : 'Copy'}</button>;
};

const CodeBox = ({ code }: { code: string }) => {
  const val = useRef<HTMLSpanElement>(null);
  return (
    <div className="codebox">
      <div><span className="lbl">Your code</span><span className="val" ref={val}>{code}</span></div>
      <CopyButton code={code} valRef={val} />
    </div>
  );
};

const STAGES: { n: string; both?: boolean; h: string; m: string; a: string }[] = [
  { n: '01', both: true, h: 'Find the deal', m: 'You need a reason the exec should care.', a: 'The POV, built from their filings and earnings calls.' },
  { n: '02', h: 'Get the room', m: "The exec doesn't take vendor meetings.", a: 'Executive Whispering + Executive Prospecting: how to reach and lead conversations with the people who hold the budget.' },
  { n: '03', h: 'Build the case', m: "Your argument has to survive the CFO's first question.", a: 'Mega Deal Premise: unique insight, core imperatives, differentiated value, in one story.' },
  { n: '04', h: 'Hold it together', m: 'Six stakeholders, one champion going quiet.', a: 'Impactful Conversations + Account Planning: micro commitments, aligning the players, the plan that keeps momentum.' },
  { n: '05', h: 'Close', m: 'The deal stalls at legal, or slips a quarter.', a: 'How to Run the Sales Cycle, live sessions with Jamal on deals in flight, Coach Jamal at 11pm before the QBR.' },
];

const BlackFridaySales = () => {
  const cd = useCountdown();
  const reduce = useReducedMotion();
  const region: Region = useRegion();
  const appendUtm = useUtmParams();

  // ?closed=1 previews the "offer closed" state; ?src= names the traffic source on checkout links.
  const [forceClosed, setForceClosed] = useState(false);
  const [src, setSrc] = useState('direct');
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setForceClosed(q.get('closed') === '1');
    setSrc(q.get('src') || 'direct');
  }, []);
  const closed = cd.over || forceClosed;

  // Same scroll-behavior the other bf26 pages set, applied only while this page is mounted.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = reduce ? 'auto' : 'smooth';
    return () => { root.style.scrollBehavior = prev; };
  }, [reduce]);

  // Local-time toggle on the closing countdown.
  const [showLocal, setShowLocal] = useState(false);
  const [localTime, setLocalTime] = useState('');
  useEffect(() => {
    setLocalTime(new Date(DEADLINE).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }));
  }, []);

  const scrollToPricing = (e: React.MouseEvent) => {
    const el = document.getElementById('pricing');
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce ? 'auto' : 'smooth' });
  };

  // Why Elite: stage bars fill in order once the row is on screen.
  const [stagesRef, stagesSeen] = useInViewOnce<HTMLDivElement>(0.3, reduce);

  // ── Prices and checkout links: local currency, matching regional checkout ──
  const money = (n: number) => formatMoney(n, region);
  const eliteFirst = firstYear(ELITE), premiumFirst = firstYear(PREMIUM);
  const diff = Math.round((eliteFirst - premiumFirst) * 100) / 100;
  const eliteMonth = Math.round(eliteFirst / 12), premiumMonth = Math.round(premiumFirst / 12), diffMonth = Math.round(diff / 12);

  /**
   * Regional checkout slug (so the link matches the currency shown) + the site's attribution
   * params. The BF26 defaults only fill gaps: a visitor who arrived with their own UTMs keeps them.
   */
  const link = (plan: Plan) => {
    const base = checkoutUrl(plan, true, region);
    const p = new URLSearchParams(appendUtm(base).split('?')[1] ?? '');
    const defaults: Record<string, string> = { utm_source: src, utm_medium: 'private', utm_campaign: 'bf26' };
    Object.entries(defaults).forEach(([k, v]) => { if (!p.has(k)) p.set(k, v); });
    p.set('utm_content', plan);
    if (PREFILL_CODE) p.set('prefilled_promo_code', CODES[plan]);
    return `${base}?${p.toString()}`;
  };
  const eliteHref = link('elite'), premiumHref = link('premium');

  const seatsLine = SHOW_SEATS && (
    <div className="seatline"><span><b style={{ color: '#fff' }}>{SEATS} seats</b> at this price</span><span className="seatbar" aria-hidden="true"><i></i></span></div>
  );

  const faq: { q: string; a: React.ReactNode; open?: boolean }[] = [
    { q: 'Where do I enter the code?', a: 'At checkout, in the promo code field, before you pay.', open: true },
    { q: 'What happens after the first year?', a: `Your plan renews at the regular annual price: ${money(ELITE.regular)} for Elite, ${money(PREMIUM.regular)} for Premium.` },
    ...(FAQ_MONTHLY_SWITCH ? [{ q: "I'm on a monthly plan. Can I switch?", a: FAQ_MONTHLY_SWITCH }] : []),
    ...(FAQ_UPGRADE_LATER ? [{ q: 'Can I start on Premium and upgrade later?', a: FAQ_UPGRADE_LATER }] : []),
    ...(SHOW_SEATS ? [{ q: `What happens when the ${SEATS} seats are gone?`, a: 'The code stops working and the promo price is gone, even before Dec 2.' }] : []),
    { q: 'When does the offer end?', a: <>Wed Dec 2, midnight ET{SHOW_SEATS && ', or earlier if the 50 seats go'}. No extensions.</> },
  ];

  const stat = (k: 'd' | 'h' | 'm' | 's') => cd[k];

  return (
    <div className="bf26s">
      <Head>
        <title>Whyzer Black Friday: Elite 40% off, Premium 20% off</title>
        <meta name="description" content="Private Black Friday offer: Whyzer Elite at 40% off and Premium at 20% off the first year. Ends Wed Dec 2, midnight ET." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="bf26s-check" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="currentColor" opacity=".16" /><path d="M6 10.4l2.6 2.6L14 7.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="bf26s-x" viewBox="0 0 20 20"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="bf26s-q" viewBox="0 0 40 32"><path d="M0 32V19C0 8 6 1.5 16 0l2 4.5C12 6.5 9.5 10 9 15h8v17H0zm22 0V19C22 8 28 1.5 38 0l2 4.5C34 6.5 31.5 10 31 15h8v17H22z" fill="currentColor" /></symbol>
      </svg>

      <div className={closed ? 'is-closed' : undefined}>
        <div className="open-only">

          <nav className="nav" aria-label="Offer">
            <div className="wrap">
              <a className="logo-link" href="#top" aria-label="Whyzer"><img className="logo" src="/bf26/logo-white.png" alt="Whyzer" width="96" height="24" /></a>
              <div className="nav-count" title="Ends Wed Dec 2, midnight ET">
                <span className="note">Private Black Friday offer · Ends Wed Dec 2, midnight ET</span>
                <div className="chips" aria-label="Time left on the offer">
                  <span className="chip"><b>{stat('d')}</b><i>d</i></span>
                  <span className="chip"><b>{stat('h')}</b><i>h</i></span>
                  <span className="chip"><b>{stat('m')}</b><i>m</i></span>
                  <span className="chip"><b>{stat('s')}</b><i>s</i></span>
                </div>
              </div>
              <a className="btn btn-sm" href="#pricing" onClick={scrollToPricing}>See pricing</a>
            </div>
          </nav>

          <header className="hero" id="top">
            <span className="glow" aria-hidden="true"></span>
            <div className="wrap hero-grid">
              <div className="hero-copy">
                <h1 className="rise d2">Stop researching deals. <span>Start closing them.</span></h1>
                <p className="sub rise d3">A full year of Whyzer Elite at <strong>40% off</strong>: the intelligence, plus everything it takes to close. Or Premium at 20% off. First-year pricing, for this list only, until Dec 2.</p>
                <div className="cta-row rise d4">
                  <a className="btn" href="#pricing" onClick={scrollToPricing}>See the offer <span className="arr">→</span></a>
                  <small>Codes are entered at checkout.</small>
                </div>
              </div>

              <aside className="ticket rise d3" aria-label="The offer">
                <div className="ticket-head"><b>The offer</b><span>ends Dec 2 · 00:00 ET</span></div>
                <div className="plan-row top">
                  <span className="nm">Whyzer Elite</span><span className="off">−{ELITE.off}%</span>
                  <div className="px"><b>{money(eliteFirst)}</b><s>{money(ELITE.regular)}</s><span>first year</span></div>
                  <span className="cd">{CODES.elite}</span>
                </div>
                <div className="plan-row">
                  <span className="nm">Whyzer Premium</span><span className="off">−{PREMIUM.off}%</span>
                  <div className="px"><b>{money(premiumFirst)}</b><s>{money(PREMIUM.regular)}</s><span>first year</span></div>
                  <span className="cd">{CODES.premium}</span>
                </div>
                {seatsLine}
                <small>Annual plans, billed in full at signup. Discount applies to year one.</small>
              </aside>
            </div>
          </header>

          <section className="logos" aria-label="Customers">
            <div className="wrap">
              <span className="k">Used by sellers at</span>
              <LogoMarquee />
            </div>
          </section>

          <main>

            <section className="band" id="pricing" aria-labelledby="price-h">
              <div className="wrap stack">
                <div className="price-head">
                  <span className="eyebrow">Pricing · Annual only</span>
                  <h2 className="h2" id="price-h">Less than one lost deal.</h2>
                  <p className="lead">Premium gets you the intelligence. Elite adds Jamal's deal-cycle methodology on top: everything between the first meeting and the signature.</p>
                </div>

                <div className="pricing">
                  <article className="card elite">
                    <span className="ribbon">Best value</span>
                    <div className="card-top">
                      <span className="badge">{ELITE.off}% off first year</span>
                      <h3>Whyzer Elite</h3>
                      <span className="tag">Intelligence + the close.</span>
                    </div>
                    <div className="price-box">
                      <span className="k">First year</span>
                      <span className="big">{money(eliteFirst)}</span>
                      <span className="reg">Regular <s>{money(ELITE.regular)}/year</s></span>
                      <span className="per">about {money(eliteMonth)}/month · billed annually · <b>Renews at {money(ELITE.regular)}/year</b></span>
                    </div>
                    <CodeBox code={CODES.elite} />
                    <div className="feat">
                      <span className="k">The intelligence</span>
                      <ul><li><Check /><span><b>Everything in Premium</b>, plus 500 new companies a month and 100 Executive POV Dossiers</span></li></ul>
                    </div>
                    <div className="feat close-box">
                      <span className="k">The close · Elite only</span>
                      <ul>
                        <li><Check /><span><b>Jamal's deal-cycle playbook</b>: Mega Deal Premise, Executive Whispering, How to Run the Sales Cycle</span></li>
                        <li><Check /><span><b>Live sessions with Jamal</b> on deals in flight. Bring yours.</span></li>
                        <li><Check /><span><b>Coach Jamal AI</b>, on call at 11pm before the QBR</span></li>
                        <li><Check /><span><b>The framework</b> behind $160M+ in closed deals</span></li>
                      </ul>
                    </div>
                    <p className="diff"><b>{money(diff)} more than Premium</b> for the year. About {money(diffMonth)} a month.</p>
                    {SHOW_SEATS && <div className="seat-warn"><span className="dot" aria-hidden="true"></span>{SEATS} seats at this price. When they're gone, the code stops working.</div>}
                    <div className="go">
                      <a className="btn btn-block" href={eliteHref} target="_blank" rel="noopener">Get Elite with {CODES.elite} <span className="arr">→</span></a>
                      <small>Enter {CODES.elite} at checkout.</small>
                    </div>
                  </article>

                  <div className="prem-col">
                    <span className="hint">Just need the research platform?</span>
                    <article className="card premium">
                      <div className="card-top">
                        <span className="badge">{PREMIUM.off}% off first year</span>
                        <h3>Whyzer Premium</h3>
                        <span className="tag">The intelligence.</span>
                      </div>
                      <div className="price-box">
                        <span className="k">First year</span>
                        <span className="big">{money(premiumFirst)}</span>
                        <span className="reg">Regular <s>{money(PREMIUM.regular)}/year</s></span>
                        <span className="per">{money(premiumMonth)}/month · billed annually · Renews at {money(PREMIUM.regular)}/year</span>
                      </div>
                      <CodeBox code={CODES.premium} />
                      <div className="feat">
                        <ul>
                          {['Unlimited company reports', 'Add up to 30 new companies each month', 'Unlimited deal maps', '2 Executive POV Dossiers', 'Email Campaign Generator', 'Chat with WhyzerAI'].map((f) => (
                            <li key={f}><Check /><span>{f}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div className="feat not">
                        <span className="k">Not included · The close</span>
                        <ul>
                          {['Deal-cycle playbook', 'Live sessions with Jamal', 'Coach Jamal AI'].map((f) => (
                            <li key={f}><Check id="x" className="x" /><span>{f}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div className="go">
                        <a className="btn-out" href={premiumHref} target="_blank" rel="noopener">Get Premium with {CODES.premium}</a>
                        <small>Enter {CODES.premium} at checkout.</small>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="redeem">
                  <span className="eyebrow" style={{ color: 'var(--ink-subtle)' }}>How to redeem</span>
                  <ol className="steps3">
                    <li className="s" style={{ '--k': 0 } as CSSProperties}><span className="n">1</span><b>Copy your code.</b><small>Hit Copy on the plan you want.</small></li>
                    <li className="s" style={{ '--k': 1 } as CSSProperties}><span className="n">2</span><b>Click through to checkout.</b><small>It opens in a new tab.</small></li>
                    <li className="s" style={{ '--k': 2 } as CSSProperties}><span className="n">3</span><b>Paste it before you pay.</b><small>Promo code field. The discount shows before you're charged.</small></li>
                  </ol>
                  <small>Annual plans are billed in full at signup. Discount applies to the first year only. Offer ends Wed Dec 2, midnight ET.</small>
                </div>
              </div>
            </section>

            <section className="dark" aria-labelledby="why-h">
              <div className="wrap band stack">
                <div className="why-head">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span className="eyebrow">Why Elite · First meeting to signature</span>
                    <h2 className="h2" id="why-h">The intelligence gets you the meeting. <span>Elite gets you the close.</span></h2>
                  </div>
                  <p>The multi-threading, the stall at legal, the champion who goes quiet: that's deal-cycle work. It's what Jamal spent two decades learning before he built a platform around it.</p>
                </div>
                <div className={`stgs${stagesSeen ? ' go-in' : ''}`} ref={stagesRef}>
                  {STAGES.map((s, k) => (
                    <div key={s.n} className={`stg ${s.both ? 'both' : 'el'}`} style={{ '--k': k } as CSSProperties}>
                      <div className="top"><span>{s.n}</span><span className="t">{s.both ? 'Both plans' : 'Elite'}</span></div>
                      <div className="track"><i></i></div>
                      <h3>{s.h}</h3><span className="m">{s.m}</span><span className="a">{s.a}</span>
                    </div>
                  ))}
                </div>
                <div className="why-foot">
                  <div className="st"><b>65%</b><span>of annual quota closed in a single deal</span></div>
                  <div className="st"><b>$160M+</b><span>closed with the framework inside</span></div>
                  <div className="c">
                    <p>That's not a research method. That's how bigger deals get into the room.</p>
                    <a className="btn" href={eliteHref} target="_blank" rel="noopener">Get Elite with {CODES.elite} <span className="arr">→</span></a>
                  </div>
                </div>
              </div>
            </section>

            <section className="band" aria-labelledby="plat-h">
              <div className="wrap stack">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span className="eyebrow">Both plans</span>
                  <h2 className="h2" id="plat-h">What the platform does</h2>
                </div>
                <ProductDemo />
                <DeliverDemo />
              </div>
            </section>

            <BlackFridayTestimonials />

            <section className="band" aria-labelledby="faq-h">
              <div className="wrap faq">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span className="eyebrow">FAQ</span>
                  <h2 className="h2" id="faq-h">About the offer</h2>
                  <span style={{ color: 'var(--ink-muted)' }}>Product questions live on <a href="https://whyzer.ai" target="_blank" rel="noopener">whyzer.ai</a>.</span>
                </div>
                <div className="faq-list">
                  {faq.map((f) => (
                    <details key={f.q} open={f.open}><summary>{f.q}<span className="pm" aria-hidden="true">+</span></summary><p>{f.a}</p></details>
                  ))}
                </div>
              </div>
            </section>

            <section className="final" aria-labelledby="final-h">
              <div className="wrap">
                <div className="final-card">
                  <span className="pill"><span className="dot" aria-hidden="true"></span>Ends Wed Dec 2 · midnight ET</span>
                  <h2 id="final-h">The signal is public. <span>The argument still isn't.</span></h2>
                  <button
                    className="tiles"
                    type="button"
                    onClick={() => setShowLocal((v) => !v)}
                    title={`Ends Wed Dec 2, midnight ET${localTime ? ` (your time: ${localTime})` : ''}`}
                    aria-label="Show the closing time in your time zone"
                  >
                    <span className="tile"><b>{stat('d')}</b><i>Days</i></span>
                    <span className="tile"><b>{stat('h')}</b><i>Hours</i></span>
                    <span className="tile"><b>{stat('m')}</b><i>Minutes</i></span>
                  </button>
                  <span className="local">{showLocal && localTime ? `Your time: ${localTime}` : 'Wed Dec 2, midnight ET. Tap for your time.'}</span>
                  <a className="btn" href={eliteHref} target="_blank" rel="noopener">Get Elite with {CODES.elite} <span className="arr">→</span></a>
                  <a className="alt" href={premiumHref} target="_blank" rel="noopener">or Premium with {CODES.premium}</a>
                  <small>Codes entered at checkout. Ends Wed Dec 2, midnight ET.</small>
                </div>
              </div>
            </section>

          </main>
        </div>

        <section className="closed hero" aria-labelledby="closed-h">
          <div className="wrap inner">
            <img className="logo" src="/bf26/logo-white.png" alt="Whyzer" width="104" height="26" />
            <span className="pill">Offer closed</span>
            <h1 id="closed-h">This offer has closed.</h1>
            <p>The Black Friday codes stopped working Wed Dec 2 at midnight ET.</p>
            <a className="btn" href="https://whyzer.ai/#pricing" target="_blank" rel="noopener">See regular pricing <span className="arr">→</span></a>
          </div>
        </section>

        <footer>
          <div className="wrap">
            <img src="/bf26/logo-dark.png" alt="Whyzer" width="80" height="20" />
            <span>Annual plans only. Offer closes Wed Dec 2, midnight ET.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlackFridaySales;

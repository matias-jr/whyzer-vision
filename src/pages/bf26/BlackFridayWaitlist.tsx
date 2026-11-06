import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import SignupForm from './SignupForm';
import { Bf26Footer, Bf26Shell, Tiles, scrollToForm, useCountdown, useLocalTime, useReducedMotion } from './shared';

// ── Edit these ───────────────────────────────────────────────────────────────
/** Shown until the live count (/api/bf26) loads, and if it ever fails. */
const LIST_COUNT_FALLBACK = 180;
const SEATS = 50;
/** From Nov 25: set to real purchases and the seat map shows them. While 0, it plays a 5-seat preview. */
const SEATS_TAKEN = 0;
const DANNY_TESTIMONIAL = '“I pulled up Whyzer and found his top-three priority from the last earnings call. I built my talk track around it.”';
/** Button in the "list closed" state. */
const PUBLIC_OFFER_URL = 'https://www.whyzer.ai/';
// ─────────────────────────────────────────────────────────────────────────────

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const PER_ROW = 10;
/** The 5 seats the preview fills, in order. */
const DEMO_SEATS = [13, 2, 27, 36, 8];
const fmt = (n: number) => n.toLocaleString('en-US');

const taken = Math.max(0, Math.min(SEATS, SEATS_TAKEN));
const seatNote =
  taken > 0
    ? `${taken} of ${SEATS} seats taken. ${SEATS - taken} left at the promo price.`
    : 'A preview of Nov 25: seats go one by one, in order of purchase. None are sold yet.';

const BlackFridayWaitlist = () => {
  const cd = useCountdown();
  const local = useLocalTime();
  const reduce = useReducedMotion();
  const tracker = useRef<HTMLDivElement>(null);

  // Sellers on the list: live from GHL (cached for 5 min server-side), falling back to the constant.
  const [listCount, setListCount] = useState(LIST_COUNT_FALLBACK);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/bf26')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d && Number.isInteger(d.count) && d.count >= 0) setListCount(d.count); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const pct = listCount > 0 ? Math.min(100, (SEATS / listCount) * 100) : 100;
  const pctLabel = `${pct < 10 ? pct.toFixed(1) : Math.round(pct)}%`;
  const ratio = listCount > 0 ? `${(listCount / SEATS).toFixed(1)} : 1` : '-';
  const seatSentence = listCount > SEATS ? `There's a promo seat for ${pctLabel} of the list.` : `${SEATS} promo seats.`;

  // ?closed=1 previews the "list closed" state.
  const [forceClosed, setForceClosed] = useState(false);
  useEffect(() => {
    setForceClosed(new URLSearchParams(window.location.search).get('closed') === '1');
  }, []);
  const closed = cd.over || forceClosed;

  // Seat tracker: once it scrolls into view, count the list up and play the seat-taking preview.
  const [go, setGo] = useState(false);
  const [shownCount, setShownCount] = useState(fmt(LIST_COUNT_FALLBACK));
  const countRef = useRef(listCount); // latest count, read by the count-up animation
  const counting = useRef(false);
  useEffect(() => {
    countRef.current = listCount;
    if (!counting.current) setShownCount(fmt(listCount));
  }, [listCount]);
  const [taking, setTaking] = useState<number[]>([]);
  useEffect(() => {
    const el = tracker.current;
    if (!el || reduce || !('IntersectionObserver' in window)) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;
    let stopped = false;
    const later = (fn: () => void, ms: number) => { timers.push(setTimeout(() => { if (!stopped) fn(); }, ms)); };

    const countUp = () => {
      let t0: number | null = null;
      const dur = 2600;
      counting.current = true;
      const step = (t: number) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, (t - t0) / dur);
        setShownCount(fmt(Math.round(countRef.current * (1 - Math.pow(1 - p, 3)))));
        if (p < 1) raf = requestAnimationFrame(step);
        else counting.current = false;
      };
      raf = requestAnimationFrame(step);
    };
    const demo = () => {
      if (taken > 0) return; // real numbers win: no preview once seats sell
      let k = 0;
      const next = () => {
        if (k < DEMO_SEATS.length) {
          setTaking(DEMO_SEATS.slice(0, ++k));
          later(next, 950);
          return;
        }
        later(() => { setTaking([]); later(demo, 1400); }, 3000);
      };
      next();
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setGo(true);
        countUp();
        later(demo, 900);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => { stopped = true; counting.current = false; io.disconnect(); cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, [reduce]);

  const seatMap = useMemo(
    () =>
      ROWS.flatMap((row, r) => [
        <span key={`rl-${row}`} className="rl">{row}</span>,
        ...Array.from({ length: PER_ROW }, (_, c) => {
          const n = r * PER_ROW + c;
          const seat = (
            <span
              key={`s-${n}`}
              className={`seat${n < taken ? ' taken' : ''}${taking.includes(n) ? ' taking' : ''}`}
              style={{ '--i': n, '--c': c } as CSSProperties}
            />
          );
          return c === PER_ROW / 2 ? [<span key={`a-${n}`} className="aisle" />, seat] : [seat];
        }).flat(),
      ]),
    [taking],
  );

  // Testimonials: the spotlight cycles through the four cards; hover or focus takes over.
  const [spot, setSpot] = useState(0);
  const [paused, setPaused] = useState(false);
  const spinning = !reduce && !paused;
  useEffect(() => {
    if (!spinning) return;
    const id = setInterval(() => setSpot((s) => (s + 1) % 4), 3800);
    return () => clearInterval(id);
  }, [spinning]);
  const stopQuotes = () => setPaused(true);
  const startQuotes = () => setPaused(false);

  return (
    <Bf26Shell
      title="Whyzer BF26 Waitlist"
      description="Get on the private Whyzer Black Friday list. Early access opens Wed Nov 25. 50 promo seats on Elite and Premium annual plans."
    >
      <div id="page" className={closed ? 'is-closed' : undefined}>
      <div className="open-only">

      <nav className="nav" aria-label="Waitlist">
        <div className="wrap">
          <a className="logo-link" href="#top" aria-label="Whyzer"><img className="logo" src="/bf26/logo-white.png" alt="Whyzer" width="96" height="24" /></a>
          <div className="nav-count" title="Wed Nov 25, 9:00 AM ET">
            <span className="lbl"><span className="lbl-long">Private Black Friday list </span>closes in</span>
            <div className="chips" aria-label="Time until the list closes">
              <span className="chip"><b>{cd.d}</b><i>d</i></span>
              <span className="chip"><b>{cd.h}</b><i>h</i></span>
              <span className="chip"><b>{cd.m}</b><i>m</i></span>
              <span className="chip"><b>{cd.s}</b><i>s</i></span>
            </div>
          </div>
          <a className="btn btn-sm" href="#form" onClick={scrollToForm}>Get on the list</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <span className="glow" aria-hidden="true"></span>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="pill rise d1"><span className="dot" aria-hidden="true"></span>Private Black Friday offer · 50 seats</span>
            <h1 className="rise d2">Start 2027 <span>with the POV already built.</span></h1>
            <p className="sub rise d3">Black Friday pricing on Whyzer annual plans. Released only to this list on <b>Wed Nov 25</b>. 50 seats at the promo price.</p>
            <div className="count-block rise d4">
              <span className="k">List closes in</span>
              <Tiles cd={cd} onToggle={local.toggle} title={local.title} label="Show the closing time in your time zone" seps />
              <span className="local">{local.line}</span>
            </div>
            <div className="mobile-cta rise d5">
              <a className="btn btn-block" href="#form" onClick={scrollToForm}>Get on the list <span className="arr">→</span></a>
              <small>Free. 30 seconds. List closes Wed Nov 25.</small>
            </div>
          </div>

          <div className="form-card rise d3" id="form">
            <div className="form-head">
              <div>
                <h2>Get on the private list</h2>
                <p>Closes Wed Nov 25. Codes go out the same day.</p>
              </div>
            </div>
            <SignupForm />
          </div>
        </div>
      </header>

      <main>

      <section className="band" aria-labelledby="how-h">
        <div className="wrap stack">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="eyebrow">How it works</span>
            <h2 className="h2" id="how-h">Three dates. That's the whole thing.</h2>
          </div>
          <div className="steps">
            <div className="step now">
              <span className="num" aria-hidden="true">01</span>
              <span className="when">Now to Nov 24</span>
              <h3>Get on the list.</h3>
              <p>Free. Just your name and email.</p>
              <div className="status live">
                <div className="row"><span><span className="dot" aria-hidden="true"></span>Open now</span><span>step 1 of 3</span></div>
                <div className="bar" aria-hidden="true"><i></i></div>
              </div>
            </div>
            <div className="step">
              <span className="num" aria-hidden="true">02</span>
              <span className="when">Wed Nov 25 · 9:00 AM ET</span>
              <h3>Early access opens.</h3>
              <p>The list gets our Black Friday pricing on Elite and Premium annual plans, plus the codes. Nobody else sees it.</p>
              <div className="status loading">
                <div className="row"><span>Releasing soon</span><span>in <span>{cd.d}</span>d <span>{cd.h}</span>h</span></div>
                <div className="bar" aria-hidden="true"><i></i></div>
              </div>
            </div>
            <div className="step">
              <span className="num" aria-hidden="true">03</span>
              <span className="when">Dec 2, or until seats fill up</span>
              <h3>The first 50 buyers get the promo seat.</h3>
              <p>Seats go in order of purchase. After 50, the promo price is gone. Everything closes Wed Dec 2 at midnight ET.</p>
              <div className="status locked">
                <div className="row"><span>Locked</span><span>unlocks with step 2</span></div>
                <div className="bar" aria-hidden="true"><i></i></div>
              </div>
            </div>
          </div>
          <div className="callout"><span className="ico" aria-hidden="true">!</span><span>Joining the list doesn't hold a seat. It gets you in the room on Nov 25. The seat is yours when you buy.</span></div>
        </div>
      </section>

      <section className="dark" aria-labelledby="seat-h">
        <div className="wrap band stack">
          <div className="tracker-head">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
              <span className="eyebrow">The list so far</span>
              <h2 className="h2" id="seat-h">{seatSentence}</h2>
            </div>
            <p className="note">Seats go to the first 50 who buy on Nov 25. Joining the list doesn't hold one.</p>
          </div>
          <div className={`console${go ? ' go' : ''}`} ref={tracker}>
            <div className="console-bar">
              <span><span className="dot" aria-hidden="true"></span>whyzer / bf26-private-list</span>
              <span>synced daily · real sign-ups only</span>
            </div>
            <div className="console-body">
              <div className="stats">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className="mono" style={{ fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--night-subtle)' }}>Sellers on the list</span>
                  <span className="big">{shownCount}</span>
                </div>
                <dl className="kv" style={{ margin: '0' }}>
                  <div><dt>promo.seats</dt><dd className="acc">50</dd></div>
                  <div><dt>sellers.per.seat</dt><dd>{ratio}</dd></div>
                  <div><dt>seat.share</dt><dd>{pctLabel}</dd></div>
                  <div><dt>opens</dt><dd>Nov 25 · 09:00 ET</dd></div>
                </dl>
              </div>
              <div className="grid-side">
                <div className="legend">
                  <span><span><i className="sw" style={{ background: 'rgba(98,98,233,.35)', border: '1px solid var(--purple)' }}></i>promo seat, open</span><span><i className="sw" style={{ background: 'var(--lilac-on-night)' }}></i>taken on Nov 25</span></span>
                </div>
                <div className="seatmap">
                  <div className="stage" aria-hidden="true"><span>Early access · Nov 25</span></div>
                  <div className="seats" role="img" aria-label="50 promo seats in 5 rows of 10">{seatMap}</div>
                </div>
                <small>{seatNote}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="why-h">
        <div className="wrap split">
          <div className="side">
            <span className="eyebrow">Why now</span>
            <h2 className="h2" id="why-h">Q1 starts before January.</h2>
          </div>
          <div className="prose">
            <p>Most sellers check out after Black Friday. The ones who win Q1 are already prepping.</p>
            <p>Their first discovery call of 2027 isn't a discovery call. It's a <strong>point of view</strong>, built from the account's 10-K, earnings calls and stated priorities.</p>
            <p>And if you have professional development budget left for 2026, it disappears in December. Spend it on your 2027 pipeline.</p>
            <p className="close">Lock in a full year of Whyzer before your first call of 2027.</p>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="get-h">
        <div className="wrap stack">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px' }}>
            <span className="eyebrow">What you get</span>
            <h2 className="h2" id="get-h">What's on the table on Nov 25</h2>
            <p className="lead">Walk into any target account with a sourced POV built from their filings and earnings calls. Persona-tailored executive emails, conversation starters and exec decks for each stakeholder. Coverage of 10,000+ companies across 150+ markets.</p>
          </div>
          <div className="plans">
            <article className="plan elite">
              <div className="plan-head">
                <div className="t">
                  <span className="eyebrow">Whyzer Elite · Annual</span>
                  <h3>A full year of Whyzer Elite at Black Friday pricing.</h3>
                </div>
                <span className="badge">Revealed Nov 25</span>
              </div>
              <ul className="checks">
                <li><svg><use href="#i-check" /></svg><span><b>Everything in Premium</b></span></li>
                <li><svg><use href="#i-check" /></svg><span>Add up to 500 new companies each month</span></li>
                <li><svg><use href="#i-check" /></svg><span>30 podcast generations</span></li>
                <li><svg><use href="#i-check" /></svg><span>100 Executive POV Dossiers</span></li>
                <li><svg><use href="#i-check" /></svg><span><b>The Vault:</b> Jamal Reimer's full enterprise selling playbook</span></li>
                <li><svg><use href="#i-check" /></svg><span><b>Whyzer Academy:</b> the updated 2026 sales roadmap</span></li>
                <li><svg><use href="#i-check" /></svg><span><b>Coach Jamal,</b> your AI sales co-pilot</span></li>
              </ul>
              <div className="bonus">
                <span className="star" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" fill="currentColor" /></svg></span>
                <span><small>Plus an exclusive bonus</small><strong>Live sessions with Jamal Reimer</strong></span>
              </div>
            </article>
            <div className="plan-col">
              <article className="plan premium">
                <div className="plan-head">
                  <div className="t">
                    <span className="eyebrow">Whyzer Premium · Annual</span>
                    <h3>The full tool, for a year.</h3>
                  </div>
                  <span className="badge">Revealed Nov 25</span>
                </div>
                <ul className="checks">
                  <li><svg><use href="#i-check" /></svg><span>Unlimited company reports</span></li>
                  <li><svg><use href="#i-check" /></svg><span>Add up to 30 new companies each month</span></li>
                  <li><svg><use href="#i-check" /></svg><span>Unlimited deal maps</span></li>
                  <li><svg><use href="#i-check" /></svg><span>2 Whyzer &amp; Jamal podcasts per month</span></li>
                  <li><svg><use href="#i-check" /></svg><span>2 Executive POV Dossiers</span></li>
                  <li><svg><use href="#i-check" /></svg><span>Email Campaign Generator</span></li>
                  <li><svg><use href="#i-check" /></svg><span>Chat with WhyzerAI</span></li>
                </ul>
              </article>
              <div className="reveal-note"><span className="mono">$ ••• / yr</span><span>Pricing for both plans goes to the list only, on Nov 25.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="band proof" aria-labelledby="proof-h">
        <div className="wrap stack">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="eyebrow">What elite sellers say</span>
            <h2 className="h2" id="proof-h" style={{ maxWidth: '22ch' }}>This year, Whyzer sellers walked into boardrooms with a point of view.</h2>
          </div>
          <div className="quotes" onMouseEnter={stopQuotes} onMouseLeave={startQuotes} onFocus={stopQuotes}>
              <figure className={`quote t-product${spinning && spot === 0 ? ' spot' : ''}`}>
                <div className="q-top"><svg className="qm" viewBox="0 0 40 32" aria-hidden="true"><path d="M0 32V19C0 8 6 1.5 16 0l2 4.5C12 6.5 9.5 10 9 15h8v17H0zm22 0V19C22 8 28 1.5 38 0l2 4.5C34 6.5 31.5 10 31 15h8v17H22z" fill="currentColor" /></svg></div>
                <div><div className="stat">€650M IT CapEx</div><div className="ctx">the signal he built his POV around</div></div>
                <blockquote>“Just 30 to 60 seconds, and I get a complete picture.”</blockquote>
                <figcaption><span className="av" aria-hidden="true">T</span><span><b>Tobia</b><span>General Sales Manager, Southern Europe</span></span></figcaption>
              </figure>
              <figure className={`quote t-results${spinning && spot === 1 ? ' spot' : ''}`}>
                <div className="q-top"><svg className="qm" viewBox="0 0 40 32" aria-hidden="true"><path d="M0 32V19C0 8 6 1.5 16 0l2 4.5C12 6.5 9.5 10 9 15h8v17H0zm22 0V19C22 8 28 1.5 38 0l2 4.5C34 6.5 31.5 10 31 15h8v17H22z" fill="currentColor" /></svg></div>
                <div><div className="stat">65% of annual quota</div><div className="ctx">on a single deal, from three minutes of prep</div></div>
                <blockquote>{DANNY_TESTIMONIAL}</blockquote>
                <figcaption><span className="av" aria-hidden="true">D</span><span><b>Danny</b><span>Strategic AE, North America</span></span></figcaption>
              </figure>
              <figure className={`quote t-access${spinning && spot === 2 ? ' spot' : ''}`}>
                <div className="q-top"><svg className="qm" viewBox="0 0 40 32" aria-hidden="true"><path d="M0 32V19C0 8 6 1.5 16 0l2 4.5C12 6.5 9.5 10 9 15h8v17H0zm22 0V19C22 8 28 1.5 38 0l2 4.5C34 6.5 31.5 10 31 15h8v17H22z" fill="currentColor" /></svg></div>
                <div><div className="stat">CISO meeting, first try</div><div className="ctx">from a breach Whyzer flagged</div></div>
                <blockquote>“Whyzer flagged a cybersecurity breach that got me a CISO meeting on my first try. It worked immediately.”</blockquote>
                <figcaption><span className="av" aria-hidden="true">P</span><span><b>Paul</b><span>Enterprise AE, North America</span></span></figcaption>
              </figure>
              <figure className={`quote t-value${spinning && spot === 3 ? ' spot' : ''}`}>
                <div className="q-top"><svg className="qm" viewBox="0 0 40 32" aria-hidden="true"><path d="M0 32V19C0 8 6 1.5 16 0l2 4.5C12 6.5 9.5 10 9 15h8v17H0zm22 0V19C22 8 28 1.5 38 0l2 4.5C34 6.5 31.5 10 31 15h8v17H22z" fill="currentColor" /></svg></div>
                <div><div className="stat">$5.75M closed</div><div className="ctx">and $11.5M more in pipeline</div></div>
                <blockquote>$11.5M more sitting in pipeline, built the same way, account by account.</blockquote>
                <figcaption><span className="av" aria-hidden="true">A</span><span><b>Anonymous</b><span>Enterprise AE, using the Whyzer method</span></span></figcaption>
              </figure>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="fit-h">
        <div className="wrap stack">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="eyebrow">Who it's for</span>
            <h2 className="h2" id="fit-h">This offer isn't for everyone.</h2>
          </div>
          <div className="fit-panel">
            <div className="fit-cols">
              <div className="fit-yes">
                <div className="fit-label"><span className="fit-ico yes-ico"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 10.4l3 3L14.5 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>This is for you if</div>
                <ul>
                  <li><svg><use href="#i-check" /></svg><span>You have named accounts you need to break into in Q1.</span></li>
                  <li><svg><use href="#i-check" /></svg><span>You sell $100K+ deals to executives who don't take vendor meetings.</span></li>
                  <li><svg><use href="#i-check" /></svg><span>You'd rather walk into January with the research done.</span></li>
                </ul>
              </div>
              <div className="fit-no">
                <div className="fit-label"><span className="fit-ico no-ico"><svg className="x" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>Skip it if</div>
                <ul>
                  <li><svg className="x" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg><span>You're not carrying a number in 2027.</span></li>
                  <li><svg className="x" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg><span>You want another tool you'll open twice.</span></li>
                  <li><svg className="x" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg><span>You're happy to start prepping in February.</span></li>
                </ul>
              </div>
            </div>
            <div className="fit-foot">
              <p><b>50 seats.</b> For sellers who want to walk into 2027 with an edge.</p>
              <a className="btn btn-sm" href="#form" onClick={scrollToForm}>Get on the list <span className="arr">→</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="faq-h">
        <div className="wrap faq">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="eyebrow">FAQ</span>
            <h2 className="h2" id="faq-h">Questions</h2>
          </div>
          <div className="faq-list">
            <details open><summary>What's the price?<span className="pm" aria-hidden="true">+</span></summary><p>It's not public. The list gets it on Wed Nov 25.</p></details>
            <details><summary>Does joining the list reserve a seat?<span className="pm" aria-hidden="true">+</span></summary><p>No. It gets you early access. The 50 promo seats go to the first 50 people who buy.</p></details>
            <details><summary>When does it close?<span className="pm" aria-hidden="true">+</span></summary><p>The list closes Wed Nov 25, 9:00 AM ET. The offer closes Wed Dec 2 at midnight ET, or earlier if the 50 seats go.</p></details>
            <details><summary>What happens after the 50 seats?<span className="pm" aria-hidden="true">+</span></summary><p>The promo price is gone.</p></details>
            <details><summary>Do I have to join the private group?<span className="pm" aria-hidden="true">+</span></summary><p>No. Codes go to the group and to your email. Email arrives within the hour.</p></details>
            <details><summary>I'm already a Whyzer customer. Can I join?<span className="pm" aria-hidden="true">+</span></summary><p>Yes. Get on the list, and watch your inbox for an offer built for current members.</p></details>
            <details><summary>Is this monthly or annual?<span className="pm" aria-hidden="true">+</span></summary><p>The private offer is annual plans only: Elite and Premium.</p></details>
          </div>
        </div>
      </section>

      <section className="final" aria-labelledby="final-h">
        <div className="wrap">
          <div className="final-card">
            <span className="pill"><span className="dot" aria-hidden="true"></span>Early access · Wed Nov 25</span>
            <h2 id="final-h">50 seats. One date. <span>Get on the list.</span></h2>
            <Tiles cd={cd} onToggle={local.toggle} title={local.title} label="Show the closing time in your time zone" />
            <span className="local">{local.line}</span>
            <p>The pricing goes to this list only. After Nov 25, the door's closed.</p>
            <a className="btn" href="#form" onClick={scrollToForm}>Get on the list <span className="arr">→</span></a>
            <span className="sign">See you on the 25th. — Jamal</span>
          </div>
        </div>
      </section>

      </main>
      </div>

      <section className="closed hero" aria-labelledby="closed-h">
        <div className="wrap inner">
          <img className="logo" src="/bf26/logo-white.png" alt="Whyzer" width="104" height="26" />
          <span className="pill">List closed</span>
          <h1 id="closed-h">The private list is closed.</h1>
          <p>Early access went out Wed Nov 25. The public Black Friday offer is live until Wed Dec 2 at midnight ET.</p>
          <a className="btn" href={PUBLIC_OFFER_URL}>See the public Black Friday offer <span className="arr">→</span></a>
          <span style={{ fontSize: '14px', color: 'var(--night-muted)' }}>Use code <span className="code">WHYZER10</span> at checkout.</span>
        </div>
      </section>

      <Bf26Footer />
      </div>
    </Bf26Shell>
  );
};

export default BlackFridayWaitlist;

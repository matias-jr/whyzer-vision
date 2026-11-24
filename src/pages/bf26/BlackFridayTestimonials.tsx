import { memo, useEffect, useRef } from 'react';

/**
 * Testimonials on the BF26 sales page.
 *
 * Desktop (>900px): the cards ride the rim of an invisible wheel that never stops turning.
 * Mobile: the same cards become a continuously drifting marquee (a cloned set loops it), with
 * swipe and arrows. Both come from the approved designs; this file just joins them at the
 * 900px breakpoint.
 *
 * Like the demos, the animation drives the DOM directly (transforms, scroll position), so the
 * component is memoized with no props or state: React renders it once and never re-renders over
 * what the animation has written. Loops, listeners and observers are torn down on unmount.
 */

const QUOTES: { tone: 'product' | 'results' | 'value'; tag: string; head: string; before: string; mark: string; after: string; av: string; who: string; role: string }[] = [
  { tone: 'product', tag: 'The product', head: 'Gives a damn about enterprise selling.', before: "It's like OpenAI and Perplexity's deep research had a baby who ", mark: 'gives a damn about enterprise selling.', after: '', av: 'KG', who: 'Kyle G.', role: 'Enterprise AE' },
  { tone: 'results', tag: 'The results', head: 'A year of work, in two weeks.', before: 'What used to take a rep ', mark: 'a year, I can do in two weeks', after: ' with Whyzer. It helps us work on the right accounts.', av: 'DI', who: 'David Inukpuk', role: 'Strategic Accounts' },
  { tone: 'value', tag: 'The value', head: '10-Ks, actually usable for sellers.', before: 'Whyzer makes 10-Ks, 10-Qs and earnings reports ', mark: 'actually usable for salespeople.', after: ' Nothing else got close.', av: 'LW', who: 'Lee Winer', role: 'Sales Director' },
  { tone: 'product', tag: 'The product', head: 'All the context, before the call.', before: 'Feels like a business analyst is watching your back: ', mark: 'all the context is laid out before the call.', after: '', av: 'MB', who: 'Matt Brown', role: 'Account Executive' },
  { tone: 'results', tag: 'The results', head: 'A CISO meeting on the first try.', before: 'Whyzer flagged a cybersecurity breach that got me ', mark: 'a CISO meeting on my first try.', after: ' It worked immediately.', av: 'PH', who: 'Paul Hammond', role: 'Enterprise AE' },
  { tone: 'value', tag: 'The value', head: 'The deal and the talk prep.', before: 'The podcast gave me a really good idea of how to ', mark: 'structure not just the deal, but the talk prep.', after: '', av: 'MO', who: 'Mo', role: 'Mid-Market AE' },
  { tone: 'product', tag: 'The product', head: 'A complete picture in 60 seconds.', before: 'Just ', mark: '30 to 60 seconds, and I get a complete picture.', after: '', av: 'T', who: 'Tobia', role: 'General Sales Manager, Southern Europe' },
];

const pad2 = (n: number) => String(n).padStart(2, '0');

const Card = ({ q, i, clone }: { q: (typeof QUOTES)[number]; i: number; clone?: boolean }) => (
  <figure
    className={`tq t-${q.tone}${clone ? ' tq-clone' : ''}`}
    {...(clone ? { 'aria-hidden': true } : { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${QUOTES.length}` })}
  >
    <span className="tagline">{q.tag}</span>
    <b className="tq-h">{q.head}</b>
    <blockquote>&ldquo;{q.before}<mark>{q.mark}</mark>{q.after}&rdquo;</blockquote>
    <figcaption><span className="av" aria-hidden="true">{q.av}</span><span><b>{q.who}</b><span>{q.role}</span></span></figcaption>
  </figure>
);

const BlackFridayTestimonials = memo(function BlackFridayTestimonials() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const wheel = wheelRef.current, ring = ringRef.current, curEl = curRef.current, prev = prevRef.current, next = nextRef.current;
    if (!wheel || !ring || !curEl || !prev || !next) return;
    const cards = Array.from(ring.querySelectorAll<HTMLElement>('.tq:not(.tq-clone)'));
    const clones = Array.from(ring.querySelectorAll<HTMLElement>('.tq-clone'));
    const N = cards.length;
    const desk = window.matchMedia('(min-width: 901px)');
    const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // ---- desktop wheel ----
    const STEP = (27 * Math.PI) / 180; // angle between neighbouring cards on the rim
    const PERIOD = 4200;                // ms for one card to travel to the next position
    let phase = 0, jump: { from: number; to: number; t0: number } | null = null, act = -1;
    const wrapD = (d: number) => { d = ((d % N) + N) % N; return d > N / 2 ? d - N : d; };

    function clearInline() {
      cards.forEach((c) => { c.style.transform = ''; c.style.opacity = ''; c.style.zIndex = ''; c.style.pointerEvents = ''; c.classList.remove('is-active'); });
    }
    function place() {
      if (!desk.matches) return;
      const cur = ((Math.round(phase) % N) + N) % N;
      if (cur !== act) {
        act = cur; curEl!.textContent = pad2(act + 1);
        cards.forEach((c, i) => c.classList.toggle('is-active', i === act));
      }
      const H = wheel!.clientHeight, cw = cards[0].offsetWidth, R = 540, cx = 16 + cw / 2 + R, cy = H / 2;
      cards.forEach((c, i) => {
        const d = wrapD(i - phase), ad = Math.abs(d), a = d * STEP;
        const x = cx - R * Math.cos(a), y = cy + R * Math.sin(a);
        const s = ad <= 1 ? 1 - 0.22 * ad : Math.max(0.6, 0.78 - 0.18 * (ad - 1));
        const o = ad <= 1 ? 1 - 0.45 * ad : Math.max(0, 0.55 - 0.55 * (ad - 1));
        c.style.transform = `translate(${x - cw / 2}px,${y - c.offsetHeight / 2}px) rotate(${d * -4}deg) scale(${s})`;
        c.style.opacity = String(o); c.style.zIndex = String(10 - Math.round(ad * 2)); c.style.pointerEvents = ad > 1.5 ? 'none' : 'auto';
      });
    }

    // ---- mobile marquee ----
    const SPEED = 0.5; // px per frame (~30px/s)
    let paused = false, pos = 0, resumeT: number | undefined;
    // Distance from a card to its clone = one full loop (cards + gaps), whatever the layout.
    const loopW = () => clones[0].offsetLeft - cards[0].offsetLeft;
    const cardW = () => cards[1].offsetLeft - cards[0].offsetLeft;
    function wrap() { const h = loopW(); if (pos >= h) pos -= h; if (pos < 0) pos += h; ring!.scrollLeft = pos; }
    function pauseFor(ms: number) {
      paused = true; window.clearTimeout(resumeT);
      resumeT = window.setTimeout(() => { pos = ring!.scrollLeft; paused = false; }, ms);
    }
    const hold = () => { paused = true; window.clearTimeout(resumeT); };
    const release = () => pauseFor(2500);
    const onWheelInput = () => { if (!desk.matches) pauseFor(1500); };
    let stepRaf = 0;
    function step(dir: number) {
      hold();
      const w = cardW();
      let from = ring!.scrollLeft, to = from + dir * w, t0: number | null = null;
      if (to < 0) { from += loopW(); to += loopW(); ring!.scrollLeft = from; }
      cancelAnimationFrame(stepRaf);
      const anim = (t: number) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - p, 3);
        pos = from + (to - from) * e; wrap();
        if (p < 1) stepRaf = requestAnimationFrame(anim); else pauseFor(1200);
      };
      stepRaf = requestAnimationFrame(anim);
    }

    // ---- shared ----
    let visible = false, last = 0, raf = 0;
    function frame(t: number) {
      const dt = last ? Math.min(64, t - last) : 0; last = t;
      if (desk.matches) {
        if (jump) {
          const p = Math.min(1, (t - jump.t0) / 700), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          phase = jump.from + (jump.to - jump.from) * e; if (p >= 1) jump = null;
        } else if (visible && !reduce) {
          phase += dt / PERIOD;
        }
        place();
      } else if (visible && !paused && !reduce) {
        pos += SPEED * Math.min(3, dt / 16.7 || 1); wrap();
      }
      raf = requestAnimationFrame(frame);
    }
    function goTo(target: number) {
      jump = { from: phase, to: phase + wrapD(target - phase), t0: performance.now() };
    }

    const onPrev = () => { if (desk.matches) goTo(Math.round(phase) - 1); else step(-1); };
    const onNext = () => { if (desk.matches) goTo(Math.round(phase) + 1); else step(1); };
    prev.addEventListener('click', onPrev);
    next.addEventListener('click', onNext);
    const cardClicks = cards.map((c, i) => {
      const h = () => { if (desk.matches && i !== act) goTo(i); };
      c.addEventListener('click', h);
      return [c, h] as const;
    });
    ring.addEventListener('touchstart', hold, { passive: true });
    ring.addEventListener('touchend', release, { passive: true });
    ring.addEventListener('wheel', onWheelInput, { passive: true });

    const onResize = () => place();
    const onBreakpoint = () => {
      clearInline(); act = -1; jump = null;
      if (desk.matches) ring.scrollLeft = 0; else { pos = ring.scrollLeft; paused = false; }
      place();
    };
    window.addEventListener('resize', onResize);
    desk.addEventListener('change', onBreakpoint);

    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.1 });
      io.observe(wheel);
    } else visible = true;

    place();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(stepRaf);
      window.clearTimeout(resumeT);
      prev.removeEventListener('click', onPrev);
      next.removeEventListener('click', onNext);
      cardClicks.forEach(([c, h]) => c.removeEventListener('click', h));
      ring.removeEventListener('touchstart', hold);
      ring.removeEventListener('touchend', release);
      ring.removeEventListener('wheel', onWheelInput);
      window.removeEventListener('resize', onResize);
      desk.removeEventListener('change', onBreakpoint);
      io?.disconnect();
    };
  }, []);

  return (
    <section className="dark proof2" aria-labelledby="proof-h">
      <div className="wrap band tq-grid">
        <div className="tq-left">
          <span className="eyebrow">What elite sellers say</span>
          <h2 className="h2" id="proof-h">This year, Whyzer sellers walked into boardrooms <span>with a point of view.</span></h2>
          <div className="tq-ctrl">
            <button className="tq-btn" type="button" ref={prevRef} aria-label="Previous testimonial">&uarr;</button>
            <button className="tq-btn" type="button" ref={nextRef} aria-label="Next testimonial">&darr;</button>
            <span className="mono tq-count"><b ref={curRef}>01</b> / <span>{pad2(QUOTES.length)}</span></span>
          </div>
        </div>
        <div className="tq-wheel" ref={wheelRef} aria-roledescription="carousel" aria-label="Testimonials">
          <div className="tq-ring" ref={ringRef}>
            {QUOTES.map((q, i) => <Card key={q.who} q={q} i={i} />)}
            {QUOTES.map((q, i) => <Card key={`${q.who}-clone`} q={q} i={i} clone />)}
          </div>
        </div>
      </div>
    </section>
  );
});

export default BlackFridayTestimonials;

import { memo, useEffect, useRef } from 'react';

/**
 * The two animated product demos on the BF26 sales page.
 *
 * Both are ported from the original page's inline script, which drives the DOM imperatively
 * (typing, cursor, class toggles). They are memoized with no props or state, so React renders
 * them once and never re-renders over what the animation has changed. All animation state lives
 * inside the effects, which stop their loops on unmount.
 */

const TEXTS = {
  'r-prof': 'NVIDIA Corporation, a computing infrastructure company, provides graphics and compute and networking solutions in the United States, Singapore, Taiwan, China, Hong Kong, and internationally. The Compute & Networking segment includes its Data Centre accelerated computing platforms and AI solutions.',
  'w-name': 'Denise Holland Dresser',
  'w-p0': 'Hi Denise,',
  'w-p1': "I saw OpenAI's revenue is projected to go from $3.7 billion in 2024 to $20 billion in 2026. That's a lot of demand to serve, and I'd guess how Frontier gets distributed matters as much as the capacity behind it.",
  'w-p2': "My understanding is that OpenAI has committed to large Trainium consumption and exclusive third-party distribution on AWS for Frontier. AWS can support both the Trainium capacity and that distribution, and I'd like to explore co-engineering with your team.",
  'w-p3': 'What Trainium capacity would you need, and how do you see Frontier reaching customers through AWS?',
  'p-gist': 'NVIDIA is facing supply issues and unpredictable demand. Using Tableau, they can improve demand forecasting to stabilize revenue.',
  'p-sum': 'NVIDIA is experiencing supply constraints with volatile demand across its Vera and Blackwell systems. Tableau can centralize forecasting and scenario modeling to reduce MAPE by 20%.',
} as const;
type TextKey = keyof typeof TEXTS;

const ORDER = ['research', 'write', 'position'] as const;
type SceneName = (typeof ORDER)[number];
/** Rough length of each scene, drives the tab progress bar. */
const DUR: Record<SceneName, number> = { research: 6200, write: 8600, position: 6600 };

const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const SearchIcon = () => (
  <svg viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
);

/* ------------------------------------------------------------------ Platform demo */

export const ProductDemo = memo(function ProductDemo() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const demo = root.current;
    if (!demo) return;
    const app = demo.querySelector<HTMLElement>('.app')!;
    const main = app.querySelector<HTMLElement>('[data-main]')!;
    const tabs = Array.from(demo.querySelectorAll<HTMLElement>('[data-tab]'));
    const reduce = prefersReducedMotion();
    const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = app) => r.querySelector(s) as T;
    const $$ = (s: string, r: ParentNode = app) => Array.from(r.querySelectorAll<HTMLElement>(s));

    const cursor = $('[data-cursor]');
    const q = $('[data-q]'), qph = $('[data-qph]'), qcaret = $('[data-qcaret]'), dd = $('[data-dd]'), ddrow = $('[data-ddrow]');
    const ring = $<HTMLElement>('[data-ring]'), score = $('[data-score]'), stars = $('[data-stars]');
    const C = 251.3, FULL = C * (1 - 4.2 / 5);

    let run = 0;
    const timers = new Set<number>();
    const sleep = (ms: number, tok: number) =>
      new Promise<void>((res, rej) => {
        const t = window.setTimeout(() => { timers.delete(t); if (tok === run) res(); else rej('stop'); }, ms);
        timers.add(t);
      });
    async function type(key: TextKey, cps: number, tok: number, chunk = 1) {
      const el = $(`[data-type="${key}"]`), t = TEXTS[key];
      el.textContent = '';
      for (let i = chunk; i < t.length + chunk; i += chunk) { el.textContent = t.slice(0, i); await sleep(1000 / cps, tok); }
    }
    const show = (step: string, scene: ParentNode) => $$(`[data-step="${step}"]`, scene).forEach((el) => el.classList.remove('hide'));
    const scrollDown = () => main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    function point(el: HTMLElement) {
      const a = app.getBoundingClientRect(), r = el.getBoundingClientRect();
      cursor.classList.add('on');
      cursor.style.transform = `translate(${r.left - a.left + r.width * 0.5}px,${r.top - a.top + r.height * 0.55}px)`;
    }
    async function click(tok: number) {
      cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
      await sleep(193, tok);
    }

    function setTab(name: SceneName, dur: number) {
      tabs.forEach((t) => {
        const on = t.getAttribute('data-tab') === name, bar = t.querySelector<HTMLElement>('.dbar i')!;
        t.classList.toggle('on', on); t.setAttribute('aria-selected', on ? 'true' : 'false');
        bar.style.transition = 'none'; bar.style.width = '0';
        if (on && dur) { void bar.offsetWidth; bar.style.transition = `width ${dur}ms linear`; bar.style.width = '100%'; }
      });
      $$('.app-side i').forEach((i) => i.classList.toggle('on', i.getAttribute('data-nav') === name));
    }
    function resetScene(name: SceneName) {
      $$('[data-scene]').forEach((s) => { s.hidden = s.getAttribute('data-scene') !== name; });
      const scene = $(`[data-scene="${name}"]`);
      $$('[data-step]', scene).forEach((el) => el.classList.add('hide'));
      $$('[data-type]', scene).forEach((el) => { el.textContent = ''; });
      main.scrollTop = 0;
      q.textContent = ''; qph.hidden = false; qcaret.classList.remove('on'); dd.classList.remove('on'); ddrow.classList.remove('hl');
      cursor.classList.remove('on', 'click');
      return scene;
    }
    /** Final, fully drawn state for a scene (reduced motion, and before the demo starts). */
    function finalScene(name: SceneName) {
      $$('[data-scene]').forEach((s) => { s.hidden = s.getAttribute('data-scene') !== name; });
      const scene = $(`[data-scene="${name}"]`);
      $$('[data-step]', scene).forEach((el) => el.classList.remove('hide'));
      $$('[data-type]', scene).forEach((el) => { el.textContent = TEXTS[el.getAttribute('data-type') as TextKey]; });
      main.scrollTop = 0; cursor.classList.remove('on');
      if (name === 'research') { q.textContent = 'NVIDIA'; qph.hidden = true; } else { q.textContent = ''; qph.hidden = false; }
      if (name === 'position') { $('[data-pgen]').classList.add('gone'); ring.style.strokeDashoffset = String(FULL); score.textContent = '4.2'; stars.classList.remove('dim'); }
      setTab(name, 0);
    }

    const scenes: Record<SceneName, (tok: number) => Promise<void>> = {
      research: async (tok) => {
        const sc = resetScene('research');
        await sleep(275, tok);
        point($('.app-search')); await sleep(385, tok); await click(tok);
        qph.hidden = true; qcaret.classList.add('on');
        const w = 'NVIDIA';
        for (let i = 1; i <= w.length; i++) { q.textContent = w.slice(0, i); await sleep(75, tok); }
        await sleep(138, tok); dd.classList.add('on'); await sleep(248, tok);
        point(ddrow); ddrow.classList.add('hl'); await sleep(413, tok); await click(tok);
        dd.classList.remove('on'); qcaret.classList.remove('on'); cursor.classList.remove('on');
        await sleep(138, tok); show('r1', sc); await sleep(330, tok);
        show('r2', sc); await sleep(275, tok); show('r3', sc);
        await type('r-prof', 90, tok, 6);
        show('r4', sc); await sleep(1430, tok);
      },
      write: async (tok) => {
        const sc = resetScene('write'), wc = $('[data-wcaret]');
        await sleep(220, tok);
        point($('.w-input', sc)); await sleep(385, tok); await click(tok);
        wc.classList.add('on'); await type('w-name', 30, tok, 2); wc.classList.remove('on');
        await sleep(138, tok); cursor.classList.remove('on'); show('w2', sc); await sleep(440, tok);
        show('w3', sc); await sleep(165, tok); scrollDown(); await sleep(275, tok);
        await type('w-p0', 40, tok, 2); await sleep(120, tok);
        for (const k of ['w-p1', 'w-p2', 'w-p3'] as const) { await type(k, 90, tok, 7); scrollDown(); await sleep(138, tok); }
        show('w4', sc); await sleep(165, tok); scrollDown(); await sleep(330, tok);
        const cp = $('[data-copye]', sc); point(cp); await sleep(440, tok); await click(tok);
        cp.classList.add('hit'); cp.textContent = '✓ Copied'; await sleep(880, tok);
        cp.classList.remove('hit'); cp.textContent = '⧉ Copy email'; await sleep(330, tok);
      },
      position: async (tok) => {
        const sc = resetScene('position'), gen = $('[data-pgen]', sc), gtxt = $('[data-pgentxt]', sc), prog = $('[data-pprog]', sc);
        gen.classList.remove('gone'); prog.style.width = '0';
        ring.style.transition = 'none'; ring.style.strokeDashoffset = String(C); void ring.getBoundingClientRect(); ring.style.transition = '';
        score.textContent = '0.0'; stars.classList.add('dim');
        const msgs = [['Reading the 10-K and earnings calls…', '38%'], ['Mapping priorities and risks…', '72%'], ['Scoring the opportunity…', '100%']];
        await sleep(165, tok);
        for (const [text, pct] of msgs) { gtxt.textContent = text; prog.style.width = pct; await sleep(550, tok); }
        gen.classList.add('gone'); show('p2', sc); await sleep(165, tok);
        await type('p-gist', 90, tok, 6); await type('p-sum', 90, tok, 6);
        show('p3', sc); await sleep(120, tok);
        ring.style.strokeDashoffset = String(FULL);
        for (let s = 1; s <= 42; s++) { score.textContent = (s / 10).toFixed(1); await sleep(18, tok); }
        stars.classList.remove('dim'); await sleep(275, tok);
        show('p4', sc); await sleep(275, tok);
        const inf = $('.p-acts span:nth-child(2)', sc); point(inf); await sleep(495, tok); await click(tok);
        await sleep(1100, tok); cursor.classList.remove('on');
      },
    };

    async function loop(start: SceneName) {
      const tok = ++run;
      let i = ORDER.indexOf(start);
      try {
        while (tok === run) {
          const name = ORDER[i];
          setTab(name, DUR[name]);
          await scenes[name](tok);
          i = (i + 1) % ORDER.length;
        }
      } catch { /* a newer run (or unmount) took over */ }
    }

    const onTab = (t: HTMLElement) => () => {
      const name = t.getAttribute('data-tab') as SceneName;
      if (reduce) { run++; finalScene(name); } else { loop(name); }
    };
    const handlers = tabs.map((t) => { const h = onTab(t); t.addEventListener('click', h); return [t, h] as const; });

    finalScene('research');
    let io: IntersectionObserver | undefined;
    if (!reduce) {
      if ('IntersectionObserver' in window) {
        let started = false;
        io = new IntersectionObserver((es) => {
          es.forEach((e) => { if (e.isIntersecting && !started) { started = true; loop('research'); io?.disconnect(); } });
        }, { threshold: 0.35 });
        io.observe(app);
      } else { loop('research'); }
    }

    return () => {
      run++; // every pending sleep() now rejects and its loop exits
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      io?.disconnect();
      handlers.forEach(([t, h]) => t.removeEventListener('click', h));
    };
  }, []);

  return (
    <div className="demo" data-demo ref={root}>
      <div className="demo-tabs" role="tablist" aria-label="Platform demo">
        <button className="dtab on" role="tab" type="button" data-tab="research" aria-selected="true"><span className="dk">Research</span><span className="dt">Know what keeps them up before you say a word.</span><span className="dbar"><i></i></span></button>
        <button className="dtab" role="tab" type="button" data-tab="write" aria-selected="false"><span className="dk">Write</span><span className="dt">The first email that doesn't sound like the last ten.</span><span className="dbar"><i></i></span></button>
        <button className="dtab" role="tab" type="button" data-tab="position" aria-selected="false"><span className="dk">Position</span><span className="dt">A case built on their numbers survives the first question.</span><span className="dbar"><i></i></span></button>
      </div>

      <div className="app" aria-hidden="true">
        <div className="app-chrome"><i></i><i></i><i></i><span>app.whyzer.ai</span></div>
        <div className="app-top">
          <span className="app-logo"><img src="/bf26/app-mark.png" alt="" /></span>
          <div className="app-search"><SearchIcon /><span className="q" data-q></span><span className="ph" data-qph>Search companies</span><span className="caret" data-qcaret></span><kbd>⌘K</kbd>
            <div className="dd" data-dd><div className="dd-row" data-ddrow><span className="co nv">N</span><span><b>NVIDIA Corp</b><small>NVDA · NASDAQ</small></span><span className="go-k">↵</span></div></div>
          </div>
          <span className="app-plus">+</span>
          <span className="app-right"><span className="pill-s">Admin</span><span className="avatar-s">MB</span></span>
        </div>
        <div className="app-body">
          <div className="app-side">
            <span className="co nv sm">N</span>
            <i data-nav="home"></i><i data-nav="research"></i><i></i><i data-nav="write"></i><i data-nav="position"></i><i></i>
          </div>
          <div className="app-main" data-main>

            {/* RESEARCH */}
            <div className="scene" data-scene="research">
              <div className="sc-head"><span className="sc-ico">⌕</span><div><b>Research</b><small>Company intelligence, sourced from filings and calls.</small></div></div>
              <div className="r-card" data-step="r1">
                <div className="r-top"><span className="co nv lg">N</span><div><b>Nvidia Corporation</b><span className="a-chip">Semiconductors</span></div><span className="r-btns"><span className="ghost">✓ In Accounts</span><span className="ghost">↻ Refresh</span></span></div>
                <div className="r-sig" data-step="r2"><span><b>Opportunity Signals</b> <em>BETA</em><small>Why-now insights for selling Tableau into this account.</small></span><span className="mini-btn">Generate</span></div>
                <div className="r-prof" data-step="r3">
                  <span className="lbl">Company profile</span>
                  <p data-type="r-prof">{TEXTS['r-prof']}</p>
                </div>
                <div className="r-tags" data-step="r4"><span>10-K · FY2026</span><span>Q3 earnings call</span><span>Investor day</span><span>8-K filings</span></div>
              </div>
            </div>

            {/* WRITE */}
            <div className="scene" data-scene="write" hidden>
              <div className="sc-head"><span className="sc-ico">✎</span><div><b>Write</b><small>Select a person to build or refine your outreach campaign.</small></div></div>
              <div className="w-target">
                <div className="w-row"><b>Target Person</b><span className="ok" data-step="w2">Target selected</span></div>
                <div className="w-input"><SearchIcon /><span data-type="w-name">{TEXTS['w-name']}</span><span className="caret" data-wcaret></span></div>
                <div className="w-active" data-step="w2"><span className="dd-av">DD</span><div><small>Active target</small><b>Denise Holland Dresser</b><span>Chief Revenue Officer at OpenAI</span></div></div>
              </div>
              <div className="w-mail" data-step="w3">
                <small className="lbl">Subject</small>
                <b className="subj">OpenAI Frontier on AWS</b>
                <div className="w-box">
                  <b>Revenue growth and compute capacity</b>
                  <p data-type="w-p0">{TEXTS['w-p0']}</p>
                  <p data-type="w-p1">{TEXTS['w-p1']}</p>
                  <p data-type="w-p2">{TEXTS['w-p2']}</p>
                  <p data-type="w-p3">{TEXTS['w-p3']}</p>
                  <div className="w-act" data-step="w4"><span>✉ Send via ▾</span><span className="copy-e" data-copye>⧉ Copy email</span></div>
                </div>
              </div>
            </div>

            {/* POSITION */}
            <div className="scene" data-scene="position" hidden>
              <div className="p-head"><div><b>Dossier</b> <span className="a-chip sm">New</span><small>Generated today · NVIDIA Corp</small></div><span className="r-btns"><span className="mini-btn">↻ Regenerate</span><span className="ghost">Share</span><span className="ghost">Export</span></span></div>
              <div className="p-tabs"><span className="on">POV Studio</span><span>Intelligence</span></div>
              <div className="p-povs"><span className="on">Financial Pressure: Demand Forecasting</span><span>GTM Positioning: Hyperscaler CapEx Growth</span><span>Operational Initiative: Accelerated Decision-Making</span></div>
              <div className="p-gen" data-pgen><span className="spin"></span><span data-pgentxt>Reading the 10-K and earnings calls…</span><span className="p-prog"><i data-pprog></i></span></div>
              <div className="p-body" data-step="p2">
                <div className="p-left">
                  <b className="p-title">Financial Pressure: Demand Forecasting</b>
                  <div className="p-boxes">
                    <div className="p-box"><small>The gist</small><p data-type="p-gist">{TEXTS['p-gist']}</p></div>
                    <div className="p-box"><small>Strategist summary</small><p data-type="p-sum">{TEXTS['p-sum']}</p></div>
                  </div>
                  <div className="p-acts" data-step="p4"><span>▣ Generate Sales deck</span><span>◧ Create Infographic</span><span className="ai">✦ Edit with AI</span></div>
                </div>
                <div className="p-score" data-step="p3">
                  <small>Opportunity score</small>
                  <svg viewBox="0 0 100 100"><defs><linearGradient id="bf26s-sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6262E9" /><stop offset="1" stopColor="#C084FC" /></linearGradient></defs><circle cx="50" cy="50" r="40" fill="none" stroke="#ECEBF5" strokeWidth="9" /><circle data-ring cx="50" cy="50" r="40" fill="none" stroke="url(#bf26s-sg)" strokeWidth="9" strokeLinecap="round" strokeDasharray="251.3" strokeDashoffset="50.3" transform="rotate(-90 50 50)" /></svg>
                  <span className="num"><b data-score>4.2</b><i>HIGH</i></span>
                  <span className="stars" data-stars><i></i><i></i><i></i><i></i><i className="off"></i></span>
                  <small className="ev">Evidence: <b>High</b></small>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Direct child of .app so its coordinates are relative to the app frame. */}
        <div className="cursor" data-cursor></div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ POV -> deliverable */

export const DeliverDemo = memo(function DeliverDemo() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const dv = el.querySelector<HTMLElement>('[data-dv]')!;
    const reduce = prefersReducedMotion();
    const q = <T extends HTMLElement = HTMLElement>(s: string) => dv.querySelector(s) as T;
    const b1 = el.querySelector<HTMLElement>('.dv-b.b1')!, b2 = el.querySelector<HTMLElement>('.dv-b.b2')!;
    const label = q('[data-bd-label]'), title = q('[data-bd-title]'), sec = q('[data-bd-sec]'), state = q('[data-bd-state]');
    const spins = Array.from(dv.querySelectorAll<HTMLElement>('.spin')), prog = q('[data-bd-prog]');
    const info = q('[data-bd-info]'), deck = q('[data-bd-deck]'), icI = q('[data-bd-ico-info]'), icD = q('[data-bd-ico-deck]');

    let alive = true;
    let clock: number | undefined;
    const timers = new Set<number>();
    const wait = (ms: number) => new Promise<void>((res, rej) => {
      const t = window.setTimeout(() => { timers.delete(t); if (alive) res(); else rej('stop'); }, ms);
      timers.add(t);
    });
    const setSpins = (visible: boolean) => spins.forEach((s) => { s.style.visibility = visible ? 'visible' : 'hidden'; });

    async function build(mode: 'info' | 'deck') {
      const isDeck = mode === 'deck';
      const items = Array.from((isDeck ? deck : info).querySelectorAll<HTMLElement>(isDeck ? '.bd-sl' : '.bi-p'));
      b1.classList.toggle('on', !isDeck); b2.classList.toggle('on', isDeck);
      info.hidden = isDeck; deck.hidden = !isDeck; icI.hidden = isDeck; icD.hidden = !isDeck;
      title.textContent = isDeck ? 'Deck' : 'Infographic';
      label.textContent = isDeck ? 'Building deck' : 'Building infographic';
      state.textContent = 'Building'; state.className = ''; setSpins(true);
      items.forEach((it) => it.classList.remove('cur', 'done'));
      prog.style.width = '0'; let t = 0; sec.textContent = '0s';
      clock = window.setInterval(() => { t++; sec.textContent = `${t}s`; }, 1000);
      const step = isDeck ? 420 : 620;
      for (let i = 0; i < items.length; i++) {
        items[i].classList.add('cur'); prog.style.width = `${((i + 1) / items.length) * 100}%`;
        await wait(step);
        items[i].classList.remove('cur'); items[i].classList.add('done');
      }
      window.clearInterval(clock);
      state.textContent = 'Ready'; state.className = 'ready'; sec.textContent = '';
      label.textContent = isDeck ? 'Deck ready' : 'Infographic ready';
      setSpins(false);
      await wait(1600);
    }
    async function loop() {
      try { while (alive) { await build('info'); await build('deck'); } } catch { /* unmounted */ }
    }

    // Static final frame for reduced motion, and until the loop starts.
    const finalFrame = () => {
      b1.classList.add('on');
      info.querySelectorAll('.bi-p').forEach((p) => p.classList.add('done'));
      state.textContent = 'Ready'; state.className = 'ready'; sec.textContent = '';
      label.textContent = 'Infographic ready'; setSpins(false);
    };
    let io: IntersectionObserver | undefined;
    if (reduce) finalFrame();
    else if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io?.disconnect(); loop(); } }, { threshold: 0.4 });
      io.observe(dv);
    } else loop();

    return () => {
      alive = false;
      window.clearInterval(clock);
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      io?.disconnect();
    };
  }, []);

  return (
    <div className="deliver" ref={root}>
      <div className="dv-copy">
        <span className="eyebrow">From POV to deliverable</span>
        <p className="dv-lead">Hit <strong>Create Infographic</strong> or <strong>Generate Sales deck</strong> on any POV. Sourced, branded, ready to send.</p>
        <div className="dv-btns" aria-hidden="true"><span className="dv-b b1">◧ Create Infographic</span><span className="dv-b b2">▣ Generate Sales deck</span></div>
      </div>
      <div className="dv-out" aria-hidden="true" data-dv>
        <div className="bd-status"><span className="spin"></span><span data-bd-label>Building infographic</span></div>
        <div className="bd-card">
          <span className="bd-line"><i data-bd-prog></i></span>
          <div className="bd-head">
            <span className="bd-ico" data-bd-ico-info><svg viewBox="0 0 20 20"><rect x="2.5" y="3" width="15" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M6 13V10M10 13V7M14 13V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
            <span className="bd-ico" data-bd-ico-deck hidden><svg viewBox="0 0 20 20"><rect x="2" y="3" width="16" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M7 17h6M10 14v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
            <b data-bd-title>Infographic</b>
            <span className="bd-timer"><span className="spin" data-bd-spin></span><span data-bd-state>Building</span> <span data-bd-sec>0s</span></span>
          </div>
          <div className="bd-info" data-bd-info>
            <div className="bi-title"><i></i><i></i></div>
            <div className="bi-cols">
              <div className="bi-p"><i></i><i></i><i></i><i></i></div>
              <div className="bi-mid"><div className="bi-p"><i></i><i></i></div><div className="bi-p"><i></i><i></i></div></div>
              <div className="bi-p"><i></i><i></i><i></i></div>
            </div>
          </div>
          <div className="bd-deck" data-bd-deck hidden>
            {Array.from({ length: 8 }, (_, i) => <div className="bd-sl" key={i}><i></i><i></i></div>)}
          </div>
        </div>
      </div>
    </div>
  );
});

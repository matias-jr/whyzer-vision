import { useCallback, useEffect, useRef, useState } from 'react';
import { useUtmParams } from '@/hooks/useUtmParams';
import HomeV8View from './HomeV8View';
import './home-v8.css';

// Behaviour for the v8 home page (ported from the Claude Design mockup's DCLogic
// component). The markup lives in HomeV8View.tsx.

const VIDEO_IDS = [
  '17SSz4dFPsQfu45ZDA2E75aB5IPY_cUy0',
  '1VVgPIVPlUtmQf--VtGTEYlJ8r6XQvRLC',
  '13zEpUa8VW_H3MGpCvTXyPhnesR9HhMug',
  '1AY3WDzA1YJPrxBwafOhAZfWth7lDEeze',
  '1zdsD-_TGVYMU9Xm1WwVvSrtW0gE9L7av',
  '1F3bzUUKVm_E-iZ-nEFCujS7KHvKMPiP7',
  '18nsTfMy_kRv2ShYL_5zNuX_lavqq5PfM',
  '1bVcNNEdgGik76e0to5RTKpaJ_4Ur5wfU',
];

const VIDEO_META = [
  { name: 'Danny H.', role: 'Enterprise AE', length: '1:12', quote: 'Three minutes before an exec call I pulled the CEO’s own promise to investors. Six weeks later it closed.' },
  { name: 'Kyle G.', role: 'Enterprise AE', length: '0:58', quote: 'Like OpenAI and Perplexity’s deep research had a baby who gives a damn about enterprise selling.' },
  { name: 'David Inukpuk', role: 'Strategic Accounts', length: '1:24', quote: 'What used to take a rep a year, I can do in two weeks with Whyzer.' },
  { name: 'Lee Winer', role: 'Sales Director', length: '1:05', quote: 'It makes 10-Ks, 10-Qs and earnings reports actually usable for salespeople.' },
  { name: 'Paul Hammond', role: 'Enterprise AE', length: '0:47', quote: 'Whyzer flagged a breach that got me a CISO meeting on my first try.' },
  { name: 'Matt Brown', role: 'Account Executive', length: '1:16', quote: 'Feels like a business analyst is watching your back before every call.' },
  { name: 'Jeff Clarke', role: 'Enterprise AE', length: '1:02', quote: 'Even on accounts I follow closely it surfaces things that make me think: how did I not know that?' },
  { name: 'Rob Sader', role: 'Sales Leader', length: '1:09', quote: 'I need data and metrics when I speak to executives. This is necessary in our profession.' },
];

const POSTERS = [
  'linear-gradient(150deg,#2A2352,#0F1230)',
  'linear-gradient(150deg,#123049,#0C1226)',
  'linear-gradient(150deg,#33224A,#120F28)',
  'linear-gradient(150deg,#1B3350,#0B1224)',
  'linear-gradient(150deg,#2E2148,#100E24)',
  'linear-gradient(150deg,#14344A,#0A1122)',
  'linear-gradient(150deg,#302049,#120E26)',
  'linear-gradient(150deg,#1A2E4C,#0B1024)',
];

const TIERS = [
  { deg: '-58deg', hub: '#7C7FA0', color: '#DADAF2', amount: '$20', unit: '/mo', caption: 'Generic AI. Cheap, unsourced, and you still verify every line yourself.' },
  { deg: '2deg', hub: '#6262e9', color: '#ffffff', amount: '$57', unit: '/seat/mo', caption: 'The smart middle. Sourced like an analyst, priced like software.' },
  { deg: '64deg', hub: '#B3413F', color: '#F0C9C8', amount: '$44K', unit: '/yr', caption: 'Enterprise tools. Procurement, annual commitment, six-week approval.' },
];

const TOURS = [
  'Search any company — 10,500+ covered, public and private.',
  'DealMap turns the whole account into one picture you can defend.',
  'Every earnings call, summarised with the metrics that matter.',
  'POV Studio scores the opportunity and builds the deck.',
  'Your accounts, watched for hires, funding and M&A.',
];

const QUOTE_SETS = [
  [
    { q: "It's like OpenAI and Perplexity's deep research had a baby who gives a damn about enterprise selling.", n: 'Kyle G.', r: 'Enterprise AE' },
    { q: 'What used to take a rep a year, I can do in two weeks with Whyzer. It helps us work on the right accounts.', n: 'David Inukpuk', r: 'Strategic Accounts' },
    { q: 'Whyzer makes 10-Ks, 10-Qs and earnings reports actually usable for salespeople. Nothing else got close.', n: 'Lee Winer', r: 'Sales Director' },
  ],
  [
    { q: 'Feels like a business analyst is watching your back — all the context is laid out before the call.', n: 'Matt Brown', r: 'Account Executive' },
    { q: 'Whyzer flagged a cybersecurity breach that got me a CISO meeting on my first try. It worked immediately.', n: 'Paul Hammond', r: 'Enterprise AE' },
    { q: 'The podcast gave me a really good idea of how to structure not just the deal, but the talk prep.', n: 'Mo', r: 'Mid-Market AE' },
  ],
  [
    { q: 'First tool I have found that resonates with the way I actually dig into clients. Amazing prompts.', n: 'Bill Neal', r: 'Regional VP' },
    { q: 'Even on accounts I follow closely, Whyzer surfaces things that make me think: how did I not know that?', n: 'Jeff Clarke', r: 'Enterprise AE' },
    { q: 'I need data and metrics when I speak to executives. This is absolutely necessary in our profession.', n: 'Rob Sader', r: 'Sales Leader' },
  ],
];

const CHIPS = [
  { found: false, text: '“Supply constraints…” — Q1 earnings call' },
  { found: false, text: '“CapEx growth tied to hyperscalers” — 10-K' },
  { found: true, text: 'Surfaced in a 2-minute POV' },
  { found: false, text: '“Misallocating output delays deployment” — investor call' },
  { found: false, text: '“Board mandate on margin discipline” — proxy statement' },
  { found: true, text: 'Turned into a boardroom-ready POV' },
  { found: false, text: '“Revenue concentration with hyperscalers” — 10-K' },
  { found: false, text: '“Accelerated allocation decision-making” — Q1 call' },
];

const CURRENCIES = { GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'AU$', USD: '$' };
const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
  'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'CH','NO','IS','AL','BA','ME','MK','RS','MD','UA','BY','GE','AM','AZ',
  'LI','MC','SM','VA','AD','XK',
]);

const EXIT_KEY = 'whyzer_exit_intent_seen';

type State = {
  tab: number; stripX: string;
  tourCursor: string; tourRipple: number; tourRippleOp: number;
  typed: string; heroCursor: string; heroRipple: number; heroRippleOp: number;
  heroOpA: number; heroOpB: number;
  qi: number; annual: boolean; sym: string; region: string;
  exitOpen: boolean; tier: number; vPage: number; vOpen: number | null;
};

const INITIAL: State = {
  tab: 0, stripX: '0%',
  tourCursor: 'translate(220px, -46px)', tourRipple: 0.2, tourRippleOp: 0,
  typed: '', heroCursor: 'translate(120px, 300px)', heroRipple: 0.2, heroRippleOp: 0,
  heroOpA: 1, heroOpB: 0,
  qi: 0, annual: true, sym: '$', region: '',
  exitOpen: false, tier: 1, vPage: 0, vOpen: null,
};

const HomeV8 = () => {
  const [st, setSt] = useState<State>(INITIAL);
  const stRef = useRef(st);
  stRef.current = st;
  const set = useCallback(
    (p: Partial<State> | ((s: State) => Partial<State>)) =>
      setSt((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })),
    [],
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const appendUtm = useUtmParams();
  const flags = useRef({ manual: false, gaugeManual: false });
  // Imperative hooks set up by the effects below and used by the click handler.
  const api = useRef<{
    later: (fn: () => void, ms: number) => void;
    goTab: (i: number, click?: boolean) => void;
    showMonthly: () => void;
  }>({ later: () => {}, goTab: () => {}, showMonthly: () => {} });

  // ---- animation loops (hero demo, product tour, price gauge) ----
  useEffect(() => {
    let mounted = true;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        if (mounted) fn();
      }, ms);
      timers.add(t);
    };
    api.current.later = later;

    const root = () => rootRef.current;

    const goTab = (i: number, click?: boolean) => {
      const rail = root()?.querySelector('[data-wz-rail]');
      const btn = rail?.querySelector(`[data-wz-tab="${i}"]`) as HTMLElement | null;
      const frame = rail?.parentElement;
      if (btn && frame) {
        const b = btn.getBoundingClientRect();
        const f = frame.getBoundingClientRect();
        const x = Math.round(b.left - f.left + b.width / 2);
        const y = Math.round(b.top - f.top + b.height / 2 - 66);
        set({ tourCursor: `translate(${x}px, ${y}px)` });
      }
      const fire = () => {
        set({ tab: i, stripX: `-${i * 20}%`, tourRipple: 1.05, tourRippleOp: 1 });
        later(() => set({ tourRipple: 0.2, tourRippleOp: 0 }), 340);
      };
      if (click) fire();
      else later(fire, 620);
    };
    api.current.goTab = goTab;

    const tourLoop = (next: number) => {
      goTab(next % 5);
      later(() => {
        if (!flags.current.manual) tourLoop((next + 1) % 5);
        else
          later(() => {
            flags.current.manual = false;
            tourLoop((stRef.current.tab + 1) % 5);
          }, 9000);
      }, 4600);
    };

    const type = (word: string, i: number) => {
      if (i > word.length) return;
      set({ typed: word.slice(0, i) });
      later(() => type(word, i + 1), 130);
    };

    const heroLoop = () => {
      const seq: [number, () => void][] = [
        [200, () => set({ heroCursor: 'translate(150px, 205px)', typed: '', heroOpA: 1, heroOpB: 0 })],
        [1100, () => set({ heroRipple: 1.05, heroRippleOp: 1 })],
        [360, () => set({ heroRipple: 0.2, heroRippleOp: 0 })],
        [260, () => type('NVIDIA', 0)],
        [1500, () => set({ heroCursor: 'translate(300px, 208px)' })],
        [700, () => set({ heroRipple: 1.05, heroRippleOp: 1 })],
        [320, () => set({ heroRipple: 0.2, heroRippleOp: 0, heroOpA: 0, heroOpB: 1 })],
        [4200, heroLoop],
      ];
      let acc = 0;
      seq.forEach(([d, fn]) => { acc += d; later(fn, acc); });
    };

    const gaugeLoop = () => {
      later(() => {
        if (!flags.current.gaugeManual) set((s) => ({ tier: (s.tier + 1) % 3 }));
        gaugeLoop();
      }, 2600);
    };

    // Respect reduced-motion: leave the demos on their first frame.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      heroLoop();
      gaugeLoop();
      tourLoop(1);
    }

    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, [set]);

  // ---- count-up stats + scroll reveals ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const counters = Array.from(root.querySelectorAll<HTMLElement>('[data-wz-count]'));
    counters.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(.8)';
      el.style.transition = 'opacity .5s ease, transform .6s cubic-bezier(.2,1.4,.4,1)';
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
          const target = parseInt(el.dataset.wzCount || '0', 10);
          const pre = el.dataset.prefix || '';
          const suf = el.dataset.suffix || '';
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / 1500);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = pre + Math.round(target * ease).toLocaleString('en-US') + suf;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((el) => io.observe(el));

    const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-wz-reveal]'));
    reveals.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      el.style.transition = 'opacity .7s ease, transform .8s cubic-bezier(.2,.8,.2,1)';
    });
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'none';
          ro.unobserve(el);
        });
      },
      { threshold: 0.18 },
    );
    reveals.forEach((el) => ro.observe(el));
    return () => { io.disconnect(); ro.disconnect(); };
  }, []);

  // ---- exit intent: once per session, armed after 3s (same rules as the previous home page) ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') set({ exitOpen: false, vOpen: null });
    };
    document.addEventListener('keydown', onKey);

    let seen = false;
    try { seen = sessionStorage.getItem(EXIT_KEY) === '1'; } catch { /* private mode */ }
    let armTimer: number | undefined;
    let teardown = () => {};
    if (!seen) {
      let armed = false;
      armTimer = window.setTimeout(() => { armed = true; }, 3000);
      const fire = () => {
        if (!armed) return;
        set({ exitOpen: true });
        try { sessionStorage.setItem(EXIT_KEY, '1'); } catch { /* ignore */ }
        teardown();
      };
      const onOut = (e: MouseEvent) => { if (e.clientY <= 4) fire(); };
      const onVis = () => { if (document.visibilityState === 'hidden') fire(); };
      teardown = () => {
        document.removeEventListener('mouseout', onOut);
        document.removeEventListener('mouseleave', onOut);
        document.removeEventListener('visibilitychange', onVis);
      };
      document.addEventListener('mouseout', onOut);
      document.addEventListener('mouseleave', onOut);
      document.addEventListener('visibilitychange', onVis);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      if (armTimer) window.clearTimeout(armTimer);
      teardown();
    };
  }, [set]);

  // lock page scroll behind the modals
  useEffect(() => {
    if (!st.exitOpen && st.vOpen === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [st.exitOpen, st.vOpen]);

  // ---- pricing: #pricing-monthly deep link + geolocated currency / checkout region ----
  useEffect(() => {
    const showMonthly = () => {
      set({ annual: false });
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      try { history.replaceState(null, '', '#pricing-monthly'); } catch { /* ignore */ }
    };
    api.current.showMonthly = showMonthly;
    const onHash = () => { if (window.location.hash === '#pricing-monthly') showMonthly(); };
    window.addEventListener('hashchange', onHash);
    let t: number | undefined;
    if (window.location.hash === '#pricing-monthly') t = window.setTimeout(showMonthly, 300);

    let alive = true;
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        const c: string = data.country_code ?? '';
        if (c === 'GB') set({ sym: CURRENCIES.GBP, region: '-uk' });
        else if (EU_COUNTRIES.has(c)) set({ sym: CURRENCIES.EUR, region: '-eu' });
        else if (c === 'CA') set({ sym: CURRENCIES.CAD, region: '-ca' });
        else if (c === 'AU') set({ sym: CURRENCIES.AUD, region: '-au' });
      })
      .catch(() => { /* keep USD */ });
    return () => {
      alive = false;
      window.removeEventListener('hashchange', onHash);
      if (t) window.clearTimeout(t);
    };
  }, [set]);

  // ---- delegated clicks (mirrors the mockup's data-wz-* hooks) ----
  const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    const target = ev.target as Element;
    if (!target.closest) return;
    const root = rootRef.current;
    const nav = root?.querySelector('.wz-nav');
    const burger = target.closest('[data-wz-menu]');
    if (burger && nav) {
      const open = nav.classList.toggle('wz-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    if (nav && target.closest('.wz-nav-links a')) nav.classList.remove('wz-open');

    // "Try Whyzer for Free" CTAs request the monthly (free-trial) view.
    if (target.closest('a[href="#pricing-monthly"]')) {
      ev.preventDefault();
      api.current.showMonthly();
      return;
    }
    // Checkout CTAs: forward the LinkedIn click id so the conversion can be matched server-side.
    if (target.closest('[data-wz-checkout]')) {
      const m = document.cookie.split('; ').find((r) => r.startsWith('li_fat_id='));
      const li_fat_id = m ? m.split('=')[1] : null;
      if (li_fat_id) {
        fetch('/api/track-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ li_fat_id }),
        }).catch(() => {});
      }
    }

    const t = target.closest(
      '[data-wz-tab],[data-wz-quote],[data-wz-bill],[data-wz-exit],[data-wz-tier],[data-wz-vnav],[data-wz-vid],[data-wz-vclose],[data-wz-vstep]',
    ) as HTMLElement | null;
    if (!t) return;
    const ds = t.dataset;
    if (ds.wzTab !== undefined) {
      ev.preventDefault();
      flags.current.manual = true;
      api.current.goTab(parseInt(ds.wzTab, 10), true);
    } else if (ds.wzQuote) {
      ev.preventDefault();
      const dir = ds.wzQuote === 'next' ? 1 : -1;
      set((s) => ({ qi: (s.qi + dir + QUOTE_SETS.length) % QUOTE_SETS.length }));
    } else if (ds.wzBill) {
      ev.preventDefault();
      const k = ds.wzBill;
      set((s) => ({ annual: k === 'toggle' ? !s.annual : k === 'annual' }));
    } else if (ds.wzExit) {
      ev.preventDefault();
      set({ exitOpen: false });
    } else if (ds.wzTier !== undefined) {
      ev.preventDefault();
      flags.current.gaugeManual = true;
      set({ tier: parseInt(ds.wzTier, 10) });
      api.current.later(() => { flags.current.gaugeManual = false; }, 9000);
    } else if (ds.wzVnav) {
      ev.preventDefault();
      const pages = Math.max(1, VIDEO_IDS.length - 2);
      const dir = ds.wzVnav === 'next' ? 1 : -1;
      set((s) => ({ vPage: (s.vPage + dir + pages) % pages }));
    } else if (ds.wzVid !== undefined) {
      ev.preventDefault();
      set({ vOpen: parseInt(ds.wzVid, 10) });
    } else if (ds.wzVclose) {
      ev.preventDefault();
      set({ vOpen: null });
    } else if (ds.wzVstep) {
      ev.preventDefault();
      const dir = parseInt(ds.wzVstep, 10);
      const n = VIDEO_IDS.length;
      set((s) => ({ vOpen: (((s.vOpen || 0) + dir + n) % n) }));
    }
  };

  // ---- derived values for the view ----
  const s = st;
  const on = (i: number) => s.tab === i;
  const d: Record<string, unknown> = {
    stripX: s.stripX,
    tourCursor: s.tourCursor, tourRipple: s.tourRipple, tourRippleOp: s.tourRippleOp,
    tourCaption: TOURS[s.tab],
    heroCursor: s.heroCursor, heroRipple: s.heroRipple, heroRippleOp: s.heroRippleOp,
    heroOpA: s.heroOpA, heroOpB: s.heroOpB, typed: s.typed,
    knobLeft: s.annual ? '24px' : '3px',
    billMonthlyColor: s.annual ? '#8A8AA0' : '#14141F',
    billAnnualColor: s.annual ? '#14141F' : '#8A8AA0',
    premiumPrice: s.sym + (s.annual ? '47' : '57'),
    elitePrice: s.sym + (s.annual ? '83' : '97'),
    premiumNote: s.sym + (s.annual ? '570.00' : '684.00') + '/year',
    eliteNote: s.sym + (s.annual ? '997.00' : '1,164.00') + '/year',
    ctaPremium: s.annual ? 'Get Started Now' : 'Start Your Free Trial',
    ctaElite: s.annual ? 'Get Started' : 'Start Your Free Trial',
    showTrialNote: !s.annual,
    premiumLink: appendUtm('https://subscribe.whyzer.ai/premium-' + (s.annual ? 'annually' : 'monthly') + s.region),
    eliteLink: appendUtm('https://subscribe.whyzer.ai/elite-' + (s.annual ? 'annually' : 'monthly') + s.region),
    year: new Date().getFullYear(),
    exitOpen: s.exitOpen,
    needleDeg: TIERS[s.tier].deg, needleHub: TIERS[s.tier].hub,
    gaugeAmount: TIERS[s.tier].amount, gaugeUnit: TIERS[s.tier].unit,
    gaugeColor: TIERS[s.tier].color, gaugeCaption: TIERS[s.tier].caption,
    videoCount: VIDEO_IDS.length,
    videoTrackX: `calc(${-s.vPage} * ((100% - 36px) / 3 + 18px))`,
    videoPage: `${s.vPage + 1} / ${Math.max(1, VIDEO_IDS.length - 2)}`,
    videos: VIDEO_META.map((m, i) => ({ i, poster: POSTERS[i], ...m })),
    vIsOpen: s.vOpen !== null,
    vSrc: s.vOpen === null ? '' : `https://drive.google.com/file/d/${VIDEO_IDS[s.vOpen]}/preview`,
    vName: s.vOpen === null ? '' : VIDEO_META[s.vOpen].name,
    vRole: s.vOpen === null ? '' : VIDEO_META[s.vOpen].role,
    vPosition: s.vOpen === null ? '' : `Video ${s.vOpen + 1} of ${VIDEO_IDS.length}`,
    dot0: s.qi === 0 ? '#6262e9' : '#E4E3F0',
    dot1: s.qi === 1 ? '#6262e9' : '#E4E3F0',
    dot2: s.qi === 2 ? '#6262e9' : '#E4E3F0',
  };
  for (let i = 0; i < 5; i++) {
    d['tabBg' + i] = on(i) ? '#6262e9' : 'rgba(255,255,255,.72)';
    d['tabFg' + i] = on(i) ? '#ffffff' : '#55556B';
    d['tabSh' + i] = on(i) ? '0 12px 26px -12px rgba(98,98,233,.8)' : '0 6px 18px -14px rgba(20,20,40,.4)';
  }
  [0, 1, 2].forEach((i) => {
    const active = s.tier === i;
    const mid = i === 1;
    d[`tier${i}Bg`] = active ? (mid ? 'rgba(98,98,233,.24)' : 'rgba(255,255,255,.11)') : (mid ? 'rgba(98,98,233,.14)' : 'rgba(255,255,255,.05)');
    d[`tier${i}Border`] = active ? (mid ? 'rgba(150,145,255,.85)' : 'rgba(255,255,255,.32)') : (mid ? 'rgba(140,135,240,.4)' : 'rgba(255,255,255,.1)');
    d[`tier${i}Shadow`] = active ? (mid ? '0 26px 54px -22px rgba(98,98,233,.85)' : '0 22px 46px -26px rgba(0,0,0,.7)') : 'none';
    d[`tier${i}Scale`] = active ? 'translateX(-6px)' : 'translateX(0)';
  });
  const set3 = QUOTE_SETS[s.qi];
  (['A', 'B', 'C'] as const).forEach((k, i) => {
    d['q' + k] = set3[i].q;
    d['n' + k] = set3[i].n;
    d['r' + k] = set3[i].r;
  });

  return <HomeV8View d={d} appendUtm={appendUtm} chips={CHIPS} rootRef={rootRef} onClick={onClick} />;
};

export default HomeV8;

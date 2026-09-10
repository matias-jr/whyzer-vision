import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Head } from 'vite-react-ssg';
import { useUtmParams } from '@/hooks/useUtmParams';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap';

/** Matches a media query, defaulting to `false` during SSG prerender. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

// Same region mapping as Pricing.tsx and EliteUpgrade.tsx. This page is
// monthly-only, so it resolves a single `elite-monthly<suffix>` checkout URL
// rather than switching between monthly and annual plans.
const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
  'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'CH','NO','IS','AL','BA','ME','MK','RS','MD','UA','BY','GE','AM','AZ',
  'LI','MC','SM','VA','AD','XK',
]);

type Currency = { symbol: string };

const CURRENCIES: Record<string, Currency> = {
  GBP: { symbol: '£' },
  EUR: { symbol: '€' },
  CAD: { symbol: 'CA$' },
  AUD: { symbol: 'AU$' },
  USD: { symbol: '$' },
};

const trialUrl = (regionSuffix: string) =>
  `https://subscribe.whyzer.ai/elite-monthly${regionSuffix}`;

// The artboard ships a logo with a baked-in dark panel; this is the same
// wordmark on transparency, so it sits cleanly on the navy nav and footer.
const LOGO_SRC =
  'https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png';

const CTA_LABEL = 'Start your 14-day trial';
const CTA_MICRO = 'Card on file. Nothing charged until day 14. Cancel any time before then.';

const STATS = [
  { value: '8,500+', label: 'companies already covered' },
  { value: '150+', label: 'markets worldwide' },
  { value: '< 2 min', label: 'from account name to a scored POV' },
  { value: '$160M+', label: 'closed with the methodology inside' },
];

const BIG_PROOF = [
  { stat: '65%', line: 'of annual quota closed in a single deal', tone: 'dark' },
  { stat: '$5M+', line: 'in deals closed by reps who used to lead with features', tone: 'light' },
  { stat: '2% → 23%', line: 'executive response rates after switching', tone: 'tint' },
];

const FLAT_PROOF = [
  'Bigger deals landing in the pipeline, not just more of them',
  'What used to take days now takes hours',
];

const FRAMEWORK = [
  { n: '01', title: 'Anchor', body: 'Anchor the conversation in something true about the account.' },
  { n: '02', title: 'Shift', body: 'Shift the frame toward what it means for their business.' },
  { n: '03', title: 'Pull', body: "Pull them toward a conversation they weren't expecting to have." },
];

const INCLUDED = [
  {
    n: '01',
    title: 'Unlimited research, POVs, deal maps and audio briefings',
    body: 'Across 8,500+ companies in 150+ markets.',
  },
  {
    n: '02',
    title: 'Coach Jamal',
    body: 'An AI co-pilot trained on the methodology, on call at 11pm before the QBR.',
  },
  {
    n: '03',
    title: 'Weekly live deal coaching',
    body: 'Jamal, every week, on real deals in flight — bring yours.',
  },
  {
    n: '04',
    title: 'Whyzer Academy',
    body: 'Monthly upskilling sessions led by Jamal.',
  },
];

const PLAN_POINTS = [
  'Everything above, no feature gates',
  '$0 today — day 14 is the first charge',
  'Cancel in two clicks, no call required',
];

// The hero screenshot is walked step by step: `z` 1 shows the whole frame,
// zoomed steps hold the pipeline list while a band tracks the active row.
const HERO_STEPS = [
  { label: 'Reading the filings', z: 1, cx: 0.5, cy: 0.5, row: 0, pct: 18 },
  { label: 'Research', z: 1.7, cx: 0.22, cy: 0.702, row: 0.702, pct: 40 },
  { label: 'Draft sections', z: 1.7, cx: 0.22, cy: 0.772, row: 0.772, pct: 60 },
  { label: 'Validate & enrich', z: 1.7, cx: 0.22, cy: 0.855, row: 0.855, pct: 82 },
  { label: 'Finalize', z: 1.7, cx: 0.22, cy: 0.938, row: 0.938, pct: 100 },
];

const faqGroups = (price: string) => [
  {
    group: 'Core product',
    items: [
      {
        q: 'Is this just a research tool?',
        a: 'No. The tool surfaces the signal. The framework, the coaching and the weekly sessions are what turn it into an argument you can use in the room.',
      },
      {
        q: 'What if my accounts are private companies?',
        a: 'Coverage is strongest where public financial signal exists — 8,500+ companies across 150+ markets. For private accounts, Whyzer works the sector, the customers and the suppliers around them.',
      },
      {
        q: 'How is this different from asking an LLM?',
        a: 'A general model guesses. Whyzer reads the actual filings and earnings calls, scores the opportunity, and structures it the way a CFO expects to hear it.',
      },
    ],
  },
  {
    group: 'Pricing',
    items: [
      { q: 'Do I need a card to start?', a: 'Yes — but nothing is charged until day 14.' },
      {
        q: 'What happens after the trial?',
        a: `The same access continues at ${price}/month. Nothing changes except the trial clock.`,
      },
      {
        q: 'Can my company be invoiced instead?',
        a: 'For teams, yes. Start the trial on a card and talk to us about seats before day 14.',
      },
    ],
  },
  {
    group: 'Getting started',
    items: [
      {
        q: 'How long before I get something usable?',
        a: 'Under two minutes. Type an account name, get a scored POV you can take into a call.',
      },
      {
        q: 'When are the live coaching sessions?',
        a: "Weekly, and you'll get the calendar the moment you sign up. Recordings sit in the Vault if you miss one.",
      },
      {
        q: 'Does it fit how I already sell?',
        a: 'It sits on top of whatever methodology you run. Anchor, Shift, Pull changes what you open with — not your process.',
      },
    ],
  },
];

const STYLES = `
.et-root{
  --navy:#0B0B18;--paper:#F7F7FD;--white:#FFFFFF;--tint:#EDEDFB;
  --violet:#6262E9;--violet-lift:#7A7AF0;--violet-deep:#4B4BC7;--violet-soft:#8B8BF2;
  --violet-pale:#A9A9F7;--on-dark:#F4F4FF;
  --ink-60:rgba(11,11,24,0.66);--ink-45:rgba(11,11,24,0.45);
  --dark-70:rgba(244,244,255,0.7);--dark-60:rgba(244,244,255,0.6);
  --line:rgba(11,11,24,0.09);--line-2:rgba(11,11,24,0.12);--line-dark:rgba(244,244,255,0.12);
  --maxw:1220px;--pad:clamp(16px,4vw,48px);
  --display:'Space Grotesk',Inter,system-ui,sans-serif;
  background:var(--paper);color:var(--navy);
  font-family:'Inter',system-ui,sans-serif;font-weight:400;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;width:100%;
}
.et-root *{box-sizing:border-box}
.et-root h1,.et-root h2,.et-root h3,.et-root p{margin:0}
.et-root a{color:var(--violet);text-decoration:none}
.et-root ::selection{background:var(--violet);color:#fff}
.et-root :focus-visible{outline:2px solid var(--violet);outline-offset:3px}
.et-root .wrap{max-width:var(--maxw);margin:0 auto;width:100%}
.et-root .display{font-family:var(--display);letter-spacing:-0.035em;font-weight:700}

.et-root .btn{display:inline-flex;align-items:center;justify-content:center;
  background:var(--violet);color:#fff;font-family:var(--display);font-weight:600;font-size:16px;
  padding:17px 34px;border-radius:10px;box-shadow:0 14px 34px rgba(98,98,233,0.3);
  transition:background 160ms ease,transform 160ms ease}
.et-root .btn:hover{background:var(--violet-lift);transform:translateY(-1px);color:#fff}
.et-root .btn-sm{font-family:'Inter',sans-serif;font-weight:600;font-size:13px;
  padding:10px 20px;border-radius:8px;box-shadow:none}
.et-root .btn-sm:hover{transform:none}
.et-root .micro{font-size:13px;color:rgba(11,11,24,0.55)}
.et-root .eyebrow{font-size:11px;font-weight:600;letter-spacing:0.2em;
  text-transform:uppercase;color:var(--violet-deep)}
.et-root .eyebrow.on-dark{color:var(--violet-soft)}

.et-root .nav{background:var(--navy);padding:0 var(--pad);position:sticky;top:0;z-index:50;
  border-bottom:1px solid rgba(255,255,255,0.08)}
.et-root .nav-inner{max-width:var(--maxw);margin:0 auto;height:72px;display:flex;
  align-items:center;justify-content:space-between;gap:20px}
.et-root .brand-logo{height:30px;width:auto;display:block}

/* ---- hero ---- */
.et-root .hero{padding:clamp(48px,6.5vw,96px) var(--pad) clamp(40px,5vw,72px);
  background:radial-gradient(120% 90% at 8% -10%, rgba(98,98,233,0.22) 0%, rgba(98,98,233,0) 55%),
    radial-gradient(90% 70% at 92% 0%, rgba(86,200,240,0.16) 0%, rgba(86,200,240,0) 55%), var(--paper)}
.et-root .hero-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));
  gap:clamp(32px,4.5vw,64px);align-items:center}
.et-root .pill{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,0.8);
  border:1px solid rgba(98,98,233,0.3);border-radius:999px;padding:7px 15px}
.et-root .pill i{width:6px;height:6px;border-radius:50%;background:var(--violet)}
.et-root .pill b{font-size:11px;font-weight:600;letter-spacing:0.14em;
  text-transform:uppercase;color:var(--violet-deep)}
.et-root .hero h1{font-family:var(--display);font-weight:700;letter-spacing:-0.035em;
  line-height:1.03;font-size:clamp(34px,4.8vw,62px);margin-top:clamp(20px,2.6vw,30px);
  max-width:17ch;text-wrap:pretty}
.et-root .hero h1 em{font-style:normal;color:var(--violet-deep)}
.et-root .hero .lede{font-size:clamp(15px,1.3vw,18px);line-height:1.65;color:var(--ink-60);
  max-width:50ch;margin-top:clamp(18px,2.2vw,24px)}
.et-root .hero-cta{display:flex;flex-direction:column;align-items:flex-start;gap:13px;
  margin-top:clamp(24px,3vw,34px)}

.et-root .device-wrap{position:relative}
.et-root .device-glow{position:absolute;inset:-8% -6% -12% -6%;
  background:radial-gradient(60% 60% at 60% 40%, rgba(98,98,233,0.28), rgba(98,98,233,0) 70%);
  filter:blur(20px);pointer-events:none}
.et-root .laptop{position:relative}
.et-root .laptop-lid{background:linear-gradient(180deg,#2C2C42 0%,#15152A 100%);
  padding:9px 9px 0;border-radius:14px 14px 3px 3px;box-shadow:0 34px 70px rgba(11,11,24,0.3)}
.et-root .laptop-lid.pale{background:linear-gradient(160deg,#E6E7EC 0%,#C3C6CF 45%,#9EA2AD 100%);
  box-shadow:0 34px 70px rgba(0,0,0,0.55)}
.et-root .laptop-cam{display:flex;justify-content:center;padding-bottom:6px}
.et-root .laptop-cam i{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.22)}
.et-root .laptop-lid.pale .laptop-cam i{background:rgba(11,11,24,0.28)}
.et-root .laptop-base{height:13px;margin:0 -3.5%;border-radius:0 0 12px 12px;
  background:linear-gradient(180deg,#22223A 0%,#0F0F1E 100%);
  display:flex;align-items:flex-start;justify-content:center}
.et-root .laptop-base i{width:16%;height:4px;border-radius:0 0 6px 6px;background:rgba(255,255,255,0.12)}
.et-root .laptop-lid.pale + .laptop-base{background:linear-gradient(180deg,#D5D7DE 0%,#9DA1AC 100%)}
.et-root .laptop-lid.pale + .laptop-base i{background:rgba(11,11,24,0.16)}
.et-root .screen{position:relative;overflow:hidden;border-radius:4px;background:#fff;
  aspect-ratio:16/10;display:flex;flex-direction:column}
.et-root .screen-head{width:100%;display:block;flex:none;
  border-bottom:1px solid rgba(11,11,24,0.08)}
.et-root .screen-body{position:relative;flex:1;overflow:hidden}
.et-root .screen-shot{position:absolute;top:0;left:0;width:100%;max-width:none;display:block;
  transform-origin:top left;transition:transform 850ms cubic-bezier(.4,.05,.2,1);will-change:transform}
.et-root .screen-band{position:absolute;left:1%;right:1%;height:22px;top:0;opacity:0;
  border-radius:7px;background:rgba(98,98,233,0.16);box-shadow:inset 3px 0 0 var(--violet);
  transition:top 600ms cubic-bezier(.4,.05,.2,1),opacity 350ms ease,height 600ms ease;
  pointer-events:none}
.et-root .steps{display:flex;align-items:center;gap:11px;margin-top:18px}
.et-root .steps i{width:7px;height:7px;border-radius:50%;background:var(--violet);flex:none}
.et-root .steps .step-label{font-size:12.5px;font-weight:600;color:rgba(11,11,24,0.75);white-space:nowrap}
.et-root .steps .track{flex:1;height:3px;border-radius:99px;background:rgba(11,11,24,0.1);overflow:hidden}
.et-root .steps .track b{display:block;height:100%;background:var(--violet);border-radius:99px;
  transition:width 1400ms ease}
.et-root .steps .tail{font-size:12px;color:rgba(11,11,24,0.5);white-space:nowrap}

/* ---- stats ---- */
.et-root .stats{background:var(--navy);color:var(--on-dark)}
.et-root .stats-grid{max-width:var(--maxw);margin:0 auto;
  padding:clamp(30px,3.6vw,44px) var(--pad);
  display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:clamp(20px,3vw,40px)}
.et-root .stat{display:flex;flex-direction:column;gap:6px}
.et-root .stat b{font-family:var(--display);font-weight:700;font-size:clamp(28px,3.1vw,40px);
  letter-spacing:-0.035em;line-height:1;color:var(--violet-pale)}
.et-root .stat span{font-size:13px;color:var(--dark-60)}

/* ---- proof ---- */
.et-root .sec{padding:clamp(56px,7.5vw,104px) var(--pad)}
.et-root .sec h2{font-family:var(--display);margin-top:14px;font-weight:700;
  letter-spacing:-0.035em;line-height:1.08;font-size:clamp(27px,3.5vw,46px);
  max-width:20ch;text-wrap:pretty}
.et-root .proof-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:clamp(12px,1.4vw,18px);margin-top:clamp(28px,3.6vw,44px)}
.et-root .proof{border-radius:14px;padding:clamp(24px,2.6vw,34px);display:flex;
  flex-direction:column;justify-content:space-between;gap:24px;min-height:210px}
.et-root .proof b{font-family:var(--display);font-weight:700;letter-spacing:-0.05em;line-height:0.9;
  font-size:clamp(48px,5.6vw,72px)}
.et-root .proof span{font-size:15px;line-height:1.5}
.et-root .proof.dark{background:var(--navy);color:var(--on-dark);
  background-image:radial-gradient(90% 80% at 100% 0%, rgba(98,98,233,0.4), rgba(98,98,233,0) 65%)}
.et-root .proof.dark span{color:rgba(244,244,255,0.78)}
.et-root .proof.light{background:var(--white);border:1px solid var(--line)}
.et-root .proof.light b{color:var(--violet-deep)}
.et-root .proof.light span,.et-root .proof.tint span{color:var(--ink-60)}
.et-root .proof.tint{background:var(--tint);border:1px solid rgba(98,98,233,0.18)}
.et-root .proof.tint b{color:var(--navy);font-size:clamp(38px,4.4vw,58px)}
.et-root .proof.tint b i{font-style:normal;color:var(--violet)}
.et-root .proof-flat{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:clamp(12px,1.4vw,18px);margin-top:clamp(12px,1.4vw,18px)}
.et-root .flat{background:var(--white);border:1px solid var(--line);border-radius:14px;
  padding:clamp(22px,2.4vw,30px);display:flex;align-items:center;gap:16px}
.et-root .flat i{width:26px;height:2px;background:var(--violet);flex:none}
.et-root .flat span{font-family:var(--display);font-weight:600;font-size:clamp(16px,1.5vw,19px);
  letter-spacing:-0.02em;line-height:1.35}

/* ---- methodology ---- */
.et-root .method{color:var(--on-dark);padding:clamp(60px,8vw,120px) var(--pad);overflow:hidden;
  background:radial-gradient(80% 70% at 15% 0%, rgba(98,98,233,0.32) 0%, rgba(98,98,233,0) 60%),
    radial-gradient(70% 60% at 90% 100%, rgba(86,200,240,0.14) 0%, rgba(86,200,240,0) 60%), var(--navy)}
.et-root .method h2{font-family:var(--display);margin-top:14px;font-weight:700;
  letter-spacing:-0.035em;line-height:1.04;font-size:clamp(28px,4.2vw,58px);max-width:18ch}
.et-root .method .lede{margin-top:clamp(18px,2.2vw,26px);font-size:clamp(15px,1.3vw,18px);
  line-height:1.7;color:var(--dark-70);max-width:62ch}
.et-root .method-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:clamp(28px,4vw,56px);align-items:center;margin-top:clamp(32px,4vw,52px)}
.et-root .wheel{position:relative;height:330px;overflow:hidden}
.et-root .wheel-card{position:absolute;top:50%;left:50%;width:min(84%,390px);
  border:1px solid rgba(244,244,255,0.14);border-radius:14px;padding:clamp(24px,2.8vw,34px);
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  transition:transform 700ms cubic-bezier(.4,.1,.2,1),opacity 700ms ease,filter 700ms ease,
    background 700ms ease,border-color 700ms ease,box-shadow 700ms ease;will-change:transform}
.et-root .wheel-rule{display:flex;align-items:center;gap:12px}
.et-root .wheel-rule b{font-family:var(--display);font-size:12px;font-weight:600;
  letter-spacing:0.16em;color:var(--violet-soft)}
.et-root .wheel-rule s{flex:1;height:1px;text-decoration:none;
  background:linear-gradient(to right,rgba(98,98,233,0.9),rgba(98,98,233,0))}
.et-root .wheel-card h3{font-family:var(--display);margin-top:16px;font-weight:700;
  letter-spacing:-0.035em;font-size:clamp(24px,2.4vw,32px)}
.et-root .wheel-card p{margin-top:10px;font-size:15px;line-height:1.65;color:rgba(244,244,255,0.72)}
.et-root .dots{display:flex;gap:10px;justify-content:center;margin-top:8px}
.et-root .dots button{width:34px;height:4px;border:0;padding:0;border-radius:99px;cursor:pointer;
  background:rgba(244,244,255,0.22);transition:background 300ms ease,width 300ms ease}
.et-root .dots button[aria-selected="true"]{background:var(--violet);width:48px}
.et-root .method-shot{position:relative;overflow:hidden;border-radius:4px;background:#fff;
  aspect-ratio:1.911}
.et-root .method-shot img{position:absolute;inset:0;width:100%;height:100%;
  object-fit:contain;object-position:center top;display:block}
.et-root .method-cap{display:block;margin-top:12px;font-size:12px;color:rgba(244,244,255,0.5)}
.et-root .method .kicker{font-family:var(--display);margin-top:clamp(30px,3.4vw,44px);
  font-weight:600;font-size:clamp(19px,2vw,28px);letter-spacing:-0.03em;line-height:1.35;max-width:30ch}

/* ---- included ---- */
.et-root .inc h2{font-family:var(--display);margin-top:14px;font-weight:700;
  letter-spacing:-0.035em;line-height:1.06;font-size:clamp(28px,3.8vw,52px);
  max-width:20ch;text-wrap:pretty}
.et-root .vault{background:var(--navy);color:var(--on-dark);border-radius:16px;
  padding:clamp(28px,3.4vw,48px);margin-top:clamp(28px,3.6vw,44px);
  background-image:radial-gradient(70% 130% at 88% 10%, rgba(98,98,233,0.45), rgba(98,98,233,0) 62%);
  display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:clamp(20px,3vw,44px);align-items:center}
.et-root .vault h3{font-family:var(--display);margin-top:14px;font-weight:700;
  letter-spacing:-0.035em;font-size:clamp(22px,2.4vw,32px);line-height:1.18}
.et-root .vault .tag{font-family:var(--display);margin-top:14px;font-weight:600;
  font-size:clamp(15px,1.5vw,19px);letter-spacing:-0.02em;color:var(--violet-pale)}
.et-root .vault-list{display:flex;flex-direction:column;gap:10px}
.et-root .vault-row{display:flex;gap:14px;align-items:baseline;padding:14px 0;
  border-top:1px solid var(--line-dark)}
.et-root .vault-row:last-child{border-bottom:1px solid var(--line-dark)}
.et-root .vault-row b{font-family:var(--display);font-size:12px;font-weight:600;
  color:var(--violet-soft);flex:none;width:22px}
.et-root .vault-row strong{display:block;font-weight:600;font-size:15px}
.et-root .vault-row span{display:block;margin-top:4px;font-size:14px;line-height:1.55;
  color:rgba(244,244,255,0.62)}
.et-root .oneclick{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:clamp(24px,3vw,48px);align-items:center;margin-top:clamp(28px,3.6vw,48px)}
.et-root .oneclick h3{font-family:var(--display);font-weight:700;letter-spacing:-0.03em;
  font-size:clamp(20px,2.2vw,28px);line-height:1.2;max-width:18ch}
.et-root .oneclick p{margin-top:14px;font-size:15px;line-height:1.65;color:var(--ink-60);max-width:44ch}
.et-root .oneclick-card{background:var(--white);border:1px solid var(--line);border-radius:16px;
  padding:clamp(18px,2vw,26px);box-shadow:0 24px 56px rgba(11,11,24,0.1);
  display:flex;flex-direction:column;gap:16px}
.et-root .oneclick-shot{position:relative}
.et-root .oneclick-shot img{width:100%;display:block}
.et-root .cursor-dot{position:absolute;left:73.5%;top:52%;width:14px;height:14px;border-radius:50%;
  background:rgba(98,98,233,0.35);animation:etClick 5.2s ease-out infinite}
.et-root .cursor{position:absolute;left:73.5%;top:52%;
  filter:drop-shadow(0 2px 4px rgba(11,11,24,0.35));
  animation:etCursor 5.2s cubic-bezier(.4,.1,.2,1) infinite}
.et-root .chat-rule{display:flex;align-items:center;gap:10px;animation:etReveal 5.2s ease infinite}
.et-root .chat-rule b{flex:none;font-size:11px;font-weight:600;letter-spacing:0.16em;
  text-transform:uppercase;color:var(--violet-deep)}
.et-root .chat-rule s{flex:1;height:1px;text-decoration:none;
  background:linear-gradient(to right,rgba(98,98,233,0.5),rgba(98,98,233,0))}
.et-root .chat-shot{width:100%;display:block;border:1px solid rgba(11,11,24,0.08);
  border-radius:10px;animation:etReveal 5.2s ease infinite}
@keyframes etCursor{
  0%{transform:translate(90px,54px);opacity:0}
  10%{opacity:1}
  34%{transform:translate(0,0)}
  40%{transform:translate(0,2px) scale(.9)}
  48%,88%{transform:translate(0,0);opacity:1}
  100%{transform:translate(90px,54px);opacity:0}
}
@keyframes etClick{
  0%,36%{opacity:0;transform:scale(.3)}
  44%{opacity:1;transform:scale(1)}
  58%,100%{opacity:0;transform:scale(2.4)}
}
@keyframes etReveal{
  0%,40%{opacity:0.28;transform:translateY(8px)}
  56%,100%{opacity:1;transform:translateY(0)}
}
.et-root .deliverable{margin:clamp(28px,3.6vw,48px) 0 0;display:flex;flex-direction:column;gap:16px}
.et-root .deliverable img{width:100%;display:block;border:1px solid var(--line);
  border-radius:16px;box-shadow:0 28px 64px rgba(11,11,24,0.14)}
.et-root .deliverable figcaption{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px}
.et-root .deliverable b{font-family:var(--display);font-weight:600;letter-spacing:-0.02em;
  font-size:clamp(16px,1.5vw,19px)}
.et-root .deliverable span{font-size:14px;line-height:1.6;color:var(--ink-60)}

/* ---- pricing ---- */
.et-root .pricing{scroll-margin-top:88px;border-top:1px solid rgba(11,11,24,0.07);
  padding:clamp(56px,7.5vw,112px) var(--pad);
  background:radial-gradient(90% 80% at 85% 0%, rgba(98,98,233,0.16) 0%, rgba(98,98,233,0) 60%), var(--tint)}
.et-root .pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:clamp(28px,4vw,64px);align-items:center}
.et-root .pricing h2{font-family:var(--display);margin-top:14px;font-weight:700;
  letter-spacing:-0.035em;line-height:1.08;font-size:clamp(27px,3.5vw,46px);
  max-width:16ch;text-wrap:pretty}
.et-root .pricing .lede{margin-top:18px;font-size:clamp(15px,1.3vw,17px);line-height:1.7;
  color:rgba(11,11,24,0.68);max-width:48ch}
.et-root .card{background:var(--white);border:1px solid rgba(98,98,233,0.28);border-radius:18px;
  padding:clamp(26px,3vw,40px);box-shadow:0 28px 64px rgba(11,11,24,0.14)}
.et-root .price{display:flex;align-items:baseline;gap:10px;margin-top:14px}
.et-root .price b{font-family:var(--display);font-weight:700;font-size:clamp(44px,4.8vw,64px);
  letter-spacing:-0.045em;line-height:1}
.et-root .price span{font-size:15px;color:rgba(11,11,24,0.58)}
.et-root .plan{display:flex;flex-direction:column;gap:11px;margin-top:22px;padding-top:20px;
  border-top:1px solid var(--line)}
.et-root .plan span{font-size:14px;color:rgba(11,11,24,0.7)}
.et-root .card-cta{display:flex;flex-direction:column;gap:12px;margin-top:24px}
.et-root .card-cta .micro{text-align:center;font-size:12.5px}

/* ---- faq ---- */
.et-root .faq{padding:clamp(52px,7vw,100px) var(--pad)}
.et-root .faq h2{font-family:var(--display);margin:14px 0 clamp(28px,3.4vw,44px);font-weight:700;
  letter-spacing:-0.035em;line-height:1.1;font-size:clamp(25px,3.1vw,40px)}
.et-root .faq-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:clamp(24px,3vw,52px)}
.et-root .faq-group{font-family:var(--display);font-size:12px;font-weight:600;
  letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-45)}
.et-root .faq-list{margin-top:14px;border-top:1px solid var(--line-2)}
.et-root .faq-item{border-bottom:1px solid var(--line-2)}
.et-root .faq-q{display:flex;align-items:center;justify-content:space-between;gap:20px;
  width:100%;padding:18px 0;cursor:pointer;background:none;border:none;text-align:left;
  font-family:inherit;color:inherit}
.et-root .faq-q span{font-weight:600;font-size:15.5px;letter-spacing:-0.01em}
.et-root .faq-q i{font-size:18px;font-style:normal;color:rgba(11,11,24,0.5);line-height:1;flex:none}
.et-root .faq-a{padding-bottom:20px;max-width:62ch;font-size:14.5px;line-height:1.7;
  color:rgba(11,11,24,0.68)}

/* ---- footer ---- */
.et-root .foot{color:var(--on-dark);
  background:radial-gradient(70% 100% at 50% 0%, rgba(98,98,233,0.35) 0%, rgba(98,98,233,0) 62%), var(--navy)}
.et-root .foot-inner{max-width:var(--maxw);margin:0 auto;text-align:center;
  padding:clamp(64px,9vw,132px) var(--pad) clamp(28px,4vw,48px)}
.et-root .foot h2{font-family:var(--display);margin:0 auto;font-weight:700;letter-spacing:-0.035em;
  line-height:1.06;font-size:clamp(28px,4.4vw,60px);max-width:16ch;text-wrap:pretty}
.et-root .foot h2 em{font-style:normal;color:rgba(244,244,255,0.55)}
.et-root .foot-cta{display:flex;flex-direction:column;align-items:center;gap:13px;
  margin-top:clamp(26px,3.2vw,40px)}
.et-root .foot-cta .micro{color:rgba(244,244,255,0.58)}
.et-root .foot-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;
  gap:16px;margin-top:clamp(56px,7vw,104px);padding-top:24px;border-top:1px solid var(--line-dark)}
.et-root .foot-bar .brand-logo{height:26px}
.et-root .foot-bar>span{font-size:12px;color:rgba(244,244,255,0.55)}

@media (prefers-reduced-motion: reduce){
  .et-root *{animation:none !important}
  .et-root .btn,.et-root .btn:hover{transition:none;transform:none}
  .et-root .screen-shot,.et-root .screen-band,.et-root .wheel-card,
  .et-root .steps .track b{transition:none}
}
`;

export default function FreeTrial() {
  const [open, setOpen] = useState<Record<string, boolean>>({ '0-0': true });
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD);
  const [regionSuffix, setRegionSuffix] = useState('');
  const [active, setActive] = useState(0);
  const appendUtm = useUtmParams();
  const motionOk = !useMediaQuery('(prefers-reduced-motion: reduce)');

  const wheelRef = useRef<HTMLDivElement>(null);
  const heroImg = useRef<HTMLImageElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const step = useRef(0);
  const [heroStep, setHeroStep] = useState(0);

  useEffect(() => {
    if (document.querySelector('link[data-et-fonts]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    link.setAttribute('data-et-fonts', '');
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const code: string = data.country_code ?? '';
        if (code === 'GB') { setCurrency(CURRENCIES.GBP); setRegionSuffix('-uk'); }
        else if (EU_COUNTRIES.has(code)) { setCurrency(CURRENCIES.EUR); setRegionSuffix('-eu'); }
        else if (code === 'CA') { setCurrency(CURRENCIES.CAD); setRegionSuffix('-ca'); }
        else if (code === 'AU') { setCurrency(CURRENCIES.AUD); setRegionSuffix('-au'); }
        // else stays USD with no suffix
      })
      .catch(() => {});
  }, []);

  // Smooth-scroll the in-page CTAs. Set on the document element rather than in
  // the scoped stylesheet (which cannot reach the scrolling root) and unset on
  // unmount so other routes keep their default jump behaviour.
  useEffect(() => {
    if (!motionOk) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, [motionOk]);

  /**
   * Pans and zooms the hero screenshot to the current pipeline step, and drags
   * the highlight band onto the matching row. Measured from the rendered image
   * rather than the natural size, so it survives any column width.
   */
  const paintHero = useCallback(() => {
    const img = heroImg.current;
    const box = img?.parentElement?.getBoundingClientRect();
    if (!img || !box) return;
    const iw = img.offsetWidth;
    const ih = img.offsetHeight;
    if (!iw || !ih) return;

    const s = HERO_STEPS[step.current];
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const dw = iw * s.z;
    const dh = ih * s.z;
    const place = (avail: number, disp: number, c: number) =>
      disp <= avail ? (avail - disp) / 2 : clamp(avail / 2 - c * disp, avail - disp, 0);
    const x = place(box.width, dw, s.cx);
    const y = place(box.height, dh, s.cy);
    img.style.transform = `translate(${x}px,${y}px) scale(${s.z})`;

    const el = band.current;
    if (!el) return;
    if (s.row) {
      const h = Math.max(22, dh * 0.075);
      el.style.height = `${h}px`;
      el.style.top = `${y + s.row * dh - h / 2}px`;
      el.style.opacity = '1';
    } else {
      el.style.opacity = '0';
    }
  }, []);

  useLayoutEffect(() => {
    paintHero();
    const img = heroImg.current;
    if (img && !img.complete) img.addEventListener('load', paintHero, { once: true });
    window.addEventListener('resize', paintHero);
    return () => window.removeEventListener('resize', paintHero);
  }, [paintHero]);

  useEffect(() => {
    if (!motionOk) return;
    const t = setInterval(() => {
      step.current = (step.current + 1) % HERO_STEPS.length;
      setHeroStep(step.current);
      paintHero();
    }, 1600);
    return () => clearInterval(t);
  }, [motionOk, paintHero]);

  // Rotate the Anchor/Shift/Pull wheel; a manual pick restarts the timer.
  useEffect(() => {
    if (!motionOk) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % FRAMEWORK.length), 3600);
    return () => clearTimeout(t);
  }, [active, motionOk]);

  // Lay the cards out along a shallow arc: front card square on, the other two
  // rotated back and dimmed. Recomputed on resize so the arc stays in column.
  useLayoutEffect(() => {
    const paint = () => {
      const stage = wheelRef.current;
      if (!stage) return;
      const w = stage.getBoundingClientRect().width || 430;
      const radius = Math.min(150, w * 0.19);
      Array.from(stage.children).forEach((node, i) => {
        const el = node as HTMLElement;
        let d = (i - active + FRAMEWORK.length) % FRAMEWORK.length;
        if (d === 2) d = -1;
        const ang = d * 1.05;
        const x = Math.sin(ang) * radius;
        const y = (1 - Math.cos(ang)) * 96;
        const front = d === 0;
        el.style.transform =
          `translate(-50%,-50%) translate(${x}px,${y}px) rotate(${d * 7}deg) scale(${front ? 1 : 0.84})`;
        el.style.opacity = front ? '1' : '0.18';
        el.style.filter = front ? 'none' : 'blur(2.5px)';
        el.style.zIndex = front ? '3' : '1';
        el.style.borderColor = front ? 'rgba(98,98,233,0.55)' : 'rgba(244,244,255,0.14)';
        el.style.background = front ? 'rgba(98,98,233,0.14)' : 'rgba(255,255,255,0.04)';
        el.style.boxShadow = front ? '0 24px 60px rgba(0,0,0,0.45)' : 'none';
        el.setAttribute('aria-hidden', front ? 'false' : 'true');
      });
    };
    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, [active]);

  const toggle = (key: string) =>
    setOpen((prev) => (prev[key] ? {} : { [key]: true }));

  const price = `${currency.symbol}97`;
  const FAQ_GROUPS = faqGroups(price);
  const ctaHref = useMemo(
    () => appendUtm(trialUrl(regionSuffix)),
    [appendUtm, regionSuffix],
  );

  // Nav, hero and footer send the visitor to the pricing module so they see
  // the terms before checkout; only the pricing card itself links straight out.
  const cta = (className: string) => (
    <a href="#pricing" className={className}>
      {CTA_LABEL}
    </a>
  );

  const checkoutCta = (className: string) => (
    <a href={ctaHref} className={className}>
      {CTA_LABEL}
    </a>
  );

  const current = HERO_STEPS[heroStep];

  return (
    <div className="et-root">
      <Head>
        <title>Start your Whyzer Elite free trial | Whyzer</title>
        <link rel="canonical" href="https://www.whyzer.ai/free-trial" />
        <meta property="og:url" content="https://www.whyzer.ai/free-trial" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Start your Whyzer Elite free trial" />
        <meta
          property="og:description"
          content="14 days of full Elite access: filings and earnings calls read for you across 8,500+ companies, the framework to carry the point of view, and Jamal in the room every week."
        />
        <meta
          name="description"
          content="14 days of full Elite access: filings and earnings calls read for you across 8,500+ companies, the framework to carry the point of view, and Jamal in the room every week."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <style>{STYLES}</style>

      <nav className="nav">
        <div className="nav-inner">
          <img className="brand-logo" src={LOGO_SRC} alt="Whyzer" />
          {cta('btn btn-sm')}
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="pill">
              <i />
              <b>14 days · full Elite access</b>
            </div>
            <h1>
              Their next board conversation is already written. <em>In the 10-K.</em>
            </h1>
            <p className="lede">
              Filings, earnings calls, analyst questions — read for you across 8,500+ companies.
              You get the point of view, the framework to carry it, and Jamal in the room every
              week. Unlocked for 14 days.
            </p>
            <div className="hero-cta">
              {cta('btn')}
              <span className="micro">{CTA_MICRO}</span>
            </div>
          </div>

          <div className="device-wrap">
            <div className="device-glow" />
            <div className="laptop">
              <div className="laptop-lid">
                <div className="laptop-cam"><i /></div>
                <div className="screen">
                  <img
                    className="screen-head"
                    src="/free-trial/dossier-header.png"
                    alt=""
                    aria-hidden="true"
                  />
                  <div className="screen-body">
                    <img
                      ref={heroImg}
                      className="screen-shot"
                      src="/free-trial/hero-pipeline.png"
                      alt="Whyzer generating a point of view"
                      onLoad={paintHero}
                    />
                    <div ref={band} className="screen-band" />
                  </div>
                </div>
              </div>
              <div className="laptop-base"><i /></div>
            </div>
            <div className="steps">
              <i />
              <span className="step-label">{current.label}</span>
              <span className="track">
                <b style={{ width: `${current.pct}%` }} />
              </span>
              <span className="tail">POV generating</span>
            </div>
          </div>
        </div>
      </header>

      <section className="stats">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <span className="eyebrow">the receipts</span>
          <h2>What sellers walk out of the room with.</h2>
          <div className="proof-grid">
            {BIG_PROOF.map((p) => (
              <div className={`proof ${p.tone}`} key={p.stat}>
                <b>
                  {p.stat === '2% → 23%' ? (
                    <>
                      2% <i>→</i> 23%
                    </>
                  ) : (
                    p.stat
                  )}
                </b>
                <span>{p.line}</span>
              </div>
            ))}
          </div>
          <div className="proof-flat">
            {FLAT_PROOF.map((line) => (
              <div className="flat" key={line}>
                <i />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="method">
        <div className="wrap">
          <span className="eyebrow on-dark">the methodology</span>
          <h2>Bigger deals. Faster rooms. Less guessing.</h2>
          <p className="lede">
            Sellers using this aren't just researching better. They get into rooms faster, carry
            arguments that survive the first hard question, and turn single accounts into
            multi-year relationships. The mechanism behind it: Anchor, Shift, Pull.
          </p>

          <div className="method-grid">
            <div>
              <div className="wheel" ref={wheelRef}>
                {FRAMEWORK.map((f) => (
                  <div className="wheel-card" key={f.title}>
                    <div className="wheel-rule">
                      <b>{f.n}</b>
                      <s />
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                ))}
              </div>
              <div className="dots" role="tablist" aria-label="Anchor, Shift, Pull">
                {FRAMEWORK.map((f, i) => (
                  <button
                    key={f.title}
                    type="button"
                    role="tab"
                    aria-label={f.title}
                    aria-selected={active === i}
                    onClick={() => setActive(i)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="laptop">
                <div className="laptop-lid pale">
                  <div className="laptop-cam"><i /></div>
                  <div className="method-shot">
                    <img
                      src="/free-trial/pov-dossier.png"
                      alt="Dossier POV Studio showing Supply Chain Constraint Mitigation scored 4.8 out of 5"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="laptop-base"><i /></div>
              </div>
              <span className="method-cap">Every POV comes out scored, not just written.</span>
            </div>
          </div>

          <p className="kicker">
            That's not a research method. That's how bigger deals get into the room.
          </p>
        </div>
      </section>

      <section className="sec inc">
        <div className="wrap">
          <span className="eyebrow">what's included</span>
          <h2>Everything in Elite, unlocked on day one.</h2>

          <div className="vault">
            <div>
              <span className="eyebrow on-dark">the vault</span>
              <h3>The frameworks, methodology and courses behind $160M+ in closed deals.</h3>
              <p className="tag">The Netflix of strategic selling.</p>
            </div>
            <div className="vault-list">
              {INCLUDED.map((item) => (
                <div className="vault-row" key={item.n}>
                  <b>{item.n}</b>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="oneclick">
            <div>
              <h3>One click. The asset builds itself.</h3>
              <p>
                Hit Create Infographic or Generate Sales deck on any POV. Whyzer runs the research
                and builds the deliverable in the chat — sourced, branded, ready to send.
              </p>
            </div>
            <div className="oneclick-card">
              <div className="oneclick-shot">
                <img
                  src="/free-trial/cta-buttons-2.png"
                  alt="Generate Sales deck and Create Infographic actions on a POV"
                  loading="lazy"
                />
                <span className="cursor-dot" aria-hidden="true" />
                <svg
                  className="cursor"
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  aria-hidden="true"
                >
                  <path
                    d="M4 2l14 9-6.2 1.2L14 19l-2.6 1L9 13.4 4 17z"
                    fill="#0B0B18"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="chat-rule">
                <b>in the chat</b>
                <s />
              </div>
              <img
                className="chat-shot"
                src="/free-trial/chat-loading-2.png"
                alt="Chat running the steps: stored web search done, generating infographic"
                loading="lazy"
              />
            </div>
          </div>

          {/* Closes the section on the finished deliverable, per the brief. */}
          <figure className="deliverable">
            <img
              src="/free-trial/infographic.png"
              alt="A generated Whyzer infographic: Strategic Demand and Allocation Control Tower, briefing NVIDIA Corp on synchronising supply constraints with customer deployment velocity"
              loading="lazy"
            />
            <figcaption>
              <b>What comes out the other end.</b>
              <span>
                One POV, one click — a sourced executive briefing, built and branded in the chat.
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="wrap pricing-grid">
          <div>
            <span className="eyebrow">pricing and terms</span>
            <h2>Less than one lost deal.</h2>
            <p className="lede">
              14 days, full access, card required today. Nothing is charged until day 14. After
              that it's {price}/month. Cancel any time — including during the trial — and you
              won't be charged.
            </p>
          </div>
          <div className="card">
            <span className="eyebrow">whyzer elite</span>
            <div className="price">
              <b>{price}</b>
              <span>/month, starting day 14</span>
            </div>
            <div className="plan">
              {PLAN_POINTS.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
            <div className="card-cta">
              {checkoutCta('btn')}
              <span className="micro">Card on file. Nothing charged until day 14.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="wrap">
          <span className="eyebrow">faq</span>
          <h2>Questions, answered.</h2>
          <div className="faq-cols">
            {FAQ_GROUPS.map((group, gi) => (
              <div key={group.group}>
                <span className="faq-group">{group.group}</span>
                <div className="faq-list">
                  {group.items.map((faq, i) => {
                    const key = `${gi}-${i}`;
                    return (
                      <div className="faq-item" key={faq.q}>
                        <button
                          type="button"
                          className="faq-q"
                          aria-expanded={!!open[key]}
                          aria-controls={`et-faq-${key}`}
                          onClick={() => toggle(key)}
                        >
                          <span>{faq.q}</span>
                          <i aria-hidden="true">{open[key] ? '−' : '+'}</i>
                        </button>
                        {open[key] && (
                          <p className="faq-a" id={`et-faq-${key}`}>
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="foot-inner">
          <h2>
            The signal is public. <em>The argument still isn't.</em>
          </h2>
          <div className="foot-cta">
            {cta('btn')}
            <span className="micro">
              Card on file. Nothing charged until day 14. Cancel any time.
            </span>
          </div>
          <div className="foot-bar">
            <img className="brand-logo" src={LOGO_SRC} alt="Whyzer" />
            <span>© {new Date().getFullYear()} Whyzer. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

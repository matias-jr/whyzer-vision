import { useEffect, useMemo, useState } from 'react';
import { Head } from 'vite-react-ssg';
import { useUtmParams } from '@/hooks/useUtmParams';

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

type HeroState = { typed: string; showResearch: boolean };

/**
 * Types a company name into the mock search box, then swaps to the result.
 * When motion is disabled this settles straight to the finished state.
 */
function useHeroDemo(enabled: boolean): HeroState {
  const [state, setState] = useState<HeroState>({ typed: '', showResearch: false });

  useEffect(() => {
    if (!enabled) {
      setState({ typed: 'NVIDIA', showResearch: true });
      return;
    }
    const word = 'NVIDIA';
    let timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const run = () => {
      setState({ typed: '', showResearch: false });
      let t = 700;
      for (let i = 1; i <= word.length; i++) {
        const slice = word.slice(0, i);
        at(t, () => setState({ typed: slice, showResearch: false }));
        t += 130;
      }
      at(t + 900, () => setState({ typed: word, showResearch: true }));
      at(t + 5200, run);
    };
    run();
    return () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
  }, [enabled]);

  return state;
}

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';

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

// Same white wordmark EliteUpgrade.tsx uses; both nav and footer sit on dark.
const LOGO_SRC =
  'https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png';

const CTA_LABEL = 'start your free trial';
const CTA_MICRO = '14 days. Full access. Card on file, nothing charged until day 14.';

const STATS = [
  { value: '8,500+', label: 'accounts already covered' },
  { value: '150+', label: 'markets worldwide' },
  { value: '5×', label: 'more deals closed' },
  { value: '$160M+', label: 'in closed enterprise deals behind the research' },
];

const PROOF = [
  '65% of annual quota closed in a single deal',
  '$5M+ deals closed by reps who used to lead with features',
  'Executive response rates moving from 2% to 23%',
  'Bigger deals landing in the pipeline, not just more of them',
  'What used to take days now takes hours',
];

const FRAMEWORK = [
  { title: 'anchor', body: 'Anchor the conversation in something true about the account.' },
  { title: 'shift', body: 'Shift the frame toward what it means for their business.' },
  { title: 'pull', body: "Pull them toward a conversation they weren't expecting to have." },
];

const INCLUDED = [
  {
    title: "The tool, across every account you're working",
    body: 'Unlimited research, POVs, deal maps and audio briefings, over 8,500+ accounts already covered across 150+ markets worldwide.',
  },
  {
    title: 'Coach Jamal',
    body: 'An AI sales co-pilot trained on that methodology, available any time.',
  },
  {
    title: 'Weekly live deal coaching',
    body: 'Sessions with Jamal, every week, on real deals in flight.',
  },
  {
    title: 'Whyzer Academy',
    body: 'Monthly upskilling sessions led by Jamal.',
  },
];

const faqs = (price: string) => [
  {
    q: 'Is this just a research tool?',
    a: 'No. The tool surfaces the signal. The framework, the coaching, and the live sessions turn it into an argument you can use in the room.',
  },
  {
    q: 'What happens after the trial?',
    a: `You keep the same access, at ${price}/month. Nothing changes except the trial clock. Cancel anytime.`,
  },
  {
    q: 'Do I need a card to start?',
    a: 'Yes, but nothing is charged until day 14.',
  },
];

const STYLES = `
.et-root{
  --bg:#F3F5FC;--bg-tint:#E7EAFA;--ink:#0B1020;--ink-deep:#070B17;
  --paper:#FFFFFF;--blue:#3B6FF0;--blue-deep:#2F5CD4;--blue-soft:#8FAEFA;
  --line:rgba(11,16,32,0.1);--line-strong:rgba(11,16,32,0.12);
  --muted:rgba(11,16,32,0.68);--muted-dim:rgba(11,16,32,0.62);
  --on-dark:#F0F4FF;--on-dark-muted:rgba(240,244,255,0.72);
  --maxw:1280px;--pad:clamp(16px,4vw,44px);
  background:var(--bg);color:var(--ink);
  font-family:'Inter',system-ui,sans-serif;font-weight:400;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;width:100%;
}
.et-root *{box-sizing:border-box}
.et-root h1,.et-root h2,.et-root h3,.et-root p{margin:0}
.et-root a{color:var(--blue-deep);text-decoration:none}
.et-root ::selection{background:var(--blue);color:#fff}
.et-root .wrap{max-width:var(--maxw);margin:0 auto;width:100%}

.et-root .btn{display:inline-flex;align-items:center;justify-content:center;
  background:var(--blue);color:#fff;font-weight:700;font-size:16px;letter-spacing:-0.01em;
  padding:18px 36px;border-radius:6px;box-shadow:0 10px 26px rgba(59,111,240,0.28);
  transition:background 160ms ease,transform 160ms ease}
.et-root .btn:hover{background:var(--blue-deep);transform:translateY(-1px);color:#fff}
.et-root .btn:focus-visible{outline:3px solid rgba(59,111,240,0.4);outline-offset:3px}
.et-root .btn-sm{font-weight:600;font-size:13px;padding:10px 20px;border-radius:5px;box-shadow:none}
.et-root .btn-sm:hover{transform:none}
.et-root .micro{font-size:13px;font-weight:500;color:rgba(11,16,32,0.6)}
.et-root .eyebrow{font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--blue-deep)}

.et-root .nav{background:var(--ink-deep);padding:0 var(--pad)}
.et-root .nav-inner{max-width:var(--maxw);margin:0 auto;height:60px;display:flex;
  align-items:center;justify-content:space-between;gap:20px}
.et-root .brand-logo{height:24px;width:auto;display:block}

.et-root .hero{background:linear-gradient(180deg,var(--bg-tint) 0%,var(--bg) 100%);
  border-bottom:1px solid rgba(11,16,32,0.08);
  padding:clamp(44px,6vw,88px) var(--pad) clamp(52px,7vw,96px)}
.et-root .hero-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));
  gap:clamp(36px,5vw,72px);align-items:center}
.et-root .pill{display:inline-flex;align-items:center;gap:9px;background:var(--paper);
  border:1px solid rgba(59,111,240,0.28);border-radius:999px;padding:7px 14px}
.et-root .pill span{width:6px;height:6px;border-radius:50%;background:var(--blue)}
.et-root .pill b{font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--blue-deep)}
.et-root .hero h1{font-weight:800;letter-spacing:-0.035em;line-height:1.04;
  font-size:clamp(32px,4.6vw,60px);margin-top:clamp(20px,2.6vw,30px);max-width:20ch;text-wrap:pretty}
.et-root .hero h1 em{font-style:normal;color:var(--blue-deep)}
.et-root .hero p{font-size:clamp(15px,1.3vw,18px);line-height:1.66;color:var(--muted);
  max-width:56ch;margin-top:clamp(18px,2.2vw,26px)}
.et-root .hero-cta{display:flex;flex-direction:column;align-items:flex-start;gap:14px;
  margin-top:clamp(26px,3vw,36px)}
.et-root .shot{width:100%;aspect-ratio:4/3;background:var(--paper);border:1px solid var(--line);
  border-radius:12px;box-shadow:0 24px 60px rgba(11,16,32,0.12);display:flex;flex-direction:column;overflow:hidden}
.et-root .shot-bar{display:flex;align-items:center;gap:7px;padding:12px 14px;
  border-bottom:1px solid rgba(11,16,32,0.08);background:#FAFBFF}
.et-root .shot-bar span{width:9px;height:9px;border-radius:50%;background:rgba(11,16,32,0.16)}
.et-root .shot-url{flex:1;margin-left:8px;background:#F1F3FB;border-radius:100px;padding:4px 12px;
  font-size:10.5px;color:rgba(11,16,32,0.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.et-root .shot-body{flex:1;min-height:0;position:relative;overflow:hidden}
.et-root .shot-frame{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  display:block;transition:opacity .7s ease}
.et-root .shot-search{position:absolute;left:23%;top:54%;width:56%;height:32px;border-radius:100px;
  background:rgba(255,255,255,0.96);border:1px solid rgba(59,111,240,0.45);
  box-shadow:0 8px 22px -12px rgba(59,111,240,0.65);
  display:flex;align-items:center;padding:0 14px;gap:8px}
.et-root .shot-search span{font-size:12px;font-weight:600;color:var(--ink)}
.et-root .shot-caret{width:1.5px;height:13px;background:var(--blue);
  animation:etBlink 1s steps(1) infinite}
@keyframes etBlink{0%,50%{opacity:1}50.01%,100%{opacity:0}}

.et-root .stats{background:var(--paper);border-bottom:1px solid rgba(11,16,32,0.08)}
.et-root .stats-grid{max-width:var(--maxw);margin:0 auto;padding:clamp(32px,4vw,52px) var(--pad);
  display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:clamp(24px,3vw,44px)}
.et-root .stat{display:flex;flex-direction:column;gap:7px}
.et-root .stat b{font-weight:800;font-size:clamp(28px,3.2vw,40px);letter-spacing:-0.035em;
  line-height:1;color:var(--blue-deep)}
.et-root .stat span{font-size:13px;font-weight:500;color:var(--muted-dim)}

.et-root .sec{padding:clamp(60px,8vw,112px) var(--pad)}
.et-root .sec h2{margin-top:16px;font-weight:800;letter-spacing:-0.035em;line-height:1.1;
  font-size:clamp(26px,3.4vw,44px);max-width:26ch;text-wrap:pretty}
.et-root .proof-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:clamp(14px,1.6vw,20px);margin-top:clamp(30px,4vw,48px)}
.et-root .proof{background:var(--paper);border:1px solid var(--line);border-radius:10px;
  padding:clamp(22px,2.4vw,30px);display:flex;flex-direction:column;gap:14px}
.et-root .proof b{font-size:11px;font-weight:700;letter-spacing:0.14em;color:var(--blue-deep)}
.et-root .proof span{font-weight:700;font-size:clamp(16px,1.5vw,19px);letter-spacing:-0.025em;line-height:1.4}

.et-root .dark{background:var(--ink-deep);color:var(--on-dark);padding:clamp(64px,9vw,128px) var(--pad)}
.et-root .dark .eyebrow{color:var(--blue-soft)}
.et-root .dark h2{margin-top:16px;font-weight:800;letter-spacing:-0.035em;line-height:1.04;
  font-size:clamp(28px,4.2vw,58px)}
.et-root .dark .lede{margin-top:clamp(20px,2.4vw,30px);font-size:clamp(15px,1.35vw,18px);
  line-height:1.7;color:var(--on-dark-muted);max-width:68ch}
.et-root .fw-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:clamp(14px,1.6vw,20px);margin-top:clamp(34px,4.5vw,56px)}
.et-root .fw{background:rgba(255,255,255,0.04);border:1px solid rgba(240,244,255,0.12);
  border-radius:10px;padding:clamp(26px,3vw,38px);display:flex;flex-direction:column;gap:16px}
.et-root .fw-rule{display:flex;align-items:center;gap:12px}
.et-root .fw-rule i{width:7px;height:7px;border-radius:50%;background:var(--blue);flex:none}
.et-root .fw-rule s{flex:1;height:1px;text-decoration:none;
  background:linear-gradient(to right,rgba(59,111,240,0.9),rgba(59,111,240,0.08))}
.et-root .fw h3{font-weight:800;letter-spacing:-0.035em;font-size:clamp(21px,2.1vw,27px)}
.et-root .fw p{font-size:15px;line-height:1.66;color:var(--on-dark-muted)}
.et-root .dark .kicker{margin-top:clamp(28px,3vw,40px);font-weight:700;
  font-size:clamp(18px,2vw,27px);letter-spacing:-0.03em;line-height:1.4;max-width:36ch}

.et-root .inc h2{max-width:24ch;font-size:clamp(28px,4vw,54px);line-height:1.06}
.et-root .vault{background:var(--ink-deep);color:var(--on-dark);border-radius:12px;
  padding:clamp(26px,3vw,40px);display:flex;flex-direction:column;gap:14px;
  margin-top:clamp(32px,4vw,52px)}
.et-root .vault .eyebrow{color:var(--blue-soft);letter-spacing:0.18em}
.et-root .vault h3{font-weight:800;letter-spacing:-0.035em;font-size:clamp(21px,2.3vw,30px);line-height:1.2}
.et-root .vault p{font-weight:600;font-size:clamp(15px,1.5vw,19px);letter-spacing:-0.02em;color:var(--blue-soft)}
.et-root .inc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));
  gap:clamp(14px,1.6vw,20px);margin-top:clamp(14px,1.6vw,20px)}
.et-root .inc-card{background:var(--paper);border:1px solid var(--line);border-radius:12px;
  padding:clamp(24px,2.6vw,34px);display:flex;flex-direction:column;gap:12px}
.et-root .inc-card i{width:22px;height:2px;background:var(--blue);border-radius:2px}
.et-root .inc-card h3{font-weight:700;letter-spacing:-0.025em;font-size:clamp(17px,1.6vw,20px);line-height:1.3}
.et-root .inc-card p{font-size:14px;line-height:1.6;color:rgba(11,16,32,0.66)}

.et-root .pricing{scroll-margin-top:24px;
  background:var(--bg-tint);border-top:1px solid rgba(11,16,32,0.08);
  border-bottom:1px solid rgba(11,16,32,0.08);padding:clamp(60px,8vw,120px) var(--pad)}
.et-root .pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:clamp(30px,4vw,64px);align-items:center}
.et-root .pricing h2{margin-top:16px;font-weight:800;letter-spacing:-0.035em;line-height:1.08;
  font-size:clamp(26px,3.4vw,44px);max-width:22ch;text-wrap:pretty}
.et-root .pricing .lede{margin-top:20px;font-size:clamp(15px,1.35vw,17px);line-height:1.7;
  color:rgba(11,16,32,0.7);max-width:52ch}
.et-root .card{background:var(--paper);border:1px solid rgba(59,111,240,0.3);border-radius:14px;
  padding:clamp(28px,3.2vw,42px);box-shadow:0 24px 60px rgba(11,16,32,0.12)}
.et-root .card .eyebrow{font-weight:700;letter-spacing:0.18em}
.et-root .price{display:flex;align-items:baseline;gap:9px;margin-top:16px}
.et-root .price b{font-weight:800;font-size:clamp(40px,4.6vw,60px);letter-spacing:-0.035em;line-height:1}
.et-root .price span{font-size:15px;font-weight:500;color:var(--muted-dim)}
.et-root .card-cta{display:flex;flex-direction:column;align-items:stretch;gap:13px;
  margin-top:clamp(24px,2.8vw,32px)}
.et-root .card-cta .micro{text-align:center}

.et-root .faq{padding:clamp(56px,7vw,104px) var(--pad)}
.et-root .faq-wrap{max-width:920px;margin:0 auto}
.et-root .faq h2{font-weight:800;letter-spacing:-0.035em;line-height:1.1;font-size:clamp(24px,3vw,38px)}
.et-root .faq-list{margin-top:clamp(24px,3vw,40px);border-top:1px solid var(--line-strong)}
.et-root .faq-item{border-bottom:1px solid var(--line-strong)}
.et-root .faq-q{display:flex;align-items:center;justify-content:space-between;gap:24px;
  width:100%;padding:22px 0;cursor:pointer;background:none;border:none;text-align:left;
  font-family:inherit;color:inherit}
.et-root .faq-q span{font-weight:600;font-size:clamp(15px,1.3vw,17px);letter-spacing:-0.015em}
.et-root .faq-q i{font-size:20px;font-style:normal;font-weight:400;color:rgba(11,16,32,0.6);line-height:1}
.et-root .faq-q:focus-visible{outline:3px solid rgba(59,111,240,0.4);outline-offset:2px}
.et-root .faq-a{padding-bottom:24px;max-width:66ch;font-size:15px;line-height:1.7;color:rgba(11,16,32,0.7)}

.et-root .foot{background:var(--ink-deep);color:var(--on-dark)}
.et-root .foot-inner{max-width:var(--maxw);margin:0 auto;
  padding:clamp(72px,10vw,144px) var(--pad) clamp(32px,4vw,52px);text-align:center}
.et-root .foot h2{margin:0 auto;font-weight:800;letter-spacing:-0.035em;line-height:1.06;
  font-size:clamp(28px,4.4vw,60px);max-width:19ch;text-wrap:pretty}
.et-root .foot h2 em{font-style:normal;color:rgba(240,244,255,0.62)}
.et-root .foot-cta{display:flex;flex-direction:column;align-items:center;gap:14px;
  margin-top:clamp(28px,3.4vw,42px)}
.et-root .foot-cta .micro{color:rgba(240,244,255,0.62)}
.et-root .foot-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;
  gap:16px;margin-top:clamp(64px,8vw,108px);padding-top:26px;
  border-top:1px solid rgba(240,244,255,0.12)}
.et-root .foot-bar .brand-logo{height:20px}
.et-root .foot-bar>span{font-size:12px;color:rgba(240,244,255,0.58)}

@media (prefers-reduced-motion: reduce){
  .et-root .btn,.et-root .btn:hover{transition:none;transform:none}
  .et-root .shot-frame{transition:none}
  .et-root .shot-caret{animation:none}
}
`;

export default function FreeTrial() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD);
  const [regionSuffix, setRegionSuffix] = useState('');
  const appendUtm = useUtmParams();
  // Types a company name, then cross-fades to the research view. Falls back
  // to the static end state under reduced motion.
  const motionOk = !useMediaQuery('(prefers-reduced-motion: reduce)');
  const hero = useHeroDemo(motionOk);

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

  // Accordion keeps a single panel open, matching the artboard's faqSingleOpen default.
  const toggle = (i: number) =>
    setOpen((prev) => (prev[i] ? {} : { [i]: true }));

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

  const price = `${currency.symbol}97`;
  const FAQS = faqs(price);
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
          content="14 days of full access to Whyzer Elite: the research tool, the framework, and weekly live deal coaching. Nothing charged until day 14."
        />
        <meta
          name="description"
          content="14 days of full access to Whyzer Elite: the research tool, the framework, and weekly live deal coaching. Nothing charged until day 14."
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
              <span />
              <b>14-day free trial</b>
            </div>
            <h1>
              Every account already has a financial story.{' '}
              <em>Sellers who know it close five times more deals.</em>
            </h1>
            <p>
              Whyzer finds that story in company filings and earnings calls across 150+ markets
              worldwide, then gives you the framework and coaching to turn it into a point of view
              executives respond to.
            </p>
            <div className="hero-cta">
              {cta('btn')}
              <span className="micro">{CTA_MICRO}</span>
            </div>
          </div>
          <div className="shot">
            <div className="shot-bar">
              <span />
              <span />
              <span />
              <div className="shot-url">app.whyzer.ai/research</div>
            </div>
            <div className="shot-body">
              <img
                src="/free-trial/app-home.png"
                alt="Whyzer home — company search"
                width={1600}
                className="shot-frame"
                style={{ objectPosition: 'top center', opacity: hero.showResearch ? 0 : 1 }}
              />
              <img
                src="/free-trial/app-research.png"
                alt="Whyzer research view with fit score"
                width={1600}
                className="shot-frame"
                style={{ objectPosition: 'top left', opacity: hero.showResearch ? 1 : 0 }}
              />
              {!hero.showResearch && (
                <div className="shot-search" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="10.5" cy="10.5" r="6.5" stroke="#8A8AA0" strokeWidth="2.2" />
                    <path d="M15.5 15.5L21 21" stroke="#8A8AA0" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <span>{hero.typed}</span>
                  <i className="shot-caret" />
                </div>
              )}
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
          <span className="eyebrow">the proof</span>
          <h2>what the sellers using this are actually producing</h2>
          <div className="proof-grid">
            {PROOF.map((line, i) => (
              <div className="proof" key={line}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark">
        <div className="wrap">
          <span className="eyebrow">the framework</span>
          <h2>bigger deals. faster rooms. less guessing.</h2>
          <p className="lede">
            Sellers using this aren't just researching better, they're getting into rooms faster,
            carrying arguments that survive the first hard question, and turning single accounts
            into multi-year relationships. The mechanism behind it: Anchor, Shift, Pull.
          </p>
          <div className="fw-grid">
            {FRAMEWORK.map((f) => (
              <div className="fw" key={f.title}>
                <div className="fw-rule">
                  <i />
                  <s />
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
          <p className="kicker">
            That's not a research method. That's how bigger deals get into the room.
          </p>
        </div>
      </section>

      <section className="sec inc">
        <div className="wrap">
          <span className="eyebrow">what's included</span>
          <h2>14 days. everything included. clear terms after.</h2>
          <div className="vault">
            <span className="eyebrow">the vault</span>
            <h3>
              Access to the Vault: the frameworks, methodology, and courses behind $160M+ in closed
              deals.
            </h3>
            <p>The Netflix of strategic selling.</p>
          </div>
          <div className="inc-grid">
            {INCLUDED.map((item) => (
              <div className="inc-card" key={item.title}>
                <i />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="wrap pricing-grid">
          <div>
            <span className="eyebrow">pricing and terms</span>
            <h2>clear terms. nothing charged until day 14.</h2>
            <p className="lede">
              14 days, full access, card required today. Nothing is charged until day 14. After the
              trial, {price}/month. Cancel anytime, including during the trial, and you won't
              be charged.
            </p>
          </div>
          <div className="card">
            <span className="eyebrow">whyzer elite</span>
            <div className="price">
              <b>{price}</b>
              <span>/month after day 14</span>
            </div>
            <div className="card-cta">
              {checkoutCta('btn')}
              <span className="micro">{CTA_MICRO}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="faq-wrap">
          <h2>questions, answered.</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div className="faq-item" key={faq.q}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={!!open[i]}
                  aria-controls={`et-faq-${i}`}
                  onClick={() => toggle(i)}
                >
                  <span>{faq.q}</span>
                  <i aria-hidden="true">{open[i] ? '−' : '+'}</i>
                </button>
                {open[i] && (
                  <p className="faq-a" id={`et-faq-${i}`}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="foot-inner">
          <h2>
            the signal is public. <em>the argument still has to be built.</em>
          </h2>
          <div className="foot-cta">
            {cta('btn')}
            <span className="micro">{CTA_MICRO}</span>
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

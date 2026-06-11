import { useEffect, useMemo, useRef, useState } from 'react';
import { useUtmParams } from '@/hooks/useUtmParams';

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

const eliteUrl = (plan: 'monthly' | 'annual', regionSuffix: string) =>
  `https://subscribe.whyzer.ai/elite-${plan === 'annual' ? 'annually' : 'monthly'}${regionSuffix}`;

const STYLES = `
.eu-root{
  --bg:#0A0B1E;--bg-2:#0c0e26;--surface:#13142B;--surface-2:#171935;
  --line:#1F2147;--line-bright:#2c2f5e;
  --indigo:#6366F1;--indigo-2:#4F46E5;--indigo-soft:#8b8df5;
  --text:#EDEEF6;--muted:#A6A9C4;--muted-dim:#6f7296;
  --maxw:1180px;--narrow:760px;
  background:var(--bg);color:var(--text);
  font-family:'Inter',system-ui,sans-serif;font-weight:400;line-height:1.7;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;
}
.eu-root *{box-sizing:border-box;margin:0;padding:0}
.eu-root .wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;width:100%}
.eu-root .wrap-narrow{max-width:var(--narrow);margin:0 auto;padding:0 28px;width:100%}
.eu-root .grid-texture{position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(to right, rgba(99,102,241,.06) 1px, transparent 1px),linear-gradient(to bottom, rgba(99,102,241,.06) 1px, transparent 1px);
  background-size:48px 48px;
  -webkit-mask-image:radial-gradient(ellipse 90% 80% at 70% 20%, #000 0%, transparent 75%);
  mask-image:radial-gradient(ellipse 90% 80% at 70% 20%, #000 0%, transparent 75%);}
.eu-root .eyebrow{text-transform:uppercase;letter-spacing:.15em;font-size:12.5px;font-weight:600;color:var(--indigo-soft);margin-bottom:22px}
.eu-root .grad{background:linear-gradient(100deg,#8b8df5,#6366F1 55%,#4F46E5);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.eu-root .btn{display:inline-flex;align-items:center;justify-content:center;font-family:inherit;font-weight:600;font-size:16px;color:#fff;text-decoration:none;cursor:pointer;border:none;background:linear-gradient(135deg,#6366F1,#4F46E5);border-radius:8px;padding:14px 30px;letter-spacing:-.01em;box-shadow:0 8px 30px -8px rgba(99,102,241,.55), inset 0 1px 0 rgba(255,255,255,.18);transition:transform .15s ease, filter .15s ease, box-shadow .15s ease}
.eu-root .btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 14px 40px -8px rgba(99,102,241,.7), inset 0 1px 0 rgba(255,255,255,.22)}
.eu-root .btn:focus-visible{outline:3px solid rgba(99,102,241,.4);outline-offset:3px}
.eu-root .btn-lg{padding:17px 36px;font-size:17px}
.eu-root .btn-sm{padding:9px 18px;font-size:14px}
.eu-root .btn-block{width:100%}
.eu-root .cta-micro{font-size:13.5px;color:var(--muted-dim);margin-top:14px}
.eu-root .cta-micro.center{text-align:center}
.eu-root .nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:14px 0;transition:background .25s ease, border-color .25s ease, padding .25s ease;border-bottom:1px solid transparent}
.eu-root .nav.stuck{background:rgba(10,11,30,.82);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);padding:10px 0}
.eu-root .nav-inner{max-width:var(--maxw);margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between}
.eu-root .brand{display:flex;align-items:center;gap:10px;text-decoration:none}
.eu-root .brand-logo{height:26px;width:auto;display:block}
.eu-root .foot .brand-logo{height:22px}
.eu-root .nav-cta{opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .25s, transform .25s}
.eu-root .nav.stuck .nav-cta{opacity:1;transform:none;pointer-events:auto}
.eu-root .hero{position:relative;padding:96px 0 36px;overflow:hidden;min-height:100vh;display:flex;align-items:center}
.eu-root .hero-glow{position:absolute;top:50%;right:14%;width:620px;height:620px;border-radius:50%;transform:translateY(-50%);background:radial-gradient(circle, rgba(124,108,255,.6), rgba(79,70,229,.18) 42%, transparent 66%);filter:blur(16px);pointer-events:none;z-index:1}
.eu-root .hero-photo{position:absolute;bottom:0;right:0;z-index:2;height:88%;width:auto;max-width:none;object-fit:contain;object-position:bottom right;pointer-events:none}
.eu-root .hero-grid{position:relative;z-index:3;display:block;width:100%}
.eu-root .hero-copy{max-width:500px}
.eu-root .hero .eyebrow{position:relative;padding-bottom:14px;margin-bottom:20px}
.eu-root .hero .eyebrow::after{content:"";position:absolute;left:0;bottom:0;width:118px;height:1px;background:rgba(124,108,255,.5)}
.eu-root .hero-title{font-weight:800;font-size:clamp(32px,4.2vw,56px);line-height:1.04;letter-spacing:-.03em;text-wrap:balance;margin-bottom:20px}
.eu-root .hero-sub{font-size:17px;line-height:1.55;color:var(--muted);max-width:430px;margin-bottom:22px}
.eu-root .hero-cta .btn{box-shadow:0 10px 38px -6px rgba(99,102,241,.6), inset 0 1px 0 rgba(255,255,255,.2)}
.eu-root .hero-sign{display:flex;align-items:center;gap:13px;margin:0 0 22px}
.eu-root .sign-face{width:46px;height:46px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:var(--indigo-soft);background:linear-gradient(135deg,rgba(99,102,241,.24),rgba(79,70,229,.12));border:1px solid rgba(99,102,241,.4)}
.eu-root .sign-who{display:flex;flex-direction:column;line-height:1.35}
.eu-root .sign-who b{font-size:15px;font-weight:600;color:var(--text)}
.eu-root .sign-who i{font-size:13px;font-style:normal;color:var(--muted-dim)}
.eu-root .coach{padding:108px 0;background:var(--bg-2);border-top:1px solid rgba(31,33,71,.5);border-bottom:1px solid rgba(31,33,71,.5)}
.eu-root .coach-grid{display:grid;grid-template-columns:1fr 1fr;gap:54px;align-items:center}
.eu-root .sec-title.left{text-align:left}
.eu-root .coach-body{font-size:17px;color:var(--muted);margin:18px 0 22px;max-width:520px}
.eu-root .coach-points{list-style:none;display:grid;gap:11px}
.eu-root .coach-points li{position:relative;padding-left:26px;font-size:15px;color:var(--text)}
.eu-root .coach-points li::before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;border-radius:50%;background:var(--indigo);box-shadow:0 0 10px rgba(99,102,241,.8)}
.eu-root .coach-chat{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 40px 90px -40px rgba(0,0,0,.6)}
.eu-root .chat-head{display:flex;align-items:center;gap:11px;padding:14px 18px;border-bottom:1px solid var(--line);background:#0e1024}
.eu-root .chat-ava{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#6366F1,#4F46E5)}
.eu-root .chat-name{display:flex;flex-direction:column;font-size:14px;font-weight:600;line-height:1.3}
.eu-root .chat-name i{font-style:normal;font-size:11.5px;font-weight:400;color:#7cd3a3}
.eu-root .chat-body{padding:20px 18px;display:flex;flex-direction:column;gap:12px}
.eu-root .bub{max-width:84%;font-size:14px;line-height:1.5;padding:11px 14px;border-radius:14px}
.eu-root .bub-you{align-self:flex-end;background:linear-gradient(135deg,#6366F1,#4F46E5);color:#fff;border-bottom-right-radius:5px}
.eu-root .bub-coach{align-self:flex-start;background:#0f1126;border:1px solid var(--line);color:var(--text);border-bottom-left-radius:5px}
.eu-root .bub.typing{display:flex;gap:5px;align-items:center;padding:14px}
.eu-root .bub.typing span{width:7px;height:7px;border-radius:50%;background:var(--muted-dim);animation:euBlink 1.2s infinite both}
.eu-root .bub.typing span:nth-child(2){animation-delay:.2s}
.eu-root .bub.typing span:nth-child(3){animation-delay:.4s}
@keyframes euBlink{0%,60%,100%{opacity:.25}30%{opacity:1}}
.eu-root .sec-head{max-width:760px;margin:0 auto 56px;text-align:center}
.eu-root .sec-head.left{text-align:left;margin-left:0}
.eu-root .sec-title{font-weight:800;font-size:clamp(26px,3vw,38px);line-height:1.12;letter-spacing:-.025em;text-wrap:balance}
.eu-root .sec-sub{font-size:17px;color:var(--muted);margin-top:18px;max-width:620px;margin-left:auto;margin-right:auto}
.eu-root .sec-head.left .sec-sub{margin-left:0}
.eu-root .bridge{padding:108px 0;background:var(--bg-2);border-top:1px solid rgba(31,33,71,.5);border-bottom:1px solid rgba(31,33,71,.5)}
.eu-root .kicker-line{font-size:13px;text-transform:uppercase;letter-spacing:.14em;color:var(--indigo-soft);font-weight:600;margin-bottom:20px}
.eu-root .bridge-h{font-weight:800;font-size:clamp(24px,3vw,34px);letter-spacing:-.025em;line-height:1.15;margin-bottom:26px}
.eu-root .bridge-body{font-size:19px;color:var(--muted);margin-bottom:20px;max-width:660px}
.eu-root .bridge-punch{font-size:21px;font-weight:700;color:var(--text);margin-top:30px;letter-spacing:-.01em}
.eu-root .vault{padding:112px 0}
.eu-root .vault-foot{text-align:center;font-size:18px;color:var(--muted);margin-top:42px;max-width:680px;margin-left:auto;margin-right:auto}
.eu-root .vault-foot strong{color:var(--text);font-weight:600}
.eu-root .phase{margin-bottom:44px}
.eu-root .phase:last-of-type{margin-bottom:0}
.eu-root .phase-label{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.eu-root .phase-num{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--indigo-soft);font-weight:500}
.eu-root .phase-name{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--text)}
.eu-root .phase-note{font-size:14px;color:var(--muted-dim)}
.eu-root .course-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(218px,1fr));gap:16px}
.eu-root .course{position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:radial-gradient(120% 130% at 82% -10%, rgba(139,141,245,.34), transparent 56%),linear-gradient(155deg,#0e1027 0%, #2b2774 72%, #4F46E5 132%);padding:18px 18px 20px;min-height:122px;display:flex;flex-direction:column;justify-content:flex-end;transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease}
.eu-root .course:hover{transform:translateY(-3px);border-color:rgba(99,102,241,.6);box-shadow:0 20px 44px -22px rgba(99,102,241,.6)}
.eu-root .course-step{position:absolute;top:11px;right:13px;font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.24);border-radius:6px;padding:2px 7px;line-height:1}
.eu-root .course-title{font-size:18px;font-weight:800;letter-spacing:-.02em;line-height:1.12;color:#fff;margin-bottom:6px}
.eu-root .course-cat{font-size:12.5px;color:rgba(255,255,255,.66);line-height:1.4}
.eu-root .pair{max-width:900px;margin:54px auto 0;border:1px solid var(--line);border-radius:16px;background:var(--surface);overflow:hidden}
.eu-root .pair-head{padding:18px 26px;border-bottom:1px solid var(--line);font-size:14.5px;color:var(--muted)}
.eu-root .pair-head b{color:var(--text);font-weight:700}
.eu-root .pair-row{display:grid;grid-template-columns:1fr 28px 1fr;align-items:center;gap:18px;padding:20px 26px}
.eu-root .pair-row+.pair-row{border-top:1px solid var(--line)}
.eu-root .pair-tool,.eu-root .pair-vault{font-size:14.5px;line-height:1.5}
.eu-root .pair-tool{color:var(--muted)}
.eu-root .pair-tool b{color:var(--text);font-weight:600}
.eu-root .pair-vault{color:var(--text)}
.eu-root .pair-vault b{color:var(--indigo-soft);font-weight:600}
.eu-root .pair-arrow{color:var(--muted-dim);justify-self:center}
.eu-root .pair-arrow svg{width:22px;height:22px;display:block}
.eu-root .proof{padding:112px 0;background:var(--bg-2);border-top:1px solid rgba(31,33,71,.5)}
.eu-root .quotes{column-count:3;column-gap:20px}
.eu-root .quote{break-inside:avoid;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:24px 24px 22px;margin-bottom:20px;transition:border-color .18s ease, transform .18s ease}
.eu-root .quote:hover{border-color:rgba(99,102,241,.45);transform:translateY(-2px)}
.eu-root .quote blockquote{font-size:16.5px;line-height:1.55;color:var(--text);letter-spacing:-.01em;margin-bottom:20px}
.eu-root .quote figcaption{display:flex;align-items:center;gap:12px}
.eu-root .ph-face{width:40px;height:40px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--indigo-soft);background:linear-gradient(135deg,rgba(99,102,241,.2),rgba(79,70,229,.1));border:1px solid rgba(99,102,241,.35)}
.eu-root .who{display:flex;flex-direction:column;line-height:1.3}
.eu-root .who b{font-size:14.5px;font-weight:600;color:var(--text)}
.eu-root .who i{font-size:12.5px;font-style:normal;color:var(--muted-dim)}
.eu-root .pricing{padding:112px 0;background:var(--bg-2);border-top:1px solid rgba(31,33,71,.5)}
.eu-root .price-card{max-width:520px;margin:0 auto;background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--line-bright);border-radius:18px;padding:34px 34px 38px;box-shadow:0 40px 90px -40px rgba(99,102,241,.45), inset 0 1px 0 rgba(255,255,255,.04);position:relative}
.eu-root .price-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;flex-wrap:wrap}
.eu-root .price-name{font-size:20px;font-weight:700;letter-spacing:-.02em}
.eu-root .toggle{display:flex;background:#0e1024;border:1px solid var(--line);border-radius:999px;padding:3px}
.eu-root .tg{background:transparent;border:none;color:var(--muted);font-family:inherit;font-size:13px;font-weight:600;padding:7px 14px;border-radius:999px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:.18s}
.eu-root .tg span{font-size:10px;color:#b9f5cf;background:rgba(52,211,153,.12);padding:2px 6px;border-radius:999px}
.eu-root .tg.active{background:linear-gradient(135deg,#6366F1,#4F46E5);color:#fff}
.eu-root .tg.active span{background:rgba(255,255,255,.2);color:#fff}
.eu-root .price-amount{display:flex;align-items:baseline;gap:8px;margin-top:6px}
.eu-root .price-num{font-size:54px;font-weight:800;letter-spacing:-.03em}
.eu-root .price-per{font-size:18px;color:var(--muted)}
.eu-root .price-note{font-size:13.5px;color:var(--muted-dim);margin-top:8px}
.eu-root .checklist{list-style:none;margin:26px 0 28px;display:grid;gap:13px}
.eu-root .checklist li{position:relative;padding-left:32px;font-size:15px;color:var(--text);line-height:1.4}
.eu-root .checklist li::before{content:"";position:absolute;left:0;top:1px;width:20px;height:20px;border-radius:50%;background:rgba(99,102,241,.16);border:1px solid rgba(99,102,241,.45)}
.eu-root .checklist li::after{content:"";position:absolute;left:6.5px;top:6px;width:5px;height:9px;border:solid var(--indigo-soft);border-width:0 2px 2px 0;transform:rotate(45deg)}
.eu-root .risk{text-align:center;font-size:14px;color:var(--muted-dim);max-width:560px;margin:34px auto 0;line-height:1.6}
.eu-root .close{position:relative;padding:140px 0;overflow:hidden;background:var(--bg);border-top:1px solid rgba(31,33,71,.5)}
.eu-root .close-glow{position:absolute;bottom:-260px;left:50%;transform:translateX(-50%);width:900px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.32),transparent 65%);filter:blur(20px);pointer-events:none}
.eu-root .close-inner{position:relative;z-index:2;text-align:center}
.eu-root .close-h{font-weight:800;font-size:clamp(30px,4vw,52px);line-height:1.08;letter-spacing:-.03em;text-wrap:balance;margin-bottom:22px}
.eu-root .close-sub{font-size:18px;color:var(--muted);max-width:560px;margin:0 auto 36px}
.eu-root .foot{padding:34px 0;border-top:1px solid var(--line)}
.eu-root .foot-inner{display:flex;align-items:center;justify-content:space-between;gap:16px}
.eu-root .foot-copy{font-size:13.5px;color:var(--muted-dim)}
.eu-root .reveal{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1)}
.eu-root .reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.eu-root .reveal{opacity:1;transform:none;transition:none}}
@media(min-width:861px) and (max-height:820px){
  .eu-root .hero{padding:84px 0 28px}
  .eu-root .hero-title{font-size:clamp(28px,3.6vw,44px);margin-bottom:16px}
  .eu-root .hero-sub{font-size:15.5px;margin-bottom:18px;max-width:420px}
  .eu-root .hero .eyebrow{margin-bottom:14px;padding-bottom:10px;font-size:11.5px}
  .eu-root .hero-sign{margin-bottom:18px}
  .eu-root .sign-face{width:40px;height:40px;font-size:13px}
  .eu-root .btn-lg{padding:13px 28px;font-size:15px}
  .eu-root .hero-photo{height:92%}
}
@media(max-width:860px){
  .eu-root .hero{padding:128px 0 0;min-height:0;flex-direction:column;align-items:stretch;display:flex}
  .eu-root .hero-copy{max-width:none}
  .eu-root .hero-photo{position:relative;order:2;right:auto;bottom:auto;width:min(78%,420px);margin:36px auto 0;display:block;height:auto;vertical-align:bottom}
  .eu-root .hero-grid{order:1}
  .eu-root .hero-glow{top:auto;bottom:-80px;right:50%;transform:translateX(50%);width:560px;height:560px}
  .eu-root .coach-grid{grid-template-columns:1fr;gap:36px}
  .eu-root .quotes{column-count:2}
}
@media(max-width:640px){
  .eu-root .wrap,.eu-root .wrap-narrow,.eu-root .nav-inner{padding:0 20px}
  .eu-root .quotes{column-count:1}
  .eu-root .price-card{padding:26px 22px 30px}
  .eu-root .price-num{font-size:46px}
  .eu-root .hero{padding:108px 0 0}
  .eu-root .hero-photo{width:min(85%,360px);margin:28px auto 0}
  .eu-root .bridge,.eu-root .vault,.eu-root .proof,.eu-root .pricing,.eu-root .coach{padding:78px 0}
  .eu-root .close{padding:96px 0}
  .eu-root .bridge-body{font-size:18px}
  .eu-root .pair-row{grid-template-columns:1fr;gap:10px;padding:18px 20px}
  .eu-root .pair-arrow{justify-self:start;transform:rotate(90deg)}
  .eu-root .pair-head{padding:16px 20px}
}
`;

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';

const TESTIMONIALS = [
  { initials: 'PH', name: 'Paul Hammond', title: 'Enterprise AE', quote: 'Whyzer flagged a cybersecurity breach that helped me book a CISO meeting on my first try using Jamal\'s technique. It worked immediately.' },
  { initials: 'BT', name: 'Brian Tripp', title: 'Strategic Account Manager', quote: 'It\'s built for our specific needs. Way better than agents like Perplexity or Claude for strategic selling.' },
  { initials: 'DI', name: 'David Inukpuk', title: 'Enterprise Seller', quote: 'What used to take a rep a year, I can do in two weeks with Whyzer. It helps us work on the right accounts.' },
  { initials: 'LW', name: 'Lee Winer', title: 'AE', quote: 'Whyzer makes detailed info from 10-Ks, 10-Qs, and earnings reports actually usable for salespeople.' },
  { initials: 'KG', name: 'Kyle G.', title: 'Strategic Rep', quote: 'It\'s like OpenAI and Perplexity\'s deep research had a baby who gives a shit about enterprise selling.' },
  { initials: 'MB', name: 'Matt Brown', title: 'Enterprise AE', quote: 'Feels like a business analyst is watching your back. All the context is laid out.' },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function EliteUpgrade() {
  const [stuck, setStuck] = useState(false);
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD);
  const [regionSuffix, setRegionSuffix] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const appendUtm = useUtmParams();

  useEffect(() => {
    document.title = 'Whyzer Elite — The system behind the framework.';

    if (!document.querySelector('link[data-eu-fonts]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONTS_HREF;
      link.setAttribute('data-eu-fonts', '');
      document.head.appendChild(link);
    }

    const onScroll = () => setStuck(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
      })
      .catch(() => {});
  }, []);

  const annualHref = useMemo(() => appendUtm(eliteUrl('annual', regionSuffix)), [regionSuffix, appendUtm]);

  useEffect(() => {
    if (!rootRef.current) return;
    const targets = rootRef.current.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = currency.symbol;
  const priceNum = plan === 'annual' ? `${s}83` : `${s}97`;
  const pricePer = '/month';
  const priceNote =
    plan === 'annual'
      ? `Billed annually at ${s}997. Two months free versus monthly.`
      : `Billed monthly. Or switch to annual for ${s}997/year, two months free.`;
  const priceHref = appendUtm(eliteUrl(plan, regionSuffix));

  return (
    <div ref={rootRef} className="eu-root">
      <style>{STYLES}</style>

      <header className={`nav${stuck ? ' stuck' : ''}`}>
        <div className="nav-inner">
          <a href="#top" className="brand">
            <img
              className="brand-logo"
              src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
              alt="Whyzer"
            />
          </a>
          <a href="#pricing" className="btn btn-sm nav-cta">Get Elite — {s}97/mo</a>
        </div>
      </header>

      <a id="top" />

      <section className="hero">
        <div className="grid-texture" />
        <div className="hero-glow" />
        <img className="hero-photo" src="/jamal-hero-1.png" alt="Jamal Reimer, Founder of Whyzer" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">A note from the founder</p>
            <h1 className="hero-title">
              You've learned how to read an account. <span className="grad">Now let me show you how to win it.</span>
            </h1>
            <p className="hero-sub">
              I spent a career closing $160M+ in SaaS, and I wrote down everything that actually worked. That's the Vault. You already have Whyzer doing the research. This is the part where I sit next to you for the rest of the deal, and the rest of your career.
            </p>
            <div className="hero-sign">
              <span className="sign-face">JR</span>
              <span className="sign-who"><b>Jamal Reimer</b><i>Founder, Whyzer · ex-enterprise seller</i></span>
            </div>
            <div className="hero-cta">
              <a href="#pricing" className="btn btn-lg">Step into Elite — {s}97/mo</a>
              <p className="cta-micro">Cancel anytime. One closed deal pays for years of Elite.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bridge reveal">
        <div className="wrap-narrow">
          <p className="kicker-line">The tactical difference</p>
          <h2 className="bridge-h">You already have the intelligence. The Vault is the part nobody hands you.</h2>
          <p className="bridge-body">Whyzer surfaces the financial signals, the exec's language, the landmines. That gets you to a defensible point of view in minutes.</p>
          <p className="bridge-body">Everything after that is judgment. Which accounts to work. How to get the meeting. How to run the room. How to move from a strong POV to a signed contract. That judgment is what the Vault teaches, deal stage by deal stage.</p>
          <p className="bridge-punch">Same product. A far better operator using it.</p>
        </div>
      </section>

      <section className="vault reveal" id="vault">
        <div className="wrap">
          <header className="sec-head">
            <p className="eyebrow">Inside the Vault</p>
            <h2 className="sec-title">Eleven courses. The full deal, start to close.</h2>
            <p className="sec-sub">Pulled from real deals by Jamal Reimer, who closed $160M+ in SaaS. Organized the way a deal actually runs, so every course maps to something you're doing in Whyzer this week.</p>
          </header>

          <div className="phase">
            <div className="phase-label"><span className="phase-num">01</span><span className="phase-name">Get ready</span><span className="phase-note">The fundamentals before you touch an account.</span></div>
            <div className="course-grid">
              <article className="course"><h3 className="course-title">Start Here</h3><p className="course-cat">Onboarding &amp; orientation</p></article>
              <article className="course"><h3 className="course-title">Whyzer Premium</h3><p className="course-cat">Getting the most out of the platform</p></article>
              <article className="course"><h3 className="course-title">Foundations</h3><p className="course-cat">Financial fluency &amp; strategic thinking</p></article>
            </div>
          </div>

          <div className="phase">
            <div className="phase-label"><span className="phase-num">02</span><span className="phase-name">Run the deal</span><span className="phase-note">Five stages, the way a real deal moves.</span></div>
            <div className="course-grid">
              <article className="course"><span className="course-step">01</span><h3 className="course-title">Territory Management</h3><p className="course-cat">Territory strategy &amp; account research</p></article>
              <article className="course"><span className="course-step">02</span><h3 className="course-title">Finding the Story</h3><p className="course-cat">POV development &amp; deal discovery</p></article>
              <article className="course"><span className="course-step">03</span><h3 className="course-title">Executive Engagement</h3><p className="course-cat">Executive access &amp; strategic engagement</p></article>
              <article className="course"><span className="course-step">04</span><h3 className="course-title">Prove It</h3><p className="course-cat">Evaluation, validation &amp; deal progression</p></article>
              <article className="course"><span className="course-step">05</span><h3 className="course-title">Win It</h3><p className="course-cat">Negotiation, procurement &amp; closing</p></article>
            </div>
          </div>

          <div className="phase">
            <div className="phase-label"><span className="phase-num">03</span><span className="phase-name">Stay sharp</span><span className="phase-note">Live application, every week.</span></div>
            <div className="course-grid">
              <article className="course"><h3 className="course-title">Whyzer Academy</h3><p className="course-cat">Live application &amp; real-world practice</p></article>
              <article className="course"><h3 className="course-title">Live Coaching &amp; Replays</h3><p className="course-cat">Coaching sessions &amp; replay library</p></article>
            </div>
          </div>

          <div className="pair">
            <p className="pair-head"><b>How it supercharges Whyzer.</b> Every course plugs into something the product already does.</p>
            <div className="pair-row">
              <p className="pair-tool"><b>Whyzer</b> flags a margin miss buried in the 10-K.</p>
              <span className="pair-arrow"><Arrow /></span>
              <p className="pair-vault"><b>Foundations</b> teaches you what that miss means and how to turn it into a reason to meet.</p>
            </div>
            <div className="pair-row">
              <p className="pair-tool"><b>Whyzer</b> drafts a defensible point of view in two minutes.</p>
              <span className="pair-arrow"><Arrow /></span>
              <p className="pair-vault"><b>Finding the Story</b> teaches you to shape it into a narrative a CFO acts on.</p>
            </div>
            <div className="pair-row">
              <p className="pair-tool"><b>Whyzer</b> maps the buying committee and the org.</p>
              <span className="pair-arrow"><Arrow /></span>
              <p className="pair-vault"><b>Executive Engagement</b> teaches you how to actually get the room.</p>
            </div>
          </div>

          <p className="vault-foot">And every week, <strong>live sessions with Jamal and the coaches</strong>. Bring a real deal, leave with a real next move.</p>
        </div>
      </section>

      <section className="coach reveal">
        <div className="wrap coach-grid">
          <div className="coach-copy">
            <p className="eyebrow">Coach Jamal · always on</p>
            <h2 className="sec-title left">When the live session is over, I'm still in your corner.</h2>
            <p className="coach-body">Coach Jamal is the AI version of me, trained on 100+ hours of my coaching. Paste a POV, a cold email, a tough objection, and get an answer the way I'd give it. It's the difference between reading the courses and having someone who has run the play sitting next to you at 11pm.</p>
            <ul className="coach-points">
              <li>Pressure-test a POV the night before a 9am meeting</li>
              <li>Rewrite a stalled email so a CFO actually opens it</li>
              <li>Work a real objection until you have a real answer</li>
            </ul>
          </div>
          <div className="coach-chat">
            <div className="chat-head"><span className="chat-ava">JR</span><span className="chat-name">Coach Jamal<i>online</i></span></div>
            <div className="chat-body">
              <div className="bub bub-you">My champion at Vera went quiet after the demo. What do I do?</div>
              <div className="bub bub-coach">Quiet usually means the deal moved above their head. Stop nurturing the champion. Go back to the margin story from your POV and use it to earn a line to the CFO directly. Want the exact email?</div>
              <div className="bub bub-you">Yes.</div>
              <div className="bub bub-coach typing"><span /><span /><span /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="proof reveal">
        <div className="wrap">
          <header className="sec-head">
            <p className="eyebrow">The proof</p>
            <h2 className="sec-title">Sellers using this every week.</h2>
            <p className="sec-sub">Not paid endorsements. Members. Closing deals.</p>
          </header>
          <div className="quotes">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="quote">
                <blockquote>"{t.quote}"</blockquote>
                <figcaption>
                  <span className="ph-face">{t.initials}</span>
                  <span className="who"><b>{t.name}</b><i>{t.title}</i></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing reveal" id="pricing">
        <div className="wrap-narrow">
          <header className="sec-head">
            <p className="eyebrow">One door</p>
            <h2 className="sec-title">One price. Full access. Cancel anytime.</h2>
          </header>

          <div className="price-card">
            <div className="price-top">
              <p className="price-name">Whyzer Elite</p>
              <div className="toggle">
                <button type="button" className={`tg${plan === 'monthly' ? ' active' : ''}`} onClick={() => setPlan('monthly')}>Monthly</button>
                <button type="button" className={`tg${plan === 'annual' ? ' active' : ''}`} onClick={() => setPlan('annual')}>Annual <span>save 2 mo</span></button>
              </div>
            </div>

            <div className="price-amount">
              <span className="price-num">{priceNum}</span>
              <span className="price-per">{pricePer}</span>
            </div>
            <p className="price-note">{priceNote}</p>

            <ul className="checklist">
              <li>Unlimited POVs on 7,500+ global companies</li>
              <li>The Vault: 11 courses across the full deal lifecycle</li>
              <li>Coach Jamal AI, trained on 100+ hours, available 24/7</li>
              <li>Foundations, Territory, Finding the Story, Prove It, Win It</li>
              <li>Executive Engagement and exec access training</li>
              <li>Whyzer Academy: live application sessions</li>
              <li>Weekly live coaching with Jamal, plus the replay library</li>
              <li>The Whyzer Community: 6,000+ enterprise sellers</li>
            </ul>

            <a href={priceHref} className="btn btn-lg btn-block">Get Whyzer Elite</a>
            <p className="cta-micro center">Cancel anytime. One closed deal pays for years.</p>
          </div>

          <p className="risk">Comparable financial intelligence tools (AlphaSense, Bloomberg, Gartner) start at $15,000/year. None of them know what a POV is.</p>
        </div>
      </section>

      <section className="close reveal">
        <div className="grid-texture" />
        <div className="close-glow" />
        <div className="wrap-narrow close-inner">
          <h2 className="close-h">Someone's getting to your CFO this week. <span className="grad">Make it you.</span></h2>
          <p className="close-sub">Eleven courses, weekly live coaching, and the Whyzer product underneath all of it. Included with Elite.</p>
          <a href="#pricing" className="btn btn-lg">Get Whyzer Elite — {s}97/mo</a>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-inner">
          <img
            className="brand-logo"
            src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
            alt="Whyzer"
          />
          <span className="foot-copy">The system behind the framework.</span>
        </div>
      </footer>
    </div>
  );
}

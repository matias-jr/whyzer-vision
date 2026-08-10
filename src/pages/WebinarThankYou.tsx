import { useEffect, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useUtmParams } from '@/hooks/useUtmParams';

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
  'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'CH','NO','IS','AL','BA','ME','MK','RS','MD','UA','BY','GE','AM','AZ',
  'LI','MC','SM','VA','AD','XK',
]);

// ── v2 design system, inverted: a light page with #070B17 reserved for the two
// sections that stay dark (hero/video priming, final CTA). Mirrors the
// light-band rhythm used on the financial-fluency page.
const DARK = '#070B17';
const DARK2 = '#0E1526';
const ACCENT = '#3B6FF0';
const ACCENT_DARK = '#2F5FD8';
const ACCENT_TINT = '#EAF0FE';

// Light-section text + surfaces
const INK = '#0B1020';
const BODY = '#4A5570';
const MUTED = '#7C88A4';
const BG = '#FAFBFD';
const BG_ALT = '#F1F4FB';
const WHITE = '#FFFFFF';
const LINE = '#E2E7F2';
const EYEBROW = ACCENT_DARK;

// Dark-section text (used only inside the two dark sections)
const D_INK = '#F0F4FF';
const D_BODY = '#C3CCE2';
const D_MUTED = '#8A96B4';
const D_EYEBROW = '#7FA0F5';
const BORDER = 'rgba(255,255,255,0.08)';

// Layered cards: white cards sit on the tinted section bands.
const CARD_PRIMARY = WHITE;

// ── Glass surfaces, matching the registration page: a translucent fill plus a
// backdrop blur and a lit top edge. Light cards frost against the page tint;
// dark cards frost against the dark bands.
const GLASS_LIGHT = 'rgba(255,255,255,0.58)';
const GLASS_LIGHT_BORDER = 'rgba(255,255,255,0.75)';
const GLASS_LIGHT_SHADOW = '0 8px 32px -12px rgba(11,16,32,0.16)';
const GLASS_DARK = 'rgba(255,255,255,0.06)';
const GLASS_DARK_BORDER = 'rgba(255,255,255,0.14)';
const GLASS_DARK_SHADOW = '0 8px 32px -12px rgba(0,0,0,0.55)';
const GLASS_BLUR = 'blur(12px) saturate(140%)';
const HEADING: React.CSSProperties = { fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.035em' };

// ── §5 How It Works
const howItWorks = [
  {
    step: 'Search',
    body: 'Pull up any of 7,500+ public and private companies, anywhere in the world. Whyzer reads the SEC filings, earnings calls, investor letters, and proxy statements the same way I just did on camera.',
  },
  {
    step: 'Build',
    body: 'Whyzer surfaces the financial priorities and executive pressures actually driving the account, then generates two to three boardroom-ready points of view connecting those priorities to what you sell.',
  },
  {
    step: 'Walk In Prepared',
    body: "Every claim is sourced back to the original filing. You're not editing an AI draft and hoping it holds up. You're reading something built to survive a CFO pushing back on it.",
  },
];

// ── §6 What's Included in Whyzer Elite
const eliteFeatures = [
  {
    title: 'The full research and POV engine',
    body: 'Unlimited research across 7,500+ global companies. Unlimited Deal Maps, Executive POV Dossiers, and podcast-style account briefings.',
  },
  {
    title: 'The Vault',
    body: "Jamal's complete methodology from $160M+ in closed deals: the Pipeline Flywheel, MDA Masterclass, Executive Outreach Course, and Financial Fluency 101.",
  },
  {
    title: 'Coach Jamal, your AI co-pilot',
    body: 'An AI coach trained on 100+ hours of Jamal’s coaching. Ask it how to write a CFO POV or handle a stalled multi-thread, and get a structured answer immediately.',
  },
  {
    title: 'Whyzer Academy',
    body: 'Monthly live sessions with Jamal, plus deal reviews and MDA office hours applied to real, current opportunities. Including yours.',
  },
  {
    title: 'Global coverage',
    body: "The accounts your competitors can't research. HSBC, Revolut, Stripe, Monzo, and thousands of private and international companies.",
  },
];

// ── §7 Testimonial grid #1. Surnames reduced to an initial throughout.
const grid1 = [
  {
    quote: '"The EVP looked at the point of view and said, ‘How do you know this? That’s insider information.’"',
    name: 'Jesse M.',
    detail: 'enterprise seller, top-10 global financial company',
  },
  {
    quote: '"It’s built for our specific needs. Way better than agents like Perplexity or Claude for strategic selling."',
    name: 'Brian T.',
    detail: '',
  },
  {
    quote: '$5.75M closed. $11.5M more sitting in pipeline, built the same way, account by account.',
    name: 'Enterprise AE',
    detail: 'using the Whyzer method',
  },
];

// ── §10 Testimonial grid #2. Jamal's own quote removed — a founder statement
// doesn't function as a testimonial. Replacements drawn from the home-page
// marquee (Testimonials.tsx).
const grid2 = [
  {
    quote: '"What used to take a rep a year, I can do in two weeks with Whyzer. It helps us work on the right accounts."',
    name: 'David I.',
    detail: '',
  },
  {
    quote: '"Whyzer flagged a cybersecurity breach that helped me book a CISO meeting on my first try using Jamal’s technique — it worked immediately."',
    name: 'Paul H.',
    detail: '',
  },
  {
    quote: '"Compared to tools like HockeyStack, Whyzer makes detailed info from 10Ks, 10Qs, and earnings reports actually usable for salespeople."',
    name: 'Lee W.',
    detail: '',
  },
];

// ── §9 FAQ
const faqs = [
  {
    q: 'Do I need a credit card to start the trial?',
    a: "Yes. You won't be charged until your 14-day trial ends, and you can cancel any time before then.",
  },
  {
    q: "What's different about Elite versus Premium?",
    a: 'Premium gives you the research and POV engine. Elite adds The Vault, Coach Jamal, and monthly live sessions with Jamal, the full methodology behind the tool, not just the tool itself.',
  },
  {
    q: 'Does Whyzer work on private and international companies?',
    a: "Yes. Coverage spans 7,500+ public and private companies globally, including accounts most research tools can't reach.",
  },
  {
    q: 'Is my data secure?',
    a: 'Whyzer only pulls from public, permissioned sources: filings, earnings calls, and investor communications. Nothing scraped, nothing confidential, encrypted infrastructure throughout.',
  },
  {
    q: 'What happens after the discount period?',
    a: 'Elite renews at $97/month starting month 4. Cancel any time before then if it’s not a fit.',
  },
];

const WebinarThankYou = () => {
  const appendUtm = useUtmParams();
  // First FAQ item starts expanded, per the brief.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [regionSuffix, setRegionSuffix] = useState('');
  // Elite trial checkout (was premium-monthly). Matches the URL pattern used in
  // Pricing.tsx and EliteUpgrade.tsx, including the region suffix.
  const trialUrl = appendUtm(`https://subscribe.whyzer.ai/elite-monthly${regionSuffix}`);

  useEffect(() => {
    loadCss('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  }, []);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const code: string = data.country_code ?? '';
        if (code === 'GB') setRegionSuffix('-uk');
        else if (EU_COUNTRIES.has(code)) setRegionSuffix('-eu');
        else if (code === 'CA') setRegionSuffix('-ca');
        else if (code === 'AU') setRegionSuffix('-au');
        // else stays USD/default with no suffix
      })
      .catch(() => {/* silently keep default */});
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        color: INK,
        background: BG,
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* The wrapper is light; the hero/video block below keeps the dark
          treatment and spans full width behind the centred column. */}
      {/* HERO + VIDEO — kept dark, full-width band */}
      <div style={{ background: DARK, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* PRIMING LINE */}
          <section style={{ padding: '88px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -220, left: '50%', transform: 'translateX(-50%)', width: 800, height: 560, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.34) 0%, rgba(59,111,240,0.12) 40%, transparent 70%)', filter: 'blur(20px)', animation: 'wty-glowPulse 6s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, backgroundImage: 'radial-gradient(rgba(127,160,245,0.5) 1px, transparent 1.5px)', backgroundSize: '28px 28px', WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 15%, black 0%, transparent 75%)', maskImage: 'radial-gradient(ellipse 60% 55% at 50% 15%, black 0%, transparent 75%)', pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: D_EYEBROW, position: 'relative', animation: 'wty-fadeInUp 0.7s ease both' }}>
              You're in
            </div>
            <p style={{ fontSize: 21, lineHeight: 1.6, maxWidth: 620, margin: 0, color: D_BODY, position: 'relative', animation: 'wty-fadeInUp 0.8s ease 0.05s both' }}>
              Before you press play, go pull up that stalled account. The one you've sent three follow-ups to and heard nothing back. You're going to read it the way a CFO would, right alongside me. Twenty minutes, and you'll walk out knowing exactly why they've gone quiet.
            </p>
          </section>

          {/* VIDEO */}
          <section style={{ padding: '16px 24px 36px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 800, aspectRatio: '16/9', borderRadius: 16, position: 'relative', overflow: 'hidden', background: 'repeating-linear-gradient(135deg, #0E1526, #0E1526 12px, #141D33 12px, #141D33 24px)', border: `1px solid ${BORDER}`, boxShadow: '0 30px 70px -30px rgba(59,111,240,0.45)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(59,111,240,0.20) 0%, transparent 65%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px -6px rgba(59,111,240,0.7)' }}>
                  <div style={{ width: 0, height: 0, borderTop: '14px solid transparent', borderBottom: '14px solid transparent', borderLeft: '22px solid #FFFFFF', marginLeft: 5 }} />
                </div>
                <div style={{ fontFamily: "'Inter', monospace", fontSize: 13, letterSpacing: '0.06em', color: D_MUTED, textTransform: 'uppercase' }}>
                  webinar video
                </div>
              </div>
            </div>
          </section>

          {/* POST-VIDEO CTA — scrolls to the pricing box, which carries checkout */}
          <section style={{ padding: '0 24px 30px', display: 'flex', justifyContent: 'center' }}>
            <a href="#pricing" className="wty-cta" style={{ background: ACCENT, color: '#FFFFFF', fontWeight: 700, fontSize: 17, padding: '17px 38px', borderRadius: 10, textDecoration: 'none', display: 'inline-block', boxShadow: '0 10px 30px -8px rgba(59,111,240,0.7)' }}>
              Start My Free Trial Now &rarr;
            </a>
          </section>
        </div>

      </div>

      {/* PROMO BAR — full-bleed, directly under the post-video CTA */}
      <div style={{ background: ACCENT, color: '#FFFFFF', textAlign: 'center', padding: '26px 24px', position: 'relative', zIndex: 3 }}>
        <p style={{ margin: '0 auto', maxWidth: 900, fontSize: 'clamp(17px, 2.4vw, 22px)', lineHeight: 1.4, fontWeight: 700, letterSpacing: '-0.01em' }}>
          <span aria-hidden="true">&#128293;</span> LIMITED TIME &mdash; Whyzer Elite for $57/month for your first 3 months.
        </p>
        <p style={{ margin: '8px auto 0', maxWidth: 900, fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.5, fontWeight: 600, opacity: 0.95 }}>
          Code <strong style={{ fontWeight: 800, letterSpacing: '0.04em', padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.18)' }}>FLUENCY57</strong> at trial checkout.
        </p>
      </div>

      {/* WALL / BRIDGE TO OFFER */}
      <section style={{ padding: '76px 24px', display: 'flex', justifyContent: 'center', position: 'relative', background: BG }}>
        <div style={{ position: 'absolute', top: '10%', right: '6%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(59,111,240,0.12) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              You just watched what fifteen minutes of reading looks like on one account. Now multiply that by the twenty, forty, sixty accounts you're actually carrying. That's not a skill problem anymore. That's a leverage problem.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              That's the only reason Whyzer exists: the same read you just watched me build, sourced and verified against the actual filings and calls, in under two minutes, on any company you sell to.
            </p>
          </div>
        </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '76px 24px', background: BG_ALT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, position: 'relative', overflow: 'hidden' }}>
        {/* Soft accent blooms give the frosted cards something to refract */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '42%', left: '4%', width: 420, height: 300, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.20) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '2%', right: '3%', width: 380, height: 280, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.14) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(26px, 3.6vw, 34px)', lineHeight: 1.2, margin: '0 0 40px', color: INK, textAlign: 'center' }}>
            From stalled account to boardroom-ready in under two minutes.
          </h2>
          <div className="wty-steps">
            {howItWorks.map((s, i) => (
              <div key={s.step} className="wty-glass" style={{ borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ ...HEADING, fontSize: 13, letterSpacing: '0.12em', color: ACCENT, marginBottom: 12 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ ...HEADING, fontSize: 20, margin: '0 0 10px', color: INK }}>{s.step}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, color: BODY }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED IN WHYZER ELITE + PRICING */}
      <section style={{ padding: '76px 24px', background: BG, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '18%', right: '2%', width: 460, height: 340, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.16) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '6%', left: '2%', width: 400, height: 320, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.13) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(26px, 3.6vw, 34px)', lineHeight: 1.2, margin: '0 0 36px', color: INK, textAlign: 'center' }}>
            Everything in Whyzer Elite
          </h2>
          {/* Compact 2-up grid: a short label carries the promise, the detail sits
              underneath, so five features read in roughly one screen. */}
          <div className="wty-features">
            {eliteFeatures.map((f) => (
              <div key={f.title} className="wty-glass" style={{ borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 13 }}>
                <Check size={18} strokeWidth={2.6} style={{ flexShrink: 0, marginTop: 3, color: ACCENT }} />
                <div>
                  <h3 style={{ ...HEADING, fontSize: 16, margin: '0 0 6px', color: INK }}>{f.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: BODY }}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Value framing, mirroring the home page's cost-comparison line. */}
          <p style={{ fontSize: 16, lineHeight: 1.7, margin: '44px auto 28px', maxWidth: 660, color: BODY, textAlign: 'center' }}>
            Getting one executive meeting costs more in time, effort, and expense than Whyzer costs in a year. Comparable financial intelligence exists (AlphaSense, Gartner, Bloomberg) at $15,000&ndash;$50,000 per year. Not one of them knows what a POV is.
          </p>

          {/* Pricing box — kept dark so the conversion moment stands out of the
              light section, the same role the form card plays on the reg page. */}
          <div id="pricing" className="wty-price-box" style={{ maxWidth: 480, margin: '0 auto', background: DARK2, border: `1px solid rgba(59,111,240,0.45)`, borderRadius: 20, padding: '30px 26px 32px', textAlign: 'center', boxShadow: '0 24px 60px -28px rgba(11,16,32,0.55)', position: 'relative', scrollMarginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 18 }}>
              <span style={{ ...HEADING, fontSize: 15, color: D_EYEBROW, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Whyzer Elite</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(59,111,240,0.45)', background: 'rgba(59,111,240,0.16)', color: D_EYEBROW, whiteSpace: 'nowrap' }}>FULL ACCESS</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20, color: D_MUTED, textDecoration: 'line-through' }}>$97</span>
              <span style={{ ...HEADING, fontSize: 'clamp(38px, 9vw, 48px)', lineHeight: 1, color: D_INK }}>$57</span>
              <span style={{ fontSize: 15, color: D_BODY }}>per seat / month</span>
            </div>
            <p style={{ ...HEADING, fontSize: 15, margin: '0 0 14px', color: D_INK }}>for your first 3 months</p>

            {/* Value signals */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999, background: 'rgba(59,111,240,0.16)', color: D_EYEBROW, border: '1px solid rgba(59,111,240,0.35)' }}>Save $120 over 3 months</span>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: D_BODY, border: `1px solid ${GLASS_DARK_BORDER}` }}>Code FLUENCY57</span>
            </div>

            {/* Terms, itemised so nothing is buried in prose */}
            <ul style={{ listStyle: 'none', margin: '0 0 22px', padding: '18px 0 0', borderTop: `1px solid ${GLASS_DARK_BORDER}`, display: 'flex', flexDirection: 'column', gap: 11, textAlign: 'left' }}>
              {[
                'Today: $0. Full Elite access free for 14 days.',
                'Months 1–3 after the trial: $57/month with code FLUENCY57.',
                'Month 4 onward: $97/month, the standard Elite rate.',
                "Cancel any time before the trial ends and you're never charged.",
              ].map((line) => (
                <li key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, lineHeight: 1.55, color: D_BODY }}>
                  <Check size={16} strokeWidth={2.6} style={{ flexShrink: 0, marginTop: 3, color: ACCENT }} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <a href={trialUrl} className="wty-cta" style={{ display: 'block', width: '100%', boxSizing: 'border-box', background: ACCENT, color: '#FFFFFF', fontWeight: 700, fontSize: 16, padding: '16px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 10px 30px -8px rgba(59,111,240,0.7)' }}>
              Start My Free Trial &rarr;
            </a>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, margin: '12px 0 0', color: D_MUTED }}>
              No charge today. Cancel anytime in your Client Portal.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL GRID #1 */}
      <section style={{ padding: '76px 24px', background: BG_ALT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '30%', left: '6%', width: 420, height: 300, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.16) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(24px, 3.4vw, 32px)', lineHeight: 1.2, margin: '0 0 36px', color: INK, textAlign: 'center' }}>
            More revenue, not just more replies
          </h2>
          <div className="wty-grid">
            {grid1.map((t, i) => (
              <figure key={i} className="wty-testimonial wty-glass" style={{ borderRadius: 16, padding: 26, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <blockquote style={{ fontSize: 16, lineHeight: 1.6, margin: 0, color: BODY }}>{t.quote}</blockquote>
                <figcaption style={{ fontSize: 14, color: MUTED, marginTop: 'auto' }}>
                  <span style={{ ...HEADING, color: EYEBROW, fontSize: 14 }}>{t.name}</span>
                  {t.detail && <span>, {t.detail}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* TRIAL TERMS BAND — cancellation window, not a refund guarantee */}
      <section style={{ padding: '64px 24px', background: ACCENT_TINT, borderBottom: `1px solid ${LINE}` }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ ...HEADING, fontSize: 'clamp(22px, 3.2vw, 28px)', lineHeight: 1.28, margin: '0 0 16px', color: INK }}>
              Try it on the account that's gone quiet. See if it changes how you'd walk into the room.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: '0 0 18px', color: BODY }}>
              Fourteen days free, full Elite access, no restrictions on which three accounts you pick. If it's not for you, cancel before the trial ends and you're never charged.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: 0, color: MUTED }}>
              $0 today &rarr; $57/month for months 1&ndash;3 with code FLUENCY57 &rarr; $97/month from month 4. Cancel anytime in your Client Portal.
            </p>
          </div>
        </section>

      {/* FAQ */}
      <section style={{ padding: '76px 24px', background: BG }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ ...HEADING, fontSize: 'clamp(24px, 3.4vw, 32px)', lineHeight: 1.2, margin: '0 0 28px', color: INK, textAlign: 'center' }}>
              Questions, answered.
            </h2>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LINE}` }}>
                <button
                  type="button"
                  className="wty-faq-btn"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  style={{ width: '100%', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  <span style={{ ...HEADING, fontSize: 16.5, lineHeight: 1.4, color: openIndex === i ? ACCENT : INK }}>{faq.q}</span>
                  <ChevronDown size={18} style={{ flexShrink: 0, transition: 'transform 0.2s ease, color 0.2s ease', transform: openIndex === i ? 'rotate(180deg)' : 'none', color: openIndex === i ? ACCENT : MUTED }} />
                </button>
                <div style={{ overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease', maxHeight: openIndex === i ? 600 : 0, opacity: openIndex === i ? 1 : 0 }}>
                  <p style={{ fontSize: 15.5, lineHeight: 1.75, margin: 0, padding: '0 0 20px', color: BODY }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      {/* TESTIMONIAL GRID #2 */}
      <section style={{ padding: '76px 24px', background: BG_ALT, borderTop: `1px solid ${LINE}`, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '28%', right: '5%', width: 420, height: 300, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.16) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(24px, 3.4vw, 32px)', lineHeight: 1.2, margin: '0 0 36px', color: INK, textAlign: 'center' }}>
            Proof it changes the numbers, not just the pitch
          </h2>
          <div className="wty-grid">
            {grid2.map((t, i) => (
              <figure key={i} className="wty-testimonial wty-glass" style={{ borderRadius: 16, padding: 26, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <blockquote style={{ fontSize: 16, lineHeight: 1.6, margin: 0, color: BODY }}>{t.quote}</blockquote>
                <figcaption style={{ fontSize: 14, color: MUTED, marginTop: 'auto' }}>
                  <span style={{ ...HEADING, color: EYEBROW, fontSize: 14 }}>{t.name}</span>
                  {t.detail && <span>, {t.detail}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BAND — kept dark, full-width */}
      <div style={{ background: DARK, position: 'relative', overflow: 'hidden' }}>
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '84px 24px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -160, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse at center, rgba(59,111,240,0.32) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <h2 style={{ ...HEADING, fontSize: 'clamp(26px, 3.8vw, 34px)', lineHeight: 1.25, maxWidth: 560, margin: 0, color: D_INK, position: 'relative' }}>
            Run it on the account that's gone quiet.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: 0, color: D_BODY, position: 'relative' }}>
            Fourteen days free on Whyzer Elite. $57/month for your first three months with code FLUENCY57 after that.
          </p>
          <a
            href="#pricing"
            className="wty-cta"
            style={{ marginTop: 4, background: ACCENT, color: '#FFFFFF', fontWeight: 700, fontSize: 17, padding: '17px 36px', borderRadius: 10, textDecoration: 'none', display: 'inline-block', boxShadow: '0 10px 30px -8px rgba(59,111,240,0.7)', position: 'relative' }}
          >
            Start My Free Trial &rarr;
          </a>
        </section>
      </div>

      <style>{`
        @keyframes wty-fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wty-glowPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
        .wty-cta { transition: box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease; }
        .wty-cta:hover { background: #2F5FD8; box-shadow: 0 12px 34px -6px rgba(59,111,240,0.85); transform: translateY(-1px); }
        /* Glass surfaces: translucent fill + backdrop blur, with a bright top
           edge so the panel reads as a lit sheet rather than a flat tint. */
        .wty-glass {
          position: relative;
          background: ${GLASS_LIGHT};
          border: 1px solid ${GLASS_LIGHT_BORDER};
          box-shadow: ${GLASS_LIGHT_SHADOW};
          backdrop-filter: ${GLASS_BLUR};
          -webkit-backdrop-filter: ${GLASS_BLUR};
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .wty-glass::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 42%);
        }
        .wty-glass > * { position: relative; z-index: 1; }
        .wty-glass:hover { transform: translateY(-2px); box-shadow: 0 14px 40px -12px rgba(11,16,32,0.22); border-color: rgba(59,111,240,0.35); }
        /* The dark pricing box frosts against the section behind it. */
        .wty-price-box {
          backdrop-filter: ${GLASS_BLUR};
          -webkit-backdrop-filter: ${GLASS_BLUR};
        }
        /* Fallback: without backdrop-filter the translucent fill reads as washed
           out, so fall back to the solid card colours. */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .wty-glass { background: ${CARD_PRIMARY}; border-color: ${LINE}; }
        }
        .wty-testimonial { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .wty-faq-btn:focus-visible, .wty-cta:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }
        /* Mobile-first: single column, widening at the 768px breakpoint. */
        /* position:relative keeps grids above the decorative section blooms */
        .wty-grid, .wty-steps, .wty-features { display: grid; grid-template-columns: 1fr; gap: 18px; position: relative; }
        @media (min-width: 768px) {
          .wty-grid, .wty-steps { grid-template-columns: repeat(3, 1fr); }
          /* Five features in two columns; the last one spans so the row closes. */
          .wty-features { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .wty-features > :last-child { grid-column: 1 / -1; }
        }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
      `}</style>
    </div>
  );
};

export default WebinarThankYou;

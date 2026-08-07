import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
const HEADING: React.CSSProperties = { fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.035em' };

const testimonials = [
  {
    quote: '"I needed to show up to the executive call and define, crystal clear, what was going on with the board. It took me three minutes. Less than it takes me to write the prompt to other LLMs."',
    attribution: 'Danny H. — hit 65% of annual quota by March',
    italic: true,
  },
  {
    quote: '"What used to take a rep a year, I can do in two weeks."',
    attribution: 'Rob Sader',
    italic: true,
  },
  {
    quote: 'Tobia La Marca built a point of view in financial language for a €650M IT CapEx priority at Contentsquare. His team told him they\'d never seen anything like it.',
    attribution: 'Tobia La Marca — Contentsquare',
    italic: false,
  },
];

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
    body: 'Unlimited company research across 7,500+ global public and private companies. Unlimited Deal Maps, unlimited Executive POV Dossiers, unlimited Whyzer & Jamal podcast-style account briefings.',
  },
  {
    title: 'The Vault',
    body: "Jamal's complete enterprise selling methodology, built from $160M+ in closed SaaS deals. Includes the Pipeline Flywheel, the MDA Masterclass, the Executive Outreach Course, and Financial Fluency 101. Not just the tool. The thinking behind it.",
  },
  {
    title: 'Coach Jamal, your AI co-pilot',
    body: "24/7 access to an AI coach trained on 100+ hours of Jamal's coaching content. Ask it how to write a POV for cold outbound to a CFO, how to handle a stalled multi-thread, or how Jamal would run a high-stakes internal deal review, and get a structured answer immediately.",
  },
  {
    title: 'Whyzer Academy',
    body: 'Monthly live upskilling sessions led by Jamal, plus live deal reviews and MDA office hours where the methodology gets applied to real, current opportunities, including yours.',
  },
  {
    title: 'Global coverage',
    body: "The accounts your competitors can't research. HSBC, Revolut, Stripe, Monzo, and thousands of other private and international companies most tools simply don't cover.",
  },
];

// ── §7 Testimonial grid #1
const grid1 = [
  {
    quote: '"The EVP looked at the point of view and said, ‘How do you know this? That’s insider information.’"',
    name: 'Jesse M.',
    detail: 'enterprise seller inside a top-10 global financial company',
  },
  {
    quote: '"It’s built for our specific needs. Way better than agents like Perplexity or Claude for strategic selling."',
    name: 'Brian Tripp',
    detail: '',
  },
  {
    quote: '$5.75M closed. $11.5M more sitting in pipeline, built the same way, account by account.',
    name: 'Enterprise AE',
    detail: 'using the Whyzer method',
  },
];

// ── §10 Testimonial grid #2
const grid2 = [
  {
    quote: 'My own response rate on cold executive outreach went from 2% to 23% the year I stopped leading with product and started leading with the numbers.',
    name: 'Jamal Reimer',
    detail: 'founder, closed $160M+ as an individual seller',
  },
  {
    quote: '"What used to take a rep a year, I can do in two weeks."',
    name: 'Rob Sader',
    detail: '',
  },
  {
    quote: "A point of view built around a €650M IT CapEx priority got Tobia's team a meeting his usual outreach couldn't.",
    name: 'Tobia La Marca',
    detail: 'Contentsquare',
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
      {/* PROMO BAR */}
      <div style={{ background: ACCENT, color: '#FFFFFF', textAlign: 'center', padding: '11px 18px', position: 'relative', zIndex: 3 }}>
        <p style={{ margin: '0 auto', maxWidth: 900, fontSize: 14, lineHeight: 1.5, fontWeight: 600 }}>
          <span aria-hidden="true">&#128293;</span> LIMITED TIME &mdash; Whyzer Elite for $57/month for your first 3 months. Code <strong style={{ fontWeight: 800, letterSpacing: '0.02em' }}>FLUENCY57</strong> at trial checkout.
        </p>
      </div>

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
          <section style={{ padding: '16px 24px 72px', display: 'flex', justifyContent: 'center' }}>
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
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* PROOF BLOCK */}
        <section style={{ padding: '72px 24px', background: BG_ALT, display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${LINE}` }}>
          <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: BODY }}>
              I've watched this shift play out on hundreds of sellers now. Here's what it looked like on three of them.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="wty-testimonial" style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 14, padding: 28, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: `linear-gradient(180deg, ${ACCENT}, transparent)` }} />
                  <p style={{ fontSize: 18, lineHeight: 1.6, margin: '0 0 12px', fontStyle: t.italic ? 'italic' : 'normal', color: BODY }}>{t.quote}</p>
                  <div style={{ fontSize: 14, fontWeight: 700, color: EYEBROW, marginTop: t.italic ? 0 : 12 }}>{t.attribution}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 19, lineHeight: 1.7, margin: 0, fontWeight: 600, color: INK }}>
              None of them got there with a better subject line. They got there by reading the numbers before writing a word.
            </p>
          </div>
        </section>

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
        <section style={{ padding: '76px 24px', background: BG_ALT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(26px, 3.6vw, 34px)', lineHeight: 1.2, margin: '0 0 40px', color: INK, textAlign: 'center' }}>
            From stalled account to boardroom-ready in under two minutes.
          </h2>
          <div className="wty-steps">
            {howItWorks.map((s, i) => (
              <div key={s.step} style={{ background: CARD_PRIMARY, border: `1px solid ${LINE}`, borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ ...HEADING, fontSize: 13, letterSpacing: '0.12em', color: ACCENT, marginBottom: 12 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ ...HEADING, fontSize: 20, margin: '0 0 10px', color: INK }}>{s.step}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, color: BODY }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT'S INCLUDED IN WHYZER ELITE + PRICING */}
        <section style={{ padding: '76px 24px', background: BG }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(26px, 3.6vw, 34px)', lineHeight: 1.2, margin: '0 0 36px', color: INK, textAlign: 'center' }}>
            Everything in Whyzer Elite
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, margin: '0 auto 44px' }}>
            {eliteFeatures.map((f) => (
              <div key={f.title} style={{ background: CARD_PRIMARY, border: `1px solid ${LINE}`, borderRadius: 14, padding: '22px 24px' }}>
                <h3 style={{ ...HEADING, fontSize: 17, margin: '0 0 8px', color: INK }}>{f.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, color: BODY }}>{f.body}</p>
              </div>
            ))}
          </div>

          {/* Pricing box — kept dark so the conversion moment stands out of the
              light section, the same role the form card plays on the reg page. */}
          <div style={{ maxWidth: 460, margin: '0 auto', background: DARK2, border: `1px solid rgba(59,111,240,0.45)`, borderRadius: 20, padding: '32px 26px', textAlign: 'center', boxShadow: '0 24px 60px -28px rgba(11,16,32,0.55)' }}>
            <h3 style={{ ...HEADING, fontSize: 22, margin: '0 0 14px', color: D_INK }}>Whyzer Elite</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 19, color: D_MUTED, textDecoration: 'line-through' }}>$97/month</span>
              <span style={{ ...HEADING, fontSize: 'clamp(24px, 5vw, 30px)', color: D_INK }}>$57/month</span>
            </div>
            <p style={{ ...HEADING, fontSize: 15, margin: '0 0 12px', color: D_INK }}>for your first 3 months</p>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 18px', color: D_BODY }}>
              with code <strong style={{ ...HEADING, color: D_EYEBROW, fontSize: 15 }}>FLUENCY57</strong>
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 18px', color: D_BODY }}>
              14 days free on your three hardest accounts. Start with the one that's gone quiet.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: '0 0 22px', color: D_MUTED }}>
              After your free trial: $57/month for 3 months, then $97/month. Cancel any time before your trial ends and you won't be charged.
            </p>
            <a href={trialUrl} className="wty-cta" style={{ display: 'block', width: '100%', boxSizing: 'border-box', background: ACCENT, color: '#FFFFFF', fontWeight: 700, fontSize: 16, padding: '16px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 10px 30px -8px rgba(59,111,240,0.7)' }}>
              Start My Free Trial &rarr;
            </a>
          </div>
        </section>

        {/* TESTIMONIAL GRID #1 */}
        <section style={{ padding: '76px 24px', background: BG_ALT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(24px, 3.4vw, 32px)', lineHeight: 1.2, margin: '0 0 36px', color: INK, textAlign: 'center' }}>
            More revenue, not just more replies
          </h2>
          <div className="wty-grid">
            {grid1.map((t, i) => (
              <figure key={i} className="wty-testimonial" style={{ background: CARD_PRIMARY, border: `1px solid ${LINE}`, borderRadius: 16, padding: 26, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <blockquote style={{ fontSize: 16, lineHeight: 1.6, margin: 0, color: BODY }}>{t.quote}</blockquote>
                <figcaption style={{ fontSize: 14, color: MUTED, marginTop: 'auto' }}>
                  <span style={{ ...HEADING, color: EYEBROW, fontSize: 14 }}>{t.name}</span>
                  {t.detail && <span>, {t.detail}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* TRIAL TERMS BAND — cancellation window, not a refund guarantee */}
        <section style={{ padding: '64px 24px', background: ACCENT_TINT, borderBottom: `1px solid ${LINE}` }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ ...HEADING, fontSize: 'clamp(22px, 3.2vw, 28px)', lineHeight: 1.28, margin: '0 0 16px', color: INK }}>
              Try it on the account that's gone quiet. See if it changes how you'd walk into the room.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0, color: BODY }}>
              Fourteen days free, full Elite access, no restrictions on which three accounts you pick. If it's not for you, cancel before the trial ends and you're never charged.
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
        <section style={{ padding: '76px 24px', background: BG_ALT, borderTop: `1px solid ${LINE}` }}>
          <h2 style={{ ...HEADING, fontSize: 'clamp(24px, 3.4vw, 32px)', lineHeight: 1.2, margin: '0 0 36px', color: INK, textAlign: 'center' }}>
            Proof it changes the numbers, not just the pitch
          </h2>
          <div className="wty-grid">
            {grid2.map((t, i) => (
              <figure key={i} className="wty-testimonial" style={{ background: CARD_PRIMARY, border: `1px solid ${LINE}`, borderRadius: 16, padding: 26, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <blockquote style={{ fontSize: 16, lineHeight: 1.6, margin: 0, color: BODY }}>{t.quote}</blockquote>
                <figcaption style={{ fontSize: 14, color: MUTED, marginTop: 'auto' }}>
                  <span style={{ ...HEADING, color: EYEBROW, fontSize: 14 }}>{t.name}</span>
                  {t.detail && <span>, {t.detail}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

      </div>

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
            href={trialUrl}
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
        .wty-testimonial { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .wty-testimonial:hover { border-color: rgba(59,111,240,0.45); box-shadow: 0 10px 30px -14px rgba(11,16,32,0.22); }
        .wty-faq-btn:focus-visible, .wty-cta:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }
        /* Mobile-first: single column, widening at the 768px breakpoint. */
        .wty-grid, .wty-steps { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 768px) {
          .wty-grid, .wty-steps { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default WebinarThankYou;

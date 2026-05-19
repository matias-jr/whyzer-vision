import { FileText, FileSearch, Users } from 'lucide-react';
import ColdEmailTestimonials from './ColdEmailTestimonials';

type Direction = 'd1' | 'd2';
type Offer = 'a' | 'b';

interface Props {
  direction: Direction;
  offer: Offer;
}

const WORDMARK_SRC =
  'https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png';

const TRIAL_URL_BASE = 'https://app.whyzer.ai';

const FOUNDER_COPY =
  "I built Whyzer because I watched the gap between elite sellers and the rest of the field open up overnight. The hardest part of selling to executives is no longer the conversation. It's earning the seat at the table. This is the tool I wish I'd had on every one of those $50M deals.";

function PulseMotif({ dark }: { dark: boolean }) {
  const stroke = dark ? '#a899ff' : '#5b3df5';
  return (
    <svg width="64" height="34" viewBox="0 0 58 32" fill="none" aria-hidden="true">
      <path
        d="M2 16 H14 L18 6 L24 26 L30 10 L34 22 L40 16 H56"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="56" cy="16" r="3.6" fill={stroke} />
    </svg>
  );
}

function Wordmark({ dark }: { dark: boolean }) {
  return (
    <img
      src={WORDMARK_SRC}
      alt="Whyzer"
      className="h-7"
      style={
        dark
          ? undefined
          : { filter: 'invert(1) hue-rotate(180deg)' }
      }
    />
  );
}

export default function ColdEmailLP({ direction, offer }: Props) {
  const isDark = direction === 'd2';
  const isOfferA = offer === 'a';

  const ctaHref = `${TRIAL_URL_BASE}?source=cold_email&offer=${offer}`;

  const palette = isDark
    ? {
        page: '#0f0e15',
        pageAlt: '#0a0814',
        section: '#15121f',
        text: '#e7e3ff',
        text2: '#bbb1e8',
        text3: '#7a72a8',
        text4: '#5d5680',
        border: '#2a2740',
        border2: '#3a3157',
        accent: '#a899ff',
        accentInk: '#0f0e15',
        ink: '#e7e3ff',
        cardBg: '#15121f',
        cardFeatured: '#1a1532',
        ctaShadow: '0 6px 0 rgba(168,153,255,0.25)',
        featuredShadow: '6px 6px 0 rgba(91,61,245,0.22)',
        pillBg: '#0f0e15',
        pillBorder: '#3a3157',
        pillText: '#a899ff',
        featuredPillBg: 'rgba(168,153,255,0.12)',
        featuredPillBorder: '#5b3df5',
        featuredPillText: '#cdc1ff',
        badgeBg: 'rgba(168,153,255,0.1)',
        badgeBorder: 'rgba(168,153,255,0.4)',
        badgeText: '#cdc1ff',
        glyphBg: '#0f0e15',
        glyphBorder: '#3a3157',
        glyphFg: '#a899ff',
        featuredGlyphBg: 'rgba(168,153,255,0.1)',
        featuredGlyphBorder: '#5b3df5',
        featuredGlyphFg: '#a899ff',
        featuredBorder: '#5b3df5',
        cutoutBg:
          'repeating-linear-gradient(135deg,#2a2740 0 6px,#1f1d33 6px 12px)',
        cutoutBorder: '#3a3157',
        cutoutText: '#7a72a8',
        bubbleBg: '#1a1726',
        bubbleBorder: '#5b3df5',
        bubbleText: '#e7e3ff',
        finalTopBorder: '#5b3df5',
      }
    : {
        page: '#fdfcf8',
        pageAlt: '#efece4',
        section: '#ffffff',
        text: '#1c1b1a',
        text2: '#3a3936',
        text3: '#6a6864',
        text4: '#9c9a93',
        border: '#d6d3c7',
        border2: '#bcb9ae',
        accent: '#5b3df5',
        accentInk: '#ffffff',
        ink: '#1c1b1a',
        cardBg: '#ffffff',
        cardFeatured: '#f6f4ee',
        ctaShadow:
          '0 6px 0 rgba(91,61,245,0.25), 0 0 0 1px rgba(0,0,0,0.06)',
        featuredShadow: '6px 6px 0 rgba(91,61,245,0.12)',
        pillBg: '#efece4',
        pillBorder: '#bcb9ae',
        pillText: '#3a3936',
        featuredPillBg: 'rgba(91,61,245,0.08)',
        featuredPillBorder: 'rgba(91,61,245,0.25)',
        featuredPillText: '#2c1c8a',
        badgeBg: 'rgba(91,61,245,0.08)',
        badgeBorder: 'rgba(91,61,245,0.35)',
        badgeText: '#2c1c8a',
        glyphBg: '#efece4',
        glyphBorder: '#bcb9ae',
        glyphFg: '#1c1b1a',
        featuredGlyphBg: 'rgba(91,61,245,0.08)',
        featuredGlyphBorder: 'rgba(91,61,245,0.35)',
        featuredGlyphFg: '#5b3df5',
        featuredBorder: '#5b3df5',
        cutoutBg:
          'repeating-linear-gradient(135deg,#e7e3da 0 6px,#dcd7cc 6px 12px)',
        cutoutBorder: '#1c1b1a',
        cutoutText: '#6a6864',
        bubbleBg: '#ffffff',
        bubbleBorder: '#1c1b1a',
        bubbleText: '#1c1b1a',
        finalTopBorder: '#1c1b1a',
      };

  const heroHeadline = isOfferA ? (
    <>
      The financial argument{' '}
      <span style={{ color: palette.accent }}>their own team didn't bring.</span>
    </>
  ) : (
    <>
      Know their numbers{' '}
      <span style={{ color: palette.accent }}>better than their own team.</span>
      <br />
      Before you walk in.
    </>
  );

  const heroTrust = isOfferA
    ? 'Full access for 14 days. One account. No credit card. Plus 2 bonuses on the house.'
    : 'Full access for 14 days. One account. No credit card. Plus a personal teardown and a live workshop.';

  const bonusIntro = isOfferA
    ? 'A masterclass on speaking the language of executives, and a live workshop where we build your meeting together.'
    : "A personal teardown of a deal that didn't close, and a live workshop where we build your next meeting together.";

  const founderBubble = isOfferA
    ? 'What would Jamal show you first?'
    : 'Send me your stalled deal.';

  const finalSub = isOfferA
    ? 'Full access to Whyzer for 14 days. Financial Fluency 101 and a seat in the next live workshop, on the house.'
    : 'Full access to Whyzer for 14 days. A personal teardown from Jamal and a seat in the next live workshop, on the house.';

  // Featured bonus content
  const featuredBonus = isOfferA
    ? {
        eye: 'The language',
        title: 'Financial Fluency 101',
        body: 'The insider language of executives. Recorded masterclass. The exact vocabulary that gets a CFO to lean forward in a first meeting.',
        pill: 'On-demand · 70 min',
        Icon: FileText,
      }
    : {
        eye: 'The teardown',
        title: 'Teardown of a deal that stalled',
        body: 'Send the deck, the POV, or the LinkedIn outreach from a deal that went quiet. Jamal records a teardown showing what to change. You keep the recording.',
        pill: '1:1 · Recorded · ~25 min',
        Icon: FileSearch,
      };

  const fontStack = {
    display: "'Fraunces', 'Oswald', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    script: "'Caveat', cursive",
  };

  // ----- shared bits -----
  const Badge = (
    <div
      style={{
        fontFamily: fontStack.mono,
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: palette.badgeText,
        background: palette.badgeBg,
        border: `1px solid ${palette.badgeBorder}`,
        padding: '6px 12px',
        borderRadius: 999,
        fontWeight: 600,
        display: 'inline-block',
      }}
    >
      FREE 14-DAY TRIAL · ONE ACCOUNT
    </div>
  );

  const eyebrowStyle: React.CSSProperties = {
    fontFamily: fontStack.mono,
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: palette.text3,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  };

  const sectionH2: React.CSSProperties = {
    fontFamily: fontStack.display,
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: '-0.015em',
    lineHeight: 1.1,
    margin: '0 0 8px',
    color: palette.text,
    textWrap: 'balance' as React.CSSProperties['textWrap'],
  };

  const BonusCard = ({
    featured,
    num,
    Icon,
    eye,
    title,
    body,
    pill,
  }: {
    featured?: boolean;
    num: string;
    Icon: typeof FileText;
    eye: string;
    title: string;
    body: string;
    pill: string;
  }) => (
    <div
      style={{
        position: 'relative',
        border: `1.5px solid ${featured ? palette.featuredBorder : palette.ink}`,
        background: featured ? palette.cardFeatured : palette.cardBg,
        borderRadius: 6,
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: featured ? palette.featuredShadow : 'none',
        minWidth: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -14,
          left: 18,
          background: featured ? palette.accent : palette.ink,
          color: featured
            ? isDark
              ? '#fff'
              : '#fff'
            : isDark
            ? '#0f0e15'
            : '#fff',
          fontFamily: fontStack.mono,
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '5px 10px',
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        {num}
      </span>
      <div
        style={{
          width: 42,
          height: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: featured ? palette.featuredGlyphBg : palette.glyphBg,
          border: `1px solid ${
            featured ? palette.featuredGlyphBorder : palette.glyphBorder
          }`,
          borderRadius: '50%',
          color: featured ? palette.featuredGlyphFg : palette.glyphFg,
          flexShrink: 0,
        }}
      >
        <Icon size={22} strokeWidth={1.6} />
      </div>
      <div
        style={{
          fontFamily: fontStack.mono,
          fontSize: 9.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: palette.text3,
          marginTop: 4,
        }}
      >
        {eye}
      </div>
      <h3
        style={{
          fontFamily: fontStack.display,
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: '-0.01em',
          margin: 0,
          lineHeight: 1.1,
          color: palette.text,
          textWrap: 'balance' as React.CSSProperties['textWrap'],
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: fontStack.body,
          fontSize: 13.5,
          lineHeight: 1.55,
          color: palette.text2,
          margin: 0,
        }}
      >
        {body}
      </p>
      <span
        style={{
          alignSelf: 'flex-start',
          marginTop: 'auto',
          fontFamily: fontStack.mono,
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: featured ? palette.featuredPillBg : palette.pillBg,
          color: featured ? palette.featuredPillText : palette.pillText,
          padding: '5px 10px',
          borderRadius: 3,
          border: `1px solid ${
            featured ? palette.featuredPillBorder : palette.pillBorder
          }`,
        }}
      >
        {pill}
      </span>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: palette.page,
        color: palette.text,
        fontFamily: fontStack.body,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,700;9..144,800;9..144,900&display=swap');
        @keyframes lp-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(52,196,106,0.18); }
          50% { box-shadow: 0 0 0 6px rgba(52,196,106,0.05); }
        }
        .lp-dot-live {
          width: 8px; height: 8px; border-radius: 50%;
          background: #34c46a; animation: lp-pulse 1.6s infinite;
          display: inline-block;
        }
        .lp-eyebrow::before {
          content: ''; display: inline-block; width: 24px; height: 1.5px;
          background: currentColor; opacity: 0.7;
        }
        .lp-cta-anchor { transition: filter 0.15s; }
        .lp-cta-anchor:hover { filter: brightness(1.05); }
        .lp-cta-anchor:focus-visible { outline: 2px solid ${palette.accent}; outline-offset: 3px; }
        .lp-cta-label-mobile { display: none; }
        .lp-cta-label-desktop { display: inline; }
        @media (max-width: 720px) {
          .lp-hero { padding: 40px 20px 44px !important; }
          .lp-h1 { font-size: 38px !important; }
          .lp-section { padding: 36px 20px !important; }
          .lp-final { padding: 48px 20px 56px !important; }
          .lp-final-h2 { font-size: 30px !important; }
          .lp-bonus-grid { grid-template-columns: 1fr !important; }
          .lp-founder-grid { grid-template-columns: 1fr !important; }
          .lp-founder-cutout { width: 140px !important; height: 170px !important; margin: 0 auto; }
          .lp-cta-anchor { width: 100%; min-height: 48px; }
          .lp-cta-label-desktop { display: none !important; }
          .lp-cta-label-mobile { display: inline !important; }
          .lp-header { padding: 14px 20px !important; }
        }
      `}</style>

      {/* Header */}
      <header
        className="lp-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 28px',
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <Wordmark dark={isDark} />
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: 10,
            color: isDark ? palette.text4 : palette.text4,
            letterSpacing: '0.12em',
          }}
        >
          PRIVACY · HELP
        </div>
      </header>

      {/* Hero */}
      <section
        className="lp-hero"
        style={{
          textAlign: 'center',
          padding: '54px 128px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {Badge}
        <div style={{ margin: '6px 0 2px' }}>
          <PulseMotif dark={isDark} />
        </div>
        <h1
          className="lp-h1"
          style={{
            fontFamily: fontStack.display,
            fontWeight: 900,
            fontSize: 54,
            letterSpacing: '-0.022em',
            lineHeight: 0.96,
            margin: 0,
            color: palette.text,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
            maxWidth: isDark ? '22ch' : '20ch',
          }}
        >
          {heroHeadline}
        </h1>
        <p
          style={{
            fontFamily: fontStack.body,
            fontWeight: 400,
            color: palette.text2,
            fontSize: 15,
            lineHeight: 1.55,
            maxWidth: 560,
            margin: 0,
            textWrap: 'pretty' as React.CSSProperties['textWrap'],
          }}
        >
          Turn earnings calls, 10-Ks and private company intel into the financial argument that gets executives to lean forward.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: 520,
            textAlign: 'center',
            fontFamily: fontStack.body,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: palette.text3,
            textWrap: 'pretty' as React.CSSProperties['textWrap'],
          }}
        >
          <span
            className="lp-dot-live"
            style={{ marginRight: 8, verticalAlign: 'middle' }}
          />
          Built by a{' '}
          <b style={{ color: palette.text, fontWeight: 700 }}>$160M Oracle seller</b>
          . Trusted by{' '}
          <b style={{ color: palette.text, fontWeight: 700 }}>
            2,000+ enterprise reps
          </b>
          .
        </p>
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            maxWidth: 480,
          }}
        >
          <a className="lp-cta-anchor" href={ctaHref} style={ctaStyle(palette)}>
            <span className="lp-cta-label-desktop">Build your first financially-backed POV →</span>
            <span className="lp-cta-label-mobile">Build your first POV →</span>
          </a>
          <div
            style={{
              fontFamily: fontStack.body,
              fontSize: 11.5,
              color: palette.text3,
              letterSpacing: '0.02em',
            }}
          >
            {heroTrust}
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section
        className="lp-section"
        style={{
          padding: '48px 128px',
          borderTop: `1px solid ${palette.border}`,
        }}
      >
        <div style={eyebrowStyle} className="lp-eyebrow">
          Supercharge your free trial
        </div>
        <h2 style={sectionH2}>Full access to Whyzer World included.</h2>
        <p
          style={{
            fontFamily: fontStack.body,
            fontSize: 15,
            lineHeight: 1.55,
            color: palette.text2,
            maxWidth: '60ch',
            margin: '8px 0 0',
            textWrap: 'pretty' as React.CSSProperties['textWrap'],
          }}
        >
          {bonusIntro}
        </p>
        <div
          className="lp-bonus-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
            gap: 22,
            marginTop: 28,
          }}
        >
          <BonusCard featured num="Bonus 01" {...featuredBonus} />
          <BonusCard
            num="Bonus 02"
            Icon={Users}
            eye="The meeting"
            title="Live workshop with Jamal"
            body="Bring your account. We build your senior-executive meeting together: the POV, the opening, the questions."
            pill="Weekly · Small group"
          />
        </div>
      </section>

      {/* Testimonials */}
      <ColdEmailTestimonials
        palette={palette}
        fontStack={fontStack}
        isDark={isDark}
        eyebrowStyle={eyebrowStyle}
        sectionH2={sectionH2}
      />

      {/* Founder */}
      <section
        className="lp-section"
        style={{
          padding: '48px 128px',
          borderTop: `1px solid ${palette.border}`,
        }}
      >
        <div style={eyebrowStyle} className="lp-eyebrow">
          Who's behind this
        </div>
        <div
          className="lp-founder-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: 32,
            alignItems: 'center',
            border: `1.5px solid ${palette.ink}`,
            background: isDark ? palette.section : '#f6f4ee',
            borderRadius: 6,
            padding: 28,
            position: 'relative',
          }}
        >
          <img
            className="lp-founder-cutout"
            src="/jr_headshot.webp"
            alt="Jamal Reimer"
            style={{
              width: 172,
              height: 212,
              borderRadius: 6,
              objectFit: 'cover',
              border: `1.5px solid ${palette.cutoutBorder}`,
              background: palette.cutoutBg,
              display: 'block',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p
              style={{
                fontFamily: fontStack.display,
                fontWeight: 500,
                fontSize: 17,
                lineHeight: 1.5,
                margin: 0,
                color: palette.text,
                textWrap: 'pretty' as React.CSSProperties['textWrap'],
              }}
            >
              {FOUNDER_COPY}
            </p>
            <div
              style={{
                fontFamily: fontStack.script,
                fontWeight: 700,
                fontSize: 34,
                color: palette.text,
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              Jamal Reimer
            </div>
            <div
              style={{
                fontFamily: fontStack.mono,
                fontSize: 10.5,
                color: palette.text3,
                letterSpacing: '0.08em',
                lineHeight: 1.5,
              }}
            >
              <b style={{ color: palette.text, fontWeight: 700 }}>
                Jamal Reimer
              </b>{' '}
              · Founder, Whyzer
              <br />
              Author, <i>Mega Deal Secrets</i>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 24,
              top: -16,
              background: palette.bubbleBg,
              border: `1.5px solid ${palette.bubbleBorder}`,
              borderRadius: 14,
              padding: '8px 14px',
              fontFamily: fontStack.script,
              fontSize: 18,
              lineHeight: 1,
              transform: 'rotate(2deg)',
              color: palette.bubbleText,
            }}
          >
            {founderBubble}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="lp-final"
        style={{
          padding: '64px 128px 72px',
          textAlign: 'center',
          background: palette.pageAlt,
          borderTop: `1.5px solid ${palette.finalTopBorder}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{ ...eyebrowStyle, justifyContent: 'center', marginBottom: 8 }}
          className="lp-eyebrow"
        >
          Start your trial
        </div>
        <h2
          className="lp-final-h2"
          style={{
            fontFamily: fontStack.display,
            fontWeight: 900,
            fontSize: 42,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
            color: palette.text,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
            maxWidth: '14ch',
          }}
        >
          14 days. <span style={{ color: palette.accent }}>One account.</span>
          <br />
          Plus two bonuses.
        </h2>
        <p
          style={{
            fontFamily: fontStack.body,
            fontSize: 15,
            lineHeight: 1.55,
            color: palette.text2,
            maxWidth: '48ch',
            margin: 0,
          }}
        >
          {finalSub}
        </p>
        <div
          style={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            maxWidth: 480,
          }}
        >
          <a className="lp-cta-anchor" href={ctaHref} style={ctaStyle(palette)}>
            <span className="lp-cta-label-desktop">Build your first financially-backed POV →</span>
            <span className="lp-cta-label-mobile">Build your first POV →</span>
          </a>
          <div
            style={{
              fontFamily: fontStack.body,
              fontSize: 11.5,
              color: palette.text3,
              letterSpacing: '0.02em',
            }}
          >
            One account. 14 days. No credit card.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '18px 0 24px',
          fontFamily: fontStack.body,
          fontSize: 11.5,
          color: palette.text4,
          borderTop: `1px solid ${palette.border}`,
        }}
      >
        Privacy and Terms · Help · Whyzer 2026
      </footer>
    </div>
  );
}

function ctaStyle(palette: {
  accent: string;
  accentInk: string;
  ctaShadow: string;
}): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: palette.accent,
    color: palette.accentInk,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    padding: '18px 36px',
    borderRadius: 8,
    fontSize: 15,
    boxShadow: palette.ctaShadow,
    whiteSpace: 'nowrap',
  };
}

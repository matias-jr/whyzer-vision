import React from 'react';

// Duplicated from src/components/whyzer/Testimonials.tsx so the cold-email
// pages can theme freely without touching the live site testimonial section.
const testimonials = [
  { quote: "It's built for our specific needs. Way better than agents like Perplexity or Claude for strategic selling.", name: 'Brian Tripp' },
  { quote: "Compared to tools like HockeyStack, Whyzer makes detailed info from 10Ks, 10Qs, and earnings reports actually usable for salespeople.", name: 'Lee Winer' },
  { quote: "Whyzer flagged a cybersecurity breach that helped me book a CISO meeting on my first try using Jamal's technique — it worked immediately.", name: 'Paul Hammond' },
  { quote: 'Feels like a business analyst is watching your back… all the context is laid out.', name: 'Matt Brown' },
  { quote: 'Even though I try to stay on top of my ICP accounts, Whyzer consistently surfaces insights that make me think, "How come I didn\'t know that?"', name: 'Jeff Clarke' },
  { quote: 'I played around with Whyzer yesterday… I was blown away. The podcast gave me a really good idea on how to structure not just the deal, but the talk prep.', name: 'Mo' },
  { quote: "Amazing prompts. First tool I've found that resonates with the way I dig into clients.", name: 'Bill Neal' },
  { quote: 'I love the earnings call summaries and use chat constantly.', name: 'Michael Corvo' },
  { quote: "What used to take a rep a year, I can do in two weeks with Whyzer. It helps us work on the right accounts.", name: 'David Inukpuk' },
];

const HERO = {
  quote: "Awesome product. It's like OpenAI and Perplexity's deep research had a baby who gives a shit about enterprise selling.",
  name: 'Kyle G.',
};

type Palette = {
  text: string;
  text2: string;
  text3: string;
  border: string;
  border2: string;
  accent: string;
  cardBg: string;
  pageAlt: string;
};

type FontStack = {
  display: string;
  body: string;
  mono: string;
};

type Props = {
  palette: Palette;
  fontStack: FontStack;
  isDark: boolean;
  eyebrowStyle: React.CSSProperties;
  sectionH2: React.CSSProperties;
};

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const Card: React.FC<{
  quote: string;
  name: string;
  palette: Palette;
  fontStack: FontStack;
  isDark: boolean;
}> = ({ quote, name, palette, fontStack, isDark }) => (
  <div
    style={{
      background: palette.cardBg,
      border: `1px solid ${palette.border}`,
      borderRadius: 10,
      padding: '24px 24px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      position: 'relative',
      height: 240,
      boxSizing: 'border-box',
    }}
  >
    <span
      aria-hidden
      style={{
        position: 'absolute',
        top: 10,
        left: 16,
        fontFamily: fontStack.display,
        fontSize: 56,
        lineHeight: 1,
        color: palette.accent,
        opacity: isDark ? 0.35 : 0.25,
      }}
    >
      "
    </span>
    <p
      style={{
        margin: 0,
        marginTop: 18,
        fontFamily: fontStack.body,
        fontSize: 14,
        lineHeight: 1.55,
        color: palette.text,
        textWrap: 'pretty' as React.CSSProperties['textWrap'],
        flex: 1,
        overflow: 'hidden',
      }}
    >
      {quote}
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fontStack.mono,
          fontWeight: 700,
          fontSize: 13,
          background: hexToRgba(palette.accent, isDark ? 0.18 : 0.12),
          color: palette.accent,
          flexShrink: 0,
        }}
      >
        {name.charAt(0)}
      </div>
      <span
        style={{
          fontFamily: fontStack.mono,
          fontSize: 12,
          letterSpacing: '0.04em',
          color: palette.text2,
          fontWeight: 600,
        }}
      >
        {name}
      </span>
    </div>
  </div>
);

const ColdEmailTestimonials: React.FC<Props> = ({
  palette,
  fontStack,
  isDark,
  eyebrowStyle,
  sectionH2,
}) => {
  return (
    <section
      className="lp-testimonials"
      style={{
        padding: '48px 0',
        borderTop: `1px solid ${palette.border}`,
        background: palette.pageAlt,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes lp-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .lp-marquee-track {
          display: flex;
          gap: 18px;
          width: max-content;
          animation: lp-marquee 60s linear infinite;
        }
        .lp-marquee-wrap:hover .lp-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp-marquee-track { animation: none; }
        }
        @media (max-width: 720px) {
          .lp-testimonials-header { padding: 0 20px !important; }
          .lp-testimonials-hero-wrap { padding: 0 20px !important; }
        }
      `}</style>
      <div style={{ padding: '0 128px' }} className="lp-testimonials-header">
        <div style={eyebrowStyle} className="lp-eyebrow">
          What sellers say
        </div>
        <h2 style={sectionH2}>Don't take our word for it.</h2>
      </div>

      {/* Hero quote */}
      <div style={{ padding: '0 128px' }} className="lp-testimonials-hero-wrap">
      <div
        style={{
          marginTop: 24,
          padding: '32px 36px',
          borderRadius: 12,
          background: palette.cardBg,
          border: `1.5px solid ${palette.accent}`,
          boxShadow: isDark
            ? `0 6px 0 ${hexToRgba(palette.accent, 0.22)}`
            : `6px 6px 0 ${hexToRgba(palette.accent, 0.14)}`,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: fontStack.display,
            fontWeight: 500,
            fontSize: 22,
            lineHeight: 1.45,
            color: palette.text,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          "{HERO.quote}"
        </p>
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <div
            aria-hidden
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontStack.mono,
              fontWeight: 700,
              fontSize: 13,
              background: hexToRgba(palette.accent, isDark ? 0.2 : 0.14),
              color: palette.accent,
            }}
          >
            {HERO.name.charAt(0)}
          </div>
          <span
            style={{
              fontFamily: fontStack.mono,
              fontSize: 12,
              letterSpacing: '0.04em',
              color: palette.text2,
              fontWeight: 600,
            }}
          >
            {HERO.name}
          </span>
        </div>
      </div>
      </div>

      {/* Marquee */}
      <div
        className="lp-marquee-wrap"
        style={{
          marginTop: 32,
          overflow: 'hidden',
          maskImage:
            'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
        }}
      >
        <div className="lp-marquee-track">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              style={{
                width: 360,
                flexShrink: 0,
              }}
            >
              <Card
                quote={t.quote}
                name={t.name}
                palette={palette}
                fontStack={fontStack}
                isDark={isDark}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColdEmailTestimonials;

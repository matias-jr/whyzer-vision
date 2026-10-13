import React from 'react';

// Duplicated from src/components/whyzer/Testimonials.tsx so the cold-email
// pages can theme freely without touching other testimonial sections.
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

const Avatar = ({ name, dark }: { name: string; dark?: boolean }) => (
  <div
    aria-hidden
    style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 13,
      background: dark ? 'rgba(98,98,233,.3)' : '#EEEEFC',
      color: dark ? '#C9C6FF' : '#4a4ad1',
    }}
  >
    {name.charAt(0)}
  </div>
);

const ColdEmailTestimonials: React.FC = () => (
  <section className="wzf-sec wzf-sec--tint" style={{ overflow: 'hidden' }}>
    <div className="wzf-wrap" style={{ textAlign: 'center' }}>
      <div className="wzf-eyebrow">What sellers say</div>
      <h2 className="wzf-h2" style={{ marginBottom: 32 }}>Don't take our word for it.</h2>
      <div className="wzf-glass wzf-dark" style={{ padding: '34px 32px', marginBottom: 36 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(19px, 2.4vw, 25px)', lineHeight: 1.4, fontWeight: 500, color: '#fff', textWrap: 'balance' }}>
          “{HERO.quote}”
        </p>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Avatar name={HERO.name} dark />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#DADAF2' }}>{HERO.name}</span>
        </div>
      </div>
    </div>
    <div className="wzf-marquee" aria-label="More seller testimonials">
      <div className="wzf-marquee-track">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            className="wzf-card"
            aria-hidden={i >= testimonials.length ? true : undefined}
            style={{ width: 320, height: 220, display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}
          >
            <p style={{ flex: 1, overflow: 'hidden', fontSize: 14.5, lineHeight: 1.6, color: '#14141F', textWrap: 'pretty' }}>“{t.quote}”</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={t.name} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ColdEmailTestimonials;

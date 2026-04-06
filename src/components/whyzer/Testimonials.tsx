import { useState, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const testimonials = [
  { quote: "It's built for our specific needs. Way better than agents like Perplexity or Claude for strategic selling.", name: 'Brian Tripp' },
  { quote: "Compared to tools like HockeyStack, Whyzer makes detailed info from 10Ks, 10Qs, and earnings reports actually usable for salespeople.", name: 'Lee Winer' },
  { quote: "Whyzer flagged a cybersecurity breach that helped me book a CISO meeting on my first try using Jamal's technique — it worked immediately.", name: 'Paul Hammond' },
  { quote: 'Feels like a business analyst is watching your back… all the context is laid out.', name: 'Matt Brown' },
  { quote: 'Even though I try to stay on top of my ICP accounts, Whyzer consistently surfaces insights that make me think, "How come I didn\'t know that?"', name: 'Jeff Clarke' },
  { quote: 'I played around with Whyzer yesterday… I was blown away. The podcast gave me a really good idea on how to structure not just the deal, but the talk prep.', name: 'Mo' },
  { quote: "Amazing prompts. First tool I've found that resonates with the way I dig into clients.", name: 'Bill Neal' },
  { quote: 'I feel like I have to really up my AI game.', name: 'Chris Carlton' },
  { quote: "I need to be top of my game when speaking to executives — with data, with metrics. That's really what motivated me to use Whyzer and join this conversation.", name: 'Kent' },
  { quote: 'I love the earnings call summaries and use chat constantly.', name: 'Michael Corvo' },
  { quote: 'Absolutely necessary and needed in our profession.', name: 'Rob Sader' },
  { quote: "What used to take a rep a year, I can do in two weeks with Whyzer. It helps us work on the right accounts.", name: 'David Inukpuk' },
];

const MarqueeCard = ({ quote, name }: { quote: string; name: string }) => (
  <div
    className="bg-card border border-foreground/[0.06] rounded-xl px-8 py-7 min-w-[320px] max-w-[320px] flex-shrink-0 relative"
  >
    <span className="text-primary/40 text-5xl font-display absolute top-4 left-6">"</span>
    <p className="text-foreground text-base leading-relaxed mt-6 mb-4">{quote}</p>
    <p className="text-text-secondary text-sm font-semibold">— {name}</p>
  </div>
);

const MobileCarousel = () => {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = (i: number) => {
    setActive(i);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement;
    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActive(closest);
  };

  return (
    <div className="md:hidden">
      {/* Scroll track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-6 pb-2"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 w-[calc(100vw-56px)] relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(20,14,40,0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(129,89,212,0.18)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(129,89,212,0.6), transparent)' }} />
            <div className="px-6 pt-8 pb-6">
              {/* Decorative quote */}
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="mb-4 opacity-40">
                <path d="M0 22V13.2C0 5.9 4.5 1.5 13.4 0l1.2 2.2C9.3 3.4 6.8 6 6.5 10H11V22H0zm17 0V13.2C17 5.9 21.5 1.5 30.4 0l1.2 2.2C26.3 3.4 23.8 6 23.5 10H28V22H17z" fill="#8159d4"/>
              </svg>
              <p className="text-foreground text-[15px] leading-[1.75] mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(129,89,212,0.25)', color: '#C4A8FF' }}
                >
                  {t.name.charAt(0)}
                </div>
                <span className="font-mono text-xs text-text-secondary tracking-wide">{t.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: active === i ? 20 : 6,
              height: 6,
              background: active === i ? '#8159d4' : 'rgba(255,255,255,0.18)',
            }}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const sectionRef = useScrollReveal();
  const row1 = testimonials.slice(0, 6);
  const row2 = testimonials.slice(6);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 overflow-hidden bg-background-secondary">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">What Elite Sellers Say</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-[-0.02em] uppercase">
          Don't take our word for it.
        </h2>
      </div>

      {/* Kyle G. hero testimonial */}
      <div className="max-w-[700px] mx-auto px-6 lg:px-12 mb-12">
        <div
          className="rounded-2xl px-8 py-8 text-center relative"
          style={{
            background: 'rgba(20,14,40,0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(129,89,212,0.3)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(100,67,168,0.12)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(129,89,212,0.7), transparent)' }} />
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="mb-4 opacity-40 mx-auto">
            <path d="M0 22V13.2C0 5.9 4.5 1.5 13.4 0l1.2 2.2C9.3 3.4 6.8 6 6.5 10H11V22H0zm17 0V13.2C17 5.9 21.5 1.5 30.4 0l1.2 2.2C26.3 3.4 23.8 6 23.5 10H28V22H17z" fill="#8159d4"/>
          </svg>
          <p className="text-foreground text-lg md:text-xl leading-[1.7] mb-5">
            Awesome product. It's like OpenAI and Perplexity's deep research had a baby who gives a shit about enterprise selling.
          </p>
          <span className="font-mono text-sm text-text-secondary tracking-wide">— Kyle G.</span>
        </div>
      </div>

      {/* Mobile: snap carousel */}
      <MobileCarousel />

      {/* Desktop: marquee rows */}
      <div className="hidden md:block">
        <div className="mb-4 overflow-hidden">
          <div className="animate-marquee flex gap-4 hover:[animation-play-state:paused]">
            {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
              <MarqueeCard key={i} {...t} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="animate-marquee-reverse flex gap-4 hover:[animation-play-state:paused]">
            {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
              <MarqueeCard key={i} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

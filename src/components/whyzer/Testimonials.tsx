import { useScrollReveal } from '@/hooks/useScrollReveal';

const testimonials = [
  { quote: 'I feel like I have to really up my AI game.', name: 'Chris Carlton' },
  { quote: "I need to be top of my game when speaking to executives — with data, with metrics. That's really what motivated me to use Whyzer and join this conversation.", name: 'Kent' },
  { quote: 'I played around with Whyzer yesterday… I was blown away. The podcast gave me a really good idea on how to structure not just the deal, but the talk prep.', name: 'Mo' },
  { quote: 'Feels like a business analyst is watching your back… all the context is laid out.', name: 'Matt Brown' },
  { quote: 'I love the earnings call summaries and use chat constantly.', name: 'Michael Corvo' },
  { quote: 'Absolutely necessary and needed in our profession.', name: 'Rob Sader' },
  { quote: "Amazing prompts. First tool I've found that resonates with the way I dig into clients.", name: 'Bill Neal' },
  { quote: 'Even though I try to stay on top of my ICP accounts, Whyzer consistently surfaces insights that make me think, "How come I didn\'t know that?"', name: 'Jeff Clarke' },
  { quote: "Whyzer flagged a cybersecurity breach that helped me book a CISO meeting on my first try using Jamal's technique — it worked immediately.", name: 'Paul Hammond' },
  { quote: "It's built for our specific needs. Way better than agents like Perplexity or Claude for strategic selling.", name: 'Brian Tripp' },
  { quote: "What used to take a rep a year, I can do in two weeks with Whyzer. It helps us work on the right accounts.", name: 'David Inukpuk' },
  { quote: "Compared to tools like HockeyStack, Whyzer makes detailed info from 10Ks, 10Qs, and earnings reports actually usable for salespeople.", name: 'Lee Winer' },
];

const TestimonialCard = ({ quote, name }: { quote: string; name: string }) => (
  <div className="bg-card border border-foreground/[0.06] rounded-xl px-8 py-7 min-w-[320px] max-w-[320px] flex-shrink-0 relative">
    <span className="text-primary/40 text-5xl font-display absolute top-4 left-6">"</span>
    <p className="text-foreground text-base leading-relaxed mt-6 mb-4">{quote}</p>
    <p className="text-text-secondary text-sm font-semibold">— {name}</p>
  </div>
);

const Testimonials = () => {
  const sectionRef = useScrollReveal();
  const row1 = testimonials.slice(0, 6);
  const row2 = testimonials.slice(6);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 overflow-hidden bg-background-secondary">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">What Elite Sellers Say</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-[-0.02em] uppercase">
          Built for Reps Who Close the Big Ones
        </h2>
      </div>

      <div className="mb-4 overflow-hidden">
        <div className="animate-marquee flex gap-4 hover:[animation-play-state:paused]">
          {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="animate-marquee-reverse flex gap-4 hover:[animation-play-state:paused]">
          {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

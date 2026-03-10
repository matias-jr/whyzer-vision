import { Shield, Network } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';

const chartData = [
  { v: 20 }, { v: 35 }, { v: 28 }, { v: 45 }, { v: 42 }, { v: 58 }, { v: 52 },
  { v: 68 }, { v: 62 }, { v: 75 }, { v: 80 }, { v: 72 }, { v: 88 },
];

const BentoFeatures = () => {
  const sectionRef = useScrollReveal();
  const cardRef = useStaggerReveal(6);

  const cardBase = 'bg-card border border-foreground/[0.06] rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_40px_rgba(201,168,76,0.04)]';

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: 'hsl(240 20% 5%)',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">Features</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-16 tracking-[-0.03em]">
          The Arsenal of an Elite Seller
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large: Follow the Money */}
          <div ref={cardRef(0)} className={`${cardBase} lg:col-span-2`}>
            <div className="h-32 mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-background/50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(44, 55%, 54%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(44, 55%, 54%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="hsl(44, 55%, 54%)" strokeWidth={2} fill="url(#goldGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Follow the Money</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Whyzer highlights exactly where your target accounts are investing time, money, and attention — so you can align your message to their most urgent initiatives.
            </p>
          </div>

          {/* Medium: AI Podcast */}
          <div ref={cardRef(1)} className={cardBase}>
            <div className="h-20 mb-4 flex items-center justify-center">
              <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M0 20 Q10 5, 20 20 Q30 35, 40 20 Q50 5, 60 20 Q70 35, 80 20 Q90 5, 100 20 Q110 35, 120 20 Q130 5, 140 20 Q150 35, 160 20 Q170 5, 180 20 Q190 35, 200 20"
                  fill="none"
                  stroke="hsl(175, 55%, 55%)"
                  strokeWidth="2"
                  strokeDasharray="1000"
                  className="animate-waveform"
                  opacity="0.6"
                />
              </svg>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">AI Podcast Briefings</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Instant AI-generated podcast summaries of earnings calls. Understand the narrative in 3 minutes.
            </p>
          </div>

          {/* Medium: Executive Nuggets */}
          <div ref={cardRef(2)} className={cardBase}>
            <div className="h-20 mb-4 flex items-center justify-center">
              <span className="text-6xl text-primary opacity-40 font-display">"</span>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Executive Nuggets</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Actual quotes from C-suite, board members, and investors. Say what they're already thinking.
            </p>
          </div>

          {/* Large: Interactive Visualizations */}
          <div ref={cardRef(3)} className={`${cardBase} lg:col-span-2`}>
            <div className="h-32 mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-background/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="v" stroke="hsl(175, 55%, 55%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Interactive Visualizations</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Pinpoint what customer executives care about with visualizations that make the data impossible to ignore.
            </p>
          </div>

          {/* Small: Secure */}
          <div ref={cardRef(4)} className={cardBase}>
            <Shield size={28} className="text-primary mb-4" />
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Secure by Design</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Public data only. Encrypted infrastructure. Your research stays yours.
            </p>
          </div>

          {/* Small: Scale (hidden on smaller grids, shows in 3-col) */}
          <div ref={cardRef(5)} className={cardBase}>
            <Network size={28} className="text-electric mb-4" />
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Built for Scale</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Track 50 or 5,000 accounts. The platform handles the volume automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;

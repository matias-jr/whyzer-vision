import { Target, Search, Globe, MessageSquare, BarChart3, Zap } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';

const cases = [
  {
    icon: Target,
    title: 'Executive Outreach',
    body: 'Lead with a financially-grounded POV instead of a product pitch. Open conversations that sound like insider intelligence — because they are.',
  },
  {
    icon: Search,
    title: 'Account Research',
    body: 'Deep financial profiles on every target account. Earnings trends, strategic priorities, investment signals — all mapped to your solution\'s ROI angle before the first touchpoint.',
  },
  {
    icon: Globe,
    title: 'Global Enterprise Deals',
    body: 'Break into international accounts your competitors can\'t research. Surface the financial story of European, Asian, and private companies in minutes, not days.',
  },
  {
    icon: MessageSquare,
    title: 'Discovery Conversations',
    body: 'Insight-led questions — not generic discovery scripts. Walk in with a hypothesis. Walk out with a champion.',
  },
  {
    icon: BarChart3,
    title: 'Business Case Development',
    body: 'Financial signals become the backbone of your business case — margin pressure, cost targets, capex priorities tied directly to the value your solution delivers.',
  },
  {
    icon: Zap,
    title: 'Close Bigger, Faster',
    body: '"What used to take a rep a year, I can do in two weeks with Whyzer." Spend less time researching. Spend more time in executive rooms with a POV that moves deals forward.',
  },
];

const UseCases = () => {
  const sectionRef = useScrollReveal();
  const cardRef = useStaggerReveal(cases.length, 80);

  return (
    <section
      ref={sectionRef}
      id="use-cases"
      className="py-24 lg:py-32 px-6 lg:px-12 relative overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Subtle purple glow top-left */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(40,24,73,0.7) 0%, transparent 60%)',
      }} />

      <div className="max-w-[1200px] mx-auto relative">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">Use Cases</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 tracking-[-0.02em] uppercase">
          Built for Reps<br />Who Close <span className="text-primary">the Big Ones.</span>
        </h2>
        <p className="text-text-secondary text-base leading-relaxed max-w-[520px] mb-16">
          Purpose-built for enterprise selling — the complex cycles, the executive rooms, the financial conversations that separate 7-figure closers from everyone else.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
            <div
              key={i}
              ref={cardRef(i)}
              className="rounded-2xl p-7 transition-all duration-300 cursor-default"
              style={{
                background: '#131313',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#181818';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(129,89,212,0.25), 0 0 24px rgba(100,67,168,0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#131313';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(129,89,212,0.12)' }}
              >
                <Icon size={18} className="text-primary" />
              </div>
              <h3 className="font-body text-foreground font-semibold text-base mb-3">{c.title}</h3>
              <p className="text-text-secondary text-sm leading-[1.7]">{c.body}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;

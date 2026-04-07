import { Target, Search, Globe, MessageSquare, BarChart3, Zap } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';

const cases = [
  {
    icon: Search,
    title: 'Account Research',
    body: "Everything about your target account, all in one place. Financial performance, operational priorities, key executives and their own words, competitive pressures, headcount signals. All mapped to your solution's value story before your first touchpoint. Know the account better than they expect you to.",
  },
  {
    icon: Target,
    title: 'Executive Outreach',
    body: "Most sellers lead with their product. The ones who grab attention lead with the executive's business. A financially-grounded POV that names their priorities, their pressures, and the clearest path to their goals, before the first call. Outreach that sounds like insider intelligence. Because it is.",
  },
  {
    icon: MessageSquare,
    title: 'Discovery Conversations',
    body: "Walk in with a hypothesis about their business, not a list of questions about yours. Surface the tension early. Walk out with a champion who already believes you get it.",
  },
  {
    icon: Globe,
    title: 'Global Enterprise Deals',
    body: "7,500+ public and private companies across every global market, fully researched, financially mapped, ready for your POV. The accounts your competitors gave up on are now your biggest opportunity.",
  },
  {
    icon: BarChart3,
    title: 'Business Case Development',
    body: "Build a business case rooted in their numbers, not yours. Margin pressure, cost targets, capex priorities, all tied directly to the value your solution delivers. The kind of case that survives the CFO's first question.",
  },
  {
    icon: Zap,
    title: 'Close Bigger, Faster',
    body: "Less time researching. More time in executive rooms with a POV that moves deals forward. What used to take hours now takes minutes, on every account, every time. That's not a time saver. That's how you make elite selling your default.",
  },
];

const UseCases = () => {
  const sectionRef = useScrollReveal();
  const cardRef = useStaggerReveal(cases.length, 80);

  return (
    <section
      ref={sectionRef}
      id="use-cases"
      className="py-24 lg:py-32 px-10 lg:px-24 relative overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Subtle purple glow top-left */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(40,24,73,0.7) 0%, transparent 60%)',
      }} />

      <div className="max-w-[1200px] mx-auto relative">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">Use Cases</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 tracking-[-0.02em] uppercase">
          Your unfair advantage.<br /><span className="text-primary">From first conversation to closed won.</span>
        </h2>
        <p className="text-text-secondary text-base leading-relaxed max-w-[520px] mb-16">
          From your first touchpoint to your last negotiation. Whyzer gives you the financial narrative and executive intelligence to own every stage of the deal.
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

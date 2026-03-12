import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Target, Trophy, BarChart3, Mail, Layers, Mic } from 'lucide-react';

const vaultItems = [
  { icon: Target, label: 'The Pipeline Flywheel' },
  { icon: Trophy, label: 'Elite Sellers Playbook' },
  { icon: BarChart3, label: 'MDA Masterclass' },
  { icon: Mail, label: 'Executive Outreach Course' },
  { icon: Layers, label: 'Top, Middle & Bottom Funnel Playbooks' },
  { icon: Mic, label: 'Live Monthly Sessions with Jamal' },
];

const TheVault = () => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      id="vault"
      className="py-24 lg:py-32 px-6 lg:px-12 bg-background"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left */}
        <div className="lg:w-[55%]">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">Do More With Elite</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 tracking-[-0.02em] uppercase">
            It's Not Just a Tool.
            <br />
            It's a Full Arsenal.
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-6">
            Every Whyzer Elite subscription includes full access to <strong className="text-foreground">The Vault</strong> — Jamal Reimer's complete playbook for closing 7- and 8-figure deals.
          </p>

          {/* Elite & Corporate badge */}
          <div className="inline-flex items-center gap-2 bg-foreground/[0.04] border border-foreground/[0.08] rounded-full px-5 py-2.5 mb-10">
            <span className="text-sm font-semibold text-foreground">✦ Elite & Corporate only</span>
            <span className="text-text-secondary text-sm">· Not included in Premium.</span>
          </div>

          {/* Vault items in 2-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vaultItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-card border border-foreground/[0.06] rounded-xl px-5 py-4 transition-all duration-300 hover:border-foreground/[0.12]"
                >
                  <Icon size={18} className="text-text-secondary flex-shrink-0" />
                  <span className="text-foreground text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Jamal card */}
        <div className="lg:w-[45%] flex items-start lg:items-center">
          <div className="bg-card border border-foreground/[0.06] rounded-2xl p-8 w-full">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-foreground/20 flex items-center justify-center bg-foreground/[0.08] mb-5">
              <span className="font-display text-2xl text-foreground">JR</span>
            </div>
            <h3 className="font-body text-foreground font-semibold text-xl mb-1">Jamal Reimer</h3>
            <p className="text-text-secondary text-sm mb-6">Your AI Sales Co-Pilot</p>

            <div className="space-y-0">
              {[
                { label: 'RANKING', value: 'Top 0.1% Oracle Seller Globally' },
                { label: 'REVENUE CLOSED', value: '$160M+ SaaS' },
                { label: 'RECOGNITION', value: "President's Club — Multiple Years" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-t border-foreground/[0.06]">
                  <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">{item.label}</p>
                  <p className="text-foreground text-sm font-semibold text-right">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheVault;

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
      className="py-24 lg:py-32 px-6 lg:px-12 relative overflow-hidden"
      style={{
        background: '#0A0A0A',
        backgroundImage: 'radial-gradient(ellipse 70% 70% at 100% 100%, rgba(40,24,73,0.95) 0%, rgba(100,67,168,0.2) 40%, transparent 65%)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left */}
        <div className="lg:w-[55%]">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">Do More With Elite</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 tracking-[-0.02em] uppercase">
            It's Not Just a Tool.
            <br />
            It's a <span className="text-primary">Full Arsenal.</span>
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-6">
            Every Whyzer Elite subscription includes full access to <strong className="text-foreground">The Vault</strong> — Jamal Reimer's complete playbook for closing 7- and 8-figure deals.
          </p>

          {/* Elite & Corporate badge */}
          <div className="inline-flex items-center gap-2 bg-foreground/[0.04] border border-foreground/[0.08] rounded-full px-5 py-2.5 mb-10">
            <span className="text-sm font-semibold text-foreground">✦ Elite & Corporate only</span>
            <span className="text-text-secondary text-sm">· Not included in Premium.</span>
          </div>

          {/* Vault items — tonal, no borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vaultItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-250"
                  style={{ background: '#171717', cursor: 'default', boxShadow: '0px 4px 16px rgba(0,0,0,0.5)', transition: 'background 0.25s, box-shadow 0.25s' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#1a1a1a';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0px 12px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,89,212,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '#171717';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0px 4px 16px rgba(0,0,0,0.5)';
                  }}
                >
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(129,89,212,0.15)' }}>
                    <Icon size={14} className="text-primary" />
                  </div>
                  <span className="text-foreground text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Jamal card — glassmorphism */}
        <div className="lg:w-[45%] flex items-start lg:items-center">
          <div
            className="rounded-2xl p-8 w-full relative"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(129,89,212,0.25)',
              boxShadow: '0px 32px 64px rgba(0,0,0,0.5), 0 0 40px rgba(100,67,168,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full overflow-hidden mb-5 flex-shrink-0"
              style={{ border: '1px solid rgba(129,89,212,0.3)' }}
            >
              <img src="/jr_headshot.webp" alt="Jamal Reimer" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-body text-foreground font-semibold text-xl mb-1">Jamal Reimer</h3>
            <p className="text-text-secondary text-sm mb-6">Your AI Sales Co-Pilot</p>

            <div className="space-y-0">
              {[
                { label: 'RANKING', value: 'Top 0.1% Oracle Seller Globally' },
                { label: 'REVENUE CLOSED', value: '$160M+ SaaS' },
                { label: 'RECOGNITION', value: "President's Club — Multiple Years" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">{item.label}</p>
                  <p className="text-foreground text-sm font-semibold text-right">{item.value}</p>
                </div>
              ))}
            </div>

            <a
              href="mailto:sales@whyzer.ai"
              className="block w-full mt-6 py-3 rounded-lg text-center text-sm font-semibold text-foreground transition-all duration-200 hover:brightness-110"
              style={{ background: 'rgba(129,89,212,0.15)', border: '1px solid rgba(129,89,212,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(129,89,212,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(129,89,212,0.15)')}
            >
              Contact Sales →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheVault;

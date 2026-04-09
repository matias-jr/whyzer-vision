import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Target, Trophy, BarChart3, Mail, Layers, Mic } from 'lucide-react';

const vaultItems = [
  { icon: Target, label: 'The Pipeline Flywheel' },
  { icon: Trophy, label: 'The Enterprise Sellers Playbook' },
  { icon: BarChart3, label: 'The MDA Masterclass' },
  { icon: Mail, label: 'The Executive Outreach Course' },
  { icon: Layers, label: 'Full Funnel Playbooks' },
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
          <p className="font-mono text-base uppercase tracking-[0.15em] text-primary mb-4 font-semibold">Do more with Whyzer Elite</p>
          <h2 className="font-display text-[1.6rem] md:text-[2.35rem] text-foreground mb-4 tracking-[-0.02em] leading-[1.25] uppercase">
            Built by sellers, not by people who studied them.
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-6">
            Whyzer wasn't built by a product team that studied enterprise selling. It was built by Jamal Reimer, someone who spent decades doing it, and it's continuously sharpened by the Whyzer Community: elite sellers who use it to close deals every day. The Vault is where that collective experience lives. Every framework, every play, every lesson from $160M+ in closed SaaS deals, available to every Elite subscriber.
          </p>

          {/* Elite & Corporate badge */}
          <div className="inline-flex items-center gap-2 bg-foreground/[0.04] border border-foreground/[0.08] rounded-full px-5 py-2.5 mb-10">
            <span className="text-sm font-semibold text-foreground">Included with Elite &amp; Corporate.</span>
            <span className="text-text-secondary text-sm">The methodology behind the tool.</span>
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
                  <span className="text-foreground text-base font-medium">{item.label}</span>
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
              <div className="flex items-center justify-between py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">RANKING</p>
                <p className="text-foreground text-sm font-semibold text-right">Top 0.1% Oracle Seller Globally</p>
              </div>
              <div className="flex items-center justify-between py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">REVENUE CLOSED</p>
                <p className="text-foreground text-sm font-semibold text-right">$160M+ SaaS</p>
              </div>
              <div className="flex items-center justify-between py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">AUTHOR</p>
                <a
                  href="https://megadealsecretsbook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-semibold text-right hover:underline transition-opacity hover:opacity-80"
                >
                  Mega Deal Secrets
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheVault;

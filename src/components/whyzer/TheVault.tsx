import { useScrollReveal } from '@/hooks/useScrollReveal';

const vaultItems = [
  { icon: '📐', label: 'The Pipeline Flywheel' },
  { icon: '🏆', label: 'Elite Sellers Playbook' },
  { icon: '📊', label: 'MDA Masterclass' },
  { icon: '📧', label: 'Executive Outreach Course' },
  { icon: '🎯', label: 'Top, Middle & Bottom Funnel Playbooks' },
  { icon: '🎙️', label: 'Live Monthly Sessions with Jamal' },
];

const TheVault = () => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      id="vault"
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: 'radial-gradient(ellipse at 40% 50%, rgba(201,168,76,0.06) 0%, hsl(240 20% 5%) 60%)',
      }}
    >
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left */}
        <div className="lg:w-[60%]">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">Included Free</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 tracking-[-0.03em]">
            It's Not Just a Tool. It's a Full Arsenal.
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-10">
            Every Whyzer Elite subscription includes full access to <strong className="text-foreground">The Vault</strong> — Jamal Reimer's complete playbook for closing 7- and 8-figure deals.
          </p>

          <ul className="space-y-4">
            {vaultItems.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-foreground text-base">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Jamal card */}
        <div className="lg:w-[40%] flex items-center">
          <div className="bg-card border border-foreground/[0.06] rounded-2xl p-8 w-full">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center bg-primary/[0.1] mx-auto mb-5">
              <span className="font-display text-2xl text-primary">JR</span>
            </div>
            <div className="text-center">
              <h3 className="font-body text-foreground font-semibold text-lg mb-1">Jamal Reimer</h3>
              <div className="space-y-2 mt-4">
                {[
                  { label: 'Rank', value: 'Top 0.1% Oracle Seller Globally' },
                  { label: 'Revenue', value: '$160M+ SaaS Revenue Closed' },
                  { label: 'Awards', value: "President's Club — Multiple Years" },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-text-secondary text-[13px]">{item.label}</p>
                    <p className="text-foreground text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheVault;

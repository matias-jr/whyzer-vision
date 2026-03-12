import { useState, useEffect } from 'react';
import { Check, Diamond } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
  'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  // non-EU Europe that uses EUR or is broadly "Europe"
  'CH','NO','IS','AL','BA','ME','MK','RS','MD','UA','BY','GE','AM','AZ',
  'LI','MC','SM','VA','AD','XK',
]);

type Currency = { symbol: string; yearSuffix: string };

const CURRENCIES: Record<string, Currency> = {
  GBP: { symbol: '£', yearSuffix: '/year' },
  EUR: { symbol: '€', yearSuffix: '/year' },
  USD: { symbol: '$', yearSuffix: '/year' },
};

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD);
  const sectionRef = useScrollReveal();

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const code: string = data.country_code ?? '';
        if (code === 'GB') setCurrency(CURRENCIES.GBP);
        else if (EU_COUNTRIES.has(code)) setCurrency(CURRENCIES.EUR);
        // else stays USD
      })
      .catch(() => {/* silently keep USD */});
  }, []);

  const s = currency.symbol;

  const premiumPrice = annual ? `${s}47` : `${s}57`;
  const elitePrice = annual ? `${s}83` : `${s}97`;
  const premiumNote = annual ? `${s}570.00${currency.yearSuffix}` : `${s}684.00${currency.yearSuffix}`;
  const eliteNote = annual ? `${s}997.00${currency.yearSuffix}` : `${s}1,164.00${currency.yearSuffix}`;

  const checkIcon = <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />;

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-24 lg:py-32 px-6 lg:px-12 bg-background"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(200,200,200,0.03) 0%, #1e1e1e 70%)'
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4 text-center">Pricing</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-10 tracking-[-0.02em] text-center uppercase">
          Choose Your Competitive Edge
        </h2>

        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm ${!annual ? 'text-foreground' : 'text-text-secondary'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full border border-foreground/[0.1] transition-colors duration-200"
            style={{ background: annual ? '#C8C8C8' : '#333' }}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-background transition-transform duration-200 ${
                annual ? 'translate-x-7' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? 'text-foreground' : 'text-text-secondary'}`}>
            Annual — <span className="text-primary">Save up to 17%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {/* PREMIUM */}
          <div className="bg-card border border-foreground/[0.07] rounded-2xl p-8 lg:p-9">
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Premium Plan</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-foreground/[0.1] text-text-secondary bg-foreground/[0.06]">
                STARTER
              </span>
            </div>
            <div className="mb-1">
              <span className="text-5xl font-bold text-foreground">{premiumPrice}</span>
              <span className="text-lg text-text-secondary">/mo</span>
            </div>
            <p className="text-[13px] text-text-tertiary mb-6">{premiumNote}</p>
            <div className="border-t border-foreground/[0.08] pt-6 mb-6" />
            <ul className="space-y-3 mb-8 text-[15px]">
              {[
                'Public and private companies worldwide',
                'Unlimited Company reports',
                'Add up to 30 new companies each month',
                'Unlimited DealMap',
                '2 Whyzer & Jamal podcast generations per month',
                '2 Executive POV Dossiers',
                'Email Campaign Generator',
                'Chat with WhyzerAI',
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-foreground">
                  {checkIcon}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg border border-foreground/[0.15] text-foreground font-medium hover:bg-foreground/[0.05] transition-colors">
              Upgrade to Premium
            </button>
          </div>

          {/* ELITE */}
          <div className="relative lg:scale-[1.04] z-10">
            <div className="flex justify-center -mb-px">
              <span
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase text-primary-foreground"
                style={{ background: 'linear-gradient(135deg, #C8C8C8, #4A4A4A)' }}
              >
                ✦ Most Popular
              </span>
            </div>
            <div
              className="bg-card rounded-2xl p-8 lg:p-9"
              style={{
                border: '1px solid rgba(200,200,200,0.25)',
                boxShadow: '0 0 80px rgba(200,200,200,0.06), 0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-primary">Elite Plan</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/[0.15]">
                  FULL ACCESS
                </span>
              </div>
              <div className="mb-1">
                <span className="text-5xl font-bold text-primary">{elitePrice}</span>
                <span className="text-lg text-text-secondary">/mo</span>
              </div>
              <p className="text-[13px] text-text-tertiary mb-6">{eliteNote}</p>
              <div className="border-t border-primary/[0.15] pt-6 mb-6" />
              <ul className="space-y-3 mb-8 text-[15px]">
                {[
                  'Public and private companies worldwide',
                  'Unlimited Company reports',
                  'Add unlimited new companies each month',
                  'Unlimited podcast generation',
                  'Unlimited Executive POV Dossiers',
                  'Email Campaign Generator',
                  'Chat with WhyzerAI',
                  'Monthly live sessions',
                  'Access to Coach Jamal — your AI sales co-pilot',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-foreground">
                    {checkIcon}
                    <span>{f}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2.5">
                  <Diamond size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-bold text-primary" style={{ textShadow: '0 0 12px rgba(200,200,200,0.2)' }}>
                    ACCESS TO THE VAULT
                  </span>
                </li>
              </ul>
              <a
                href="https://subscribe.whyzer.ai/elite-monthly"
                className="block w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-center hover:brightness-110 hover:shadow-[0_0_24px_rgba(200,200,200,0.2)] transition-all"
              >
                Start Now
              </a>
            </div>
          </div>

          {/* CORPORATE */}
          <div className="bg-card border border-foreground/[0.07] rounded-2xl p-8 lg:p-9">
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Corporate Plan</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-foreground/[0.1] text-text-secondary bg-foreground/[0.06]">
                TEAMS
              </span>
            </div>
            <div className="mb-1">
              <span className="text-5xl font-bold text-foreground">Custom</span>
            </div>
            <p className="text-[13px] text-text-tertiary mb-6">Volume pricing available</p>
            <div className="border-t border-foreground/[0.08] pt-6 mb-6" />
            <ul className="space-y-3 mb-8 text-[15px]">
              {[
                'Everything in Elite',
                'Unlimited seats & user management',
                'Dedicated account success manager',
                'Custom onboarding & team training',
                'CRM & Salesforce integration (priority access)',
                'Slack integration for real-time alerts',
                'Custom AI prompt configuration',
                'SSO / Single Sign-On',
                'Role-based access controls',
                'SLA & compliance documentation',
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-foreground">
                  {checkIcon}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="mailto:sales@whyzer.ai"
              className="block w-full py-3 rounded-lg border border-foreground/[0.15] text-foreground font-medium text-center hover:bg-foreground/[0.05] transition-colors"
            >
              Contact Sales →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

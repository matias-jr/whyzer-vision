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
  const [regionSuffix, setRegionSuffix] = useState('');
  const sectionRef = useScrollReveal();

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const code: string = data.country_code ?? '';
        if (code === 'GB') { setCurrency(CURRENCIES.GBP); setRegionSuffix('-uk'); }
        else if (EU_COUNTRIES.has(code)) { setCurrency(CURRENCIES.EUR); setRegionSuffix('-eu'); }
        // else stays USD with no suffix
      })
      .catch(() => {/* silently keep USD */});
  }, []);

  const premiumLink = annual
    ? `https://subscribe.whyzer.ai/premium-annually${regionSuffix}`
    : `https://subscribe.whyzer.ai/premium-monthly${regionSuffix}`;
  const eliteLink = annual
    ? `https://subscribe.whyzer.ai/elite-annually${regionSuffix}`
    : `https://subscribe.whyzer.ai/elite-monthly${regionSuffix}`;

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
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: '#0A0A0A',
        backgroundImage: 'radial-gradient(ellipse 90% 70% at 50% 15%, rgba(40,24,73,0.9) 0%, rgba(40,24,73,0.4) 40%, transparent 65%)',
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        <p className="font-mono text-sm uppercase tracking-[0.15em] text-primary mb-4 text-center">Pricing</p>
        <h2 className="font-display text-[1.6rem] md:text-[2.35rem] text-foreground mb-8 tracking-[-0.02em] leading-[1.25] text-center uppercase">
          Less than one lost deal. <span className="text-primary">More than what you're spending to get ghosted.</span>
        </h2>

        <p className="text-text-secondary text-base leading-relaxed text-center max-w-[700px] mx-auto mb-10">
          Getting one executive meeting costs more in time, effort, and expense than Whyzer costs in a year. Comparable financial intelligence exists (AlphaSense, Gartner, Bloomberg) at $15,000–$50,000 per year. Not one of them knows what a POV is.
        </p>

        <div className="flex items-center justify-center gap-3 mb-2">
          <span className={`text-sm ${!annual ? 'text-foreground' : 'text-text-secondary'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full border border-foreground/[0.1] transition-colors duration-200"
            style={{ background: annual ? '#7B5CF0' : '#333' }}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-background transition-transform duration-200 ${
                annual ? 'translate-x-7' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? 'text-foreground' : 'text-text-secondary'}`}>
            Annual: <span className="text-primary">Save up to 17%</span>
          </span>
        </div>

        <p className="text-center text-[13px] text-text-tertiary mb-10">Prices shown in your local currency. Cancel anytime.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {/* PREMIUM */}
          <div
            className="rounded-2xl p-8 lg:p-9 transition-all duration-300"
            style={{
              background: 'rgba(20,14,40,0.6)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(129,89,212,0.15)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,89,212,0.25)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.5)'; }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Whyzer Premium</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-foreground/[0.1] text-text-secondary bg-foreground/[0.06]">STARTER</span>
            </div>
            <div className="mb-1">
              <span className="text-5xl font-bold text-foreground">{premiumPrice}</span>
              <span className="text-sm text-text-secondary ml-1">per seat / month</span>
            </div>
            <p className="text-[13px] text-text-tertiary mb-4">{premiumNote}</p>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-6">The full Whyzer platform: financial intelligence, executive profiles, Deal Maps, Account Audio Briefings, and AI-generated POVs across 7,500+ global companies. Show up prepared. Every time.</p>
            <div className="border-t border-foreground/[0.08] pt-6 mb-6" />
            <ul className="space-y-3 mb-8 text-[14px]">
              {[
                'Unlimited Company reports',
                'Add up to 30 new companies each month',
                'Unlimited deal maps',
                '2 Whyzer & Jamal podcasts per month',
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
            <a
              href={premiumLink}
              className="block w-full py-3 rounded-lg border text-foreground font-semibold text-center transition-all duration-200 text-sm"
              style={{ borderColor: 'rgba(129,89,212,0.3)', background: 'rgba(129,89,212,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(129,89,212,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(129,89,212,0.08)'; }}
              onClick={() => {
                const match = document.cookie.split('; ').find(row => row.startsWith('li_fat_id='));
                const li_fat_id = match ? match.split('=')[1] : null;
                if (li_fat_id) fetch('/api/track-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ li_fat_id }) }).catch(() => {});
              }}
            >
              Get Started Now
            </a>
          </div>

          {/* ELITE */}
          <div className="relative lg:scale-[1.04] z-10">
            <div className="flex justify-center -mb-px">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase text-white" style={{ background: 'linear-gradient(135deg, #8159d4, #6443A8)' }}>
                ✦ Most Popular
              </span>
            </div>
            <div
              className="rounded-2xl p-8 lg:p-9 transition-all duration-300"
              style={{
                background: 'rgba(30,18,60,0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(129,89,212,0.4)',
                boxShadow: '0 0 60px rgba(100,67,168,0.2), 0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-primary">Whyzer Elite</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/[0.12]">FULL ACCESS</span>
              </div>
              <div className="mb-1">
                <span className="text-5xl font-bold text-foreground">{elitePrice}</span>
                <span className="text-sm text-text-secondary ml-1">per seat / month</span>
              </div>
              <p className="text-[13px] text-text-tertiary mb-4">{eliteNote}</p>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-6">Everything in Premium, plus full access to The Vault: Jamal Reimer's complete playbook for closing 7- and 8-figure deals. The frameworks, the methodology, the live sessions. Not just the tool. The thinking behind it.</p>
              <div className="border-t border-primary/[0.12] pt-6 mb-6" />
              <ul className="space-y-3 mb-8 text-[14px]">
                {[
                  'Everything in Premium',
                  'Add unlimited new companies each month',
                  'Unlimited podcast generation',
                  'Unlimited Executive POV Dossiers',
                  'The Vault: Jamal\'s full enterprise selling playbook',
                  'Coach Jamal AI, your sales co-pilot',
                  'Pipeline Flywheel & MDA Masterclass',
                  'Executive Outreach Course',
                  'Financial Fluency 101',
                  'Whyzer Academy, monthly upskilling live sessions led by Jamal',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-foreground">
                    {checkIcon}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={eliteLink}
                className="block w-full py-3 rounded-lg text-white font-bold text-center hover:brightness-110 hover:shadow-[0_0_28px_rgba(129,89,212,0.5)] transition-all text-sm"
                style={{ background: 'linear-gradient(135deg, #8159d4, #6443A8)' }}
                onClick={() => {
                  const match = document.cookie.split('; ').find(row => row.startsWith('li_fat_id='));
                  const li_fat_id = match ? match.split('=')[1] : null;
                  if (li_fat_id) fetch('/api/track-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ li_fat_id }) }).catch(() => {});
                }}
              >
                Get Started
              </a>
            </div>
          </div>

          {/* CORPORATE */}
          <div
            className="rounded-2xl p-8 lg:p-9 transition-all duration-300"
            style={{
              background: 'rgba(20,14,40,0.6)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(129,89,212,0.15)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,89,212,0.25)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.5)'; }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Corporate / Teams</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-foreground/[0.1] text-text-secondary bg-foreground/[0.06]">TEAMS</span>
            </div>
            <div className="mb-1">
              <span className="text-5xl font-bold text-foreground">Custom</span>
            </div>
            <p className="text-[13px] text-text-tertiary mb-4">contact for team pricing</p>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-6">Bring Whyzer to your entire sales team. Volume pricing, dedicated onboarding, and a 3-hour live session with Jamal for your team. When your whole org shows up to executive meetings with a boardroom-ready POV, the playing field doesn't just tilt. It disappears.</p>
            <div className="border-t border-foreground/[0.08] pt-6 mb-6" />
            <ul className="space-y-3 mb-8 text-[14px]">
              {[
                'Everything in Elite',
                'Volume team pricing',
                'Dedicated onboarding',
                '3-hr live session with Jamal',
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-foreground">
                  {checkIcon}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://api.leadconnectorhq.com/widget/bookings/whyzer-for-sales-leaders"
              className="block w-full py-3 rounded-lg border text-foreground font-semibold text-center transition-all duration-200 text-sm"
              style={{ borderColor: 'rgba(129,89,212,0.3)', background: 'rgba(129,89,212,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(129,89,212,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(129,89,212,0.08)'; }}
            >
              Talk to Jamal Directly →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

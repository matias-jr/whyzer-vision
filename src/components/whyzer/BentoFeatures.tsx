import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';

const BentoFeatures = () => {
  const sectionRef = useScrollReveal();
  const cardRef = useStaggerReveal(4);

  const cardBase = 'rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-2px]';
  const cardStyle = { background: '#171717', boxShadow: '0px 8px 32px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.04)' };
  const cardHoverStyle = '0px 24px 56px rgba(0,0,0,0.7), 0 0 0 1px rgba(89,89,212,0.35), 0 0 30px rgba(67,67,168,0.15)';

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: '#0A0A0A',
        backgroundImage: `
          radial-gradient(ellipse 70% 60% at 80% 30%, rgba(40,24,73,0.9) 0%, rgba(67,67,168,0.15) 40%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 10% 80%, rgba(40,24,73,0.4) 0%, transparent 50%),
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, 60px 60px, 60px 60px',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-sm uppercase tracking-[0.15em] text-primary mb-4">Features</p>
        <h2 className="font-display text-[1.6rem] md:text-[2.35rem] text-foreground mb-16 tracking-[-0.02em] leading-[1.25] uppercase">
          Everything you need to <span className="text-primary">own the executive conversation.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Card 1 — Executive Intelligence */}
          <div
            ref={cardRef(0)}
            className={`${cardBase} relative`}
            style={cardStyle}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardHoverStyle; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardStyle.boxShadow; }}
          >
            <div className="h-44 mb-6 rounded-xl overflow-hidden p-5 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.35)' }}>
              {/* Quote row */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ background: 'rgba(89,89,212,0.2)', color: '#5959D4' }}>CFO</div>
                <p className="text-[11px] text-foreground leading-relaxed italic pt-1">"Our priority is margin recovery without sacrificing AI infrastructure investment."</p>
              </div>
              {/* Attribution */}
              <div className="flex items-center gap-2.5 pl-11">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0" style={{ background: 'rgba(89,89,212,0.15)', color: '#A8A8FF' }}>JS</div>
                <div>
                  <p className="text-[11px] text-foreground font-semibold leading-none">John Smith</p>
                  <p className="text-[10px] text-text-tertiary leading-none mt-0.5">CFO · Company Inc.</p>
                </div>
              </div>
              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-wider">Q3 Earnings Call · Board Member</span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
              </div>
              {/* Tags */}
              <div className="flex gap-2">
                {['NVIDIA', 'Investor Letter', 'Q3 Priority'].map(tag => (
                  <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(89,89,212,0.15)', color: '#5959D4' }}>{tag}</span>
                ))}
              </div>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Executive Intelligence</h3>
            <p className="text-text-secondary text-base leading-relaxed">
              C-suite quotes, board priorities, investor communications. Know what keeps them up at night, and show up with a point of view on how to fix it. Before anyone else does.
            </p>
          </div>

          {/* Card 2 — Deal Maps */}
          <div
            ref={cardRef(1)}
            className={`${cardBase} relative`}
            style={cardStyle}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardHoverStyle; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardStyle.boxShadow; }}
          >
            <div className="h-36 mb-6 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <svg viewBox="0 0 292 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Centre node */}
                <rect x="109" y="48" width="74" height="24" rx="7" fill="rgba(89,89,212,0.3)" stroke="#5959D4" strokeWidth="1.4"/>
                <text x="146" y="64" textAnchor="middle" fill="#A8A8FF" fontSize="9" fontFamily="monospace" fontWeight="600">NVIDIA Corp</text>
                {/* Left branch lines */}
                <line x1="109" y1="56" x2="76" y2="26" stroke="rgba(89,89,212,0.45)" strokeWidth="1"/>
                <line x1="109" y1="60" x2="76" y2="60" stroke="rgba(89,89,212,0.45)" strokeWidth="1"/>
                <line x1="109" y1="64" x2="76" y2="94" stroke="rgba(89,89,212,0.45)" strokeWidth="1"/>
                {/* Left nodes */}
                <rect x="2" y="14" width="74" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(89,89,212,0.35)" strokeWidth="1"/>
                <text x="39" y="30" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="monospace">Infrastructure</text>
                <rect x="2" y="48" width="74" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(89,89,212,0.35)" strokeWidth="1"/>
                <text x="39" y="64" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="monospace">Margin Pressure</text>
                <rect x="2" y="82" width="74" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(89,89,212,0.35)" strokeWidth="1"/>
                <text x="39" y="98" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">Goals</text>
                {/* Right branch lines */}
                <line x1="183" y1="56" x2="216" y2="26" stroke="rgba(89,89,212,0.45)" strokeWidth="1"/>
                <line x1="183" y1="60" x2="216" y2="60" stroke="rgba(89,89,212,0.45)" strokeWidth="1"/>
                <line x1="183" y1="64" x2="216" y2="94" stroke="rgba(89,89,212,0.45)" strokeWidth="1"/>
                {/* Right nodes */}
                <rect x="216" y="14" width="74" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(89,89,212,0.35)" strokeWidth="1"/>
                <text x="253" y="30" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6.5" fontFamily="monospace">Cost Structure</text>
                <rect x="216" y="48" width="74" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(89,89,212,0.35)" strokeWidth="1"/>
                <text x="253" y="64" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">Strategy</text>
                <rect x="216" y="82" width="74" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(89,89,212,0.35)" strokeWidth="1"/>
                <text x="253" y="98" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="monospace">Challenges</text>
              </svg>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Deal Maps</h3>
            <p className="text-text-secondary text-base leading-relaxed">
              An interactive map of everything the account cares about: priorities, pressures, strategic bets, visualized so you can find your thesis before you write a single word. See the whole board before you make your move.
            </p>
          </div>

          {/* Card 3 — Account Audio Briefings (glass) */}
          <div
            ref={cardRef(2)}
            className={`${cardBase} relative`}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0px 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardHoverStyle; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0px 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
          >
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(89,89,212,0.5), transparent)' }} />
            {/* Podcast player visual */}
            <div className="h-36 mb-6 rounded-xl overflow-hidden relative flex flex-col justify-center px-5 gap-3" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(89,89,212,0.3)' }}>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M2 1l9 6-9 6V1z" fill="#5959D4"/></svg>
                </div>
                <div>
                  <div className="text-[11px] text-foreground font-semibold font-mono">Q4 Earnings: NVIDIA Corp</div>
                  <div className="text-[10px] text-text-tertiary font-mono">3:12 / 3:47</div>
                </div>
                <div className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(89,89,212,0.2)', color: '#5959D4' }}>AI Summary</div>
              </div>
              {/* Waveform bars */}
              <div className="flex items-center gap-[3px] h-8">
                {[4,8,14,10,18,22,16,24,20,28,18,24,16,20,12,18,22,16,10,14,8,12,6,10,8].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-sm flex-1"
                    style={{
                      height: `${h}px`,
                      background: i < 14 ? '#5959D4' : 'rgba(255,255,255,0.15)',
                      opacity: i < 14 ? 0.9 : 0.5,
                    }}
                  />
                ))}
              </div>
              {/* Progress bar */}
              <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full w-[84%]" style={{ background: 'linear-gradient(90deg, #5959D4, #4343A8)' }} />
              </div>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Account Audio Briefings</h3>
            <p className="text-text-secondary text-base leading-relaxed">
              Every account, distilled into a 3-minute audio briefing generated from earnings calls, investor days, and filings. Understand the financial narrative on your commute. Walk in knowing more than the room expects.
            </p>
          </div>

          {/* Card 4 — Global Coverage (glass) */}
          <div
            ref={cardRef(3)}
            className={`${cardBase} relative`}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0px 8px 32px rgba(0,0,0,0.6)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardHoverStyle; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0px 8px 32px rgba(0,0,0,0.6)'; }}
          >
            <div className="h-36 mb-6 rounded-xl overflow-hidden p-5 flex flex-col justify-between" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { flag: '🇩🇪', label: 'Europe', sub: 'SAP, Nestlé, ASML', count: '3,200+' },
                  { flag: '🇯🇵', label: 'Asia-Pac', sub: 'Samsung, Bosch, Sony', count: '1,000+' },
                  { flag: '🇺🇸', label: 'Private US', sub: 'Bootstrapped & PE-backed', count: '6,000+' },
                  { flag: '🌎', label: 'LatAm', sub: 'Petrobras, Mercado Libre', count: '400+' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span className="text-lg">{r.flag}</span>
                    <div>
                      <div className="text-[10px] font-semibold text-foreground">{r.label}</div>
                      <div className="text-[9px] text-primary font-mono">{r.count}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-1">
                <span className="text-xs font-mono text-text-tertiary">7,500+ companies worldwide</span>
              </div>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Global Coverage</h3>
            <p className="text-text-secondary text-base leading-relaxed">
              7,500+ public and private companies across every global market. The accounts your competitors can't research: HSBC, Revolut, Stripe, Monzo. Now fully covered. Your territory just got a lot bigger.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;

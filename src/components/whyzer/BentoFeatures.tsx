import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const revenueData = [
  { q: 'Q1 23', v: 28 }, { q: 'Q2 23', v: 35 }, { q: 'Q3 23', v: 31 },
  { q: 'Q4 23', v: 48 }, { q: 'Q1 24', v: 52 }, { q: 'Q2 24', v: 61 },
  { q: 'Q3 24', v: 58 }, { q: 'Q4 24', v: 75 },
];

const marginData = [
  { q: 'Q1', v: 52 }, { q: 'Q2', v: 55 }, { q: 'Q3', v: 51 },
  { q: 'Q4', v: 59 }, { q: 'Q1', v: 63 }, { q: 'Q2', v: 67 },
  { q: 'Q3', v: 64 }, { q: 'Q4', v: 71 },
];

const BentoFeatures = () => {
  const sectionRef = useScrollReveal();
  const cardRef = useStaggerReveal(4);

  const cardBase = 'rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-2px]';
  const cardStyle = { background: '#171717', boxShadow: '0px 8px 32px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.04)' };
  const cardHoverStyle = '0px 24px 56px rgba(0,0,0,0.7), 0 0 0 1px rgba(129,89,212,0.35), 0 0 30px rgba(100,67,168,0.15)';

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: '#0A0A0A',
        backgroundImage: `
          radial-gradient(ellipse 70% 60% at 80% 30%, rgba(40,24,73,0.9) 0%, rgba(100,67,168,0.15) 40%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 10% 80%, rgba(40,24,73,0.4) 0%, transparent 50%),
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, 60px 60px, 60px 60px',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">Features</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-16 tracking-[-0.02em] uppercase">
          The Arsenal of an <span className="text-primary">Elite Seller</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Card 1 — Earnings Call Podcasts (large, glass) */}
          <div
            ref={cardRef(0)}
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
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(129,89,212,0.5), transparent)' }} />
            {/* Podcast player visual */}
            <div className="h-36 mb-6 rounded-xl overflow-hidden relative flex flex-col justify-center px-5 gap-3" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(129,89,212,0.3)' }}>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M2 1l9 6-9 6V1z" fill="#8159d4"/></svg>
                </div>
                <div>
                  <div className="text-[11px] text-foreground font-semibold font-mono">Q4 Earnings — NVIDIA Corp</div>
                  <div className="text-[10px] text-text-tertiary font-mono">3:12 / 3:47</div>
                </div>
                <div className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(129,89,212,0.2)', color: '#8159d4' }}>AI Summary</div>
              </div>
              {/* Waveform bars */}
              <div className="flex items-center gap-[3px] h-8">
                {[4,8,14,10,18,22,16,24,20,28,18,24,16,20,12,18,22,16,10,14,8,12,6,10,8].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-sm flex-1"
                    style={{
                      height: `${h}px`,
                      background: i < 14 ? '#8159d4' : 'rgba(255,255,255,0.15)',
                      opacity: i < 14 ? 0.9 : 0.5,
                    }}
                  />
                ))}
              </div>
              {/* Progress bar */}
              <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full w-[84%]" style={{ background: 'linear-gradient(90deg, #8159d4, #6443A8)' }} />
              </div>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Earnings Call Podcasts</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              AI-generated audio summaries. Understand the account's narrative in 3 minutes — on the commute, before the call, no PDFs required.
            </p>
          </div>

          {/* Card 2 — Interactive Financial Visualizations */}
          <div
            ref={cardRef(1)}
            className={`${cardBase} relative`}
            style={cardStyle}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardHoverStyle; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardStyle.boxShadow; }}
          >
            <div className="h-36 mb-6 rounded-xl overflow-hidden p-3" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">Revenue Growth</span>
                <span className="text-[10px] font-mono text-primary">+22% YoY</span>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={revenueData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8159d4" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#8159d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="q" tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="v" stroke="#8159d4" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Interactive Financial Visualizations</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Pinpoint what customer executives care about with charts that make the financial data impossible to ignore — and easy to reference in the room.
            </p>
          </div>

          {/* Card 3 — Executive Intelligence */}
          <div
            ref={cardRef(2)}
            className={`${cardBase} relative`}
            style={cardStyle}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardHoverStyle; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = cardStyle.boxShadow; }}
          >
            <div className="h-36 mb-6 rounded-xl overflow-hidden p-5 flex flex-col justify-between" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(129,89,212,0.2)', color: '#8159d4' }}>CFO</div>
                <div>
                  <p className="text-[11px] text-foreground leading-relaxed italic">"Our priority is margin recovery without sacrificing AI infrastructure investment."</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-wider">Q3 Earnings Call · Board Member</span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
              </div>
              <div className="flex gap-2">
                {['NVIDIA', 'Investor Letter', 'Q3 Priority'].map(tag => (
                  <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(129,89,212,0.15)', color: '#8159d4' }}>{tag}</span>
                ))}
              </div>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Executive Intelligence</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              C-suite quotes, board member priorities, investor communications. Know what they're already thinking — and say it back to them before anyone else does.
            </p>
          </div>

          {/* Card 4 — Global Coverage (large, glass) */}
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
                  { flag: '🇩🇪', label: 'Europe', sub: 'SAP, Nestlé, ASML', count: '18,400+' },
                  { flag: '🇯🇵', label: 'Asia-Pac', sub: 'Samsung, Bosch, Sony', count: '14,200+' },
                  { flag: '🇺🇸', label: 'Private US', sub: 'Bootstrapped & PE-backed', count: '11,000+' },
                  { flag: '🌎', label: 'LatAm', sub: 'Petrobras, Mercado Libre', count: '6,400+' },
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
                <span className="text-xs font-mono text-text-tertiary">50,000+ companies worldwide</span>
              </div>
            </div>
            <h3 className="font-body text-foreground font-semibold text-lg mb-2">Global Coverage</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              50,000+ public international and private US companies. SAP, Nestlé, Samsung, Bosch — the accounts other sellers can't research, now fully covered.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;

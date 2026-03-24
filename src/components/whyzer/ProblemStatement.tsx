import { Clock, BarChart3, Lock } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';

const painPoints = [
  {
    icon: Clock,
    iconColor: 'text-destructive',
    title: '5-10 hours of manual research',
    body: "Every AE cobbles together ChatGPT, browser tabs, and spreadsheets. There's no standard. No scale.",
  },
  {
    icon: BarChart3,
    iconColor: 'text-text-secondary',
    title: 'Generic pitches that lose deals',
    body: "When you can't speak to executive financial priorities, you get delegated down — or ghosted entirely.",
  },
  {
    icon: Lock,
    iconColor: 'text-primary',
    title: 'Intelligence locked in PDFs nobody reads',
    body: '10-Ks, earnings calls, and investor letters contain the deal-winning narrative. Most sellers never open them.',
  },
];

const ProblemStatement = () => {
  const sectionRef = useScrollReveal();
  const cardRef = useStaggerReveal(painPoints.length);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 px-6 lg:px-12 relative overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Purple radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 85% 50%, rgba(40,24,73,0.85) 0%, rgba(100,67,168,0.12) 45%, transparent 70%)' }} />
      <div className="max-w-[900px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 relative">
        <div className="lg:w-[40%]">
          <p className="font-display text-2xl md:text-4xl text-foreground leading-[1.4] uppercase">
            Most sellers pitch <span className="text-primary">operational benefits</span> to low-level stakeholders.
            <br /><br />
            Elite sellers craft <span className="text-primary">financial narratives for executives.</span>
          </p>
        </div>

        <div className="lg:w-[60%] flex flex-col gap-3">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                ref={cardRef(i)}
                className="rounded-xl p-6 transition-all duration-300 shadow-diffuse-hover"
                style={{
                  background: '#171717',
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.5)',
                  transition: 'background 0.3s, box-shadow 0.3s, transform 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#202020';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0px 24px 48px rgba(0,0,0,0.65)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#171717';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0px 4px 20px rgba(0,0,0,0.5)';
                }}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center mb-4"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Icon size={16} className={point.iconColor} />
                </div>
                <h3 className="font-body text-foreground font-semibold text-base mb-2">{point.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{point.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;

import { Clock, BarChart3, Lock } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';

const painPoints = [
  {
    icon: Clock,
    iconColor: 'text-destructive',
    title: 'Weeks of prep. Minutes of game time.',
    body: "You spend weeks cobbling together ChatGPT, browser tabs, and earnings PDFs, only to get 8 minutes with a CFO who already knows their own numbers better than you do.",
  },
  {
    icon: BarChart3,
    iconColor: 'text-text-secondary',
    title: 'Delegated down. Ghosted. Commoditized.',
    body: "When your pitch sounds like everyone else's, executives send you to a procurement manager. That's not a sales cycle. It's a death march to a price war.",
  },
  {
    icon: Lock,
    iconColor: 'text-primary',
    title: "The deal-winning narrative is already public. Nobody's reading it.",
    body: "Every 10-K, earnings call, and investor letter tells you exactly what keeps the CFO up at night. It's all there. It just takes 6 hours to find, and another 2 to turn into something you can say in a meeting.",
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
          <p className="font-display text-[1.6rem] md:text-[2.2rem] text-foreground leading-[1.35] uppercase">
            Most sellers never make it to the boardroom.
            <br />
            <span className="text-primary">The ones who do speak a different language.</span>
          </p>
        </div>

        <div className="lg:w-[60%] flex flex-col gap-3">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                ref={cardRef(i)}
                className="rounded-xl p-7 transition-all duration-300 shadow-diffuse-hover"
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
                  className="w-9 h-9 rounded-md flex items-center justify-center mb-4"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Icon size={18} className={point.iconColor} />
                </div>
                <h3 className="font-body text-foreground font-semibold text-lg mb-2">{point.title}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{point.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;

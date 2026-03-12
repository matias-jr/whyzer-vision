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
    <section ref={sectionRef} className="py-24 lg:py-32 px-6 lg:px-12 bg-background">
      <div className="max-w-[900px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="lg:w-[40%]">
          <p className="font-display text-2xl md:text-4xl text-foreground leading-[1.4] uppercase">
            "Most sellers pitch operational benefits to low-level stakeholders.
            <br /><br />
            <span className="text-primary">Elite sellers</span> craft financial narratives for executives."
          </p>
        </div>

        <div className="lg:w-[60%] flex flex-col gap-4">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                ref={cardRef(i)}
                className="bg-card border border-foreground/[0.06] rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,200,200,0.04)]"
              >
                <Icon size={24} className={`${point.iconColor} mb-3`} />
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

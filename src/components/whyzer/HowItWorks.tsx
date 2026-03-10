import { Search, Loader, Sparkles } from 'lucide-react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    num: '01',
    title: 'Search Your Target Account',
    body: 'Enter any publicly traded company. Whyzer instantly accesses SEC filings, earnings call transcripts, investor letters, and board-level communications.',
    visual: 'search',
  },
  {
    num: '02',
    title: 'Whyzer Analyzes the Financial Story',
    body: "Our expert-crafted prompts — built by reps who've closed $160M+ in deals — extract the strategic priorities, financial tensions, and executive mindset from thousands of data points.",
    visual: 'process',
  },
  {
    num: '03',
    title: 'Generate Your Point of View',
    body: 'Receive 3–5 boardroom-ready POVs, complete with KPIs, executive quotes, financial context, and next-step messaging. Ready to send in under 2 minutes.',
    visual: 'sparkle',
  },
];

const HowItWorks = () => {
  const sectionRef = useScrollReveal();
  const stepRef = useStaggerReveal(3);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 px-6 lg:px-12" style={{ background: 'hsl(240 20% 5%)' }}>
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">How It Works</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-16 tracking-[-0.03em]">
          Three Steps to a Boardroom-Ready POV
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[16.6%] right-[16.6%] border-t border-dashed border-text-tertiary/30" />

          {steps.map((step, i) => (
            <div key={i} ref={stepRef(i)} className="text-center lg:text-left">
              <span className="font-mono text-primary text-5xl lg:text-6xl font-bold mb-6 inline-block">
                {step.num}
              </span>
              <h3 className="font-body text-foreground text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">{step.body}</p>

              {/* Micro-visual */}
              <div className="inline-flex items-center justify-center">
                {step.visual === 'search' && (
                  <div className="bg-card border border-foreground/[0.06] rounded-lg px-4 py-2.5 flex items-center gap-2">
                    <Search size={14} className="text-text-tertiary" />
                    <span className="font-mono text-sm text-electric">NVIDIA</span>
                    <div className="w-px h-4 bg-primary animate-pulse" />
                  </div>
                )}
                {step.visual === 'process' && (
                  <div className="flex items-center gap-3">
                    <Loader size={20} className="text-primary animate-spin-dots" />
                    <span className="text-text-secondary text-xs font-mono">Analyzing...</span>
                  </div>
                )}
                {step.visual === 'sparkle' && (
                  <div className="relative">
                    <div className="bg-card border border-primary/20 rounded-lg px-4 py-2 text-xs font-mono text-primary">
                      POV Generated ✓
                    </div>
                    <Sparkles size={14} className="text-primary absolute -top-2 -right-2 animate-sparkle" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import { useRef, useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    num: '01',
    title: 'Search Your Target Account',
    body: 'Enter any publicly traded company. Whyzer instantly accesses SEC filings, earnings call transcripts, investor letters, and board-level communications.',
  },
  {
    num: '02',
    title: 'Whyzer Analyzes the Financial Story',
    body: "Our expert-crafted prompts — built by reps who've closed $160M+ in deals — extract the strategic priorities, financial tensions, and executive mindset from thousands of data points.",
  },
  {
    num: '03',
    title: 'Generate Your Point of View',
    body: 'Receive 3–5 boardroom-ready POVs, complete with KPIs, executive quotes, financial context, and next-step messaging. Ready to send in under 2 minutes.',
  },
];

const HowItWorks = () => {
  const sectionRef = useScrollReveal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Ensure video is ready for scrubbing
    video.pause();

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through the sticky section
      // The section is 300vh tall, so the sticky content scrolls for 200vh
      const scrollableDistance = containerHeight - viewportHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // Scrub video
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = progress * video.duration;
      }

      // Update active step
      if (progress < 0.33) setActiveStep(0);
      else if (progress < 0.66) setActiveStep(1);
      else setActiveStep(2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef}>
      <div ref={containerRef} className="relative bg-background" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen flex flex-col lg:flex-row items-center overflow-hidden">
          {/* Left — Text content */}
          <div className="lg:w-[45%] px-6 lg:px-12 py-12 lg:py-0 flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">How It Works</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 tracking-[-0.02em] uppercase">
              Three Steps to a Boardroom-Ready POV
            </h2>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex gap-5 transition-all duration-500 ${
                    activeStep === i ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <span className="font-mono text-primary text-3xl lg:text-4xl font-bold shrink-0 w-12">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-body text-foreground text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Video */}
          <div className="lg:w-[55%] h-full flex items-center justify-center p-6 lg:p-12">
            <div
              className="w-full max-w-[640px] rounded-2xl overflow-hidden border border-foreground/[0.08]"
              style={{
                boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 40px rgba(200,200,200,0.03)',
              }}
            >
              {/* Browser chrome */}
              <div className="h-9 flex items-center px-4 gap-2 border-b border-foreground/[0.06]" style={{ background: '#1a1a1a' }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-foreground/[0.06] rounded px-3 py-0.5 text-[10px] font-mono text-text-tertiary">
                    app.whyzer.ai
                  </div>
                </div>
              </div>
              <video
                ref={videoRef}
                src="/whyzer-video.mp4"
                muted
                playsInline
                preload="auto"
                className="w-full block"
                style={{ background: '#1e1e1e' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

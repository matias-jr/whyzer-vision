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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    video.pause();

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollableDistance = containerHeight - viewportHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      setProgress(p);

      if (video.duration && isFinite(video.duration)) {
        video.currentTime = p * video.duration;
      }

      if (p < 0.33) setActiveStep(0);
      else if (p < 0.66) setActiveStep(1);
      else setActiveStep(2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef}>
      <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Full-bleed video background */}
          <video
            ref={videoRef}
            src="/whyzer-video-v2.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'cover',
              objectPosition: 'right center',
            }}
          />

          {/* Left-to-right gradient so text stays legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.88) 30%, rgba(8,8,8,0.55) 55%, rgba(8,8,8,0.0) 100%)',
            }}
          />

          {/* Bottom vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,8,8,0.6) 0%, transparent 30%)',
            }}
          />

          {/* Text panel — left side */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 lg:px-16 w-full lg:w-[52%]">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">
              How It Works
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 tracking-[-0.02em] uppercase leading-tight">
              Three Steps to a<br />Boardroom-Ready POV
            </h2>

            {/* Steps with progress track */}
            <div className="relative flex gap-6">
              {/* Vertical progress track */}
              <div className="relative flex flex-col items-center" style={{ width: 2 }}>
                <div
                  className="absolute top-0 w-full rounded-full"
                  style={{
                    height: '100%',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                />
                <div
                  className="absolute top-0 w-full rounded-full transition-none"
                  style={{
                    height: `${progress * 100}%`,
                    background: 'linear-gradient(to bottom, #5EEAD4, #C8C8C8)',
                    transition: 'height 0.1s linear',
                  }}
                />
              </div>

              <div className="flex flex-col gap-10 flex-1">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="transition-all duration-500"
                    style={{
                      opacity: activeStep === i ? 1 : 0.28,
                      transform: activeStep === i ? 'translateX(0)' : 'translateX(-6px)',
                    }}
                  >
                    <div className="flex items-baseline gap-4 mb-2">
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: activeStep === i ? '#5EEAD4' : 'rgba(255,255,255,0.3)' }}
                      >
                        {step.num}
                      </span>
                      <h3 className="font-body text-foreground font-semibold text-base lg:text-lg">
                        {step.title}
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed pl-10"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll progress pill — bottom center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-400"
                style={{
                  width: activeStep === i ? 24 : 6,
                  height: 6,
                  background: activeStep === i ? '#5EEAD4' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

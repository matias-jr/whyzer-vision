import { useRef, useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const TOTAL_FRAMES = 159;

const steps = [
  {
    num: '01',
    title: 'Find the financial pressure',
    body: "Search any account. Whyzer instantly surfaces where the money is going, where the pressure is building, and what the board is demanding. You see the financial reality before your first touchpoint.",
  },
  {
    num: '02',
    title: 'Surface the tension',
    body: "Every executive carries a private anxiety: the gap between where they are and where the board expects them to be. Whyzer finds it. When you name it in the room, the phone goes face-down. You're no longer a vendor. You're the person who gets it.",
  },
  {
    num: '03',
    title: 'Deploy the narrative',
    body: "2–3 boardroom-ready POVs land in your hands, each one built around the executive's ambitions, not your product features. Copy to outreach. Walk into the meeting. Own the conversation.",
  },
];

const HowItWorks = () => {
  const sectionRef = useScrollReveal();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => {
        loaded++;
        loadedRef.current = loaded;
        if (loaded === TOTAL_FRAMES) setReady(true);
        // Draw first frame immediately once it loads
        if (idx === 1) {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        }
      };
      img.src = `/frames/frame_${String(i).padStart(4, '0')}.jpg`;
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  // Scroll → frame draw (via rAF + lerp for smooth transitions)
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let lastFrame = -1;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      currentProgress = lerp(currentProgress, targetProgress, 0.1);

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.round(currentProgress * (TOTAL_FRAMES - 1))
      );

      if (frameIdx !== lastFrame) {
        const img = framesRef.current[frameIdx];
        if (img?.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          lastFrame = frameIdx;
        }
      }

      setProgress(currentProgress);
      if (currentProgress < 0.33) setActiveStep(0);
      else if (currentProgress < 0.66) setActiveStep(1);
      else setActiveStep(2);

      rafId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollableDistance = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      targetProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef}>
      <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Canvas — full-bleed background */}
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'right center' }}
          />

          {/* Left-to-right gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(8,8,8,1) 0%, rgba(8,8,8,0.96) 35%, rgba(8,8,8,0.75) 60%, rgba(8,8,8,0.15) 100%)',
            }}
          />

          {/* Bottom vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(8,8,8,0.6) 0%, transparent 30%)',
            }}
          />

          {/* Text panel — left side */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 lg:px-16 w-full lg:w-[52%]">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">
              How It Works
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 tracking-[-0.02em] uppercase leading-tight">
              From zero to boardroom-ready.<br /><span className="text-primary">In under 2 minutes.</span>
            </h2>

            {/* Steps with progress track */}
            <div className="relative flex gap-6">
              {/* Vertical progress track */}
              <div className="relative flex flex-col items-center" style={{ width: 2 }}>
                <div
                  className="absolute top-0 w-full rounded-full"
                  style={{ height: '100%', background: 'rgba(255,255,255,0.08)' }}
                />
                <div
                  className="absolute top-0 w-full rounded-full"
                  style={{
                    height: `${progress * 100}%`,
                    background: 'linear-gradient(to bottom, #8159d4, #6443A8)',
                    transition: 'height 0.05s linear',
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
                        style={{ color: activeStep === i ? '#8159d4' : 'rgba(255,255,255,0.3)' }}
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

            {/* Loading indicator */}
            {!ready && (
              <div className="mt-8 flex items-center gap-3">
                <div
                  className="w-24 h-0.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(loadedRef.current / TOTAL_FRAMES) * 100}%`,
                      background: '#5EEAD4',
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
                  Loading
                </span>
              </div>
            )}
          </div>

          {/* Step pill indicators — bottom center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
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
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary">
              Every account. Every market. Every time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

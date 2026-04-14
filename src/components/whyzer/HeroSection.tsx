import HeroCanvas from './HeroCanvas';
import { ChevronDown, Star } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const HeroSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const smooth = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let raf: number;

    const handleMouse = (e: MouseEvent) => {
      target.x = ((e.clientX / window.innerWidth) - 0.5) * 6;
      target.y = ((e.clientY / window.innerHeight) - 0.5) * 4;
    };

    const animate = () => {
      smooth.x = lerp(smooth.x, target.x, 0.04);
      smooth.y = lerp(smooth.y, target.y, 0.04);
      setTransform({ x: smooth.x, y: smooth.y });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouse);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        ref={wrapperRef}
        className="absolute inset-0"
        style={{
          transform: `perspective(1200px) rotateX(${-transform.y}deg) rotateY(${transform.x}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <HeroCanvas />
      </div>

      {/* Purple ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 70% at 60% 45%, rgba(67,67,168,0.28) 0%, transparent 70%)', zIndex: 1 }} />

      <div className="relative z-10 text-center px-6 max-w-[1000px] mx-auto pb-28">
        <h1 className="font-display text-[28px] sm:text-[38px] md:text-[50px] lg:text-[62px] leading-[1.2] tracking-[-0.02em] mb-5 uppercase">
          <span className="text-foreground md:whitespace-nowrap">Walk into any executive room</span>
          <br />
          <span className="bg-gradient-to-br from-[#A8A8FF] to-[#4343A8] bg-clip-text text-transparent md:whitespace-nowrap">with a narrative they didn't expect. </span>
        </h1>

        <p className="font-display text-lg md:text-xl lg:text-2xl text-foreground mb-6">
          Boardroom-ready Points of View in under 2 minutes.
        </p>

        {/* Vimeo VSL */}
        <div className="w-full max-w-[560px] mx-auto mb-6 rounded-xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(89,89,212,0.15)' }}>
          <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
            <iframe
              src="https://player.vimeo.com/video/1183165456?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Whyzer VSL 2.0"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {['SEC filings + earnings calls', '7,500+ companies', '150+ markets worldwide'].map((pill) => (
            <span key={pill} className="px-4 py-1.5 rounded-full text-sm font-mono text-primary" style={{ background: 'rgba(89,89,212,0.12)', border: '1px solid rgba(89,89,212,0.2)' }}>
              {pill}
            </span>
          ))}
        </div>

        <p className="font-body text-base md:text-lg text-text-secondary max-w-[580px] mx-auto leading-[1.7] mb-8">
          Whyzer turns public financial data into structured, executive-grade POVs so you can sell from insight, not instinct.
        </p>
        <p style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Whyzer is a financial narrative platform that turns SEC filings, earnings calls, and financial data into executive-ready Points of View for B2B sales reps.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center text-white font-bold text-lg px-8 h-14 rounded-lg hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_28px_rgba(89,89,212,0.6)] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #5959D4, #4343A8)' }}
          >
            Get Whyzer
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center border border-foreground/[0.12] text-foreground font-medium text-lg px-8 h-14 rounded-lg hover:border-foreground/[0.2] transition-all duration-200"
          >
            See How Whyzer Works →
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <ChevronDown size={20} className="text-text-tertiary animate-pulse-down" />
        <span className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary">
          Scroll to explore
        </span>
      </div>
    </section>
  );
};

export default HeroSection;

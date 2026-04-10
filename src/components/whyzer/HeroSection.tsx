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
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 70% at 60% 45%, rgba(100,67,168,0.28) 0%, transparent 70%)', zIndex: 1 }} />

      <div className="relative z-10 text-center px-6 max-w-[1000px] mx-auto pb-28">
        <p className="font-mono text-sm uppercase tracking-[0.15em] text-primary mb-6">
          Read the Financial Story. Write the Sales Story.
        </p>

        <h1 className="font-display text-[28px] sm:text-[38px] md:text-[50px] lg:text-[62px] leading-[1.1] tracking-[-0.02em] mb-6 uppercase">
          <span className="bg-gradient-to-br from-[#C4A8FF] to-[#6443A8] bg-clip-text text-transparent md:whitespace-nowrap">Walk into any executive room</span>
          <br />
          <span className="text-foreground md:whitespace-nowrap">with a narrative they didn't expect.</span>
        </h1>

        <p className="font-display text-lg md:text-xl lg:text-2xl text-foreground mb-6">
          Boardroom-ready Points of View — in under 2 minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {['SEC filings + earnings calls', '7,500+ companies', '150+ markets worldwide'].map((pill) => (
            <span key={pill} className="px-4 py-1.5 rounded-full text-sm font-mono text-primary" style={{ background: 'rgba(129,89,212,0.12)', border: '1px solid rgba(129,89,212,0.2)' }}>
              {pill}
            </span>
          ))}
        </div>

        <p className="font-body text-base md:text-lg text-text-secondary max-w-[580px] mx-auto leading-[1.7] mb-10">
          Whyzer turns public financial data into structured, executive-grade POVs — so you can sell from insight, not instinct.
        </p>
        <p style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Whyzer is a financial narrative platform that turns SEC filings, earnings calls, and financial data into executive-ready Points of View for B2B sales reps.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="https://www.whyzer.ai/#pricing"
            className="inline-flex items-center justify-center text-white font-bold text-lg px-8 h-14 rounded-lg hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_28px_rgba(129,89,212,0.6)] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #8159d4, #6443A8)' }}
          >
            Get Whyzer
          </a>
          <a
            href="https://www.whyzer.ai/#how-it-works"
            className="inline-flex items-center justify-center border border-foreground/[0.12] text-foreground font-medium text-lg px-8 h-14 rounded-lg hover:border-foreground/[0.2] transition-all duration-200"
          >
            See How Whyzer Works →
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-text-secondary text-[15px]">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-primary text-primary" />
            ))}
          </div>
          <span>Rated 4.9 by enterprise AEs</span>
          <span className="hidden sm:inline text-text-tertiary">|</span>
          <span className="hidden sm:inline">Built by Jamal Reimer, $160M+ SaaS closed · Top 0.1% Oracle Seller Globally</span>
          <span className="hidden sm:inline text-text-tertiary">|</span>
          <span className="hidden sm:inline">Used by reps closing 7- &amp; 8-figure deals</span>
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

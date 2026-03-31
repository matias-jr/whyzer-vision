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

      <div className="relative z-10 text-center px-6 max-w-[800px] mx-auto pb-28">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-6">
          AI Point of View Platform for Enterprise Sellers
        </p>

        <h1 className="font-display text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px] leading-[1.1] tracking-[-0.02em] text-foreground mb-6 uppercase">
          <span className="md:whitespace-nowrap">Read the Financial Story.</span>
          <br />
          <span className="bg-gradient-to-br from-[#C4A8FF] to-[#6443A8] bg-clip-text text-transparent">Write the Sales Story.</span>
        </h1>

        <p className="font-body text-base md:text-lg lg:text-xl text-text-secondary max-w-[680px] mx-auto leading-[1.7] mb-10">
          Turn SEC filings, earnings calls, and financial data into boardroom-ready Points of View — in minutes. Now covering 50,000+ companies globally.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center text-white font-bold text-base px-6 h-12 rounded-lg hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_28px_rgba(129,89,212,0.6)] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #8159d4, #6443A8)' }}
          >
            Start Using Whyzer Today
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center border border-foreground/[0.12] text-foreground font-medium text-base px-6 h-12 rounded-lg hover:border-foreground/[0.2] transition-all duration-200"
          >
            See How Whyzer Works →
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-text-secondary text-[13px]">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-primary text-primary" />
            ))}
          </div>
          <span>Rated 4.9 by enterprise AEs</span>
          <span className="hidden sm:inline text-text-tertiary">|</span>
          <span className="hidden sm:inline">Used by reps closing 7- & 8-figure deals</span>
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

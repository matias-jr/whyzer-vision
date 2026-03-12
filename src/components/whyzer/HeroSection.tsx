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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="relative z-10 text-center px-6 max-w-[800px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-6">
          AI Point of View Platform for Enterprise Sellers
        </p>

        <h1 className="font-display text-[40px] md:text-[56px] lg:text-[72px] leading-[1.1] tracking-[-0.02em] text-foreground mb-6 uppercase">
          Read the Financial Story.
          <br />
          <span className="bg-gradient-to-br from-[#C8C8C8] to-[#4A4A4A] bg-clip-text text-transparent">Write the Sales Story.</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-text-secondary max-w-[540px] mx-auto leading-[1.7] mb-10">
          Whyzer turns thousands of financial data points from SEC filings, earnings calls,
          and board-level sources into boardroom-ready Points of View — instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-base px-6 h-12 rounded-lg hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_20px_rgba(200,200,200,0.2)] active:scale-[0.98]"
          >
            Start Free — 3 Accounts
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center border border-foreground/[0.06] text-foreground font-medium text-base px-6 h-12 rounded-lg hover:border-foreground/[0.12] transition-all duration-200"
          >
            Watch 90-Second Demo →
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

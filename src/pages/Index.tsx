import { useEffect, useRef } from 'react';
import Navigation from '@/components/whyzer/Navigation';
import HeroSection from '@/components/whyzer/HeroSection';
import LogoBar from '@/components/whyzer/LogoBar';
import ProblemStatement from '@/components/whyzer/ProblemStatement';
import BridgeStatement from '@/components/whyzer/BridgeStatement';
import ProductShowcase from '@/components/whyzer/ProductShowcase';
import HowItWorks from '@/components/whyzer/HowItWorks';
import BentoFeatures from '@/components/whyzer/BentoFeatures';
import UseCases from '@/components/whyzer/UseCases';
import Testimonials from '@/components/whyzer/Testimonials';
import Pricing from '@/components/whyzer/Pricing';
import TheVault from '@/components/whyzer/TheVault';
import FAQ from '@/components/whyzer/FAQ';
import FinalCTA from '@/components/whyzer/FinalCTA';
import Footer from '@/components/whyzer/Footer';
import GrainOverlay from '@/components/whyzer/GrainOverlay';

const Index = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty('--banner-h', `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GrainOverlay />
      {/* Promo banner — remove this div + the useEffect above when offer expires (after July 11).
          Also revert Navigation.tsx top to 0 and HeroSection.tsx paddingTop to 64px. */}
      <div
        ref={bannerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg, #3a3a9e 0%, #5959D4 50%, #3a3a9e 100%)',
          padding: '9px 16px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: '#fff', fontSize: 13, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
          <span style={{ marginRight: 6 }}>🇺🇸</span>
          Happy 4th of July. Through July 11, your first month of Whyzer Elite is{' '}
          <strong>$10</strong> (reg. $97) with code{' '}
          <span style={{
            fontFamily: '\'JetBrains Mono\', monospace',
            background: 'rgba(255,255,255,0.18)',
            padding: '1px 7px',
            borderRadius: 4,
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}>WHYZER10</span>.
        </p>
      </div>
      <Navigation />
      <HeroSection />
      <LogoBar />
      <ProblemStatement />
      <BridgeStatement />
      <ProductShowcase />
      <HowItWorks />
      <BentoFeatures />
      <UseCases />
      <Testimonials />
      <Pricing />
      <TheVault />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;

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
  return (
    <div className="min-h-screen bg-background">
      <GrainOverlay />
      <div style={{
        background: 'linear-gradient(90deg, #3a3a9e 0%, #5959D4 50%, #3a3a9e 100%)',
        padding: '9px 16px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 50,
      }}>
        <p style={{ margin: 0, color: '#fff', fontSize: 13.5, fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>
          <span style={{ marginRight: 6 }}>🇺🇸</span>
          Happy 4th of July — only through July 11, your first month of Whyzer Elite is{' '}
          <strong>$10</strong> with code{' '}
          <span style={{
            fontFamily: '\'JetBrains Mono\', monospace',
            background: 'rgba(255,255,255,0.18)',
            padding: '1px 7px',
            borderRadius: 4,
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}>WHYZER10</span>{' '}
          at checkout.
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

import Navigation from '@/components/whyzer/Navigation';
import HeroSection from '@/components/whyzer/HeroSection';
import LogoBar from '@/components/whyzer/LogoBar';
import ProblemStatement from '@/components/whyzer/ProblemStatement';
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
      <Navigation />
      <HeroSection />
      <LogoBar />
      <ProblemStatement />
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

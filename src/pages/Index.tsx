import { Head } from 'vite-react-ssg';
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
import ExitIntentModal from '@/components/whyzer/ExitIntentModal';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Homepage metadata. These used to live in index.html, but a static head
          applied them to every prerendered route, which is what made LinkedIn
          treat deep links as the homepage. Each route now declares its own. */}
      <Head>
        <title>Whyzer: The Financial Narrative Platform for B2B Sales</title>
        <link rel="canonical" href="https://www.whyzer.ai" />
        <meta property="og:url" content="https://www.whyzer.ai" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Whyzer: The Financial Narrative Platform for B2B Sales" />
        <meta
          property="og:description"
          content="Turn SEC filings and earnings calls into boardroom-ready Points of View in under 2 minutes. Built by Jamal Reimer, $160M+ SaaS closed."
        />
        <meta
          name="description"
          content="Whyzer is a financial narrative platform that turns SEC filings, earnings calls, and financial data into boardroom-ready Points of View for B2B sales reps. Covering 8,500+ public and private companies globally. From $57/month."
        />
      </Head>
      <GrainOverlay />
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
      <ExitIntentModal />
    </div>
  );
};

export default Index;

import { useScrollReveal } from '@/hooks/useScrollReveal';

const FinalCTA = () => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: '#0A0A0A',
        backgroundImage: 'radial-gradient(ellipse 90% 90% at 100% 100%, rgba(40,24,73,1) 0%, rgba(100,67,168,0.35) 40%, transparent 65%)',
      }}
    >
      <div className="max-w-[640px] mx-auto text-center">
        <h2 className="font-display text-[1.9rem] md:text-[2.5rem] text-foreground leading-[1.2] tracking-[-0.02em] mb-6 uppercase">
          Someone's getting to your CFO this week. <span className="text-primary">Make it you.</span>
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed mb-10">
          Join the Whyzer Community. Show up to every executive meeting with a financial narrative that moves the deal, not a product pitch that gets you delegated down.
        </p>
        <a
          href="https://www.whyzer.ai/#pricing"
          className="inline-flex items-center justify-center text-white font-bold text-lg px-8 h-14 rounded-lg hover:brightness-110 hover:shadow-[0_0_36px_rgba(129,89,212,0.6)] active:scale-[0.98] transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #8159d4, #6443A8)' }}
        >
          Get Whyzer
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;

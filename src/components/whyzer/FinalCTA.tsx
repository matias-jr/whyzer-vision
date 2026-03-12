import { useScrollReveal } from '@/hooks/useScrollReveal';

const FinalCTA = () => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(200,200,200,0.04) 0%, #1e1e1e 60%)',
      }}
    >
      <div className="max-w-[640px] mx-auto text-center">
        <h2 className="font-display text-4xl md:text-[52px] text-foreground leading-[1.15] tracking-[-0.02em] mb-6 uppercase">
          Stop Researching. Start Commanding.
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed mb-10">
          Join the AEs who show up to executive meetings with a boardroom-ready Point of View — not a product pitch.
        </p>
        <a
          href="#pricing"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg px-8 h-14 rounded-lg hover:brightness-110 hover:shadow-[0_0_24px_rgba(200,200,200,0.2)] active:scale-[0.98] transition-all duration-200"
        >
          Start Free — 3 Accounts Included
        </a>
        <p className="text-text-secondary text-[13px] mt-5">
          No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;

import { useScrollReveal } from '@/hooks/useScrollReveal';

const FinalCTA = () => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 px-6 lg:px-12"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, hsl(240 20% 5%) 60%)',
      }}
    >
      <div className="max-w-[640px] mx-auto text-center">
        <h2 className="font-display italic text-4xl md:text-[52px] text-foreground leading-[1.15] tracking-[-0.03em] mb-6">
          Stop Researching. Start Commanding.
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed mb-10">
          Join the AEs who show up to executive meetings with a boardroom-ready Point of View — not a product pitch.
        </p>
        <a
          href="#pricing"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg px-8 h-14 rounded-lg hover:brightness-110 hover:shadow-[0_0_24px_rgba(201,168,76,0.4)] active:scale-[0.98] transition-all duration-200"
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

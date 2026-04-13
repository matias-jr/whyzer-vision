import { useScrollReveal } from '@/hooks/useScrollReveal';

const BridgeStatement = () => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="py-28 lg:py-40 px-6 lg:px-12 relative overflow-hidden"
      style={{
        background: '#080808',
        backgroundImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(40,24,73,0.7) 0%, rgba(67,67,168,0.1) 45%, transparent 70%)',
      }}
    >
      {/* Faint horizontal rule top */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(89,89,212,0.3), transparent)' }} />
      {/* Faint horizontal rule bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(89,89,212,0.3), transparent)' }} />

      <div className="max-w-[980px] mx-auto text-center relative">
        <p className="font-display text-[1.5rem] sm:text-[1.9rem] md:text-[2.4rem] lg:text-[3rem] text-foreground leading-[1.35] tracking-[-0.02em] uppercase">
          Anyone can find the data.<br />
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #A8A8FF, #5959D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Whyzer turns it into a conversation no other seller is having.
          </span>
        </p>
      </div>
    </section>
  );
};

export default BridgeStatement;

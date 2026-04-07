import { useScrollReveal } from '@/hooks/useScrollReveal';

const BridgeStatement = () => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="py-28 lg:py-40 px-6 lg:px-12 relative overflow-hidden"
      style={{
        background: '#080808',
        backgroundImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(40,24,73,0.7) 0%, rgba(100,67,168,0.1) 45%, transparent 70%)',
      }}
    >
      {/* Faint horizontal rule top */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(129,89,212,0.3), transparent)' }} />
      {/* Faint horizontal rule bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(129,89,212,0.3), transparent)' }} />

      <div className="max-w-[980px] mx-auto text-center relative">
        <p className="font-display text-[1.75rem] sm:text-[2.25rem] md:text-[2.9rem] lg:text-[3.5rem] text-foreground leading-[1.3] tracking-[-0.02em] uppercase">
          Anyone can find the data.{' '}
          <span className="text-primary">Whyzer tells you what it means</span>
          {' '}— and gives you the story{' '}
          <span
            className="relative inline-block"
            style={{
              backgroundImage: 'linear-gradient(135deg, #C4A8FF, #8159d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            99% of sellers could never construct on their own.
          </span>
        </p>
      </div>
    </section>
  );
};

export default BridgeStatement;

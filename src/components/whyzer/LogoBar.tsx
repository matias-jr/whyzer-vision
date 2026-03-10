import { useScrollReveal } from '@/hooks/useScrollReveal';

const logos = ['MSFT', 'ORCL', 'SAP', 'SFDC', 'DBRX', 'SNOW'];

const LogoBar = () => {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="border-y border-foreground/[0.04] py-6 overflow-hidden"
      style={{ background: 'hsl(240 20% 5%)' }}
    >
      <div className="flex items-center gap-8 mb-0">
        <span className="text-text-secondary text-sm whitespace-nowrap pl-6 lg:pl-12">
          Trusted by AEs at
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee flex gap-16 whitespace-nowrap">
            {[...logos, ...logos].map((logo, i) => (
              <span
                key={i}
                className="font-mono text-text-tertiary text-lg tracking-widest"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoBar;

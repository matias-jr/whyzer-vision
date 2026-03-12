import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'The Vault', href: '#vault' },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
          scrolled ? 'border-b border-foreground/[0.06]' : ''
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          background: 'rgba(30,30,30,0.85)',
        }}
      >
        <a href="#" className="flex items-center">
          <img
            src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
            alt="Whyzer"
            className="h-8"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden font-display text-2xl text-foreground">
            Whyzer<span className="text-primary">.</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="text-sm text-foreground hover:text-primary transition-colors duration-200">
            Log In
          </a>
          <a
            href="#pricing"
            className="text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:brightness-110 transition-all duration-200"
          >
            Start Free
          </a>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: 'rgba(30,30,30,0.97)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-2xl text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            className="text-lg text-text-secondary hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </a>
          <a
            href="#pricing"
            className="text-lg font-bold bg-primary text-primary-foreground px-8 py-3 rounded-md"
            onClick={() => setMobileOpen(false)}
          >
            Start Free
          </a>
        </div>
      )}
    </>
  );
};

export default Navigation;

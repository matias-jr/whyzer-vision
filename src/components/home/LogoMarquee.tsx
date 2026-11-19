import { LOGOS } from './logos';

/**
 * The scrolling customer-logo strip from the home page ("Used by sellers at").
 * Pure markup: the page that renders it supplies the .logo-marquee styles
 * (see bf26-sales.css). Duplicated once so the loop is seamless; the copy is aria-hidden.
 */
const LogoMarquee = () => (
  <div className="logo-marquee">
    <div className="logo-marquee-track">
      {[...LOGOS, ...LOGOS].map((l, i) => (
        <img
          key={i}
          src={l.src}
          alt={i < LOGOS.length ? l.name : ''}
          aria-hidden={i >= LOGOS.length ? true : undefined}
          height={l.h ?? 26}
          decoding="async"
          style={{ height: `${l.h ?? 26}px`, width: 'auto' }}
        />
      ))}
    </div>
  </div>
);

export default LogoMarquee;

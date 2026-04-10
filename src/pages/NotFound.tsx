import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#0a0a09' }}
    >
      {/* Wordmark */}
      <p className="font-display text-[13px] uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Whyzer.
      </p>

      {/* Error label */}
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: '#8159d4' }}>
        Error 404
      </p>

      {/* Giant 404 */}
      <div
        className="font-display leading-none select-none mb-8"
        style={{
          fontSize: 'clamp(120px, 22vw, 200px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.10)',
        }}
      >
        404
      </div>

      {/* Headline */}
      <h1
        className="font-display text-3xl md:text-[2rem] uppercase mb-5"
        style={{ color: 'rgba(255,255,255,0.9)' }}
      >
        This page doesn't have a POV.
      </h1>

      {/* Subtext */}
      <p className="text-[15px] leading-[1.7] mb-10 max-w-[400px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
        The page you're looking for has moved, been removed,
        or never existed. Let's get you back to the boardroom.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110"
          style={{ background: 'rgba(129,89,212,0.85)', color: '#fff' }}
        >
          Back to home →
        </a>
        <a
          href="https://app.whyzer.ai/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Open the app →
        </a>
        <a
          href="https://members.whyzer.ai/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Members area →
        </a>
      </div>

      {/* Footer stamp */}
      <p className="font-mono text-[11px] tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
        WHYZER.AI
      </p>
    </div>
  );
};

export default NotFound;

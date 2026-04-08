import { useEffect } from 'react';
import GrainOverlay from '@/components/whyzer/GrainOverlay';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';
import { Zap, Eye, BookOpen } from 'lucide-react';

const valueProps = [
  {
    icon: Eye,
    label: 'How your customers are using AI to learn about you',
    description: 'Buyers are running deep AI-powered research on your company, your competitors, and your weaknesses before you even get on a call. We surface what they\'re finding — so you walk in prepared, not surprised.',
  },
  {
    icon: Zap,
    label: 'How to use AI in your own selling',
    description: 'Not generic prompts. Real techniques that strategic sellers are using right now to run better discovery, craft sharper proposals, and close faster — tailored to B2B enterprise deals.',
  },
  {
    icon: BookOpen,
    label: 'How your company could use AI',
    description: 'The sellers who win aren\'t just better at pitching — they understand where AI fits in their buyer\'s world. We help you spot those moments and turn them into conversations that unlock new value.',
  },
];

const Newsletter = () => {
  const cardsRef = useStaggerReveal(valueProps.length, 120);
  const proofRef = useScrollReveal(0.2);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // LinkedIn conversion tracking for the GHL-embedded newsletter form.
  // Because the submit button lives inside a cross-origin iframe we can't
  // attach a click handler directly. GHL's embed script broadcasts a
  // postMessage to the parent window when the form is submitted — we listen
  // for that here and fire the LinkedIn event tracker.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages that originate from GHL / msgsndr domains.
      if (
        typeof event.origin === 'string' &&
        !event.origin.includes('msgsndr.com') &&
        !event.origin.includes('gohighlevel.com') &&
        !event.origin.includes('leadconnectorhq.com')
      ) return;

      const data = event.data;
      if (!data) return;

      // GHL can send the payload as a string or object depending on version.
      const payload = typeof data === 'string' ? (() => { try { return JSON.parse(data); } catch { return {}; } })() : data;

      const isSubmit =
        payload?.type === 'form_submitted' ||
        payload?.event === 'form_submitted' ||
        payload?.type === 'submit' ||
        payload?.action === 'submit' ||
        (typeof payload?.message === 'string' && payload.message.toLowerCase().includes('submit'));

      if (isSubmit) {
        // Client-side Insight Tag event
        if (typeof (window as any).lintrk === 'function') {
          (window as any).lintrk('track', { conversion_id: 27310609 });
        }
        // Server-side CAPI event (newsletter subscription)
        const match = document.cookie.split('; ').find(row => row.startsWith('li_fat_id='));
        const li_fat_id = match ? match.split('=')[1] : null;
        if (li_fat_id) {
          fetch('/api/track-newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ li_fat_id }),
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ── Keyframe definitions ── */}
      <style>{`
        @keyframes nl-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nl-orb-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(60px, -40px) scale(1.08); }
          70%       { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes nl-orb-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          35%       { transform: translate(-50px, 50px) scale(1.06); }
          65%       { transform: translate(40px, -20px) scale(0.97); }
        }
        @keyframes nl-orb-drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, 60px) scale(1.04); }
        }
        @keyframes nl-glow-pulse {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(200,200,200,0); }
          50%       { box-shadow: 0 0 40px 2px rgba(200,200,200,0.07); }
        }
        @keyframes nl-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes nl-cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes nl-scan {
          0%   { transform: translateX(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        .nl-fade-up-1 { animation: nl-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .nl-fade-up-2 { animation: nl-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .nl-fade-up-3 { animation: nl-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .nl-fade-up-4 { animation: nl-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .nl-fade-up-5 { animation: nl-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s both; }

        .nl-logo   { animation: nl-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both; }

        .nl-orb-a  { animation: nl-orb-drift-a 18s ease-in-out infinite; }
        .nl-orb-b  { animation: nl-orb-drift-b 22s ease-in-out infinite; }
        .nl-orb-c  { animation: nl-orb-drift-c 26s ease-in-out infinite; }

        .nl-form-wrap { animation: nl-glow-pulse 4s ease-in-out infinite 1.2s; }

        .nl-overline-cursor::after {
          content: '|';
          margin-left: 2px;
          animation: nl-cursor-blink 1.1s step-end infinite;
        }

        .nl-card-shimmer {
          position: relative;
          overflow: hidden;
        }
        .nl-card-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .nl-card-shimmer:hover::after {
          opacity: 1;
          animation: nl-scan 0.6s ease-in-out forwards;
        }
      `}</style>

      <GrainOverlay />

      {/* ── Background orbs ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="nl-orb-a absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, rgba(180,180,180,0.055) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="nl-orb-b absolute rounded-full"
          style={{
            width: 500, height: 500,
            top: '20%', right: '-8%',
            background: 'radial-gradient(circle, rgba(160,160,160,0.04) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="nl-orb-c absolute rounded-full"
          style={{
            width: 400, height: 400,
            bottom: '10%', left: '30%',
            background: 'radial-gradient(circle, rgba(200,200,200,0.03) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* ── Logo ── */}
      <header className="nl-logo relative flex justify-center pt-10 pb-4" style={{ zIndex: 1 }}>
        <a href="/" className="opacity-90 hover:opacity-100 transition-opacity duration-200">
          <img
            src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
            alt="Whyzer"
            className="h-8"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <span className="hidden font-display text-2xl text-foreground">
            Whyzer<span className="text-primary">.</span>
          </span>
        </a>
      </header>

      {/* ── Hero + Form ── */}
      <section
        className="relative flex flex-col items-center px-6 lg:px-12 pt-12 pb-20"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse at 50% -10%, rgba(200,200,200,0.09) 0%, transparent 60%)',
        }}
      >
        {/* Overline */}
        <p className="nl-fade-up-1 nl-overline-cursor font-mono-brand text-xs uppercase tracking-[0.2em] text-primary mb-6">
          Join the Newsletter Strategic Sellers are using to level up in the AI world
        </p>

        {/* Headline */}
        <h1 className="nl-fade-up-2 font-display text-center text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.02em] mb-6 text-white">
          AI Secrets for<br />Strategic Sellers
        </h1>

        {/* Subhead */}
        <p
          className="nl-fade-up-3 font-body text-lg leading-[1.7] text-center max-w-[560px] mb-12"
          style={{
            background: 'linear-gradient(135deg, #C8C8C8 0%, #EFEFEF 45%, #7A7A7A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Buyers are using AI in ways most sellers can't imagine. Reps get drowned in daily AI updates not knowing where to start. Every week, we close that gap — you'll receive curated AI insights that apply directly to your deals, not to AI in general.
        </p>

        {/* Form */}
        <div
          className="nl-fade-up-4 nl-form-wrap w-full max-w-[520px] rounded-xl overflow-hidden border border-foreground/[0.08]"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <iframe
            src="https://link.msgsndr.com/widget/form/DbN0tSSpu40MR5JB2Zbc"
            style={{ width: '100%', height: '356px', border: 'none', borderRadius: '12px' }}
            id="inline-DbN0tSSpu40MR5JB2Zbc"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="AI Newsletter Subscription – Whyzer"
            data-height="356"
            data-layout-iframe-id="inline-DbN0tSSpu40MR5JB2Zbc"
            data-form-id="DbN0tSSpu40MR5JB2Zbc"
            title="AI Newsletter Subscription – Whyzer"
          />
        </div>

        <p className="nl-fade-up-5 font-mono-brand text-[11px] text-text-tertiary mt-4 tracking-wide">
          No spam. No tools to set up. Unsubscribe anytime.
        </p>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-foreground/[0.06] mx-6 lg:mx-12" style={{ zIndex: 1, position: 'relative' }} />

      {/* ── Value Props ── */}
      <section className="py-20 px-6 lg:px-12" style={{ zIndex: 1, position: 'relative' }}>
        <div className="max-w-[1200px] mx-auto mb-10 text-center">
          <p className="font-mono-brand text-xs uppercase tracking-[0.2em] text-primary mb-3">Weekly AI nuggets to surface</p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {valueProps.map((prop, i) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.label}
                ref={cardsRef(i)}
                className="nl-card-shimmer p-8 rounded-xl border border-foreground/[0.06] bg-background-secondary hover:border-foreground/[0.14] transition-all duration-300"
                style={{ transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center mb-5"
                  style={{ background: 'rgba(200,200,200,0.07)' }}
                >
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-lg tracking-wide text-foreground mb-2">
                  {prop.label}
                </h3>
                <p className="font-body text-sm text-text-secondary leading-[1.7]">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="pb-20 px-6 lg:px-12" style={{ zIndex: 1, position: 'relative' }}>
        <div
          ref={proofRef}
          className="max-w-[1200px] mx-auto flex flex-col items-center gap-6 border-t border-foreground/[0.06] pt-12"
        >
          <p className="font-mono-brand text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Built for sellers navigating a world where buyers are already AI-native
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {['Enterprise AEs', 'Strategic Account Managers', 'Revenue Leaders', 'Solution Engineers'].map((role) => (
              <span key={role} className="font-body text-sm text-text-secondary hover:text-foreground transition-colors duration-200">
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Newsletter;

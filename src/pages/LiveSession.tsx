import { useState, useEffect } from 'react';
import GrainOverlay from '@/components/whyzer/GrainOverlay';

// April 21, 2026 12:00 PM EST = 17:00 UTC
const SESSION_DATE = new Date('2026-04-21T17:00:00Z');

function useCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, SESSION_DATE.getTime() - Date.now());
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const pad = (n: number) => String(n).padStart(2, '0');

const MinimalNav = () => (
  <nav
    className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-center px-6"
    style={{
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      background: 'rgba(10,10,10,0.85)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <a href="#hero">
      <img
        src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
        alt="Whyzer"
        className="h-7"
      />
    </a>
  </nav>
);

const UrgencyStrip = () => (
  <div className="relative overflow-hidden" style={{ background: '#8159d4', padding: '6px 0' }}>
    <div style={{ transform: 'rotate(-1.2deg)', padding: '10px 0' }}>
      <div className="animate-marquee flex whitespace-nowrap">
        {Array(10).fill(null).map((_, i) => (
          <span key={i} className="font-display text-white text-sm tracking-[0.28em] px-10 flex-shrink-0">
            MASTER THE NUMBERS. ENGINEER THE DEAL. CLOSE BIGGER. ✦
          </span>
        ))}
      </div>
    </div>
  </div>
);

const MinimalFooter = () => (
  <footer
    className="py-12 px-6 text-center border-t border-foreground/[0.06]"
    style={{ background: '#080808' }}
  >
    <img
      src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
      alt="Whyzer"
      className="h-6 mx-auto mb-4 opacity-70"
    />
    <p className="font-mono text-xs text-text-tertiary tracking-wide">
      © 2026 Whyzer · Founded by Jamal Reimer, strategic seller &amp; author of Mega Deal Secrets
    </p>
  </footer>
);

const CtaButton = ({ children, large = false }: { children: React.ReactNode; large?: boolean }) => (
  <a
    href="#hero"
    className={`inline-flex items-center justify-center text-white font-display font-semibold uppercase tracking-[0.14em] rounded-lg hover:brightness-110 transition-all duration-200 active:scale-[0.98] ${large ? 'px-12 h-16 text-base' : 'px-8 h-13 text-sm'}`}
    style={{
      background: 'linear-gradient(135deg, #8159d4, #6443A8)',
      boxShadow: '0 4px 24px rgba(100,67,168,0.3)',
      height: large ? '64px' : '52px',
      lineHeight: 1,
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(129,89,212,0.55), 0 4px 24px rgba(100,67,168,0.4)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(100,67,168,0.3)'; }}
  >
    {children}
  </a>
);

const workflows = [
  {
    num: '01',
    title: 'Deep Account Research in Minutes, Not Days',
    body: "How to use AI to extract the financial story behind your target accounts — from earnings calls, SEC filings, and market signals — so you walk into every meeting more informed than your buyer's own team.",
  },
  {
    num: '02',
    title: 'Building a Boardroom-Ready Point of View',
    body: 'How top strategic sellers use AI to transform raw account intel into a compelling POV that resonates with CFOs and executive buyers — not just operational stakeholders.',
  },
  {
    num: '03',
    title: 'Sharpening Your Discovery with AI',
    body: 'How to generate smarter, more strategic discovery questions tailored to each account — so you uncover the real blockers, budget dynamics, and urgency behind every deal.',
  },
  {
    num: '04',
    title: 'Role-Playing Your Way to Executive Conversations',
    body: 'How to use AI as a sparring partner before high-stakes meetings — simulating executive objections, refining your narrative, and walking in confident.',
  },
  {
    num: '05',
    title: 'Creating Sales Assets at the Speed of the Deal',
    body: 'How AI can help you build follow-up decks, leave-behinds, and proposals faster — without sacrificing the quality and financial precision that moves enterprise deals forward.',
  },
];

const walkAwayPoints = [
  'A clear map of 5 AI workflows you can implement immediately in your current deals — no technical expertise required.',
  'Live examples of each workflow in action, walked through in real time.',
  'A practical next step: one workflow you can apply to one of your top accounts within 24 hours of leaving this session.',
  'A framework for using AI to systematically close larger deals — not a one-shot tactic that expires when the tool gets old.',
];

const whoItems = [
  'An Account Executive or Senior AE working deals that take months to close and involve multiple stakeholders, including executives and CFOs.',
  'A Strategic Account Manager managing large, high-value accounts where depth of insight is your competitive edge.',
  'An independent seller or consultant who needs to punch above their weight in competitive enterprise deals without a large support team.',
  "Someone who already uses AI for basic tasks (email writing, research) but suspects there's a much deeper level you haven't tapped yet.",
  'A seller who has heard "we went with someone else" one too many times — and is ready to show up differently.',
];

const LiveSession = () => {
  const t = useCountdown();

  return (
    <div className="min-h-screen bg-background">
      <GrainOverlay />
      <MinimalNav />

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative pt-16 min-h-screen flex items-center overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 25% 55%, rgba(100,67,168,0.24) 0%, transparent 65%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 45% at 80% 75%, rgba(100,67,168,0.1) 0%, transparent 60%)' }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy + countdown */}
          <div>
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-primary" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
                Free Live Webinar
              </span>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-6">
              April 21 · 12PM EST · Live on Whyzer
            </p>

            <h1 className="font-display text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.0] tracking-[-0.02em] text-foreground uppercase mb-7">
              The Strategic
              <br />
              <span className="bg-gradient-to-br from-[#C4A8FF] to-[#6443A8] bg-clip-text text-transparent">
                Seller's AI Stack
              </span>
            </h1>

            <p className="font-body text-lg text-text-secondary italic leading-relaxed mb-5 max-w-[500px]">
              "Most sellers use AI for emails. Elite sellers use AI to engineer the deal."
            </p>

            <p className="font-body text-[15px] text-text-secondary leading-[1.8] mb-12 max-w-[500px]">
              Stop treating AI as a tactical tool for one task. Learn the five integrated workflows
              that separate elite sellers from the rest — the ones who systematically embed AI across
              all stages of the buying cycle to engineer bigger deals at scale.
            </p>

            {/* Countdown */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-tertiary mb-5">
                Session Starts In
              </p>
              <div className="flex items-end gap-6">
                {[
                  { val: t.days, label: 'Days' },
                  { val: t.hours, label: 'Hours' },
                  { val: t.minutes, label: 'Min' },
                  { val: t.seconds, label: 'Sec' },
                ].map(({ val, label }, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span
                      className="font-mono text-[52px] sm:text-[60px] leading-none font-bold"
                      style={{ color: '#C4A8FF' }}
                    >
                      {pad(val)}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-tertiary mt-2">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="flex flex-col gap-5">
            <div
              className="glass-card shadow-diffuse rounded-2xl relative overflow-hidden"
              style={{ minHeight: 340 }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(129,89,212,0.55), transparent)' }}
              />
              <div
                className="flex flex-col items-center justify-center p-10 text-center"
                style={{ minHeight: 340 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(129,89,212,0.12)', border: '1px solid rgba(129,89,212,0.25)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#8159d4" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="9" cy="7" r="4" stroke="#8159d4" strokeWidth="1.5"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#8159d4" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                  Registration Form
                </p>
                <p className="text-text-tertiary text-xs leading-relaxed max-w-[200px]">
                  [WebinarKit form embed — register for your free seat here]
                </p>
              </div>
            </div>
            <p className="text-center font-mono text-[11px] text-text-tertiary tracking-wide leading-relaxed">
              5 workflows. 60 minutes. One session that changes how you sell.
            </p>
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[680px] mx-auto px-6 text-center mb-14">
          <p className="font-body text-[15px] text-text-secondary leading-[1.85]">
            Most sellers are using AI to write emails. Elite sellers are using it to engineer deals.
            In this free live session, Jamal Reimer —{' '}
            <span className="text-foreground font-semibold">
              who has personally closed $160M as an individual contributor
            </span>{' '}
            — breaks down the exact AI workflows that separate average reps from the ones closing
            7- and 8-figure deals in 2026.
          </p>
        </div>
        <div className="overflow-hidden">
          <div className="animate-marquee flex items-center gap-0 whitespace-nowrap">
            {['AWS', 'IBM', 'ORACLE', 'SALESFORCE', 'SAP', 'MICROSOFT', 'AWS', 'IBM', 'ORACLE', 'SALESFORCE', 'SAP', 'MICROSOFT'].map(
              (logo, i) => (
                <span
                  key={i}
                  className="font-display text-xl uppercase tracking-[0.2em] flex-shrink-0 px-10"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  {logo}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ── */}
      <section
        className="py-28 px-6 lg:px-12 relative"
        style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 100% 50%, rgba(40,24,73,0.5) 0%, transparent 65%)' }}
        />
        <div className="max-w-[1000px] mx-auto relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-4">
            What You'll Learn
          </p>
          <h2 className="font-display text-[36px] md:text-[48px] text-foreground uppercase tracking-[-0.02em] mb-4">
            5 Workflows.{' '}
            <span className="text-primary">One Engineered Deal.</span>
          </h2>
          <p className="font-body text-[15px] text-text-secondary max-w-[520px] leading-[1.8] mb-16">
            Each workflow builds on the last. By the end, you won't just know what elite sellers
            do — you'll understand the system behind it.
          </p>

          <div className="mb-12 space-y-0">
            {workflows.map((w, i) => (
              <div
                key={i}
                className="group flex gap-8 py-8 border-b border-foreground/[0.06] hover:border-primary/[0.18] transition-colors duration-300 cursor-default"
              >
                <span
                  className="font-mono text-2xl font-bold flex-shrink-0 leading-none mt-1"
                  style={{ color: '#8159d4' }}
                >
                  {w.num}
                </span>
                <div>
                  <h3 className="font-display text-[19px] text-foreground uppercase tracking-wide mb-3 group-hover:text-primary transition-colors duration-300">
                    {w.title}
                  </h3>
                  <p className="font-body text-sm text-text-secondary leading-[1.8]">{w.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus */}
          <div
            className="rounded-2xl p-8 mb-12 relative overflow-hidden"
            style={{ background: 'rgba(129,89,212,0.07)', border: '1px solid rgba(129,89,212,0.22)' }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(129,89,212,0.65), transparent)' }}
            />
            <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
              <div className="flex-shrink-0">
                <span
                  className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-3"
                  style={{ background: 'rgba(129,89,212,0.15)', border: '1px solid rgba(129,89,212,0.35)', color: '#C4A8FF' }}
                >
                  Exclusive Bonus
                </span>
              </div>
              <div>
                <h3 className="font-display text-[20px] text-foreground uppercase mb-3">
                  The Tool Comparison: What Actually Works
                </h3>
                <p className="font-body text-sm text-text-secondary leading-[1.8]">
                  A candid breakdown of what the market offers (ChatGPT, generic LLMs, enterprise
                  platforms) vs. what strategic sellers actually need — and why most tools weren't
                  built for the complexity of mid-to-large deals.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <CtaButton>Secure My Free Seat →</CtaButton>
          </div>
        </div>
      </section>

      {/* ── WALK AWAY WITH ── */}
      <section
        className="py-28 px-6 lg:px-12"
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-4">
              What You'll Walk Away With
            </p>
            <h2 className="font-display text-[36px] md:text-[48px] text-foreground uppercase tracking-[-0.02em] mb-5">
              Not Prompts.
              <br />
              <span className="text-primary">A Framework.</span>
            </h2>
            <p className="font-body text-[15px] text-text-secondary leading-[1.8] max-w-[380px]">
              You won't leave this session with a list of tips. You'll leave with a repeatable system
              to use AI to engineer bigger deals over and over again.
            </p>
          </div>
          <div>
            <div className="space-y-0 mb-12">
              {walkAwayPoints.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 py-6 border-b border-foreground/[0.06]"
                >
                  <span
                    className="font-display text-xl flex-shrink-0 mt-0.5"
                    style={{ color: '#8159d4' }}
                  >
                    →
                  </span>
                  <p className="font-body text-[15px] text-text-secondary leading-[1.8]">{item}</p>
                </div>
              ))}
            </div>
            <CtaButton>Save My Free Seat →</CtaButton>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section
        className="py-28 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(40,24,73,0.55) 0%, transparent 60%)' }}
        />
        <div className="max-w-[800px] mx-auto relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-4">
            Who This Is For
          </p>
          <h2 className="font-display text-[36px] md:text-[48px] text-foreground uppercase tracking-[-0.02em] mb-5">
            Built for Enterprise Sellers.
            <br />
            <span className="text-primary">Not Managers. Not Teams.</span>
          </h2>
          <p className="font-body text-[15px] text-text-secondary leading-[1.8] mb-14 max-w-[540px]">
            This session is built for individual enterprise sellers navigating complex, mid-to-large
            deals. You'll get the most out of this if you are:
          </p>

          <div className="space-y-0 mb-14">
            {whoItems.map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-5 py-5 border-b border-foreground/[0.06] hover:border-primary/[0.15] transition-colors cursor-default"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300"
                  style={{
                    background: 'rgba(129,89,212,0.12)',
                    border: '1px solid rgba(129,89,212,0.28)',
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5l3.5 3.5L11 1"
                      stroke="#8159d4"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-body text-[15px] text-text-secondary leading-[1.8] group-hover:text-foreground/80 transition-colors duration-300">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <CtaButton>I'm In — Register for Free →</CtaButton>
          </div>
        </div>
      </section>

      {/* ── ABOUT JAMAL ── */}
      <section
        className="py-28 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Photo placeholder */}
          <div className="relative order-2 lg:order-1">
            <div
              className="absolute inset-0 scale-110"
              style={{ background: 'radial-gradient(ellipse at center, rgba(100,67,168,0.3) 0%, transparent 70%)' }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '3/4',
                background: 'linear-gradient(160deg, #1a1228 0%, #0d0b14 50%, #0a0a0a 100%)',
                border: '1px solid rgba(129,89,212,0.14)',
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div
                  className="w-24 h-24 rounded-full"
                  style={{ background: 'rgba(129,89,212,0.18)', border: '2px solid rgba(129,89,212,0.28)' }}
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                  Jamal Reimer
                </p>
              </div>
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.65) 0%, transparent 55%)' }}
              />
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-4">
              Your Host
            </p>
            <h2 className="font-display text-[52px] text-foreground uppercase tracking-[-0.02em] mb-8">
              Jamal Reimer
            </h2>

            <div className="space-y-5 mb-10">
              {[
                "Jamal Reimer is one of the few enterprise sales mentors who has actually done it at scale. As an individual contributor, he has closed over $160M in enterprise deals — including multiple transactions exceeding $50M. He is the author of Mega Deal Secrets, a playbook used by sellers at companies like Oracle, SAP, Salesforce, IBM, and AWS.",
                "After two decades in the field, Jamal built Whyzer — an AI platform designed from the ground up for the specific complexity of mid-to-large enterprise deals. Not for teams. Not for managers. For the individual seller who has to walk into a CFO's office and earn their trust in under 30 minutes.",
                "His sessions aren't theory. Everything taught comes from deals he has personally run, lost, and closed at the highest levels of enterprise sales.",
              ].map((para, i) => (
                <p key={i} className="font-body text-[15px] text-text-secondary leading-[1.85]">
                  {para}
                </p>
              ))}
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-6 py-8 mb-10"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[
                { val: '$160M+', label: 'closed as an individual contributor' },
                { val: '$50M+', label: 'largest single deal closed' },
                { val: '10,000+', label: 'enterprise sellers trained globally' },
              ].map((s, i) => (
                <div key={i}>
                  <span
                    className="font-mono text-2xl font-bold block mb-1.5"
                    style={{ color: '#C4A8FF' }}
                  >
                    {s.val}
                  </span>
                  <span className="font-body text-[11px] text-text-tertiary leading-tight">{s.label}</span>
                </div>
              ))}
            </div>

            <CtaButton>Join the Free Session →</CtaButton>
          </div>
        </div>
      </section>

      {/* ── URGENCY STRIP ── */}
      <UrgencyStrip />

      {/* ── CLOSING CTA ── */}
      <section
        className="py-36 px-6 text-center relative overflow-hidden"
        style={{ background: '#0A0A0A' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(100,67,168,0.14) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-[640px] mx-auto">
          <h2 className="font-display text-[48px] md:text-[60px] text-foreground uppercase tracking-[-0.02em] leading-[1.05] mb-6">
            Seats Are Limited.
            <br />
            <span className="text-primary">Don't Miss Out.</span>
          </h2>
          <p className="font-body text-[15px] text-text-secondary leading-[1.8] mb-12 max-w-[420px] mx-auto">
            This session is capped to stay interactive. Seats lock when the room fills — be there
            on time.
          </p>
          <CtaButton large>Claim My Free Seat →</CtaButton>
          <p className="font-mono text-[11px] text-text-tertiary mt-7 tracking-wide">
            April 21 · 12PM EST · Hosted on Whyzer
          </p>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
};

export default LiveSession;

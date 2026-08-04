import { useState, useEffect } from 'react';
import GrainOverlay from '@/components/whyzer/GrainOverlay';
import { getNextSessionAt } from '@/lib/siteConfig';

// Fast initial paint; replaced by the value from site_config once it loads.
// August 26, 2026 12:00 PM ET (EDT, UTC-4) = 16:00 UTC
const FALLBACK_SESSION_DATE = new Date('2026-08-26T16:00:00Z');

function useCountdown() {
  const [target, setTarget] = useState<Date>(FALLBACK_SESSION_DATE);
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Pull the canonical date from site_config; admins can edit it via /admin/live-session.
  useEffect(() => {
    getNextSessionAt()
      .then((iso) => {
        if (!iso) return;
        const d = new Date(iso);
        if (!Number.isNaN(d.getTime())) setTarget(d);
      })
      .catch(() => {
        // keep the fallback if the fetch fails
      });
  }, []);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
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
  }, [target]);

  return t;
}

const pad = (n: number) => String(n).padStart(2, '0');

// Whyzer wordmark matching the product app: angular "W" in a white circle
// alongside a heavy uppercase wordmark. Inline SVG so it's crisp and has no
// external dependency (the old CDN "Group 52" asset predates this mark).
const WhyzerLogo = ({ height = 28, wordmark = true }: { height?: number; wordmark?: boolean }) => (
  <span className="inline-flex items-center" style={{ gap: height * 0.32 }}>
    <svg width={height} height={height} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#FFFFFF" />
      <path
        d="M24 38 L34 66 L44 46 L50 58 L56 46 L66 66 L76 38"
        stroke="#0A0E1A"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
    {wordmark && (
      <span
        className="font-display font-bold text-white"
        style={{ fontSize: height * 0.82, letterSpacing: '-0.02em', lineHeight: 1 }}
      >
        WHYZER
      </span>
    )}
  </span>
);

const MinimalNav = () => (
  <nav
    className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-center px-6"
    style={{
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      background: 'rgba(10,14,26,0.85)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <a href="#hero" aria-label="Whyzer">
      <WhyzerLogo height={28} />
    </a>
  </nav>
);

const UrgencyStrip = () => (
  <div className="relative overflow-hidden" style={{ background: '#5959D4', padding: '6px 0' }}>
    <div style={{ transform: 'rotate(-1.2deg)', padding: '10px 0' }}>
      <div className="animate-marquee flex whitespace-nowrap">
        {Array(10).fill(null).map((_, i) => (
          <span key={i} className="font-display text-white text-[16px] tracking-[0.28em] px-10 flex-shrink-0">
            SOUND LIKE NO ONE ELSE. BUILD YOUR POINT OF VIEW. CLOSE BIGGER. ✦
          </span>
        ))}
      </div>
    </div>
  </div>
);

const MinimalFooter = () => (
  <footer
    className="py-12 px-6 text-center border-t border-foreground/[0.06]"
    style={{ background: '#0B1020' }}
  >
    <div className="flex justify-center mb-4 opacity-70">
      <WhyzerLogo height={24} />
    </div>
    <p className="font-mono text-sm text-text-tertiary tracking-wide">
      © 2026 Whyzer · Founded by Jamal Reimer, strategic seller &amp; author of Mega Deal Secrets
    </p>
  </footer>
);

const CtaButton = ({ children, large = false }: { children: React.ReactNode; large?: boolean }) => (
  <a
    href="#hero"
    className={`inline-flex items-center justify-center text-white font-display font-semibold uppercase tracking-[0.14em] rounded-lg hover:brightness-110 transition-all duration-200 active:scale-[0.98] ${large ? 'px-12 h-16 text-base' : 'px-8 h-13 text-sm'}`}
    style={{
      background: 'linear-gradient(135deg, #5959D4, #4343A8)',
      boxShadow: '0 4px 24px rgba(67,67,168,0.3)',
      height: large ? '64px' : '52px',
      lineHeight: 1,
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(89,89,212,0.55), 0 4px 24px rgba(67,67,168,0.4)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(67,67,168,0.3)'; }}
  >
    {children}
  </a>
);

const workflows = [
  {
    num: '01',
    title: 'Why You Sound Like Everyone Else',
    body: "How most sellers get stuck pitching at the one level every buyer has already heard five times this week and why that's exactly what gets you delegated back down.",
  },
  {
    num: '02',
    title: 'The Three Parts of a Point of View',
    body: "Anchor, Tension, Invitation. The structure that turns a generic pitch into something a buyer can't politely file away and forget.",
  },
  {
    num: '03',
    title: 'The Four Levels of Value',
    body: 'Task, process, metric, narrative. Why the level you\'re pitching at determines whether the person across from you can champion you to anyone above them.',
  },
  {
    num: '04',
    title: 'Building Your POV Live',
    body: "You'll draft your own Point of View, for a real account, in real time. Not a worksheet you fill in later and never open again.",
  },
  {
    num: '05',
    title: 'Where It Has to Hold Up',
    body: 'The two executive meetings your Point of View has to survive and why most of them fall apart in the meeting in between.',
  },
];

const walkAwayPoints = [
  'A clear structure for building a Point of View you can use on any account. No template required.',
  'A live example built in real time, not a case study you have to imagine yourself into.',
  "One specific move: the account and the meeting you'll bring your Point of View to, within 14 days.",
  'A framework for standing out consistently. Not a one-time trick that stops working the moment everyone else copies it.',
];

const whoItems = [
  'An Account Executive or Senior AE working deals that take months to close and involve multiple stakeholders, including executives and CFOs.',
  'A Strategic Account Manager who keeps getting delegated to procurement instead of the room you actually need.',
  "An independent seller or consultant who needs a Point of View sharp enough to earn an executive's time without a big brand behind you.",
  "Someone who's already sat through a Financial Fluency session and wants the framework for actually saying it out loud.",
  'A seller who\'s heard "you guys all sound the same" or suspects a buyer\'s thought it and just didn\'t say so.',
];

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

const REGISTRATION_HTML = `<style>@media (max-width: 1e+09px) {  #wk_element_399409224331983c0bb3717d18e66cc0 { width: 100%; max-width: 100%; min-height: 16px; padding: 16px; margin: 0px auto; border-style: solid; border-color: rgb(0, 0, 0); border-width: 0px; border-radius: 16px; background: rgb(26, 26, 26); }  #wk_element_889d2c8b54ae5001837c2ec42ca72c7e { width: 100%; max-width: 100%; min-height: 0px; padding: 0px; margin: 0px; border-style: none; background: rgba(0, 0, 0, 0); font-family: HKGroteskPro, serif; font-size: 16px; line-height: 1.35; letter-spacing: 0px; display: flex; }  #wk_element_889d2c8b54ae5001837c2ec42ca72c7e :not(:last-child) { margin-bottom: 0px; }  #wk_element_399409224331983c0bb3717d18e66cc0_checkbox { color: rgb(0, 0, 0); }  #wk_element_6aef8c2761d05f7a7fee01f707ee3d9f { width: 100%; max-width: 100%; min-height: 0px; padding: 8px 16px; margin: 0px; color: rgb(255, 255, 255); border-style: solid; border-color: rgb(51, 94, 234); border-width: 0px; border-radius: 6px; background: rgb(155, 99, 245); font-family: HKGroteskPro, serif; font-size: 19px; line-height: 1.5; letter-spacing: 0px; display: flex; }  #wk_element_6aef8c2761d05f7a7fee01f707ee3d9f :not(:last-child) { margin-bottom: 0px; }  #wk_element_d94017575195c57e80b94bab113f9bdc { max-width: 540px; min-height: 16px; padding: 0px; margin: 0px auto; border-style: solid; border-color: rgb(255, 255, 255); border-width: 0px; border-radius: 16px; background: rgb(255, 255, 255); }}@media (max-width: 992px) {}@media (max-width: 768px) {}</style><div class="wk_root" style="width: 100%; z-index: 100000;"><div class="wk_ascend_tree col-12 col-md my-auto shadow wk_column wk_editor_hide_tooltips" id="wk_element_d94017575195c57e80b94bab113f9bdc" data-custom-css-classes="shadow" data-wk-border-style-desktop="solid" data-wk-background-type-desktop="solid">  <div class="wk_editor_hide_tooltips shadow shadow-none wk_registration_form" id="wk_element_399409224331983c0bb3717d18e66cc0" data-wk-background-type-desktop="solid" data-wk-border-style-desktop="solid" data-wk-enable-instant-watch="false" data-custom-css-classes="shadow-none" data-wk-date-format-type="en-US" data-wk-webinar-id="69cd784be33fea470cc6fcab"> <form class="wk_ascend_tree wk_registration_form_element"> <select class="mb-3 bg-light form-select form-select-lg wk_registration_form_date" onchange="set_date_text(event,this.value)"></select><input class="wk_registration_form_date_text" type="hidden"><input class="mb-3 bg-light form-control form-control-lg wk_registration_form_first_name" placeholder="First Name" required=""><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_last_name" placeholder="Last Name"><input class="mb-3 bg-light form-control form-control-lg wk_registration_form_email" placeholder="Email" oninput="wk_input_change(this)" type="email" required=""><input class="form-control form-control-lg bg-light mb-3 wk_registration_form_phone d-none" type="tel" placeholder="Phone Number" oninput="wk_input_change(this)"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_1" placeholder="Custom Field 1"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_2" placeholder="Custom Field 2"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_3" placeholder="Custom Field 3"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_4" placeholder="Custom Field 4"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_5" placeholder="Custom Field 5"> <div class="mb-3 mx-0 p-0 wk_registration_form_checkbox wk_row_internal d-none"> <div class="my-auto col-auto"> <div class="wk_checkbox"><input class="wk_checkbox_input" type="checkbox" id="wk_element_399409224331983c0bb3717d18e66cc0_checkbox"></div> </div> <div class="my-auto col"> <div class="wk_editor_hide_tooltips wk_text" id="wk_element_889d2c8b54ae5001837c2ec42ca72c7e" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <p>I consent to receiving emails and/or text message reminders for this event.</p> </div> </div> </div> </div> <div class="wk_editor_hide_tooltips wk_button btn btn-lg wk_button_hide_settings" id="wk_element_6aef8c2761d05f7a7fee01f707ee3d9f" data-wk-background-type-desktop="solid" data-wk-border-style-desktop="solid" onclick="webinar_registration_submit(event)"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <p><b>REGISTER NOW</b></p> </div> </div> </form> </div> </div></div>`;

const WebinarKitRegistration = () => {
  useEffect(() => {
    loadCss('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/css/intlTelInput.css');
    loadCss('https://webinarkit.com/css/ewk_v5.css?cache=5');
    loadScript('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/intlTelInput.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js'))
      .then(() => loadScript('https://webinarkit.com/js/ewk_v7.js?v=6&sv=true'));
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: REGISTRATION_HTML }} />;
};

const LiveSession = () => {
  const t = useCountdown();

  return (
    <div className="min-h-screen" style={{ background: '#0A0E1A' }}>
      <GrainOverlay />
      <MinimalNav />

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative pt-16 min-h-screen flex items-center overflow-hidden"
      >
        {/* Signature Whyzer gradient: purple (lower-left) flowing to cyan (upper-right) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 75% 70% at 22% 78%, rgba(91,75,214,0.32) 0%, transparent 62%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 60% at 82% 22%, rgba(59,201,219,0.20) 0%, transparent 60%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 55% 45%, rgba(79,125,240,0.14) 0%, transparent 65%)' }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-primary" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="font-mono text-[13px] uppercase tracking-[0.22em] text-primary font-semibold">
                Free Live Webinar
              </span>
            </div>

            <h1 className="font-display text-[60px] sm:text-[64px] lg:text-[78px] leading-[1.0] tracking-[-0.02em] text-foreground uppercase mb-7">
              Stop Sounding
              <br />
              <span className="bg-gradient-to-r from-[#A8A8FF] via-[#7B8CFF] to-[#3BC9DB] bg-clip-text text-transparent">
                Like Everybody Else
              </span>
            </h1>

            <p className="font-body text-[17px] text-foreground/75 leading-[1.8] max-w-[500px]">
              Stop pitching the same use cases as every other rep in the deal. Learn the three-part
              framework elite sellers use to build a Point of View sharp enough to get you back in the
              room with the people who can actually say yes.
            </p>
          </div>

          {/* Right — countdown + form */}
          <div className="flex flex-col gap-8">
            {/* Countdown */}
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-text-tertiary mb-5">
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
                      className="font-mono text-[60px] sm:text-[70px] leading-none font-bold"
                      style={{ color: '#A8A8FF' }}
                    >
                      {pad(val)}
                    </span>
                    <span className="font-mono text-[13px] uppercase tracking-[0.22em] text-text-tertiary mt-2">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <WebinarKitRegistration />
              <p className="text-center font-mono text-[13px] text-text-tertiary tracking-wide leading-relaxed">
                One framework. 60 minutes. One session that changes how you sell.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: '#0B1020', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <p className="font-body text-[17px] text-text-secondary leading-[1.85]">
            Most sellers open with a pitch. Elite sellers open with a Point of View.
            In this free live session, Jamal Reimer,{' '}
            <span className="text-foreground font-semibold">
              who has personally closed $160M as an individual contributor after getting fired twice
              for pitching exactly like everyone else,
            </span>{' '}
            breaks down the exact framework that separates reps who get delegated down from the ones
            who get invited back.
          </p>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ── */}
      <section
        className="py-28 px-6 lg:px-12 relative"
        style={{ background: '#0A0E1A', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 100% 50%, rgba(59,201,219,0.10) 0%, rgba(40,24,73,0.42) 45%, transparent 68%)' }}
        />
        <div className="max-w-[1000px] mx-auto relative">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary mb-4">
            What You'll Learn
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] text-foreground uppercase tracking-[-0.02em] mb-4">
            3 Components.{' '}
            <span className="text-primary">One Point of View.</span>
          </h2>
          <p className="font-body text-[17px] text-text-secondary max-w-[520px] leading-[1.8] mb-16">
            Each piece builds on the last. By the end, you won't just have talking points — you'll
            have a repeatable structure for standing out on any account.
          </p>

          <div className="mb-12 space-y-0">
            {workflows.map((w, i) => (
              <div
                key={i}
                className="group flex gap-8 py-8 border-b border-foreground/[0.06] hover:border-primary/[0.18] transition-colors duration-300 cursor-default"
              >
                <span
                  className="font-mono text-3xl font-bold flex-shrink-0 leading-none mt-1"
                  style={{ color: '#5959D4' }}
                >
                  {w.num}
                </span>
                <div>
                  <h3 className="font-display text-[22px] text-foreground uppercase tracking-wide mb-3 group-hover:text-primary transition-colors duration-300">
                    {w.title}
                  </h3>
                  <p className="font-body text-[16px] text-text-secondary leading-[1.8]">{w.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <CtaButton>Secure My Free Seat →</CtaButton>
          </div>
        </div>
      </section>

      {/* ── WALK AWAY WITH ── */}
      <section
        className="py-28 px-6 lg:px-12"
        style={{ background: '#0B1020', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary mb-4">
              What You'll Walk Away With
            </p>
            <h2 className="font-display text-[42px] md:text-[56px] text-foreground uppercase tracking-[-0.02em] mb-5">
              Not a Pitch.
              <br />
              <span className="text-primary">A Point of View.</span>
            </h2>
            <p className="font-body text-[17px] text-text-secondary leading-[1.8] max-w-[380px]">
              You won't leave this session with a list of talking points. You'll leave with a
              repeatable way to build a Point of View for any account, every time.
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
                    style={{ color: '#5959D4' }}
                  >
                    →
                  </span>
                  <p className="font-body text-[17px] text-text-secondary leading-[1.8]">{item}</p>
                </div>
              ))}
            </div>

            {/* Bonus — glass panel matching the product app */}
            <div
              className="rounded-2xl p-8 mb-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(91,75,214,0.10), rgba(59,201,219,0.06))',
                border: '1px solid rgba(120,140,255,0.20)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(120,140,255,0.65), rgba(59,201,219,0.5), transparent)' }}
              />
              <span
                className="inline-block font-mono text-[12px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(89,89,212,0.15)', border: '1px solid rgba(89,89,212,0.35)', color: '#A8A8FF' }}
              >
                Exclusive Bonus
              </span>
              <h3 className="font-display text-[23px] text-foreground uppercase mb-3">
                14 Days of Whyzer Elite, Free
              </h3>
              <p className="font-body text-[16px] text-text-secondary leading-[1.8]">
                Attend live and get full access to the Vault, Coach Jamal, and the research tools to
                turn the Point of View you build in the session into something you actually bring
                into the room.
              </p>
            </div>

            <CtaButton>Save My Free Seat →</CtaButton>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section
        className="py-28 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: '#0A0E1A', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(91,75,214,0.30) 0%, rgba(59,201,219,0.08) 45%, transparent 62%)' }}
        />
        <div className="max-w-[800px] mx-auto relative">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary mb-4">
            Who This Is For
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] text-foreground uppercase tracking-[-0.02em] mb-5">
            Built for <span className="text-primary">Enterprise Sellers.</span>
          </h2>
          <p className="font-body text-[17px] text-text-secondary leading-[1.8] mb-14 max-w-[540px]">
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
                    background: 'rgba(89,89,212,0.12)',
                    border: '1px solid rgba(89,89,212,0.28)',
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5l3.5 3.5L11 1"
                      stroke="#5959D4"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-body text-[17px] text-text-secondary leading-[1.8] group-hover:text-foreground/80 transition-colors duration-300">
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
        style={{ background: '#0B1020', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Photo placeholder */}
          <div className="relative order-2 lg:order-1">
            <div
              className="absolute inset-0 scale-110"
              style={{ background: 'radial-gradient(ellipse at center, rgba(91,75,214,0.32) 0%, rgba(59,201,219,0.12) 55%, transparent 72%)' }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '3/4',
                border: '1px solid rgba(120,140,255,0.18)',
              }}
            >
              <img
                src="/jr_headshot.webp"
                alt="Jamal Reimer"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.65) 0%, transparent 55%)' }}
              />
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary mb-4">
              Your Host
            </p>
            <h2 className="font-display text-[60px] text-foreground uppercase tracking-[-0.02em] mb-8">
              Jamal Reimer
            </h2>

            <div className="space-y-5 mb-10">
              {[
                "Jamal Reimer is one of the few enterprise sales mentors who has actually done it at scale. As an individual contributor, he has closed over $160M in enterprise sales, including multiple transactions exceeding $50M. He is the author of Mega Deal Secrets, a playbook used by sellers at companies like Oracle, SAP, Salesforce, IBM, and AWS.",
                "After two decades in the field, Jamal built Whyzer — an AI platform designed for the specific complexity of mid-to-large enterprise deals. Not theory. Not a template library. The system he used to stop sounding like every other rep in the room.",
                "His sessions aren't theory. Everything taught comes from deals he has personally run, lost, and closed at the highest levels of enterprise sales.",
              ].map((para, i) => (
                <p key={i} className="font-body text-[17px] text-text-secondary leading-[1.85]">
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
                { val: '10,000+', label: 'enterprise sellers mentored' },
              ].map((s, i) => (
                <div key={i}>
                  <span
                    className="font-mono text-3xl font-bold block mb-1.5"
                    style={{ color: '#A8A8FF' }}
                  >
                    {s.val}
                  </span>
                  <span className="font-body text-[13px] text-text-tertiary leading-tight">{s.label}</span>
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
        style={{ background: '#0A0E1A' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(91,75,214,0.18) 0%, rgba(59,201,219,0.08) 50%, transparent 72%)' }}
        />
        <div className="relative max-w-[640px] mx-auto">
          <h2 className="font-display text-[56px] md:text-[70px] text-foreground uppercase tracking-[-0.02em] leading-[1.05] mb-6">
            Seats Are Limited.
            <br />
            <span className="text-primary">Don't Miss Out.</span>
          </h2>
          <p className="font-body text-[17px] text-text-secondary leading-[1.8] mb-12 max-w-[420px] mx-auto">
            This session is capped to stay interactive. Seats lock when the room fills. Be there on time.
          </p>
          <CtaButton large>Claim My Free Seat →</CtaButton>
          <p className="font-mono text-[13px] text-text-tertiary mt-7 tracking-wide">
            August 26 · 12PM ET
          </p>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
};

export default LiveSession;

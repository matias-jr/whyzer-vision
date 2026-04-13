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
  <div className="relative overflow-hidden" style={{ background: '#5959D4', padding: '6px 0' }}>
    <div style={{ transform: 'rotate(-1.2deg)', padding: '10px 0' }}>
      <div className="animate-marquee flex whitespace-nowrap">
        {Array(10).fill(null).map((_, i) => (
          <span key={i} className="font-display text-white text-[16px]tracking-[0.28em] px-10 flex-shrink-0">
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
    title: 'Deep Account Research in Minutes, Not Days',
    body: "How to use AI to extract the financial story behind your target accounts, from earnings calls, SEC filings, and market signals, so you walk into every meeting more informed than your buyer's own team.",
  },
  {
    num: '02',
    title: 'Building a Boardroom-Ready Point of View',
    body: 'How top strategic sellers use AI to transform raw account intel into a compelling POV that resonates with CFOs and executive buyers. Not just operational stakeholders.',
  },
  {
    num: '03',
    title: 'Sharpening Your Discovery with AI',
    body: 'How to generate smarter, more strategic discovery questions tailored to each account, so you uncover the real blockers, budget dynamics, and urgency behind every deal.',
  },
  {
    num: '04',
    title: 'Role-Playing Your Way to Executive Conversations',
    body: 'How to use AI as a sparring partner before high-stakes meetings: simulating executive objections, refining your narrative, and walking in confident.',
  },
  {
    num: '05',
    title: 'Creating Sales Assets at the Speed of the Deal',
    body: 'How AI can help you build follow-up decks, leave-behinds, and proposals faster without sacrificing the quality and financial precision that moves enterprise deals forward.',
  },
];

const walkAwayPoints = [
  'A clear map of 5 AI workflows you can implement immediately in your current deals. No technical expertise required.',
  'Live examples of each workflow in action, walked through in real time.',
  'A practical next step: one workflow you can apply to one of your top accounts within 24 hours of leaving this session.',
  'A framework for using AI to systematically close larger deals. Not a one-shot tactic that expires when the tool gets old.',
];

const whoItems = [
  'An Account Executive or Senior AE working deals that take months to close and involve multiple stakeholders, including executives and CFOs.',
  'A Strategic Account Manager managing large, high-value accounts where depth of insight is your competitive edge.',
  'An independent seller or consultant who needs to punch above their weight in competitive enterprise deals without a large support team.',
  "Someone who already uses AI for basic tasks (email writing, research) but suspects there's a much deeper level you haven't tapped yet.",
  'A seller who has heard "we went with someone else" one too many times and is ready to show up differently.',
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
          style={{ background: 'radial-gradient(ellipse 80% 70% at 25% 55%, rgba(67,67,168,0.24) 0%, transparent 65%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 45% at 80% 75%, rgba(67,67,168,0.1) 0%, transparent 60%)' }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy + countdown */}
          <div>
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-primary" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="font-mono text-[13px] uppercase tracking-[0.22em] text-primary font-semibold">
                Free Live Webinar
              </span>
            </div>

            <h1 className="font-display text-[60px] sm:text-[64px] lg:text-[78px] leading-[1.0] tracking-[-0.02em] text-foreground uppercase mb-7">
              The Strategic
              <br />
              <span className="bg-gradient-to-br from-[#A8A8FF] to-[#4343A8] bg-clip-text text-transparent">
                Seller's AI Stack
              </span>
            </h1>

            <p className="font-body text-[17px] text-foreground/75 leading-[1.8] mb-12 max-w-[500px]">
              Stop treating AI as a tactical tool for one task. Learn the five integrated workflows
              that separate elite sellers from the rest — the ones who systematically embed AI across
              all stages of the buying cycle to engineer bigger deals at scale.
            </p>

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
          </div>

          {/* Right — form */}
          <div className="flex flex-col gap-5">
            <WebinarKitRegistration />
            <p className="text-center font-mono text-[13px] text-text-tertiary tracking-wide leading-relaxed">
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
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <p className="font-body text-[17px] text-text-secondary leading-[1.85]">
            Most sellers are using AI to write emails. Elite sellers are using it to engineer deals.
            In this free live session, Jamal Reimer,{' '}
            <span className="text-foreground font-semibold">
              who has personally closed $160M as an individual contributor,
            </span>{' '}
            breaks down the exact AI workflows that separate average reps from the ones closing
            7- and 8-figure deals in 2026.
          </p>
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
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary mb-4">
            What You'll Learn
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] text-foreground uppercase tracking-[-0.02em] mb-4">
            5 Workflows.{' '}
            <span className="text-primary">One Engineered Deal.</span>
          </h2>
          <p className="font-body text-[17px] text-text-secondary max-w-[520px] leading-[1.8] mb-16">
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
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary mb-4">
              What You'll Walk Away With
            </p>
            <h2 className="font-display text-[42px] md:text-[56px] text-foreground uppercase tracking-[-0.02em] mb-5">
              Not Prompts.
              <br />
              <span className="text-primary">A Framework.</span>
            </h2>
            <p className="font-body text-[17px] text-text-secondary leading-[1.8] max-w-[380px]">
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
                    style={{ color: '#5959D4' }}
                  >
                    →
                  </span>
                  <p className="font-body text-[17px] text-text-secondary leading-[1.8]">{item}</p>
                </div>
              ))}
            </div>

            {/* Bonus */}
            <div
              className="rounded-2xl p-8 mb-10 relative overflow-hidden"
              style={{ background: 'rgba(89,89,212,0.07)', border: '1px solid rgba(89,89,212,0.22)' }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(89,89,212,0.65), transparent)' }}
              />
              <span
                className="inline-block font-mono text-[12px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(89,89,212,0.15)', border: '1px solid rgba(89,89,212,0.35)', color: '#A8A8FF' }}
              >
                Exclusive Bonus
              </span>
              <h3 className="font-display text-[23px] text-foreground uppercase mb-3">
                The Tool Comparison: What Actually Works
              </h3>
              <p className="font-body text-[16px] text-text-secondary leading-[1.8]">
                A candid breakdown of what the market offers (ChatGPT, generic LLMs, enterprise
                platforms) vs. what strategic sellers actually need, and why most tools weren't
                built for the complexity of mid-to-large deals.
              </p>
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
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary mb-4">
            Who This Is For
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] text-foreground uppercase tracking-[-0.02em] mb-5">
            Built for Enterprise Sellers.
            <br />
            <span className="text-primary">Not Managers. Not Teams.</span>
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
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Photo placeholder */}
          <div className="relative order-2 lg:order-1">
            <div
              className="absolute inset-0 scale-110"
              style={{ background: 'radial-gradient(ellipse at center, rgba(67,67,168,0.3) 0%, transparent 70%)' }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '3/4',
                border: '1px solid rgba(89,89,212,0.14)',
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
                "Jamal Reimer is one of the few enterprise sales mentors who has actually done it at scale. As an individual contributor, he has closed over $160M in enterprise deals, including multiple transactions exceeding $50M. He is the author of Mega Deal Secrets, a playbook used by sellers at companies like Oracle, SAP, Salesforce, IBM, and AWS.",
                "After two decades in the field, Jamal built Whyzer — an AI platform designed from the ground up for the specific complexity of mid-to-large enterprise deals. Not for teams. Not for managers. For the individual seller who has to walk into a CFO's office and earn their trust in under 30 minutes.",
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
                { val: '10,000+', label: 'enterprise sellers trained globally' },
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
        style={{ background: '#0A0A0A' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(67,67,168,0.14) 0%, transparent 70%)' }}
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
            April 21 · 12PM EST
          </p>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
};

export default LiveSession;

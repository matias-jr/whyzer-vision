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

const MinimalNav = () => (
  <nav
    className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-center px-6"
    style={{
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      background: 'rgba(11,11,24,0.92)',
      borderBottom: '1px solid #E4E3F0',
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
  <div className="relative overflow-hidden" style={{ background: '#6262E9', padding: '6px 0' }}>
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
    style={{ background: '#F2F1FB' }}
  >
    <img
      src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
      alt="Whyzer"
      className="h-6 mx-auto mb-4 opacity-70"
    />
    <p className="font-mono text-sm text-[#8A8AA0] tracking-wide">
      © 2026 Whyzer · Founded by Jamal Reimer, strategic seller &amp; author of Mega Deal Secrets
    </p>
  </footer>
);

const CtaButton = ({ children, large = false }: { children: React.ReactNode; large?: boolean }) => (
  <a
    href="#hero"
    className={`inline-flex items-center justify-center text-white font-display font-semibold uppercase tracking-[0.14em] rounded-lg hover:brightness-110 transition-all duration-200 active:scale-[0.98] ${large ? 'px-12 h-16 text-base' : 'px-8 h-13 text-sm'}`}
    style={{
      background: 'linear-gradient(135deg, #6262E9, #4A4AD1)',
      boxShadow: '0 4px 24px rgba(98,98,233,0.16)',
      height: large ? '64px' : '52px',
      lineHeight: 1,
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(98,98,233,0.45), 0 4px 24px rgba(67,67,168,0.4)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(98,98,233,0.16)'; }}
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

const REGISTRATION_HTML = `<style>@media (max-width: 1e+09px) {  #wk_element_399409224331983c0bb3717d18e66cc0 { width: 100%; max-width: 100%; min-height: 16px; padding: 16px; margin: 0px auto; border-style: solid; border-color: rgb(255, 255, 255); border-width: 0px; border-radius: 16px; background: rgb(255, 255, 255); }  #wk_element_889d2c8b54ae5001837c2ec42ca72c7e { width: 100%; max-width: 100%; min-height: 0px; padding: 0px; margin: 0px; border-style: none; background: rgba(0, 0, 0, 0); font-family: HKGroteskPro, serif; font-size: 16px; line-height: 1.35; letter-spacing: 0px; display: flex; }  #wk_element_889d2c8b54ae5001837c2ec42ca72c7e :not(:last-child) { margin-bottom: 0px; }  #wk_element_399409224331983c0bb3717d18e66cc0_checkbox { color: rgb(0, 0, 0); }  #wk_element_6aef8c2761d05f7a7fee01f707ee3d9f { width: 100%; max-width: 100%; min-height: 0px; padding: 8px 16px; margin: 0px; color: rgb(255, 255, 255); border-style: solid; border-color: rgb(51, 94, 234); border-width: 0px; border-radius: 6px; background: rgb(98, 98, 233); font-family: HKGroteskPro, serif; font-size: 19px; line-height: 1.5; letter-spacing: 0px; display: flex; }  #wk_element_6aef8c2761d05f7a7fee01f707ee3d9f :not(:last-child) { margin-bottom: 0px; }  #wk_element_d94017575195c57e80b94bab113f9bdc { max-width: 540px; min-height: 16px; padding: 0px; margin: 0px auto; border-style: solid; border-color: rgb(255, 255, 255); border-width: 0px; border-radius: 16px; background: rgb(255, 255, 255); }}@media (max-width: 992px) {}@media (max-width: 768px) {}</style><div class="wk_root" style="width: 100%; z-index: 100000;"><div class="wk_ascend_tree col-12 col-md my-auto shadow wk_column wk_editor_hide_tooltips" id="wk_element_d94017575195c57e80b94bab113f9bdc" data-custom-css-classes="shadow" data-wk-border-style-desktop="solid" data-wk-background-type-desktop="solid">  <div class="wk_editor_hide_tooltips shadow shadow-none wk_registration_form" id="wk_element_399409224331983c0bb3717d18e66cc0" data-wk-background-type-desktop="solid" data-wk-border-style-desktop="solid" data-wk-enable-instant-watch="false" data-custom-css-classes="shadow-none" data-wk-date-format-type="en-US" data-wk-webinar-id="6a7b29be3db0318c2bcf6e6a"> <form class="wk_ascend_tree wk_registration_form_element"> <select class="mb-3 bg-light form-select form-select-lg wk_registration_form_date" onchange="set_date_text(event,this.value)"></select><input class="wk_registration_form_date_text" type="hidden"><input class="mb-3 bg-light form-control form-control-lg wk_registration_form_first_name" placeholder="First Name" required=""><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_last_name" placeholder="Last Name"><input class="mb-3 bg-light form-control form-control-lg wk_registration_form_email" placeholder="Email" oninput="wk_input_change(this)" type="email" required=""><input class="form-control form-control-lg bg-light mb-3 wk_registration_form_phone d-none" type="tel" placeholder="Phone Number" oninput="wk_input_change(this)"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_1" placeholder="Custom Field 1"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_2" placeholder="Custom Field 2"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_3" placeholder="Custom Field 3"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_4" placeholder="Custom Field 4"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_5" placeholder="Custom Field 5"> <div class="mb-3 mx-0 p-0 wk_registration_form_checkbox wk_row_internal" data-wk-show-checkbox="true"> <div class="my-auto col-auto"> <div class="wk_checkbox"><input class="wk_checkbox_input" type="checkbox" id="wk_element_399409224331983c0bb3717d18e66cc0_checkbox" required=""></div> </div> <div class="my-auto col"> <div class="wk_editor_hide_tooltips wk_text" id="wk_element_889d2c8b54ae5001837c2ec42ca72c7e" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <p>Please send me email reminders and other communication relevant to the event.</p> </div> </div> </div> </div> <div class="wk_editor_hide_tooltips wk_button btn btn-lg wk_button_hide_settings" id="wk_element_6aef8c2761d05f7a7fee01f707ee3d9f" data-wk-background-type-desktop="solid" data-wk-border-style-desktop="solid" onclick="webinar_registration_submit(event)"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <p><b>SIGN ME UP!</b></p> </div> </div> </form> </div> </div></div>`;

const WebinarKitRegistration = () => {
  useEffect(() => {
    loadCss('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/css/intlTelInput.css');
    loadCss('https://webinarkit.com/css/ewk_v5.css?cache=5');
    loadScript('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/intlTelInput.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js'))
      .then(() => loadScript('https://webinarkit.com/js/ewk_v7.js?v=7&sv=true')
      .then(() => loadScript('https://webinarkit.com/js/ewk_i.js?v=1')));
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: REGISTRATION_HTML }} />;
};

const LiveSession = () => {
  const t = useCountdown();

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF9' }}>
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
          style={{ background: 'radial-gradient(ellipse 75% 70% at 22% 78%, rgba(98,98,233,0.16) 0%, transparent 62%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 60% at 82% 22%, rgba(98,98,233,0.10) 0%, transparent 60%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 55% 45%, rgba(98,98,233,0.08) 0%, transparent 65%)' }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-16 items-start w-full">
          {/* Left — copy. Both columns open on the same eyebrow baseline. */}
          <div>
            <div className="ls-eyebrow inline-flex items-center gap-2.5 mb-5 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full" style={{ background: '#6262E9', animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#4A4AD1] font-semibold">
                Free Live Webinar
              </span>
            </div>

            <h1 className="font-display text-[54px] sm:text-[60px] lg:text-[70px] leading-[1.0] tracking-[-0.02em] text-[#14141F] uppercase mb-5">
              Stop Sounding
              <br />
              <span className="text-[#4A4AD1]">Like Everybody Else</span>
            </h1>

            <p className="font-display text-[20px] lg:text-[23px] text-[#14141F] leading-[1.35] mb-6 max-w-[500px]">
              How top enterprise sellers build a Point of View that opens doors a demo can't
            </p>

            <p className="font-body text-[17px] text-[#55556B] leading-[1.8] max-w-[500px]">
              Stop pitching the same use cases as every other rep in the deal. Learn the three-part
              framework elite sellers use to build a Point of View sharp enough to get you back in the
              room with the people who can actually say yes.
            </p>
          </div>

          {/* Right — countdown + form, opening on the same line as the eyebrow */}
          <div className="flex flex-col gap-7">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#8A8AA0] mb-4">
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
                      style={{ color: '#4A4AD1' }}
                    >
                      {pad(val)}
                    </span>
                    <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#8A8AA0] mt-2">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <WebinarKitRegistration />
          </div>
        </div>
      </section>

      {/* ── THE PREMISE + WHAT YOU'LL LEARN ──
          The credibility paragraph now opens this section as a pull quote
          instead of sitting in a band of its own. */}
      <section
        className="py-28 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: '#F2F1FB', borderTop: '1px solid #E4E3F0' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 100% 40%, rgba(98,98,233,0.10) 0%, transparent 68%)' }}
        />
        <div className="max-w-[1000px] mx-auto relative">
          {/* Premise — set large, as the section's opening statement */}
          <div className="max-w-[760px] mb-20">
            <p className="font-display text-[26px] md:text-[34px] leading-[1.35] text-[#14141F] mb-6">
              Most sellers open with a pitch.{' '}
              <span className="text-[#4A4AD1]">Elite sellers open with a Point of View.</span>
            </p>
            <p className="font-body text-[17px] text-[#55556B] leading-[1.85]">
              In this free live session, Jamal Reimer,{' '}
              <span className="text-[#14141F] font-semibold">
                who has personally closed $160M as an individual contributor after getting fired twice
                for pitching exactly like everyone else,
              </span>{' '}
              breaks down the exact framework that separates reps who get delegated down from the ones
              who get invited back.
            </p>
          </div>

          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#4A4AD1] mb-4">
            What You'll Learn
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] text-[#14141F] uppercase tracking-[-0.02em] mb-4">
            3 Components.{' '}
            <span className="text-[#4A4AD1]">One Point of View.</span>
          </h2>
          <p className="font-body text-[17px] text-[#55556B] max-w-[520px] leading-[1.8] mb-14">
            Each piece builds on the last. By the end, you won't just have talking points. You'll
            have a repeatable structure for standing out on any account.
          </p>

          {/* Three stacked cards, each numbered — a build, not a bulleted list */}
          <div className="ls-steps mb-14">
            {workflows.map((w, i) => (
              <div key={i} className="ls-glass rounded-2xl p-7">
                <span
                  className="font-mono text-[34px] font-bold leading-none block mb-5"
                  style={{ color: '#6262E9' }}
                >
                  {w.num}
                </span>
                <h3 className="font-display text-[21px] text-[#14141F] uppercase tracking-wide mb-3">
                  {w.title}
                </h3>
                <p className="font-body text-[15.5px] text-[#55556B] leading-[1.75]">{w.body}</p>
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
        style={{ background: '#F2F1FB', borderTop: '1px solid #E4E3F0' }}
      >
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#4A4AD1] mb-4">
              What You'll Walk Away With
            </p>
            <h2 className="font-display text-[42px] md:text-[56px] text-[#14141F] uppercase tracking-[-0.02em] mb-5">
              Not a Pitch.
              <br />
              <span className="text-[#4A4AD1]">A Point of View.</span>
            </h2>
            <p className="font-body text-[17px] text-[#55556B] leading-[1.8] max-w-[380px]">
              You won't leave this session with a list of talking points. You'll leave with a
              repeatable way to build a Point of View for any account, every time.
            </p>
          </div>
          <div>
            {/* Numbered cards rather than another rule-separated list */}
            <div className="ls-takeaways mb-12">
              {walkAwayPoints.map((item, i) => (
                <div key={i} className="ls-glass rounded-xl p-6 flex gap-4">
                  <span
                    className="font-mono text-[15px] font-bold flex-shrink-0 leading-none pt-1"
                    style={{ color: '#6262E9' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-body text-[16px] text-[#55556B] leading-[1.75]">{item}</p>
                </div>
              ))}
            </div>

            {/* Bonus — glass panel matching the product app */}
            <div
              className="rounded-2xl p-8 mb-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(98,98,233,0.08), rgba(98,98,233,0.05))',
                border: '1px solid rgba(120,140,255,0.20)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(98,98,233,0.55), rgba(98,98,233,0.35), transparent)' }}
              />
              <span
                className="inline-block font-mono text-[12px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(98,98,233,0.10)', border: '1px solid rgba(98,98,233,0.30)', color: '#4A4AD1' }}
              >
                Exclusive Bonus
              </span>
              <h3 className="font-display text-[23px] text-[#14141F] uppercase mb-3">
                14 Days of Whyzer Elite, Free
              </h3>
              <p className="font-body text-[16px] text-[#55556B] leading-[1.8]">
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
        style={{ background: '#FAFAF9', borderTop: '1px solid #E4E3F0' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(98,98,233,0.14) 0%, rgba(98,98,233,0.06) 45%, transparent 62%)' }}
        />
        <div className="max-w-[900px] mx-auto relative text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#4A4AD1] mb-4">
            Who This Is For
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] text-[#14141F] uppercase tracking-[-0.02em] mb-5">
            Built for <span className="text-[#4A4AD1]">Enterprise Sellers.</span>
          </h2>
          <p className="font-body text-[17px] text-[#55556B] leading-[1.8] mb-14 max-w-[540px] mx-auto">
            This session is built for individual enterprise sellers navigating complex, mid-to-large
            deals. You'll get the most out of this if you are:
          </p>

          {/* Checklist chips, two across, rather than a fourth stacked list */}
          <div className="ls-who mb-14 text-left">
            {whoItems.map((item, i) => (
              <div key={i} className="ls-glass rounded-xl p-5 flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: 'rgba(98,98,233,0.12)',
                    border: '1px solid rgba(98,98,233,0.30)',
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5l3.5 3.5L11 1"
                      stroke="#6262E9"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-body text-[16px] text-[#55556B] leading-[1.75]">{item}</p>
              </div>
            ))}
          </div>

          <CtaButton>I'm In — Register for Free →</CtaButton>
        </div>
      </section>

      {/* ── ABOUT JAMAL ── */}
      <section
        className="py-28 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: '#F2F1FB', borderTop: '1px solid #E4E3F0' }}
      >
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Photo placeholder */}
          <div className="relative order-2 lg:order-1">
            <div
              className="absolute inset-0 scale-110"
              style={{ background: 'radial-gradient(ellipse at center, rgba(98,98,233,0.16) 0%, rgba(98,98,233,0.08) 55%, transparent 72%)' }}
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
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#4A4AD1] mb-4">
              Your Host
            </p>
            <h2 className="font-display text-[60px] text-[#14141F] uppercase tracking-[-0.02em] mb-8">
              Jamal Reimer
            </h2>

            <div className="space-y-5 mb-10">
              {[
                "Jamal Reimer is one of the few enterprise sales mentors who has actually done it at scale. As an individual contributor, he has closed over $160M in enterprise sales, including multiple transactions exceeding $50M. He is the author of Mega Deal Secrets, a playbook used by sellers at companies like Oracle, SAP, Salesforce, IBM, and AWS.",
                "After two decades in the field, Jamal built Whyzer — an AI platform designed for the specific complexity of mid-to-large enterprise deals. Not theory. Not a template library. The system he used to stop sounding like every other rep in the room.",
                "His sessions aren't theory. Everything taught comes from deals he has personally run, lost, and closed at the highest levels of enterprise sales.",
              ].map((para, i) => (
                <p key={i} className="font-body text-[17px] text-[#55556B] leading-[1.85]">
                  {para}
                </p>
              ))}
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-6 py-8 mb-10"
              style={{ borderTop: '1px solid #E4E3F0', borderBottom: '1px solid #E4E3F0' }}
            >
              {[
                { val: '$160M+', label: 'closed as an individual contributor' },
                { val: '$50M+', label: 'largest single deal closed' },
                { val: '10,000+', label: 'enterprise sellers mentored' },
              ].map((s, i) => (
                <div key={i}>
                  <span
                    className="font-mono text-3xl font-bold block mb-1.5"
                    style={{ color: '#4A4AD1' }}
                  >
                    {s.val}
                  </span>
                  <span className="font-body text-[13px] text-[#8A8AA0] leading-tight">{s.label}</span>
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
        style={{ background: '#FAFAF9' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(98,98,233,0.10) 0%, rgba(98,98,233,0.06) 50%, transparent 72%)' }}
        />
        <div className="relative max-w-[640px] mx-auto">
          <h2 className="font-display text-[56px] md:text-[70px] text-[#14141F] uppercase tracking-[-0.02em] leading-[1.05] mb-6">
            Seats Are Limited.
            <br />
            <span className="text-[#4A4AD1]">Don't Miss Out.</span>
          </h2>
          <p className="font-body text-[17px] text-[#55556B] leading-[1.8] mb-12 max-w-[420px] mx-auto">
            This session is capped to stay interactive. Seats lock when the room fills. Be there on time.
          </p>
          <CtaButton large>Claim My Free Seat →</CtaButton>
          <p className="font-mono text-[13px] text-[#8A8AA0] mt-7 tracking-wide">
            August 26 · 12PM ET
          </p>
        </div>
      </section>

      <MinimalFooter />

      <style>{`
        /* Frosted glass, matching the financial-fluency pages: translucent fill,
           backdrop blur, and a lit top-left edge. */
        .ls-glass {
          position: relative;
          background: rgba(255,255,255,0.58);
          border: 1px solid rgba(255,255,255,0.75);
          box-shadow: 0 8px 32px -12px rgba(20,20,31,0.14);
          backdrop-filter: blur(12px) saturate(140%);
          -webkit-backdrop-filter: blur(12px) saturate(140%);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ls-glass::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 42%);
        }
        .ls-glass > * { position: relative; z-index: 1; }
        .ls-glass:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px -12px rgba(20,20,31,0.20);
          border-color: rgba(98,98,233,0.35);
        }
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .ls-glass { background: #FFFFFF; border-color: #E4E3F0; }
        }

        .ls-eyebrow {
          background: rgba(98,98,233,0.10);
          border: 1px solid rgba(98,98,233,0.28);
        }

        /* Each list section gets its own shape so they stop reading alike. */
        .ls-steps { display: grid; grid-template-columns: 1fr; gap: 18px; }
        .ls-takeaways { display: grid; grid-template-columns: 1fr; gap: 14px; }
        .ls-who { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 768px) {
          /* Five cards: three on the first row, the last two widened to close
             the second row instead of leaving a ragged gap. */
          .ls-steps { grid-template-columns: repeat(6, 1fr); }
          .ls-steps > * { grid-column: span 2; }
          .ls-steps > :nth-child(4):nth-last-child(2),
          .ls-steps > :nth-child(5):nth-last-child(1) { grid-column: span 3; }
          .ls-takeaways { grid-template-columns: repeat(2, 1fr); }
          .ls-who { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default LiveSession;

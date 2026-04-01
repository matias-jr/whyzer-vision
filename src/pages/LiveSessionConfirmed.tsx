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
    <a href="#">
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

const CONFIRMATION_HTML = `<style>@media (max-width: 1e+09px) {  #wk_element_5593219dd237183413d27d0e5acd74ac { width: 540px; max-width: 100%; min-height: 16px; padding: 0px; margin: 0px auto; border-style: none; background: rgba(0, 0, 0, 0); }  #wk_element_5593219dd237183413d27d0e5acd74ac_calendar { background: rgb(51, 94, 234); }  #wk_element_45f8e93c3ca45229d03dbfdfd50fb418 { width: 540px; max-width: 100%; min-height: 16px; padding: 0px 16px 16px; margin: 0px auto; border-style: none; background: rgba(0, 0, 0, 0); }  #wk_element_d1217a9bd4050e903e6ed0eb69757d18 { width: 100%; max-width: 100%; min-height: 0px; padding: 0px; margin: 0px; border-style: none; background: rgba(0, 0, 0, 0); font-family: HKGroteskPro, serif; font-size: 16px; line-height: 1.35; letter-spacing: 0px; }  #wk_element_d1217a9bd4050e903e6ed0eb69757d18 :not(:last-child) { margin-bottom: 0px; }  #wk_element_3faa4a3b321e808bea1bb2a1728b1a2b { width: 540px; max-width: 100%; min-height: 16px; padding: 0px; margin: 0px auto 16px; border-style: none; background: rgba(0, 0, 0, 0); color: rgb(255, 255, 255); }  #wk_element_ef686ab4d9d28244630f2a52414694f4 { max-width: 540px; min-height: 16px; padding: 16px; margin: 0px auto; border-style: solid; border-color: rgb(255, 255, 255); border-width: 0px; border-radius: 16px; background: rgb(26, 26, 26); }  #wk_element_c6dd61bac74fea356fdc37879dfce67d { width: 100%; max-width: 100%; min-height: 0px; padding: 0px; margin: 0px; border-style: none; background: rgba(0, 0, 0, 0); font-family: HKGroteskPro, serif; font-size: 16px; line-height: 1.5; letter-spacing: 0px; display: flex; color: rgb(255, 255, 255); }  #wk_element_c6dd61bac74fea356fdc37879dfce67d :not(:last-child) { margin-bottom: 0px; }  #wk_element_e8f171a2c4dca2835f2cf81ff6b3ccba { width: 540px; max-width: 100%; min-height: 16px; padding: 0px; margin: 0px auto; border-style: none; color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0); }  #wk_element_3faa4a3b321e808bea1bb2a1728b1a2b_calendar { background: rgb(51, 94, 234); }}@media (max-width: 992px) {  #wk_element_e8f171a2c4dca2835f2cf81ff6b3ccba { }}@media (max-width: 768px) {  #wk_element_e8f171a2c4dca2835f2cf81ff6b3ccba { }}</style><div class="wk_root" style="width: 100%; z-index: 100000;"><div class="wk_ascend_tree wk_editor_hide_tooltips col-12 col-md my-auto shadow wk_column" id="wk_element_ef686ab4d9d28244630f2a52414694f4" data-custom-css-classes="shadow" data-wk-background-type="solid" data-wk-border-style="solid" data-wk-border-style-desktop="solid" data-wk-background-type-desktop="solid"> <div class="wk_editor_hide_tooltips wk_thank_you_timer" calendar="hide" data-classes="wk_thank_you_timer" data-wk-date-format-type="en-US" data-wk-days-label="days" data-wk-entering-label="Entering event watch room..." data-wk-expired-label="Sorry, this event session has ended!" data-wk-hours-label="hours" data-wk-minutes-label="minutes" data-wk-seconds-label="seconds" data-wk-starts-in-label="Webinar starts in:" data-wk-webinar-id="69cd784be33fea470cc6fcab" id="wk_element_3faa4a3b321e808bea1bb2a1728b1a2b" timer_size="small" data-wk-border-style-desktop="default" data-wk-background-type-desktop="default"> <div class="wk_row_internal mx-0"> <div class="wk_timer px-0 col"> <div class="rounded-2 mx-auto shadow wk_calendar" style="max-width:170px; background: #fff; display: none"> <div class="wk_calendar_color" style="border-top-left-radius: .375rem; border-top-right-radius: .375rem" id="wk_element_3faa4a3b321e808bea1bb2a1728b1a2b_calendar"> <h5 class="text-center fw-bold py-2 text-uppercase text-white wk_calendar_month">April</h5> </div> <h1 class="text-center fw-bold mb-2 pb-2 wk_calendar_day">8</h1> </div> <h5 class="text-center mb-4 mt-5 wk_calendar_header" style="display:none"><i class="fa-clock fa-regular"></i><span class="wk_calendar_time"> 5:00 PM GMT-3</span></h5> <h6 class="text-center fw-bold wk_timer_header">Webinar starts in:</h6> <div class="wk_row_internal mx-auto wk_timer_row"> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_days">0</h5> <h6 class="text-center mb-0 wk_timer_days_label">days</h6> </div> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_hours">0</h5> <h6 class="text-center mb-0 wk_timer_hours_label">hours</h6> </div> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_minutes">0</h5> <h6 class="text-center mb-0 wk_timer_minutes_label">minutes</h6> </div> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_seconds">0</h5> <h6 class="text-center mb-0 wk_timer_seconds_label">seconds</h6> </div> </div> </div> </div> </div> <div class="wk_thank_you_session_link" id="wk_element_e8f171a2c4dca2835f2cf81ff6b3ccba" data-classes="wk_thank_you_session_link" data-wk-webinar-id="69cd784be33fea470cc6fcab" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div class="wk_ascend_tree wk_row_internal mx-0"> <div class="text-center col mx-auto px-0 wk_ascend_tree"> <div class="wk_ascend_tree wk_editor_hide_tooltips wk_text" id="wk_element_c6dd61bac74fea356fdc37879dfce67d" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <h6><b>Your webinar session link:</b></h6> </div> </div> <div class="input-group input-group-lg mt-1"><input class="form-control wk_webinar_session_link" style="background-color: #f1f4f8; border-color: #f1f4f8;" readonly=""><button class="btn wk_copy_link_button" data-bs-container="body" data-bs-content="Link copied to clipboard!" data-bs-original-title="" data-bs-placement="top" data-bs-toggle="popover" style="color: inherit; background-color: rgba(80,102,144,.1)" type="button"><i class="far fa-copy" style="width: 19.125px"></i></button></div> </div> </div> </div> </div></div>`;

const WebinarKitConfirmation = () => {
  useEffect(() => {
    loadCss('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/css/intlTelInput.css');
    loadCss('https://webinarkit.com/css/ewk_v5.css?cache=5');
    loadScript('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/intlTelInput.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js'))
      .then(() => loadScript('https://webinarkit.com/js/ewk_v7.js?v=6'));
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: CONFIRMATION_HTML }} />;
};

const LiveSessionConfirmed = () => {
  const t = useCountdown();

  return (
    <div className="min-h-screen bg-background">
      <GrainOverlay />
      <MinimalNav />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 30%, rgba(100,67,168,0.22) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 max-w-[600px] mx-auto px-6">
          {/* Check icon */}
          <div className="flex justify-center mb-7">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(129,89,212,0.14)',
                border: '2px solid rgba(129,89,212,0.38)',
                boxShadow: '0 0 32px rgba(129,89,212,0.2)',
              }}
            >
              <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                <path
                  d="M2 10l7 7L24 2"
                  stroke="#8159d4"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(129,89,212,0.12)',
              border: '1px solid rgba(129,89,212,0.28)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
              You're In.
            </span>
          </div>

          <h1 className="font-display text-[44px] sm:text-[60px] leading-[1.0] tracking-[-0.02em] text-foreground uppercase mb-7">
            You're officially
            <br />
            <span className="bg-gradient-to-br from-[#C4A8FF] to-[#6443A8] bg-clip-text text-transparent">
              registered.
            </span>
          </h1>

          <p className="font-body text-[15px] text-text-secondary leading-[1.8] mb-5 max-w-[480px] mx-auto">
            Check your inbox — a confirmation with your session link is on its way. Complete the
            steps below before April 21 to get the most out of this session.
          </p>

          <p className="font-mono text-[11px] text-text-tertiary tracking-wide">
            April 21 · 12PM EST · The Strategic Seller's AI Stack
          </p>
        </div>
      </section>

      {/* ── WEBINARKIT WIDGET ── */}
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <WebinarKitConfirmation />
      </div>

      {/* ── COUNTDOWN ── */}
      <div
        className="py-14 px-6 text-center"
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary mb-8">
          Your Session Starts In
        </p>
        <div className="flex items-end justify-center gap-6 sm:gap-10">
          {[
            { val: t.days, label: 'Days' },
            { val: t.hours, label: 'Hours' },
            { val: t.minutes, label: 'Minutes' },
            { val: t.seconds, label: 'Seconds' },
          ].map(({ val, label }, i) => (
            <div key={i} className="flex flex-col items-center">
              <span
                className="font-mono text-[48px] sm:text-[60px] leading-none font-bold"
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
        <p className="font-mono text-[11px] text-text-tertiary mt-8 tracking-wide">
          April 21, 2026 · 12:00 PM EST
        </p>
      </div>

      {/* ── NEXT STEPS ── */}
      <section className="py-28 px-6 lg:px-12" style={{ background: '#0A0A0A' }}>
        <div className="max-w-[800px] mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-4">
            Next Steps
          </p>
          <h2 className="font-display text-[40px] md:text-[52px] text-foreground uppercase tracking-[-0.02em] mb-16">
            Do These <span className="text-primary">Now.</span>
          </h2>

          <div className="space-y-20">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold"
                  style={{ color: '#8159d4' }}
                >
                  Step 1
                </span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
              <h3 className="font-display text-[24px] text-foreground uppercase mb-5">
                Check Your Inbox.
              </h3>
              <p className="font-body text-[15px] text-text-secondary leading-[1.8] mb-6">
                Your confirmation email with the session link has just been sent to the address you
                registered with.
              </p>
              <div className="space-y-3 mb-7">
                <div
                  className="flex items-start gap-4 p-5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider flex-shrink-0 mt-0.5 px-2 py-0.5 rounded"
                    style={{ background: 'rgba(129,89,212,0.15)', color: '#C4A8FF' }}
                  >
                    Gmail
                  </span>
                  <p className="font-body text-sm text-text-secondary leading-[1.75]">
                    <span className="text-foreground font-medium">If it's in Promotions:</span> Open
                    it and select "Move to Primary." This ensures you don't miss session reminders or
                    the link on the day.
                  </p>
                </div>
                <div
                  className="flex items-start gap-4 p-5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider flex-shrink-0 mt-0.5 px-2 py-0.5 rounded"
                    style={{ background: 'rgba(129,89,212,0.15)', color: '#C4A8FF' }}
                  >
                    Spam
                  </span>
                  <p className="font-body text-sm text-text-secondary leading-[1.75]">
                    <span className="text-foreground font-medium">If it's in Spam:</span> Open it
                    and click "Not Spam." This will move it to your inbox and make sure future emails
                    come through.
                  </p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-3">
                  Subject line to look for:
                </p>
                <div
                  className="inline-block px-5 py-2.5 rounded-lg"
                  style={{
                    background: 'rgba(129,89,212,0.1)',
                    border: '1px solid rgba(129,89,212,0.25)',
                  }}
                >
                  <span className="font-mono text-sm text-primary">
                    "You're registered: The Strategic Seller's AI Stack"
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold"
                  style={{ color: '#8159d4' }}
                >
                  Step 2
                </span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
              <h3 className="font-display text-[24px] text-foreground uppercase mb-3">
                Watch This First. Direct Message from Jamal.
              </h3>
              <p className="font-body text-[15px] text-text-secondary leading-[1.8] mb-7">
                Jamal walks you through how to prep, what to expect, and how to get the most out of
                this session. There's a bonus inside — don't skip it.
              </p>
              {/* 16:9 video placeholder */}
              <div
                className="glass-card rounded-2xl overflow-hidden relative"
                style={{ aspectRatio: '16/9' }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(40,24,73,0.4) 0%, transparent 70%)' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      background: 'rgba(129,89,212,0.28)',
                      border: '2px solid rgba(129,89,212,0.5)',
                      boxShadow: '0 0 28px rgba(129,89,212,0.3)',
                    }}
                  >
                    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                      <path d="M2 2l14 9-14 9V2z" fill="#8159d4" />
                    </svg>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary">
                    Video message from Jamal — loading soon
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold"
                  style={{ color: '#8159d4' }}
                >
                  Step 3
                </span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
              <h3 className="font-display text-[24px] text-foreground uppercase mb-3">
                Add It to Your Calendar and Be There Live.
              </h3>
              <p className="font-body text-[15px] text-text-secondary leading-[1.8] mb-7">
                Block April 21 at 12PM EST now, before you forget. We're going deep on the five AI
                workflows that separate elite sellers from the rest. This isn't a recording you'll
                catch up on later — the live session is where the value is.
              </p>
              {/* Calendar info block */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex flex-col sm:flex-row gap-7 items-start">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📅</span>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary mb-1">
                        Date
                      </p>
                      <p className="font-display text-base text-foreground uppercase">
                        Monday, April 21, 2026
                      </p>
                    </div>
                  </div>
                  <div
                    className="sm:border-l sm:pl-7 flex items-start gap-3"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-lg mt-0.5">🕛</span>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary mb-1">
                        Time
                      </p>
                      <p className="font-display text-base text-foreground uppercase">
                        12:00 PM EST · 9:00 AM PST · 5:00 PM UK
                      </p>
                    </div>
                  </div>
                  <div
                    className="sm:border-l sm:pl-7 flex items-start gap-3"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-lg mt-0.5">📍</span>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary mb-1">
                        Platform
                      </p>
                      <p className="font-display text-base text-foreground uppercase">
                        Live on Whyzer
                      </p>
                      <p className="font-mono text-[10px] text-text-tertiary mt-0.5">
                        Link in your confirmation email
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKET ── */}
      <section
        className="py-20 px-6"
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[480px] mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-tertiary text-center mb-10">
            Your Ticket
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(129,89,212,0.22)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(100,67,168,0.12)',
            }}
          >
            {/* Top strip */}
            <div
              className="p-8 relative"
              style={{ background: 'linear-gradient(160deg, rgba(129,89,212,0.1) 0%, rgba(129,89,212,0.05) 100%)' }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(196,168,255,0.7), transparent)' }}
              />
              <div className="flex items-start justify-between mb-8">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                >
                  Admit One
                </span>
                <div className="opacity-15">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="1" y="1" width="10" height="10" stroke="#8159d4" strokeWidth="1.5"/>
                    <rect x="17" y="1" width="10" height="10" stroke="#8159d4" strokeWidth="1.5"/>
                    <rect x="1" y="17" width="10" height="10" stroke="#8159d4" strokeWidth="1.5"/>
                    <rect x="19" y="19" width="4" height="4" fill="#8159d4"/>
                    <rect x="24" y="19" width="4" height="4" fill="#8159d4"/>
                    <rect x="19" y="24" width="4" height="4" fill="#8159d4"/>
                  </svg>
                </div>
              </div>
              <h2 className="font-display text-[30px] text-foreground uppercase leading-[1.1] mb-3">
                The Strategic
                <br />
                <span className="text-primary">Seller's AI Stack</span>
              </h2>
              <p className="font-body text-sm text-text-secondary">Hosted by Jamal Reimer</p>
            </div>

            {/* Perforated divider */}
            <div
              className="relative h-5 flex items-center"
              style={{ background: '#0A0A0A' }}
            >
              <div
                className="absolute -left-3 w-6 h-6 rounded-full"
                style={{ background: '#0A0A0A', border: '1px solid rgba(129,89,212,0.22)' }}
              />
              <div
                className="flex-1 border-t-2 border-dashed mx-5"
                style={{ borderColor: 'rgba(129,89,212,0.22)' }}
              />
              <div
                className="absolute -right-3 w-6 h-6 rounded-full"
                style={{ background: '#0A0A0A', border: '1px solid rgba(129,89,212,0.22)' }}
              />
            </div>

            {/* Bottom strip */}
            <div className="p-8" style={{ background: '#111111' }}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary mb-1.5">
                    Date
                  </p>
                  <p className="font-display text-[22px] text-foreground uppercase">April 21, 2026</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary mb-1.5">
                    Time
                  </p>
                  <p className="font-display text-base text-foreground uppercase">
                    12PM EST · 9AM PST
                    <br />
                    5PM UK
                  </p>
                </div>
              </div>
              <p className="font-mono text-[10px] text-text-tertiary leading-relaxed mb-7">
                Enterprise Sales Mentor · Author of Mega Deal Secrets · $160M closed as IC
              </p>
              <a
                href="#"
                className="block w-full py-4 text-center text-white font-display uppercase tracking-[0.14em] text-sm rounded-xl transition-all duration-200 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #8159d4, #6443A8)',
                  boxShadow: '0 4px 20px rgba(100,67,168,0.3)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(129,89,212,0.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(100,67,168,0.3)'; }}
              >
                Access the Live Event Here →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPORTANT ── */}
      <section
        className="py-20 px-6 lg:px-12"
        style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[620px] mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-tertiary mb-5">
            Important
          </p>
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(196,168,255,0.1)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A8FF" strokeWidth="2">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="font-display text-[20px] text-foreground uppercase leading-tight">
                This session is capped to stay interactive.
              </h3>
            </div>
            <p className="font-body text-[15px] text-text-secondary leading-[1.8]">
              Seats lock when the room fills — be there on time. If you miss the live session, the
              replay is available exclusively to{' '}
              <span className="text-foreground font-medium">Whyzer Elite members</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── URGENCY STRIP ── */}
      <UrgencyStrip />

      <MinimalFooter />
    </div>
  );
};

export default LiveSessionConfirmed;

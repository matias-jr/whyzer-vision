import { useEffect } from 'react';
import GrainOverlay from '@/components/whyzer/GrainOverlay';

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
  <div className="relative overflow-hidden" style={{ background: '#6262E9', padding: '6px 0' }}>
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

const CONFIRMATION_HTML = `<style>@media (max-width: 1e+09px) {  #wk_element_5593219dd237183413d27d0e5acd74ac { width: 540px; max-width: 100%; min-height: 16px; padding: 0px; margin: 0px auto; border-style: none; background: rgba(0, 0, 0, 0); }  #wk_element_5593219dd237183413d27d0e5acd74ac_calendar { background: rgb(51, 94, 234); }  #wk_element_45f8e93c3ca45229d03dbfdfd50fb418 { width: 540px; max-width: 100%; min-height: 16px; padding: 0px 16px 16px; margin: 0px auto; border-style: none; background: rgba(0, 0, 0, 0); }  #wk_element_d1217a9bd4050e903e6ed0eb69757d18 { width: 100%; max-width: 100%; min-height: 0px; padding: 0px; margin: 0px; border-style: none; background: rgba(0, 0, 0, 0); font-family: HKGroteskPro, serif; font-size: 16px; line-height: 1.35; letter-spacing: 0px; }  #wk_element_d1217a9bd4050e903e6ed0eb69757d18 :not(:last-child) { margin-bottom: 0px; }  #wk_element_3faa4a3b321e808bea1bb2a1728b1a2b { width: 540px; max-width: 100%; min-height: 16px; padding: 0px; margin: 0px auto 16px; border-style: none; background: rgba(0, 0, 0, 0); }  #wk_element_ef686ab4d9d28244630f2a52414694f4 { max-width: 540px; min-height: 16px; padding: 16px; margin: 0px auto; border-style: solid; border-color: rgb(255, 255, 255); border-width: 0px; border-radius: 16px; background: rgb(255, 255, 255); }  #wk_element_c6dd61bac74fea356fdc37879dfce67d { width: 100%; max-width: 100%; min-height: 0px; padding: 0px; margin: 0px; border-style: none; background: rgba(0, 0, 0, 0); font-family: HKGroteskPro, serif; font-size: 16px; line-height: 1.5; letter-spacing: 0px; display: flex; }  #wk_element_c6dd61bac74fea356fdc37879dfce67d :not(:last-child) { margin-bottom: 0px; }  #wk_element_e8f171a2c4dca2835f2cf81ff6b3ccba { width: 540px; max-width: 100%; min-height: 16px; padding: 0px; margin: 0px auto; border-style: none; background: rgba(0, 0, 0, 0); }  #wk_element_3faa4a3b321e808bea1bb2a1728b1a2b_calendar { background: rgb(51, 94, 234); }}@media (max-width: 992px) {}@media (max-width: 768px) {}</style><div class="wk_root" style="width: 100%; z-index: 100000;"><div class="wk_ascend_tree wk_editor_hide_tooltips col-12 col-md my-auto shadow wk_column" id="wk_element_ef686ab4d9d28244630f2a52414694f4" data-custom-css-classes="shadow" data-wk-background-type="solid" data-wk-border-style="solid" data-wk-border-style-desktop="solid" data-wk-background-type-desktop="solid"> <div class="wk_editor_hide_tooltips wk_thank_you_timer" calendar="hide" data-classes="wk_thank_you_timer" data-wk-date-format-type="en-US" data-wk-days-label="days" data-wk-entering-label="Entering event watch room..." data-wk-expired-label="Sorry, this event session has ended!" data-wk-hours-label="hours" data-wk-minutes-label="minutes" data-wk-seconds-label="seconds" data-wk-starts-in-label="Webinar starts in:" data-wk-webinar-id="6a7b29be3db0318c2bcf6e6a" id="wk_element_3faa4a3b321e808bea1bb2a1728b1a2b" timer_size="large" data-wk-border-style-desktop="default" data-wk-background-type-desktop="default"><div class="wk_row_internal mx-0"><div class="col px-0 wk_timer"><div class="rounded-2 shadow mx-auto wk_calendar" style="max-width: 170px; background: rgb(255, 255, 255); display: none;"><div id="wk_element_3faa4a3b321e808bea1bb2a1728b1a2b_calendar" class="wk_calendar_color" style="border-top-left-radius: 0.375rem; border-top-right-radius: 0.375rem;"><h5 class="fw-bold text-white text-uppercase text-center py-2 wk_calendar_month">August</h5></div><h1 class="fw-bold text-center pb-2 mb-2 wk_calendar_day">18</h1></div><h4 class="text-center mt-5 mb-4 wk_calendar_header" style="display: none;"><i class="fa-regular fa-clock"></i><span class="wk_calendar_time"> 12:09 PM GMT-3</span></h4><h4 class="text-center fw-bold wk_timer_header">Webinar starts in:</h4><div class="wk_row_internal mx-auto wk_timer_row"><div class="col-3"><h2 class="text-center mt-3 mb-0 wk_timer_days">0</h2><h3 class="text-center wk_timer_days_label">days</h3></div><div class="col-3"><h2 class="text-center mt-3 mb-0 wk_timer_hours">0</h2><h3 class="text-center wk_timer_hours_label">hours</h3></div><div class="col-3"><h2 class="text-center mt-3 mb-0 wk_timer_minutes">0</h2><h3 class="text-center wk_timer_minutes_label">minutes</h3></div><div class="col-3"><h2 class="text-center mt-3 mb-0 wk_timer_seconds">0</h2><h3 class="text-center wk_timer_seconds_label">seconds</h3></div></div></div></div></div> <div class="wk_thank_you_session_link" id="wk_element_e8f171a2c4dca2835f2cf81ff6b3ccba" data-classes="wk_thank_you_session_link" data-wk-webinar-id="6a7b29be3db0318c2bcf6e6a" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div class="wk_ascend_tree wk_row_internal mx-0"> <div class="text-center col mx-auto px-0 wk_ascend_tree"> <div class="wk_ascend_tree wk_editor_hide_tooltips wk_text" id="wk_element_c6dd61bac74fea356fdc37879dfce67d" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <h6><b>Your webinar session link:</b></h6> </div> </div> <div class="input-group input-group-lg mt-1"><input class="form-control wk_webinar_session_link" style="background-color: #f1f4f8; border-color: #f1f4f8;" readonly=""><button class="btn wk_copy_link_button" data-bs-container="body" data-bs-content="Link copied to clipboard!" data-bs-original-title="" data-bs-placement="top" data-bs-toggle="popover" style="color: inherit; background-color: rgba(80,102,144,.1)" type="button"><i class="fa-copy far" style="width: 19.125px"></i></button></div> </div> </div> </div> </div></div>`;

const WebinarKitConfirmation = () => {
  useEffect(() => {
    loadCss('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/css/intlTelInput.css');
    loadCss('https://webinarkit.com/css/ewk_v5.css?cache=5');
    loadScript('https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/intlTelInput.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js'))
      .then(() => loadScript('https://webinarkit.com/js/ewk_v7.js?v=7')
      .then(() => loadScript('https://webinarkit.com/js/ewk_i.js?v=1')));
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: CONFIRMATION_HTML }} />;
};

const LiveSessionConfirmed = () => {

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF9' }}>
      <GrainOverlay />
      <MinimalNav />

      {/* ── HERO ── */}
      <section className="wkc-hero relative pt-32 pb-14 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 30%, rgba(98,98,233,0.12) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 max-w-[600px] mx-auto px-6">
          {/* Check icon */}
          <div className="wkc-check flex justify-center mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(98,98,233,0.10)',
                border: '2px solid rgba(89,89,212,0.38)',
                boxShadow: '0 0 32px rgba(89,89,212,0.2)',
              }}
            >
              <svg width="24" height="18" viewBox="0 0 26 20" fill="none">
                <path
                  d="M2 10l7 7L24 2"
                  stroke="#6262E9"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 className="wkc-h1 font-display text-[52px] sm:text-[68px] leading-[1.02] tracking-[-0.02em] text-[#14141F] uppercase mb-7">
            You're officially
            <br />
            <span className="text-[#4A4AD1]">registered.</span>
          </h1>

          <p className="wkc-sub font-body text-[17px] text-[#55556B] leading-[1.75] max-w-[480px] mx-auto">
            Check your inbox. A confirmation with your session link is on its way. Complete the
            steps below before August 26 to get the most out of this session.
          </p>
        </div>
      </section>

      {/* ── WEBINARKIT WIDGET (carries its own countdown) ── */}
      <div className="wkc-widget max-w-2xl mx-auto px-6 pt-4 pb-16">
        <WebinarKitConfirmation />
      </div>

      {/* ── NEXT STEPS ── */}
      <section className="py-28 px-6 lg:px-12" style={{ background: '#FAFAF9' }}>
        <div className="max-w-[800px] mx-auto">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#4A4AD1] mb-4">
            Next Steps
          </p>
          <h2 className="font-display text-[46px] md:text-[58px] text-[#14141F] uppercase tracking-[-0.02em] mb-16">
            Do These <span className="text-[#4A4AD1]">Now.</span>
          </h2>

          <div className="space-y-20">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <span
                  className="font-mono text-[13px] uppercase tracking-[0.22em] font-semibold"
                  style={{ color: '#6262E9' }}
                >
                  Step 1
                </span>
                <div className="h-px flex-1" style={{ background: '#E4E3F0' }} />
              </div>
              <h3 className="font-display text-[28px] text-[#14141F] uppercase mb-5">
                Check Your Inbox.
              </h3>
              <p className="font-body text-[17px] text-[#55556B] leading-[1.8] mb-6">
                Your confirmation email with the session link has just been sent to the address you
                registered with.
              </p>
              <div className="space-y-3 mb-7">
                <div
                  className="flex items-start gap-4 p-5 rounded-xl"
                  style={{ background: '#FFFFFF', border: '1px solid #E4E3F0' }}
                >
                  <span
                    className="font-mono text-[12px] uppercase tracking-wider flex-shrink-0 mt-0.5 px-2 py-0.5 rounded"
                    style={{ background: 'rgba(98,98,233,0.10)', color: '#4A4AD1' }}
                  >
                    Gmail
                  </span>
                  <p className="font-body text-sm text-[#55556B] leading-[1.75]">
                    <span className="text-[#14141F] font-medium">If it's in Promotions:</span> Open
                    it and select "Move to Primary." This ensures you don't miss session reminders or
                    the link on the day.
                  </p>
                </div>
                <div
                  className="flex items-start gap-4 p-5 rounded-xl"
                  style={{ background: '#FFFFFF', border: '1px solid #E4E3F0' }}
                >
                  <span
                    className="font-mono text-[12px] uppercase tracking-wider flex-shrink-0 mt-0.5 px-2 py-0.5 rounded"
                    style={{ background: 'rgba(98,98,233,0.10)', color: '#4A4AD1' }}
                  >
                    Spam
                  </span>
                  <p className="font-body text-sm text-[#55556B] leading-[1.75]">
                    <span className="text-[#14141F] font-medium">If it's in Spam:</span> Open it
                    and click "Not Spam." This will move it to your inbox and make sure future emails
                    come through.
                  </p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[12px] text-[#8A8AA0] uppercase tracking-wider mb-3">
                  Subject line to look for:
                </p>
                <div
                  className="inline-block px-5 py-2.5 rounded-lg"
                  style={{
                    background: 'rgba(89,89,212,0.1)',
                    border: '1px solid rgba(89,89,212,0.25)',
                  }}
                >
                  <span className="font-mono text-sm text-[#4A4AD1]">
                    "You're registered: Stop Sounding Like Everybody Else"
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <span
                  className="font-mono text-[13px] uppercase tracking-[0.22em] font-semibold"
                  style={{ color: '#6262E9' }}
                >
                  Step 2
                </span>
                <div className="h-px flex-1" style={{ background: '#E4E3F0' }} />
              </div>
              <h3 className="font-display text-[28px] text-[#14141F] uppercase mb-3">
                Add It to Your Calendar and Be There Live.
              </h3>
              <p className="font-body text-[17px] text-[#55556B] leading-[1.8] mb-7">
                Block August 26 at 12PM ET now, before you forget. We're going deep on the three-part
                framework elite sellers use to build a Point of View. This isn't a recording you'll
                catch up on later. The live session is where the value is.
              </p>
              {/* Calendar info block */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex flex-col sm:flex-row gap-7 items-start">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📅</span>
                    <div>
                      <p className="font-mono text-[13px] uppercase tracking-wider text-[#8A8AA0] mb-1">
                        Date
                      </p>
                      <p className="font-display text-lg text-[#14141F] uppercase">
                        Wednesday, August 26, 2026
                      </p>
                    </div>
                  </div>
                  <div
                    className="sm:border-l sm:pl-7 flex items-start gap-3"
                    style={{ borderColor: '#E4E3F0' }}
                  >
                    <span className="text-lg mt-0.5">🕛</span>
                    <div>
                      <p className="font-mono text-[13px] uppercase tracking-wider text-[#8A8AA0] mb-1">
                        Time
                      </p>
                      <p className="font-display text-lg text-[#14141F] uppercase">
                        12:00 PM ET · 9:00 AM PT · 5:00 PM UK
                      </p>
                    </div>
                  </div>
                  <div
                    className="sm:border-l sm:pl-7 flex items-start gap-3"
                    style={{ borderColor: '#E4E3F0' }}
                  >
                    <span className="text-lg mt-0.5">📍</span>
                    <div>
                      <p className="font-mono text-[13px] uppercase tracking-wider text-[#8A8AA0] mb-1">
                        Platform
                      </p>
                      <p className="font-display text-lg text-[#14141F] uppercase">
                        Live on this link
                      </p>
                      <p className="font-mono text-[12px] text-[#8A8AA0] mt-0.5">
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
        style={{ background: '#F2F1FB', borderTop: '1px solid #E4E3F0' }}
      >
        <div className="max-w-[480px] mx-auto">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#8A8AA0] text-center mb-10">
            Your Ticket
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(98,98,233,0.28)',
              boxShadow: '0 24px 60px -28px rgba(20,20,31,0.28)',
            }}
          >
            {/* Top strip */}
            <div
              className="p-8 relative"
              style={{ background: 'linear-gradient(160deg, #EEEEFC 0%, #F7F7FE 100%)' }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(98,98,233,0.55), transparent)' }}
              />
              <div className="flex items-start justify-between mb-8">
                <span
                  className="font-mono text-[12px] uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                  style={{ border: '1px solid rgba(98,98,233,0.28)', color: '#4A4AD1' }}
                >
                  Admit One
                </span>
                <div className="opacity-40">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="1" y="1" width="10" height="10" stroke="#6262E9" strokeWidth="1.5"/>
                    <rect x="17" y="1" width="10" height="10" stroke="#6262E9" strokeWidth="1.5"/>
                    <rect x="1" y="17" width="10" height="10" stroke="#6262E9" strokeWidth="1.5"/>
                    <rect x="19" y="19" width="4" height="4" fill="#6262E9"/>
                    <rect x="24" y="19" width="4" height="4" fill="#6262E9"/>
                    <rect x="19" y="24" width="4" height="4" fill="#6262E9"/>
                  </svg>
                </div>
              </div>
              <h2 className="font-display text-[30px] text-[#14141F] uppercase leading-[1.15] mb-3">
                Stop Sounding
                <br />
                <span className="text-[#4A4AD1]">Like Everybody Else</span>
              </h2>
              <p className="font-body text-[13px] text-[#55556B] leading-[1.6] mb-3">
                How top enterprise sellers build a Point of View that opens doors a demo can't
              </p>
              <p className="font-body text-sm text-[#55556B]">Hosted by Jamal Reimer</p>
            </div>

            {/* Perforated divider */}
            <div
              className="relative h-5 flex items-center"
              style={{ background: '#FAFAF9' }}
            >
              <div
                className="absolute -left-3 w-6 h-6 rounded-full"
                style={{ background: '#F2F1FB', border: '1px solid rgba(98,98,233,0.28)' }}
              />
              <div
                className="flex-1 border-t-2 border-dashed mx-5"
                style={{ borderColor: 'rgba(98,98,233,0.28)' }}
              />
              <div
                className="absolute -right-3 w-6 h-6 rounded-full"
                style={{ background: '#F2F1FB', border: '1px solid rgba(98,98,233,0.28)' }}
              />
            </div>

            {/* Bottom strip */}
            <div className="p-8" style={{ background: '#FFFFFF' }}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-mono text-[13px] uppercase tracking-wider text-[#8A8AA0] mb-1.5">
                    Date
                  </p>
                  <p className="font-display text-[25px] text-[#14141F] uppercase">August 26, 2026</p>
                </div>
                <div>
                  <p className="font-mono text-[13px] uppercase tracking-wider text-[#8A8AA0] mb-1.5">
                    Time
                  </p>
                  <p className="font-display text-lg text-[#14141F] uppercase">
                    12PM ET · 9AM PT
                    <br />
                    5PM UK
                  </p>
                </div>
              </div>
              <p className="font-mono text-[12px] text-[#8A8AA0] leading-relaxed mb-7">
                Enterprise Sales Mentor · Author of Mega Deal Secrets · $160M closed as IC
              </p>
              <a
                href="#"
                className="block w-full py-4 text-center text-white font-display uppercase tracking-[0.14em] text-sm rounded-xl transition-all duration-200 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #6262E9, #4A4AD1)',
                  boxShadow: '0 4px 20px rgba(98,98,233,0.16)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(89,89,212,0.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(98,98,233,0.16)'; }}
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
        style={{ background: '#FAFAF9', borderTop: '1px solid #E4E3F0' }}
      >
        <div className="max-w-[620px] mx-auto">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#8A8AA0] mb-5">
            Important
          </p>
          <div
            className="rounded-2xl p-8"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(196,168,255,0.1)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A4AD1" strokeWidth="2">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="font-display text-[23px] text-[#14141F] uppercase leading-tight">
                This session is capped to stay interactive.
              </h3>
            </div>
            <p className="font-body text-[17px] text-[#55556B] leading-[1.8]">
              Seats lock when the room fills, so be there on time. If you miss the live session, the
              replay is available exclusively to{' '}
              <span className="text-[#14141F] font-medium">Whyzer Elite members</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── URGENCY STRIP ── */}
      <UrgencyStrip />

      <MinimalFooter />

      <style>{`
        /* Type hierarchy against the embed. WebinarKit renders "Webinar starts
           in:" as an h4 and the digits as h2, sized by its own stylesheet, so
           the widget competes with the page h1. Pin the widget's internal type
           below the headline and keep it there as everything scales down. */
        .wkc-widget .wk_timer_header { font-size: 17px !important; font-weight: 600 !important; }
        .wkc-widget .wk_timer_row h2 { font-size: 34px !important; line-height: 1.1 !important; margin-top: 10px !important; }
        .wkc-widget .wk_timer_row h3 { font-size: 13px !important; letter-spacing: 0.04em !important; }
        .wkc-widget .wk_thank_you_session_link h6 { font-size: 14px !important; }

        /* The hero h1 is the largest type on the page and stays that way: the
           "Do these now." h2 below runs 46/58px, so the h1 never drops under
           it. On short viewports the widget scales instead and the hero is
           allowed to run past the fold rather than shrinking the headline. */
        @media (orientation: landscape) and (max-height: 900px) {
          .wkc-hero { padding-top: 84px !important; padding-bottom: 28px !important; }
          .wkc-check { margin-bottom: 18px !important; }
          .wkc-widget { padding-bottom: 32px !important; }
          .wkc-widget .wk_timer_header { font-size: 16px !important; }
          .wkc-widget .wk_timer_row h2 { font-size: 30px !important; margin-top: 8px !important; }
          .wkc-widget .wk_timer_row h3 { font-size: 12px !important; }
        }
        @media (orientation: landscape) and (max-height: 760px) {
          .wkc-hero { padding-top: 80px !important; padding-bottom: 24px !important; }
          .wkc-check { margin-bottom: 16px !important; }
          .wkc-widget .wk_timer_header { font-size: 15px !important; }
          .wkc-widget .wk_timer_row h2 { font-size: 26px !important; margin-top: 6px !important; }
          .wkc-widget .wk_timer_row h3 { font-size: 11px !important; }
        }
        /* Portrait phones: the h1 stays the dominant heading; only the widget
           and the surrounding padding come down. */
        @media (orientation: portrait) and (max-width: 640px) {
          .wkc-hero { padding-top: 96px !important; padding-bottom: 24px !important; }
          .wkc-widget { padding-bottom: 32px !important; }
          .wkc-widget .wk_timer_row h2 { font-size: 28px !important; }
          .wkc-widget .wk_timer_row h3 { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
};

export default LiveSessionConfirmed;

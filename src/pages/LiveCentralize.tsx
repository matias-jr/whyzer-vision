import React, { useEffect } from 'react';
import GrainOverlay from '@/components/whyzer/GrainOverlay';

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

const REGISTRATION_HTML = `<style>
.wk_registration_form_element .wk_registration_form_date { display: none !important; }
#wk_element_d94017575195c57e80b94bab113f9bdc,
#wk_element_399409224331983c0bb3717d18e66cc0,
.wk_registration_form, .wk_column {
  background: transparent !important; box-shadow: none !important;
  padding: 0 !important; max-width: 100% !important; border: 0 !important;
}
.wk_registration_form_element .form-control,
.wk_registration_form_element .form-select {
  background-color: #1F2937 !important; background-image: none !important;
  color: #F9FAFB !important; border: 1px solid #2A3447 !important;
  border-radius: 8px !important; font-family: Inter, sans-serif !important;
  font-size: 15px !important; padding: 13px 15px !important; height: auto !important;
}
.wk_registration_form_element .form-control::placeholder { color: #9CA3AF !important; }
.wk_registration_form_element .form-control:focus,
.wk_registration_form_element .form-select:focus {
  border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.25) !important;
  background-color: #1F2937 !important; color: #F9FAFB !important;
}
#wk_element_6aef8c2761d05f7a7fee01f707ee3d9f {
  background: #6366F1 !important; border-color: #6366F1 !important;
  border-radius: 8px !important; font-family: Inter, sans-serif !important;
  font-weight: 700 !important; letter-spacing: 0.03em !important;
  padding: 14px 18px !important; justify-content: center !important; cursor: pointer;
}
#wk_element_6aef8c2761d05f7a7fee01f707ee3d9f p { font-size: 16px !important; }
#wk_element_889d2c8b54ae5001837c2ec42ca72c7e,
#wk_element_889d2c8b54ae5001837c2ec42ca72c7e p {
  color: #9CA3AF !important; font-family: Inter, sans-serif !important;
}
</style>
<div class="wk_root" style="width: 100%; z-index: 100000;"><div class="wk_ascend_tree col-12 col-md my-auto shadow wk_column wk_editor_hide_tooltips" id="wk_element_d94017575195c57e80b94bab113f9bdc" data-custom-css-classes="shadow" data-wk-border-style-desktop="solid" data-wk-background-type-desktop="solid">  <div class="wk_editor_hide_tooltips shadow shadow-none wk_registration_form" id="wk_element_399409224331983c0bb3717d18e66cc0" data-wk-background-type-desktop="solid" data-wk-border-style-desktop="solid" data-wk-enable-instant-watch="false" data-custom-css-classes="shadow-none" data-wk-date-format-type="en-US" data-wk-webinar-id="6a29809f22169e5be0e80bb5"> <form class="wk_ascend_tree wk_registration_form_element"> <select class="mb-3 bg-light form-select form-select-lg wk_registration_form_date" onchange="set_date_text(event,this.value)"></select><input class="wk_registration_form_date_text" type="hidden"><input class="mb-3 bg-light form-control form-control-lg wk_registration_form_first_name" placeholder="First Name" required=""><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_last_name" placeholder="Last Name"><input class="mb-3 bg-light form-control form-control-lg wk_registration_form_email" placeholder="Email" oninput="wk_input_change(this)" type="email" required=""><input class="form-control form-control-lg bg-light mb-3 wk_registration_form_phone d-none" type="tel" placeholder="Phone Number" oninput="wk_input_change(this)"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_1" placeholder="Custom Field 1"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_2" placeholder="Custom Field 2"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_3" placeholder="Custom Field 3"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_4" placeholder="Custom Field 4"><input class="mb-3 bg-light form-control form-control-lg d-none wk_registration_form_custom_field_5" placeholder="Custom Field 5"> <div class="mb-3 d-none mx-0 p-0 wk_registration_form_checkbox wk_row_internal"> <div class="my-auto col-auto"> <div class="wk_checkbox"><input class="wk_checkbox_input" type="checkbox" id="wk_element_399409224331983c0bb3717d18e66cc0_checkbox"></div> </div> <div class="my-auto col"> <div class="wk_editor_hide_tooltips wk_text" id="wk_element_889d2c8b54ae5001837c2ec42ca72c7e" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <p>I consent to receiving emails and/or text message reminders for this event.</p> </div> </div> </div> </div> <div class="wk_editor_hide_tooltips wk_button btn btn-lg wk_button_hide_settings" id="wk_element_6aef8c2761d05f7a7fee01f707ee3d9f" data-wk-background-type-desktop="solid" data-wk-border-style-desktop="solid" onclick="webinar_registration_submit(event)"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <p><b>REGISTER NOW</b></p> </div> </div> </form> </div> </div></div>`;

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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const learnItems = [
  {
    title: "Read the account's financials",
    body: 'Surface what the executive cares about before your first call.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" />
      </svg>
    ),
  },
  {
    title: 'Build outreach that earns attention',
    body: 'Turn financial intelligence into messaging a senior stakeholder responds to.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Navigate the buying organization',
    body: 'Understand who holds influence and how to build across the account.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const whoItems = [
  {
    title: 'Enterprise AEs & SAMs',
    body: "You're working 6–18 month deals and you know the CFO conversation is where they close or stall.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'SDRs & BDRs targeting senior buyers',
    body: "You need a reason for an executive to respond. Generic personalization isn't it.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    title: 'Revenue Leaders',
    body: 'Your team is getting stuck below the decision level. This session shows them how to move up.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

const whyzerDemoItems = ['Executive-level account research', 'Strategic business insights', 'POV creation', 'Faster account preparation'];
const centralizeDemoItems = ['Org chart visibility', 'Stakeholder mapping', 'Buying committee insights', 'Multi-threading opportunities'];

const ACCENT = '#6366F1';
const ACCENT_2 = '#818CF8';
const CARD = '#111827';
const BORDER = '#1F2937';
const BORDER_2 = '#232C3F';
const MUTED = '#9CA3AF';

const LiveCentralize = () => (
  <div className="min-h-screen" style={{ background: '#0A0E1A', color: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>
    <GrainOverlay />

    {/* NAV */}
    <header style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 5 }}>
      <img src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png" alt="Whyzer" style={{ height: 30, width: 'auto' }} />
      <span style={{ fontSize: 13, fontWeight: 500, color: MUTED, letterSpacing: '0.04em' }}>Whyzer × Centralize</span>
    </header>

    {/* HERO */}
    <section id="registration-form" style={{ position: 'relative', minHeight: 'calc(100vh - 74px)', display: 'flex', alignItems: 'center', padding: '60px 0 90px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(620px 500px at 78% 18%, rgba(139,92,246,0.22), transparent 60%), radial-gradient(560px 480px at 96% 42%, rgba(34,211,238,0.14), transparent 60%), radial-gradient(700px 600px at 30% 90%, rgba(99,102,241,0.12), transparent 65%)' }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="lc-hero-grid">
          {/* LEFT */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 18px' }}>Free Live Webinar</p>
            <h1 style={{ fontSize: 'clamp(40px, 5.4vw, 64px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, margin: '0 0 12px', textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
              How to Break<br />Through to<br />Executives:
            </h1>
            <p style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, color: ACCENT, letterSpacing: '-0.01em', lineHeight: 1.04, margin: '0 0 20px' }}>Whyzer + Centralize</p>
            <div style={{ width: 64, height: 3, borderRadius: 2, background: ACCENT, margin: '0 0 26px' }} />
            <p style={{ fontSize: 18, color: MUTED, maxWidth: 470, margin: '0 0 34px', lineHeight: 1.55 }}>
              A better way to show up with a point of view that starts conversations and drives impact.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, maxWidth: 470, padding: '18px 0', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 17, fontWeight: 700 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT_2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                <span>June 16, 2026</span>
              </div>
              <div style={{ width: 1, height: 28, background: BORDER_2 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 17, fontWeight: 700 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT_2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                <span>12:00 PM ET</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: MUTED, margin: '22px 0 0', letterSpacing: '0.01em' }}>
              Hosted by <strong style={{ color: '#F9FAFB' }}>Whyzer</strong> &amp; <strong style={{ color: '#F9FAFB' }}>Centralize</strong> · Free to attend
            </p>
          </div>

          {/* RIGHT: FORM CARD */}
          <div style={{ background: CARD, border: `1px solid ${BORDER_2}`, borderRadius: 16, padding: '26px 24px 24px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -1, borderRadius: 16, pointerEvents: 'none', background: 'linear-gradient(160deg, rgba(99,102,241,0.45), transparent 45%)', WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: 1 }} />
            <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Save your spot</p>
            <p style={{ fontSize: 14, color: MUTED, margin: '0 0 18px' }}>Reserve your seat — it's free.</p>
            <WebinarKitRegistration />
          </div>
        </div>
      </div>
    </section>

    <hr style={{ height: 1, border: 0, margin: 0, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)' }} />

    {/* WHAT YOU'LL LEARN */}
    <section style={{ padding: '104px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 18px' }}>What You'll Learn</p>
        <h2 style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 22px' }}>
          What it actually takes to earn an executive conversation in 2026
        </h2>
        <p style={{ fontSize: 17, color: MUTED, maxWidth: 760, margin: 0, lineHeight: 1.6 }}>
          We'll cover how to read what a company's financial situation tells you about what an executive cares about right now. How to turn that intelligence into outreach that earns a response. How to run the conversation itself so you're engaging at the level of business strategy, not product features. And how to map a buying organization so you're never dependent on one contact.
        </p>
        <div className="lc-learn-grid">
          {learnItems.map((item, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '28px 26px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', color: ACCENT_2, marginBottom: 20 }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* SPEAKERS */}
    <section style={{ background: '#0C111F', position: 'relative', overflow: 'hidden', padding: '110px 0 120px', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(820px 320px at 50% 2%, rgba(124,92,246,0.20), transparent 64%), radial-gradient(1320px 520px at 50% -8%, rgba(99,102,241,0.13), transparent 72%)' }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 18px' }}>The Speakers</p>
        <h2 style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 14px' }}>Three operators who've earned the room</h2>
        <p style={{ color: MUTED, fontSize: 17, margin: '0 0 70px' }}>Live, practical, and built on real executive conversations.</p>

        <div className="lc-speaker-row">
          {/* Beam arc */}
          <div aria-hidden="true" style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', left: '50%', top: -100, transform: 'translateX(-50%)', width: 940, height: 300, background: 'radial-gradient(ellipse 50% 100% at 50% 100%, transparent 0 79%, rgba(196,181,253,0.45) 79.6%, rgba(139,92,246,0.8) 80.1%, rgba(139,92,246,0) 81.8%)', filter: 'blur(0.5px) drop-shadow(0 0 5px rgba(139,92,246,0.5)) drop-shadow(0 0 18px rgba(124,92,246,0.28))' }} />

          {/* Speaker 1 — Jamal */}
          <SpeakerCard role="Speaker" name="Jamal Reimer" title="Co-founder & CEO" photo="/jamal-hero.png" brand="WHYZER" brandVariant="whyzer" />

          {/* Host — Mike (center, taller) */}
          <SpeakerCard role="Host" name="Mike Fiascone" title="Sales Accelerator · Ex-DocuSign · Ex-Oracle" photo="/mike.png" isHost />

          {/* Speaker 2 — Rachit */}
          <SpeakerCard role="Speaker" name="Rachit Kataria" title="Co-founder & CEO" photo="/rachit.png" brand="centralize" brandVariant="centralize" />
        </div>
      </div>
    </section>

    {/* WHO IT'S FOR */}
    <section style={{ padding: '110px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 18px' }}>Who It's For</p>
        <h2 style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 60px' }}>
          Built for sellers who need to reach the executive level
        </h2>
        <div className="lc-who-grid">
          {whoItems.map((item, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '30px 28px', textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.26)', color: ACCENT_2, marginBottom: 22 }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 10px' }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ABOUT THE PLATFORMS */}
    <section style={{ padding: '104px 0', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 18px' }}>About the Platforms</p>
          <h2 style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '14px 0 0' }}>Whyzer + Centralize</h2>
        </div>
        <div className="lc-about-grid">
          {/* WHYZER */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '38px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
              <img src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png" alt="Whyzer" style={{ height: 26, width: 'auto' }} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.45, margin: '0 0 14px' }}>Whyzer helps sellers understand what matters inside an account.</p>
            <p style={{ fontSize: 15.5, color: MUTED, lineHeight: 1.62, margin: '0 0 28px' }}>By surfacing executive priorities, company initiatives, market pressures, and strategic context, Whyzer helps revenue teams create stronger points of view and more impactful outreach.</p>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 16px' }}>What you'll see during the demo</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {whyzerDemoItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15.5, color: '#F9FAFB' }}>
                  <span style={{ color: ACCENT_2, flexShrink: 0 }}><CheckIcon /></span>{item}
                </li>
              ))}
            </ul>
          </div>

          {/* CENTRALIZE */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '38px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
              <img src="/centralize-logo.png" alt="Centralize" style={{ height: 26, width: 'auto' }} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.45, margin: '0 0 14px' }}>Centralize helps sellers understand the people inside an account.</p>
            <p style={{ fontSize: 15.5, color: MUTED, lineHeight: 1.62, margin: '0 0 28px' }}>By mapping reporting structures, stakeholder relationships, and buying committees, Centralize provides the visibility needed to navigate complex sales opportunities.</p>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 16px' }}>What you'll see during the demo</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {centralizeDemoItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15.5, color: '#F9FAFB' }}>
                  <span style={{ color: ACCENT_2, flexShrink: 0 }}><CheckIcon /></span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* FOOTER CTA */}
    <section style={{ background: CARD, borderTop: `1px solid ${BORDER}`, textAlign: 'center', padding: '96px 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(32px, 3.6vw, 46px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 16px' }}>Register for June 16</h2>
        <p style={{ color: MUTED, fontSize: 18, margin: '0 0 34px' }}>June 16, 2026 · 12:00 PM ET · Free</p>
        <a href="#registration-form" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: ACCENT, color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '0.03em', padding: '16px 34px', borderRadius: 10, border: `1px solid ${ACCENT}`, textDecoration: 'none' }}>
          Save Your Spot
        </a>
        <p style={{ color: MUTED, fontSize: 14, margin: '24px 0 0' }}>Hosted by Whyzer and Centralize</p>
      </div>
    </section>

    <style>{`
      .lc-hero-grid { display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 96px; align-items: center; }
      .lc-learn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 52px; }
      .lc-who-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; text-align: left; }
      .lc-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 54px; }
      .lc-speaker-row { display: grid; grid-template-columns: 1fr 1.12fr 1fr; gap: 26px; align-items: end; position: relative; max-width: 980px; margin: 0 auto; }
      @media (max-width: 980px) {
        .lc-hero-grid { grid-template-columns: 1fr; gap: 44px; }
        .lc-learn-grid, .lc-who-grid { grid-template-columns: 1fr; }
        .lc-about-grid { grid-template-columns: 1fr; }
        .lc-speaker-row { grid-template-columns: 1fr; gap: 54px; max-width: 380px; }
      }
      @media (max-width: 768px) {
        header, .lc-hero-grid, .lc-learn-grid, .lc-who-grid, .lc-about-grid { padding-left: 20px; padding-right: 20px; }
      }
    `}</style>
  </div>
);

interface SpeakerCardProps {
  role: string;
  name: string;
  title: string;
  photo?: string;
  brand?: string;
  brandVariant?: 'whyzer' | 'centralize';
  isHost?: boolean;
}

const SpeakerCard = ({ role, name, title, photo, brand, brandVariant, isHost = false }: SpeakerCardProps) => (
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div style={{ position: 'relative', width: '100%', aspectRatio: isHost ? '280/410' : '280/360', background: '#1F2937', border: `1px solid ${BORDER_2}`, borderRadius: 16, overflow: 'hidden' }}>
      {photo
        ? <img src={photo} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        : <span style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', fontSize: 11, letterSpacing: '0.22em', color: '#3a455c', fontWeight: 600 }}>PHOTO</span>
      }
      <div style={{ position: 'absolute', left: 14, bottom: 14, right: 14, background: 'rgba(11,16,28,0.74)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: ACCENT_2, textTransform: 'uppercase', margin: '0 0 5px' }}>{role}</p>
        <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.01em', color: '#fff', margin: 0, textTransform: 'uppercase' }}>{name}</p>
        <div style={{ height: 2, width: 38, background: ACCENT, borderRadius: 2, margin: '9px 0' }} />
        <p style={{ fontSize: 13, color: MUTED, margin: '0 0 10px', lineHeight: 1.4 }}>{title}</p>
        {brand && brandVariant === 'whyzer' && (
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.14em', color: '#fff' }}>{brand}</span>
        )}
        {brand && brandVariant === 'centralize' && (
          <img src="/centralize-logo.png" alt="Centralize" style={{ height: 16, width: 'auto', opacity: 0.9 }} />
        )}
      </div>
    </div>
  </div>
);

export default LiveCentralize;

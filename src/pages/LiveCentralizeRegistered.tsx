import { useEffect } from 'react';
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

const CONFIRMATION_HTML = `<style>
#wk_element_ef686ab4d9d28244630f2a52414694f4 {
  background: #111827 !important; border: 1px solid #232C3F !important;
  border-radius: 16px !important; box-shadow: none !important; max-width: 520px !important;
}
.wk_timer_header { color: #9CA3AF !important; font-weight: 700 !important; letter-spacing: 0.03em !important; }
.wk_timer_row h5 { color: #fff !important; font-weight: 800 !important; }
.wk_timer_row h6 { color: #9CA3AF !important; font-weight: 500 !important; }
.wk_thank_you_session_link h6 { color: #F9FAFB !important; }
.wk_webinar_session_link { background-color: #1F2937 !important; border-color: #2A3447 !important; color: #F9FAFB !important; }
.wk_copy_link_button { background-color: rgba(99,102,241,0.16) !important; color: #818CF8 !important; border: 1px solid #2A3447 !important; }
</style>
<div class="wk_root" style="width: 100%; z-index: 100000;"><div class="wk_ascend_tree wk_editor_hide_tooltips col-12 col-md my-auto shadow wk_column" id="wk_element_ef686ab4d9d28244630f2a52414694f4" data-custom-css-classes="shadow" data-wk-background-type="solid" data-wk-border-style="solid" data-wk-border-style-desktop="solid" data-wk-background-type-desktop="solid"> <div class="wk_editor_hide_tooltips wk_thank_you_timer" calendar="hide" data-classes="wk_thank_you_timer" data-wk-date-format-type="en-US" data-wk-days-label="days" data-wk-entering-label="Entering event watch room..." data-wk-expired-label="Sorry, this event session has ended!" data-wk-hours-label="hours" data-wk-minutes-label="minutes" data-wk-seconds-label="seconds" data-wk-starts-in-label="Webinar starts in:" data-wk-webinar-id="6a29809f22169e5be0e80bb5" id="wk_element_3faa4a3b321e808bea1bb2a1728b1a2b" timer_size="small" data-wk-border-style-desktop="default" data-wk-background-type-desktop="default"> <div class="wk_row_internal mx-0"> <div class="wk_timer px-0 col"> <div class="rounded-2 mx-auto shadow wk_calendar" style="max-width:170px; background: #fff; display: none"> <div class="wk_calendar_color" style="border-top-left-radius: .375rem; border-top-right-radius: .375rem; background: #6366F1;"> <h5 class="text-center fw-bold py-2 text-uppercase text-white wk_calendar_month">June</h5> </div> <h1 class="text-center fw-bold mb-2 pb-2 wk_calendar_day">16</h1> </div> <h5 class="text-center mb-4 mt-5 wk_calendar_header" style="display:none"></h5> <h6 class="text-center fw-bold wk_timer_header">Webinar starts in:</h6> <div class="wk_row_internal mx-auto wk_timer_row"> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_days">0</h5> <h6 class="text-center mb-0 wk_timer_days_label">days</h6> </div> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_hours">0</h5> <h6 class="text-center mb-0 wk_timer_hours_label">hours</h6> </div> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_minutes">0</h5> <h6 class="text-center mb-0 wk_timer_minutes_label">minutes</h6> </div> <div class="px-0 col-3"> <h5 class="text-center mb-0 wk_timer_seconds">0</h5> <h6 class="text-center mb-0 wk_timer_seconds_label">seconds</h6> </div> </div> </div> </div> </div> <div class="wk_thank_you_session_link" id="wk_element_e8f171a2c4dca2835f2cf81ff6b3ccba" data-classes="wk_thank_you_session_link" data-wk-webinar-id="6a29809f22169e5be0e80bb5" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div class="wk_ascend_tree wk_row_internal mx-0"> <div class="text-center col mx-auto px-0 wk_ascend_tree"> <div class="wk_ascend_tree wk_editor_hide_tooltips wk_text" id="wk_element_c6dd61bac74fea356fdc37879dfce67d" data-wk-background-type-desktop="default" data-wk-border-style-desktop="default"> <div contenteditable="false" style="width: 100%; margin-top: auto; margin-bottom: auto;"> <h6><b>Your webinar session link:</b></h6> </div> </div> <div class="input-group input-group-lg mt-1"><input class="form-control wk_webinar_session_link" style="background-color: #1F2937; border-color: #2A3447; color: #F9FAFB;" readonly=""><button class="btn wk_copy_link_button" data-bs-container="body" data-bs-content="Link copied to clipboard!" data-bs-original-title="" data-bs-placement="top" data-bs-toggle="popover" style="background-color: rgba(99,102,241,0.16); color: #818CF8; border: 1px solid #2A3447;" type="button"><i class="fa-copy far" style="width: 19.125px"></i></button></div> </div> </div> </div> </div></div>`;

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

const ACCENT = '#6366F1';
const ACCENT_2 = '#818CF8';
const CARD = '#111827';
const BORDER = '#1F2937';
const BORDER_2 = '#232C3F';
const MUTED = '#9CA3AF';
const MONO = `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace`;

const coverItems = [
  'How to read an account\'s financial situation and identify what an executive cares about right now',
  'How to build outreach that earns a response from a senior stakeholder',
  'How to run an executive conversation from a position of business insight',
  'How to navigate a complex buying organization and build multi-threaded relationships',
  'How Whyzer accelerates account research from hours to minutes',
  'How Centralize maps stakeholders and buying committees',
];

const LiveCentralizeRegistered = () => (
  <div className="min-h-screen" style={{ background: '#0A0E1A', color: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>
    <GrainOverlay />

    {/* NAV */}
    <header style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 32px', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 5 }}>
      <img src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png" alt="Whyzer" style={{ height: 30, width: 'auto' }} />
    </header>

    {/* CONFIRMATION HERO */}
    <section style={{ position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '90px 0 96px' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(600px 460px at 50% 0%, rgba(99,102,241,0.22), transparent 60%), radial-gradient(520px 420px at 72% 26%, rgba(34,211,238,0.12), transparent 62%), radial-gradient(520px 420px at 28% 26%, rgba(139,92,246,0.14), transparent 62%)' }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        {/* Check */}
        <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.4)', boxShadow: '0 0 0 8px rgba(99,102,241,0.06), 0 18px 50px -16px rgba(99,102,241,0.7)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT_2} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 40, height: 40 }}>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 style={{ fontSize: 'clamp(44px, 5.4vw, 68px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 18px' }}>You're in.</h1>
        <p style={{ fontSize: 19, fontWeight: 600, margin: '0 auto 22px', maxWidth: 620, lineHeight: 1.4 }}>
          How to Break Through to Executives: Whyzer × Centralize
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: CARD, border: `1px solid ${BORDER_2}`, fontSize: 14, fontWeight: 600, padding: '9px 16px', borderRadius: 999, marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, boxShadow: '0 0 0 4px rgba(99,102,241,0.18)', flexShrink: 0 }} />
          June 16, 2026 · 12:00 PM ET
        </div>
        <p style={{ fontSize: 16.5, color: MUTED, maxWidth: 520, margin: '0 auto 0' }}>
          A confirmation email and calendar invite are headed to your inbox.
        </p>

        {/* WebinarKit block */}
        <div style={{ marginTop: 38, display: 'flex', justifyContent: 'center' }}>
          <WebinarKitConfirmation />
        </div>
      </div>
    </section>

    <hr style={{ height: 1, border: 0, margin: 0, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)' }} />

    {/* NEXT STEPS */}
    <section style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ marginBottom: 66 }}>
          <p style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 20px' }}>Next Steps</p>
          <h2 style={{ fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1, margin: 0 }}>
            Do these <span style={{ color: ACCENT }}>now.</span>
          </h2>
        </div>

        {/* Step 1 */}
        <div style={{ marginBottom: 58 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT_2, marginBottom: 24 }}>
            Step 1
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <h3 style={{ fontSize: 'clamp(23px, 2.6vw, 30px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: '0 0 14px' }}>Check your inbox.</h3>
          <p style={{ fontSize: 16.5, color: MUTED, maxWidth: 740, margin: '0 0 26px', lineHeight: 1.6 }}>
            Your confirmation email and session link have just been sent to the address you registered with. Open it now so the link is easy to find on the day.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 860, marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 20px' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', color: ACCENT_2, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 6, padding: '5px 9px', flexShrink: 0, marginTop: 1 }}>Gmail</span>
              <p style={{ margin: 0, fontSize: 15.5, color: MUTED, lineHeight: 1.55 }}>
                <strong style={{ color: '#F9FAFB', fontWeight: 700 }}>If it's in Promotions:</strong> Open it and move it to Primary so you don't miss session reminders or the link on the day.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 20px' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', color: ACCENT_2, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 6, padding: '5px 9px', flexShrink: 0, marginTop: 1 }}>Spam</span>
              <p style={{ margin: 0, fontSize: 15.5, color: MUTED, lineHeight: 1.55 }}>
                <strong style={{ color: '#F9FAFB', fontWeight: 700 }}>If it's in Spam:</strong> Open it and mark it "Not Spam." This moves it to your inbox and makes sure future emails come through.
              </p>
            </div>
          </div>
          <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, margin: '0 0 12px' }}>Subject line to look for:</p>
          <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: ACCENT_2, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '12px 16px' }}>
            "You're registered: How to Break Through to Executives"
          </span>
        </div>

        {/* Step 2 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT_2, marginBottom: 24 }}>
            Step 2
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <h3 style={{ fontSize: 'clamp(23px, 2.6vw, 30px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: '0 0 14px' }}>Add it to your calendar.</h3>
          <p style={{ fontSize: 16.5, color: MUTED, maxWidth: 740, margin: '0 0 26px', lineHeight: 1.6 }}>
            Block out the time now so the session doesn't slip. A calendar invite is included in your confirmation email — accept it and you're set.
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 14, color: '#fff', fontWeight: 600, letterSpacing: '0.02em', background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '12px 16px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT_2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            June 16, 2026 · 12:00 PM ET
          </span>
        </div>
      </div>
    </section>

    {/* WHAT WE'LL COVER */}
    <section style={{ background: '#0C111F', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '96px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 18px' }}>The Agenda</p>
        <h2 style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 22px' }}>What we'll cover</h2>
        <div className="lcr-cover-grid">
          {coverItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 0', borderBottom: `1px solid ${BORDER}` }} className="lcr-cover-item">
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: ACCENT_2 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* SPEAKERS */}
    <section style={{ background: '#0C111F', position: 'relative', overflow: 'hidden', padding: '110px 0 120px', borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(680px 520px at 50% 8%, rgba(99,102,241,0.18), transparent 62%)' }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT_2, margin: '0 0 18px' }}>The Speakers</p>
        <h2 style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 14px' }}>Three operators who've earned the room</h2>
        <p style={{ color: MUTED, fontSize: 17, margin: '0 0 70px' }}>Live, practical, and built on real executive conversations.</p>

        <div className="lcr-speaker-row">
          {/* Conic arc beam */}
          <div aria-hidden="true" style={{ content: '', position: 'absolute', zIndex: 0, left: '50%', top: -46, transform: 'translateX(-50%)', width: 560, height: 560, borderRadius: '50%', background: 'conic-gradient(from 200deg, transparent 0deg, rgba(139,92,246,0.0) 40deg, #8B5CF6 130deg, #6366F1 230deg, transparent 320deg)', WebkitMask: 'radial-gradient(circle, transparent 68%, #000 69%, #000 70%, transparent 71%)', mask: 'radial-gradient(circle, transparent 68%, #000 69%, #000 70%, transparent 71%)', filter: 'blur(1px) drop-shadow(0 0 14px rgba(139,92,246,0.55))', pointerEvents: 'none' }} />

          {/* Jamal */}
          <SpeakerCard role="Speaker" name="Jamal Reimer" title="Co-founder & CEO" photo="/jamal-centralize.png" brand="WHYZER" brandVariant="whyzer" />
          {/* Mike (host) */}
          <SpeakerCard role="Host" name="Mike Fiascone" title="Sales Accelerator · Ex-DocuSign · Ex-Oracle" photo="/mike-1.png" photoScale={1.15} isHost />
          {/* Rachit */}
          <SpeakerCard role="Speaker" name="Rachit Kataria" title="Co-founder & CEO" photo="/rachit-1.png" brand="centralize" brandVariant="centralize" />
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer style={{ textAlign: 'center', padding: '70px 32px', background: '#0A0E1A' }}>
      <img src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png" alt="Whyzer" style={{ height: 28, width: 'auto', margin: '0 auto 18px' }} />
      <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>whyzer.ai · © 2026</p>
    </footer>

    <style>{`
      .lcr-cover-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; margin-top: 48px; }
      .lcr-cover-item:nth-last-child(-n+2) { border-bottom: 0; }
      .lcr-speaker-row { display: grid; grid-template-columns: 1fr 1.12fr 1fr; gap: 26px; align-items: end; position: relative; max-width: 980px; margin: 0 auto; }
      @media (max-width: 980px) {
        .lcr-cover-grid { grid-template-columns: 1fr; }
        .lcr-cover-item:nth-last-child(-n+2) { border-bottom: 1px solid #1F2937; }
        .lcr-cover-item:last-child { border-bottom: 0; }
        .lcr-speaker-row { grid-template-columns: 1fr; gap: 54px; max-width: 380px; }
      }
    `}</style>
  </div>
);

interface SpeakerCardProps {
  role: string;
  name: string;
  title: string;
  photo?: string;
  photoScale?: number;
  brand?: string;
  brandVariant?: 'whyzer' | 'centralize';
  isHost?: boolean;
}

const SpeakerCard = ({ role, name, title, photo, photoScale = 1, brand, brandVariant, isHost = false }: SpeakerCardProps) => (
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div style={{ position: 'relative', width: '100%', aspectRatio: isHost ? '280/410' : '280/360', background: '#1F2937', border: `1px solid ${BORDER_2}`, borderRadius: 16, overflow: 'hidden' }}>
      {photo
        ? <img src={photo} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: `scale(${photoScale})`, transformOrigin: 'center top' }} />
        : <span style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', fontSize: 11, letterSpacing: '0.22em', color: '#3a455c', fontWeight: 600 }}>PHOTO</span>
      }
      <div style={{ position: 'absolute', left: 14, bottom: 14, right: 14, background: 'rgba(11,16,28,0.74)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: ACCENT_2, textTransform: 'uppercase', margin: '0 0 5px' }}>{role}</p>
        <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.01em', color: '#fff', margin: 0, textTransform: 'uppercase' }}>{name}</p>
        <div style={{ height: 2, width: 38, background: ACCENT, borderRadius: 2, margin: '9px 0' }} />
        <p style={{ fontSize: 13, color: MUTED, margin: '0 0 10px', lineHeight: 1.4 }}>{title}</p>
        {brand && brandVariant === 'whyzer' && (
          <img src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png" alt="Whyzer" style={{ height: 18, width: 'auto' }} />
        )}
        {brand && brandVariant === 'centralize' && (
          <img src="/centralize-small.png" alt="Centralize" style={{ height: 18, width: 'auto', opacity: 0.9 }} />
        )}
      </div>
    </div>
  </div>
);

export default LiveCentralizeRegistered;

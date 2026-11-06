import { useEffect, useState } from 'react';
import { Bf26Footer, Bf26Shell, Tiles, useCountdown, useLocalTime } from './shared';

// ── Edit these ───────────────────────────────────────────────────────────────
/** Sender address of the Nov 25 email; this is the one to add to contacts. */
const SENDER_EMAIL = 'jamal@whyzer.ai';
/** One line on the webinar topic. */
const WEBINAR_BLURB = "Learn how top enterprise sellers build a Point of View that opens doors a demo can't.";
/** Sign-up page for the Nov 18 webinar. */
const WEBINAR_URL = 'https://www.whyzer.ai/live-session';
// ─────────────────────────────────────────────────────────────────────────────

/** Reads a query param from the form redirect (?first_name=Sarah&account=Siemens), stripped and capped. */
const param = (key: string) =>
  (new URLSearchParams(window.location.search).get(key) || '').replace(/[<>"'`]/g, '').trim().slice(0, 60);

const BlackFridayThankYou = () => {
  const cd = useCountdown();
  const local = useLocalTime();

  // Personalization from the redirect. Read after mount so prerendered HTML matches the first client render.
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  useEffect(() => {
    setName(param('first_name') || param('name'));
    setAccount(param('account'));
  }, []);
  const headline = name ? `You're on the list, ${name}.` : "You're on the list.";

  return (
    <Bf26Shell
      noindex
      title="Whyzer BF26 Thank You"
      description="You're on the private Whyzer Black Friday list. Early access opens Wed Nov 25."
    >
      <header className="hero">
        <span className="glow" aria-hidden="true"></span>
        <div className="wrap">
          <div className="ty-top">
            <img className="logo" src="/bf26/logo-white.png" alt="Whyzer" width="104" height="26" />
            <span className="mono">BF26 · Private list</span>
          </div>
          <div className="ty-grid">
            <div className="hero-copy">
              <span className="pill ok-pill rise d1"><span className="ok-mark" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3L9.5 3.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>On the list</span>
              <h1 className="rise d2">{headline}</h1>
              <p className="sub rise d3">On <b>Wed Nov 25</b> you get our Black Friday annual pricing before anyone else. Remember: 50 seats, first come, first served by purchase.</p>
              <div className="count-block rise d4">
                <span className="k">Early access opens in</span>
                <Tiles cd={cd} onToggle={local.toggle} title={local.title} label="Show the opening time in your time zone" seps />
                <span className="local">{local.line}</span>
              </div>
            </div>

            <div className="group-card rise d3" aria-labelledby="group-h">
              <span className="eyebrow">One more step</span>
              <h2 id="group-h">The group hears first.</h2>
              <div className="copy">
                <p>On Nov 25, codes go to the private WhatsApp group first. Email follows within the hour.</p>
                <p><strong>When there are only 50 seats, an hour matters.</strong></p>
                <p>Announcements only. Admins post, you read. No chatter, no notifications every five minutes.</p>
              </div>
              <div className="chat" aria-hidden="true">
                <span className="wa"><img src="/bf26/whatsapp-icon.png" alt="" /></span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div className="meta"><b>Whyzer Early Access</b><span className="mono">Nov 25, 9:00</span></div>
                  <div className="bubble">Early access is live. Your code: <span className="code">••••••</span><span className="typing"><i></i><i></i><i></i></span></div>
                </div>
              </div>
              <div className="join">
                <div className="join-cta">
                  <a className="btn btn-block btn-wa" href="https://chat.whatsapp.com/FWyccLugpOm3VgRVUxablY" target="_blank" rel="noopener"><svg><use href="#i-chat" /></svg>Join on WhatsApp <span className="arr">→</span></a>
                </div>
                <div className="qr-box">
                  <div className="qr-frame"><img className="qr" src="/bf26/whatsapp-group-qr.svg" alt="QR code to join the Whyzer Early Access WhatsApp group" width="33" height="33" /></div>
                  <span>Scan on your phone</span>
                </div>
              </div>
              <span className="group-foot">After the sale, the group stays open for live event announcements.</span>
            </div>
          </div>
        </div>
      </header>

      <main>
      <section className="band" aria-labelledby="next-h">
        <div className="wrap next-grid">
          <div className="stack" style={{ gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="eyebrow">Timeline</span>
              <h2 className="h2" id="next-h">What happens next</h2>
            </div>
            <ol className="tl">
              <li className="done"><span className="pt" aria-hidden="true"></span><div><div className="when">Today</div><div className="what">You joined the private list.</div></div></li>
              <li className="now"><span className="pt" aria-hidden="true"></span><div><div className="when">Now to Nov 24</div><div className="what">A couple of emails from us: one seller's story, then exactly what's included.</div></div></li>
              <li><span className="pt" aria-hidden="true"></span><div><div className="when">Mon Nov 23</div><div className="what">Heads up: early access is Wednesday.</div></div></li>
              <li className="key"><span className="pt" aria-hidden="true"></span><div><div className="when">Wed Nov 25, 9:00 AM ET <span className="tag">50 seats</span></div><div className="what">Pricing and codes go out. Group first, email within the hour.</div></div></li>
              <li><span className="pt" aria-hidden="true"></span><div><div className="when">Wed Dec 2, midnight ET</div><div className="what">Everything closes. No extensions.</div></div></li>
            </ol>
          </div>

          <div className="side-stack">
            <div className="pov" hidden={!account}>
              <span className="k">Your first POV</span>
              <span style={{ fontSize: '15px' }}>You said</span>
              <span className="acct">{account}</span>
              <p>That's your first POV. On Nov 25, you can walk into <span>{account}</span> with their financials, priorities and stated risks already mapped. Start thinking about who you need to reach there.</p>
            </div>
            <div className="pov" hidden={!!account}>
              <span className="k">Your first POV</span>
              <span className="big2">Pick your Q1 account now.</span>
              <p>On Nov 25, it's the first POV you build.</p>
            </div>
            <div className="mini">
              <span className="ico" aria-hidden="true"><svg><use href="#i-mail" /></svg></span>
              <p>Add <span className="mono">{SENDER_EMAIL}</span> to your contacts so the Nov 25 email doesn't land in Promotions.</p>
            </div>
            <div className="webinar">
              <span className="eyebrow" style={{ color: 'var(--ink-subtle)' }}>Before Nov 25</span>
              <h3>How to sound like no one else</h3>
              <p>Live webinar, Wed Nov 18. {WEBINAR_BLURB}</p>
              <a className="btn-ghost" href={WEBINAR_URL}>Save my spot <span className="arr">→</span></a>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Bf26Footer />
    </Bf26Shell>
  );
};

export default BlackFridayThankYou;

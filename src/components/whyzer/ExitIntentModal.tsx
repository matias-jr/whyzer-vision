import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'whyzer_exit_intent_seen';
const WEBINAR_URL = 'https://www.whyzer.ai/financial-fluency';

/**
 * Exit-intent modal for the home page.
 *
 * Fires once per session when the visitor signals they are leaving: the pointer
 * exits through the top of the viewport, or the tab is hidden. Armed after a
 * short dwell so an instant bounce is not interrupted.
 */
const ExitIntentModal = () => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<Element | null>(null);

  const dismiss = () => {
    setOpen(false);
    if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
  };

  useEffect(() => {
    // Session-scoped, not permanent: the modal shows once per browsing session
    // so a returning visitor can see it again, but it never nags twice in a row.
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      /* private mode: fall back to once per page load */
    }
    if (seen) return;

    // Arm after a short dwell so an instant bounce is not interrupted.
    let armed = false;
    const armTimer = window.setTimeout(() => { armed = true; }, 3000);

    const fire = () => {
      if (!armed) return;
      lastFocused.current = document.activeElement;
      setOpen(true);
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
      teardown();
    };

    // Pointer leaving through the top of the viewport: the cursor heading for
    // the tab bar, address bar, or a bookmark.
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 4) fire();
    };
    // Some browsers report the departure as mouseleave on the document rather
    // than mouseout, so listen for both.
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 4) fire();
    };
    // Switching tabs or minimising is the same intent without a pointer path,
    // which also covers trackpad gestures that never cross the top edge.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') fire();
    };

    function teardown() {
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    }

    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearTimeout(armTimer);
      teardown();
    };
  }, []);

  // Lock scroll, trap focus, and close on Escape while the dialog is up.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { dismiss(); return; }
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="wxi-scrim"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        ref={dialogRef}
        className="wxi-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wxi-title"
        aria-describedby="wxi-body"
      >
        <button ref={closeRef} className="wxi-x" onClick={dismiss} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Left: the pitch. */}
        <div className="wxi-pitch">
          <span className="wxi-pill">
            <span className="wxi-pill-dot" aria-hidden="true" />
            Free · 20 minutes · watch anytime
          </span>

          <h2 id="wxi-title" className="wxi-title">
            Before you go: the number one thing CFOs wish sellers understood.
          </h2>

          {/* Signature: a ledger rule, drawn on open — the line under a figure. */}
          <span className="wxi-rule" aria-hidden="true" />

          <p id="wxi-body" className="wxi-body">
            Jamal walks the financial fluency framework enterprise sellers use to get taken
            seriously in the room &mdash; with a real 10-K on screen. Takes less time than the
            meeting you&rsquo;re about to prep for.
          </p>

          <ul className="wxi-list">
            <li>Where CFOs actually look first in a filing</li>
            <li>The three numbers that reframe your whole pitch</li>
            <li>No signup, no seat limit &mdash; starts when you press play</li>
          </ul>

          <div className="wxi-actions">
            <a className="wxi-cta" href={WEBINAR_URL}>
              <span className="wxi-cta-play" aria-hidden="true">&#9654;</span>
              Watch It Now &mdash; Free
            </a>
            <button className="wxi-dismiss" onClick={dismiss}>Not now</button>
          </div>
        </div>

        {/* Right: what they are being handed. The whole panel is one link so the
            thumbnail is clickable, not decorative. */}
        <div className="wxi-aside">
          <a className="wxi-thumb" href={WEBINAR_URL} tabIndex={-1} aria-hidden="true">
            <img src="/exit-session-preview.png" alt="" loading="lazy" />
            <span className="wxi-thumb-veil" />
            <span className="wxi-live">
              <span className="wxi-live-dot" />
              Live anytime
            </span>
            <span className="wxi-play"><span className="wxi-play-ring" />&#9654;</span>
            <span className="wxi-meta">
              <span className="wxi-meta-title">Financial Fluency for Sellers &mdash; full session</span>
              <span className="wxi-bar"><span /></span>
              <span className="wxi-times"><span>0:00</span><span>20:14</span></span>
            </span>
          </a>

          <div className="wxi-host">
            <img className="wxi-host-face" src="/jr_headshot.webp" alt="" loading="lazy" width={38} height={38} />
            <div>
              <div className="wxi-host-name">Jamal Reimer</div>
              <div className="wxi-host-role">$160M+ closed · author of Mega Deal Secrets</div>
            </div>
          </div>

          <div className="wxi-count">
            <span className="wxi-count-dot" aria-hidden="true" />
            4,100+ sellers have watched it
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;

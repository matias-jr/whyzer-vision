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

        <h2 id="wxi-title" className="wxi-title">
          Before you go: the number one thing CFOs wish sellers understood.
        </h2>

        {/* Signature: a ledger rule, drawn on open — the line under a figure. */}
        <span className="wxi-rule" aria-hidden="true" />

        <p id="wxi-body" className="wxi-body">
          A free 20-minute webinar on the financial fluency framework enterprise sellers use to get
          taken seriously in the room. Takes less time than the meeting you&rsquo;re about to prep for.
        </p>

        <div className="wxi-actions">
          <a className="wxi-cta" href={WEBINAR_URL}>Show Me The Framework</a>
          <button className="wxi-dismiss" onClick={dismiss}>Not now</button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;

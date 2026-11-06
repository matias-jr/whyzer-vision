import { useEffect, useState } from 'react';
import { Head } from 'vite-react-ssg';
import './bf26.css';

/** Wed Nov 25 2026, 9:00 AM ET (14:00 UTC). The list closes and early access opens here. */
export const DEADLINE = Date.UTC(2026, 10, 25, 14, 0, 0);

const pad = (n: number) => String(n).padStart(2, '0');

export type Countdown = { d: string; h: string; m: string; s: string; over: boolean };

const countdownAt = (now: number): Countdown => {
  const diff = Math.max(0, DEADLINE - now);
  const s = Math.floor(diff / 1000);
  return {
    d: pad(Math.floor(s / 86400)),
    h: pad(Math.floor((s % 86400) / 3600)),
    m: pad(Math.floor((s % 3600) / 60)),
    s: pad(s % 60),
    over: diff <= 0,
  };
};

/** Ticks once a second. Renders 00s on the server and first paint so SSR and hydration agree. */
export function useCountdown(): Countdown {
  const [cd, setCd] = useState<Countdown>({ d: '00', h: '00', m: '00', s: '00', over: false });
  useEffect(() => {
    const tick = () => setCd(countdownAt(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return cd;
}

const ET_LINE = 'Wed Nov 25, 9:00 AM ET. Tap for your time.';

/** "Tap for your time" toggle shared by every countdown on a page. */
export function useLocalTime() {
  const [showLocal, setShowLocal] = useState(false);
  const [local, setLocal] = useState('');
  useEffect(() => {
    setLocal(
      new Date(DEADLINE).toLocaleString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      }),
    );
  }, []);
  return {
    line: showLocal && local ? `Your time: ${local}` : ET_LINE,
    title: local ? `Nov 25, 9:00 AM ET (your time: ${local})` : 'Nov 25, 9:00 AM ET',
    toggle: () => setShowLocal((v) => !v),
  };
}

/** Honors prefers-reduced-motion. False on the server. */
export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return reduce;
}

/** Smooth scroll to the sign-up form, offset for the sticky bar. */
export const scrollToForm = (e: React.MouseEvent) => {
  const el = document.getElementById('form');
  if (!el) return;
  e.preventDefault();
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
};

/** Page shell: scope class, fonts, and the SVG sprite the markup references with <use>. */
export const Bf26Shell = ({ title, description, noindex, children }: {
  title: string; description: string; noindex?: boolean; children: React.ReactNode;
}) => {
  // The original pages set scroll-behavior on <html>; do it here so it only applies on these routes.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    return () => { root.style.scrollBehavior = prev; };
  }, []);
  return (
    <div className="bf26">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="i-check" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" fill="currentColor" opacity=".16" />
          <path d="M6 10.4l2.6 2.6L14 7.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-chat" viewBox="0 0 20 20">
          <path d="M10 2.5c-4.4 0-7.75 3-7.75 6.9 0 1.6.6 3 1.6 4.2L3 17.3l3.9-1.4c.95.35 2 .55 3.1.55 4.4 0 7.75-3 7.75-6.95S14.4 2.5 10 2.5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M6.8 9.6h.01M10 9.6h.01M13.2 9.6h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-mail" viewBox="0 0 20 20">
          <rect x="2.5" y="4.5" width="15" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.5 6l6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
      </svg>
      {children}
    </div>
  );
};

/** The d/h/m(/s) tile row; clicking toggles the time zone line. */
export const Tiles = ({ cd, onToggle, title, label, seps }: {
  cd: Countdown; onToggle: () => void; title: string; label: string; seps?: boolean;
}) => (
  <button className="tiles" type="button" onClick={onToggle} title={title} aria-label={label}>
    <span className="tile"><b>{cd.d}</b><i>Days</i></span>
    {seps && <span className="tile sep" aria-hidden="true">:</span>}
    <span className="tile"><b>{cd.h}</b><i>Hours</i></span>
    {seps && <span className="tile sep" aria-hidden="true">:</span>}
    <span className="tile"><b>{cd.m}</b><i>Minutes</i></span>
  </button>
);

export const Bf26Footer = () => (
  <footer>
    <div className="wrap">
      <img src="/bf26/logo-dark.png" alt="Whyzer" width="80" height="20" />
      <span>Annual plans only. Offer closes Wed Dec 2, midnight ET.</span>
    </div>
  </footer>
);

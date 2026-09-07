import { useEffect, useRef, useState } from 'react';

// The design file drove everything from a single mount-time timer chain. Here
// each behaviour is its own hook so a section can be edited or removed without
// disturbing the others.

/** True once the element has scrolled into view. Never flips back. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced motion by showing immediately rather than animating in.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

/** Counts from 0 to `target` once scrolled into view. */
export function useCountUp(target: number, prefix = '', suffix = '') {
  const ref = useRef<HTMLDivElement>(null);
  const format = (n: number) => prefix + n.toLocaleString() + suffix;
  const [text, setText] = useState(() => format(target));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setText(format(0));
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const step = Math.max(1, Math.round(target / 34));
        let cur = 0;
        const tick = () => {
          cur += step;
          if (cur >= target) return setText(format(target));
          setText(format(cur));
          raf = requestAnimationFrame(tick);
        };
        tick();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, prefix, suffix]);

  return { ref, text };
}

/**
 * Auto-advancing product tour. A manual click pauses the rotation for a while
 * so the visitor is not fighting the carousel for control of the screen.
 */
export function useTour(count: number, enabled: boolean) {
  const [tab, setTab] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!enabled || paused) return;
    const t = setTimeout(() => setTab((i) => (i + 1) % count), 4600);
    return () => clearTimeout(t);
  }, [tab, paused, count, enabled]);

  // Resume the automatic rotation once the visitor has stopped clicking.
  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 9000);
    return () => clearTimeout(t);
  }, [paused, tab]);

  const select = (i: number) => {
    setTab(i);
    setPaused(true);
  };

  return { tab, select };
}

type HeroState = { typed: string; showResearch: boolean };

/** Types a company name into the mock search box, then swaps to the result. */
export function useHeroDemo(enabled: boolean): HeroState {
  const [state, setState] = useState<HeroState>({ typed: '', showResearch: false });

  useEffect(() => {
    if (!enabled) {
      setState({ typed: 'NVIDIA', showResearch: true });
      return;
    }
    const word = 'NVIDIA';
    let timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const run = () => {
      setState({ typed: '', showResearch: false });
      let t = 700;
      for (let i = 1; i <= word.length; i++) {
        const slice = word.slice(0, i);
        at(t, () => setState({ typed: slice, showResearch: false }));
        t += 130;
      }
      at(t + 900, () => setState({ typed: word, showResearch: true }));
      at(t + 5200, run);
    };
    run();
    return () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
  }, [enabled]);

  return state;
}

/** Fires once when the pointer leaves through the top of the viewport. */
export function useExitIntent(enabled: boolean) {
  const [open, setOpen] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const onOut = (ev: MouseEvent) => {
      if (ev.relatedTarget) return;
      if (ev.clientY > 12) return;
      if (firedRef.current) return;
      firedRef.current = true;
      setOpen(true);
    };
    document.addEventListener('mouseout', onOut);
    return () => document.removeEventListener('mouseout', onOut);
  }, [enabled]);

  return { open, setOpen };
}

/** Matches a media query, defaulting to `false` during SSG prerender. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

/**
 * Cycles the pricing gauge through its three tiers. Clicking a tier pins it
 * for a while, same courtesy as the product tour.
 */
export function useGauge(count: number, enabled: boolean) {
  const [tier, setTier] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!enabled || paused) return;
    const t = setTimeout(() => setTier((i) => (i + 1) % count), 2600);
    return () => clearTimeout(t);
  }, [tier, paused, count, enabled]);

  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 9000);
    return () => clearTimeout(t);
  }, [paused, tier]);

  return {
    tier,
    select: (i: number) => { setTier(i); setPaused(true); },
  };
}

/**
 * Paged carousel that shows `perPage` cards at a time, plus a lightbox index.
 * Paging is clamped rather than wrapped so the track never shows dead space
 * past the last card.
 */
export function useVideoCarousel(total: number, perPage: number) {
  const pages = Math.max(1, total - perPage + 1);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  // Close on Escape and lock the page behind the lightbox while it is up.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % total));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + total) % total));
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, total]);

  return {
    page, pages,
    prev: () => setPage((p) => (p - 1 + pages) % pages),
    next: () => setPage((p) => (p + 1) % pages),
    open, setOpen,
    step: (d: number) => setOpen((i) => (i === null ? i : (i + d + total) % total)),
  };
}

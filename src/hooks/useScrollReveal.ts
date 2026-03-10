import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export function useStaggerReveal(count: number, staggerMs = 80) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const elements = refs.current.filter(Boolean) as HTMLDivElement[];
    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = elements.indexOf(entry.target as HTMLDivElement);
            const el = entry.target as HTMLDivElement;
            setTimeout(() => {
              el.style.transition = 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, idx * staggerMs);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count, staggerMs]);

  return (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };
}

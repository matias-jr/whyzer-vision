/**
 * Event tracking for the Skills Assessment.
 *
 * Page views need nothing here: App.tsx already calls trackVisit() on every navigation, and
 * PostHog (loaded in index.html) records its own pageview. This file covers what those cannot see:
 * moving between screens inside the page, and the calendar.
 *
 * Events go through PostHog, which is the only client-side custom-event destination the site has.
 * Silent by design: analytics must never surface an error or block the page.
 */

type PostHogLike = { capture?: (event: string, props?: Record<string, unknown>) => void };

export function track(event: string, props: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  try {
    (window as unknown as { posthog?: PostHogLike }).posthog?.capture?.(event, {
      assessment: 'skills-assessment-2027',
      ...props,
    });
  } catch {
    /* never let analytics break the page */
  }
}

export type Screen = 'landing' | 'quiz' | 'review' | 'results';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

/**
 * The eight screens a visitor can be on, numbered in the order they meet them:
 * 1 landing, 2-6 the five skills, 7 review, 8 results.
 */
export function screenInfo(view: Screen, step: number, skillName: string): { step_number: number; step_name: string } {
  switch (view) {
    case 'landing': return { step_number: 1, step_name: 'landing' };
    case 'quiz': return { step_number: 2 + step, step_name: `skill_${step + 1}_${slug(skillName)}` };
    case 'review': return { step_number: 7, step_name: 'review' };
    case 'results': return { step_number: 8, step_name: 'results' };
  }
}

/** Fire-and-forget POST to the GHL contact sync. Resolves quietly on any failure. */
export async function syncContact(body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch('/api/bf26', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form: 'assessment-2027', ...body }),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Scoring for the Skills Assessment. Pure functions only (no React, no browser APIs) so the rules
 * can be unit tested and shared by the results screen and the PDF export.
 *
 * Rules, unchanged from the design source:
 *  - Each question is Yes (1) or Not yet (0); each skill has five, so 0-5 per skill, 0-25 overall.
 *  - The priority skill is the lowest-scoring one. When several tie for lowest the visitor picks
 *    (`chosen`); until they do, the first of the tied skills in skill order is used.
 *  - If every skill scores 5 there is no priority (`allStrong`).
 *  - Up to three recommendations come from "Not yet" answers: the priority skill's first, then the
 *    remaining skills by ascending score.
 */
import { Q, RATING, RATING_TEXT, SK, list, type Question, type Skill } from './data';

export type Answers = Record<string, 0 | 1>;

export type ScoredSkill = Skill & { i: number; qs: Question[]; score: number; pct: number; gaps: Question[] };

export type RankedRow = {
  name: string; score: number; pct: number; rating: string; ratingText: string;
  fill: string; badgeBg: string; badgeColor: string; rank: string;
};

export type Recommendation = { i: number; title: string; desc: string; num: string };

export type Result = {
  skills: ScoredSkill[];
  total: number;
  totalPct: number;
  allStrong: boolean;
  allZero: boolean;
  prio: ScoredSkill | null;
  rows: RankedRow[];
  recs: Recommendation[];
  strongLabel: string;
  strongText: string;
  weakLabel: string;
  weakText: string;
  tieNote: string;
  showTie: boolean;
  tieOpts: ScoredSkill[];
  chosenId: string | undefined;
  strengthSkill: ScoredSkill | null;
  strengthText: string;
  missing: Question[];
};

export function compute(ans: Answers, chosen: string | null): Result {
  const skills: ScoredSkill[] = SK.map((s, i) => {
    const qs = Q.filter((q) => q.skillId === s.id);
    const score = qs.filter((q) => ans[q.id] === 1).length;
    return { ...s, i, qs, score, pct: score * 20, gaps: qs.filter((q) => ans[q.id] === 0) };
  });
  const total = skills.reduce((a, s) => a + s.score, 0);
  const max = Math.max(...skills.map((s) => s.score));
  const min = Math.min(...skills.map((s) => s.score));
  const allStrong = min === 5;
  const allZero = max === 0;
  const level = max === min;
  const strongest = skills.filter((s) => s.score === max);
  const weakest = skills.filter((s) => s.score === min);
  const opts = allStrong ? [] : weakest;
  const chosenId = opts.some((s) => s.id === chosen) ? (chosen as string) : opts[0]?.id;
  const prio = skills.find((s) => s.id === chosenId) ?? null;
  const ranked = [...skills].sort((a, b) => b.score - a.score || a.i - b.i);

  const rows: RankedRow[] = ranked.map((s) => {
    const [rating, fill, badgeBg, badgeColor] = RATING(s.score);
    const rank = 1 + ranked.filter((o) => o.score > s.score).length;
    const tied = ranked.filter((o) => o.score === s.score).length > 1;
    return {
      name: s.name, score: s.score, pct: s.pct, rating, ratingText: RATING_TEXT[rating],
      fill, badgeBg, badgeColor, rank: tied ? `${rank}=` : `${rank}`,
    };
  });

  // Recommendations grounded in "Not yet" answers: priority skill first, then others by ascending score.
  const recs: Recommendation[] = [];
  if (!allStrong && prio) {
    const order = [prio, ...skills.filter((s) => s.id !== prio.id).sort((a, b) => a.score - b.score || a.i - b.i)];
    for (const s of order) {
      for (const g of s.gaps) {
        if (recs.length < 3) recs.push({ i: recs.length + 1, title: g.area[0], desc: g.area[1], num: `question ${g.id}` });
      }
    }
  }

  const strongLabel = level ? 'Your strongest skill' : strongest.length > 1 ? 'Your strongest skills' : 'Your strongest skill';
  const strongText = allZero
    ? 'None reported yet'
    : level && !allStrong
      ? 'Level across all five skills'
      : allStrong
        ? 'All five skills'
        : list(strongest.map((s) => s.name));
  const weakLabel = opts.length > 1 ? 'Your biggest development opportunities' : 'Your biggest development opportunity';
  const weakText = allStrong ? 'None identified — see below' : list(opts.map((s) => s.name));
  const strengthSkill = !allStrong && strongest.length === 1 && max > min && max >= 4 ? strongest[0] : null;
  const tieNote = allZero
    ? "Every skill is a development priority. As a suggested learning sequence, start with Executive Business Fluency — it's the foundation the other four build on. That's a recommended order, not a measured difference between the skills. Choose a skill to explore it."
    : `${opts.length} skills share your lowest score of ${min}/5. Your answers don't separate them, so choose the one you'd like to explore first.`;

  return {
    skills, total, totalPct: Math.round((total / 25) * 100), allStrong, allZero, prio, rows, recs,
    strongLabel, strongText, weakLabel, weakText, tieNote,
    showTie: opts.length > 1, tieOpts: opts, chosenId,
    strengthSkill,
    strengthText:
      strengthSkill && prio
        ? `Your answers suggest you already have a strong foundation in ${strengthSkill.name}. ${strengthSkill.sPh}; ${prio.wPh}.`
        : '',
    missing: Q.filter((q) => ans[q.id] === undefined),
  };
}

/** First skill step that still has an unanswered question (0 when everything is answered). */
export function firstUnansweredStep(ans: Answers): number {
  const q = Q.find((x) => ans[x.id] === undefined);
  return q ? q.si : 0;
}

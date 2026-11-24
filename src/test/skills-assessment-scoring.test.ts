import { describe, expect, it } from 'vitest';
import { Q, SK } from '@/pages/academy/skills-assessment-2027/data';
import { compute, firstUnansweredStep, type Answers } from '@/pages/academy/skills-assessment-2027/scoring';

/** Answers where skill i scores `scores[i]` out of 5 (the first N questions of each skill are Yes). */
const answersFor = (scores: number[]): Answers => {
  const a: Answers = {};
  Q.forEach((q) => { a[q.id] = (q.idx % 5) < scores[q.si] ? 1 : 0; });
  return a;
};

describe('assessment content', () => {
  it('has five skills with five questions each', () => {
    expect(SK).toHaveLength(5);
    expect(Q).toHaveLength(25);
    SK.forEach((s) => expect(Q.filter((q) => q.skillId === s.id)).toHaveLength(5));
  });
});

describe('compute', () => {
  it('scores all Yes as 25/25 with no priority', () => {
    const r = compute(answersFor([5, 5, 5, 5, 5]), null);
    expect(r.total).toBe(25);
    expect(r.totalPct).toBe(100);
    expect(r.allStrong).toBe(true);
    expect(r.prio).toBeNull();
    expect(r.recs).toHaveLength(0);
  });

  it('treats all Not yet as a five-way tie, defaulting to the first skill', () => {
    const r = compute(answersFor([0, 0, 0, 0, 0]), null);
    expect(r.total).toBe(0);
    expect(r.allZero).toBe(true);
    expect(r.showTie).toBe(true);
    expect(r.prio?.id).toBe('biz');
    expect(r.strongText).toBe('None reported yet');
  });

  it('picks the single weakest skill and the strongest as a strength to build on', () => {
    const r = compute(answersFor([5, 5, 1, 5, 4]), null);
    expect(r.prio?.id).toBe('value');
    expect(r.showTie).toBe(false);
    expect(r.weakText).toBe('Value Clarity');
    expect(r.recs).toHaveLength(3);
    expect(r.recs[0].num).toMatch(/^question 3\./);
  });

  it('lets the visitor choose between tied weakest skills, ignoring an invalid choice', () => {
    const scores = [4, 2, 3, 5, 2];
    expect(compute(answersFor(scores), 'risk').prio?.id).toBe('risk');
    expect(compute(answersFor(scores), 'biz').prio?.id).toBe('disc');
  });

  it('gives tied skills a shared rank', () => {
    const r = compute(answersFor([4, 2, 3, 5, 2]), null);
    expect(r.rows.map((x) => x.rank)).toEqual(['1', '2', '3', '4=', '4=']);
  });

  it('lists unanswered questions and finds the first unanswered step', () => {
    const a = answersFor([5, 5, 5, 5, 5]);
    delete a['3.2'];
    expect(compute(a, null).missing.map((q) => q.id)).toEqual(['3.2']);
    expect(firstUnansweredStep(a)).toBe(2);
    expect(firstUnansweredStep({})).toBe(0);
  });
});

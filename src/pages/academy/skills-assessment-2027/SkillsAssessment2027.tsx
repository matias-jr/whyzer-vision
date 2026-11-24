/**
 * Whyzer Academy: Enterprise Seller Skills Assessment (2027).
 * Route: /academy/skills-assessment-2027
 *
 * Flow: landing (name + work email) -> five skill steps of five Yes / Not yet questions -> review
 * -> results (score, ranking, priority skill, PDF) with the GHL booking calendar embedded below.
 *
 * Systems it hooks into
 *  - Page view: automatic (App.tsx trackVisit + PostHog pageview).
 *  - Screen changes: `assessment_step` with step_number and step_name (tracking.ts).
 *  - GHL contact: POST /api/bf26 { form: 'assessment-2027' }. Landing submit creates/updates the
 *    contact with the "2027 assessment init" tag; reaching the results screen adds
 *    "2027 assessment comp" (api/_assessment2027.js). Location is resolved server-side there.
 *  - Calendar: BookingEmbed.tsx (calendar_viewed, best-effort calendar_booked).
 *
 * Answers stay in this browser (localStorage); only name, email, location and the two tags go to GHL.
 */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head } from 'vite-react-ssg';
import './assessment.css';
import { Q, RATING, SK } from './data';
import { compute, firstUnansweredStep, type Answers } from './scoring';
import { screenInfo, syncContact, track, type Screen } from './tracking';
import BookingEmbed from './BookingEmbed';
import { downloadResultsPdf } from './pdf';

const KEY = 'wz-skills-assessment-2027';
const LOGO = '/academy-assets/skills-assessment-2027/logo-white.png';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Saved = {
  answers: Answers; view: Screen; step: number; chosen: string | null;
  first: string; email: string; initSent?: string; compSent?: string;
};

const sel = (on: boolean): [string, string, string, number] =>
  on ? ['#6262E9', '#6262E9', '#FFFFFF', 1] : ['var(--color-border-strong)', 'var(--color-bg-elevated)', 'var(--color-text)', 0];

const SkillsAssessment2027 = () => {
  const [view, setViewState] = useState<Screen>('landing');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showMissing, setShowMissing] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confirmRetake, setConfirmRetakeState] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [first, setFirst] = useState('');
  const [email, setEmail] = useState('');
  const [leadErr, setLeadErr] = useState('');
  const [bad, setBad] = useState<'first' | 'email' | null>(null);
  const [ready, setReady] = useState(false);
  const [scrollTick, setScrollTick] = useState(0);

  const topRef = useRef<HTMLDivElement>(null);
  const scrollAnchor = useRef<string | undefined>(undefined);
  const synced = useRef<{ initSent?: string; compSent?: string }>({});
  const completedFor = useRef<string | null>(null);

  // Restore progress after hydration so the server render and first paint agree.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null') as Saved | null;
      if (s && s.answers) {
        setAnswers(s.answers); setViewState(s.view || 'landing'); setStep(s.step || 0); setChosen(s.chosen || null);
        setFirst(s.first || ''); setEmail(s.email || '');
        synced.current = { initSent: s.initSent, compSent: s.compSent };
      }
    } catch { /* private mode / bad JSON: start fresh */ }
    setReady(true);
  }, []);

  const persist = useCallback((over: Partial<Saved> = {}) => {
    try {
      const cur: Saved = { answers, view, step, chosen, first, email, ...synced.current, ...over };
      localStorage.setItem(KEY, JSON.stringify(cur));
    } catch { /* storage unavailable */ }
  }, [answers, view, step, chosen, first, email]);

  useEffect(() => { if (ready) persist(); }, [ready, persist]);

  const go = (nextView: Screen, extra: { step?: number; answers?: Answers; chosen?: string | null; showMissing?: boolean } = {}, anchor?: string) => {
    setViewState(nextView);
    if (extra.step !== undefined) setStep(extra.step);
    if (extra.answers !== undefined) setAnswers(extra.answers);
    if (extra.chosen !== undefined) setChosen(extra.chosen);
    if (extra.showMissing !== undefined) setShowMissing(extra.showMissing);
    scrollAnchor.current = anchor;
    setScrollTick((t) => t + 1);
  };

  // Scroll after a screen change: to the top, or to a question when jumping from the missing list.
  useEffect(() => {
    if (!scrollTick) return;
    const id = scrollAnchor.current;
    requestAnimationFrame(() => {
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
          el.querySelector('button')?.focus({ preventScroll: true });
          return;
        }
      }
      window.scrollTo({ top: 0 });
    });
  }, [scrollTick]);

  const scored = useMemo(() => compute(answers, chosen), [answers, chosen]);

  // Navigation tracking: one event per screen change (step number + step name).
  useEffect(() => {
    if (!ready) return;
    track('assessment_step', screenInfo(view, step, SK[step].name));
  }, [ready, view, step]);

  // Reaching the results screen: separate analytics event, and the "comp" tag in GHL (once per email).
  useEffect(() => {
    if (!ready || view !== 'results' || scored.missing.length) return;
    const mail = email.trim().toLowerCase();
    if (completedFor.current === mail) return;
    completedFor.current = mail;
    track('assessment_completed', { score: scored.total, priority_skill: scored.prio?.name ?? null });
    if (!EMAIL_RE.test(mail) || synced.current.compSent === mail) return;
    void syncContact({
      stage: 'comp', firstName: first.trim(), email: mail,
      // Result label per skill (GHL custom fields). The numeric score stays in the browser.
      results: Object.fromEntries(scored.skills.map((s) => [s.id, RATING(s.score)[0]])),
    }).then((ok) => {
      if (!ok) return;
      synced.current = { ...synced.current, compSent: mail };
      persist({ compSent: mail });
    });
  }, [ready, view, scored, email, first, persist]);

  const answeredCount = Q.filter((q) => answers[q.id] !== undefined).length;
  const hasProgress = answeredCount > 0 && view === 'landing';
  const cur = SK[step];
  const stepQ = Q.filter((q) => q.si === step);
  const firstOpen = stepQ.find((q) => answers[q.id] === undefined);
  const focusNum = firstOpen ? firstOpen.idx + 1 : stepQ[4].idx + 1;

  const answer = (id: string, v: 0 | 1) => setAnswers((a) => ({ ...a, [id]: v }));

  const start = () => (answeredCount === 25 ? go('results') : go('quiz', { step: firstUnansweredStep(answers) }));

  // Landing form: validate, tag the contact in GHL (fire and forget, never blocks the quiz), then start.
  const submitLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = first.trim();
    const mail = email.trim().toLowerCase();
    if (!name) { setBad('first'); setLeadErr('Please enter your first name.'); return; }
    if (!EMAIL_RE.test(mail)) { setBad('email'); setLeadErr('Please enter a valid email address.'); return; }
    setBad(null); setLeadErr('');
    const hp = (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
    track('assessment_lead_submitted');
    if (synced.current.initSent !== mail) {
      void syncContact({ stage: 'init', firstName: name, email: mail, website: hp }).then((ok) => {
        if (!ok) return;
        synced.current = { ...synced.current, initSent: mail };
        persist({ initSent: mail });
      });
    }
    start();
  };

  const stepQs = stepQ.map((q) => {
    const y = sel(answers[q.id] === 1), n = sel(answers[q.id] === 0);
    const flag = showMissing && answers[q.id] === undefined;
    return {
      num: q.id, q: q.q, ex: q.ex, anchor: `q-${q.id.replace('.', '-')}`, aria: `Question ${q.id}`, flag,
      cardBorder: flag ? 'var(--color-warning)' : 'var(--color-border)',
      yes: (answers[q.id] === 1 ? 'true' : 'false') as 'true' | 'false', no: (answers[q.id] === 0 ? 'true' : 'false') as 'true' | 'false',
      yesBorder: y[0], yesBg: y[1], yesColor: y[2], yesDot: y[3], noBorder: n[0], noBg: n[1], noColor: n[2], noDot: n[3],
      onYes: () => answer(q.id, 1), onNo: () => answer(q.id, 0),
    };
  });
  const stepChips = SK.map((k, i) => {
    const c = Q.filter((q) => q.si === i && answers[q.id] !== undefined).length;
    const on = i === step, done = c === 5;
    return {
      num: `0${i + 1}`, short: k.short, count: c, current: (on ? 'step' : 'false') as 'step' | 'false', aria: `${k.name}, ${c} of 5 answered`,
      border: on ? 'var(--color-accent)' : 'var(--color-border)',
      bg: on ? '#DDDFFF' : done ? 'var(--color-bg-sunken)' : 'var(--color-bg-elevated)',
      color: on ? 'var(--color-on-accent-subtle)' : 'var(--color-text)', pct: c * 20, go: () => go('quiz', { step: i }),
    };
  });
  const prio = scored.prio;

  const getItems = ['Your score across five enterprise selling skills', 'A ranking of your strongest and weakest capabilities', 'An explanation of what your biggest skill gap could mean for your deals', 'Specific areas of knowledge and competence to develop', 'The option to discuss your results with Jamal'];
  const skillCards = SK.map((k, i) => ({ num: `0${i + 1}`, name: k.name, intro: k.intro }));
  const progressPct = Math.round((answeredCount / 25) * 100);
  const progressLabel = `Skill ${step + 1} of 5 · Question ${focusNum} of 25`;
  const isFirstStep = step === 0;
  const stepNum = step + 1;
  const nextLabel = step === 4 ? 'Review & finish' : 'Next skill';
  const startLabel = answeredCount > 0 ? (answeredCount === 25 ? 'View My Results' : 'Continue Assessment') : 'Assess My Skills';
  const hasMissing = showMissing && scored.missing.length > 0;
  const missingTitle = scored.missing.length === 1
    ? 'One question still needs an answer before we can score your assessment.'
    : `${scored.missing.length} questions still need an answer before we can score your assessment.`;
  const missingList = scored.missing.map((q) => ({ num: q.id, q: q.q, go: () => go('quiz', { step: q.si }, `q-${q.id.replace('.', '-')}`) }));
  const resetQuiz = () => go('quiz', { answers: {}, step: 0, chosen: null, showMissing: false });

  const view$ = {
    topRef,
    goHome: () => go('landing'),
    isLanding: view === 'landing', isQuiz: view === 'quiz', isReview: view === 'review', isResults: view === 'results',
    answeredCount, hasProgress, startLabel,
    startOver: () => { completedFor.current = null; resetQuiz(); },
    getItems, skillCards, progressLabel, progressPct, stepChips, isFirstStep, stepNum,
    cur: { name: cur.name, intro: cur.intro }, stepQs,
    back: () => (step === 0 ? go('landing') : go('quiz', { step: step - 1 })),
    next: () => (step === 4 ? go('review') : go('quiz', { step: step + 1 })),
    nextLabel, hasMissing, missingTitle, missingList,
    submit: () => (scored.missing.length ? setShowMissing(true) : go('results', { showMissing: false })),
    reviewBack: () => go('quiz', { step: 4 }),
    r: {
      total: scored.total, totalPct: scored.totalPct, ringOffset: (251.3 * (1 - scored.totalPct / 100)).toFixed(1),
      strongLabel: scored.strongLabel, strongText: scored.strongText, weakLabel: scored.weakLabel, weakText: scored.weakText,
      rows: scored.rows, allStrong: scored.allStrong, showTie: scored.showTie, tieNote: scored.tieNote,
      tieOptions: scored.tieOpts.map((k) => {
        const on = k.id === scored.chosenId;
        return {
          name: k.name, selected: (on ? 'true' : 'false') as 'true' | 'false',
          border: on ? 'var(--color-accent)' : 'var(--color-border-strong)',
          bg: on ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
          color: on ? 'var(--color-text-on-accent)' : 'var(--color-text)',
          pick: () => setChosen(k.id),
        };
      }),
      hasPrio: !!prio && !scored.allStrong, diagHeading: "Here's Where I'd Focus First",
      showStrength: !!scored.strengthSkill, strengthName: scored.strengthSkill ? scored.strengthSkill.name : '', strengthText: scored.strengthText,
      hasBridge: !!prio && !scored.allStrong, bridge: prio ? prio.bridge : '',
    },
    p: prio
      ? { name: prio.name, score: prio.score, lead: prio.lead, why: prio.why, stats: prio.stats, strongList: prio.strongList, actions: prio.actions.map((t, i) => ({ i: i + 1, k: i, t })) }
      : { name: '', score: 0, lead: '', why: [] as string[], stats: [] as { n: string; t: string; src: string }[], strongList: [] as string[], actions: [] as { i: number; k: number; t: string }[] },
    download: async () => {
      if (pdfBusy) return;
      setPdfBusy(true);
      track('assessment_pdf_downloaded', { score: scored.total });
      try { await downloadResultsPdf(scored); } catch { window.print(); } finally { setPdfBusy(false); }
    },
    downloadLabel: pdfBusy ? 'Preparing PDF…' : 'Download My Results',
    notConfirming: !confirmRetake, confirmRetake,
    askRetake: () => setConfirmRetakeState(true), cancelRetake: () => setConfirmRetakeState(false),
    retake: () => { completedFor.current = null; setConfirmRetakeState(false); go('quiz', { answers: {}, step: 0, chosen: null, showMissing: false }); },
  };
  const { goHome, isQuiz, isLanding, isReview, isResults, startOver, back, next, submit, reviewBack, download, downloadLabel, notConfirming, askRetake, cancelRetake, retake, r, p } = view$;

  return (
    <div className="wz-assess">
      <Head>
        <title>The Enterprise Seller Skills Assessment · Whyzer Academy</title>
        <meta name="description" content="Assess the five skills that separate enterprise sellers from those who consistently win megadeals. 25 practical questions, free, results immediately." />
      </Head>
      <div ref={topRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header data-theme="dark" style={{ position: 'sticky', top: '0', zIndex: '10', background: 'rgba(11,11,24,.94)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderBottom: '1px solid rgba(255,255,255,.09)', color: '#F4F4FB' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '16px clamp(28px,6vw,72px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <button onClick={goHome} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src={LOGO} alt="Whyzer" style={{ height: '24px', width: 'auto', display: 'block' }} />
              <span style={{ fontSize: '11.5px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D9D7FF', padding: '5px 10px', borderRadius: '100px', background: 'rgba(169,164,255,.14)', border: '1px solid rgba(169,164,255,.3)' }}>
                Academy
              </span>
            </button>
            {isQuiz && (
              <>
              <span style={{ fontSize: '13px', color: '#D9D7FF', fontFamily: 'var(--font-mono)', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <b style={{ color: '#fff' }}>
                  {answeredCount}
                </b>
                /25 answered
              </span>
              </>
            )}
          </div>
        </header>
        <main style={{ flex: '1' }}>
          {isLanding && (
            <>
            <section data-theme="dark" className="wz-hero" style={{ color: 'var(--color-text)' }}>
              <div className="wz-hero-grid" style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(56px,9vw,104px) clamp(28px,6vw,72px) clamp(56px,8vw,96px)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', minWidth: '0' }}>
                  <span className="wz-pill">
                    <span className="wz-dot"></span>
                    Whyzer Academy · Skills Assessment
                  </span>
                  <h1 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(40px,5.6vw,66px)', lineHeight: '1.03', letterSpacing: '-0.03em', maxWidth: '920px', textWrap: 'balance' }}>
                    Are you ready to win{' '}
                    <span className="wz-lilac">
                      bigger enterprise deals in 2027?
                    </span>
                  </h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px' }}>
                    <p style={{ margin: '0', fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.2vw,26px)', lineHeight: '1.35', textWrap: 'pretty' }}>
                      Assess the five skills that separate enterprise sellers from those who consistently win megadeals.
                    </p>
                    <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'var(--color-text-muted)', textWrap: 'pretty' }}>
                      Answer 25 practical questions, identify your strongest and weakest skills, and discover where improving your capabilities could make the biggest difference.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
                    <form className="wz-lead" id="wz-lead" noValidate onSubmit={submitLead}>
                      <div className="fields">
                        <label htmlFor="wz-first">
                          First name
                          <input
                            id="wz-first" name="first_name" type="text" autoComplete="given-name" placeholder="Sarah" required
                            value={first} onChange={(e) => setFirst(e.target.value)} aria-invalid={bad === 'first'}
                          />
                        </label>
                        <label htmlFor="wz-email">
                          Work email
                          <input
                            id="wz-email" name="email" type="email" autoComplete="email" placeholder="sarah@company.com" required
                            value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={bad === 'email'}
                          />
                        </label>
                      </div>
                      {/* Honeypot: people never see it, bots fill it. The API treats a filled value as a fake success. */}
                      <input
                        type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                      />
                      <span className="err" id="wz-err" role="alert">{leadErr}</span>
                      <div className="go">
                        <button type="submit">
                          {startLabel}{' '}
                          &rarr;
                        </button>
                        {hasProgress && (
                          <>
                          <button type="button" className="wz-button wz-button--ghost wz-button--lg" onClick={startOver}>
                            Start over
                          </button>
                          </>
                        )}
                      </div>
                    </form>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                      No account required. Your results appear immediately.
                    </span>
                  </div>
                  <div className="wz-tiles">
                    <span className="wz-tile">
                      <b>
                        5 min
                      </b>
                      <i>
                        Estimated time
                      </i>
                    </span>
                    <span className="wz-tile">
                      <b>
                        25
                      </b>
                      <i>
                        Questions
                      </i>
                    </span>
                    <span className="wz-tile">
                      <b>
                        Free
                      </b>
                      <i>
                        Cost
                      </i>
                    </span>
                  </div>
                </div>
                <aside className="wz-preview" aria-label="Example of the results you get">
                  <div className="hd">
                    <b>
                      Your results
                    </b>
                    <span>
                      example
                    </span>
                  </div>
                  <div className="wz-pv-score">
                    <svg width="56" height="56" viewBox="0 0 100 100" aria-hidden="true">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#A9A4FF" strokeWidth="10" strokeLinecap="round" strokeDasharray="251.3" strokeDashoffset="80.4" transform="rotate(-90 50 50)" className="wz-pv-ring" />
                    </svg>
                    <div>
                      <b>
                        <span className="wz-pv-num">
                          17
                        </span>
                        /25
                      </b>
                      <br />
                      <span>
                        Overall score across
                        <br />
                        the five skills
                      </span>
                    </div>
                  </div>
                  <div className="wz-pv-row">
                    <span>
                      Business fluency
                    </span>
                    <span className="wz-pv-bar">
                      <i style={{ width: '100%' }}></i>
                    </span>
                    <em>
                      5/5
                    </em>
                  </div>
                  <div className="wz-pv-row">
                    <span>
                      Discovery
                    </span>
                    <span className="wz-pv-bar">
                      <i style={{ width: '80%' }}></i>
                    </span>
                    <em>
                      4/5
                    </em>
                  </div>
                  <div className="wz-pv-row">
                    <span>
                      Value clarity
                    </span>
                    <span className="wz-pv-bar">
                      <i style={{ width: '60%' }}></i>
                    </span>
                    <em>
                      3/5
                    </em>
                  </div>
                  <div className="wz-pv-row">
                    <span>
                      Multi-threading
                    </span>
                    <span className="wz-pv-bar">
                      <i style={{ width: '60%' }}></i>
                    </span>
                    <em>
                      3/5
                    </em>
                  </div>
                  <div className="wz-pv-row">
                    <span>
                      De-risking
                    </span>
                    <span className="wz-pv-bar">
                      <i style={{ width: '40%' }}></i>
                    </span>
                    <em>
                      2/5
                    </em>
                  </div>
                  <small>
                    Sample results for illustration. Yours appear right after the last question.
                  </small>
                </aside>
              </div>
            </section>
            <section style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(28px,6vw,72px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 'clamp(40px,6vw,80px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-accent-text)' }}>
                  Where this comes from
                </span>
                <p style={{ margin: '0', fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.4vw,28px)', lineHeight: '1.35', textWrap: 'pretty' }}>
                  We analyzed 30 enterprise and strategic AE job postings, reviewed research on changing B2B buying behavior, and identified five skills that matter when you're trying to win larger, more complex deals.
                </p>
                <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                  Now it's time to see how you measure up.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                  What you'll get
                </span>
                <div className="wz-gets" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {getItems.map((g, _i) => (
                    <Fragment key={_i}>
                      <div className="wz-get" style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', gap: '12px', alignItems: 'start' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px' }}>
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span style={{ fontSize: '17px', lineHeight: '1.5' }}>
                          {g}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </section>
            <section style={{ background: 'var(--color-bg-sunken)' }}>
              <div style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(28px,6vw,72px)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-accent-text)' }}>
                    The five skills
                  </span>
                  <h2 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(28px,3.4vw,40px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                    Five questions on each
                  </h2>
                </div>
                <div className="wz-skills">
                  {skillCards.map((s, _i) => (
                    <Fragment key={_i}>
                      <div className="wz-skill">
                        <span className="n">
                          {s.num}
                        </span>
                        <span className="nm">
                          {s.name}
                        </span>
                        <span className="in">
                          {s.intro}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <p style={{ margin: '0', fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '720px', lineHeight: '1.6' }}>
                  Your progress is saved in this browser only, so you can close the page and pick up where you left off. Your answers are never sent anywhere.
                </p>
              </div>
            </section>
            </>
          )}
          {isQuiz && (
            <>
            <section style={{ maxWidth: '880px', margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(28px,6vw,72px) 96px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                    {progressLabel}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    {progressPct}%
                  </span>
                </div>
                <div role="progressbar" aria-valuemin={0} aria-valuemax={25} aria-valuenow={answeredCount} style={{ height: '6px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-sunken)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg,#6262E9,#A9A4FF)', borderRadius: 'var(--radius-full)', transition: 'width 400ms cubic-bezier(0.2,0.8,0.2,1)' }}></div>
                </div>
                <nav aria-label="Skills" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '8px' }}>
                  {stepChips.map((c, _i) => (
                    <Fragment key={_i}>
                      <button onClick={c.go} aria-current={c.current} aria-label={c.aria} style={{ cursor: 'pointer', border: `1px solid ${c.border}`, background: `${c.bg}`, color: `${c.color}`, borderRadius: 'var(--radius-sm)', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start', textAlign: 'left', minHeight: '44px', transition: 'background-color 120ms, border-color 120ms' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '600' }}>
                          {c.num} · {c.count}/5
                        </span>
                        <span style={{ fontSize: '12px', lineHeight: '1.25', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                          {c.short}
                        </span>
                        <span className="wz-chipbar">
                          <i style={{ width: `${c.pct}%` }}></i>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </nav>
              </div>
              {isFirstStep && (
                <>
                <div style={{ background: '#DDDFFF', color: 'var(--color-on-accent-subtle)', borderRadius: 'var(--radius-md)', padding: '20px 24px', fontSize: '15px', lineHeight: '1.6' }}>
                  Think about your current enterprise accounts. Answer{' '}
                  <strong>
                    YES
                  </strong>
                  {' '}only if you could demonstrate this capability today. If you're unsure, choose{' '}
                  <strong>
                    NOT YET
                  </strong>
                  . The assessment will be more valuable if you're honest with yourself.
                </div>
                </>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-accent-text)' }}>
                  Skill {stepNum} of 5
                </span>
                <h1 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(30px,4vw,44px)', lineHeight: '1.08', letterSpacing: '-0.02em' }}>
                  {cur.name}
                </h1>
                <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'var(--color-text-muted)', maxWidth: '720px' }}>
                  {cur.intro}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stepQs.map((q, _i) => (
                  <Fragment key={_i}>
                    <fieldset id={q.anchor} style={{ margin: '0', background: 'var(--color-bg-elevated)', border: `1px solid ${q.cardBorder}`, borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', minWidth: '0' }}>
                      <legend style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                        Question {q.num}
                      </legend>
                      <div style={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', gap: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: '600', color: 'var(--color-accent-text)', paddingTop: '2px' }}>
                          {q.num}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '19px', lineHeight: '1.35' }}>
                            {q.q}
                          </span>
                          <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                            {q.ex}
                          </span>
                          {q.flag && (
                            <>
                            <span style={{ alignSelf: 'flex-start', fontSize: '13px', fontWeight: '500', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-warning-surface)', color: 'var(--color-on-warning-surface)' }}>
                              Answer this question to see your results
                            </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div role="radiogroup" aria-label={q.aria} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '10px' }}>
                        <button role="radio" aria-checked={q.yes} onClick={q.onYes} style={{ cursor: 'pointer', minHeight: '56px', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: `1px solid ${q.yesBorder}`, background: `${q.yesBg}`, color: `${q.yesColor}`, textAlign: 'left', fontSize: '15px', lineHeight: '1.35', display: 'flex', gap: '12px', alignItems: 'center', transition: 'background-color 120ms, border-color 120ms, color 120ms' }}>
                          <span style={{ flexShrink: '0', width: '22px', height: '22px', borderRadius: '50%', border: '2px solid currentColor', display: 'grid', placeItems: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: `${q.yesDot}` }}>
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          <span>
                            <strong style={{ fontWeight: '600' }}>
                              Yes
                            </strong>
                            {' '}— I can do this confidently.
                          </span>
                        </button>
                        <button role="radio" aria-checked={q.no} onClick={q.onNo} style={{ cursor: 'pointer', minHeight: '56px', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: `1px solid ${q.noBorder}`, background: `${q.noBg}`, color: `${q.noColor}`, textAlign: 'left', fontSize: '15px', lineHeight: '1.35', display: 'flex', gap: '12px', alignItems: 'center', transition: 'background-color 120ms, border-color 120ms, color 120ms' }}>
                          <span style={{ flexShrink: '0', width: '22px', height: '22px', borderRadius: '50%', border: '2px solid currentColor', display: 'grid', placeItems: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: `${q.noDot}` }}>
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          <span>
                            <strong style={{ fontWeight: '600' }}>
                              Not yet
                            </strong>
                            {' '}— I can't consistently do this.
                          </span>
                        </button>
                      </div>
                    </fieldset>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
                <button type="button" className="wz-button wz-button--secondary wz-button--lg" onClick={back}>
                  Back
                </button>
                <button type="button" className="wz-button wz-button--primary wz-button--lg" onClick={next}>
                  {nextLabel}
                </button>
              </div>
            </section>
            </>
          )}
          {isReview && (
            <>
            <section style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(28px,6vw,72px)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-accent-text)' }}>
                {answeredCount} of 25 answered
              </span>
              <h1 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(34px,5vw,56px)', lineHeight: '1.05', letterSpacing: '-0.02em' }}>
                Ready to see{' '}
                <span style={{ color: '#6262E9' }}>
                  your results?
                </span>
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.6' }}>
                  You've assessed yourself across the five skills required to navigate larger enterprise opportunities.
                </p>
                <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                  Your results will show where you're strongest, where you have gaps, and what those gaps may mean for your ability to win bigger deals.
                </p>
              </div>
              {hasMissing && (
                <>
                <div role="alert" style={{ background: '#F3F1FF', border: '1px solid #E2DAFB', color: 'var(--wz-indigo)', borderRadius: 'var(--radius-md)', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    {missingTitle}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '300px', overflowY: 'auto', paddingRight: '6px' }}>
                    {missingList.map((m, _i) => (
                      <Fragment key={_i}>
                        <button onClick={m.go} style={{ all: 'unset', cursor: 'pointer', display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) auto', gap: '10px', alignItems: 'baseline', padding: '10px 0', borderTop: '1px solid color-mix(in oklab, currentColor 20%, transparent)', fontSize: '15px', lineHeight: '1.45' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#6262E9' }}>
                            {m.num}
                          </span>
                          <span>
                            {m.q}
                          </span>
                          <span style={{ fontWeight: '600', color: '#4A4AD1', whiteSpace: 'nowrap' }}>
                            Go to question{' '}
                            &rarr;
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                </>
              )}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button type="button" className="wz-button wz-button--primary wz-button--lg" onClick={submit}>
                  See My Results
                </button>
                <button type="button" className="wz-button wz-button--secondary wz-button--lg" onClick={reviewBack}>
                  Review answers
                </button>
              </div>
            </section>
            </>
          )}
          {isResults && (
            <>
            <section data-theme="dark" className="wz-hero" style={{ color: 'var(--color-text)' }}>
              <div style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(28px,6vw,72px)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span className="wz-pill">
                    <span className="wz-dot"></span>
                    Whyzer Academy · Your results
                  </span>
                  <h1 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(34px,5vw,60px)', lineHeight: '1.04', letterSpacing: '-0.025em', textWrap: 'balance' }}>
                    Your enterprise selling{' '}
                    <span className="wz-lilac">
                      skills assessment
                    </span>
                  </h1>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '16px' }}>
                  <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                      Your overall score
                    </span>
                    <div className="wz-ring" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <svg width="76" height="76" viewBox="0 0 100 100" aria-hidden="true">
                        <defs>
                          <linearGradient id="wzg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#6262E9" />
                            <stop offset="1" stopColor="#C084FC" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-bg-sunken)" strokeWidth="10" />
                        <circle data-ring cx="50" cy="50" r="40" fill="none" stroke="url(#wzg)" strokeWidth="10" strokeLinecap="round" strokeDasharray="251.3" strokeDashoffset={r.ringOffset} transform="rotate(-90 50 50)" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '44px', lineHeight: '1' }}>
                        {r.total}
                        <span style={{ fontSize: '22px', color: 'var(--color-text-muted)' }}>
                          /25
                        </span>
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                      {r.totalPct}% of capabilities reported
                    </span>
                  </div>
                  <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                      {r.strongLabel}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '21px', lineHeight: '1.3' }}>
                      {r.strongText}
                    </span>
                  </div>
                  <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                      {r.weakLabel}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '21px', lineHeight: '1.3' }}>
                      {r.weakText}
                    </span>
                  </div>
                </div>
                <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-muted)', maxWidth: '760px' }}>
                  These are self-reported scores. A Yes means you believe you can demonstrate the capability today — not that it has been independently verified. Treat them as diagnostic signals to test against your real opportunities.
                </p>
              </div>
            </section>
            <section style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(28px,6vw,72px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(24px,3vw,32px)', letterSpacing: '-0.02em' }}>
                  Your skills, ranked
                </h2>
                <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  Strongest to weakest · ties share a rank
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {r.rows.map((row, _i) => (
                  <Fragment key={_i}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px', padding: '20px 0', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ flex: '1 1 280px', display: 'flex', gap: '14px', alignItems: 'baseline', minWidth: '0' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', fontSize: '14px', color: 'var(--color-text-muted)', width: '24px', flexShrink: '0' }}>
                          {row.rank}
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '18px', lineHeight: '1.3' }}>
                          {row.name}
                        </span>
                      </div>
                      <div style={{ flex: '2 1 300px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '0' }}>
                        <div aria-hidden="true" style={{ flex: '1', height: '12px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-sunken)', overflow: 'hidden' }}>
                          <div className="wz-bar-in" style={{ height: '100%', width: `${row.pct}%`, background: `${row.fill}`, borderRadius: 'var(--radius-full)' }}></div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: '600', whiteSpace: 'nowrap', width: '96px', textAlign: 'right' }}>
                          {row.score}/5 · {row.pct}%
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: `${row.badgeBg}`, color: `${row.badgeColor}`, whiteSpace: 'nowrap', width: '150px', textAlign: 'center' }}>
                          {row.rating}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </section>
            <section style={{ background: 'var(--color-bg-sunken)' }}>
              <div style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(28px,6vw,72px)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span className="wz-cj" style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '600', color: 'var(--color-accent-text)' }}>
                    <span className="av">
                      CJ
                    </span>
                    Coach Jamal's read
                  </span>
                  <h2 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(30px,4vw,48px)', lineHeight: '1.05', letterSpacing: '-0.02em' }}>
                    {r.diagHeading}
                  </h2>
                </div>
                {r.allStrong && (
                  <>
                  <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '820px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '24px', lineHeight: '1.25' }}>
                      You report a strong foundation across all five skills.
                    </span>
                    <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                      You report confidence in all five capabilities in every area. Consider testing that confidence against your most demanding live opportunity. Pick your largest deal and ask whether you could demonstrate each capability with that specific customer, this quarter.
                    </p>
                  </div>
                  </>
                )}
                {r.showTie && (
                  <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '22px' }}>
                      You have multiple development priorities.
                    </span>
                    <span style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--color-text-muted)', maxWidth: '760px' }}>
                      {r.tieNote}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {r.tieOptions.map((t, _i) => (
                        <Fragment key={_i}>
                          <button onClick={t.pick} aria-pressed={t.selected} style={{ cursor: 'pointer', minHeight: '44px', padding: '10px 20px', borderRadius: 'var(--radius-full)', border: `1px solid ${t.border}`, background: `${t.bg}`, color: `${t.color}`, fontSize: '15px', fontWeight: '500', transition: 'background-color 120ms, border-color 120ms, color 120ms' }}>
                            {t.name}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  </>
                )}
                {r.hasPrio && (
                  <>
                  <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 'clamp(24px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: 'clamp(32px,4vw,48px)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '820px' }}>
                      <span style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                        Your priority · {p.score}/5
                      </span>
                      <h3 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(28px,3.4vw,40px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                        {p.name}
                      </h3>
                      <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.6' }}>
                        {p.lead}
                      </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))', gap: 'clamp(32px,4vw,56px)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <span style={{ fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700', color: 'var(--color-accent-text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '24px', height: '2px', background: 'var(--color-accent)', flexShrink: '0' }}></span>
                          Why it matters
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: '12px' }}>
                          {p.stats.map((st, _i) => (
                            <Fragment key={_i}>
                              <div style={{ background: 'var(--color-bg-sunken)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(34px,4vw,44px)', lineHeight: '1', letterSpacing: '-0.02em', color: 'var(--color-accent-text)' }}>
                                  {st.n}
                                </span>
                                <span style={{ fontSize: '15px', lineHeight: '1.45' }}>
                                  {st.t}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: 'auto' }}>
                                  {st.src}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        {p.why.map((w, _i) => (
                          <Fragment key={_i}>
                            <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.65', color: 'var(--color-text-muted)' }}>
                              {w}
                            </p>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <span style={{ fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700', color: 'var(--color-accent-text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '24px', height: '2px', background: 'var(--color-accent)', flexShrink: '0' }}></span>
                          What stronger capability looks like
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {p.strongList.map((w, _i) => (
                            <Fragment key={_i}>
                              <div style={{ display: 'grid', gridTemplateColumns: '32px minmax(0,1fr)', gap: '12px', alignItems: 'start', padding: '14px 0', borderTop: '1px solid var(--color-border)' }}>
                                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#DDDFFF', color: 'var(--color-on-accent-subtle)', display: 'grid', placeItems: 'center' }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                </span>
                                <span style={{ fontSize: '16px', lineHeight: '1.5', fontWeight: '500', paddingTop: '3px' }}>
                                  {w}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ background: '#DDDFFF', color: 'var(--color-on-accent-subtle)', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px,3.5vw,40px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700' }}>
                          Start today
                        </span>
                        <h4 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(22px,2.6vw,30px)', lineHeight: '1.15', letterSpacing: '-0.02em', maxWidth: '720px' }}>
                          Small actions you can take today to start mastering this skill
                        </h4>
                      </div>
                      <div className="wz-journey">
                        {p.actions.map((ac, _i) => (
                          <Fragment key={_i}>
                            <div className="wz-step" style={{ '--k': `${ac.k}` } as React.CSSProperties}>
                              <span className="dotn">
                                0{ac.i}
                              </span>
                              <span className="txt">
                                {ac.t}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  </>
                )}
                {r.showStrength && (
                  <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: '12px 40px', paddingTop: '32px', borderTop: '1px solid var(--color-border-strong)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                        A strength to build on
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '22px' }}>
                        {r.strengthName}
                      </span>
                    </div>
                    <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.65' }}>
                      {r.strengthText}
                    </p>
                  </div>
                  </>
                )}
              </div>
            </section>
            <section data-theme="dark" className="wz-hero" style={{ color: 'var(--color-text)' }}>
              <div style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(28px,6vw,72px)', display: 'flex', flexDirection: 'column', gap: 'clamp(32px,5vw,56px)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '500', color: 'var(--color-accent-text)' }}>
                    Optional · 1:1 with Jamal
                  </span>
                  <h2 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(30px,4vw,48px)', lineHeight: '1.05', letterSpacing: '-0.02em' }}>
                    Want to work on{' '}
                    <span className="wz-lilac">
                      your biggest skill gap?
                    </span>
                  </h2>
                  <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.6' }}>
                    Knowing where you need to improve is a good starting point. The harder part is figuring out how to develop that capability while managing real enterprise opportunities.
                  </p>
                  <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                    If you'd like help, book a call with Jamal. We'll look at what you're trying to achieve, the skills you want to strengthen, and whether there's a coaching approach that makes sense for your goals.
                  </p>
                  {r.hasBridge && (
                    <>
                    <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.6', paddingLeft: '0', paddingTop: '16px', borderTop: '1px solid var(--color-border-strong)', color: 'var(--color-text-muted)' }}>
                      {r.bridge}
                    </p>
                    </>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '8px' }}>
                    <button type="button" className="wz-button wz-button--secondary wz-button--lg" onClick={download}>
                      {downloadLabel}
                    </button>
                  </div>
                </div>
                {/* GHL booking calendar, inline under the results. Name and email are prefilled from the landing form. */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', padding: 'clamp(8px,2vw,20px)' }}>
                  <BookingEmbed firstName={first.trim()} email={email.trim()} context={{ score: scored.total, priority_skill: scored.prio?.name ?? null }} />
                </div>
              </div>
            </section>
            <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px clamp(28px,6vw,72px) 72px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(20px,2.4vw,26px)', lineHeight: '1.3', maxWidth: '640px' }}>
                  The skills that got you here may not get you to your next megadeal.
                </p>
                {notConfirming && (
                  <>
                  <button type="button" className="wz-button wz-button--ghost wz-button--md" onClick={askRetake}>
                    Retake Assessment
                  </button>
                  </>
                )}
              </div>
              {confirmRetake && (
                <>
                <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', lineHeight: '1.6', maxWidth: '620px' }}>
                    Retaking replaces these results. They're only stored in this browser, so download your PDF first if you want to keep a copy.
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button type="button" className="wz-button wz-button--secondary wz-button--md" onClick={cancelRetake}>
                      Cancel
                    </button>
                    <button type="button" className="wz-button wz-button--ghost wz-button--md" onClick={retake}>
                      Replace and start again
                    </button>
                  </div>
                </div>
                </>
              )}
            </section>
            </>
          )}
        </main>
        <footer data-theme="dark" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '28px clamp(28px,6vw,72px)', display: 'flex', flexWrap: 'wrap', gap: '12px 24px', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={LOGO} alt="Whyzer" style={{ height: '18px', width: 'auto', display: 'block' }} />
              {' '}· Academy
            </span>
            <span>
              Self-assessment · Your answers stay in this browser
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SkillsAssessment2027;

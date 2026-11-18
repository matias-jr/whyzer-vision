import { Head } from 'vite-react-ssg';
import { FileText, FileSearch, Users } from 'lucide-react';
import { FunnelPage } from '@/components/site/FunnelChrome';
import ColdEmailTestimonials from './ColdEmailTestimonials';

type Direction = 'd1' | 'd2';
type Offer = 'a' | 'b';

interface Props {
  direction: Direction;
  offer: Offer;
  /** Route slug, used for this page's canonical URL. */
  slug: string;
}

const TRIAL_URL_BASE = 'https://app.whyzer.ai';

const FOUNDER_COPY =
  "I built Whyzer because I watched the gap between elite sellers and the rest of the field open up overnight. The hardest part of selling to executives is no longer the conversation. It's earning the seat at the table. This is the tool I wish I'd had on every one of those $50M deals.";

export default function ColdEmailLP({ direction, offer, slug }: Props) {
  // d2 keeps its distinct look as a dark v8 hero; d1 uses the light v8 hero.
  const isDark = direction === 'd2';
  const isOfferA = offer === 'a';

  const ctaHref = `${TRIAL_URL_BASE}?source=cold_email&offer=${offer}`;

  const heroHeadline = isOfferA ? (
    <>
      The financial argument <span className="wzf-accent">their own team didn't bring.</span>
    </>
  ) : (
    <>
      Know their numbers <span className="wzf-accent">better than their own team.</span> Before you walk in.
    </>
  );

  const heroTrust = isOfferA
    ? 'Full access for 14 days. One account. No credit card. Plus 2 bonuses on the house.'
    : 'Full access for 14 days. One account. No credit card. Plus a personal teardown and a live workshop.';

  const bonusIntro = isOfferA
    ? 'A masterclass on speaking the language of executives, and a live workshop where we build your meeting together.'
    : "A personal teardown of a deal that didn't close, and a live workshop where we build your next meeting together.";

  const founderBubble = isOfferA ? 'What would Jamal show you first?' : 'Send me your stalled deal.';

  const finalSub = isOfferA
    ? 'Full access to Whyzer for 14 days. Financial Fluency 101 and a seat in the next live workshop, on the house.'
    : 'Full access to Whyzer for 14 days. A personal teardown from Jamal and a seat in the next live workshop, on the house.';

  const featuredBonus = isOfferA
    ? {
        eye: 'The language',
        title: 'Financial Fluency 101',
        body: 'The insider language of executives. Recorded masterclass. The exact vocabulary that gets a CFO to lean forward in a first meeting.',
        pill: 'On-demand · 70 min',
        Icon: FileText,
      }
    : {
        eye: 'The teardown',
        title: 'Teardown of a deal that stalled',
        body: 'Send the deck, the POV, or the LinkedIn outreach from a deal that went quiet. Jamal records a teardown showing what to change. You keep the recording.',
        pill: '1:1 · Recorded · ~25 min',
        Icon: FileSearch,
      };

  const BonusCard = ({
    featured, num, Icon, eye, title, body, pill,
  }: {
    featured?: boolean; num: string; Icon: typeof FileText; eye: string; title: string; body: string; pill: string;
  }) => (
    <div className={`wzf-card${featured ? ' wzf-card--feat' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', minWidth: 0 }}>
      <span
        style={{
          position: 'absolute', top: -13, left: 20, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
          background: featured ? '#6262e9' : '#0B0B18', color: '#fff', padding: '5px 12px', borderRadius: 100,
        }}
      >
        {num}
      </span>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEEEFC', color: '#4a4ad1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
        <Icon size={22} strokeWidth={1.7} />
      </div>
      <div className="wzf-eyebrow" style={{ marginTop: 14, marginBottom: 0, color: '#8A8AA0' }}>{eye}</div>
      <h3>{title}</h3>
      <p>{body}</p>
      <span className="wzf-pill" style={{ alignSelf: 'flex-start', marginTop: 'auto', paddingTop: 5 }}>{pill}</span>
    </div>
  );

  const Cta = ({ note }: { note: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <a className="wzf-cta" href={ctaHref}>
        <span className="lp-cta-label-desktop">Build your first financially-backed POV →</span>
        <span className="lp-cta-label-mobile">Build your first POV →</span>
      </a>
      <div className="wzf-note">{note}</div>
    </div>
  );

  return (
    <>
      {/* Cold-email landing pages: their own canonical, kept out of search. */}
      <Head>
        <title>Whyzer</title>
        <link rel="canonical" href={`https://www.whyzer.ai/${slug}`} />
        <meta property="og:url" content={`https://www.whyzer.ai/${slug}`} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Turn SEC filings and earnings calls into boardroom-ready Points of View." />
      </Head>
      <FunnelPage>
        <style>{`
          .lp-cta-label-mobile { display: none; }
          @media (max-width: 720px) {
            .lp-cta-label-desktop { display: none !important; }
            .lp-cta-label-mobile { display: inline !important; }
          }
        `}</style>

        {/* Hero */}
        <section className={`wzf-hero${isDark ? ' wzf-dark' : ''}`}>
          <div className="wzf-wrap">
            <span className="wzf-badge"><i />Free 14-day trial · one account</span>
            <h1 className="wzf-h1" style={{ maxWidth: isDark ? '22ch' : '20ch' }}>{heroHeadline}</h1>
            <p className="wzf-lead">
              Turn earnings calls, 10-Ks and private company intel into the financial argument that gets executives to lean forward.
            </p>
            <p className="wzf-note" style={{ marginTop: 0, marginBottom: 26 }}>
              <span className="wzf-badge" style={{ padding: 0, border: 0, background: 'none', boxShadow: 'none', verticalAlign: 'middle', marginRight: 8 }}><i className="live" /></span>
              Built by a <b style={{ color: isDark ? '#fff' : '#14141F' }}>$160M Oracle seller</b>. Trusted by{' '}
              <b style={{ color: isDark ? '#fff' : '#14141F' }}>2,000+ enterprise reps</b>.
            </p>
            <Cta note={heroTrust} />
          </div>
        </section>

        {/* Bonuses */}
        <section className="wzf-sec">
          <div className="wzf-wrap">
            <div className="wzf-eyebrow">Supercharge your free trial</div>
            <h2 className="wzf-h2" style={{ marginBottom: 10 }}>Full access to Whyzer World included.</h2>
            <p className="wzsite-p" style={{ maxWidth: '60ch' }}>{bonusIntro}</p>
            <div className="wzf-grid2" style={{ marginTop: 34 }}>
              <BonusCard featured num="Bonus 01" {...featuredBonus} />
              <BonusCard
                num="Bonus 02"
                Icon={Users}
                eye="The meeting"
                title="Live workshop with Jamal"
                body="Bring your account. We build your senior-executive meeting together: the POV, the opening, the questions."
                pill="Weekly · Small group"
              />
            </div>
          </div>
        </section>

        <ColdEmailTestimonials />

        {/* Founder */}
        <section className="wzf-sec">
          <div className="wzf-wrap">
            <div className="wzf-eyebrow">Who's behind this</div>
            <div className="wzf-card" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'center', padding: 30 }} data-founder>
              <img
                src="/jr_headshot.webp"
                alt="Jamal Reimer"
                style={{ width: 180, height: 220, borderRadius: 14, objectFit: 'cover', background: '#EEEEFC' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, lineHeight: 1.5, fontWeight: 500, color: '#14141F', textWrap: 'pretty' }}>
                  {FOUNDER_COPY}
                </p>
                <div style={{ fontSize: 13, color: '#8A8AA0', lineHeight: 1.55 }}>
                  <b style={{ color: '#14141F' }}>Jamal Reimer</b> · Founder, Whyzer
                  <br />
                  Author, <i>Mega Deal Secrets</i>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute', right: 24, top: -16, background: '#6262e9', color: '#fff', borderRadius: 100,
                  padding: '8px 16px', fontSize: 13, fontWeight: 600, boxShadow: '0 12px 26px -12px rgba(98,98,233,.8)',
                }}
              >
                {founderBubble}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="wzf-sec wzf-dark" style={{ textAlign: 'center' }}>
          <div className="wzf-wrap">
            <div className="wzf-eyebrow">Start your trial</div>
            <h2 className="wzf-h2" style={{ fontSize: 'clamp(30px, 4.4vw, 44px)', margin: '0 auto 14px', maxWidth: '16ch' }}>
              14 days. <span className="wzf-accent">One account.</span> Plus two bonuses.
            </h2>
            <p className="wzf-lead" style={{ maxWidth: '48ch' }}>{finalSub}</p>
            <Cta note="One account. 14 days. No credit card." />
          </div>
        </section>
      </FunnelPage>
    </>
  );
}

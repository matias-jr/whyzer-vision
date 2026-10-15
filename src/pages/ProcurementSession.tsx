import { useEffect } from 'react';
import { Head } from 'vite-react-ssg';
import { FunnelPage } from '@/components/site/FunnelChrome';

const FORM_ID = '61mPCCvNy1U7SWL3NFYQ';

const NUMBERS = [
  { num: '01', title: 'Cost Savings', body: 'How much less the customer pays against their baseline, calculated the way procurement reports it upward.' },
  { num: '02', title: 'Cost Avoidance', body: 'The value of a cost increase that never happened, so your number counts even when spend still grows.' },
  {
    num: '03',
    title: 'Total Cost of Ownership',
    body: 'Why the cheapest quote can be the most expensive decision. In the session example, the vendor that was $198K higher on price came out $724K lower over the life of the solution.',
    tco: true,
  },
  { num: '04', title: 'Savings Realization Rate', body: 'A negotiated saving only matters if it materializes. How to show what the customer will actually capture after signature.' },
  { num: '05', title: 'Vendor Risk Score', body: 'How procurement scores the damage if you fail, and how to cut that score in half before they bring it up.' },
];

const toForm = () => {
  const el = document.getElementById('access');
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
};

const ProcurementSession = () => {
  // GHL's embed script handles the iframe auto-resize.
  useEffect(() => {
    const src = 'https://link.msgsndr.com/js/form_embed.js';
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <>
      <Head>
        <title>The Five Numbers Procurement Lives By | Whyzer</title>
        <link rel="canonical" href="https://www.whyzer.ai/procurement-session" />
        <meta property="og:url" content="https://www.whyzer.ai/procurement-session" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Five Numbers Procurement Lives By" />
        <meta property="og:description" content="A free 25-minute on-demand session with Jamal Reimer on the five metrics procurement uses to decide whether your project is a good place to put the company's money." />
        <meta name="description" content="A free 25-minute on-demand session with Jamal Reimer on the five metrics procurement uses to decide whether your project is a good place to put the company's money." />
      </Head>
      <FunnelPage>
        {/* Hero */}
        <section className="wzf-hero" style={{ textAlign: 'left', padding: '20px 0 28px' }}>
          <div className="wzf-wrap ps-hero-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span className="ps-eyebrow">Free on-demand session</span>
              <h1 className="ps-h1">The Five Numbers Procurement Lives By</h1>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, lineHeight: 1.5, color: '#55556B', margin: 0, maxWidth: '50ch', textWrap: 'pretty' }}>
                When procurement joins your deal, the real question on the table is whether your project is a good place to put the company's money. In this 25-minute session, Jamal Reimer breaks down the five metrics procurement uses to answer it, and how to build a business case that answers them before they ask.
              </p>
              <div className="ps-meta">
                <span>▶ 25 minutes</span>
                <span>·</span>
                <span>On demand</span>
                <span>·</span>
                <span>With Jamal Reimer</span>
              </div>
              <div className="ps-still">
                <img src="/thumb.jpg" alt="Jamal Reimer on the Five Numbers session" />
                <span className="wz-badge wz-badge--error wz-badge--sm" style={{ position: 'absolute', top: 20, left: 20, display: 'inline-flex', background: '#fbe4e3', color: '#b3413f', borderRadius: 9999, padding: '5px 12px', fontSize: 13 }}>
                  Recorded live
                </span>
              </div>
            </div>

            <div id="access" className="ps-formcard">
              <p style={{ margin: 0, padding: '4px 4px 0', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, lineHeight: 1.4, color: '#14141F', textWrap: 'pretty' }}>
                You'll leave with a procurement-ready business case process you can run on a live deal this week.
              </p>
              <div data-form-embed="true" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <iframe
                  src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
                  id={`inline-${FORM_ID}`}
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="Procurement Webinar – Registration Form"
                  data-height="640"
                  data-layout-iframe-id={`inline-${FORM_ID}`}
                  data-form-id={FORM_ID}
                  data-cookie-consent="true"
                  data-cookie-consent-provider="auto"
                  title="Procurement Webinar – Registration Form"
                />
              </div>
              <p style={{ margin: 0, padding: '12px 4px 0', borderTop: '1px solid #E4E3F0', fontSize: 13, lineHeight: 1.45, color: '#55556B', textWrap: 'pretty' }}>
                Jamal Reimer closed $160M+ in enterprise SaaS as an individual contributor and wrote Mega Deal Secrets. He now coaches sellers through seven- and eight-figure deals.
              </p>
            </div>
          </div>
        </section>

        {/* What you'll learn */}
        <section className="wzf-wrap" style={{ padding: '96px 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px 64px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span className="ps-eyebrow ps-eyebrow--muted">What you'll learn</span>
              <h2 className="ps-h2" style={{ fontSize: 40 }}>The five numbers</h2>
              <p style={{ margin: 0, color: '#55556B', maxWidth: '34ch' }}>The metrics procurement uses to decide whether your project is a good place to put the company's money.</p>
            </div>
            <div style={{ flex: '2 1 480px', minWidth: 0 }}>
              {NUMBERS.map((n) => (
                <div key={n.num} className="ps-num">
                  <span className="ps-num-n">{n.num}</span>
                  <div>
                    <h3>{n.title}</h3>
                    <p style={{ margin: 0, color: '#55556B', maxWidth: '58ch', textWrap: 'pretty' }}>{n.body}</p>
                    {n.tco && (
                      <div className="ps-tco">
                        <div>
                          <span className="l">Price</span>
                          <span className="v">+$198K</span>
                          <span style={{ fontSize: 13 }}>higher quote</span>
                        </div>
                        <div>
                          <span className="l">Total cost of ownership</span>
                          <span className="v">−$724K</span>
                          <span style={{ fontSize: 13 }}>over the life of the solution</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="wzf-wrap" style={{ padding: '0 32px 96px' }}>
          <div className="ps-band" style={{ padding: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: '52ch' }}>
              <h2 style={{ fontSize: 32, lineHeight: 1.15, letterSpacing: '-.02em', margin: 0 }}>Bring procurement the first draft</h2>
              <p style={{ margin: 0 }}>25 minutes. A business case process you can run on a live deal this week.</p>
            </div>
            <button type="button" onClick={toForm} className="ps-btn ps-btn--primary" style={{ border: 0, cursor: 'pointer', minHeight: 56, padding: '16px 36px', fontSize: 18, fontFamily: 'inherit' }}>
              Get instant access
            </button>
          </div>
        </section>
      </FunnelPage>
    </>
  );
};

export default ProcurementSession;

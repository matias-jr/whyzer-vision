import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SitePage from '@/components/site/SitePage';
import ArticleCard from '@/components/whyzer/ArticleCard';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';
import { listPublishedArticles } from '@/lib/articles';
import type { ArticleSummary } from '@/types/article';
import { Zap, Eye, BookOpen } from 'lucide-react';

import { Head } from 'vite-react-ssg';
import { trackLinkedInConversion } from '@/lib/linkedinConversion';
const valueProps = [
  {
    icon: Eye,
    label: 'How your customers are using AI to learn about you',
    description: 'Buyers are running deep AI-powered research on your company, your competitors, and your weaknesses before you even get on a call. We surface what they\'re finding — so you walk in prepared, not surprised.',
  },
  {
    icon: Zap,
    label: 'How to use AI in your own selling',
    description: 'Not generic prompts. Real techniques that strategic sellers are using right now to run better discovery, craft sharper proposals, and close faster — tailored to B2B enterprise deals.',
  },
  {
    icon: BookOpen,
    label: 'How your company could use AI',
    description: 'The sellers who win aren\'t just better at pitching — they understand where AI fits in their buyer\'s world. We help you spot those moments and turn them into conversations that unlock new value.',
  },
];

const Newsletter = () => {
  const cardsRef = useStaggerReveal(valueProps.length, 120);
  const proofRef = useScrollReveal(0.2);
  const [recentIssues, setRecentIssues] = useState<ArticleSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    listPublishedArticles()
      .then((articles) => {
        if (!cancelled) setRecentIssues(articles.slice(0, 3));
      })
      .catch(() => {
        // archive section just stays hidden if the fetch fails
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // LinkedIn conversion tracking for the GHL-embedded newsletter form.
  // Because the submit button lives inside a cross-origin iframe we can't
  // attach a click handler directly. GHL's embed script broadcasts a
  // postMessage to the parent window when the form is submitted — we listen
  // for that here and fire the LinkedIn event tracker.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages that originate from GHL / msgsndr domains.
      if (
        typeof event.origin === 'string' &&
        !event.origin.includes('msgsndr.com') &&
        !event.origin.includes('gohighlevel.com') &&
        !event.origin.includes('leadconnectorhq.com')
      ) return;

      const data = event.data;
      if (!data) return;

      // GHL can send the payload as a string or object depending on version.
      const payload = typeof data === 'string' ? (() => { try { return JSON.parse(data); } catch { return {}; } })() : data;

      const isSubmit =
        payload?.type === 'form_submitted' ||
        payload?.event === 'form_submitted' ||
        payload?.type === 'submit' ||
        payload?.action === 'submit' ||
        (typeof payload?.message === 'string' && payload.message.toLowerCase().includes('submit'));

      if (isSubmit) {
        // Insight Tag + server-side CAPI, both for the same subscription.
        trackLinkedInConversion('newsletter', 27310609);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <SitePage>
      <Head>
        <title>AI Secrets for Strategic Sellers · Newsletter | Whyzer</title>
        <link rel="canonical" href="https://www.whyzer.ai/newsletter" />
        <meta property="og:url" content="https://www.whyzer.ai/newsletter" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Secrets for Strategic Sellers" />
        <meta property="og:description" content="The newsletter strategic sellers use to level up in the AI world. No spam, no tools to set up, unsubscribe anytime." />
        <meta name="description" content="The newsletter strategic sellers use to level up in the AI world. No spam, no tools to set up, unsubscribe anytime." />
      </Head>

      {/* ── Hero + Form ── */}
      <section
        style={{
          padding: '72px 0 64px',
          background:
            'radial-gradient(ellipse 900px 520px at 78% 0%, rgba(191,224,253,.5), transparent 62%), radial-gradient(ellipse 760px 480px at 8% 100%, rgba(141,93,184,.22), transparent 60%), #FAFAF9',
        }}
      >
        <div className="wzsite-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <p className="wzsite-eyebrow" style={{ marginBottom: 16 }}>
            Join the newsletter strategic sellers are using to level up in the AI world
          </p>
          <h1 className="wzsite-h1" style={{ fontSize: 'clamp(36px, 6vw, 60px)', marginBottom: 20 }}>
            AI Secrets for<br />Strategic Sellers
          </h1>
          <p className="wzsite-p" style={{ maxWidth: 580, fontSize: 17, marginBottom: 36 }}>
            Buyers are using AI in ways most sellers can't imagine. Reps get drowned in daily AI updates not knowing where to start. Every week, we close that gap — you'll receive curated AI insights that apply directly to your deals, not to AI in general.
          </p>

          <div
            style={{ width: '100%', maxWidth: 520, borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 90px -40px rgba(20,20,40,.55)', border: '1px solid rgba(255,255,255,.85)' }}
          >
            <iframe
              src="https://link.msgsndr.com/widget/form/DbN0tSSpu40MR5JB2Zbc"
              style={{ width: '100%', height: '356px', border: 'none', display: 'block' }}
              id="inline-DbN0tSSpu40MR5JB2Zbc"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="AI Newsletter Subscription – Whyzer"
              data-height="356"
              data-layout-iframe-id="inline-DbN0tSSpu40MR5JB2Zbc"
              data-form-id="DbN0tSSpu40MR5JB2Zbc"
              title="AI Newsletter Subscription – Whyzer"
            />
          </div>

          <p className="wzsite-meta" style={{ marginTop: 16, fontSize: 12.5 }}>
            No spam. No tools to set up. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section style={{ padding: '80px 0', background: '#F2F1FB', borderTop: '1px solid #E4E3F0', borderBottom: '1px solid #E4E3F0' }}>
        <div className="wzsite-wrap">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p className="wzsite-eyebrow">Weekly AI nuggets to surface</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {valueProps.map((prop, i) => {
              const Icon = prop.icon;
              return (
                <div key={prop.label} ref={cardsRef(i)} className="wzsite-card" style={{ padding: 30 }}>
                  <div
                    style={{ width: 40, height: 40, borderRadius: 10, background: '#EEEEFC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
                  >
                    <Icon size={18} style={{ color: '#4a4ad1' }} />
                  </div>
                  <h3 style={{ fontSize: 19, lineHeight: 1.3, marginBottom: 10 }}>{prop.label}</h3>
                  <p className="wzsite-p" style={{ fontSize: 14.5, lineHeight: 1.7, marginBottom: 0 }}>{prop.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Recent Issues ── */}
      {recentIssues.length > 0 && (
        <section style={{ padding: '80px 0' }}>
          <div className="wzsite-wrap">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
              <div>
                <p className="wzsite-eyebrow">Recent Issues</p>
                <h2 style={{ fontSize: 31, lineHeight: 1.18 }}>Catch up on past editions</h2>
              </div>
              <Link to="/newsletter/archive" style={{ fontSize: 14, fontWeight: 600 }}>
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentIssues.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Social proof ── */}
      <section style={{ padding: '0 0 80px' }}>
        <div
          ref={proofRef}
          className="wzsite-wrap"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 48, borderTop: '1px solid #E4E3F0' }}
        >
          <p className="wzsite-meta" style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, fontSize: 12.5, textAlign: 'center' }}>
            Built for sellers navigating a world where buyers are already AI-native
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 40px' }}>
            {['Enterprise AEs', 'Strategic Account Managers', 'Revenue Leaders', 'Solution Engineers'].map((role) => (
              <span key={role} style={{ fontSize: 15, fontWeight: 500, color: '#55556B' }}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>
    </SitePage>
  );
};

export default Newsletter;

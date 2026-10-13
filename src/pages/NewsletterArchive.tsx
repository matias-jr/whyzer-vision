import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SitePage from '@/components/site/SitePage';
import ArticleCard from '@/components/whyzer/ArticleCard';
import { listPublishedArticles } from '@/lib/articles';
import type { ArticleSummary } from '@/types/article';

import { Head } from 'vite-react-ssg';
type State =
  | { kind: 'loading' }
  | { kind: 'ready'; articles: ArticleSummary[] }
  | { kind: 'error'; message: string };

const NewsletterArchive = () => {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    document.title = 'Newsletter Archive — Whyzer';
    let cancelled = false;
    listPublishedArticles()
      .then((articles) => {
        if (!cancelled) setState({ kind: 'ready', articles });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ kind: 'error', message: err.message ?? 'Failed to load' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SitePage>
      <Head>
        <title>Newsletter Archive · AI Secrets for Strategic Sellers | Whyzer</title>
        <link rel="canonical" href="https://www.whyzer.ai/newsletter/archive" />
        <meta property="og:url" content="https://www.whyzer.ai/newsletter/archive" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Newsletter Archive | Whyzer" />
        <meta property="og:description" content="Every past issue of AI Secrets for Strategic Sellers, the newsletter for B2B sellers working the AI shift." />
        <meta name="description" content="Every past issue of AI Secrets for Strategic Sellers, the newsletter for B2B sellers working the AI shift." />
      </Head>

      <main className="wzsite-wrap" style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="wzsite-eyebrow">The Archive</p>
          <h1 className="wzsite-h1" style={{ maxWidth: 760, margin: '0 auto 14px' }}>AI Secrets for Strategic Sellers</h1>
          <p className="wzsite-p" style={{ maxWidth: 560, margin: '0 auto 22px' }}>
            Every past issue. Curated AI insights that apply directly to your deals.
          </p>
          <Link to="/newsletter" className="wzsite-btn">Subscribe →</Link>
        </div>

        {state.kind === 'loading' && <p className="wzsite-meta" style={{ textAlign: 'center', padding: '48px 0' }}>Loading…</p>}

        {state.kind === 'error' && (
          <p style={{ textAlign: 'center', padding: '48px 0', color: '#B3413F', fontSize: 14 }}>{state.message}</p>
        )}

        {state.kind === 'ready' && state.articles.length === 0 && (
          <div className="wzsite-card" style={{ textAlign: 'center', padding: 64, borderStyle: 'dashed' }}>
            <p className="wzsite-p" style={{ marginBottom: 0 }}>No issues published yet. Check back soon.</p>
          </div>
        )}

        {state.kind === 'ready' && state.articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>
    </SitePage>
  );
};

export default NewsletterArchive;

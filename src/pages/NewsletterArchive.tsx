import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GrainOverlay from '@/components/whyzer/GrainOverlay';
import ArticleCard from '@/components/whyzer/ArticleCard';
import { listPublishedArticles } from '@/lib/articles';
import type { ArticleSummary } from '@/types/article';

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
    <div className="relative min-h-screen bg-background text-foreground">
      <GrainOverlay />

      <header className="relative z-10 px-6 py-6 md:px-12 flex items-center justify-between">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-foreground transition-colors"
        >
          ← whyzer
        </Link>
        <Link
          to="/newsletter"
          className="font-mono text-xs uppercase tracking-[0.15em] text-primary hover:underline"
        >
          Subscribe →
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24 pt-8 md:px-12">
        <div className="mb-14 text-center">
          <p className="font-mono-brand text-xs uppercase tracking-[0.2em] text-primary mb-4">
            The Archive
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05] tracking-tight mb-4">
            AI Secrets for Strategic Sellers
          </h1>
          <p className="font-body text-lg text-text-secondary max-w-[560px] mx-auto">
            Every past issue. Curated AI insights that apply directly to your deals.
          </p>
        </div>

        {state.kind === 'loading' && (
          <p className="font-mono text-sm text-text-secondary text-center py-12">
            Loading…
          </p>
        )}

        {state.kind === 'error' && (
          <p className="font-mono text-sm text-destructive text-center py-12">
            {state.message}
          </p>
        )}

        {state.kind === 'ready' && state.articles.length === 0 && (
          <div className="border border-dashed border-foreground/15 rounded-xl p-16 text-center">
            <p className="font-body text-text-secondary">
              No issues published yet. Check back soon.
            </p>
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
    </div>
  );
};

export default NewsletterArchive;

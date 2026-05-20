import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GrainOverlay from '@/components/whyzer/GrainOverlay';
import { getArticleBySlug } from '@/lib/articles';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import type { Article } from '@/types/article';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; article: Article }
  | { kind: 'not-found' }
  | { kind: 'error'; message: string };

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function setMeta(article: Article) {
  document.title = `${article.title} — Whyzer`;
  const ensureMeta = (selector: string, attrName: 'name' | 'property', attrValue: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    return el;
  };
  const desc = article.excerpt ?? '';
  ensureMeta('meta[name="description"]', 'name', 'description').content = desc;
  ensureMeta('meta[property="og:title"]', 'property', 'og:title').content = article.title;
  ensureMeta('meta[property="og:description"]', 'property', 'og:description').content = desc;
  ensureMeta('meta[property="og:type"]', 'property', 'og:type').content = 'article';
  if (article.cover_image_url) {
    ensureMeta('meta[property="og:image"]', 'property', 'og:image').content =
      article.cover_image_url;
  }
  if (article.published_at) {
    ensureMeta(
      'meta[property="article:published_time"]',
      'property',
      'article:published_time',
    ).content = article.published_at;
  }
  // canonical
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = `${window.location.origin}/newsletter/${article.slug}`;
}

const NewsletterPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<LoadState>({ kind: 'loading' });

  useEffect(() => {
    if (!slug) {
      setState({ kind: 'not-found' });
      return;
    }
    let cancelled = false;
    getArticleBySlug(slug)
      .then((article) => {
        if (cancelled) return;
        if (!article) {
          setState({ kind: 'not-found' });
          return;
        }
        setState({ kind: 'ready', article });
        setMeta(article);
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ kind: 'error', message: err.message ?? 'Failed to load article' });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <GrainOverlay />

      <header className="relative z-10 px-6 py-6 md:px-12">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-foreground transition-colors"
        >
          ← whyzer
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-[720px] px-6 pb-24 pt-8 md:px-0">
        {state.kind === 'loading' && (
          <p className="font-mono text-sm text-text-secondary">Loading…</p>
        )}

        {state.kind === 'not-found' && (
          <div className="py-24 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
              404
            </p>
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-6">
              Article not found
            </h1>
            <Link
              to="/newsletter/archive"
              className="font-mono text-sm uppercase tracking-wider text-primary hover:underline"
            >
              ← Browse all issues
            </Link>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="py-24 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-destructive mb-4">
              Error
            </p>
            <p className="font-body text-text-secondary">{state.message}</p>
          </div>
        )}

        {state.kind === 'ready' && (
          <article>
            <div className="mb-8">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                {formatDate(state.article.published_at)}
                {state.article.author ? ` · ${state.article.author}` : ''}
              </p>
              <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05] tracking-tight mb-6">
                {state.article.title}
              </h1>
              {state.article.excerpt && (
                <p className="font-body text-lg text-text-secondary leading-relaxed">
                  {state.article.excerpt}
                </p>
              )}
            </div>

            {state.article.cover_image_url && (
              <img
                src={state.article.cover_image_url}
                alt=""
                className="w-full rounded-lg mb-12 aspect-[16/9] object-cover"
              />
            )}

            <div
              className="article-body font-body text-[17px] leading-[1.75] text-foreground"
              dangerouslySetInnerHTML={{
                __html: sanitizeArticleHtml(state.article.body),
              }}
            />

            <div className="mt-16 pt-8 border-t border-foreground/10">
              <Link
                to="/newsletter"
                className="font-mono text-sm uppercase tracking-wider text-primary hover:underline"
              >
                Subscribe to the newsletter →
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default NewsletterPost;

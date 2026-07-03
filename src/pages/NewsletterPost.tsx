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
    <div className="relative min-h-screen" style={{ background: '#0A0E1A', color: '#F9FAFB' }}>
      <GrainOverlay />

      <header className="relative z-10 px-6 py-6 md:px-12">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.15em] transition-opacity duration-200 hover:opacity-80"
          style={{ color: '#6366F1', textDecoration: 'none' }}
        >
          ← whyzer
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-[720px] px-6 pb-24 pt-8 md:px-0">
        {state.kind === 'loading' && (
          <p className="font-mono text-sm" style={{ color: '#9CA3AF' }}>Loading…</p>
        )}

        {state.kind === 'not-found' && (
          <div className="py-24 text-center">
            <p
              className="font-mono text-xs uppercase tracking-[0.15em] mb-4"
              style={{ color: '#555E75' }}
            >
              404
            </p>
            <h1
              className="mb-6"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px, 4vw, 42px)',
                letterSpacing: '-0.035em',
                lineHeight: 1.15,
                color: '#F9FAFB',
              }}
            >
              Article not found
            </h1>
            <Link
              to="/newsletter/archive"
              className="font-mono text-sm uppercase tracking-wider hover:underline"
              style={{ color: '#6366F1', textDecoration: 'none' }}
            >
              ← Browse all issues
            </Link>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="py-24 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] mb-4" style={{ color: '#555E75' }}>
              Error
            </p>
            <p className="font-body" style={{ color: '#9CA3AF' }}>{state.message}</p>
          </div>
        )}

        {state.kind === 'ready' && (
          <article>
            {/* Hero glow behind headline */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 900,
                height: 400,
                background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.09) 0%, transparent 65%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
            <div className="mb-8" style={{ position: 'relative', zIndex: 1 }}>
              <p
                className="font-mono text-xs uppercase tracking-[0.15em] mb-4"
                style={{ color: '#555E75', fontSize: 13 }}
              >
                {formatDate(state.article.published_at)}
                {state.article.author ? ` · ${state.article.author}` : ''}
              </p>
              <h1
                className="mb-6"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                  color: '#F9FAFB',
                }}
              >
                {state.article.title}
              </h1>
              {state.article.excerpt && (
                <p className="font-body text-lg leading-relaxed" style={{ color: '#9CA3AF', fontSize: 17 }}>
                  {state.article.excerpt}
                </p>
              )}
            </div>

            {state.article.cover_image_url && (
              <img
                src={state.article.cover_image_url}
                alt=""
                className="w-full mb-12 aspect-[16/9] object-cover"
                style={{ borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              />
            )}

            <div
              className="article-body font-body text-[17px] leading-[1.75]"
              dangerouslySetInnerHTML={{
                __html: sanitizeArticleHtml(state.article.body),
              }}
            />

            <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Link
                to="/newsletter"
                className="font-mono text-sm uppercase tracking-wider hover:underline"
                style={{ color: '#6366F1', textDecoration: 'none' }}
              >
                ← Subscribe to the newsletter
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default NewsletterPost;

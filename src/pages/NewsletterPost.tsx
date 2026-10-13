import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SitePage from '@/components/site/SitePage';
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
    <SitePage>
      <main className="wzsite-article">
        {state.kind === 'loading' && <p className="wzsite-meta">Loading…</p>}

        {state.kind === 'not-found' && (
          <div style={{ padding: '72px 0', textAlign: 'center' }}>
            <p className="wzsite-eyebrow">404</p>
            <h1 style={{ marginBottom: 20 }}>Article not found</h1>
            <Link to="/newsletter/archive" className="wzsite-btn wzsite-btn--ghost">← Browse all issues</Link>
          </div>
        )}

        {state.kind === 'error' && (
          <div style={{ padding: '72px 0', textAlign: 'center' }}>
            <p className="wzsite-eyebrow">Error</p>
            <p className="wzsite-p">{state.message}</p>
          </div>
        )}

        {state.kind === 'ready' && (
          <article>
            <div style={{ marginBottom: 32 }}>
              <p className="wzsite-eyebrow">
                {formatDate(state.article.published_at)}
                {state.article.author ? ` · ${state.article.author}` : ''}
              </p>
              <h1 style={{ marginBottom: 18 }}>{state.article.title}</h1>
              {state.article.excerpt && (
                <p className="wzsite-p" style={{ fontSize: 18, lineHeight: 1.65 }}>{state.article.excerpt}</p>
              )}
            </div>

            {state.article.cover_image_url && (
              <img
                src={state.article.cover_image_url}
                alt=""
                style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 16, marginBottom: 48, boxShadow: '0 26px 54px -34px rgba(20,20,40,.4)' }}
              />
            )}

            <div
              className="article-body"
              style={{ fontSize: 17, lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{
                __html: sanitizeArticleHtml(state.article.body),
              }}
            />

            <div style={{ marginTop: 64, paddingTop: 28, borderTop: '1px solid #E4E3F0' }}>
              <Link to="/newsletter" className="wzsite-btn">Subscribe to the newsletter →</Link>
            </div>
          </article>
        )}
      </main>
    </SitePage>
  );
};

export default NewsletterPost;

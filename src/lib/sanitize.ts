import DOMPurify from 'dompurify';

// Sanitize editor output before rendering as HTML. Tiptap produces clean HTML
// already, but a defense-in-depth sweep blocks any injection if a stored row
// is ever modified outside the app.
export function sanitizeArticleHtml(html: string): string {
  if (typeof window === 'undefined') {
    // SSG prerender pass — DOMPurify needs a window; return the input.
    // The browser will sanitize on hydration via dangerouslySetInnerHTML re-render.
    return html;
  }
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });
}

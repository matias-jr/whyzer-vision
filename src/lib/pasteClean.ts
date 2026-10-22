/**
 * Cleans HTML pasted into the newsletter editor (Google Docs, Notion, Word, web pages).
 *
 * Pasted markup carries the source's inline typography: point sizes, fonts, line heights
 * and emoji rendered as tiny images or in emoji-specific fonts, which is what makes emoji
 * show up at odd sizes. We drop all of that so pasted text inherits the article's own
 * type, keep genuinely meaningful formatting (bold, italics, lists, links, headings and
 * non-default colours), and turn bare URLs in the text into links.
 */

const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,;:!?)\]}])/gi;
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const EMOJI_RE = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

/** Style properties that are removed outright. */
const DROP_PROPS = new Set([
  'font-size', 'font', 'font-family', 'font-variant', 'font-variant-ligatures', 'font-variant-caps',
  'font-variant-numeric', 'font-variant-east-asian', 'font-variant-position', 'line-height',
  'letter-spacing', 'word-spacing', 'white-space', 'text-indent', 'vertical-align',
  'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
  'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'text-decoration-skip-ink',
]);

function parseColor(v: string): [number, number, number] | null {
  const s = v.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) {
    const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  m = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  if (s === 'black') return [0, 0, 0];
  if (s === 'white') return [255, 255, 255];
  return null;
}

/** Near-black / near-white / transparent colours are the source's defaults, not a deliberate choice. */
function isDefaultColor(v: string): boolean {
  const s = v.trim().toLowerCase();
  if (!s || s === 'transparent' || s === 'inherit' || s === 'initial' || s === 'windowtext' || s === 'currentcolor') return true;
  const c = parseColor(s);
  if (!c) return false;
  const lum = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
  return lum < 0.16 || lum > 0.94;
}

function cleanStyle(el: HTMLElement) {
  const style = el.getAttribute('style');
  if (!style) return;
  const kept: string[] = [];
  for (const decl of style.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim().toLowerCase();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val || DROP_PROPS.has(prop)) continue;
    if ((prop === 'color' || prop === 'background-color' || prop === 'background') && isDefaultColor(val)) continue;
    if (prop === 'text-align' || prop === 'color' || prop === 'background-color' || prop === 'font-weight' || prop === 'font-style' || prop === 'text-decoration') {
      kept.push(`${prop}: ${val}`);
    }
  }
  if (kept.length) el.setAttribute('style', kept.join('; '));
  else el.removeAttribute('style');
}

function isEmojiImage(img: HTMLImageElement): boolean {
  const alt = img.getAttribute('alt') ?? '';
  const src = img.getAttribute('src') ?? '';
  if (alt && EMOJI_RE.test(alt) && alt.length <= 12) return true;
  if (/emoji|twemoji|emojione|noto-emoji|\/emoticon|smilies/i.test(src)) return true;
  if (/\bemoji\b/i.test(img.className)) return true;
  const w = Number(img.getAttribute('width') || 0);
  const h = Number(img.getAttribute('height') || 0);
  return Boolean(w && h && w <= 72 && h <= 72 && alt && EMOJI_RE.test(alt));
}

function linkifyTextNodes(root: Element) {
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    if (t.parentElement?.closest('a, code, pre')) continue;
    if (URL_RE.test(t.data) || EMAIL_RE.test(t.data)) targets.push(t);
    URL_RE.lastIndex = 0;
    EMAIL_RE.lastIndex = 0;
  }
  for (const t of targets) {
    const frag = doc.createDocumentFragment();
    // One combined pass so a URL containing an '@' is not double-linked.
    const combined = new RegExp(`${URL_RE.source}|${EMAIL_RE.source}`, 'gi');
    let last = 0;
    for (const m of t.data.matchAll(combined)) {
      const idx = m.index ?? 0;
      if (idx > last) frag.appendChild(doc.createTextNode(t.data.slice(last, idx)));
      const text = m[0];
      const a = doc.createElement('a');
      a.textContent = text;
      a.setAttribute('href', text.includes('@') && !/^(https?:\/\/|www\.)/i.test(text) ? `mailto:${text}` : /^www\./i.test(text) ? `https://${text}` : text);
      frag.appendChild(a);
      last = idx + text.length;
    }
    if (last < t.data.length) frag.appendChild(doc.createTextNode(t.data.slice(last)));
    t.replaceWith(frag);
  }
}

export function cleanPastedHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  // Emoji that arrive as images become plain text characters at the surrounding size.
  body.querySelectorAll('img').forEach((img) => {
    if (isEmojiImage(img)) img.replaceWith(doc.createTextNode(img.getAttribute('alt') ?? ''));
  });

  // Legacy <font size=…> wrappers (Word, old pages): keep the text, drop the wrapper.
  body.querySelectorAll('font').forEach((f) => f.replaceWith(...Array.from(f.childNodes)));

  body.querySelectorAll<HTMLElement>('*').forEach((el) => {
    cleanStyle(el);
    el.removeAttribute('class');
    el.removeAttribute('id');
    ['width', 'height', 'size', 'face', 'color', 'bgcolor'].forEach((a) => {
      if (el.tagName !== 'IMG') el.removeAttribute(a);
    });
  });

  // Google Docs wraps everything in <b id="docs-internal-guid-…" style="font-weight:normal">.
  body.querySelectorAll<HTMLElement>('b[id^="docs-internal-guid"], b[style*="font-weight: normal"], b[style*="font-weight:normal"]').forEach((b) => {
    b.replaceWith(...Array.from(b.childNodes));
  });

  // Empty spans left behind once their styles were removed.
  body.querySelectorAll('span').forEach((s) => {
    if (!s.attributes.length) s.replaceWith(...Array.from(s.childNodes));
  });

  linkifyTextNodes(body);
  return body.innerHTML;
}

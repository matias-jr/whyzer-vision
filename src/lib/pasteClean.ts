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

/**
 * Only the source's *defaults* are dropped: exact black, exact white, transparent and
 * "inherit"-style keywords. Everything else, including dark navy and near-blacks, is a
 * deliberate colour and is kept.
 */
function isDefaultColor(v: string): boolean {
  const s = v.trim().toLowerCase().replace(/\s+/g, '');
  if (!s || ['transparent', 'inherit', 'initial', 'unset', 'windowtext', 'currentcolor', 'black', 'white', '#000', '#000000', '#fff', '#ffffff'].includes(s)) return true;
  if (/^rgba?\(0,0,0(,1(\.0+)?)?\)$/.test(s) || /^rgba?\(255,255,255(,1(\.0+)?)?\)$/.test(s)) return true;
  const alpha = s.match(/^rgba\([^)]*,(0(\.0+)?)\)$/);
  return Boolean(alpha);
}

/**
 * Makes a pasted href something the editor keeps. The link extension silently drops
 * protocol-less links such as "example.com/page", so they are given https://.
 */
export function normalizeHref(raw: string): string {
  const href = raw.trim();
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|sms:|ftp:|ftps:|callto:|cid:|xmpp:|#|\/|\.)/i.test(href)) return href.replace(/\s/g, '%20');
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href; // other schemes: leave to the editor's rules
  if (/^www\./i.test(href) || /^[\w-]+(\.[\w-]+)+(?::\d+)?(\/|\?|#|$)/.test(href)) return `https://${href.replace(/\s/g, '%20')}`;
  return href;
}

function cleanStyle(el: HTMLElement) {
  const style = el.getAttribute('style');
  if (!style) return;
  const inLink = Boolean(el.closest('a'));
  const decls = style.split(';').map((d) => {
    const i = d.indexOf(':');
    return i < 0 ? null : ([d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).trim()] as const);
  });
  // White (or black) text paired with a real background colour is a deliberate pairing, e.g. a button.
  const hasBg = decls.some((d) => d && (d[0] === 'background-color' || d[0] === 'background') && d[1] && !isDefaultColor(d[1]));
  const kept: string[] = [];
  for (const d of decls) {
    if (!d) continue;
    const [prop, val] = d;
    if (!prop || !val || DROP_PROPS.has(prop)) continue;
    // Links get the article's own link styling, not the source's (e.g. Google Docs blue underline).
    if (inLink && (prop === 'color' || prop === 'text-decoration')) continue;
    if ((prop === 'color' && !hasBg && isDefaultColor(val)) || ((prop === 'background-color' || prop === 'background') && isDefaultColor(val))) continue;
    if (['text-align', 'color', 'background-color', 'font-weight', 'font-style', 'text-decoration'].includes(prop)) kept.push(`${prop}: ${val}`);
  }
  if (kept.length) el.setAttribute('style', kept.join('; '));
  else el.removeAttribute('style');
}

/**
 * The editor stores colour on text, not on blocks. Colour set on a paragraph, heading or
 * list item is moved onto a span around its contents so it survives the paste.
 */
function pushBlockColorDown(root: Element) {
  const doc = root.ownerDocument;
  root.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, li, blockquote, div, td').forEach((el) => {
    const style = el.getAttribute('style');
    if (!style) return;
    const props = style.split(';').map((d) => d.trim()).filter(Boolean);
    const carry = props.filter((d) => /^(color|background-color)\s*:/i.test(d));
    if (!carry.length) return;
    const rest = props.filter((d) => !/^(color|background-color)\s*:/i.test(d));
    if (rest.length) el.setAttribute('style', rest.join('; '));
    else el.removeAttribute('style');
    // Wrap each run of text (not text inside links, which keep the link styling).
    const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n as Text;
      const parent = t.parentElement;
      if (!t.data.length || !parent || parent.closest('a')) continue;
      // Text already inside a span with its own colour keeps that colour.
      const own = parent.closest('span[style*="color"]');
      if (own && el.contains(own) && own !== el) continue;
      texts.push(t);
    }
    texts.forEach((t) => {
      const span = doc.createElement('span');
      span.setAttribute('style', carry.join('; '));
      t.replaceWith(span);
      span.appendChild(t);
    });
  });
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
  // Copied from this editor (ProseMirror tags its clipboard HTML): keep every size, colour and link as is.
  if (/data-pm-slice=/.test(html)) return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  // Emoji that arrive as images become plain text characters at the surrounding size.
  body.querySelectorAll('img').forEach((img) => {
    if (isEmojiImage(img)) img.replaceWith(doc.createTextNode(img.getAttribute('alt') ?? ''));
  });

  // Legacy <font size=…> wrappers (Word, old pages): keep the text, drop the wrapper.
  body.querySelectorAll('font').forEach((f) => f.replaceWith(...Array.from(f.childNodes)));

  body.querySelectorAll('a[href]').forEach((a) => a.setAttribute('href', normalizeHref(a.getAttribute('href') ?? '')));

  body.querySelectorAll<HTMLElement>('*').forEach((el) => {
    cleanStyle(el);
    el.removeAttribute('class');
    el.removeAttribute('id');
    ['width', 'height', 'size', 'face', 'color', 'bgcolor'].forEach((a) => {
      if (el.tagName !== 'IMG') el.removeAttribute(a);
    });
  });

  pushBlockColorDown(body);

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

import { describe, expect, it } from 'vitest';
import { cleanPastedHtml } from '@/lib/pasteClean';

describe('cleanPastedHtml', () => {
  it('drops font sizes, families and line heights but keeps emphasis', () => {
    const out = cleanPastedHtml('<p style="font-size:11pt;line-height:1.4;font-family:Arial;text-align:center"><span style="font-size:26pt;font-family:\'Apple Color Emoji\';font-weight:700">Hi 🎉</span></p>');
    expect(out).not.toMatch(/font-size|font-family|line-height/);
    expect(out).toContain('text-align: center');
    expect(out).toContain('font-weight: 700');
    expect(out).toContain('Hi 🎉');
  });

  it('turns emoji images into text', () => {
    const out = cleanPastedHtml('<p>Go <img src="https://x/emoji/1f680.png" alt="🚀" width="64" height="64"> now</p>');
    expect(out).not.toContain('<img');
    expect(out).toContain('Go 🚀 now');
  });

  it('keeps real images', () => {
    expect(cleanPastedHtml('<p><img src="https://x/photo.jpg" alt="A chart"></p>')).toContain('<img');
  });

  it('removes default black/white colours but keeps deliberate ones', () => {
    const out = cleanPastedHtml('<span style="color:#000000;background-color:transparent">a</span><span style="color:#b3413f">b</span>');
    expect(out).not.toContain('#000000');
    expect(out).toContain('#b3413f');
  });

  it('links bare URLs and emails, not ones already linked', () => {
    const out = cleanPastedHtml('<p>See https://example.com/page, www.test.org and a@b.co. <a href="https://keep.me">https://keep.me</a></p>');
    expect(out).toContain('<a href="https://example.com/page">https://example.com/page</a>,');
    expect(out).toContain('<a href="https://www.test.org">www.test.org</a>');
    expect(out).toContain('<a href="mailto:a@b.co">a@b.co</a>');
    expect(out.match(/keep\.me/g)).toHaveLength(2); // href + text, no nested link
    expect(out).not.toContain('<a href="https://keep.me"><a');
  });

  it('unwraps the Google Docs wrapper and legacy <font>', () => {
    const out = cleanPastedHtml('<b id="docs-internal-guid-1" style="font-weight:normal"><p>x <font size="7">y</font></p></b>');
    expect(out).toBe('<p>x y</p>');
  });
});

describe('cleanPastedHtml: links and colours', () => {
  it('gives protocol-less links https:// so the editor keeps them', async () => {
    const { normalizeHref } = await import('@/lib/pasteClean');
    expect(normalizeHref('example.com/page')).toBe('https://example.com/page');
    expect(normalizeHref('www.example.com')).toBe('https://www.example.com');
    expect(normalizeHref(' https://x.com/a b ')).toBe('https://x.com/a%20b');
    expect(normalizeHref('mailto:a@b.co')).toBe('mailto:a@b.co');
    expect(normalizeHref('/pricing')).toBe('/pricing');
    expect(normalizeHref('#faq')).toBe('#faq');
  });

  it('keeps dark navy and near-black colours, drops only exact black/white', () => {
    const out = cleanPastedHtml('<span style="color:#0b0b18">a</span><span style="color:#14141f">b</span><span style="color:rgb(0, 0, 0)">c</span><span style="color:#ffffff">d</span>');
    expect(out).toContain('#0b0b18');
    expect(out).toContain('#14141f');
    expect(out).not.toMatch(/rgb\(0, 0, 0\)|#ffffff/);
  });

  it("drops the source's link styling but keeps the link", () => {
    const out = cleanPastedHtml('<a href="example.com/x"><span style="color:#1155cc;text-decoration:underline">Read</span></a>');
    expect(out).toContain('href="https://example.com/x"');
    expect(out).not.toMatch(/1155cc|underline/);
  });

  it("leaves HTML copied from the editor itself untouched", () => {
    const html = '<p data-pm-slice="1 1 []"><span style="color: rgb(11, 11, 24); font-size: 24px">x</span></p>';
    expect(cleanPastedHtml(html)).toBe(html);
  });
});

describe('cleanPastedHtml: block colours', () => {
  it('moves a colour set on a paragraph onto its text', () => {
    const out = cleanPastedHtml('<p style="color:#0b0b18;text-align:center">Navy paragraph</p>');
    expect(out).toContain('<p style="text-align: center"><span style="color: #0b0b18">Navy paragraph</span></p>');
  });
  it('keeps white text that sits on a real background', () => {
    const out = cleanPastedHtml('<span style="color:#ffffff;background-color:#6262e9">Buy</span>');
    expect(out).toContain('color: #ffffff');
    expect(out).toContain('#6262e9');
  });
});

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

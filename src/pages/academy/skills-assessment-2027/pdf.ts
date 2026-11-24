/**
 * "Download My Results" PDF. A port of the design source's jsPDF layout; the text and structure are
 * unchanged. jsPDF is imported on demand so the ~350 KB only loads when someone clicks the button.
 *
 * The booking link printed here is the public GHL calendar page (the on-page calendar is an embed
 * and has no standalone URL of its own).
 */
import type { Result } from './scoring';

export const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/O0C2dq7WSZSbujKsJVjB';

export async function downloadResultsPdf(r: Result): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = 612, M = 54, CW = W - M * 2;
  let y = M;
  const ink: [number, number, number] = [9, 19, 38];
  const muted: [number, number, number] = [85, 96, 122];
  const purple: [number, number, number] = [98, 98, 233];
  const need = (h: number) => { if (y + h > 792 - M) { doc.addPage(); y = M; } };
  const txt = (t: string, o: { size?: number; bold?: boolean; color?: [number, number, number]; w?: number; lh?: number; x?: number; after?: number } = {}) => {
    const sz = o.size || 10.5;
    doc.setFont('helvetica', o.bold ? 'bold' : 'normal');
    doc.setFontSize(sz);
    doc.setTextColor(...(o.color || ink));
    const lines = doc.splitTextToSize(t, o.w || CW) as string[];
    const lh = sz * (o.lh || 1.45);
    lines.forEach((l) => { need(lh); doc.text(l, o.x || M, y + sz); y += lh; });
    y += o.after ?? 6;
  };
  const eyebrow = (t: string) => { y += 8; txt(t.toUpperCase(), { size: 8.5, bold: true, color: purple, after: 4 }); };

  doc.setFillColor(...ink); doc.rect(0, 0, W, 96, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('WHYZER  ·  ACADEMY', M, 40);
  doc.setFontSize(18); doc.text('Your Enterprise Selling Skills Assessment', M, 70);
  y = 124;
  txt(`Overall score: ${r.total}/25 (${r.totalPct}%)`, { size: 15, bold: true, after: 4 });
  txt(`${r.strongLabel}: ${r.strongText}`, { after: 2 });
  txt(`${r.weakLabel}: ${r.weakText}`, { after: 10 });
  eyebrow('Your skills, ranked');
  r.rows.forEach((row) => {
    need(30);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(...ink); doc.text(`${row.rank}  ${row.name}`, M, y + 11);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted); doc.text(`${row.score}/5 · ${row.pct}% · ${row.rating}`, W - M, y + 11, { align: 'right' });
    doc.setFillColor(241, 242, 247); doc.roundedRect(M, y + 17, CW, 6, 3, 3, 'F');
    if (row.pct) {
      const c: [number, number, number] = row.score >= 4 ? purple : row.score >= 2 ? [60, 110, 170] : [180, 120, 30];
      doc.setFillColor(...c); doc.roundedRect(M, y + 17, (CW * row.pct) / 100, 6, 3, 3, 'F');
    }
    y += 32;
  });
  txt('These are self-reported scores, not independently verified performance ratings.', { size: 9, color: muted, after: 10 });

  if (r.allStrong) {
    eyebrow("Here's where I'd focus first");
    txt('You report a strong foundation across all five skills.', { bold: true, size: 12 });
    txt('You report confidence in all five capabilities in every area. Consider testing that confidence against your most demanding live opportunity.', { color: muted });
  } else if (r.prio) {
    const p = r.prio;
    eyebrow("Here's where I'd focus first");
    txt(`Your priority: ${p.name} (${p.score}/5)`, { bold: true, size: 13 });
    if (r.showTie) {
      txt(
        r.allZero
          ? 'All five skills are development priorities. Executive Business Fluency is suggested as a starting point — a learning sequence, not a measured difference.'
          : `Tied with: ${r.tieOpts.filter((s) => s.id !== p.id).map((s) => s.name).join(', ')}.`,
        { color: muted, size: 9.5 },
      );
    }
    txt(p.lead);
    eyebrow('Why it matters');
    p.stats.forEach((st) => txt(`${st.n} — ${st.t} (${st.src})`, { bold: true, after: 3 }));
    txt(p.why.join(' '), { color: muted });
    eyebrow('What stronger capability looks like');
    p.strongList.forEach((t) => txt('•  ' + t, { after: 2 }));
    y += 4;
    eyebrow('Small actions you can take today');
    p.actions.forEach((t, i) => txt(`${i + 1}. ${t}`, { after: 4 }));
  }
  if (r.strengthSkill) { eyebrow('A strength to build on'); txt(r.strengthText, { color: muted }); }
  eyebrow('Want to work on your biggest skill gap?');
  txt("Book a call with Jamal. We'll look at what you're trying to achieve, the skills you want to strengthen, and whether there's a coaching approach that makes sense for your goals.", { color: muted });
  if (r.prio && !r.allStrong) txt(r.prio.bridge, { color: muted });
  txt(`Book: ${BOOKING_URL}`, { bold: true, color: purple });

  y += 6;
  txt('The skills that got you here may not get you to your next megadeal.', { bold: true, size: 11 });
  doc.save('Whyzer-Enterprise-Selling-Skills-Assessment.pdf');
}

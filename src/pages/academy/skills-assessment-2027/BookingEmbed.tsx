/**
 * Inline GHL booking calendar for the results screen.
 *
 * Uses GHL's official embed: the widget iframe plus link.msgsndr.com/js/form_embed.js. That script
 * is what resizes the iframe to its content (it handles the iframe's own height messages, so there
 * is no inner scrollbar and no height to guess here), and it also forwards the iframe's query
 * string into the widget, which is how name / email prefill reaches the booking form.
 *
 * Events
 *  - calendar_viewed: once, the first time at least 30% of the embed is on screen.
 *  - calendar_booked: GHL's embed script defines no booking event, and its documented messages are
 *    only height / sticky-contact / URL plumbing. So this listens (origin-checked) for any widget
 *    message that mentions a booking and reports the first one. Unconfirmed until a real test
 *    booking is made: in dev every widget message is logged to the console so we can see the real
 *    shape and tighten the match.
 */
import { useEffect, useMemo, useRef } from 'react';
import { track } from './tracking';

const CALENDAR_ID = 'O0C2dq7WSZSbujKsJVjB';
const EMBED_SCRIPT = 'https://link.msgsndr.com/js/form_embed.js';
const GHL_ORIGINS = ['leadconnectorhq.com', 'msgsndr.com', 'gohighlevel.com'];

type Props = { firstName: string; email: string; context: Record<string, unknown> };

const BookingEmbed = ({ firstName, email, context }: Props) => {
  const box = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);
  const booked = useRef(false);
  const ctx = useRef(context);
  ctx.current = context;

  // Prefill. first_name and email are GHL's contact field keys for the booking widget. The assessment
  // asks for first name and email only, so there is no phone or last name to pass.
  const src = useMemo(() => {
    const qs = new URLSearchParams();
    if (firstName) qs.set('first_name', firstName);
    if (email) qs.set('email', email);
    const q = qs.toString();
    return `https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}${q ? `?${q}` : ''}`;
  }, [firstName, email]);

  // Load GHL's embed script once per page. It scans for booking iframes and resizes them.
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return;
    const s = document.createElement('script');
    s.src = EMBED_SCRIPT;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // calendar_viewed
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (viewed.current || !entries.some((e) => e.isIntersecting)) return;
        viewed.current = true;
        track('calendar_viewed', ctx.current);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // calendar_booked (best effort, see header)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!GHL_ORIGINS.some((o) => e.origin.endsWith(o))) return;
      let text = '';
      try { text = typeof e.data === 'string' ? e.data : JSON.stringify(e.data); } catch { return; }
      if (import.meta.env.DEV) console.debug('[assessment] GHL widget message', e.origin, e.data);
      if (booked.current || !/book(ed|ing)[-_ ]?(confirm|success|complete)|appointment[-_ ]?(book|creat|confirm)|schedul(ed|e[-_ ]?success)/i.test(text)) return;
      booked.current = true;
      track('calendar_booked', ctx.current);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div ref={box} className="wz-booking" id="book-a-call">
      <iframe
        src={src}
        id={`${CALENDAR_ID}_embed`}
        title="Book a call with Jamal"
        allow="payment"
        scrolling="no"
        style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: 640, display: 'block' }}
      />
    </div>
  );
};

export default BookingEmbed;

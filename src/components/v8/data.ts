// Content and motion constants for the v8 landing page. Kept out of the
// components so copy edits never mean touching layout code.

export const TOUR_TABS = [
  { label: 'Research', img: '/v8/app-research.png', alt: 'Research view: fit score, company profile and opportunity signals' },
  { label: 'DealMap', img: '/v8/app-dealmap.png', alt: 'DealMap: strategic and financial mindmap of the account' },
  { label: 'Earnings calls', img: '/v8/app-earnings.png', alt: 'Earnings call summary with key metrics and audio playback' },
  { label: 'POV Studio', img: '/v8/app-povstudio.png', alt: 'POV Studio dossier with opportunity score and deck generation' },
  { label: 'Your accounts', img: '/v8/app-accounts.png', alt: 'Your accounts list with pulse, ICP, intent and tech scores' },
] as const;

export const TOUR_CAPTIONS = [
  'Search any company — 8,500+ covered, public and private.',
  'DealMap turns the whole account into one picture you can defend.',
  'Every earnings call, summarised with the metrics that matter.',
  'POV Studio scores the opportunity and builds the deck.',
  'Your accounts, watched for hires, funding and M&A.',
] as const;

export type Quote = { q: string; n: string; r: string };

export const QUOTE_SETS: Quote[][] = [
  [
    { q: "It's like OpenAI and Perplexity's deep research had a baby who gives a damn about enterprise selling.", n: 'Kyle G.', r: 'Enterprise AE' },
    { q: 'What used to take a rep a year, I can do in two weeks with Whyzer. It helps us work on the right accounts.', n: 'David Inukpuk', r: 'Strategic Accounts' },
    { q: 'Whyzer makes 10-Ks, 10-Qs and earnings reports actually usable for salespeople. Nothing else got close.', n: 'Lee Winer', r: 'Sales Director' },
  ],
  [
    { q: 'Feels like a business analyst is watching your back — all the context is laid out before the call.', n: 'Matt Brown', r: 'Account Executive' },
    { q: 'Whyzer flagged a cybersecurity breach that got me a CISO meeting on my first try. It worked immediately.', n: 'Paul Hammond', r: 'Enterprise AE' },
    { q: 'The podcast gave me a really good idea of how to structure not just the deal, but the talk prep.', n: 'Mo', r: 'Mid-Market AE' },
  ],
  [
    { q: 'First tool I have found that resonates with the way I actually dig into clients. Amazing prompts.', n: 'Bill Neal', r: 'Regional VP' },
    { q: 'Even on accounts I follow closely, Whyzer surfaces things that make me think: how did I not know that?', n: 'Jeff Clarke', r: 'Enterprise AE' },
    { q: 'I need data and metrics when I speak to executives. This is absolutely necessary in our profession.', n: 'Rob Sader', r: 'Sales Leader' },
  ],
];

export const MARQUEE_CHIPS: Array<{ found: boolean; text: string }> = [
  { found: false, text: '“Supply constraints…” — Q1 earnings call' },
  { found: false, text: '“CapEx growth tied to hyperscalers” — 10-K' },
  { found: true, text: 'Surfaced in a 2-minute POV' },
  { found: false, text: '“Misallocating output delays deployment” — investor call' },
  { found: false, text: '“Board mandate on margin discipline” — proxy statement' },
  { found: true, text: 'Turned into a boardroom-ready POV' },
  { found: false, text: '“Revenue concentration with hyperscalers” — 10-K' },
  { found: false, text: '“Accelerated allocation decision-making” — Q1 call' },
];

export const FAQ_GROUPS = [
  { title: 'Core product', items: ['How is Whyzer different from ChatGPT?', 'Does Whyzer cover private companies?', 'How current is the data?'] },
  { title: 'Competitive / pricing', items: ['How does Whyzer compare to enterprise tools?', 'Why is Whyzer so much cheaper?', "Premium vs Elite — what's the difference?"] },
  { title: 'Getting started', items: ['How long to generate my first POV?', 'Do I need a credit card to try it?'] },
  { title: 'Security', items: ['Is my research shared with anyone?', 'Where does the financial data come from?'] },
];

/** Pricing tiers for the animated gauge in the "Why Whyzer" section. */
export const GAUGE_TIERS = [
  {
    key: 'Generic AI', deg: -58, hub: '#7C7FA0', color: '#DADAF2',
    amount: '$20', unit: '/mo',
    caption: 'Generic AI. Cheap, unsourced, and you still verify every line yourself.',
    body: 'A summary you have to verify yourself. No sourcing, no fact-labeling, nothing that survives a room looking for the hole in it.',
  },
  {
    key: 'Whyzer', deg: 2, hub: '#6262e9', color: '#ffffff',
    amount: '$57', unit: '/seat/mo',
    caption: 'The smart middle. Sourced like an analyst, priced like software.',
    body: null, // rendered with inline emphasis, see LandingV8
  },
  {
    key: 'Enterprise tools', deg: 64, hub: '#B3413F', color: '#F0C9C8',
    amount: '$44K', unit: '/yr',
    caption: 'Enterprise tools. Procurement, annual commitment, six-week approval.',
    body: 'Sold through procurement. Six-week approval cycle, annual commitment, built for analyst teams with enterprise budgets — not for the rep with a call on Thursday.',
  },
] as const;

/**
 * Video testimonials. The mockup embedded Google Drive preview URLs; the ids
 * are kept separate so they can be swapped for a real host without touching
 * the component.
 */
const VIDEO_IDS = [
  '17SSz4dFPsQfu45ZDA2E75aB5IPY_cUy0',
  '1VVgPIVPlUtmQf--VtGTEYlJ8r6XQvRLC',
  '13zEpUa8VW_H3MGpCvTXyPhnesR9HhMug',
  '1AY3WDzA1YJPrxBwafOhAZfWth7lDEeze',
  '1zdsD-_TGVYMU9Xm1WwVvSrtW0gE9L7av',
  '1F3bzUUKVm_E-iZ-nEFCujS7KHvKMPiP7',
  '18nsTfMy_kRv2ShYL_5zNuX_lavqq5PfM',
  '1bVcNNEdgGik76e0to5RTKpaJ_4Ur5wfU',
];

const VIDEO_POSTERS = [
  'linear-gradient(150deg,#2A2352,#0F1230)',
  'linear-gradient(150deg,#123049,#0C1226)',
  'linear-gradient(150deg,#33224A,#120F28)',
  'linear-gradient(150deg,#1B3350,#0B1224)',
  'linear-gradient(150deg,#2E2148,#100E24)',
  'linear-gradient(150deg,#14344A,#0A1122)',
  'linear-gradient(150deg,#302049,#120E26)',
  'linear-gradient(150deg,#1A2E4C,#0B1024)',
];

const VIDEO_META = [
  { name: 'Danny H.', role: 'Enterprise AE', length: '1:12', quote: 'Three minutes before an exec call I pulled the CEO’s own promise to investors. Six weeks later it closed.' },
  { name: 'Kyle G.', role: 'Enterprise AE', length: '0:58', quote: 'Like OpenAI and Perplexity’s deep research had a baby who gives a damn about enterprise selling.' },
  { name: 'David Inukpuk', role: 'Strategic Accounts', length: '1:24', quote: 'What used to take a rep a year, I can do in two weeks with Whyzer.' },
  { name: 'Lee Winer', role: 'Sales Director', length: '1:05', quote: 'It makes 10-Ks, 10-Qs and earnings reports actually usable for salespeople.' },
  { name: 'Paul Hammond', role: 'Enterprise AE', length: '0:47', quote: 'Whyzer flagged a breach that got me a CISO meeting on my first try.' },
  { name: 'Matt Brown', role: 'Account Executive', length: '1:16', quote: 'Feels like a business analyst is watching your back before every call.' },
  { name: 'Jeff Clarke', role: 'Enterprise AE', length: '1:02', quote: 'Even on accounts I follow closely it surfaces things that make me think: how did I not know that?' },
  { name: 'Rob Sader', role: 'Sales Leader', length: '1:09', quote: 'I need data and metrics when I speak to executives. This is necessary in our profession.' },
];

export const VIDEOS = VIDEO_META.map((m, i) => ({
  ...m,
  i,
  poster: VIDEO_POSTERS[i],
  src: `https://drive.google.com/file/d/${VIDEO_IDS[i]}/preview`,
}));

/** Headline numbers shown under the video carousel. */
export const PROOF_STATS = [
  { v: '65%', l: "Of Danny's annual quota traceable to Whyzer" },
  { v: '$5.7M', l: 'Closed this year using Whyzer POVs' },
  { v: '2 weeks', l: 'To do what used to take a rep a year' },
];

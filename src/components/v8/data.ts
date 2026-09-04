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

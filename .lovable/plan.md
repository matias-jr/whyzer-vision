

## Whyzer.ai — Full Landing Page Build Plan

### Overview
A premium, dark-themed single-page landing site for Whyzer.ai built with React + Vite + Tailwind. Every section follows the detailed brand guidelines: dark backgrounds (#0A0A0F palette), gold (#C9A84C) and teal (#4ECDC4) accents, Instrument Serif + Inter + JetBrains Mono typography, grain texture overlay, and scroll-triggered animations.

### What We'll Build (All 13 Sections)

**1. Sticky Navigation**
- Blurred glass-effect nav bar with Whyzer logo, center nav links, "Log In" ghost button, and gold "Start Free" CTA
- Border appears on scroll, mobile hamburger menu with full-screen overlay

**2. Hero Section with Canvas Animation**
- Full-viewport hero with an HTML5 canvas background featuring:
  - 200+ flowing data stream particles in gold/teal
  - 3 slowly rotating orbital rings with glow effects
  - Cursor-driven parallax (perspective shift based on mouse X/Y)
  - Scroll-linked animation progression
- Centered hero content: eyebrow, serif headline ("Read the Financial Story. *Write* the Sales Story."), subheadline, dual CTAs, social proof badges
- Animated scroll indicator at bottom

**3. Logo Bar / Social Proof Strip**
- Horizontal marquee of company placeholders (MSFT, ORCL, SAP, etc.) in monospace
- Subtle border lines top and bottom

**4. Problem Statement — "The Old Way Is Broken"**
- Two-column layout: large italic serif quote on left, three hover-glowing pain-point cards on right
- Cards with icons, titles, and descriptions on dark card surfaces

**5. Product Showcase — "The Master Dossier"**
- Vertical tab switcher (4 tabs) on the left with gold active indicator
- Realistic browser mockup on the right showing a fake Whyzer UI with:
  - Mac-style chrome, dark app interior, sidebar navigation
  - POV card with title, tags, blurred body text, action buttons
  - Floating data badges with slow animation
- Tab switching triggers content fade transitions

**6. How It Works — 3-Step Process**
- Three columns with large gold step numbers (01, 02, 03)
- Each step has title, description, and a micro-visual (search input mockup, processing animation, card appearance)
- Dashed connecting line between steps

**7. Feature Deep-Dives — Bento Grid**
- Asymmetric CSS grid with 6 cards of varying sizes
- Includes a working mini Recharts chart in the "Interactive Visualizations" card
- SVG waveform animation for podcast card
- Hover effects with subtle lift and gold glow

**8. Testimonials Carousel**
- Two-row auto-scrolling marquee (opposite directions), pauses on hover
- 6 real testimonial cards with gold quote marks and attribution

**9. Pricing Section**
- Monthly/Annual billing toggle (annual pre-selected)
- 3 pricing cards: Premium ($57), Elite ($97, elevated with gold glow), Corporate (Custom)
- Full feature checklists with teal/gold check icons
- Elite card has "MOST POPULAR" floating badge and scale emphasis
- Secure checkout note below

**10. The Vault — Bonus Section**
- 60/40 split: resource list on left, Jamal Reimer credential card on right
- Dark room atmosphere with gold spotlight gradient

**11. FAQ Accordion**
- 7 expandable Q&A items with smooth animations and rotating arrow icons
- Single column, max-width 720px

**12. Final CTA Section**
- Large italic serif heading, subtext, oversized gold CTA button
- Centered with gold radial glow background

**13. Footer**
- 4-column layout: brand info + socials, product links, resources, company links
- Bottom copyright bar

### Global Design Elements
- SVG grain texture overlay at 2.5% opacity across entire page
- Scroll-triggered fade-in + translate-up animations on every section (staggered children at 80ms)
- All CSS custom properties for brand colors defined in index.css
- Google Fonts loaded: Instrument Serif, Inter, JetBrains Mono
- No pure white anywhere — all text uses #F5F4EF

### SEO & GEO Files
- JSON-LD schemas (Organization, SoftwareApplication, FAQPage) embedded in index.html head
- Meta tags (title, description, OG tags) in index.html
- Updated robots.txt allowing AI crawlers
- New public/llms.txt file with Whyzer product summary

### Responsive Design
- Mobile-first breakpoints: 375px, 768px, 1024px+
- Single-column stacking on mobile, 2-column on tablet, full layouts on desktop
- Hero headline scales from 40px → 56px → 72px


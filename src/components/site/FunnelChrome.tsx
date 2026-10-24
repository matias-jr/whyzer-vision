import { Head } from 'vite-react-ssg';
import './site.css';

/**
 * Minimal chrome for conversion pages (cold-email landings, webinar and live-session funnels):
 * the v8 header with just the logo (and an optional right-hand link), and a slim legal footer.
 * No navigation, so the page keeps one job.
 */
export const FunnelHeader = ({ right }: { right?: { label: string; href: string } }) => (
  <header className="wzf-head">
    <a href="https://www.whyzer.ai" target="_top" style={{ display: 'flex', alignItems: 'center' }}>
      <img src="/home-v8/whyzer-logo-white.png" alt="Whyzer" style={{ height: 26, width: 'auto' }} />
    </a>
    {right && (
      <a href={right.href} style={{ color: '#C7C7EB', fontSize: 14, fontWeight: 500 }}>
        {right.label}
      </a>
    )}
  </header>
);

export const FunnelFooter = () => (
  <footer className="wzf-foot">
    <a href="/privacy-policy">Privacy</a> · <a href="/terms-and-conditions">Terms</a> ·{' '}
    <a href="http://intercom.help/whyzerai/en" target="_blank" rel="noopener noreferrer">Help</a> · Whyzer {new Date().getFullYear()}
  </footer>
);

/** Page shell for funnel pages: loads Space Grotesk and wraps the content in the v8 light surface. */
export const FunnelPage = ({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) => (
  <div className="wzsite">
    <Head>
      <link rel="preload" as="font" type="font/woff2" href="/fonts/space-grotesk.woff2" crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href="/fonts/inter.woff2" crossOrigin="" />
    </Head>
    {header ?? <FunnelHeader />}
    {children}
    <FunnelFooter />
  </div>
);

import { Head } from 'vite-react-ssg';
import { SiteNav, SiteFooter } from './SiteChrome';
import './site.css';

/**
 * Page shell for the v8 design: loads Space Grotesk, renders the shared navbar and footer
 * around the page content. Pages bring their own <Head> metadata.
 */
const SitePage = ({ children, bare = false }: { children: React.ReactNode; bare?: boolean }) => (
  <div className="wzsite">
    <Head>
      <link rel="preload" as="font" type="font/woff2" href="/fonts/space-grotesk.woff2" crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href="/fonts/inter.woff2" crossOrigin="" />
    </Head>
    {!bare && <SiteNav />}
    {children}
    {!bare && <SiteFooter />}
  </div>
);

export default SitePage;

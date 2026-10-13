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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
    </Head>
    {!bare && <SiteNav />}
    {children}
    {!bare && <SiteFooter />}
  </div>
);

export default SitePage;

import { Head } from 'vite-react-ssg';
import LandingV8 from '@/components/v8/LandingV8';

/**
 * Preview of the v8 homepage redesign. Lives at /v8 while it is reviewed; the
 * intent is for this to become the `/` route once signed off. Kept out of the
 * search index so the staging copy cannot compete with the live homepage.
 */
const HomeV8 = () => (
  <>
    <Head>
      <title>Whyzer v8 preview — The Financial Narrative Platform for B2B Sales</title>
      <meta name="robots" content="noindex, nofollow" />
      {/* Loaded here rather than in the shared index.html so the current
          homepage keeps its existing font payload untouched. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
      />
    </Head>
    <LandingV8 />
  </>
);

export default HomeV8;

import { Head } from 'vite-react-ssg';
import HomeV8 from '@/components/home/HomeV8';

const Index = () => {
  return (
    <>
      {/* Homepage metadata. These used to live in index.html, but a static head
          applied them to every prerendered route, which is what made LinkedIn
          treat deep links as the homepage. Each route now declares its own. */}
      <Head>
        <title>Whyzer: The Financial Narrative Platform for B2B Sales</title>
        <link rel="canonical" href="https://www.whyzer.ai" />
        <meta property="og:url" content="https://www.whyzer.ai" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Whyzer: The Financial Narrative Platform for B2B Sales" />
        <meta
          property="og:description"
          content="Turn SEC filings and earnings calls into boardroom-ready Points of View in under 2 minutes. Built by Jamal Reimer, $160M+ SaaS closed."
        />
        <meta
          name="description"
          content="Whyzer is a financial narrative platform that turns SEC filings, earnings calls, and financial data into boardroom-ready Points of View for B2B sales reps. Covering 10,500+ public and private companies globally. From $57/month."
        />
        {/* Self-hosted fonts (see index.css); preload the two used above the fold. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/space-grotesk.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter.woff2" crossOrigin="" />
      </Head>
      <HomeV8 />
    </>
  );
};

export default Index;

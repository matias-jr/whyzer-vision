const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="font-display text-lg text-foreground uppercase tracking-wide mb-4">{title}</h2>
    {children}
  </div>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-text-secondary text-[15px] leading-[1.8] mb-4">{children}</p>
);

const UL = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 mb-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-text-secondary text-[15px] leading-[1.8]">
        <span className="text-primary mt-1 flex-shrink-0">—</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background text-foreground">

    {/* Header */}
    <header className="border-b border-foreground/[0.06] px-6 lg:px-12 py-5 flex items-center justify-between">
      <a href="/" className="opacity-90 hover:opacity-100 transition-opacity duration-200">
        <img
          src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
          alt="Whyzer"
          className="h-7"
        />
      </a>
      <a href="/" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200">
        ← Back to Whyzer
      </a>
    </header>

    {/* Content */}
    <main className="max-w-[760px] mx-auto px-6 lg:px-12 py-20">

      {/* Title block */}
      <div className="mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">Legal</p>
        <h1 className="font-display text-[2rem] md:text-[2.6rem] text-foreground leading-[1.2] tracking-[-0.02em] uppercase mb-4">
          Privacy Policy
        </h1>
        <p className="text-text-secondary text-sm">Whyzer, Inc. · Last Updated: April 2026</p>
      </div>

      <Section title="What This Is">
        <P>
          This Privacy Policy explains what information Whyzer collects, how it's used, and what your rights are. If you have questions, contact us at{' '}
          <a href="mailto:privacy@whyzer.ai" className="text-primary hover:underline">privacy@whyzer.ai</a>.
        </P>
        <P>By using whyzer.ai or any Whyzer product, you agree to this policy.</P>
      </Section>

      <Section title="What We Collect">
        <h3 className="font-body font-semibold text-foreground text-[15px] mb-2">Account Information</h3>
        <P>When you create an account, we collect your name, email address, and payment information. If you sign up through a third-party service (Google, LinkedIn), we receive the basic profile information you authorize.</P>

        <h3 className="font-body font-semibold text-foreground text-[15px] mb-2">Usage Data</h3>
        <P>We collect information about how you use Whyzer — the companies you research, features you engage with, session frequency, and platform interactions. This helps us improve the product and your experience.</P>

        <h3 className="font-body font-semibold text-foreground text-[15px] mb-2">Device and Technical Data</h3>
        <P>We collect IP addresses, browser type, operating system, and referral URLs. This is standard across web platforms and helps us maintain security and performance.</P>

        <h3 className="font-body font-semibold text-foreground text-[15px] mb-2">Communications</h3>
        <P>If you contact us or participate in Whyzer Community sessions, we may retain those communications for quality and support purposes.</P>
      </Section>

      <Section title="What We Don't Collect">
        <P>Whyzer is built on publicly available, permissioned data — SEC filings, earnings calls, press releases, and investor communications. We do not scrape private systems. We do not store confidential prospect or customer data. The research you conduct inside Whyzer stays yours.</P>
      </Section>

      <Section title="How We Use Your Information">
        <P>We use your information to:</P>
        <UL items={[
          'Deliver and improve the Whyzer platform',
          'Process payments and manage your subscription',
          'Send product updates, account notifications, and (if you opt in) Whyzer Academy and newsletter communications',
          'Respond to support requests',
          'Maintain platform security',
        ]} />
        <P>We do not sell your personal information. We do not allow advertisers to target you through Whyzer.</P>
      </Section>

      <Section title="Data Sharing">
        <P>We share data only in limited circumstances:</P>
        <P><span className="text-foreground font-semibold">Service Providers.</span> We work with third-party vendors for payment processing (Stripe), email delivery, analytics, and infrastructure. These vendors are contractually bound to process your data only for the services they provide to us.</P>
        <P><span className="text-foreground font-semibold">Legal Requirements.</span> We may disclose information if required by law, court order, or to protect the rights, property, or safety of Whyzer, our users, or the public.</P>
        <P><span className="text-foreground font-semibold">Business Transfers.</span> If Whyzer is acquired or merges with another company, your information may transfer as part of that transaction. We will notify you before your data becomes subject to a materially different privacy policy.</P>
        <P>We do not share your data with third parties for their own marketing purposes.</P>
      </Section>

      <Section title="Data Security">
        <P>Your data is processed using encrypted infrastructure. We use industry-standard security practices including TLS encryption in transit and encryption at rest. No system is completely immune to risk, but we take your data security seriously and respond to incidents promptly.</P>
      </Section>

      <Section title="Data Retention">
        <P>We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law or legitimate business need (e.g., transaction records for tax compliance).</P>
      </Section>

      <Section title="Your Rights">
        <P>Depending on your location, you may have the right to:</P>
        <UL items={[
          'Access the personal data we hold about you',
          'Request correction of inaccurate data',
          'Request deletion of your data',
          'Object to or restrict certain processing',
          'Request a portable copy of your data',
          'Withdraw consent where processing is based on consent',
        ]} />
        <P>
          To exercise any of these rights, email{' '}
          <a href="mailto:privacy@whyzer.ai" className="text-primary hover:underline">privacy@whyzer.ai</a>.
          {' '}We will respond within 30 days.
        </P>
        <P><span className="text-foreground font-semibold">For EU/UK residents:</span> Whyzer processes data under legitimate interest and contract performance as the primary legal bases. You have rights under GDPR including the right to lodge a complaint with your local supervisory authority.</P>
        <P><span className="text-foreground font-semibold">For California residents:</span> Under CCPA, you have the right to know what personal information we collect, request deletion, and opt out of the sale of personal information. We do not sell personal information.</P>
      </Section>

      <Section title="Cookies">
        <P>Whyzer uses cookies and similar technologies for authentication, session management, and analytics. You can control cookie preferences through your browser settings, though disabling certain cookies may affect platform functionality.</P>
        <P>We do not use third-party advertising cookies.</P>
      </Section>

      <Section title="Third-Party Links">
        <P>Whyzer may link to external sites (company filings, earnings resources, partner pages). This policy does not apply to those sites. We are not responsible for their privacy practices.</P>
      </Section>

      <Section title="Children">
        <P>
          Whyzer is not directed at anyone under 16. We do not knowingly collect data from minors. If you believe a minor has provided us with personal data, contact us at{' '}
          <a href="mailto:privacy@whyzer.ai" className="text-primary hover:underline">privacy@whyzer.ai</a>
          {' '}and we will delete it.
        </P>
      </Section>

      <Section title="Changes to This Policy">
        <P>We may update this policy as the product evolves. When we make material changes, we will notify you by email or by posting a notice in the platform before the changes take effect. The "Last Updated" date at the top of this page always reflects the current version.</P>
      </Section>

      <Section title="Contact">
        <P>Questions about this policy or your data:</P>
        <a href="mailto:info@whyzer.ai" className="text-primary hover:underline text-[15px]">info@whyzer.ai</a>
      </Section>

    </main>

    {/* Footer */}
    <div className="border-t border-foreground/[0.06] px-6 lg:px-12 py-8 max-w-[760px] mx-auto">
      <p className="text-text-tertiary text-[13px]">© {new Date().getFullYear()} Whyzer.ai · All rights reserved</p>
    </div>

  </div>
);

export default PrivacyPolicy;

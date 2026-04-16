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

const TermsAndConditions = () => (
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
        ← Back to Whyzer AI
      </a>
    </header>

    {/* Content */}
    <main className="max-w-[760px] mx-auto px-6 lg:px-12 py-20">

      {/* Title block */}
      <div className="mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">Legal</p>
        <h1 className="font-display text-[2rem] md:text-[2.6rem] text-foreground leading-[1.2] tracking-[-0.02em] uppercase mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-text-secondary text-sm">Whyzer · Last Updated: April 2026</p>
      </div>

      <Section title="Agreement to Terms">
        <P>By accessing or using whyzer.ai or any Whyzer AI product, you agree to be bound by these Terms &amp; Conditions. If you do not agree, do not use the platform.</P>
        <P>These Terms apply to all users, including Premium subscribers, Elite subscribers, and Corporate/Teams account holders.</P>
      </Section>

      <Section title="The Service">
        <P>Whyzer is a financial narrative platform that converts publicly available data — SEC filings, earnings calls, investor communications, and financial statements — into Points of View and account intelligence for B2B sales professionals.</P>
        <P>We reserve the right to modify, suspend, or discontinue any part of the platform at any time. We will make reasonable efforts to notify users of material changes in advance.</P>
      </Section>

      <Section title="Accounts">
        <P>You are responsible for maintaining the confidentiality of your login credentials. You are responsible for all activity that occurs under your account.</P>
        <P>You must provide accurate information when creating your account. Whyzer AI accounts are for individual use unless you hold a Corporate/Teams plan. Sharing account credentials across multiple users on a non-team plan is prohibited.</P>
        <P>You must be at least 18 years old to create an account.</P>
      </Section>

      <Section title="Subscriptions and Payment">
        <P>Whyzer AI offers the following subscription tiers: Premium, Elite, and Corporate/Teams. Current pricing is displayed at whyzer.ai.</P>
        <P>Subscriptions are billed on a monthly or annual basis depending on the plan you select. By subscribing, you authorize Whyzer AI to charge your payment method on a recurring basis until you cancel.</P>
        <P>Annual subscriptions are charged in full at the time of purchase.</P>
        <P>Payment is processed securely through Stripe. Whyzer AI does not store your full payment card details.</P>
      </Section>

      <Section title="No Refunds">
        <P>All purchases are final. Whyzer AI does not offer refunds under any circumstances, including but not limited to:</P>
        <UL items={[
          'Cancellation after a billing cycle has begun',
          'Partial use of a subscription period',
          'Dissatisfaction with the platform or its outputs',
          'Failure to cancel before an automatic renewal date',
          'Accidental purchase',
        ]} />
        <P>If you cancel your subscription, you retain access to your plan through the end of the current billing period. Access ends when that period expires. No prorated refunds are issued for unused time.</P>
      </Section>

      <Section title="Cancellation">
        <P>
          You may cancel your subscription at any time through your account settings or by contacting{' '}
          <a href="mailto:info@whyzer.ai" className="text-primary hover:underline">info@whyzer.ai</a>.
          {' '}Cancellation takes effect at the end of your current billing period. You will not be charged for the following period.
        </P>
        <P>Cancellation does not entitle you to a refund for any portion of the current billing period already paid.</P>
      </Section>

      <Section title="Acceptable Use">
        <P>You agree to use Whyzer only for lawful purposes and in a manner consistent with these Terms. You may not:</P>
        <UL items={[
          'Use Whyzer to harass, defame, or harm any individual or organization',
          "Attempt to reverse-engineer, scrape, or extract Whyzer's underlying data, models, or proprietary prompt systems",
          "Resell, sublicense, or redistribute Whyzer's outputs as a competing product or service",
          'Use automated tools to access or interact with the platform in ways not authorized by Whyzer AI',
          'Use the platform for any unlawful purpose or in violation of any applicable regulations',
          'Share your account credentials with individuals not covered by your plan',
        ]} />
        <P>Violation of these terms may result in immediate suspension or termination of your account without refund.</P>
      </Section>

      <Section title="Intellectual Property">
        <P>Whyzer AI and all content, features, and functionality of the platform — including but not limited to the POV framework, Deal Maps, Coach Jamal, The Vault, and all associated methodology — are the intellectual property of Whyzer AI and are protected by applicable intellectual property laws.</P>
        <P>The source data Whyzer AI uses (SEC filings, earnings call transcripts, public financial disclosures) is publicly available. The intelligence layer — the methodology, prompts, synthesis, and outputs — belongs to Whyzer AI.</P>
        <P>You retain ownership of any data or content you input into the platform. By inputting content, you grant Whyzer AI a limited license to process that content solely for the purpose of delivering the service to you.</P>
      </Section>

      <Section title="Disclaimer of Warranties">
        <P>Whyzer AI is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</P>
        <P>We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components. We do not warrant that any specific deal outcome, revenue result, or executive response will follow from use of the platform.</P>
      </Section>

      <Section title="Limitation of Liability">
        <P>To the fullest extent permitted by applicable law, Whyzer AI, its officers, directors, employees, and contractors will not be liable for any indirect, incidental, special, consequential, or punitive damages — including lost revenue, lost data, or lost business opportunity — arising from your use of or inability to use the platform, even if we have been advised of the possibility of such damages.</P>
        <P>Our total liability to you for any claim arising under these Terms will not exceed the amount you paid to Whyzer AI in the 12 months preceding the claim.</P>
      </Section>

      <Section title="Indemnification">
        <P>You agree to indemnify and hold harmless Whyzer AI and its affiliates from any claims, damages, losses, and expenses (including reasonable legal fees) arising out of your use of the platform, your violation of these Terms, or your violation of any third-party rights.</P>
      </Section>

      <Section title="Termination">
        <P>Whyzer AI reserves the right to suspend or terminate your account at any time if you violate these Terms. Upon termination for cause, no refund will be issued.</P>
        <P>You may terminate your account at any time by canceling your subscription and ceasing use of the platform.</P>
      </Section>

      <Section title="Governing Law">
        <P>These Terms are governed by the laws of the State of Arkansas, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms will be subject to the exclusive jurisdiction of the courts located in Arkansas.</P>
      </Section>

      <Section title="Changes to These Terms">
        <P>We may update these Terms from time to time. When we make material changes, we will notify you by email or by posting a notice in the platform at least 14 days before the changes take effect. Continued use of Whyzer after that date constitutes acceptance of the updated Terms.</P>
      </Section>

      <Section title="Contact">
        <P>Questions about these Terms:</P>
        <p className="text-text-secondary text-[15px] leading-[1.8]">Whyzer</p>
        <a href="mailto:info@whyzer.ai" className="text-primary hover:underline text-[15px]">info@whyzer.ai</a>
      </Section>

    </main>

    {/* Footer */}
    <div className="border-t border-foreground/[0.06] px-6 lg:px-12 py-8 max-w-[760px] mx-auto">
      <p className="text-text-tertiary text-[13px]">© {new Date().getFullYear()} Whyzer.ai · All rights reserved</p>
    </div>

  </div>
);

export default TermsAndConditions;

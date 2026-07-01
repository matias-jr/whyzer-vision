import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  {
    q: 'How is Whyzer different from ChatGPT or other general AI tools?',
    a: "General AI tools are built for everything, which means they're optimized for nothing. Whyzer is different in three specific ways. First, every POV Whyzer generates is grounded in real, recent financial data (SEC filings, earnings calls, investor letters), not the model's training memory. The output is auditable. You can defend every claim in front of a CFO because you know exactly where it came from. Second, Whyzer doesn't just surface data; it interprets it for sellers. The intelligence lives in the context, the prompts, and the methodology built by sellers who close 7- and 8-figure deals. Third, Whyzer's structured workflows remove the variability of a blank chat window: input the account, get a consistent, boardroom-ready POV every time.",
  },
  {
    q: 'How is Whyzer different from Databook?',
    a: "Databook is a strong product built for enterprise teams with enterprise budgets; contracts typically run $30,000–$60,000 per year and are sold top-down to large organisations. Whyzer is built for the individual seller who wants that same quality of financial intelligence without waiting for a procurement process. At $57/month, Whyzer puts boardroom-ready POVs in reach of every rep, not just the ones whose company can afford a six-figure vendor contract. Whyzer also covers 8,500+ public and private companies globally, including the private and international accounts that tools like Databook don't cover well.",
  },
  {
    q: 'How does Whyzer work?',
    a: "Search any of 8,500+ global companies. Whyzer instantly pulls from SEC filings, earnings calls, investor letters, and other public financial data to surface the account's financial priorities, executive pressures, and strategic bets. It then generates 2–3 boardroom-ready Points of View, each one connecting the account's board-level priorities to your solution's value. From search to POV in under 2 minutes, every time.",
  },
  {
    q: 'Is my data secure?',
    a: "Whyzer only uses publicly available, permissioned data sources: SEC filings, earnings calls, press releases, and investor communications. No scraping of private systems, no confidential data. All data is processed using encrypted infrastructure and we never store sensitive personal information. Your research stays yours, private, secure, and compliant by design.",
  },
  {
    q: 'Does Whyzer cover international and private companies outside the US?',
    a: "Yes. Whyzer provides robust global coverage across North America, Europe, Latin America, and other major international markets. The platform surfaces strategic insights for both public and private companies globally. The only general parameter is that a target company should have 100 to 150+ employees to ensure a sufficiently deep trail of corporate data, earnings reports, or market signals exists for our engine to analyze.",
  },
  {
    q: 'How quickly can I generate insights for a new international account?',
    a: "Instantly. If a company isn't already one of the 8,500+ active profiles in our global database, you can simply add the named account to your dashboard. Whyzer's engine will completely map the company's financial health, strategic priorities, and executive viewpoints within 2 to 3 minutes.",
  },
  {
    q: 'Can I target companies by broad geography or region?',
    a: "No. Whyzer is purpose-built for highly targeted, account-based strategic selling. Rather than pulling massive, low-intent lists by geographic territory, the platform requires you to input specific named accounts so it can deliver precise, deeply personalized C-suite breakthrough strategies.",
  },
  {
    q: 'Can Whyzer draft outreach tailored to specific C-suite personas?',
    a: "Yes, natively. Once Whyzer maps an account's strategic gaps, you can navigate to the \"Write\" workflow. The system will identify the core stakeholders relevant to your deal, analyze their specific business pressures (e.g., CFO vs. Head of Supply Chain), and draft hyper-tailored point-of-view (PoV) outreach designed to clear executive inbox filters.",
  },
  {
    q: 'Can a small sales team share a single Whyzer account?',
    a: "No. Whyzer seats are provisioned on an individual basis to ensure the machine learning models and tailored workspace remain accurate to your specific pipeline, territory, and deal-tracking history. However, our subscription tiers are intentionally priced to make individual seats highly accessible for growing teams. For custom multi-seat team packages, please contact info@whyzer.ai.",
  },
  {
    q: 'Can I track large lists of accounts simultaneously for automated signal tracking?',
    a: "Bulk account tracking and programmatic point-of-view (PoV) generation are currently available as an early-access feature via our MCP (Model Context Protocol) server. This workflow allows strategic sellers to monitor 60–70+ named accounts simultaneously to prioritize high-intent pipeline signals. If you are a current subscriber and want early-bird access to our bulk workflows, contact our team.",
  },
  {
    q: 'Can Whyzer integrate with my CRM?',
    a: "Whyzer is currently designing integrations with major CRMs, sales engagement tools, and Slack so insights show up exactly where your team works. If you have a specific integration in mind, we'd love to hear it. Reach out directly and it goes straight to the product roadmap.",
  },
  {
    q: "What's included in The Vault?",
    a: "The Vault is Jamal Reimer's complete enterprise selling methodology, built from $160M+ in closed SaaS deals and continuously refined by the Whyzer Community. It includes The Pipeline Flywheel, The Enterprise Sellers Playbook, The MDA Masterclass, The Executive Outreach Course, Full Funnel Playbooks, and live monthly sessions with Jamal. The Vault is included with Whyzer Elite and Corporate plans.",
  },
  {
    q: 'What is the Whyzer Community?',
    a: "The Whyzer Community is a group of elite enterprise sellers, many of them Jamal's coaching clients, who use Whyzer to close complex, high-value deals. The community continuously shapes the product: enhancement requests, new use cases, and real-world feedback from sellers in the field flow directly into Whyzer's development. It's the reason Whyzer gets sharper every month.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} id="faq" className="py-24 lg:py-32 px-6 lg:px-12 bg-background">
      <div className="max-w-[720px] mx-auto">
        <p className="font-mono text-sm uppercase tracking-[0.15em] text-primary mb-4">FAQs</p>
        <h2 className="font-display text-[1.6rem] md:text-[2.35rem] text-foreground mb-12 tracking-[-0.02em] leading-[1.25] uppercase">
          Questions, <span className="text-primary">Answered.</span>
        </h2>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-foreground/[0.06]">
              <button
                className="w-full flex items-center justify-between py-6 text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className={`text-[18px] font-medium pr-4 transition-colors duration-200 ${openIndex === i ? 'text-primary' : 'text-foreground'}`}>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-all duration-200 ${
                    openIndex === i ? 'rotate-180 text-primary' : 'text-text-secondary'
                  }`}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openIndex === i ? '600px' : '0',
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <p className="text-text-secondary text-base leading-[1.75] pb-6">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

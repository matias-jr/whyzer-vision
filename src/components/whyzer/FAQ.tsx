import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  {
    q: 'How is Whyzer different from ChatGPT or Perplexity?',
    a: "Whyzer is purpose-built for B2B sellers, using expert-crafted prompts written by reps who've closed 7- and 8-figure deals. While ChatGPT requires manual prompting and can't monitor accounts continuously, Whyzer delivers instant, accurate POVs from SEC filings, earnings calls, and financial data — with the precision only elite enterprise sellers can engineer.",
  },
  {
    q: 'How does Whyzer work?',
    a: "You search for any publicly traded company. Whyzer pulls from SEC filings, earnings calls, and other data sources, then uses expert-crafted prompts to extract the insights most likely to drive demand for your solution — delivering POVs, KPIs, executive quotes, and next steps, all in one place.",
  },
  {
    q: 'Is my data secure?',
    a: 'Whyzer only uses publicly available, permissioned data sources like SEC filings, earnings calls, and press releases. All data is processed with encrypted infrastructure. Your research stays private, secure, and compliant by design.',
  },
  {
    q: 'Does Whyzer cover international companies?',
    a: 'Currently, Whyzer covers publicly traded companies on U.S. exchanges. International exchange coverage is planned for the next phase.',
  },
  {
    q: 'Can Whyzer integrate with my CRM?',
    a: 'Whyzer is being designed to integrate with CRMs, sales engagement tools, and Slack so insights appear exactly where your team works. If you have a specific integration in mind, we want to hear it.',
  },
  {
    q: "What's included in The Vault?",
    a: "The Vault is Jamal Reimer's complete playbook for elite enterprise selling — frameworks, templates, and strategies used by reps closing 7- and 8-figure deals, including the Pipeline Flywheel, Executive Outreach Course, and MDA Masterclass. It's included with every Elite subscription.",
  },
  {
    q: 'Why is there a free tier?',
    a: 'We give you 100% access to all Whyzer features for 3 of your top accounts. No credit card required. We want you to experience the value before you commit.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} id="faq" className="py-24 lg:py-32 px-6 lg:px-12" style={{ background: 'hsl(240 20% 5%)' }}>
      <div className="max-w-[720px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">FAQs</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 tracking-[-0.03em]">
          Questions, Answered.
        </h2>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-foreground/[0.06]">
              <button
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="text-foreground text-[17px] font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-text-secondary flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openIndex === i ? '300px' : '0',
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <p className="text-text-secondary text-[15px] leading-[1.7] pb-5">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

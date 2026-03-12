import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const tabs = [
  {
    id: 'executive',
    title: 'Executive Intelligence',
    sub: 'Key executives, board members, C-suite quotes, and LinkedIn profiles. Know who makes decisions.',
  },
  {
    id: 'kpis',
    title: 'Financial KPIs',
    sub: "Revenue growth, gross margin, R&D spend, capex priorities — all mapped to your solution's ROI angle.",
  },
  {
    id: 'povs',
    title: 'AI-Generated POVs',
    sub: "3–5 strategic Points of View per account, each connecting the company's board-level priorities to your value proposition.",
  },
  {
    id: 'podcast',
    title: 'AI Podcast Summaries',
    sub: "Understand your account's latest challenges and results better than their own employees.",
  },
];

const mockupContent: Record<string, { title: string; tags: string[]; body: string }> = {
  executive: {
    title: 'C-Suite Intelligence — Jensen Huang',
    tags: ['NVIDIA', 'CEO Profile', 'Board Intel'],
    body: 'Strategic priorities mapped from latest earnings call and investor communications...',
  },
  kpis: {
    title: 'Financial KPI Dashboard — NVIDIA',
    tags: ['NVIDIA', 'Revenue Growth', 'Capex Analysis'],
    body: 'Revenue $60.9B (+122% YoY) · Gross Margin 73.0% · R&D Spend $8.7B...',
  },
  povs: {
    title: 'The AI Factory Paradox — Scale Without Visibility',
    tags: ['NVIDIA', 'Financial Risk', 'Q1 Priority'],
    body: 'As NVIDIA scales its data center revenue past $47B, the company faces an emerging tension...',
  },
  podcast: {
    title: 'Earnings Call Summary — Q4 FY2025',
    tags: ['NVIDIA', 'Audio Brief', 'AI Generated'],
    body: 'Key themes: sovereign AI infrastructure demand, Blackwell architecture ramp, enterprise adoption...',
  },
};

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState('povs');
  const sectionRef = useScrollReveal();
  const content = mockupContent[activeTab];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 lg:py-32 px-6 lg:px-12 bg-background"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-4">The Product</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-16 tracking-[-0.02em] uppercase">
          From Account to Boardroom Narrative in Minutes
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-[40%] flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary/[0.04] border-l-[3px] border-primary'
                    : 'border-l-[3px] border-transparent hover:bg-foreground/[0.02]'
                }`}
              >
                <h3 className={`font-body font-semibold text-base mb-1 ${
                  activeTab === tab.id ? 'text-foreground' : 'text-text-secondary'
                }`}>
                  {tab.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{tab.sub}</p>
              </button>
            ))}
          </div>

          <div className="lg:w-[60%] relative">
            <div
              className="rounded-2xl border border-foreground/[0.08] overflow-hidden"
              style={{
                boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(200,200,200,0.03)',
              }}
            >
              <div className="h-10 flex items-center px-4 gap-2 border-b border-foreground/[0.06]" style={{ background: '#1a1a1a' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-foreground/[0.06] rounded-md px-4 py-1 text-[11px] font-mono text-text-tertiary">
                    app.whyzer.ai
                  </div>
                </div>
              </div>

              <div className="flex min-h-[360px]" style={{ background: '#161616' }}>
                <div className="hidden sm:flex w-14 flex-col items-center py-4 gap-3 border-r border-foreground/[0.06]">
                  {['◈', '⊞', '◎', '⚡'].map((icon, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
                        i === 0 ? 'bg-primary/[0.15] text-primary' : 'text-text-tertiary hover:text-text-secondary'
                      }`}
                    >
                      {icon}
                    </div>
                  ))}
                </div>

                <div className="flex-1 p-6 relative">
                  <div key={activeTab} className="animate-[fade-in_0.3s_ease-out]">
                    <div className="bg-card border border-foreground/[0.06] rounded-xl p-5">
                      <h4 className="font-body font-semibold text-foreground text-base mb-3">
                        {content.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {content.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-primary/[0.1] text-primary text-[11px] font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed mb-1">{content.body}</p>
                      <div className="h-3 w-3/4 bg-foreground/[0.04] rounded mt-2" />
                      <div className="h-3 w-1/2 bg-foreground/[0.03] rounded mt-1.5" />

                      <div className="flex gap-3 mt-5">
                        <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md">
                          View Full POV
                        </button>
                        <button className="px-4 py-2 border border-foreground/[0.08] text-foreground text-xs rounded-md">
                          Copy to Outreach
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="absolute -top-2 -right-3 animate-float">
                      <div className="bg-card border border-foreground/[0.08] rounded-lg px-3 py-1.5 text-[11px] font-mono text-primary">
                        10-K Filed Q1
                      </div>
                    </div>
                    <div className="absolute top-20 -right-6 animate-float-delayed">
                      <div className="bg-card border border-foreground/[0.08] rounded-lg px-3 py-1.5 text-[11px] font-mono text-primary">
                        Revenue: $60.9B
                      </div>
                    </div>
                    <div className="absolute bottom-4 -right-4 animate-float-delayed-2">
                      <div className="bg-card border border-foreground/[0.08] rounded-lg px-3 py-1.5 text-[11px] text-text-secondary max-w-[180px]">
                        CEO Quote: "AI infrastructure..."
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

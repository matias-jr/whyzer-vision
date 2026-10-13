/* eslint-disable */
// Converted from the Claude Design v8 mockup ("Whyzer Landing v8.dc.html").
// Presentational only: state and behaviour live in HomeV8.tsx.
import { Fragment } from 'react';

// Logos for the "Used by sellers at" strip (public/home-v8/logos). `h` tunes optical size.
const LOGOS: { name: string; src: string; h?: number }[] = [
  { name: 'BlackRock', src: '/home-v8/logos/blackrock.svg', h: 22 },
  { name: 'Workday', src: '/home-v8/logos/workday.svg', h: 30 },
  { name: 'Snowflake', src: '/home-v8/logos/snowflake.svg', h: 28 },
  { name: 'Okta', src: '/home-v8/logos/okta.svg', h: 28 },
  { name: 'DocuSign', src: '/home-v8/logos/docusign.svg', h: 22 },
  { name: 'Check Point', src: '/home-v8/logos/checkpoint.svg', h: 28 },
  { name: 'SAS', src: '/home-v8/logos/sas.svg', h: 28 },
  { name: 'Revolut', src: '/home-v8/logos/revolut.svg', h: 24 },
  { name: 'Wiz', src: '/home-v8/logos/wiz.svg', h: 28 },
  { name: 'UiPath', src: '/home-v8/logos/uipath.svg', h: 30 },
  { name: 'Confluent', src: '/home-v8/logos/confluent.svg', h: 24 },
  { name: 'Infor', src: '/home-v8/logos/infor.svg', h: 28 },
  { name: 'Rubrik', src: '/home-v8/logos/rubrik.svg', h: 28 },
  { name: 'LexisNexis', src: '/home-v8/logos/lexisnexis.svg', h: 28 },
  { name: 'Dayforce', src: '/home-v8/logos/dayforce.svg', h: 28 },
  { name: 'New Relic', src: '/home-v8/logos/newrelic.svg', h: 26 },
  { name: 'Grammarly', src: '/home-v8/logos/grammarly.svg', h: 26 },
  { name: 'Airtable', src: '/home-v8/logos/airtable.svg', h: 28 },
  { name: 'Cloudera', src: '/home-v8/logos/cloudera.webp', h: 22 },
  { name: 'Astronomer', src: '/home-v8/logos/astronomer.svg', h: 18 },
  { name: 'Sanity', src: '/home-v8/logos/sanity.svg', h: 24 },
  { name: 'Zywave', src: '/home-v8/logos/zywave.svg', h: 20 },
];

type Props = {
  d: Record<string, any>;
  appendUtm: (url: string) => string;
  chips: { found: boolean; text: string }[];
  rootRef: React.Ref<HTMLDivElement>;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function HomeV8View({ d, appendUtm, chips, rootRef, onClick }: Props) {
  return (
    <div ref={rootRef} onClick={onClick} className="wzv8" style={{ fontFamily: "'Inter',sans-serif", background: "#FAFAF9", color: "#14141F", overflowX: "hidden" }}>
      <nav className="wz-nav" style={{ position: "sticky", top: "0", zIndex: "60", background: "rgba(9,17,39,.72)", backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div className="wz-nav-in" style={{ maxWidth: "1160px", margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <a href="https://www.whyzer.ai" target="_top" style={{ display: "flex", alignItems: "center" }}>
            <img src="/home-v8/whyzer-logo-white.png" alt="Whyzer" style={{ height: "26px", width: "auto" }} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="wz-nav-links" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <a href="#tour" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                {"Product tour"}
              </a>
              <a href="#features" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                {"Features"}
              </a>
              <a href="#pricing" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                {"Pricing"}
              </a>
              <a href="#value" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                {"Compare"}
              </a>
              <a href="/newsletter" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                {"Newsletter"}
              </a>
              <div className="wz-dd">
                <button type="button" className="wz-dd-btn" data-wz-dd="1" aria-haspopup="true" aria-expanded="false" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap", background: "none", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  {"Log In"}
                  <span aria-hidden="true" style={{ fontSize: "10px" }}>{"▾"}</span>
                </button>
                <div className="wz-dd-menu">
                  <a href="https://app.whyzer.ai/login" target="_top" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                    {"Whyzer app"}
                  </a>
                  <a href="https://members.whyzer.ai/login" target="_top" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                    {"Members Area"}
                  </a>
                </div>
              </div>
            </div>
            <a className="wz-nav-cta wzh1" href="#pricing-monthly" style={{ background: "#6262e9", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", boxShadow: "0 8px 22px -10px rgba(98,98,233,.9)" }}>
              {"Try Whyzer for Free"}
            </a>
            <button className="wz-burger" data-wz-menu="1" aria-label="Toggle menu" aria-expanded="false" style={{ display: "none", width: "40px", height: "40px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: "18px", cursor: "pointer", alignItems: "center", justifyContent: "center" }}>
              {"☰"}
            </button>
          </div>
        </div>
      </nav>
      <header className="wz-hero" style={{ position: "relative", overflow: "hidden", padding: "60px 0 56px", background: "radial-gradient(ellipse 900px 620px at 78% 8%, rgba(191,224,253,.55), transparent 62%), radial-gradient(ellipse 820px 560px at 12% 90%, rgba(141,93,184,.28), transparent 60%), #FAFAF9" }}>
        <div style={{ position: "absolute", top: "-90px", right: "-60px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(98,98,233,.18), transparent 70%)", animation: "wzDrift 16s ease-in-out infinite" }}></div>
        <div className="wz-wrap wz-g-hero" style={{ position: "relative", maxWidth: "1160px", margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1.08fr", gap: "44px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,.66)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.8)", color: "#4a4ad1", fontSize: "13px", fontWeight: "600", padding: "7px 15px", borderRadius: "100px", marginBottom: "20px", boxShadow: "0 8px 24px -16px rgba(20,20,40,.4)" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6262e9" }}></span>
              {"Built by Jamal Reimer · $160M+ closed "}
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "45px", fontWeight: "700", lineHeight: "1.08", letterSpacing: "-.015em", marginBottom: "18px", textWrap: "pretty" }}>
              {"Walk into any account already knowing what matters to them."}
            </h1>
            <p style={{ fontSize: "16.5px", color: "#55556B", maxWidth: "470px", marginBottom: "26px", textWrap: "pretty" }}>
              {"Earnings calls, filings and exec priorities across 10,500+ companies — turned into a sourced, defensible point of view in under two minutes."}
            </p>
            <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
              <a className="wzh1" href="#pricing-monthly" style={{ background: "#6262e9", color: "#fff", fontWeight: "600", fontSize: "15px", padding: "15px 28px", borderRadius: "9px", boxShadow: "0 14px 30px -12px rgba(98,98,233,.7)" }}>
                {"Start your free trial"}
              </a>
              <a className="wzh2" href="#tour" style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(12px)", color: "#14141F", fontWeight: "600", fontSize: "15px", padding: "15px 24px", borderRadius: "9px", border: "1px solid rgba(228,227,240,.9)", display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#EEEEFC", color: "#4a4ad1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>
                  {"▶"}
                </span>
                {"Watch the 90-second tour "}
              </a>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,.55)", backdropFilter: "blur(22px) saturate(170%)", WebkitBackdropFilter: "blur(22px) saturate(170%)", border: "1px solid rgba(255,255,255,.85)", boxShadow: "0 40px 90px -40px rgba(20,20,40,.45)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 14px", background: "rgba(255,255,255,.6)", borderBottom: "1px solid rgba(228,227,240,.8)" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <div className="wz-urlbar" style={{ flex: "1", minWidth: "0", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginLeft: "8px", background: "rgba(242,241,251,.9)", borderRadius: "100px", padding: "4px 12px", fontSize: "10.5px", color: "#8A8AA0" }}>
                  {"app.whyzer.ai/research"}
                </div>
              </div>
              <div className="wz-herovis" style={{ position: "relative", height: "352px", overflow: "hidden" }}>
                <img src="/home-v8/app-home.webp" alt="Whyzer home — company search" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transition: "opacity .7s ease", opacity: d.heroOpA }} />
                <img src="/home-v8/app-research.webp" alt="Whyzer research view with fit score" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left", transition: "opacity .7s ease", opacity: d.heroOpB }} />
                <div className="wz-typed" style={{ position: "absolute", left: "22.4%", top: "55.5%", width: "72%", height: "34px", borderRadius: "100px", background: "rgba(255,255,255,.97)", border: "1px solid rgba(98,98,233,.5)", boxShadow: "0 8px 22px -12px rgba(98,98,233,.65)", display: "flex", alignItems: "center", padding: "0 16px 0 42px", gap: "6px", transition: "opacity .5s ease", opacity: d.heroOpA }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#14141F" }}>
                    {d.typed}
                  </span>
                  <span style={{ width: "1.5px", height: "13px", background: "#6262e9", animation: "wzBlink 1s steps(1) infinite" }}></span>
                </div>
                <div className="wz-cursor" style={{ position: "absolute", left: "0", top: "0", pointerEvents: "none", transition: "transform .85s cubic-bezier(.34,.9,.28,1)", transform: d.heroCursor, zIndex: "5" }}>
                  <div style={{ position: "relative" }}>
                    <svg width="20" height="26" viewBox="0 0 20 26" aria-hidden="true">
                      <path d="M2 1.5l14.5 11-6.2.9 3.6 7.4-2.9 1.4-3.6-7.4-3.9 4.6z" fill="#14141F" stroke="#fff" strokeWidth="1.6"></path>
                    </svg>
                    <span style={{ position: "absolute", left: "-11px", top: "-11px", width: "40px", height: "40px", borderRadius: "50%", border: "2px solid rgba(98,98,233,.6)", transition: "transform .35s ease, opacity .35s ease", transform: `scale(${d.heroRipple})`, opacity: d.heroRippleOp }}></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="wz-float-a" style={{ position: "absolute", left: "-26px", top: "44px", background: "rgba(255,255,255,.78)", backdropFilter: "blur(18px) saturate(170%)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "14px", padding: "14px 16px", boxShadow: "0 26px 50px -26px rgba(20,20,40,.45)", animation: "wzFloat 6s ease-in-out infinite", zIndex: "6" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: ".06em", color: "#8A8AA0", textTransform: "uppercase", marginBottom: "8px" }}>
                {"Opportunity score"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "conic-gradient(#6262e9 0deg 302deg, #EDEDF7 302deg 360deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontWeight: "700", fontSize: "14px" }}>
                    {"4.2"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: "700" }}>
                    {"High confidence"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#8A8AA0" }}>
                    {"Evidence: sourced"}
                  </div>
                </div>
              </div>
            </div>
            <div className="wz-float-b" style={{ position: "absolute", right: "-30px", bottom: "-58px", width: "240px", borderRadius: "14px", padding: "15px", background: "rgba(9,17,39,.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 30px 56px -26px rgba(11,11,24,.75)", zIndex: "6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "10.5px", fontWeight: "700", color: "#8F8FD0", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "11px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#33D69F", animation: "wzPulse 2.2s ease-out infinite" }}></span>
                {"Live signals "}
              </div>
              <div style={{ fontSize: "12px", color: "#DADAF2", paddingBottom: "8px" }}>
                <b style={{ color: "#fff" }}>
                  {"Supply constraints"}
                </b>
                {" flagged on Q1 call"}
                <div style={{ fontSize: "10px", color: "#7B7BB8", marginTop: "2px" }}>
                  {"Earnings call · 2m ago"}
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.09)" }}>
                <b style={{ color: "#fff" }}>
                  {"New CFO"}
                </b>
                {" priorities disclosed"}
                <div style={{ fontSize: "10px", color: "#7B7BB8", marginTop: "2px" }}>
                  {"10-K filing · 14m ago"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section aria-label="Companies whose sellers use Whyzer" style={{ background: "rgba(242,241,251,.85)", borderTop: "1px solid #E4E3F0", borderBottom: "1px solid #E4E3F0", padding: "26px 0 28px" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px", textAlign: "center", fontSize: "12px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", color: "#8A8AA0", marginBottom: "20px" }}>
          {"Used by sellers at"}
        </div>
        <div className="wz-logos">
          <div className="wz-logos-track">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <img key={i} src={l.src} alt={i < LOGOS.length ? l.name : ""} aria-hidden={i >= LOGOS.length ? true : undefined} height={l.h ?? 26} decoding="async" style={{ height: `${l.h ?? 26}px`, width: "auto" }} />
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "52px 0 12px" }}>
        <div className="wz-wrap wz-g2" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" }} data-wz-stats="1">
          <div style={{ textAlign: "center" }}>
            <div className="wz-stat" data-wz-count="10500" data-suffix="+" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "34px", fontWeight: "700", color: "#6262e9", fontVariantNumeric: "tabular-nums" }}>
              {"10,500+"}
            </div>
            <div style={{ fontSize: "13px", color: "#55556B", marginTop: "4px" }}>
              {"Companies covered"}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="wz-stat" data-wz-count="150" data-suffix="+" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "34px", fontWeight: "700", color: "#6262e9", fontVariantNumeric: "tabular-nums" }}>
              {"150+"}
            </div>
            <div style={{ fontSize: "13px", color: "#55556B", marginTop: "4px" }}>
              {"Global markets"}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="wz-stat" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "34px", fontWeight: "700", color: "#6262e9" }}>
              {"5×"}
            </div>
            <div style={{ fontSize: "13px", color: "#55556B", marginTop: "4px" }}>
              {"Faster account prep"}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="wz-stat" data-wz-count="43" data-suffix="%" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "34px", fontWeight: "700", color: "#6262e9", fontVariantNumeric: "tabular-nums" }}>
              {"43%"}
            </div>
            <div style={{ fontSize: "13px", color: "#55556B", marginTop: "4px" }}>
              {"More meetings with executives"}
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "64px 0 52px" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ maxWidth: "620px", marginBottom: "22px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6262e9", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"The problem"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "31px", fontWeight: "700", lineHeight: "1.18", textWrap: "pretty" }}>
              {"The intelligence was always public. Nobody had time to read it."}
            </h2>
            <p style={{ fontSize: "15px", color: "#55556B", marginTop: "12px", textWrap: "pretty" }}>
              {"It's in the earnings call. The 10-K. What the CFO says when an analyst asks the wrong question. Reading it properly takes three hours you don't have before a call you booked yesterday."}
            </p>
          </div>
          <div style={{ marginTop: "32px", overflow: "hidden", borderRadius: "14px", border: "1px solid rgba(228,227,240,.9)", background: "rgba(255,255,255,.7)", backdropFilter: "blur(12px)", padding: "18px 0" }}>
            <div style={{ display: "flex", gap: "12px", width: "max-content", padding: "0 20px", animation: "wzMarqueeL 55s linear infinite" }}>
              {[...chips, ...chips].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: c.found ? "#E7F7EF" : "#F2F1FB", borderRadius: "100px", padding: "8px 14px", fontSize: "12.5px", fontWeight: 600, color: "#55556B", whiteSpace: "nowrap" }}>
                  <span style={{ background: c.found ? "#fff" : "#F7E9E8", color: c.found ? "#1F9D6B" : "#B3413F", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", letterSpacing: ".03em" }}>{c.found ? "FOUND" : "BURIED"}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="wz-sec3" id="tour" style={{ padding: "78px 0 88px", background: "radial-gradient(ellipse 900px 500px at 20% 0%, rgba(191,224,253,.45), transparent 62%), #F2F1FB" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 34px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6262e9", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"Product tour"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "31px", fontWeight: "700", lineHeight: "1.18" }}>
              {"This is the actual product. Watch it work."}
            </h2>
            <p style={{ fontSize: "15px", color: "#55556B", marginTop: "12px" }}>
              {"Search a company, read the signal, map the deal, build the POV. Five screens, one workflow."}
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <div data-wz-rail="1" style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "22px" }}>
              <button data-wz-tab="0" style={{ border: "0", fontFamily: "'Inter',sans-serif", cursor: "pointer", fontSize: "13.5px", fontWeight: "600", padding: "10px 18px", borderRadius: "100px", transition: "all .3s ease", background: d.tabBg0, color: d.tabFg0, boxShadow: d.tabSh0 }}>
                {"Research"}
              </button>
              <button data-wz-tab="1" style={{ border: "0", fontFamily: "'Inter',sans-serif", cursor: "pointer", fontSize: "13.5px", fontWeight: "600", padding: "10px 18px", borderRadius: "100px", transition: "all .3s ease", background: d.tabBg1, color: d.tabFg1, boxShadow: d.tabSh1 }}>
                {"DealMap"}
              </button>
              <button data-wz-tab="2" style={{ border: "0", fontFamily: "'Inter',sans-serif", cursor: "pointer", fontSize: "13.5px", fontWeight: "600", padding: "10px 18px", borderRadius: "100px", transition: "all .3s ease", background: d.tabBg2, color: d.tabFg2, boxShadow: d.tabSh2 }}>
                {"Earnings calls"}
              </button>
              <button data-wz-tab="3" style={{ border: "0", fontFamily: "'Inter',sans-serif", cursor: "pointer", fontSize: "13.5px", fontWeight: "600", padding: "10px 18px", borderRadius: "100px", transition: "all .3s ease", background: d.tabBg3, color: d.tabFg3, boxShadow: d.tabSh3 }}>
                {"POV Studio"}
              </button>
              <button data-wz-tab="4" style={{ border: "0", fontFamily: "'Inter',sans-serif", cursor: "pointer", fontSize: "13.5px", fontWeight: "600", padding: "10px 18px", borderRadius: "100px", transition: "all .3s ease", background: d.tabBg4, color: d.tabFg4, boxShadow: d.tabSh4 }}>
                {"Your accounts"}
              </button>
            </div>
            <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", background: "rgba(255,255,255,.5)", backdropFilter: "blur(24px) saturate(170%)", WebkitBackdropFilter: "blur(24px) saturate(170%)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 50px 100px -46px rgba(20,20,40,.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "rgba(255,255,255,.62)", borderBottom: "1px solid rgba(228,227,240,.8)" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <div className="wz-urlbar" style={{ flex: "1", minWidth: "0", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginLeft: "10px", background: "rgba(242,241,251,.9)", borderRadius: "100px", padding: "5px 14px", fontSize: "11px", color: "#8A8AA0" }}>
                  {"app.whyzer.ai · NVIDIA CORP · selling Tableau"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px", fontWeight: "700", color: "#4a4ad1", background: "#EEEEFC", padding: "4px 10px", borderRadius: "100px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#33D69F", animation: "wzPulse 2.2s ease-out infinite" }}></span>
                  {"LIVE DEMO"}
                </div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", width: "500%", transition: "transform .8s cubic-bezier(.5,0,.2,1)", transform: `translateX(${d.stripX})` }}>
                  <div style={{ flex: "0 0 20%" }}>
                    <img src="/home-v8/app-research.webp" alt="Research view: fit score, company profile and opportunity signals" style={{ width: "100%" }} />
                  </div>
                  <div style={{ flex: "0 0 20%" }}>
                    <img src="/home-v8/app-dealmap.webp" alt="DealMap: strategic and financial mindmap of the account" style={{ width: "100%" }} />
                  </div>
                  <div style={{ flex: "0 0 20%" }}>
                    <img src="/home-v8/app-earnings.webp" alt="Earnings call summary with key metrics and audio playback" style={{ width: "100%" }} />
                  </div>
                  <div style={{ flex: "0 0 20%" }}>
                    <img src="/home-v8/app-povstudio.webp" alt="POV Studio dossier with opportunity score and deck generation" style={{ width: "100%" }} />
                  </div>
                  <div style={{ flex: "0 0 20%" }}>
                    <img src="/home-v8/app-accounts.webp" alt="Your accounts list with pulse, ICP, intent and tech scores" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
              <div className="wz-cursor" style={{ position: "absolute", left: "0", top: "0", pointerEvents: "none", transition: "transform .75s cubic-bezier(.34,.9,.28,1)", transform: d.tourCursor, zIndex: "8" }}>
                <div style={{ position: "relative" }}>
                  <svg width="20" height="26" viewBox="0 0 20 26" aria-hidden="true">
                    <path d="M2 1.5l14.5 11-6.2.9 3.6 7.4-2.9 1.4-3.6-7.4-3.9 4.6z" fill="#14141F" stroke="#fff" strokeWidth="1.6"></path>
                  </svg>
                  <span style={{ position: "absolute", left: "-13px", top: "-13px", width: "46px", height: "46px", borderRadius: "50%", border: "2px solid rgba(98,98,233,.55)", transition: "transform .35s ease, opacity .35s ease", transform: `scale(${d.tourRipple})`, opacity: d.tourRippleOp }}></span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "20px", minHeight: "24px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6262e9" }}></span>
              <div style={{ fontSize: "14px", color: "#55556B", fontWeight: "500" }}>
                {d.tourCaption}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wz-sec" id="features" style={{ padding: "88px 0" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: "620px", margin: "0 auto 56px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6262e9", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"Features"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "31px", fontWeight: "700", lineHeight: "1.18" }}>
              {"Everything you need, none of it separate."}
            </h2>
          </div>
          <div className="wz-g-split wz-row" data-wz-reveal="1" style={{ display: "grid", gridTemplateColumns: "1fr 1.04fr", gap: "52px", alignItems: "center", marginBottom: "84px" }}>
            <div>
              <div style={{ display: "inline-block", background: "#0B0B18", color: "#fff", fontSize: "11.5px", fontWeight: "700", padding: "5px 12px", borderRadius: "100px", marginBottom: "14px" }}>
                {"Research"}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "26px", marginBottom: "10px", lineHeight: "1.2" }}>
                {"Know what keeps them up before you say a word."}
              </h3>
              <p style={{ fontSize: "14.5px", color: "#55556B", marginBottom: "22px" }}>
                {"C-suite quotes, board priorities and investor communications — every claim labeled fact or inference, with the filing it came from."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEEEFC", color: "#4a4ad1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>
                    {"✓"}
                  </span>
                  <div>
                    <b style={{ fontSize: "14px", display: "block" }}>
                      {"Executive intelligence"}
                    </b>
                    <span style={{ fontSize: "13px", color: "#55556B" }}>
                      {"C-suite quotes and board priorities, sourced."}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEEEFC", color: "#4a4ad1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>
                    {"✓"}
                  </span>
                  <div>
                    <b style={{ fontSize: "14px", display: "block" }}>
                      {"DealMaps"}
                    </b>
                    <span style={{ fontSize: "13px", color: "#55556B" }}>
                      {"Everything the account cares about, visualized."}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEEEFC", color: "#4a4ad1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>
                    {"✓"}
                  </span>
                  <div>
                    <b style={{ fontSize: "14px", display: "block" }}>
                      {"Account audio briefings"}
                    </b>
                    <span style={{ fontSize: "13px", color: "#55556B" }}>
                      {"Every account, distilled for your commute."}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ background: "rgba(242,241,251,.9)", borderLeft: "3px solid #6262e9", borderRadius: "0 10px 10px 0", padding: "12px 16px", fontSize: "13px", color: "#55556B" }}>
                <b style={{ color: "#14141F" }}>
                  {"Discovery:"}
                </b>
                {" walk in with a hypothesis about their business, not a list of questions about yours."}
              </div>
            </div>
            <div style={{ borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,.55)", backdropFilter: "blur(20px) saturate(170%)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 34px 70px -34px rgba(20,20,40,.42)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 14px", background: "rgba(255,255,255,.6)", borderBottom: "1px solid rgba(228,227,240,.8)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ fontSize: "10.5px", color: "#8A8AA0", marginLeft: "6px" }}>
                  {"DealMap · NVIDIA CORP"}
                </span>
              </div>
              <img src="/home-v8/app-dealmap.webp" alt="DealMap mindmap of NVIDIA strategic and financial themes" style={{ width: "100%" }} />
            </div>
          </div>
          <div className="wz-g-split wz-row" data-wz-reveal="1" style={{ display: "grid", gridTemplateColumns: "1.04fr 1fr", gap: "52px", alignItems: "center", marginBottom: "84px" }}>
            <div style={{ borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,.55)", backdropFilter: "blur(20px) saturate(170%)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 34px 70px -34px rgba(20,20,40,.42)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 14px", background: "rgba(255,255,255,.6)", borderBottom: "1px solid rgba(228,227,240,.8)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ fontSize: "10.5px", color: "#8A8AA0", marginLeft: "6px" }}>
                  {"Earnings calls · Q1 2027"}
                </span>
              </div>
              <img src="/home-v8/app-earnings.webp" alt="Earnings call summary for Q1 2027 with key metrics" style={{ width: "100%" }} />
            </div>
            <div>
              <div style={{ display: "inline-block", background: "#0B0B18", color: "#fff", fontSize: "11.5px", fontWeight: "700", padding: "5px 12px", borderRadius: "100px", marginBottom: "14px" }}>
                {"Write"}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "26px", marginBottom: "10px", lineHeight: "1.2" }}>
                {"The first email that doesn't sound like the last ten."}
              </h3>
              <p style={{ fontSize: "14.5px", color: "#55556B", marginBottom: "22px" }}>
                {"Every exec gets messaging built around what they specifically said they care about — not a company-wide template."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEEEFC", color: "#4a4ad1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>
                    {"✓"}
                  </span>
                  <div>
                    <b style={{ fontSize: "14px", display: "block" }}>
                      {"Conversation starters"}
                    </b>
                    <span style={{ fontSize: "13px", color: "#55556B" }}>
                      {"Built per contact — a CFO opens differently than a VP of Ops."}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEEEFC", color: "#4a4ad1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>
                    {"✓"}
                  </span>
                  <div>
                    <b style={{ fontSize: "14px", display: "block" }}>
                      {"Sequence builder"}
                    </b>
                    <span style={{ fontSize: "13px", color: "#55556B" }}>
                      {"Multi-email sequences, each message advancing one argument."}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ background: "rgba(242,241,251,.9)", borderLeft: "3px solid #6262e9", borderRadius: "0 10px 10px 0", padding: "12px 16px", fontSize: "13px", color: "#55556B" }}>
                <b style={{ color: "#14141F" }}>
                  {"Executive outreach:"}
                </b>
                {" the email grounded in a real financial pressure is the one that gets a reply."}
              </div>
            </div>
          </div>
          <div className="wz-g-split" data-wz-reveal="1" style={{ display: "grid", gridTemplateColumns: "1fr 1.04fr", gap: "52px", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", background: "#0B0B18", color: "#fff", fontSize: "11.5px", fontWeight: "700", padding: "5px 12px", borderRadius: "100px", marginBottom: "14px" }}>
                {"Position"}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "26px", marginBottom: "10px", lineHeight: "1.2" }}>
                {"A case built on their numbers survives the first question."}
              </h3>
              <p style={{ fontSize: "14.5px", color: "#55556B", marginBottom: "22px" }}>
                {"Pick the POV, pick the executive, and turn the narrative into a deck, infographic or one-pager in one pass."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEEEFC", color: "#4a4ad1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>
                    {"✓"}
                  </span>
                  <div>
                    <b style={{ fontSize: "14px", display: "block" }}>
                      {"Scored POV dossiers"}
                    </b>
                    <span style={{ fontSize: "13px", color: "#55556B" }}>
                      {"Opportunity score, evidence level and the strategist's summary."}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEEEFC", color: "#4a4ad1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>
                    {"✓"}
                  </span>
                  <div>
                    <b style={{ fontSize: "14px", display: "block" }}>
                      {"Decks & infographics"}
                    </b>
                    <span style={{ fontSize: "13px", color: "#55556B" }}>
                      {"What used to take a designer three days now takes one pass."}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ background: "rgba(242,241,251,.9)", borderLeft: "3px solid #6262e9", borderRadius: "0 10px 10px 0", padding: "12px 16px", fontSize: "13px", color: "#55556B" }}>
                <b style={{ color: "#14141F" }}>
                  {"Business case:"}
                </b>
                {" a case built on their numbers survives the CFO's first question."}
              </div>
            </div>
            <div style={{ borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,.55)", backdropFilter: "blur(20px) saturate(170%)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 34px 70px -34px rgba(20,20,40,.42)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 14px", background: "rgba(255,255,255,.6)", borderBottom: "1px solid rgba(228,227,240,.8)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4E3F0" }}></span>
                <span style={{ fontSize: "10.5px", color: "#8A8AA0", marginLeft: "6px" }}>
                  {"POV Studio · Dossier"}
                </span>
              </div>
              <img src="/home-v8/app-povstudio.webp" alt="POV Studio dossier: financial pressure POV with opportunity score 4.2" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </section>
      <section className="wz-sec" id="value" style={{ padding: "86px 0", background: "#0B0B18", backgroundImage: "radial-gradient(ellipse 720px 460px at 14% 92%, rgba(99,73,198,.5), transparent 64%), radial-gradient(ellipse 620px 460px at 88% 4%, rgba(22,105,143,.42), transparent 64%)", color: "#fff" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 44px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#9C9CE0", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"Why Whyzer"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "32px", fontWeight: "700", lineHeight: "1.16", color: "#fff" }}>
              {"5× faster account prep, without the enterprise price tag."}
            </h2>
            <p style={{ fontSize: "15px", color: "#B9B9E8", marginTop: "12px" }}>
              {"Everyone has the same public data. The question is what it costs you to make it usable."}
            </p>
          </div>
          <div className="wz-g-split" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "48px", alignItems: "center" }}>
            <div style={{ position: "relative", borderRadius: "20px", padding: "34px 30px 26px", background: "rgba(255,255,255,.07)", backdropFilter: "blur(18px) saturate(150%)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 40px 80px -40px rgba(0,0,0,.6)" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "430px", margin: "0 auto" }}>
                <svg viewBox="0 0 400 226" style={{ width: "100%", display: "block", overflow: "visible" }} aria-label="Pricing gauge: generic AI at $20 per month, Whyzer at $57 per month, enterprise tools at $44,000 per year">
                  <defs>
                    <linearGradient id="wzArcL" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#5C6178"></stop>
                      <stop offset="1" stopColor="#7C7FA0"></stop>
                    </linearGradient>
                    <linearGradient id="wzArcM" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#8C87F0"></stop>
                      <stop offset="1" stopColor="#6262e9"></stop>
                    </linearGradient>
                    <linearGradient id="wzArcR" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#9A5A82"></stop>
                      <stop offset="1" stopColor="#B3413F"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M30 200 A170 170 0 0 1 96 68" fill="none" stroke="url(#wzArcL)" strokeWidth="22" strokeLinecap="round"></path>
                  <path d="M118 52 A170 170 0 0 1 282 52" fill="none" stroke="url(#wzArcM)" strokeWidth="26" strokeLinecap="round"></path>
                  <path d="M304 68 A170 170 0 0 1 370 200" fill="none" stroke="url(#wzArcR)" strokeWidth="22" strokeLinecap="round"></path>
                  <text x="30" y="222" fill="#8F8FD0" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700">
                    {"$20 / mo"}
                  </text>
                  <text x="318" y="222" fill="#8F8FD0" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700">
                    {"$44K / yr"}
                  </text>
                  <g style={{ transformOrigin: "200px 200px", transition: "transform 1.15s cubic-bezier(.34,1.06,.32,1)", transform: `rotate(${d.needleDeg})` }}>
                    <path d="M200 200 L200 62" stroke="#fff" strokeWidth="5" strokeLinecap="round"></path>
                    <circle cx="200" cy="200" r="13" fill="#fff"></circle>
                    <circle cx="200" cy="200" r="6" fill={d.needleHub}></circle>
                  </g>
                </svg>
                <div style={{ textAlign: "center", marginTop: "-6px" }}>
                  <div className="wz-gauge-amt" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "56px", fontWeight: "700", lineHeight: "1", transition: "color .5s ease", color: d.gaugeColor }}>
                    {d.gaugeAmount}
                    <span style={{ fontSize: "17px", color: "#8F8FD0", fontWeight: "500" }}>
                      {" "}
                      {d.gaugeUnit}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#B9B9E8", marginTop: "8px", minHeight: "38px" }}>
                    {d.gaugeCaption}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div data-wz-tier="0" style={{ cursor: "pointer", borderRadius: "14px", padding: "20px 22px", transition: "background .45s ease, border-color .45s ease, box-shadow .45s ease, transform .45s ease", background: d.tier0Bg, border: `1px solid ${d.tier0Border}`, boxShadow: d.tier0Shadow, transform: d.tier0Scale }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", letterSpacing: ".05em", textTransform: "uppercase", color: "#8F8FD0" }}>
                    {"Generic AI"}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "26px", fontWeight: "700", color: "#DADAF2" }}>
                    {"Free–$20"}
                    <span style={{ fontSize: "12px", color: "#8F8FD0", fontWeight: "500" }}>
                      {" /mo"}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "13.5px", color: "#B9B9E8" }}>
                  {"A summary you have to verify yourself. No sourcing, no fact-labeling, nothing that survives a room looking for the hole in it."}
                </div>
              </div>
              <div data-wz-tier="1" style={{ cursor: "pointer", borderRadius: "14px", padding: "20px 22px", transition: "background .45s ease, border-color .45s ease, box-shadow .45s ease, transform .45s ease", background: d.tier1Bg, border: `1px solid ${d.tier1Border}`, boxShadow: d.tier1Shadow, transform: d.tier1Scale }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", letterSpacing: ".05em", textTransform: "uppercase", color: "#C9C6FF" }}>
                    {"Whyzer"}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "26px", fontWeight: "700", color: "#fff" }}>
                    {"$57"}
                    <span style={{ fontSize: "12px", color: "#C9C6FF", fontWeight: "500" }}>
                      {" /seat/mo"}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "13.5px", color: "#E4E3FF" }}>
                  {"Same earnings-call intelligence, sourced and fact-labeled. "}
                  <b style={{ color: "#fff" }}>
                    {"5× faster prep"}
                  </b>
                  {", no contract, no demo, no approval cycle — start today."}
                </div>
              </div>
              <div data-wz-tier="2" style={{ cursor: "pointer", borderRadius: "14px", padding: "20px 22px", transition: "background .45s ease, border-color .45s ease, box-shadow .45s ease, transform .45s ease", background: d.tier2Bg, border: `1px solid ${d.tier2Border}`, boxShadow: d.tier2Shadow, transform: d.tier2Scale }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", letterSpacing: ".05em", textTransform: "uppercase", color: "#8F8FD0" }}>
                    {"Enterprise tools"}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "26px", fontWeight: "700", color: "#DADAF2" }}>
                    {"$44,000"}
                    <span style={{ fontSize: "12px", color: "#8F8FD0", fontWeight: "500" }}>
                      {" /yr"}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "13.5px", color: "#B9B9E8" }}>
                  {"Sold through procurement. Six-week approval cycle, annual commitment, built for analyst teams with enterprise budgets — not for the rep with a call on Thursday."}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginTop: "48px" }}>
            <a className="wzh1" href="#pricing-monthly" style={{ background: "#6262e9", color: "#fff", fontWeight: "600", fontSize: "15px", padding: "15px 28px", borderRadius: "9px", boxShadow: "0 14px 30px -12px rgba(98,98,233,.7)" }}>
              {"Start your free trial"}
            </a>
            <a className="wzh3" href="/compare/ai-account-intelligence-tools" style={{ background: "rgba(255,255,255,.08)", color: "#fff", fontWeight: "600", fontSize: "15px", padding: "15px 28px", borderRadius: "9px", border: "1px solid rgba(255,255,255,.28)" }}>
              {"Learn more"}
            </a>
          </div>
        </div>
      </section>
      <section className="wz-sec" style={{ padding: "88px 0" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: "620px", margin: "0 auto 40px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6262e9", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"Proof"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "31px", fontWeight: "700", lineHeight: "1.18" }}>
              {"Don't take our word for it."}
            </h2>
          </div>
          <div className="wz-darkcard" style={{ borderRadius: "22px", padding: "34px 34px 30px", marginBottom: "44px", background: "#0B0B18", backgroundImage: "radial-gradient(ellipse 420px 300px at 14% 86%, rgba(99,73,198,.5), transparent 66%), radial-gradient(ellipse 350px 280px at 90% 8%, rgba(22,105,143,.45), transparent 66%)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", marginBottom: "22px" }}>
              <div style={{ maxWidth: "520px" }}>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#fff", fontSize: "24px", lineHeight: "1.2", marginBottom: "8px", textWrap: "pretty" }}>
                  {"Hear it from the reps carrying the quota."}
                </h3>
                <p style={{ fontSize: "13.5px", color: "#B9B9E8" }}>
                  {"Unscripted, 60–90 seconds each. Pick one and press play."}
                </p>
              </div>
              <div className="wz-vnav" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button className="wzh4" data-wz-vnav="prev" aria-label="Previous videos" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#DADAF2", cursor: "pointer", fontSize: "15px" }}>
                  {"←"}
                </button>
                <div style={{ fontSize: "12px", color: "#8F8FD0", fontVariantNumeric: "tabular-nums", minWidth: "52px", textAlign: "center" }}>
                  {d.videoPage}
                </div>
                <button className="wzh4" data-wz-vnav="next" aria-label="Next videos" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#DADAF2", cursor: "pointer", fontSize: "15px" }}>
                  {"→"}
                </button>
              </div>
            </div>
            <div className="wz-vwrap" style={{ overflow: "hidden" }}>
              <div className="wz-vtrack" style={{ display: "flex", gap: "18px", transition: "transform .65s cubic-bezier(.4,0,.2,1)", transform: `translateX(${d.videoTrackX})` }}>
                {d.videos.map((v, _i) => (
                  <Fragment key={_i}>
                    <div className="wz-vcard wzh5" data-wz-vid={v.i} role="button" tabIndex={0} aria-label={`Play: ${v.name} — ${v.title}`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }} style={{ flex: "0 0 calc((100% - 36px) / 3)", cursor: "pointer", borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.13)", transition: "transform .35s ease, border-color .35s ease" }}>
                      <div style={{ position: "relative", aspectRatio: "16/9", background: "#0F1230" }}>
                        {/* The seller's name and talk title are part of the artwork. */}
                        <img src={v.poster} alt="" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(7,7,15,.28)" }}>
                          <span style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,.94)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 32px -12px rgba(0,0,0,.7)" }}>
                            <span style={{ color: "#14141F", fontSize: "16px", marginLeft: "3px" }}>{"▶"}</span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="wz-g1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "44px" }}>
            <div style={{ textAlign: "center", background: "rgba(255,255,255,.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "16px", padding: "24px", boxShadow: "0 26px 54px -34px rgba(20,20,40,.34)" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "36px", fontWeight: "700", color: "#4a4ad1" }}>
                {"65%"}
              </div>
              <div style={{ fontSize: "12px", color: "#55556B", textTransform: "uppercase", letterSpacing: ".04em", marginTop: "4px" }}>
                {"Of users' annual quota traceable to Whyzer"}
              </div>
            </div>
            <div style={{ textAlign: "center", background: "rgba(255,255,255,.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "16px", padding: "24px", boxShadow: "0 26px 54px -34px rgba(20,20,40,.34)" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "36px", fontWeight: "700", color: "#4a4ad1" }}>
                {"$5.7M"}
              </div>
              <div style={{ fontSize: "12px", color: "#55556B", textTransform: "uppercase", letterSpacing: ".04em", marginTop: "4px" }}>
                {"Closed this year using Whyzer POVs"}
              </div>
            </div>
            <div style={{ textAlign: "center", background: "rgba(255,255,255,.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "16px", padding: "24px", boxShadow: "0 26px 54px -34px rgba(20,20,40,.34)" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "36px", fontWeight: "700", color: "#4a4ad1" }}>
                {"32%"}
              </div>
              <div style={{ fontSize: "12px", color: "#55556B", textTransform: "uppercase", letterSpacing: ".04em", marginTop: "4px" }}>
                {"Bigger deals closed"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#8A8AA0", textTransform: "uppercase", letterSpacing: ".05em" }}>
              {"What elite sellers say"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button className="wzh6" data-wz-quote="prev" aria-label="Previous testimonials" style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #E4E3F0", background: "#fff", cursor: "pointer", fontSize: "14px", color: "#55556B" }}>
                {"←"}
              </button>
              <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                {d.dots.map((c, k) => (
                  <span key={k} style={{ width: "22px", height: "6px", borderRadius: "100px", transition: "background .3s ease", background: c }}></span>
                ))}
              </div>
              <button className="wzh6" data-wz-quote="next" aria-label="Next testimonials" style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #E4E3F0", background: "#fff", cursor: "pointer", fontSize: "14px", color: "#55556B" }}>
                {"→"}
              </button>
            </div>
          </div>
          <div className="wz-g1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            {d.quotes.map((quote, k) => (
              <div key={d.qi + "-" + k} style={{ background: "rgba(255,255,255,.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "16px", padding: "26px", boxShadow: "0 26px 54px -34px rgba(20,20,40,.34)", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".06em", textTransform: "uppercase", color: quote.color, background: quote.bg, alignSelf: "flex-start", padding: "5px 11px", borderRadius: "100px", marginBottom: "16px" }}>{quote.c}</div>
                <p style={{ fontSize: "14.5px", color: "#14141F", lineHeight: "1.6", flex: 1, textWrap: "pretty" }}>{"“"}{quote.q}{"”"}</p>
                <div style={{ fontSize: "13px", fontWeight: "700", marginTop: "16px" }}>
                  {quote.n}
                  <span style={{ display: "block", fontWeight: "500", fontSize: "12px", color: "#8A8AA0" }}>{quote.r}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="wz-sec" id="elite" style={{ padding: "88px 0", background: "#0B0B18", backgroundImage: "radial-gradient(ellipse 700px 450px at 10% 90%, rgba(99,73,198,.45), transparent 65%), radial-gradient(ellipse 600px 450px at 92% 5%, rgba(22,105,143,.4), transparent 65%)", color: "#fff" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ maxWidth: "660px", marginBottom: "20px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#9C9CE0", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"Whyzer Elite"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "32px", fontWeight: "700", lineHeight: "1.16", color: "#fff", textWrap: "pretty" }}>
              {"Premium builds your argument. Elite makes sure you know what to do with it."}
            </h2>
            <p style={{ fontSize: "15px", color: "#B9B9E8", marginTop: "12px", textWrap: "pretty" }}>
              {"A POV gets you in the door. The multi-threading, the stall at legal, the champion who goes quiet — that's deal-cycle work. It's what Jamal spent two decades learning before he built a platform around it."}
            </p>
          </div>
          <div className="wz-pill" style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: "100px", padding: "8px 8px 8px 18px", marginBottom: "40px" }}>
            <span style={{ background: "#6262e9", color: "#fff", fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "100px" }}>
              {"Included with Elite & Corporate"}
            </span>
            <span style={{ fontSize: "13px", color: "#B9B9E8", paddingRight: "10px" }}>
              {"The methodology behind the tool."}
            </span>
          </div>
          <div className="wz-g1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            <div data-wz-reveal="1" style={{ borderRadius: "18px", overflow: "hidden", background: "rgba(255,255,255,.06)", backdropFilter: "blur(18px) saturate(150%)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 34px 70px -38px rgba(0,0,0,.7)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 18px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "10.5px", fontWeight: "700", letterSpacing: ".05em", textTransform: "uppercase", color: "#C9C6FF", background: "rgba(98,98,233,.22)", padding: "5px 11px", borderRadius: "100px", marginBottom: "14px" }}>
                  {"◆ Playbook"}
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "18px", marginBottom: "8px" }}>
                  {"The Vault"}
                </h4>
                <p style={{ fontSize: "13px", color: "#9C9CE0" }}>
                  {"Jamal's full enterprise selling playbook."}
                </p>
              </div>
              <div style={{ margin: "0 16px 16px", borderRadius: "12px", background: "rgba(9,17,39,.6)", border: "1px solid rgba(255,255,255,.1)", padding: "6px 14px" }}>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"The Pipeline Flywheel"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"The Enterprise Sellers Playbook"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"The MDA Masterclass"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"Full Funnel Playbooks"}
                </div>
              </div>
            </div>
            <div data-wz-reveal="1" style={{ borderRadius: "18px", overflow: "hidden", background: "rgba(255,255,255,.06)", backdropFilter: "blur(18px) saturate(150%)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 34px 70px -38px rgba(0,0,0,.7)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 18px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "10.5px", fontWeight: "700", letterSpacing: ".05em", textTransform: "uppercase", color: "#BFE0FD", background: "rgba(22,105,143,.28)", padding: "5px 11px", borderRadius: "100px", marginBottom: "14px" }}>
                  {"◈ Courses"}
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "18px", marginBottom: "8px" }}>
                  {"Courses & frameworks"}
                </h4>
                <p style={{ fontSize: "13px", color: "#9C9CE0" }}>
                  {"The methodology, taught step by step."}
                </p>
              </div>
              <div style={{ margin: "0 16px 16px", borderRadius: "12px", background: "rgba(9,17,39,.6)", border: "1px solid rgba(255,255,255,.1)", padding: "6px 14px" }}>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"The Executive Outreach Course"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"Financial Fluency 101"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"Pipeline Flywheel & MDA Masterclass"}
                </div>
              </div>
            </div>
            <div data-wz-reveal="1" style={{ borderRadius: "18px", overflow: "hidden", background: "rgba(255,255,255,.06)", backdropFilter: "blur(18px) saturate(150%)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 34px 70px -38px rgba(0,0,0,.7)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 18px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "10.5px", fontWeight: "700", letterSpacing: ".05em", textTransform: "uppercase", color: "#FFB4B4", background: "rgba(179,65,63,.22)", padding: "5px 11px", borderRadius: "100px", marginBottom: "14px" }}>
                  {"Live + AI"}
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "18px", marginBottom: "8px" }}>
                  {"Academy & Coach Jamal"}
                </h4>
                <p style={{ fontSize: "13px", color: "#9C9CE0" }}>
                  {"Monthly upskilling live sessions led by Jamal, plus an AI co-pilot."}
                </p>
              </div>
              <div style={{ margin: "0 16px 16px", borderRadius: "12px", background: "rgba(9,17,39,.6)", border: "1px solid rgba(255,255,255,.1)", padding: "6px 14px" }}>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"Whyzer Academy: live monthly sessions with Jamal"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#DADAF2", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: "9px" }}>
                  <span style={{ color: "#8C87F0", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  {"Coach Jamal AI, your sales co-pilot"}
                </div>
              </div>
            </div>
          </div>
          <div className="wz-g2" style={{ marginTop: "22px", borderRadius: "16px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", padding: "22px 24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "18px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#8F8FD0", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "6px" }}>
                {"New companies"}
              </div>
              <div style={{ fontSize: "13px", color: "#DADAF2" }}>
                {"Add up to 500 each month."}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#8F8FD0", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "6px" }}>
                {"Podcasts"}
              </div>
              <div style={{ fontSize: "13px", color: "#DADAF2" }}>
                {"30 podcast generations."}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#8F8FD0", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "6px" }}>
                {"Executive POV dossiers"}
              </div>
              <div style={{ fontSize: "13px", color: "#DADAF2" }}>
                {"Up to 100 Executive POV Dossiers."}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#8F8FD0", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "6px" }}>
                {"Coach Jamal AI"}
              </div>
              <div style={{ fontSize: "13px", color: "#DADAF2" }}>
                {"Your AI sales co-pilot."}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wz-sec" id="pricing" style={{ padding: "88px 0" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6262e9", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"Pricing"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "31px", fontWeight: "700", lineHeight: "1.18" }}>
              {"Less than one lost deal."}
            </h2>
            <p style={{ fontSize: "15px", color: "#55556B", marginTop: "12px" }}>
              {"Premium gets you the full research platform. Elite adds Jamal's entire methodology on top — that's the difference."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", margin: "34px 0 8px" }}>
            <span data-wz-bill="monthly" style={{ fontSize: "13.5px", fontWeight: "600", cursor: "pointer", color: d.billMonthlyColor }}>
              {"Monthly"}
            </span>
            <button data-wz-bill="toggle" aria-label="Toggle annual billing" style={{ width: "48px", height: "27px", border: "0", background: "#6262e9", borderRadius: "100px", position: "relative", cursor: "pointer", flexShrink: "0" }}>
              <span style={{ position: "absolute", top: "3px", width: "21px", height: "21px", background: "#fff", borderRadius: "50%", boxShadow: "0 2px 6px rgba(0,0,0,.2)", transition: "left .22s ease", left: d.knobLeft }}></span>
            </button>
            <span data-wz-bill="annual" style={{ fontSize: "13.5px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", color: d.billAnnualColor }}>
              {"Annual "}
              <span style={{ whiteSpace: "nowrap", background: "#E7F7EF", color: "#1F9D6B", fontSize: "11px", fontWeight: "700", padding: "3px 9px", borderRadius: "100px" }}>
                {"Save up to 17%"}
              </span>
            </span>
          </div>
          <div style={{ textAlign: "center", fontSize: "12px", color: "#8A8AA0", maxWidth: "560px", margin: "0 auto" }}>
            {"Prices shown in your local currency. Monthly plans include a 14-day free trial — cancel before it ends and you won't be charged. Annual plans are billed in full at signup."}
          </div>
          <div className="wz-g1" style={{ display: "grid", gridTemplateColumns: "1fr 1.06fr 1fr", gap: "20px", marginTop: "40px", alignItems: "stretch" }}>
            <div style={{ background: "rgba(255,255,255,.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(228,227,240,.9)", borderRadius: "18px", padding: "30px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".05em", color: "#8A8AA0", background: "#F2F1FB", alignSelf: "flex-start", padding: "5px 11px", borderRadius: "100px", marginBottom: "12px" }}>
                {"STARTER"}
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "17px", marginBottom: "4px" }}>
                {"Whyzer Premium"}
              </h4>
              <div style={{ fontSize: "13px", color: "#8A8AA0" }}>
                {"The full research platform."}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "18px 0 4px" }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "64px", fontWeight: "700", lineHeight: ".92", letterSpacing: "-.02em" }}>
                  {d.premiumPrice}
                </span>
                <span style={{ fontSize: "14px", color: "#8A8AA0", fontWeight: "500" }}>
                  {"per seat / month"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#8A8AA0" }}>
                {d.premiumNote}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "22px 0", flex: "1" }}>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Unlimited company reports"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Add up to 30 new companies each month"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Unlimited deal maps"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"2 Whyzer & Jamal podcasts per month"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"2 Executive POV Dossiers"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Email Campaign Generator"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Chat with WhyzerAI"}
                  </span>
                </div>
              </div>
              <a className="wzh7" href={d.premiumLink} data-wz-checkout="1" style={{ textAlign: "center", background: "transparent", color: "#14141F", fontWeight: "600", fontSize: "15px", padding: "14px 22px", borderRadius: "9px", border: "1.5px solid #E4E3F0" }}>
                {d.ctaPremium}
              </a>
              {d.showTrialNote && (
                <>
                  <div style={{ fontSize: "12px", color: "#8A8AA0", textAlign: "center", marginTop: "12px", lineHeight: "1.5" }}>
                    {"Free for 14 days, then "}
                    {d.premiumPrice}
                    {"/mo, unless you cancel. Cancel anytime in your Client Portal."}
                  </div>
                </>
              )}
            </div>
            <div style={{ position: "relative", background: "linear-gradient(180deg, rgba(238,238,252,.9), rgba(255,255,255,.85))", backdropFilter: "blur(18px)", border: "1.5px solid #6262e9", borderRadius: "18px", padding: "34px 30px 32px", display: "flex", flexDirection: "column", boxShadow: "0 30px 70px -34px rgba(98,98,233,.55)" }}>
              <span style={{ position: "absolute", top: "0", left: "0", right: "0", height: "120px", overflow: "hidden", borderRadius: "17px 17px 0 0", pointerEvents: "none" }}>
                <span style={{ position: "absolute", top: "0", left: "0", width: "70px", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)", animation: "wzShine 5.5s ease-in-out infinite" }}></span>
              </span>
              <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "#6262e9", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "6px 16px", borderRadius: "100px", boxShadow: "0 8px 20px -8px rgba(98,98,233,.8)" }}>
                {"✦ Most popular"}
              </div>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".05em", color: "#4a4ad1", background: "#fff", alignSelf: "flex-start", padding: "5px 11px", borderRadius: "100px", marginBottom: "12px" }}>
                {"FULL ACCESS"}
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "17px", marginBottom: "4px" }}>
                {"Whyzer Elite"}
              </h4>
              <div style={{ fontSize: "13px", color: "#55556B" }}>
                {"Platform + Jamal's full methodology."}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "18px 0 4px" }}>
                <span className="wz-bigprice" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "76px", fontWeight: "700", lineHeight: ".92", letterSpacing: "-.02em", color: "#14141F" }}>
                  {d.elitePrice}
                </span>
                <span style={{ fontSize: "14px", color: "#55556B", fontWeight: "500" }}>
                  {"per seat / month"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#55556B" }}>
                {d.eliteNote}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "22px 0", flex: "1" }}>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    <b style={{ color: "#14141F" }}>
                      {"Everything in Premium"}
                    </b>
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Add up to 500 new companies each month"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"30 podcast generations"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"100 Executive POV Dossiers"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    <b style={{ color: "#14141F" }}>
                      {"The Vault"}
                    </b>
                    {": Jamal's full enterprise selling playbook"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    <b style={{ color: "#14141F" }}>
                      {"Coach Jamal AI"}
                    </b>
                    {", your sales co-pilot"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Pipeline Flywheel & MDA Masterclass"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Executive Outreach Course"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Financial Fluency 101"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    <b style={{ color: "#14141F" }}>
                      {"Whyzer Academy"}
                    </b>
                    {": monthly upskilling live sessions led by Jamal"}
                  </span>
                </div>
              </div>
              <a className="wzh1" href={d.eliteLink} data-wz-checkout="1" style={{ textAlign: "center", background: "#6262e9", color: "#fff", fontWeight: "600", fontSize: "15px", padding: "15px 24px", borderRadius: "9px", boxShadow: "0 14px 30px -12px rgba(98,98,233,.7)" }}>
                {d.ctaElite}
              </a>
              {d.showTrialNote && (
                <>
                  <div style={{ fontSize: "12px", color: "#55556B", textAlign: "center", marginTop: "12px", lineHeight: "1.5" }}>
                    {"Free for 14 days, then "}
                    {d.elitePrice}
                    {"/mo, unless you cancel. Cancel anytime in your Client Portal."}
                  </div>
                </>
              )}
            </div>
            <div style={{ background: "rgba(255,255,255,.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(228,227,240,.9)", borderRadius: "18px", padding: "30px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".05em", color: "#8A8AA0", background: "#F2F1FB", alignSelf: "flex-start", padding: "5px 11px", borderRadius: "100px", marginBottom: "12px" }}>
                {"TEAMS"}
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "17px", marginBottom: "4px" }}>
                {"Corporate / Teams"}
              </h4>
              <div style={{ fontSize: "13px", color: "#8A8AA0" }}>
                {"Elite, rolled out to the whole floor."}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "18px 0 4px" }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "56px", fontWeight: "700", lineHeight: ".92", letterSpacing: "-.02em" }}>
                  {"Custom"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#8A8AA0" }}>
                {"contact for team pricing"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "22px 0", flex: "1" }}>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Everything in Elite"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Volume team pricing"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"Dedicated onboarding"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#55556B", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6262e9", fontWeight: "700" }}>
                    {"✓"}
                  </span>
                  <span>
                    {"3-hr live session with Jamal"}
                  </span>
                </div>
              </div>
              <a className="wzh7" href="https://api.leadconnectorhq.com/widget/bookings/whyzer-for-sales-leaders" target="_top" style={{ textAlign: "center", background: "transparent", color: "#14141F", fontWeight: "600", fontSize: "15px", padding: "14px 22px", borderRadius: "9px", border: "1.5px solid #E4E3F0" }}>
                {"Talk to Jamal Directly →"}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="wz-sec2" id="faq" style={{ padding: "80px 0", background: "#F2F1FB" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6262e9", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
              {"FAQ"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "31px", fontWeight: "700", lineHeight: "1.18" }}>
              {"Questions, answered."}
            </h2>
          </div>
          <div className="wz-faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>
            <div style={{ background: "rgba(255,255,255,.8)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "14px", padding: "24px" }}>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", marginBottom: "6px", color: "#4a4ad1" }}>
                {"Core product"}
              </h4>
              <details className="wz-faq-item" {...{ name: "wz-faq" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"How is Whyzer different from ChatGPT or other general AI tools?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"General AI tools are built for everything, which means they're optimized for nothing. Whyzer is different in three specific ways. First, every POV Whyzer generates is grounded in real, recent financial data (SEC filings, earnings calls, investor letters), not the model's training memory. The output is auditable. You can defend every claim in front of a CFO because you know exactly where it came from. Second, Whyzer doesn't just surface data; it interprets it for sellers. The intelligence lives in the context, the prompts, and the methodology built by sellers who close 7- and 8-figure deals. Third, Whyzer's structured workflows remove the variability of a blank chat window: input the account, get a consistent, boardroom-ready POV every time."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"How does Whyzer work?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Search any of 10,500+ global companies. Whyzer instantly pulls from SEC filings, earnings calls, investor letters, and other public financial data to surface the account's financial priorities, executive pressures, and strategic bets. It then generates 2–3 boardroom-ready Points of View, each one connecting the account's board-level priorities to your solution's value. From search to POV in under 2 minutes, every time."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"Does Whyzer cover international and private companies outside the US?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Yes. Whyzer provides robust global coverage across North America, Europe, Latin America, and other major international markets. The platform surfaces strategic insights for both public and private companies globally. The only general parameter is that a target company should have 100 to 150+ employees to ensure a sufficiently deep trail of corporate data, earnings reports, or market signals exists for our engine to analyze."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"How quickly can I generate insights for a new international account?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Instantly. If a company isn't already one of the 10,500+ active profiles in our global database, you can simply add the named account to your dashboard. Whyzer's engine will completely map the company's financial health, strategic priorities, and executive viewpoints within 2 to 3 minutes."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"Can I target companies by broad geography or region?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"No. Whyzer is purpose-built for highly targeted, account-based strategic selling. Rather than pulling massive, low-intent lists by geographic territory, the platform requires you to input specific named accounts so it can deliver precise, deeply personalized C-suite breakthrough strategies."}
                </div>
              </details>
            </div>
            <div style={{ background: "rgba(255,255,255,.8)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "14px", padding: "24px" }}>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", marginBottom: "6px", color: "#4a4ad1" }}>
                {"Competitive / pricing"}
              </h4>
              <details className="wz-faq-item" {...{ name: "wz-faq" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"How is Whyzer different from Databook?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Databook is a strong product built for enterprise teams with enterprise budgets; contracts typically run $30,000–$60,000 per year and are sold top-down to large organisations. Whyzer is built for the individual seller who wants that same quality of financial intelligence without waiting for a procurement process. At $57/month, Whyzer puts boardroom-ready POVs in reach of every rep, not just the ones whose company can afford a six-figure vendor contract. Whyzer also covers 10,500+ public and private companies globally, including the private and international accounts that tools like Databook don't cover well."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"How does the free trial work?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Monthly Premium and Elite plans include a 14-day free trial. You'll have full access from day one, and if you don't cancel before the trial ends, we'll automatically charge your card and your subscription continues on a monthly basis. We'll email you a reminder before your trial ends so you're never caught off guard. Cancel anytime, free, from your Client Portal — no call required. Annual plans are billed in full at signup and don't include a trial."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"What's included in The Vault?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"The Vault is Jamal Reimer's complete enterprise selling methodology, built from $160M+ in closed SaaS deals and continuously refined by the Whyzer Community. It includes The Pipeline Flywheel, The Enterprise Sellers Playbook, The MDA Masterclass, The Executive Outreach Course, Full Funnel Playbooks, and live monthly sessions with Jamal. The Vault is included with Whyzer Elite and Corporate plans."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"Can a small sales team share a single Whyzer account?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"No. Whyzer seats are provisioned on an individual basis to ensure the machine learning models and tailored workspace remain accurate to your specific pipeline, territory, and deal-tracking history. However, our subscription tiers are intentionally priced to make individual seats highly accessible for growing teams. For custom multi-seat team packages, please contact info@whyzer.ai."}
                </div>
              </details>
            </div>
            <div style={{ background: "rgba(255,255,255,.8)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "14px", padding: "24px" }}>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", marginBottom: "6px", color: "#4a4ad1" }}>
                {"Workflow & integrations"}
              </h4>
              <details className="wz-faq-item" {...{ name: "wz-faq" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"Can Whyzer draft outreach tailored to specific C-suite personas?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Yes, natively. Once Whyzer maps an account's strategic gaps, you can navigate to the \"Write\" workflow. The system will identify the core stakeholders relevant to your deal, analyze their specific business pressures (e.g., CFO vs. Head of Supply Chain), and draft hyper-tailored point-of-view (PoV) outreach designed to clear executive inbox filters."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"Can I track large lists of accounts simultaneously for automated signal tracking?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Bulk account tracking and programmatic point-of-view (PoV) generation are currently available as an early-access feature via our MCP (Model Context Protocol) server. This workflow allows strategic sellers to monitor 60–70+ named accounts simultaneously to prioritize high-intent pipeline signals. If you are a current subscriber and want early-bird access to our bulk workflows, contact our team."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"Can Whyzer integrate with my CRM?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Whyzer is currently designing integrations with major CRMs, sales engagement tools, and Slack so insights show up exactly where your team works. If you have a specific integration in mind, we'd love to hear it. Reach out directly and it goes straight to the product roadmap."}
                </div>
              </details>
            </div>
            <div style={{ background: "rgba(255,255,255,.8)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.9)", borderRadius: "14px", padding: "24px" }}>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", marginBottom: "6px", color: "#4a4ad1" }}>
                {"Security & community"}
              </h4>
              <details className="wz-faq-item" {...{ name: "wz-faq" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"Is my data secure?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"Whyzer only uses publicly available, permissioned data sources: SEC filings, earnings calls, press releases, and investor communications. No scraping of private systems, no confidential data. All data is processed using encrypted infrastructure and we never store sensitive personal information. Your research stays yours, private, secure, and compliant by design."}
                </div>
              </details>
              <details className="wz-faq-item" {...{ name: "wz-faq" }} style={{ borderTop: "1px solid #E4E3F0" }}>
                <summary style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "500", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span>
                    {"What is the Whyzer Community?"}
                  </span>
                  <span className="wz-faq-plus" style={{ color: "#8A8AA0", fontSize: "17px", lineHeight: "1.2", flexShrink: "0" }}>
                    {"＋"}
                  </span>
                </summary>
                <div style={{ fontSize: "13px", color: "#55556B", padding: "0 0 14px", lineHeight: "1.65" }}>
                  {"The Whyzer Community is a group of elite enterprise sellers, many of them Jamal's coaching clients, who use Whyzer to close complex, high-value deals. The community continuously shapes the product: enhancement requests, new use cases, and real-world feedback from sellers in the field flow directly into Whyzer's development. It's the reason Whyzer gets sharper every month."}
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>
      <section className="wz-sec2" style={{ padding: "80px 0", textAlign: "center", background: "#0B0B18", backgroundImage: "radial-gradient(ellipse 600px 400px at 20% 100%, rgba(99,73,198,.5), transparent 65%), radial-gradient(ellipse 500px 400px at 85% 0%, rgba(22,105,143,.45), transparent 65%)" }}>
        <div className="wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#fff", fontSize: "33px", marginBottom: "12px", lineHeight: "1.16", textWrap: "pretty" }}>
            {"Someone's closing your next account with a sharper argument than yours."}
          </h2>
          <p style={{ color: "#B9B9E8", fontSize: "14.5px", marginBottom: "28px" }}>
            {"10,500+ companies · 150+ markets · Built by the seller who closed $160M doing it himself."}
          </p>
          <a className="wzh1" href="#pricing" style={{ display: "inline-block", background: "#6262e9", color: "#fff", fontWeight: "600", fontSize: "15px", padding: "15px 30px", borderRadius: "9px", boxShadow: "0 14px 34px -12px rgba(98,98,233,.9)" }}>
            {"Start your free trial"}
          </a>
        </div>
      </section>
      <footer style={{ padding: "56px 0 28px", background: "#FAFAF9", borderTop: "1px solid #E4E3F0" }}>
        <div className="wz-foot-grid wz-wrap" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr", gap: "40px" }}>
          <div>
            <a href="https://www.whyzer.ai" target="_top" style={{ display: "inline-block", marginBottom: "14px" }}>
              <img src="/home-v8/whyzer-logo-dark.png" alt="Whyzer" style={{ height: "24px", width: "auto" }} />
            </a>
            <p style={{ fontSize: "13.5px", color: "#55556B", maxWidth: "260px", marginBottom: "16px" }}>
              {"AI-powered Point of View platform for elite B2B sellers."}
            </p>
            <a href="https://www.linkedin.com/company/whyzer-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: "#8A8AA0", display: "inline-block" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
              </svg>
            </a>
          </div>
          <div>
            <h4 style={{ fontSize: "13.5px", fontWeight: "600", marginBottom: "14px" }}>
              {"Product"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
              <a href="#features" style={{ color: "#55556B" }}>
                {"Features"}
              </a>
              <a href="#tour" style={{ color: "#55556B" }}>
                {"How It Works"}
              </a>
              <a href="#elite" style={{ color: "#55556B" }}>
                {"The Vault"}
              </a>
              <a href="#pricing" style={{ color: "#55556B" }}>
                {"Pricing"}
              </a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "13.5px", fontWeight: "600", marginBottom: "14px" }}>
              {"Resources"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
              <a href={appendUtm("https://subscribe.whyzer.ai/academy-registration")} target="_blank" style={{ color: "#55556B" }}>
                {"Whyzer Academy"}
              </a>
              <a href="http://intercom.help/whyzerai/en" target="_blank" style={{ color: "#55556B" }}>
                {"Help Center"}
              </a>
              <a href="#faq" style={{ color: "#55556B" }}>
                {"FAQ"}
              </a>
              <a href="/newsletter" style={{ color: "#55556B" }}>
                {"Newsletter"}
              </a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "13.5px", fontWeight: "600", marginBottom: "14px" }}>
              {"Company"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
              <a href="mailto:info@whyzer.ai" style={{ color: "#55556B" }}>
                {"Contact"}
              </a>
              <a href="/privacy-policy" style={{ color: "#55556B" }}>
                {"Privacy Policy"}
              </a>
              <a href="/terms-and-conditions" style={{ color: "#55556B" }}>
                {"Terms of Service"}
              </a>
              <a href="https://members.whyzer.ai/login" target="_top" style={{ color: "#55556B" }}>
                {"Members Area"}
              </a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1160px", margin: "40px auto 0", padding: "20px 32px 0", borderTop: "1px solid #E4E3F0", fontSize: "13px", color: "#8A8AA0" }}>
          {"© "}
          {d.year}
          {" Whyzer.ai · All rights reserved"}
        </div>
      </footer>
      {d.vIsOpen && (
        <>
          <div className="wz-overlay" style={{ position: "fixed", inset: "0", zIndex: "95", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px" }}>
            <div data-wz-vclose="1" style={{ position: "absolute", inset: "0", background: "rgba(6,6,14,.82)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}></div>
            <div style={{ position: "relative", width: "100%", maxWidth: "940px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#fff", fontSize: "19px" }}>
                    {d.vName}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#8F8FD0" }}>
                    {d.vRole}
                  </div>
                </div>
                <button className="wzh8" data-wz-vclose="1" aria-label="Close video" style={{ width: "42px", height: "42px", borderRadius: "12px", background: "transparent", border: "1px solid #6262e9", color: "#DADAF2", cursor: "pointer", fontSize: "17px" }}>
                  {"✕"}
                </button>
              </div>
              <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 60px 120px -40px rgba(0,0,0,.85)", aspectRatio: "16/9", background: "#000" }}>
                <iframe src={d.vSrc} title="Video testimonial" allow="autoplay; fullscreen" allowFullScreen style={{ width: "100%", height: "100%", border: "0", display: "block" }}></iframe>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "14px" }}>
                <button className="wzh4" data-wz-vstep="-1" style={{ border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#DADAF2", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "600", padding: "10px 18px", borderRadius: "100px" }}>
                  {"← Previous"}
                </button>
                <div style={{ fontSize: "12px", color: "#8F8FD0" }}>
                  {d.vPosition}
                </div>
                <button className="wzh4" data-wz-vstep="1" style={{ border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#DADAF2", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "600", padding: "10px 18px", borderRadius: "100px" }}>
                  {"Next →"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {d.exitOpen && (
        <>
          <div className="wz-overlay" style={{ position: "fixed", inset: "0", zIndex: "90", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px", overflowY: "auto" }}>
            <div data-wz-exit="close" style={{ position: "absolute", inset: "0", background: "rgba(9,17,39,.62)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}></div>
            <div className="wz-exit-card" style={{ position: "relative", width: "100%", maxWidth: "940px", margin: "auto", maxHeight: "calc(100vh - 48px)", overflowY: "auto", borderRadius: "26px", display: "grid", gridTemplateColumns: "1.02fr .98fr", alignItems: "stretch", background: "linear-gradient(165deg, rgba(28,28,48,.97), rgba(13,13,26,.98))", backdropFilter: "blur(26px) saturate(160%)", WebkitBackdropFilter: "blur(26px) saturate(160%)", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 60px 120px -40px rgba(0,0,0,.8)" }}>
              <button className="wzh9" data-wz-exit="close" aria-label="Close" style={{ position: "absolute", top: "16px", right: "16px", zIndex: "3", width: "38px", height: "38px", borderRadius: "12px", background: "rgba(11,11,24,.5)", border: "1px solid #6262e9", color: "#DADAF2", cursor: "pointer", fontSize: "18px", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s ease" }}>
                {"✕"}
              </button>
              <div className="wz-exit-main" style={{ minHeight: "0", padding: "30px 34px 28px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "700", letterSpacing: ".07em", textTransform: "uppercase", color: "#C9C6FF", background: "rgba(98,98,233,.2)", border: "1px solid rgba(140,135,240,.35)", padding: "6px 12px", borderRadius: "100px", marginBottom: "16px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#33D69F", animation: "wzPulse 2.2s ease-out infinite" }}></span>
                  {"Free · 20 minutes · watch anytime"}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "29px", fontWeight: "700", lineHeight: "1.08", letterSpacing: "-.01em", textTransform: "uppercase", color: "#F5F3EE", marginBottom: "16px", textWrap: "pretty" }}>
                  {"Before you go: the number one thing CFOs wish sellers understood."}
                </h3>
                <div style={{ height: "2px", background: "#6262e9", marginBottom: "16px" }}></div>
                <p style={{ fontSize: "14px", lineHeight: "1.65", color: "#A9A9BE", marginBottom: "18px", textWrap: "pretty" }}>
                  {"Jamal walks the financial fluency framework enterprise sellers use to get taken seriously in the room — with a real 10-K on screen. Takes less time than the meeting you're about to prep for."}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "13.5px", color: "#B9B9E8", display: "flex", gap: "10px" }}>
                    <span style={{ color: "#6262e9", fontWeight: "700" }}>
                      {"✓"}
                    </span>
                    {"Where CFOs actually look first in a filing"}
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#B9B9E8", display: "flex", gap: "10px" }}>
                    <span style={{ color: "#6262e9", fontWeight: "700" }}>
                      {"✓"}
                    </span>
                    {"The three numbers that reframe your whole pitch"}
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#B9B9E8", display: "flex", gap: "10px" }}>
                    <span style={{ color: "#6262e9", fontWeight: "700" }}>
                      {"✓"}
                    </span>
                    {"No signup, no seat limit — starts when you press play"}
                  </div>
                </div>
                <div style={{ marginTop: "auto" }}>
                  <a className="wzh1" href="https://www.whyzer.ai/financial-fluency" style={{ width: "100%", textDecoration: "none", border: "0", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: "#6262e9", color: "#fff", fontWeight: "700", fontSize: "16px", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 18px 40px -14px rgba(98,98,233,.75)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px" }}>
                      {"▶"}
                    </span>
                    {"Watch It Now — Free"}
                  </a>
                  <button className="wzh10" data-wz-exit="close" style={{ width: "100%", marginTop: "12px", border: "0", background: "transparent", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#8A8AA0", padding: "8px" }}>
                    {"Not now"}
                  </button>
                </div>
              </div>
              <div className="wz-exit-aside" style={{ position: "relative", background: "#07070F", backgroundImage: "radial-gradient(ellipse 420px 320px at 22% 88%, rgba(99,73,198,.55), transparent 66%), radial-gradient(ellipse 340px 280px at 92% 6%, rgba(22,105,143,.5), transparent 66%)", padding: "30px 30px 26px", minHeight: "0", display: "flex", flexDirection: "column", justifyContent: "center", gap: "14px" }}>
                <a className="wzh11" href="https://www.whyzer.ai/financial-fluency" style={{ display: "block", position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 34px 64px -26px rgba(0,0,0,.85)", aspectRatio: "16/10", background: "linear-gradient(150deg,#2A2352,#0F1230)", cursor: "pointer", transition: "transform .35s ease" }}>
                  <img src="/exit-session-preview.png" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left", opacity: ".34" }} />
                  <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(7,7,15,.25), rgba(7,7,15,.82))" }}></div>
                  <div style={{ position: "absolute", top: "14px", left: "14px", display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "10px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", background: "rgba(179,65,63,.9)", padding: "5px 10px", borderRadius: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff", animation: "wzPulse 2.2s ease-out infinite" }}></span>
                    {"Live anytime"}
                  </div>
                  <div style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "relative", width: "74px", height: "74px", borderRadius: "50%", background: "rgba(255,255,255,.96)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px -14px rgba(0,0,0,.8)" }}>
                      <span style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.35)", animation: "wzPulse 2.4s ease-out infinite" }}></span>
                      <span style={{ color: "#14141F", fontSize: "21px", marginLeft: "4px" }}>
                        {"▶"}
                      </span>
                    </div>
                  </div>
                  <div style={{ position: "absolute", left: "14px", right: "14px", bottom: "12px" }}>
                    <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
                      {"Financial Fluency for Sellers — full session"}
                    </div>
                    <div style={{ height: "4px", borderRadius: "100px", background: "rgba(255,255,255,.22)", overflow: "hidden" }}>
                      <div style={{ width: "0%", height: "100%", background: "#6262e9" }}></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#C9C6FF", marginTop: "6px" }}>
                      <span>
                        {"0:00"}
                      </span>
                      <span>
                        {"20:14"}
                      </span>
                    </div>
                  </div>
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src="/jr_headshot.webp" alt="" width={38} height={38} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#fff", fontSize: "14px" }}>
                      {"Jamal Reimer"}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#8F8FD0" }}>
                      {"$160M+ closed · author of Mega Deal Secrets"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "11.5px", color: "#8F8FD0", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "14px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#33D69F" }}></span>
                  {"4,100+ sellers have watched it "}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

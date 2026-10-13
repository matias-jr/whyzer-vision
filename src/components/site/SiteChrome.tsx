// Shared site chrome in the v8 design: the navbar and footer used on every page outside the home page.
// (The home page carries its own copy inside HomeV8View.tsx.)
import { useEffect, useRef } from 'react';
import { useUtmParams } from '@/hooks/useUtmParams';
import './site-chrome.css';

export const SiteNav = () => {
  const ref = useRef<HTMLElement>(null);

  // Mobile menu + "Log In" dropdown (same behaviour as the home page).
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const closeDd = (except?: Element | null) =>
      nav.querySelectorAll('.wz-dd-open').forEach((w) => {
        if (w !== except) {
          w.classList.remove('wz-dd-open');
          w.querySelector('[data-wz-dd]')?.setAttribute('aria-expanded', 'false');
        }
      });
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      const burger = t.closest('[data-wz-menu]');
      if (burger) {
        const open = nav.classList.toggle('wz-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        return;
      }
      if (t.closest('.wz-nav-links a')) nav.classList.remove('wz-open');
      const dd = t.closest('[data-wz-dd]');
      closeDd(dd?.parentElement);
      if (dd?.parentElement) {
        const open = dd.parentElement.classList.toggle('wz-dd-open');
        dd.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    };
    const onDoc = (e: MouseEvent) => { if (!nav.contains(e.target as Node)) closeDd(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDd(); };
    nav.addEventListener('click', onClick);
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      nav.removeEventListener('click', onClick);
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
  <nav ref={ref} className="wz-nav" style={{ position: "sticky", top: "0", zIndex: "60", background: "rgba(9,17,39,.72)", backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
    <div className="wz-nav-in" style={{ maxWidth: "1160px", margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
      <a href="https://www.whyzer.ai" target="_top" style={{ display: "flex", alignItems: "center" }}>
        <img src="/home-v8/whyzer-logo-white.png" alt="Whyzer" style={{ height: "26px", width: "auto" }} />
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div className="wz-nav-links" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="/#tour" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
            {"Product tour"}
          </a>
          <a href="/#features" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
            {"Features"}
          </a>
          <a href="/#pricing" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
            {"Pricing"}
          </a>
          <a href="/#value" style={{ color: "#C7C7EB", fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
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
        <a className="wz-nav-cta wzh1" href="/#pricing-monthly" style={{ background: "#6262e9", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", boxShadow: "0 8px 22px -10px rgba(98,98,233,.9)" }}>
          {"Try Whyzer for Free"}
        </a>
        <button className="wz-burger" data-wz-menu="1" aria-label="Toggle menu" aria-expanded="false" style={{ display: "none", width: "40px", height: "40px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: "18px", cursor: "pointer", alignItems: "center", justifyContent: "center" }}>
          {"☰"}
        </button>
      </div>
    </div>
  </nav>
  );
};

export const SiteFooter = () => {
  const appendUtm = useUtmParams();
  return (
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
          <a href="/#features" style={{ color: "#55556B" }}>
            {"Features"}
          </a>
          <a href="/#tour" style={{ color: "#55556B" }}>
            {"How It Works"}
          </a>
          <a href="/#elite" style={{ color: "#55556B" }}>
            {"The Vault"}
          </a>
          <a href="/#pricing" style={{ color: "#55556B" }}>
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
          <a href="/#faq" style={{ color: "#55556B" }}>
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
      {new Date().getFullYear()}
      {" Whyzer.ai · All rights reserved"}
    </div>
  </footer>
  );
};

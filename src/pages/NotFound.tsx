import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SitePage from "@/components/site/SitePage";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SitePage>
      <main className="wzsite-narrow" style={{ textAlign: "center", paddingTop: 96 }}>
        <p className="wzsite-eyebrow">Error 404</p>
        <div
          aria-hidden="true"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            lineHeight: 1,
            fontSize: "clamp(120px, 22vw, 200px)",
            color: "transparent",
            WebkitTextStroke: "2px #D9D8EE",
            margin: "8px 0 24px",
            userSelect: "none",
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: 34, lineHeight: 1.15, marginBottom: 14 }}>This page doesn't have a POV.</h1>
        <p className="wzsite-p" style={{ maxWidth: 440, margin: "0 auto 32px" }}>
          The page you're looking for has moved, been removed, or never existed. Let's get you back to the boardroom.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/" className="wzsite-btn">Back to home →</a>
          <a href="https://app.whyzer.ai/" target="_top" className="wzsite-btn wzsite-btn--ghost">Open the app →</a>
          <a href="https://members.whyzer.ai/login" target="_top" className="wzsite-btn wzsite-btn--ghost">Members area →</a>
        </div>
      </main>
    </SitePage>
  );
};

export default NotFound;

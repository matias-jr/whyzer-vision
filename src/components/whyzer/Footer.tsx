const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'The Vault', href: '#vault' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Resources: [
    { label: 'Whyzer Academy', href: '#' },
    { label: 'Success Stories', href: '#' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Blog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: 'mailto:sales@whyzer.ai' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const Footer = () => (
  <footer className="border-t border-foreground/[0.06] py-16 px-6 lg:px-12 bg-background">
    <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
      <div className="col-span-2 md:col-span-1">
        <a href="#" className="inline-block mb-4">
          <img
            src="https://cdn.prod.website-files.com/680a71020a0f757d7ed55ed9/680a7fe0ebc42918cd0ce482_Group%2052.png"
            alt="Whyzer"
            className="h-7"
          />
        </a>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          AI-powered Point of View platform for elite B2B sellers.
        </p>
        <div className="flex gap-3">
          <a href="https://www.linkedin.com/company/whyzer-ai" className="text-text-tertiary hover:text-foreground transition-colors" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="#" className="text-text-tertiary hover:text-foreground transition-colors" aria-label="X / Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {Object.entries(footerLinks).map(([title, links]) => (
        <div key={title}>
          <h4 className="font-body text-foreground font-semibold text-sm mb-4">{title}</h4>
          <ul className="space-y-2.5">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-text-secondary text-sm hover:text-foreground transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-foreground/[0.06]">
      <p className="text-text-tertiary text-[13px]">© {new Date().getFullYear()} Whyzer.ai · All rights reserved</p>
    </div>
  </footer>
);

export default Footer;

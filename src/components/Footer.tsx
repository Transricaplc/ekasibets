import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
    product: [
      { label: "Sports Betting", href: "/live" },
      { label: "Live Betting", href: "/live" },
      { label: "Quick Games", href: "#" },
      { label: "Mobile App", href: "#" },
    ],
    company: [
      { label: t("nav_about"), href: "/about" },
      { label: t("nav_events"), href: "/events" },
      { label: t("nav_community"), href: "/community" },
      { label: "Careers", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Live Chat", href: "#" },
      { label: t("nav_wallet"), href: "/wallet" },
    ],
    legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: t("nav_responsible"), href: "/responsible-gaming" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* CTA Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="glass p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">{t("footer_cta_title")}</h3>
              <p className="text-muted-foreground">{t("footer_cta_sub")}</p>
            </div>
            <button className="btn-kasi py-4 px-8 flex items-center gap-2">
              {t("footer_cta_btn")}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-baseline mb-4">
              <span className="font-display text-xl gradient-text font-bold">e</span>
              <span className="font-display text-xl text-foreground font-bold">Kasi</span>
              <span className="font-display text-xl gradient-text font-bold">Bets</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{t("footer_brand_desc")}</p>
            <div className="flex gap-3">
              {["twitter", "instagram", "facebook", "tiktok"].map((social) => (
                <a key={social} href="#" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <span className="sr-only">{social}</span>
                  {social === "twitter" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                  {social === "instagram" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                  {social === "facebook" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>}
                  {social === "tiktok" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.13a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.56z"/></svg>}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{t("footer_product")}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{t("footer_company")}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{t("footer_support")}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{t("footer_legal")}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 pb-8 border-b border-border">
          <span className="text-sm text-muted-foreground">Download the app:</span>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors">
              <span className="text-lg">📱</span>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Get it on</p>
                <p className="text-sm font-bold text-foreground">Google Play</p>
              </div>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors">
              <span className="text-lg">🍎</span>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Download on the</p>
                <p className="text-sm font-bold text-foreground">App Store</p>
              </div>
            </button>
          </div>
        </div>

        {/* Compliance / Licence block */}
        <div className="rounded-xl border border-border bg-secondary/40 p-5 mb-6 text-xs text-muted-foreground space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-base text-foreground">18+ ONLY</span>
            <span>Operated by <strong className="text-foreground">Transrica PLC</strong></span>
            <span>Licensed by the Western Cape Gambling &amp; Racing Board (Bookmaker Licence — pending issue)</span>
          </div>
          <p>
            eKasibets offers sports and contingency betting only, in accordance with the National Gambling Act 7 of 2004.
            No casino, slots, poker, or interactive gambling are offered. Winning is never guaranteed.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Need help? National Responsible Gambling Programme:</span>
            <a href="tel:0800006008" className="text-success font-bold hover:underline">📞 0800 006 008</a>
            <Link to="/responsible-gaming" className="text-primary font-bold hover:underline">Self-exclusion &amp; deposit limits</Link>
          </p>
          <p className="opacity-70">POPIA &amp; FICA compliant. All amounts in ZAR. SAST timezone.</p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© {currentYear} {t("footer_copyright")} · Transrica PLC</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>🇿🇦</span>
            <span>{t("footer_made")}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-success text-success-foreground p-4 rounded-2xl shadow-lg hover:scale-110 transition-transform">
        <MessageCircle size={26} />
      </a>
    </footer>
  );
};

export default Footer;
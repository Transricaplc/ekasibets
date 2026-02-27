import { useState } from "react";
import { Menu, X, Zap, Search, Globe, ChevronDown, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/translations";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage, languages, flags } = useLanguage();

  const navItems = [
    { label: t("nav_sports"), href: "/#sports" },
    { label: t("nav_live"), href: "/live", hot: true },
    { label: t("nav_community"), href: "/community" },
    { label: t("nav_wallet"), href: "/wallet" },
    { label: t("nav_promos"), href: "/#promotions" },
    { label: t("nav_how"), href: "/#how-it-works" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0.5 flex-shrink-0">
            <span className="font-display text-2xl md:text-3xl gradient-text">e</span>
            <span className="font-display text-2xl md:text-3xl text-foreground">KASI</span>
            <span className="font-display text-2xl md:text-3xl gradient-text-gold">BETS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`relative px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                  location.pathname === item.href 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
                {item.hot && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-fire text-fire-foreground rounded uppercase">
                    Hot
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Search size={18} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 p-2 bg-card border-2 border-border rounded-xl shadow-lg animate-slide-up">
                  <input
                    type="text"
                    placeholder={t("nav_search_placeholder")}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Globe size={16} />
                <span className="text-xs uppercase">{language}</span>
                <ChevronDown size={14} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border-2 border-border rounded-xl shadow-lg animate-slide-up overflow-hidden">
                  {(Object.keys(languages) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        language === lang 
                          ? "bg-primary/10 text-primary font-bold" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <span>{flags[lang]}</span>
                      <span>{languages[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="btn-ghost text-xs py-2 px-4">
              {t("nav_signin")}
            </button>
            <button className="btn-kasi text-xs py-2 px-4 flex items-center gap-2">
              <Zap size={14} className="fill-current" />
              {t("nav_join")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Language */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe size={20} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-card border-2 border-border rounded-xl shadow-lg animate-slide-up overflow-hidden z-50">
                  {(Object.keys(languages) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${
                        language === lang ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span>{flags[lang]}</span>
                      <span>{languages[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t-2 border-border animate-slide-up">
            {/* Mobile Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder={t("nav_search_placeholder")}
                className="w-full px-4 py-3 bg-muted border-2 border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-bold uppercase tracking-wide py-3 px-4 rounded-lg flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  {item.hot && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-fire text-fire-foreground rounded uppercase">
                      Hot
                    </span>
                  )}
                </Link>
              ))}
              
              {/* Extra mobile nav items */}
              <Link
                to="/responsible-gaming"
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-bold uppercase tracking-wide py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav_responsible")}
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-bold uppercase tracking-wide py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav_about")}
              </Link>

              <div className="flex flex-col gap-2 pt-4 mt-2 border-t-2 border-border">
                <button className="btn-ghost py-3">{t("nav_signin")}</button>
                <button className="btn-kasi py-3 flex items-center justify-center gap-2">
                  <Zap size={18} className="fill-current" />
                  {t("nav_join")}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

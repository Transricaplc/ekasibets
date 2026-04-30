import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/translations";
import {
  Home, Trophy, Users, Wallet, Calendar, Shield, Info,
  Search, Zap, Radio, ChevronDown, Globe, X, Flame, Gift, Crown,
  Gamepad2, Dribbble, Swords, Timer, BarChart3, TrendingUp, Award
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AppSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const { t, language, setLanguage, languages, flags } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLangOpen, setIsLangOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const mainLinks = [
    { label: t("nav_home"), href: "/", icon: Home },
    { label: t("nav_live"), href: "/live", icon: Radio, badge: "Hot" },
  ];

  const betsSubItems = [
    { label: "⚽ PSL & Local Football", href: "/live?cat=football" },
    { label: "🏉 Rugby (URC)", href: "/live?cat=rugby" },
    { label: "🏏 Cricket (CSA)", href: "/live?cat=cricket" },
    { label: "🎭 Cultural Bets", href: "/live?cat=cultural" },
    { label: "🌦️ Daily Lifestyle", href: "/live?cat=lifestyle" },
    { label: "🎮 eSports", href: "/live?cat=esports" },
    { label: "🎰 Quick Games", href: "/live?cat=quick" },
  ];

  const timetableSubItems = [
    { label: "⚽ PSL Betway Premiership", href: "/timetables?sport=psl" },
    { label: "🏉 Vodacom URC Rugby", href: "/timetables?sport=urc" },
    { label: "🏏 CSA Cricket", href: "/timetables?sport=cricket" },
    { label: "🏇 Horse Racing", href: "/timetables?sport=horses" },
    { label: "📅 All Fixtures", href: "/timetables" },
  ];

  const bottomLinks = [
    { label: t("nav_community"), href: "/community", icon: Users },
    { label: "Leaderboards", href: "/leaderboards", icon: Crown },
    { label: "Promotions", href: "/promotions", icon: Gift, badge: "Bonus" },
    { label: t("nav_wallet"), href: "/wallet", icon: Wallet },
    { label: t("nav_events"), href: "/events", icon: Calendar, badge: "New" },
    { label: t("nav_responsible"), href: "/responsible-gaming", icon: Shield },
    { label: t("nav_about"), href: "/about", icon: Info },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 bg-sidebar border-r border-sidebar-border 
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo & Close */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-0.5" onClick={onClose}>
            <span className="font-display text-2xl gradient-text">e</span>
            <span className="font-display text-2xl text-sidebar-foreground">KASI</span>
            <span className="font-display text-2xl gradient-text">BETS</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder={t("nav_search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-sidebar-accent border border-sidebar-border rounded-lg text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sidebar-primary"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-2 pb-4">
          {/* Top links */}
          {mainLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide mb-0.5 transition-colors ${
                isActive(item.href)
                  ? "bg-sidebar-primary/15 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-fire text-fire-foreground rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Accordion Sections */}
          <Accordion type="multiple" className="mt-1">
            {/* Bets & Markets */}
            <AccordionItem value="bets" className="border-none">
              <AccordionTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:no-underline [&[data-state=open]]:text-sidebar-primary">
                <div className="flex items-center gap-3">
                  <Trophy size={18} />
                  <span>Bets & Markets</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-6 pb-1">
                {betsSubItems.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.href}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    {sub.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Sports Timetables */}
            <AccordionItem value="timetables" className="border-none">
              <AccordionTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:no-underline [&[data-state=open]]:text-sidebar-primary">
                <div className="flex items-center gap-3">
                  <Timer size={18} />
                  <span>Timetables</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-6 pb-1">
                {timetableSubItems.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.href}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    {sub.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Bottom links */}
          <div className="mt-1">
            {bottomLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide mb-0.5 transition-colors ${
                  isActive(item.href)
                    ? "bg-sidebar-primary/15 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="mt-4 px-3">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Globe size={16} />
              <span className="uppercase font-bold text-xs">{language}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>
            {isLangOpen && (
              <div className="mt-1 rounded-lg border border-sidebar-border overflow-hidden">
                {(Object.keys(languages) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      language === lang
                        ? "bg-sidebar-primary/15 text-sidebar-primary font-bold"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                    }`}
                  >
                    <span>{flags[lang]}</span>
                    <span>{languages[lang]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 px-3 space-y-2">
            <button className="w-full btn-ghost text-xs py-2.5">{t("nav_signin")}</button>
            <button className="w-full btn-kasi text-xs py-2.5 flex items-center justify-center gap-2">
              <Zap size={14} className="fill-current" />
              {t("nav_join")}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;

import { Menu, Zap, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const TopBar = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur-xl flex items-center px-4 gap-4 lg:pl-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Mobile logo */}
      <Link to="/" className="lg:hidden flex items-center gap-0.5">
        <span className="font-display text-xl gradient-text">e</span>
        <span className="font-display text-xl text-foreground">KASI</span>
        <span className="font-display text-xl gradient-text">BETS</span>
      </Link>

      <div className="flex-1" />

      {/* Quick actions */}
      <Link
        to="/live"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fire/10 text-fire text-xs font-bold uppercase"
      >
        <Radio size={12} className="animate-pulse" />
        Live
      </Link>

      <button className="hidden sm:block btn-ghost text-xs py-1.5 px-3">{t("nav_signin")}</button>
      <button className="btn-kasi text-xs py-1.5 px-3 flex items-center gap-1.5">
        <Zap size={12} className="fill-current" />
        {t("nav_join")}
      </button>
    </header>
  );
};

export default TopBar;

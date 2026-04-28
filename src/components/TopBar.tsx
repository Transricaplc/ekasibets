import { Menu, Zap, Radio, LogOut, User as UserIcon, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initial = (user?.email?.[0] ?? "U").toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur-xl flex items-center px-4 gap-4 lg:pl-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
      >
        <Menu size={22} />
      </button>

      <Link to="/" className="lg:hidden flex items-center gap-0.5">
        <span className="font-display text-xl gradient-text">e</span>
        <span className="font-display text-xl text-foreground">KASI</span>
        <span className="font-display text-xl gradient-text">BETS</span>
      </Link>

      <div className="flex-1" />

      <Link
        to="/live"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fire/10 text-fire text-xs font-bold uppercase"
      >
        <Radio size={12} className="animate-pulse" />
        Live
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center hover:opacity-90 transition-opacity">
            {initial}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className="cursor-pointer">
                <LayoutDashboard size={14} className="mr-2" /> Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/wallet" className="cursor-pointer">
                <UserIcon size={14} className="mr-2" /> Wallet
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="cursor-pointer">
                  <ShieldCheck size={14} className="mr-2" /> Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
              <LogOut size={14} className="mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link to="/auth" className="hidden sm:block btn-ghost text-xs py-1.5 px-3">
            {t("nav_signin")}
          </Link>
          <Link to="/auth?mode=signup" className="btn-kasi text-xs py-1.5 px-3 flex items-center gap-1.5">
            <Zap size={12} className="fill-current" />
            {t("nav_join")}
          </Link>
        </>
      )}
    </header>
  );
};

export default TopBar;

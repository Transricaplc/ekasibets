import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Sports", href: "/#sports" },
    { label: "Live", href: "/live", hot: true },
    { label: "Promos", href: "/#promotions" },
    { label: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0.5">
            <span className="font-display text-2xl md:text-3xl gradient-text">e</span>
            <span className="font-display text-2xl md:text-3xl text-foreground">KASI</span>
            <span className="font-display text-2xl md:text-3xl gradient-text-gold">BETS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${
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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button className="btn-ghost text-sm py-2.5 px-5">
              Sign In
            </button>
            <button className="btn-kasi text-sm py-2.5 px-5 flex items-center gap-2">
              <Zap size={16} className="fill-current" />
              Join Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-border animate-slide-up">
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
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t-2 border-border">
                <button className="btn-ghost py-3">Sign In</button>
                <button className="btn-kasi py-3 flex items-center justify-center gap-2">
                  <Zap size={18} className="fill-current" />
                  Join Now
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
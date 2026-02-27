import { ChevronLeft, ChevronRight, Play, Zap, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";
import phoneMockup from "@/assets/phone-mockup.png";

const stadiums = [
  { name: "FNB Stadium", city: "Johannesburg", emoji: "🏟️" },
  { name: "Moses Mabhida", city: "Durban", emoji: "⚽" },
  { name: "Orlando Stadium", city: "Soweto", emoji: "🔥" },
  { name: "Cape Town Stadium", city: "Mother City", emoji: "🌊" },
];

const liveFeed = [
  { user: "Thabo M.", location: "Soweto", amount: "R450", match: "Chiefs 2-1", emoji: "⚽" },
  { user: "Nomvula D.", location: "Alex", amount: "R1,200", match: "Pirates Win", emoji: "🏆" },
  { user: "Sipho K.", location: "Khayelitsha", amount: "R320", match: "Sundowns 3-0", emoji: "🔥" },
  { user: "Bongani T.", location: "Umlazi", amount: "R890", match: "eSports FIFA", emoji: "🎮" },
];

const quickBets = [
  { label: "⚽ PSL Derby", odds: "2.35", hot: true },
  { label: "🏇 Horse Racing", odds: "4.10", hot: false },
  { label: "🎮 FIFA eSports", odds: "1.85", hot: true },
  { label: "🎰 Spin & Win", odds: "∞", hot: false },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentFeed, setCurrentFeed] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stadiums.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeed((prev) => (prev + 1) % liveFeed.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % stadiums.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + stadiums.length) % stadiums.length);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pattern-overlay">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Township football" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-fire/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Panel */}
          <div className="animate-slide-up max-w-2xl">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire/15 border border-fire/30 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-fire"></span>
              </span>
              <span className="text-sm font-bold text-fire uppercase tracking-wide">{t("hero_live_badge")}</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-6">
              <span className="text-foreground">{t("hero_title_1")}</span>
              <br />
              <span className="gradient-text">{t("hero_title_2")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              {t("hero_subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="btn-kasi text-base flex items-center justify-center gap-2">
                <Zap size={20} className="fill-current" />
                {t("hero_cta_primary")}
              </button>
              <Link to="/live" className="btn-ghost text-base flex items-center justify-center gap-2">
                <Play size={18} className="fill-current" />
                {t("hero_cta_secondary")}
              </Link>
            </div>

            {/* Quick Bet Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {quickBets.map((bet, i) => (
                <Link
                  key={i}
                  to="/live"
                  className="group flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <span className="text-sm font-bold text-foreground">{bet.label}</span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{bet.odds}</span>
                  {bet.hot && <TrendingUp size={12} className="text-fire" />}
                </Link>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-display gradient-text">{t("hero_stat_winners")}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">{t("hero_stat_winners_label")}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-display gradient-text">{t("hero_stat_paid")}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">{t("hero_stat_paid_label")}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-display gradient-text-fire">{t("hero_stat_payout")}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">{t("hero_stat_payout_label")}</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Phone + Live Feed */}
          <div className="hidden lg:flex flex-col items-center gap-6">
            <div className="relative animate-float">
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-fire/10 to-primary/20 rounded-full blur-3xl" />
              <img src={phoneMockup} alt="eKasibets App" className="relative w-80 drop-shadow-2xl" />
              {/* Win notification */}
              <div className="absolute top-20 -right-4 glass px-5 py-3 animate-pulse-glow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">🎉</div>
                  <div>
                    <p className="text-sm font-bold text-foreground uppercase">{t("hero_won")}</p>
                    <p className="text-xs text-muted-foreground">Pirates vs Chiefs • 2.35</p>
                  </div>
                </div>
              </div>
              {/* Quick bet badge */}
              <div className="absolute bottom-24 -left-8 glass px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="text-sm font-bold text-primary">{t("hero_instant")}</span>
                </div>
              </div>
            </div>

            {/* Live Community Feed */}
            <div className="w-full max-w-sm glass p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-fire"></span>
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Wins</span>
              </div>
              <div className="overflow-hidden h-10">
                <div
                  className="transition-transform duration-500"
                  style={{ transform: `translateY(-${currentFeed * 40}px)` }}
                >
                  {liveFeed.map((item, i) => (
                    <div key={i} className="flex items-center justify-between h-10">
                      <div className="flex items-center gap-2">
                        <span>{item.emoji}</span>
                        <span className="text-sm font-bold text-foreground">{item.user}</span>
                        <span className="text-xs text-muted-foreground">• {item.location}</span>
                      </div>
                      <span className="text-sm font-bold gradient-text">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stadium Carousel */}
      <div className="absolute bottom-6 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="glass p-4 max-w-sm mx-auto lg:mx-0">
            <div className="flex items-center justify-between">
              <button onClick={prevSlide} className="p-2 hover:bg-primary/20 rounded-lg transition-colors">
                <ChevronLeft className="text-primary" size={20} />
              </button>
              <div className="text-center flex-1">
                <p className="text-xs text-fire font-bold uppercase tracking-wider mb-1">🔴 {t("hero_live_from")}</p>
                <p className="text-foreground font-bold text-sm flex items-center justify-center gap-2">
                  <span>{stadiums[currentSlide].emoji}</span>
                  {stadiums[currentSlide].name}
                </p>
                <p className="text-xs text-muted-foreground">{stadiums[currentSlide].city}</p>
              </div>
              <button onClick={nextSlide} className="p-2 hover:bg-primary/20 rounded-lg transition-colors">
                <ChevronRight className="text-primary" size={20} />
              </button>
            </div>
            <div className="flex gap-1.5 mt-3">
              {stadiums.map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full flex-1 transition-all ${idx === currentSlide ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
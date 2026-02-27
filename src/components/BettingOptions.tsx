import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const BettingOptions = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { t } = useLanguage();

  const bettingOptions = [
    { title: t("betting_local"), subtitle: t("betting_local_sub"), icon: "⚽", matches: "24 Live", gradient: "from-primary/20 to-primary/5", iconBg: "bg-primary/20" },
    { title: t("betting_intl"), subtitle: t("betting_intl_sub"), icon: "🌍", matches: "156 Live", gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/20" },
    { title: t("betting_esports"), subtitle: t("betting_esports_sub"), icon: "🎮", matches: "32 Live", gradient: "from-purple-500/20 to-purple-500/5", iconBg: "bg-purple-500/20" },
    { title: t("betting_quick"), subtitle: t("betting_quick_sub"), icon: "🎰", matches: "Always On", gradient: "from-accent/20 to-accent/5", iconBg: "bg-accent/20" },
  ];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section id="sports" className="section-padding">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-primary mb-2">{t("betting_label")}</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">{t("betting_title")}</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={`p-3 rounded-xl border border-border transition-all ${canScrollLeft ? "hover:bg-muted hover:border-muted-foreground/20" : "opacity-30 cursor-not-allowed"}`}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll("right")} disabled={!canScrollRight} className={`p-3 rounded-xl border border-border transition-all ${canScrollRight ? "hover:bg-muted hover:border-muted-foreground/20" : "opacity-30 cursor-not-allowed"}`}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} onScroll={checkScroll} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
          {bettingOptions.map((option, index) => (
            <Link key={index} to="/live" className={`card-premium min-w-[280px] md:min-w-[300px] snap-start flex-shrink-0 bg-gradient-to-br ${option.gradient} group`}>
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${option.iconBg} mb-5`}>
                <span className="text-2xl">{option.icon}</span>
              </div>
              <h3 className="font-display text-xl text-foreground mb-1">{option.title}</h3>
              <p className="text-muted-foreground text-sm mb-5">{option.subtitle}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">{option.matches}</span>
                <span className="text-muted-foreground group-hover:text-primary transition-colors"><ArrowRight size={18} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BettingOptions;

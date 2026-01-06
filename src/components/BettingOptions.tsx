import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

const bettingOptions = [
  {
    title: "Local Football",
    subtitle: "PSL & Kasi Tournaments",
    icon: "⚽",
    odds: "2.15",
    gradient: "from-primary to-primary/60",
  },
  {
    title: "International Sports",
    subtitle: "Premier League, La Liga & More",
    icon: "🌍",
    odds: "1.85",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    title: "eSports",
    subtitle: "FIFA, PUBG, LoL",
    icon: "🎮",
    odds: "3.20",
    gradient: "from-purple-600 to-purple-400",
  },
  {
    title: "Quick Games",
    subtitle: "Spin & Win Instantly",
    icon: "🎰",
    odds: "5.00",
    gradient: "from-accent to-yellow-400",
  },
];

const BettingOptions = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section id="sports" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">
              CHOOSE YOUR GAME
            </h2>
            <p className="text-muted-foreground">Local & global betting options</p>
          </div>
          
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border border-border transition-all ${
                canScrollLeft ? "hover:bg-muted" : "opacity-30"
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border border-border transition-all ${
                canScrollRight ? "hover:bg-muted" : "opacity-30"
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {bettingOptions.map((option, index) => (
            <div
              key={index}
              className="card-betting min-w-[280px] md:min-w-[300px] snap-start flex-shrink-0"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${option.gradient} mb-4`}>
                <span className="text-3xl">{option.icon}</span>
              </div>
              
              <h3 className="font-display text-2xl text-foreground mb-1">
                {option.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {option.subtitle}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Top Odds</p>
                  <p className="text-xl font-bold text-accent">{option.odds}</p>
                </div>
                <button className="btn-primary py-2 px-4 text-sm">
                  Bet Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BettingOptions;

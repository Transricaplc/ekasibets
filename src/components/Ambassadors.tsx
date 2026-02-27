import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const ambassadors = [
  { name: "DJ Maphorisa", role: "Amapiano King", tagline: "Bet on the beat!", emoji: "🎵", genre: "Amapiano" },
  { name: "Master KG", role: "Jerusalema Hitmaker", tagline: "Dance your way to wins!", emoji: "💃", genre: "Afro-House" },
  { name: "Kabza de Small", role: "Piano King", tagline: "Small bets, BIG wins!", emoji: "🎹", genre: "Amapiano" },
  { name: "DJ Tira", role: "Durban's Finest", tagline: "Durban vibes, winning times!", emoji: "🔊", genre: "Gqom" },
  { name: "MaWhoo", role: "Vocal Queen", tagline: "Sing your victory song!", emoji: "🎤", genre: "Amapiano" },
  { name: "Sjava", role: "Mzansi Storyteller", tagline: "Every bet tells a story!", emoji: "📖", genre: "Afro-Soul" },
  { name: "Tyler ICU", role: "Beat Architect", tagline: "Build your winning streak!", emoji: "🏗️", genre: "Amapiano" },
  { name: "Uncle Waffles", role: "Dance Floor Boss", tagline: "Waffle Bets — sweet wins!", emoji: "🧇", genre: "Amapiano" },
  { name: "Mr Thela", role: "Gqom Pioneer", tagline: "Heavy beats, heavy wins!", emoji: "🥁", genre: "Gqom" },
  { name: "Xduppy", role: "Rising Star", tagline: "Level up your bets!", emoji: "⭐", genre: "Amapiano" },
  { name: "Samthing Soweto", role: "Soweto's Voice", tagline: "Soweto spirit, global wins!", emoji: "🌍", genre: "Afro-Soul" },
  { name: "Scorpion Kings", role: "The Duo", tagline: "Double the fun, double the wins!", emoji: "👑", genre: "Amapiano" },
];

const Ambassadors = () => {
  const { t } = useLanguage();
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setScrollPos((prev) => (prev + 1) % ambassadors.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const next = () => setScrollPos((prev) => (prev + 1) % ambassadors.length);
  const prev = () => setScrollPos((prev) => (prev - 1 + ambassadors.length) % ambassadors.length);

  const getVisibleAmbassadors = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(ambassadors[(scrollPos + i) % ambassadors.length]);
    }
    return visible;
  };

  return (
    <section className="section-padding bg-card/50 border-y border-border overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Star size={14} className="text-primary fill-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("amb_label")}</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
            {t("amb_title_1")} <span className="gradient-text">{t("amb_title_2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("amb_subtitle")}</p>
        </div>

        {/* Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors hidden md:block">
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors hidden md:block">
            <ChevronRight size={20} className="text-foreground" />
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:px-12">
            {getVisibleAmbassadors().map((amb, i) => (
              <div
                key={`${amb.name}-${i}`}
                className="ambassador-card group cursor-pointer"
              >
                {/* Avatar placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 via-card to-fire/10 flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl">{amb.emoji}</span>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent h-1/2" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
                    <span className="text-[10px] font-bold text-primary uppercase">{amb.genre}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-display text-lg text-foreground">{amb.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{amb.role}</p>
                  <p className="text-sm font-bold gradient-text">"{amb.tagline}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {ambassadors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setScrollPos(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === scrollPos ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button className="btn-kasi text-sm py-3 px-6">
            {t("amb_cta")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Ambassadors;
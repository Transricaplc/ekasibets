import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import djMaphorisa from "@/assets/ambassadors/dj-maphorisa.jpg";
import masterKg from "@/assets/ambassadors/master-kg.jpg";
import kabzaDeSmall from "@/assets/ambassadors/kabza-de-small.jpg";
import djTira from "@/assets/ambassadors/dj-tira.jpg";
import mawhoo from "@/assets/ambassadors/mawhoo.jpg";
import sjava from "@/assets/ambassadors/sjava.jpg";
import samDeep from "@/assets/ambassadors/sam-deep.jpg";
import scottMaphuma from "@/assets/ambassadors/scott-maphuma.jpg";
import tylerIcu from "@/assets/ambassadors/tyler-icu.jpg";
import xduppy from "@/assets/ambassadors/xduppy.jpg";
import uncleWaffles from "@/assets/ambassadors/uncle-waffles.jpg";
import mrThela from "@/assets/ambassadors/mr-thela.png";

const ambassadors = [
  { name: "DJ Maphorisa", role: "Amapiano King", tagline: "Bet on the beat!", img: djMaphorisa, genre: "Amapiano" },
  { name: "Master KG", role: "Jerusalema Hitmaker", tagline: "Dance your way to wins!", img: masterKg, genre: "Afro-House" },
  { name: "Kabza de Small", role: "Piano King", tagline: "Small bets, BIG wins!", img: kabzaDeSmall, genre: "Amapiano" },
  { name: "DJ Tira", role: "Durban's Finest", tagline: "Durban vibes, winning times!", img: djTira, genre: "Gqom" },
  { name: "MaWhoo", role: "Vocal Queen", tagline: "Sing your victory song!", img: mawhoo, genre: "Amapiano" },
  { name: "Sjava", role: "Mzansi Storyteller", tagline: "Every bet tells a story!", img: sjava, genre: "Afro-Soul" },
  { name: "Sam Deep", role: "Deep House Maestro", tagline: "Go deep, win big!", img: samDeep, genre: "Amapiano" },
  { name: "Scott Maphuma", role: "The Entertainer", tagline: "Entertain your wallet!", img: scottMaphuma, genre: "Hip-Hop" },
  { name: "Tyler ICU", role: "Beat Architect", tagline: "Build your winning streak!", img: tylerIcu, genre: "Amapiano" },
  { name: "Xduppy", role: "Rising Star", tagline: "Level up your bets!", img: xduppy, genre: "Amapiano" },
  { name: "Uncle Waffles", role: "Dance Floor Boss", tagline: "Waffle Bets — sweet wins!", img: uncleWaffles, genre: "Amapiano" },
  { name: "Mr Thela", role: "Gqom Pioneer", tagline: "Heavy beats, heavy wins!", img: mrThela, genre: "Gqom" },
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
              <div key={`${amb.name}-${i}`} className="ambassador-card group cursor-pointer">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={amb.img}
                    alt={amb.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary/80 border border-primary/30">
                    <span className="text-[10px] font-bold text-primary-foreground uppercase">{amb.genre}</span>
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

        <div className="text-center mt-8">
          <button className="btn-kasi text-sm py-3 px-6">{t("amb_cta")}</button>
        </div>
      </div>
    </section>
  );
};

export default Ambassadors;

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Gift, Trophy, Flame, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Promotions = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const promotions = [
    { icon: Gift, title: t("promo_welcome"), description: t("promo_welcome_desc"), cta: t("promo_claim"), gradient: "from-primary via-emerald-400 to-teal-400", bgGradient: "from-primary/20 to-transparent" },
    { icon: Trophy, title: t("promo_derby"), description: t("promo_derby_desc"), cta: t("promo_view"), gradient: "from-accent via-yellow-400 to-orange-400", bgGradient: "from-accent/20 to-transparent" },
    { icon: Flame, title: t("promo_cashback"), description: t("promo_cashback_desc"), cta: t("promo_learn"), gradient: "from-red-500 via-orange-500 to-yellow-400", bgGradient: "from-red-500/20 to-transparent" },
  ];

  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % promotions.length); }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % promotions.length);
  const prev = () => setCurrent((prev) => (prev - 1 + promotions.length) % promotions.length);

  return (
    <section id="promotions" className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary mb-3">{t("promo_label")}</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">{t("promo_title")}</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
              {promotions.map((promo, index) => (
                <div key={index} className={`min-w-full p-8 md:p-12 bg-gradient-to-br ${promo.bgGradient} border border-border/50 backdrop-blur-xl`}>
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${promo.gradient} flex items-center justify-center`}>
                      <promo.icon className="text-white" size={32} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">{promo.title}</h3>
                      <p className="text-muted-foreground">{promo.description}</p>
                    </div>
                    <button className="btn-kasi flex-shrink-0 py-3 px-6 flex items-center gap-2">
                      {promo.cta}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl glass hover:bg-muted/50 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl glass hover:bg-muted/50 transition-colors">
            <ChevronRight size={22} />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {promotions.map((_, idx) => (
              <button key={idx} onClick={() => setCurrent(idx)} className={`h-1.5 rounded-full transition-all ${idx === current ? "bg-primary w-8" : "bg-muted-foreground/30 w-1.5"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promotions;

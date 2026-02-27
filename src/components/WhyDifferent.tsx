import { MapPin, Zap, Users, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const WhyDifferent = () => {
  const { t } = useLanguage();

  const features = [
    { icon: MapPin, title: t("why_built"), description: t("why_built_desc") },
    { icon: Zap, title: t("why_fast"), description: t("why_fast_desc") },
    { icon: Users, title: t("why_community"), description: t("why_community_desc") },
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-sm font-medium text-primary mb-3">{t("why_label")}</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">{t("why_title")}</h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">{t("why_subtitle")}</p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="group flex gap-4 p-5 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      {feature.title}
                      <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <p className="text-4xl md:text-5xl font-display gradient-text-gold mb-2">50K+</p>
              <p className="text-muted-foreground text-sm">{t("why_active")}</p>
            </div>
            <div className="stat-card">
              <p className="text-4xl md:text-5xl font-display gradient-text mb-2">R2M+</p>
              <p className="text-muted-foreground text-sm">{t("why_paid")}</p>
            </div>
            <div className="stat-card col-span-2">
              <p className="text-4xl md:text-5xl font-display text-foreground mb-2">100+</p>
              <p className="text-muted-foreground text-sm">{t("why_leagues")}</p>
            </div>
            <div className="stat-card col-span-2 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-display text-foreground">{t("why_ready")}</p>
                  <p className="text-sm text-muted-foreground">{t("why_join_cta")}</p>
                </div>
                <button className="btn-kasi py-3 px-6">{t("why_get_started")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferent;

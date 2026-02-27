import { AlertCircle, Clock, HeartHandshake, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const ResponsibleBetting = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 border-y border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6">
            <AlertCircle size={16} />
            <span className="text-sm font-semibold">{t("resp_badge")}</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">{t("resp_title")}</h2>
          <p className="text-muted-foreground mb-8">{t("resp_subtitle")}</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="glass p-5 text-center">
              <AlertCircle className="text-primary mx-auto mb-3" size={28} />
              <p className="text-sm text-muted-foreground">{t("resp_limits")}</p>
            </div>
            <div className="glass p-5 text-center">
              <Clock className="text-primary mx-auto mb-3" size={28} />
              <p className="text-sm text-muted-foreground">{t("resp_breaks")}</p>
            </div>
            <div className="glass p-5 text-center">
              <HeartHandshake className="text-primary mx-auto mb-3" size={28} />
              <p className="text-sm text-muted-foreground">{t("resp_support")}</p>
            </div>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
            {t("resp_learn")}
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResponsibleBetting;

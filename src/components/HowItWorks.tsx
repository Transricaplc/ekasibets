import { UserPlus, Target, Wallet, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: UserPlus, step: "01", title: t("how_step1"), description: t("how_step1_desc") },
    { icon: Target, step: "02", title: t("how_step2"), description: t("how_step2_desc") },
    { icon: Wallet, step: "03", title: t("how_step3"), description: t("how_step3_desc") },
  ];

  return (
    <section id="how-it-works" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-3">{t("how_label")}</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">{t("how_title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("how_subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-gradient-to-r from-border via-primary/30 to-border" />
              )}
              <div className="card-premium relative z-10 p-7 text-center h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="text-primary" size={28} />
                </div>
                <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
                  Step {step.step}
                </span>
                <h3 className="font-display text-xl text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="btn-gold text-base py-4 px-10 inline-flex items-center gap-2">
            {t("how_cta")}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import { Shield, Lock, Zap, Smartphone } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const TrustBar = () => {
  const { t } = useLanguage();

  const trustItems = [
    { icon: Shield, label: t("trust_licensed"), description: t("trust_licensed_desc") },
    { icon: Lock, label: t("trust_security"), description: t("trust_security_desc") },
    { icon: Zap, label: t("trust_withdrawals"), description: t("trust_withdrawals_desc") },
    { icon: Smartphone, label: t("trust_mobile"), description: t("trust_mobile_desc") },
  ];

  return (
    <section className="relative py-12 border-y border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-icon text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                <item.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-foreground font-semibold text-sm">{item.label}</h3>
              <p className="text-muted-foreground text-xs mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;

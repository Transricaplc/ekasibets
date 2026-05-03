import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { AlertCircle, Clock, HeartHandshake, Shield, Phone, BookOpen, BarChart3, Target } from "lucide-react";
import ResponsibleLimitsForm from "@/components/ResponsibleLimitsForm";
import PgsiSelfTest from "@/components/PgsiSelfTest";

const tools = [
  { icon: Target, title: "Deposit Limits", desc: "Set daily, weekly, or monthly limits on how much you can deposit. Stay in control of your spending." },
  { icon: Clock, title: "Time-Out Periods", desc: "Take a break from betting for 24 hours, 7 days, or 30 days. Your account will be temporarily suspended." },
  { icon: BarChart3, title: "Activity Monitor", desc: "Track your betting patterns. See how much you've spent vs won, and get alerts when patterns change." },
  { icon: Shield, title: "Self-Exclusion", desc: "If you need a longer break, exclude yourself for 6 months or more. We'll help you through it." },
];

const resources = [
  { title: "Betting Without Affecting Lobola Savings", desc: "Learn how to set proper budgets so your betting doesn't impact important life milestones.", emoji: "💰" },
  { title: "Signs You May Need Help", desc: "Recognizing problem gambling early. Take our quick quiz to check your betting health.", emoji: "⚠️" },
  { title: "Free Counseling Services", desc: "Connect with local counselors who understand township life. Confidential and free of charge.", emoji: "🤝" },
  { title: "Community Support Groups", desc: "Join local support groups in your area. You're never alone in this journey.", emoji: "👥" },
];

const ResponsibleGamingPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6">
              <AlertCircle size={16} />
              <span className="text-sm font-semibold">{t("resp_badge")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">{t("resp_title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("resp_subtitle")}</p>
          </div>

          {/* Live limits manager */}
          <div className="mb-12">
            <ResponsibleLimitsForm />
          </div>

          {/* PGSI self-test */}
          <div className="mb-12">
            <PgsiSelfTest />
          </div>

          {/* Tools */}
          <h2 className="font-display text-2xl text-foreground mb-6">YOUR SAFETY TOOLS</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {tools.map((tool, i) => (
              <div key={i} className="card-kasi p-6 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <tool.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Hub */}
          <h2 className="font-display text-2xl text-foreground mb-6">📚 EDUCATIONAL HUB</h2>
          <div className="space-y-4 mb-16">
            {resources.map((res, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-muted/30 border border-border/50 rounded-xl hover:border-primary/30 transition-colors cursor-pointer">
                <span className="text-3xl">{res.emoji}</span>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{res.title}</h3>
                  <p className="text-sm text-muted-foreground">{res.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Help Line */}
          <div className="glass border-2 border-destructive/30 p-8 rounded-2xl text-center">
            <Phone className="mx-auto text-destructive mb-4" size={40} />
            <h2 className="font-display text-2xl text-foreground mb-2">NEED HELP? CALL NOW</h2>
            <p className="text-muted-foreground mb-4">Free, confidential, 24/7 support in multiple languages</p>
            <a href="tel:0800006008" className="text-3xl font-display gradient-text-fire hover:opacity-80 transition-opacity">
              0800 006 008
            </a>
            <p className="text-xs text-muted-foreground mt-2">National Responsible Gambling Programme</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResponsibleGamingPage;

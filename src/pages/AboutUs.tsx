import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { MapPin, Heart, Users, Trophy, Target, Zap } from "lucide-react";

const values = [
  { icon: MapPin, title: "Born in the Township", desc: "We started in the streets of Soweto. We know the kasi because we ARE the kasi." },
  { icon: Heart, title: "Community First", desc: "A portion of every bet goes back to grassroots football and township development." },
  { icon: Users, title: "Built by Us, for Us", desc: "Our team is 100% South African. We understand your needs because they're our needs too." },
  { icon: Trophy, title: "Fair Play Always", desc: "Licensed by the SA Gaming Board. Transparent odds, no hidden catches, ever." },
];

const timeline = [
  { year: "2022", event: "eKasibets idea born at a shisa nyama in Soweto", emoji: "💡" },
  { year: "2023", event: "Launched with 100 bettors from 3 townships", emoji: "🚀" },
  { year: "2024", event: "Hit 50,000 active users across Mzansi", emoji: "📈" },
  { year: "2025", event: "R2M+ paid out monthly, 100+ local leagues covered", emoji: "🏆" },
];

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kasi-green/10 border-2 border-kasi-green/30 rounded-full mb-6">
              <span className="text-sm font-bold text-kasi-green uppercase tracking-wide">🇿🇦 {t("nav_about")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">{t("about_title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("about_subtitle")}</p>
          </div>

          {/* Mission */}
          <div className="glass border-2 border-kasi-gold/30 p-8 md:p-12 rounded-2xl mb-16 text-center">
            <h2 className="font-display text-3xl text-foreground mb-4">OUR MISSION</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              To create a betting platform that truly represents the spirit of eKasi — 
              where every bettor feels at home, payouts are instant, and the community wins together. 
              We're not trying to be Betway or Hollywood Bets. <span className="text-primary font-bold">We're building something better — something ours.</span>
            </p>
          </div>

          {/* Values */}
          <h2 className="font-display text-2xl text-foreground mb-6">OUR VALUES</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {values.map((value, i) => (
              <div key={i} className="card-kasi p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <h2 className="font-display text-2xl text-foreground mb-6">OUR JOURNEY</h2>
          <div className="space-y-4 mb-16">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-5 bg-muted/30 border border-border/50 rounded-xl">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1">
                  <span className="text-sm font-bold text-primary">{item.year}</span>
                  <p className="text-foreground font-medium">{item.event}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "50K+", label: "Active Bettors" },
              { value: "R2M+", label: "Monthly Payouts" },
              { value: "100+", label: "Local Leagues" },
              { value: "~2min", label: "Avg Payout Time" },
            ].map((stat, i) => (
              <div key={i} className="stat-card text-center">
                <p className="text-3xl md:text-4xl font-display gradient-text-gold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;

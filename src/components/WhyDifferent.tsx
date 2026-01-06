import { MapPin, Zap, Users, ArrowRight } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Built for eKasi",
    description:
      "We understand township life. Bet on local derbies, support your community teams, feel the pride.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Payouts",
    description:
      "No waiting days. Get paid straight to your account within minutes, not hours.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We give back. Part of every bet supports local grassroots football development.",
  },
];

const WhyDifferent = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <div>
            <p className="text-sm font-medium text-primary mb-3">Why eKasibets</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              The Platform Built for You
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              We're not another generic betting app. We're your neighbors, your community, your winning partner — built from the ground up for South African bettors.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex gap-4 p-5 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      {feature.title}
                      <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <p className="text-4xl md:text-5xl font-display gradient-text-gold mb-2">50K+</p>
              <p className="text-muted-foreground text-sm">Active Bettors</p>
            </div>
            <div className="stat-card">
              <p className="text-4xl md:text-5xl font-display gradient-text mb-2">R2M+</p>
              <p className="text-muted-foreground text-sm">Paid Out Monthly</p>
            </div>
            <div className="stat-card col-span-2">
              <p className="text-4xl md:text-5xl font-display text-foreground mb-2">100+</p>
              <p className="text-muted-foreground text-sm">Local Leagues Covered</p>
            </div>
            <div className="stat-card col-span-2 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-display text-foreground">Ready to start?</p>
                  <p className="text-sm text-muted-foreground">Join 50,000+ winners today</p>
                </div>
                <button className="btn-premium py-3 px-6">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferent;
import { MapPin, Zap, Users } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Built for eKasi",
    description:
      "We understand township life. Bet on local derbies, support your community teams, and feel the pride.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Payouts",
    description:
      "No waiting days for your winnings. Get paid straight to your account within minutes.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We give back to local football. Part of every bet supports grassroots development.",
  },
];

const WhyDifferent = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              WHY <span className="gradient-text">EKASIBETS</span> IS DIFFERENT
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We're not just another betting platform. We're your neighbors, your community, your winning partner.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-5xl font-display text-accent mb-2">50K+</p>
              <p className="text-muted-foreground">Active Bettors</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-5xl font-display text-primary mb-2">R2M+</p>
              <p className="text-muted-foreground">Paid Out Monthly</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border col-span-2">
              <p className="text-5xl font-display text-foreground mb-2">100+</p>
              <p className="text-muted-foreground">Local Leagues Covered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferent;

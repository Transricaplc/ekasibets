import { Shield, Lock, Zap, Smartphone } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    label: "Licensed & Regulated",
    description: "SA Gaming Board",
  },
  {
    icon: Lock,
    label: "Bank-Level Security",
    description: "256-bit encryption",
  },
  {
    icon: Zap,
    label: "Instant Withdrawals",
    description: "Get paid in minutes",
  },
  {
    icon: Smartphone,
    label: "Mobile First",
    description: "Bet anywhere, anytime",
  },
];

const TrustBar = () => {
  return (
    <section className="bg-secondary border-y border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-icon text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                <item.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-foreground font-semibold text-sm md:text-base">
                {item.label}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;

import { Shield, Lock, Zap, Smartphone, CheckCircle } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    label: "Licensed & Regulated",
    description: "SA Gaming Board Approved",
  },
  {
    icon: Lock,
    label: "Bank-Grade Security",
    description: "256-bit SSL Encryption",
  },
  {
    icon: Zap,
    label: "Instant Withdrawals",
    description: "Get Paid in Minutes",
  },
  {
    icon: Smartphone,
    label: "Mobile Optimized",
    description: "Bet Anywhere, Anytime",
  },
];

const TrustBar = () => {
  return (
    <section className="relative py-12 border-y border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-icon text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                <item.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-foreground font-semibold text-sm">
                {item.label}
              </h3>
              <p className="text-muted-foreground text-xs mt-1">
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
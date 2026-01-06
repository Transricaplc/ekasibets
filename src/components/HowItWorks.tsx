import { UserPlus, Target, Wallet } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up",
    description: "Create your account in under 60 seconds. Just your number and you're in.",
  },
  {
    icon: Target,
    step: "02",
    title: "Place Your Bet",
    description: "Choose from local kasi games or international matches. Tap and bet.",
  },
  {
    icon: Wallet,
    step: "03",
    title: "Withdraw Instantly",
    description: "Won? Your money hits your account in minutes. No waiting, no hassle.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
          HOW IT <span className="gradient-text">WORKS</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Start winning in three simple steps. No complicated forms, no delays.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}
              
              <div className="relative z-10 bg-card border border-border rounded-2xl p-8 transition-all group-hover:border-primary group-hover:shadow-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="text-primary" size={32} />
                </div>
                
                <span className="inline-block text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                  STEP {step.step}
                </span>
                
                <h3 className="font-display text-2xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-gold text-lg">
          Start Betting Now
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;

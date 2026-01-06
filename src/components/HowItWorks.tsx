import { UserPlus, Target, Wallet, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up in under 60 seconds. Just your phone number and you're in — no complicated forms.",
  },
  {
    icon: Target,
    step: "02",
    title: "Place Your Bet",
    description: "Choose from local kasi games or international matches. Simple interface, tap and bet.",
  },
  {
    icon: Wallet,
    step: "03",
    title: "Get Paid Instantly",
    description: "Won? Your money hits your account in minutes. No waiting days, no excuses.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-3">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Start Winning in 3 Steps
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No complicated signup. No hidden fees. Just straightforward betting with instant payouts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
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
                
                <h3 className="font-display text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="btn-gold text-base py-4 px-10 inline-flex items-center gap-2">
            Start Betting Now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
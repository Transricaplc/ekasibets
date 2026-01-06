import { AlertCircle, Clock, HeartHandshake } from "lucide-react";

const ResponsibleBetting = () => {
  return (
    <section className="section-padding bg-secondary border-y border-border">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6">
            <AlertCircle size={18} />
            <span className="text-sm font-semibold">18+ Only</span>
          </div>

          <h2 className="font-display text-2xl md:text-4xl text-foreground mb-4">
            PLAY RESPONSIBLY
          </h2>
          <p className="text-muted-foreground mb-8">
            Betting should be fun. We're committed to helping you stay in control.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-4">
              <AlertCircle className="text-primary mb-3" size={32} />
              <p className="text-sm text-muted-foreground">Set deposit limits</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Clock className="text-primary mb-3" size={32} />
              <p className="text-sm text-muted-foreground">Take breaks anytime</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <HeartHandshake className="text-primary mb-3" size={32} />
              <p className="text-sm text-muted-foreground">Get support 24/7</p>
            </div>
          </div>

          <a
            href="#"
            className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
          >
            Learn about responsible betting →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResponsibleBetting;

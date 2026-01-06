import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Gift, Trophy, Flame } from "lucide-react";

const promotions = [
  {
    icon: Gift,
    title: "Welcome Bonus",
    description: "Get 100% match on your first deposit up to R1,000!",
    cta: "Claim Now",
    gradient: "from-primary via-emerald-500 to-teal-400",
  },
  {
    icon: Trophy,
    title: "Derby Day Specials",
    description: "Enhanced odds on all Orlando Pirates vs Kaizer Chiefs matches!",
    cta: "View Odds",
    gradient: "from-accent via-yellow-500 to-orange-400",
  },
  {
    icon: Flame,
    title: "Weekly Cashback",
    description: "10% cashback on losses every Monday. Keep playing!",
    cta: "Learn More",
    gradient: "from-red-500 via-orange-500 to-yellow-400",
  },
];

const Promotions = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % promotions.length);
  const prev = () => setCurrent((prev) => (prev - 1 + promotions.length) % promotions.length);

  return (
    <section id="promotions" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-foreground text-center mb-4">
          HOT <span className="gradient-text">PROMOTIONS</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Exclusive bonuses to boost your winnings
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* Slider */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {promotions.map((promo, index) => (
                <div
                  key={index}
                  className={`min-w-full p-8 md:p-12 bg-gradient-to-r ${promo.gradient}`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <promo.icon className="text-white" size={40} />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-display text-3xl md:text-4xl text-white mb-2">
                        {promo.title}
                      </h3>
                      <p className="text-white/80 text-lg">
                        {promo.description}
                      </p>
                    </div>
                    
                    <button className="flex-shrink-0 bg-white text-background font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform">
                      {promo.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="text-white" size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {promotions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === current ? "bg-accent w-8" : "bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promotions;

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import phoneMockup from "@/assets/phone-mockup.png";

const stadiums = [
  "FNB Stadium, Johannesburg",
  "Moses Mabhida, Durban",
  "Orlando Stadium, Soweto",
  "Cape Town Stadium",
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stadiums.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % stadiums.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + stadiums.length) % stadiums.length);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Township football"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Panel - Content */}
          <div className="animate-slide-up max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Live matches happening now</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              <span className="text-foreground">Bet Local.</span>
              <br />
              <span className="gradient-text">Win Local.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              South Africa's premium township betting platform — lightning-fast payouts, local games, and unmatched community pride.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="btn-premium text-base py-4 px-8">
                Start Betting Free
              </button>
              <Link to="/live" className="btn-ghost text-base py-4 px-8 flex items-center justify-center gap-2">
                <Play size={18} className="fill-current" />
                View Live Matches
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div>
                <p className="text-2xl md:text-3xl font-display text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-display gradient-text-gold">R2M+</p>
                <p className="text-sm text-muted-foreground">Paid Monthly</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-display text-foreground">~2min</p>
                <p className="text-sm text-muted-foreground">Avg Payout</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Phone Mockup */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="relative">
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl" />
              <img
                src={phoneMockup}
                alt="eKasibets App"
                className="relative w-72 drop-shadow-2xl"
              />
              {/* Notification Badge */}
              <div className="absolute top-16 -right-8 glass px-5 py-3 animate-pulse-glow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg">⚽</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">+R500 Won!</p>
                    <p className="text-xs text-muted-foreground">Kaizer Chiefs • 2.15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stadium Carousel - Bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="glass p-4 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center justify-between">
              <button
                onClick={prevSlide}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-muted-foreground" size={18} />
              </button>
              
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground mb-1">Now Streaming</p>
                <p className="text-foreground font-medium text-sm">{stadiums[currentSlide]}</p>
              </div>
              
              <button
                onClick={nextSlide}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <ChevronRight className="text-muted-foreground" size={18} />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {stadiums.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentSlide ? "bg-primary w-6" : "bg-muted-foreground/30 w-1"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
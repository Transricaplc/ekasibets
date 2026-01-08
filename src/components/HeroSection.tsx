import { ChevronLeft, ChevronRight, Play, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import phoneMockup from "@/assets/phone-mockup.png";

const stadiums = [
  { name: "FNB Stadium", city: "Johannesburg", emoji: "🏟️" },
  { name: "Moses Mabhida", city: "Durban", emoji: "⚽" },
  { name: "Orlando Stadium", city: "Soweto", emoji: "🔥" },
  { name: "Cape Town Stadium", city: "Mother City", emoji: "🌊" },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stadiums.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % stadiums.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + stadiums.length) % stadiums.length);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden pattern-overlay">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Township football"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        {/* Accent glow */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Panel */}
          <div className="animate-slide-up max-w-2xl">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-fire/20 border-2 border-fire/40 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-fire"></span>
              </span>
              <span className="text-sm font-bold text-fire uppercase tracking-wide">Live Matches Now!</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-6">
              <span className="text-foreground">Bet Local.</span>
              <br />
              <span className="gradient-text-gold">Win Big.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              South Africa's <span className="text-primary font-semibold">township-first</span> betting platform — 
              fast payouts, local games, community pride. Built for eKasi! 🇿🇦
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="btn-kasi text-base flex items-center justify-center gap-2">
                <Zap size={20} className="fill-current" />
                Start Winning Now
              </button>
              <Link to="/live" className="btn-ghost text-base flex items-center justify-center gap-2">
                <Play size={18} className="fill-current" />
                Live Matches
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-border">
              <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-display text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Winners</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-display gradient-text-gold">R2M+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Paid Out</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-display gradient-text">~2min</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Payout</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Phone */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 via-accent/20 to-fire/20 rounded-full blur-3xl" />
              <img
                src={phoneMockup}
                alt="eKasibets App"
                className="relative w-80 drop-shadow-2xl"
              />
              {/* Win notification */}
              <div className="absolute top-20 -right-4 glass px-5 py-3 animate-pulse-glow border-2 border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
                    🎉
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground uppercase">+R750 Won!</p>
                    <p className="text-xs text-muted-foreground">Pirates vs Chiefs • 2.35</p>
                  </div>
                </div>
              </div>
              {/* Quick bet badge */}
              <div className="absolute bottom-24 -left-8 glass px-4 py-2 border-2 border-accent/30">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="text-sm font-bold text-accent">Instant Bets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stadium Carousel */}
      <div className="absolute bottom-6 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="glass p-4 max-w-sm mx-auto lg:mx-0 border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <button
                onClick={prevSlide}
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-primary" size={20} />
              </button>
              
              <div className="text-center flex-1">
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">🔴 Live From</p>
                <p className="text-foreground font-bold text-sm flex items-center justify-center gap-2">
                  <span>{stadiums[currentSlide].emoji}</span>
                  {stadiums[currentSlide].name}
                </p>
                <p className="text-xs text-muted-foreground">{stadiums[currentSlide].city}</p>
              </div>
              
              <button
                onClick={nextSlide}
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <ChevronRight className="text-primary" size={20} />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="flex gap-1.5 mt-3">
              {stadiums.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full flex-1 transition-all ${
                    idx === currentSlide ? "bg-primary" : "bg-muted"
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
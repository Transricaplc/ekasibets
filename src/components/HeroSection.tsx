import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
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
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Panel - Content */}
          <div className="animate-slide-up">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-6">
              <span className="text-foreground">BET LOCAL.</span>
              <br />
              <span className="gradient-text">WIN LOCAL.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
              South Africa's township-first betting platform — fast payouts, local games, local pride.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="btn-gold text-lg">
                Register & Get Welcome Bonus
              </button>
              <button className="btn-outline-gold text-lg">
                How It Works
              </button>
            </div>

            {/* Stadium Carousel */}
            <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-4 max-w-md">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <ChevronLeft className="text-muted-foreground" size={20} />
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Now Showing</p>
                  <p className="text-foreground font-medium">{stadiums[currentSlide]}</p>
                </div>
                
                <button
                  onClick={nextSlide}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <ChevronRight className="text-muted-foreground" size={20} />
                </button>
              </div>
              
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-3">
                {stadiums.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSlide ? "bg-accent w-6" : "bg-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Phone Mockup */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="relative">
              <img
                src={phoneMockup}
                alt="eKasibets App"
                className="w-80 drop-shadow-2xl"
              />
              {/* Notification Badge */}
              <div className="absolute top-20 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-pulse-glow">
                <p className="text-sm font-bold">+R500 Payout!</p>
                <p className="text-xs opacity-80">Instant withdrawal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

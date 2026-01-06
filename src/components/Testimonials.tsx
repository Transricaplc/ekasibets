import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

const testimonials = [
  {
    name: "Thabo M.",
    location: "Soweto",
    quote: "Finally a betting app that understands us! Fast payouts and I can bet on my local teams.",
    rating: 5,
  },
  {
    name: "Sipho K.",
    location: "Khayelitsha",
    quote: "Withdrew my winnings in under 5 minutes. eKasibets is the real deal, no cap!",
    rating: 5,
  },
  {
    name: "Nomvula D.",
    location: "Alexandra",
    quote: "Love the kasi tournament odds. Supporting local football while making some cash!",
    rating: 5,
  },
  {
    name: "Bongani T.",
    location: "Umlazi",
    quote: "The welcome bonus got me started right. Been winning ever since!",
    rating: 4,
  },
];

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">
              WINNING <span className="gradient-text">STORIES</span>
            </h2>
            <p className="text-muted-foreground">Real people, real wins</p>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-betting min-w-[300px] md:min-w-[350px] snap-start flex-shrink-0"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? "text-accent fill-accent" : "text-muted"}
                  />
                ))}
              </div>

              <p className="text-foreground text-lg mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

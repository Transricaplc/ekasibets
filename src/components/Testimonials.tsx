import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const testimonials = [
  { name: "Thabo M.", location: "Soweto", quote: "Finally a betting app that understands us! Fast payouts and I can bet on my local teams. This is the one.", rating: 5, avatar: "TM" },
  { name: "Sipho K.", location: "Khayelitsha", quote: "Withdrew my winnings in under 5 minutes. eKasibets is the real deal, no cap! Been using it for 3 months now.", rating: 5, avatar: "SK" },
  { name: "Nomvula D.", location: "Alexandra", quote: "Love the kasi tournament odds. Supporting local football while making some cash — can't beat that!", rating: 5, avatar: "ND" },
  { name: "Bongani T.", location: "Umlazi", quote: "The welcome bonus got me started right. Been winning ever since. Customer support is also top notch.", rating: 4, avatar: "BT" },
];

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -360 : 360, behavior: "smooth" });
    }
  };

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-primary mb-3">{t("test_label")}</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">{t("test_title")}</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll("left")} className="p-3 rounded-xl border border-border hover:bg-muted hover:border-muted-foreground/20 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll("right")} className="p-3 rounded-xl border border-border hover:bg-muted hover:border-muted-foreground/20 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-premium min-w-[320px] md:min-w-[380px] snap-start flex-shrink-0 p-6">
              <Quote className="text-primary/20 mb-4" size={32} />
              <p className="text-foreground leading-relaxed mb-6">"{testimonial.quote}"</p>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < testimonial.rating ? "text-accent fill-accent" : "text-muted"} />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
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

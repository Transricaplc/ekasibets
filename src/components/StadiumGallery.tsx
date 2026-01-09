import { useState } from "react";
import { X, Star, Flame, Trophy } from "lucide-react";

const stadiums = [
  {
    name: "FNB Stadium",
    nickname: "The Calabash",
    city: "Johannesburg",
    capacity: "94,736",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80",
    hotMatch: true,
  },
  {
    name: "Moses Mabhida",
    nickname: "The Arch",
    city: "Durban",
    capacity: "54,000",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
    hotMatch: false,
  },
  {
    name: "Orlando Stadium",
    nickname: "The Bullring",
    city: "Soweto",
    capacity: "40,000",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80",
    hotMatch: true,
  },
  {
    name: "Cape Town Stadium",
    nickname: "The Green Point",
    city: "Cape Town",
    capacity: "55,000",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&q=80",
    hotMatch: false,
  },
  {
    name: "Loftus Versfeld",
    nickname: "The Fortress",
    city: "Pretoria",
    capacity: "51,762",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80",
    hotMatch: true,
  },
  {
    name: "Ellis Park",
    nickname: "The Jungle",
    city: "Johannesburg",
    capacity: "62,567",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80",
    hotMatch: false,
  },
];

const StadiumGallery = () => {
  const [selectedStadium, setSelectedStadium] = useState<typeof stadiums[0] | null>(null);

  return (
    <section className="section-padding bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--kasi-green)_1px,_transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-kasi-orange/10 border-2 border-kasi-orange rounded-full mb-6">
            <Trophy className="w-4 h-4 text-kasi-orange" />
            <span className="font-bold text-kasi-orange text-sm tracking-wider">MZANSI'S FINEST</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
            WHERE THE <span className="text-kasi-green">MAGIC</span>
            <br />
            <span className="text-kasi-gold">HAPPENS</span>
          </h2>
          
          <p className="text-muted-foreground text-lg">
            Bet on matches from South Africa's greatest stadiums
          </p>
        </div>

        {/* Stadium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map((stadium, index) => (
            <div
              key={index}
              onClick={() => setSelectedStadium(stadium)}
              className="group relative cursor-pointer"
            >
              {/* Card */}
              <div className="relative bg-background border-4 border-border rounded-xl overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:border-kasi-green">
                {/* Hot Match Badge */}
                {stadium.hotMatch && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 bg-kasi-orange rounded-full animate-pulse">
                    <Flame className="w-3 h-3 text-background" />
                    <span className="text-xs font-bold text-background">HOT</span>
                  </div>
                )}
                
                {/* Image Container */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={stadium.image}
                    alt={stadium.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-display text-xl text-foreground group-hover:text-kasi-green transition-colors">
                        {stadium.name}
                      </h3>
                      <p className="text-sm text-kasi-gold italic">"{stadium.nickname}"</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-kasi-gold fill-kasi-gold" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{stadium.city}</span>
                    <span className="text-kasi-green font-bold">{stadium.capacity} seats</span>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-kasi-green via-kasi-gold to-kasi-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedStadium && (
        <div
          className="fixed inset-0 z-50 bg-background/98 flex items-center justify-center p-4"
          onClick={() => setSelectedStadium(null)}
        >
          <button
            onClick={() => setSelectedStadium(null)}
            className="absolute top-6 right-6 p-3 rounded-xl bg-card border-2 border-border hover:border-kasi-green transition-colors"
          >
            <X size={24} className="text-foreground" />
          </button>
          
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-2xl overflow-hidden border-4 border-kasi-green">
              <img
                src={selectedStadium.image.replace("w=600", "w=1200")}
                alt={selectedStadium.name}
                className="w-full max-h-[60vh] object-cover"
              />
              <div className="p-6 bg-background">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-3xl md:text-4xl text-foreground">{selectedStadium.name}</h3>
                  {selectedStadium.hotMatch && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-kasi-orange rounded-full">
                      <Flame className="w-4 h-4 text-background" />
                      <span className="text-sm font-bold text-background">LIVE MATCHES</span>
                    </span>
                  )}
                </div>
                <p className="text-kasi-gold text-xl italic mb-2">"{selectedStadium.nickname}"</p>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <span>{selectedStadium.city}, South Africa</span>
                  <span>•</span>
                  <span className="text-kasi-green font-bold">{selectedStadium.capacity} capacity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StadiumGallery;

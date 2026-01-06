import { useState } from "react";
import { X } from "lucide-react";

const stadiums = [
  {
    name: "FNB Stadium",
    city: "Johannesburg",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80",
  },
  {
    name: "Moses Mabhida",
    city: "Durban",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
  },
  {
    name: "Orlando Stadium",
    city: "Soweto",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80",
  },
  {
    name: "Cape Town Stadium",
    city: "Cape Town",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&q=80",
  },
  {
    name: "Loftus Versfeld",
    city: "Pretoria",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80",
  },
  {
    name: "Nelson Mandela Bay",
    city: "Port Elizabeth",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80",
  },
];

const StadiumGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
            WHERE THE <span className="gradient-text">MAGIC</span> HAPPENS
          </h2>
          <p className="text-muted-foreground">
            Bet on matches from South Africa's greatest stadiums
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stadiums.map((stadium, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(stadium.image)}
              className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={stadium.image}
                alt={stadium.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-xl text-foreground">
                  {stadium.name}
                </h3>
                <p className="text-sm text-muted-foreground">{stadium.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage.replace("w=600", "w=1200")}
            alt="Stadium"
            className="max-w-full max-h-[80vh] rounded-xl object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default StadiumGallery;

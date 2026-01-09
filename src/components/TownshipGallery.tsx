import { useState } from "react";
import { X, MapPin, Users, Trophy, Zap } from "lucide-react";

const townshipScenes = [
  {
    title: "Shisa Nyama Saturdays",
    location: "Soweto",
    vibe: "Where bets meet braai",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    accent: "kasi-gold",
  },
  {
    title: "Kasi Football Legends",
    location: "Alexandra",
    vibe: "Street football dreams",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80",
    accent: "kasi-green",
  },
  {
    title: "The Local Tavern",
    location: "Khayelitsha",
    vibe: "Community spirit lives here",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    accent: "kasi-orange",
  },
  {
    title: "Street Corner Vibes",
    location: "Mamelodi",
    vibe: "Where winners gather",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    accent: "kasi-green",
  },
  {
    title: "Match Day Energy",
    location: "Umlazi",
    vibe: "The roar of the crowd",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
    accent: "kasi-gold",
  },
  {
    title: "Victory Celebrations",
    location: "Tembisa",
    vibe: "We celebrate together",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80",
    accent: "kasi-orange",
  },
];

const stats = [
  { icon: Users, value: "500K+", label: "KASI BETTORS" },
  { icon: Trophy, value: "R50M+", label: "WON THIS YEAR" },
  { icon: Zap, value: "24/7", label: "LIVE ACTION" },
];

const TownshipGallery = () => {
  const [selectedScene, setSelectedScene] = useState<typeof townshipScenes[0] | null>(null);

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Township Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FF6A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-kasi-gold/10 border-2 border-kasi-gold rounded-full mb-6">
            <MapPin className="w-4 h-4 text-kasi-gold" />
            <span className="font-bold text-kasi-gold text-sm tracking-wider">STRAIGHT FROM THE KASI</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-4">
            THIS IS <span className="text-kasi-green">WHERE</span>
            <br />
            <span className="text-kasi-gold">LEGENDS</span> ARE MADE
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From the dusty streets to the big stadiums, we know where the real game is played
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-kasi-green to-kasi-gold rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-background" />
              </div>
              <div className="font-display text-3xl md:text-4xl text-foreground">{stat.value}</div>
              <div className="text-xs tracking-wider text-muted-foreground font-bold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Canvas Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {townshipScenes.map((scene, index) => (
            <div
              key={index}
              onClick={() => setSelectedScene(scene)}
              className={`group relative cursor-pointer transform transition-all duration-500 hover:-translate-y-2 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* Canvas Frame Effect */}
              <div className="absolute -inset-2 bg-gradient-to-br from-kasi-green via-kasi-gold to-kasi-orange rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              
              <div className={`relative bg-card border-4 border-border rounded-xl overflow-hidden ${
                index === 0 ? 'aspect-square md:aspect-[4/3]' : 'aspect-[4/3]'
              }`}>
                {/* Image */}
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
                
                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-${scene.accent} clip-corner opacity-90`} />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Location Tag */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full w-fit mb-3 border border-border">
                    <MapPin className="w-3 h-3 text-kasi-green" />
                    <span className="text-xs font-bold tracking-wider text-foreground">{scene.location}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-display text-2xl ${index === 0 ? 'md:text-4xl' : 'md:text-2xl'} text-foreground mb-2 transform transition-transform duration-300 group-hover:translate-x-2`}>
                    {scene.title}
                  </h3>
                  
                  {/* Vibe */}
                  <p className="text-muted-foreground text-sm italic">"{scene.vibe}"</p>
                </div>
                
                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-4 border-kasi-green opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-block p-1 bg-gradient-to-r from-kasi-green via-kasi-gold to-kasi-orange rounded-xl">
            <button className="px-8 py-4 bg-background font-display text-xl tracking-wide rounded-lg hover:bg-transparent hover:text-background transition-all duration-300">
              JOIN THE MOVEMENT 🔥
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedScene && (
        <div
          className="fixed inset-0 z-50 bg-background/98 flex items-center justify-center p-4"
          onClick={() => setSelectedScene(null)}
        >
          <button
            onClick={() => setSelectedScene(null)}
            className="absolute top-6 right-6 p-3 rounded-xl bg-card border-2 border-border hover:border-kasi-green transition-colors z-10"
          >
            <X size={24} className="text-foreground" />
          </button>
          
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-2xl overflow-hidden border-4 border-kasi-green">
              <img
                src={selectedScene.image.replace("w=600", "w=1200")}
                alt={selectedScene.title}
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background to-transparent">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-kasi-green/20 border border-kasi-green rounded-full mb-3">
                  <MapPin className="w-4 h-4 text-kasi-green" />
                  <span className="text-sm font-bold text-kasi-green">{selectedScene.location}</span>
                </div>
                <h3 className="font-display text-3xl md:text-5xl text-foreground mb-2">{selectedScene.title}</h3>
                <p className="text-muted-foreground text-lg italic">"{selectedScene.vibe}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TownshipGallery;

import Footer from "@/components/Footer";
import { Calendar, MapPin, Music, Ticket, Trophy, Filter, Search } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const allEvents = [
  { type: "festival", name: "Soweto Summer Fest", date: "March 22, 2026", location: "Soweto, Johannesburg", description: "Live music, braai bets, and on-site betting booths. Bet on best performer!", emoji: "🎉", featured: true },
  { type: "tour", name: "Kabza de Small Tour Stop", date: "March 15, 2026", location: "Johannesburg", description: "Bet on setlist surprises & win tour tickets!", emoji: "🎹", featured: false },
  { type: "tavern", name: "Kasi Tavern Challenge", date: "Every Friday", location: "Nationwide", description: "Trivia nights, pool tournaments — scan QR to enter, winners get ambassador meet-and-greets", emoji: "🍺", featured: false },
  { type: "festival", name: "Durban Beach Festival", date: "April 5, 2026", location: "Durban Beachfront", description: "Bet on best performer, crowd favorites & more", emoji: "🌊", featured: false },
  { type: "tour", name: "Uncle Waffles Dance Tour", date: "April 12, 2026", location: "Cape Town", description: "Waffle Bets live — dance challenge betting!", emoji: "🧇", featured: false },
  { type: "festival", name: "Khayelitsha Culture Fest", date: "May 1, 2026", location: "Khayelitsha, Cape Town", description: "Rural harvest bets, township art, cultural games", emoji: "🎨", featured: false },
  { type: "tour", name: "DJ Tira Gqom Tour", date: "May 15, 2026", location: "Durban", description: "Heavy beats, heavy wins — bet on crowd energy!", emoji: "🔊", featured: false },
  { type: "tavern", name: "PSL Watch Party", date: "Every Matchday", location: "Selected Taverns", description: "Free entry bets, shared viewing, live in-play wagers", emoji: "⚽", featured: false },
  { type: "festival", name: "Mamelodi Street Art Battle", date: "June 8, 2026", location: "Mamelodi, Pretoria", description: "Bet on art battles, street food competitions", emoji: "🎭", featured: false },
  { type: "tour", name: "Master KG World Tour SA Stop", date: "June 20, 2026", location: "FNB Stadium, Johannesburg", description: "Jerusalema vibes — bet on setlist & fan votes!", emoji: "💃", featured: true },
];

const EventsToursPage = () => {
  const { t } = useLanguage();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "festival": return "text-primary bg-primary/10 border-primary/30";
      case "tour": return "text-fire bg-fire/10 border-fire/30";
      case "tavern": return "text-success bg-success/10 border-success/30";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero */}
        <section className="section-padding pattern-overlay">
          <div className="container mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">
              {t("events_page_title_1")} <span className="gradient-text-fire">{t("events_page_title_2")}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">{t("events_page_subtitle")}</p>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["All", "Festivals", "Tours", "Tavern Challenges"].map((filter) => (
                <button key={filter} className={`px-4 py-2 rounded-lg text-sm font-bold uppercase ${filter === "All" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"} transition-colors`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="container mx-auto px-4 pb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {allEvents.filter(e => e.featured).map((event, i) => (
              <div key={i} className="card-kasi border-primary/30">
                <div className="aspect-video bg-gradient-to-br from-primary/15 via-card to-fire/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-7xl">{event.emoji}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase border mb-3 ${getTypeColor(event.type)}`}>
                  {event.type}
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">{event.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                </div>
                <button className="btn-kasi text-sm py-2.5 px-5">{t("events_cta")}</button>
              </div>
            ))}
          </div>
        </section>

        {/* All Events */}
        <section className="container mx-auto px-4 pb-16">
          <h2 className="font-display text-2xl text-foreground mb-6">{t("events_upcoming")}</h2>
          <div className="space-y-3">
            {allEvents.filter(e => !e.featured).map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors cursor-pointer group">
                <span className="text-3xl flex-shrink-0">{event.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground truncate">{event.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {event.location}</span>
                </div>
                <button className="btn-ghost text-xs py-1.5 px-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("events_bet")}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EventsToursPage;
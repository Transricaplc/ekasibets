import { Calendar, MapPin, Music, Ticket, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const upcomingEvents = [
  {
    type: "festival",
    name: "Soweto Summer Fest",
    date: "March 22, 2026",
    location: "Soweto, Johannesburg",
    description: "Live music, braai bets, and on-site betting booths",
    emoji: "🎉",
    highlight: true,
  },
  {
    type: "tour",
    name: "Kabza de Small Tour Stop",
    date: "March 15, 2026",
    location: "Johannesburg",
    description: "Bet on setlist surprises & win tour tickets!",
    emoji: "🎹",
    highlight: false,
  },
  {
    type: "tavern",
    name: "Kasi Tavern Challenge",
    date: "Every Friday",
    location: "Nationwide",
    description: "Trivia nights, pool tournaments — scan QR to enter",
    emoji: "🍺",
    highlight: false,
  },
  {
    type: "festival",
    name: "Durban Beach Festival",
    date: "April 5, 2026",
    location: "Durban Beachfront",
    description: "Bet on best performer, crowd favorites & more",
    emoji: "🌊",
    highlight: false,
  },
];

const EventsTours = () => {
  const { t } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case "festival": return <Music size={16} className="text-primary" />;
      case "tour": return <Ticket size={16} className="text-primary" />;
      case "tavern": return <Trophy size={16} className="text-primary" />;
      default: return <Calendar size={16} className="text-primary" />;
    }
  };

  return (
    <section className="section-padding pattern-overlay" id="events">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire/10 border border-fire/30 mb-4">
            <Calendar size={14} className="text-fire" />
            <span className="text-xs font-bold text-fire uppercase tracking-wider">{t("events_label")}</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
            {t("events_title_1")} <span className="gradient-text-fire">{t("events_title_2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("events_subtitle")}</p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {upcomingEvents.map((event, i) => (
            <div
              key={i}
              className={`card-kasi group cursor-pointer ${event.highlight ? "md:col-span-2 border-primary/30" : ""}`}
            >
              <div className={`flex ${event.highlight ? "md:flex-row" : "flex-col"} gap-4`}>
                {/* Event visual */}
                <div className={`${event.highlight ? "md:w-1/3" : "w-full"} aspect-video bg-gradient-to-br from-primary/10 via-card to-fire/10 rounded-lg flex items-center justify-center`}>
                  <span className="text-5xl">{event.emoji}</span>
                </div>

                <div className={`flex-1 ${event.highlight ? "py-2" : ""}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getIcon(event.type)}
                    <span className="text-xs font-bold text-primary uppercase">{event.type}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">{event.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {event.location}
                    </span>
                  </div>
                  {event.highlight && (
                    <button className="btn-kasi text-xs py-2 px-4 mt-4">
                      {t("events_cta")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center">
          <Link to="/events" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            {t("events_view_all")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsTours;
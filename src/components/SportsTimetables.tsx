import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Calendar, Filter, Zap } from "lucide-react";

type Sport = "psl" | "rugby" | "cricket";

const fixtures: Record<Sport, { date: string; competition: string; home: string; away: string; region: string; kickoff: string; homeOdds: number; drawOdds: number; awayOdds: number }[]> = {
  psl: [
    { date: "Feb 27", competition: "Betway Premiership", home: "Magesi FC", away: "Polokwane City", region: "Limpopo", kickoff: "15:00", homeOdds: 2.80, drawOdds: 3.10, awayOdds: 2.45 },
    { date: "Feb 27", competition: "Betway Premiership", home: "Stellenbosch FC", away: "AmaZulu", region: "W. Cape vs KZN", kickoff: "17:30", homeOdds: 2.20, drawOdds: 3.25, awayOdds: 3.10 },
    { date: "Feb 28", competition: "Betway Premiership", home: "Kaizer Chiefs", away: "Orlando Pirates", region: "Gauteng (Soweto Derby)", kickoff: "15:30", homeOdds: 2.60, drawOdds: 3.00, awayOdds: 2.55 },
    { date: "Feb 28", competition: "Betway Premiership", home: "Golden Arrows", away: "Chippa United", region: "KZN vs E. Cape", kickoff: "17:30", homeOdds: 2.10, drawOdds: 3.20, awayOdds: 3.40 },
    { date: "Mar 1", competition: "Betway Premiership", home: "Mamelodi Sundowns", away: "Sekhukhune Utd", region: "Gauteng vs Limpopo", kickoff: "15:30", homeOdds: 1.55, drawOdds: 3.80, awayOdds: 5.00 },
    { date: "Mar 1", competition: "Betway Premiership", home: "Marumo Gallants", away: "Durban City", region: "Limpopo vs KZN", kickoff: "17:30", homeOdds: 2.30, drawOdds: 3.15, awayOdds: 2.90 },
  ],
  rugby: [
    { date: "Feb 28", competition: "Vodacom URC", home: "Lions", away: "Stormers", region: "Gauteng vs W. Cape", kickoff: "17:05", homeOdds: 2.40, drawOdds: 18.0, awayOdds: 1.60 },
    { date: "Feb 28", competition: "Vodacom URC", home: "Bulls", away: "Sharks", region: "Gauteng vs KZN", kickoff: "19:30", homeOdds: 1.75, drawOdds: 20.0, awayOdds: 2.10 },
  ],
  cricket: [
    { date: "Feb 27", competition: "CSA Provincial One-Day", home: "Warriors", away: "Dolphins", region: "E. Cape vs KZN", kickoff: "10:00", homeOdds: 1.90, drawOdds: 0, awayOdds: 1.90 },
    { date: "Feb 28", competition: "CSA Provincial One-Day", home: "Knights", away: "Border", region: "Free State vs E. Cape", kickoff: "10:00", homeOdds: 1.65, drawOdds: 0, awayOdds: 2.20 },
  ],
};

const sportTabs: { id: Sport; label: string; icon: string }[] = [
  { id: "psl", label: "PSL Soccer", icon: "⚽" },
  { id: "rugby", label: "URC Rugby", icon: "🏉" },
  { id: "cricket", label: "CSA Cricket", icon: "🏏" },
];

const SportsTimetables = () => {
  const { t } = useLanguage();
  const [activeSport, setActiveSport] = useState<Sport>("psl");

  const rows = fixtures[activeSport];

  return (
    <section id="timetables" className="section-padding bg-card/30 border-y border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Calendar size={14} className="text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Sports Timetables</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
            Upcoming <span className="gradient-text">Fixtures</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Real-time fixtures across PSL, Rugby & Cricket — bet directly from the schedule.</p>
        </div>

        {/* Sport Tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {sportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSport(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                activeSport === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">Date</th>
                <th className="text-left px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">Competition</th>
                <th className="text-left px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">Match</th>
                <th className="text-left px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">Region</th>
                <th className="text-left px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">Kick-off</th>
                <th className="text-center px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">1</th>
                {activeSport !== "cricket" && (
                  <th className="text-center px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">X</th>
                )}
                <th className="text-center px-4 py-3 font-bold text-foreground uppercase text-xs tracking-wider">2</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{f.date}</td>
                  <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{f.competition}</td>
                  <td className="px-4 py-3 text-foreground font-semibold whitespace-nowrap">
                    {f.home} <span className="text-muted-foreground">vs</span> {f.away}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{f.region}</td>
                  <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{f.kickoff}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="odds-badge text-xs px-3 py-1.5">{f.homeOdds.toFixed(2)}</button>
                  </td>
                  {activeSport !== "cricket" && (
                    <td className="px-4 py-2 text-center">
                      <button className="odds-badge text-xs px-3 py-1.5">{f.drawOdds.toFixed(2)}</button>
                    </td>
                  )}
                  <td className="px-4 py-2 text-center">
                    <button className="odds-badge text-xs px-3 py-1.5">{f.awayOdds.toFixed(2)}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button className="btn-kasi text-sm py-3 px-6 inline-flex items-center gap-2">
            <Zap size={16} className="fill-current" />
            View All Fixtures & Bet Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default SportsTimetables;

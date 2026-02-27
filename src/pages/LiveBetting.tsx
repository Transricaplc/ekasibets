import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Clock, Users, ChevronRight, Search, Filter, Radio } from "lucide-react";
import Footer from "@/components/Footer";

// Mock live matches data
const liveMatches = [
  {
    id: 1,
    league: "PSL",
    leagueIcon: "🇿🇦",
    homeTeam: "Kaizer Chiefs",
    awayTeam: "Orlando Pirates",
    homeScore: 1,
    awayScore: 1,
    time: "67'",
    homeOdds: 2.15,
    drawOdds: 3.40,
    awayOdds: 2.80,
    trending: "home",
    viewers: 12453,
    isHot: true,
  },
  {
    id: 2,
    league: "PSL",
    leagueIcon: "🇿🇦",
    homeTeam: "Mamelodi Sundowns",
    awayTeam: "Cape Town City",
    homeScore: 2,
    awayScore: 0,
    time: "34'",
    homeOdds: 1.45,
    drawOdds: 4.20,
    awayOdds: 5.50,
    trending: "home",
    viewers: 8234,
    isHot: false,
  },
  {
    id: 3,
    league: "Premier League",
    leagueIcon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    homeScore: 0,
    awayScore: 2,
    time: "82'",
    homeOdds: 8.50,
    drawOdds: 5.00,
    awayOdds: 1.25,
    trending: "away",
    viewers: 45231,
    isHot: true,
  },
  {
    id: 4,
    league: "La Liga",
    leagueIcon: "🇪🇸",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: 1,
    awayScore: 1,
    time: "45+2'",
    homeOdds: 2.30,
    drawOdds: 3.60,
    awayOdds: 2.65,
    trending: "draw",
    viewers: 67892,
    isHot: true,
  },
  {
    id: 5,
    league: "Kasi Cup",
    leagueIcon: "⚽",
    homeTeam: "Soweto United",
    awayTeam: "Alexandra FC",
    homeScore: 3,
    awayScore: 2,
    time: "89'",
    homeOdds: 1.15,
    drawOdds: 7.00,
    awayOdds: 12.00,
    trending: "home",
    viewers: 2341,
    isHot: false,
  },
];

const upcomingMatches = [
  {
    id: 101,
    league: "PSL",
    leagueIcon: "🇿🇦",
    homeTeam: "Stellenbosch FC",
    awayTeam: "AmaZulu",
    kickoff: "Today, 19:30",
    homeOdds: 2.40,
    drawOdds: 3.20,
    awayOdds: 2.75,
  },
  {
    id: 102,
    league: "Champions League",
    leagueIcon: "🏆",
    homeTeam: "Bayern Munich",
    awayTeam: "PSG",
    kickoff: "Tomorrow, 21:00",
    homeOdds: 1.85,
    drawOdds: 3.80,
    awayOdds: 3.50,
  },
  {
    id: 103,
    league: "Serie A",
    leagueIcon: "🇮🇹",
    homeTeam: "AC Milan",
    awayTeam: "Inter Milan",
    kickoff: "Tomorrow, 20:45",
    homeOdds: 2.60,
    drawOdds: 3.30,
    awayOdds: 2.45,
  },
];

const categories = [
  { id: "all", label: "All Sports", count: 234 },
  { id: "football", label: "Football", count: 156 },
  { id: "kasi", label: "Kasi Leagues", count: 24 },
  { id: "esports", label: "eSports", count: 32 },
  { id: "cricket", label: "Cricket", count: 12 },
  { id: "rugby", label: "Rugby", count: 10 },
];

interface BetSlipItem {
  matchId: number;
  match: string;
  selection: string;
  odds: number;
}

const LiveBetting = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const addToBetSlip = (matchId: number, match: string, selection: string, odds: number) => {
    const existing = betSlip.find(b => b.matchId === matchId);
    if (existing) {
      setBetSlip(betSlip.filter(b => b.matchId !== matchId));
    } else {
      setBetSlip([...betSlip, { matchId, match, selection, odds }]);
    }
  };

  const removeBet = (matchId: number) => {
    setBetSlip(betSlip.filter(b => b.matchId !== matchId));
  };

  const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialWin = stakeAmount ? parseFloat(stakeAmount) * totalOdds : 0;

  const isSelected = (matchId: number, selection: string) => {
    return betSlip.some(b => b.matchId === matchId && b.selection === selection);
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Banner */}
        <div className="relative py-12 md:py-16 border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Radio className="text-destructive animate-pulse" size={20} />
              </div>
              <span className="text-sm font-medium text-destructive">LIVE NOW</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Live Betting
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Real-time odds on matches happening right now. Place your bets and watch the action unfold.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            {/* Main Content */}
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search matches, teams, leagues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <button className="btn-ghost py-3 px-5 flex items-center gap-2">
                  <Filter size={18} />
                  Filters
                </button>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                    <span className="ml-2 opacity-70">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* Live Matches */}
              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    Live Matches
                  </h2>
                  <span className="text-sm text-muted-foreground">{liveMatches.length} live</span>
                </div>

                {liveMatches.map((match) => (
                  <div
                    key={match.id}
                    className="card-premium p-5 hover:border-primary/50"
                  >
                    {/* Match Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span>{match.leagueIcon}</span>
                        <span className="text-sm text-muted-foreground">{match.league}</span>
                        {match.isHot && (
                          <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                            🔥 Hot
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users size={14} />
                          {match.viewers.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                          {match.time}
                        </div>
                      </div>
                    </div>

                    {/* Teams and Score */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-1">{match.homeTeam}</p>
                        <p className="font-semibold text-foreground">{match.awayTeam}</p>
                      </div>
                      <div className="text-center px-6">
                        <div className="font-display text-3xl text-foreground">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        {match.trending === "home" && (
                          <TrendingUp className="inline text-success" size={18} />
                        )}
                        {match.trending === "away" && (
                          <TrendingDown className="inline text-destructive" size={18} />
                        )}
                      </div>
                    </div>

                    {/* Odds */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => addToBetSlip(match.id, `${match.homeTeam} vs ${match.awayTeam}`, "1", match.homeOdds)}
                        className={`odds-badge flex-col py-3 ${isSelected(match.id, "1") ? "selected" : ""}`}
                      >
                        <span className="text-xs text-muted-foreground mb-1">1</span>
                        <span className="font-semibold">{match.homeOdds.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => addToBetSlip(match.id, `${match.homeTeam} vs ${match.awayTeam}`, "X", match.drawOdds)}
                        className={`odds-badge flex-col py-3 ${isSelected(match.id, "X") ? "selected" : ""}`}
                      >
                        <span className="text-xs text-muted-foreground mb-1">X</span>
                        <span className="font-semibold">{match.drawOdds.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => addToBetSlip(match.id, `${match.homeTeam} vs ${match.awayTeam}`, "2", match.awayOdds)}
                        className={`odds-badge flex-col py-3 ${isSelected(match.id, "2") ? "selected" : ""}`}
                      >
                        <span className="text-xs text-muted-foreground mb-1">2</span>
                        <span className="font-semibold">{match.awayOdds.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Matches */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                    <Clock size={20} className="text-muted-foreground" />
                    Upcoming
                  </h2>
                </div>

                <div className="space-y-3">
                  {upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="card-premium p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span>{match.leagueIcon}</span>
                          <span className="text-sm text-muted-foreground">{match.league}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{match.kickoff}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">{match.homeTeam}</p>
                          <p className="font-medium text-foreground text-sm">{match.awayTeam}</p>
                        </div>
                        <ChevronRight className="text-muted-foreground" size={18} />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => addToBetSlip(match.id, `${match.homeTeam} vs ${match.awayTeam}`, "1", match.homeOdds)}
                          className={`odds-badge text-sm py-2 ${isSelected(match.id, "1") ? "selected" : ""}`}
                        >
                          {match.homeOdds.toFixed(2)}
                        </button>
                        <button
                          onClick={() => addToBetSlip(match.id, `${match.homeTeam} vs ${match.awayTeam}`, "X", match.drawOdds)}
                          className={`odds-badge text-sm py-2 ${isSelected(match.id, "X") ? "selected" : ""}`}
                        >
                          {match.drawOdds.toFixed(2)}
                        </button>
                        <button
                          onClick={() => addToBetSlip(match.id, `${match.homeTeam} vs ${match.awayTeam}`, "2", match.awayOdds)}
                          className={`odds-badge text-sm py-2 ${isSelected(match.id, "2") ? "selected" : ""}`}
                        >
                          {match.awayOdds.toFixed(2)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bet Slip Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="glass p-5 border border-border/50">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-lg text-foreground">Bet Slip</h3>
                  {betSlip.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {betSlip.length} {betSlip.length === 1 ? "bet" : "bets"}
                    </span>
                  )}
                </div>

                {betSlip.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Click on odds to add selections to your bet slip
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                      {betSlip.map((bet) => (
                        <div
                          key={bet.matchId}
                          className="bg-secondary/50 rounded-xl p-3"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm text-foreground font-medium pr-2">{bet.match}</p>
                            <button
                              onClick={() => removeBet(bet.matchId)}
                              className="text-muted-foreground hover:text-destructive transition-colors text-lg leading-none"
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {bet.selection === "1" ? "Home Win" : bet.selection === "X" ? "Draw" : "Away Win"}
                            </span>
                            <span className="font-semibold text-primary">{bet.odds.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border/50 pt-4 space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Stake (R)</label>
                        <input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-secondary border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Odds</span>
                        <span className="font-semibold text-foreground">{totalOdds.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Potential Win</span>
                        <span className="font-display text-xl gradient-text-gold">
                          R{potentialWin.toFixed(2)}
                        </span>
                      </div>

                      <button className="btn-premium w-full py-4 text-base">
                        Place Bet
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="stat-card text-center">
                  <p className="text-2xl font-display text-foreground">156</p>
                  <p className="text-xs text-muted-foreground">Live Events</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-2xl font-display gradient-text">~2min</p>
                  <p className="text-xs text-muted-foreground">Avg Payout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LiveBetting;
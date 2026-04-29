import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Loader2, Flame, TrendingUp, Crown, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Metric = "winnings" | "biggest_win" | "streak";
type Period = "all" | "week";

interface Row {
  rank: number;
  user_id: string;
  display_name: string;
  value: number;
  bets_count: number;
}

const metrics: { key: Metric; label: string; icon: any; suffix: string }[] = [
  { key: "winnings", label: "Top Winners", icon: Trophy, suffix: "profit" },
  { key: "biggest_win", label: "Biggest Wins", icon: TrendingUp, suffix: "single win" },
  { key: "streak", label: "Hot Streaks", icon: Flame, suffix: "wins in a row" },
];

const Leaderboards = () => {
  const [metric, setMetric] = useState<Metric>("winnings");
  const [period, setPeriod] = useState<Period>("week");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data, error } = await supabase.rpc("get_leaderboard", {
        _metric: metric, _period: period, _limit: 25,
      });
      if (!error) setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, [metric, period]);

  const current = metrics.find((m) => m.key === metric)!;
  const isStreak = metric === "streak";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary mb-1">Leaderboards</p>
        <h1 className="font-display text-3xl md:text-4xl">
          eKasi <span className="gradient-text-gold">Champions</span>
        </h1>
        <p className="text-muted-foreground mt-2">Real winners, real numbers. Updated live from settled bets.</p>
      </div>

      {/* Metric tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${
              metric === m.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <m.icon size={14} /> {m.label}
          </button>
        ))}
      </div>

      {/* Period toggle */}
      <div className="flex gap-2 mb-6">
        {(["week", "all"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
              period === p ? "bg-kasi-gold text-background" : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "week" ? "This Week" : "All Time"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="animate-spin inline mr-2" /> Loading rankings…
        </div>
      ) : rows.length === 0 ? (
        <div className="card-premium p-8 text-center text-muted-foreground">
          No champions yet for this period. Be the first! <Link to="/sportsbook" className="text-primary hover:underline">Place a bet →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const podium = r.rank <= 3;
            const rankColors = ["text-kasi-gold", "text-muted-foreground", "text-fire"];
            return (
              <div
                key={r.user_id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  podium ? "card-premium border-kasi-gold/40" : "bg-muted/30 border-border/50"
                }`}
              >
                <div className={`w-10 text-center ${podium ? rankColors[r.rank - 1] : "text-muted-foreground"}`}>
                  {r.rank === 1 ? <Crown size={24} className="mx-auto" /> :
                   r.rank <= 3 ? <Medal size={20} className="mx-auto" /> :
                   <span className="font-display text-lg">#{r.rank}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{r.display_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isStreak ? `${r.bets_count} consecutive wins` : `${r.bets_count} winning bet${r.bets_count !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-display text-xl ${podium ? "gradient-text-gold" : "text-foreground"}`}>
                    {isStreak ? `🔥 ${r.value}` : `R${Number(r.value).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{current.suffix}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        Names shown as first name + last initial for privacy. 18+. <Link to="/responsible-gaming" className="text-primary hover:underline">Play responsibly</Link>.
      </p>
    </div>
  );
};

export default Leaderboards;

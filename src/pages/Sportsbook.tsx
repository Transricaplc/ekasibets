import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Loader2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBetSlip } from "@/contexts/BetSlipContext";
import { Button } from "@/components/ui/button";

interface SelectionRow {
  id: string;
  label: string;
  odds: number;
  display_order: number;
}
interface MarketRow {
  id: string;
  key: string;
  name: string;
  status: string;
  selections: SelectionRow[];
}
interface MatchRow {
  id: string;
  home_team: string;
  away_team: string;
  region: string | null;
  start_time: string;
  status: string;
  league: { id: string; name: string; sport: { name: string; slug: string; icon: string | null } } | null;
  markets: MarketRow[];
}

interface SportTab { slug: string; name: string; icon: string | null; }

const Sportsbook = () => {
  const [sports, setSports] = useState<SportTab[]>([]);
  const [activeSport, setActiveSport] = useState<string>("soccer");
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggle, has, items, setOpen } = useBetSlip();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("sports").select("slug,name,icon").eq("active", true).order("display_order");
      setSports((data as SportTab[]) ?? []);
    })();
  }, []);

  useEffect(() => {
    if (!activeSport) return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          id, home_team, away_team, region, start_time, status,
          league:leagues!inner(
            id, name,
            sport:sports!inner(name, slug, icon)
          ),
          markets(
            id, key, name, status,
            selections(id, label, odds, display_order)
          )
        `)
        .eq("league.sport.slug", activeSport)
        .in("status", ["scheduled", "live"])
        .order("start_time")
        .limit(50);

      if (!error && data) {
        const rows = (data as any[]).map((m) => ({
          ...m,
          markets: (m.markets ?? []).map((mk: any) => ({
            ...mk,
            selections: (mk.selections ?? []).sort((a: any, b: any) => a.display_order - b.display_order),
          })),
        })) as MatchRow[];
        setMatches(rows);
      }
      setLoading(false);
    })();
  }, [activeSport]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1">Sportsbook</p>
          <h1 className="font-display text-3xl md:text-4xl">Live & Upcoming <span className="gradient-text">Fixtures</span></h1>
        </div>
        {items.length > 0 && (
          <Button onClick={() => setOpen(true)} className="btn-kasi gap-2">
            <Zap size={16} /> Bet Slip ({items.length})
          </Button>
        )}
      </div>

      {/* Sport tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sports.map((s) => (
          <button
            key={s.slug}
            onClick={() => setActiveSport(s.slug)}
            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
              activeSport === s.slug ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading fixtures…</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No fixtures available right now.</div>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => {
            const market = m.markets.find((mk) => mk.key === "match_winner");
            const dt = new Date(m.start_time);
            return (
              <div key={m.id} className="card-premium p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {dt.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })} · {dt.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                    {m.region && <> · {m.region}</>}
                  </div>
                  <span className="text-xs text-primary font-medium">{m.league?.name}</span>
                </div>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="font-display text-base md:text-lg flex-1 min-w-[200px]">
                    {m.home_team} <span className="text-muted-foreground text-sm font-body">vs</span> {m.away_team}
                  </div>
                  {market ? (
                    <div className="flex gap-2">
                      {market.selections.map((s) => (
                        <button
                          key={s.id}
                          onClick={() =>
                            toggle({
                              selectionId: s.id,
                              matchId: m.id,
                              marketId: market.id,
                              matchLabel: `${m.home_team} vs ${m.away_team}`,
                              marketName: market.name,
                              selectionLabel: s.label,
                              odds: Number(s.odds),
                            })
                          }
                          className={`min-w-[72px] px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                            has(s.id)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/60 text-foreground border-border hover:border-primary/50 hover:bg-primary/10"
                          }`}
                        >
                          <div className="text-[10px] uppercase opacity-70">{s.label}</div>
                          <div>{Number(s.odds).toFixed(2)}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No markets</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        18+. Gambling involves risk. <Link to="/responsible-gaming" className="text-primary hover:underline">Play responsibly</Link>.
      </p>
    </div>
  );
};

export default Sportsbook;

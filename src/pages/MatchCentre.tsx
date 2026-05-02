import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Radio, Clock, Loader2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBetSlip } from "@/contexts/BetSlipContext";
import { Button } from "@/components/ui/button";

interface Selection { id: string; label: string; odds: number; display_order: number; }
interface Market { id: string; key: string; name: string; status: string; selections: Selection[]; }
interface MatchEvent {
  id: string;
  match_id: string;
  event_type: string;
  team: string | null;
  player: string | null;
  minute: number | null;
  description: string | null;
  created_at: string;
}
interface LiveMatch {
  id: string;
  home_team: string;
  away_team: string;
  region: string | null;
  start_time: string;
  status: string;
  home_score: number;
  away_score: number;
  clock_minute: number | null;
  period: string | null;
  live_updated_at: string | null;
  league: { name: string; sport: { name: string; icon: string | null } } | null;
  markets: Market[];
}

const eventEmoji = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("goal")) return "⚽";
  if (t.includes("yellow")) return "🟨";
  if (t.includes("red")) return "🟥";
  if (t.includes("sub")) return "🔁";
  if (t.includes("pen")) return "🎯";
  return "📣";
};

const MatchCentre = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [events, setEvents] = useState<Record<string, MatchEvent[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toggle, has, items, setOpen } = useBetSlip();

  const fetchAll = async () => {
    const { data } = await supabase
      .from("matches")
      .select(`
        id, home_team, away_team, region, start_time, status,
        home_score, away_score, clock_minute, period, live_updated_at,
        league:leagues(name, sport:sports(name, icon)),
        markets(id, key, name, status, selections(id, label, odds, display_order))
      `)
      .eq("status", "live")
      .order("live_updated_at", { ascending: false, nullsFirst: false })
      .limit(40);
    const rows = ((data ?? []) as any[]).map((m) => ({
      ...m,
      markets: (m.markets ?? []).map((mk: any) => ({
        ...mk,
        selections: (mk.selections ?? []).sort((a: any, b: any) => a.display_order - b.display_order),
      })),
    })) as LiveMatch[];
    setMatches(rows);
    if (rows.length && !selectedId) setSelectedId(rows[0].id);

    if (rows.length) {
      const ids = rows.map((r) => r.id);
      const { data: ev } = await supabase
        .from("match_events")
        .select("*")
        .in("match_id", ids)
        .order("created_at", { ascending: false })
        .limit(200);
      const grouped: Record<string, MatchEvent[]> = {};
      (ev ?? []).forEach((e: any) => {
        (grouped[e.match_id] ||= []).push(e as MatchEvent);
      });
      setEvents(grouped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const matchCh = supabase
      .channel("live-matches")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, (payload) => {
        const n = payload.new as any;
        setMatches((prev) =>
          prev.map((m) => (m.id === n.id ? { ...m, ...n } : m)).filter((m) => m.status === "live")
        );
      })
      .subscribe();
    const evCh = supabase
      .channel("live-events")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "match_events" }, (payload) => {
        const e = payload.new as MatchEvent;
        setEvents((prev) => ({ ...prev, [e.match_id]: [e, ...(prev[e.match_id] ?? [])] }));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(matchCh);
      supabase.removeChannel(evCh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useMemo(() => matches.find((m) => m.id === selectedId) ?? matches[0] ?? null, [matches, selectedId]);
  const selectedEvents = selected ? events[selected.id] ?? [] : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-sm font-medium text-fire mb-1 flex items-center gap-2">
            <Radio size={14} className="animate-pulse" /> In-Play
          </p>
          <h1 className="font-display text-3xl md:text-4xl">
            Match <span className="gradient-text">Centre</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Live scores, events and odds — updated in realtime.</p>
        </div>
        {items.length > 0 && (
          <Button onClick={() => setOpen(true)} className="btn-kasi gap-2">
            Bet Slip ({items.length})
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="animate-spin inline mr-2" /> Loading live matches…
        </div>
      ) : matches.length === 0 ? (
        <div className="card-premium p-10 text-center">
          <Trophy className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No live matches right now. Check back at kick-off.</p>
          <Link to="/sportsbook" className="inline-block mt-4 btn-kasi text-sm py-2 px-4">
            Browse upcoming fixtures
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[300px_1fr] gap-4">
          {/* Match list */}
          <div className="space-y-2">
            {matches.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selected?.id === m.id
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/40 border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-fire mb-1">
                  <span className="flex items-center gap-1">
                    <Radio size={10} className="animate-pulse" /> Live
                  </span>
                  <span className="text-muted-foreground">
                    {m.clock_minute != null ? `${m.clock_minute}'` : m.period ?? ""}
                  </span>
                </div>
                <div className="font-display text-sm leading-tight">
                  {m.home_team} <span className="text-primary">{m.home_score}</span>
                  {" - "}
                  <span className="text-primary">{m.away_score}</span> {m.away_team}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 truncate">{m.league?.name}</div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div className="space-y-4">
              <div className="card-premium p-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="text-primary font-medium">{selected.league?.name}</span>
                  <span className="flex items-center gap-1 text-fire font-bold uppercase">
                    <Radio size={12} className="animate-pulse" /> Live
                    {selected.clock_minute != null && (
                      <span className="ml-2 flex items-center gap-1 text-foreground">
                        <Clock size={12} /> {selected.clock_minute}'
                      </span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-2 text-center">
                  <div className="font-display text-base md:text-xl truncate">{selected.home_team}</div>
                  <div className="font-display text-3xl md:text-5xl gradient-text">
                    {selected.home_score} - {selected.away_score}
                  </div>
                  <div className="font-display text-base md:text-xl truncate">{selected.away_team}</div>
                </div>
              </div>

              {/* Markets */}
              <div className="space-y-3">
                {selected.markets.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">No markets open right now.</div>
                )}
                {selected.markets.map((mk) => (
                  <div key={mk.id} className="card-premium p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{mk.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {mk.selections.map((s) => (
                        <button
                          key={s.id}
                          disabled={mk.status !== "open"}
                          onClick={() =>
                            toggle({
                              selectionId: s.id,
                              matchId: selected.id,
                              marketId: mk.id,
                              matchLabel: `${selected.home_team} vs ${selected.away_team}`,
                              marketName: mk.name,
                              selectionLabel: s.label,
                              odds: Number(s.odds),
                            })
                          }
                          className={`min-w-[80px] px-3 py-2 rounded-lg text-sm font-bold transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
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
                  </div>
                ))}
              </div>

              {/* Event feed */}
              <div className="card-premium p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Live Feed</div>
                {selectedEvents.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No events yet — kick-off awaited.</div>
                ) : (
                  <ul className="space-y-2 max-h-80 overflow-y-auto">
                    {selectedEvents.map((e) => (
                      <li key={e.id} className="flex gap-3 text-sm border-b border-border/50 pb-2 last:border-0">
                        <span className="text-lg">{eventEmoji(e.event_type)}</span>
                        <div className="flex-1">
                          <div className="font-bold">
                            {e.minute != null && <span className="text-primary mr-2">{e.minute}'</span>}
                            {e.event_type}
                            {e.team && <span className="text-muted-foreground font-normal"> · {e.team}</span>}
                          </div>
                          {(e.player || e.description) && (
                            <div className="text-xs text-muted-foreground">
                              {e.player}
                              {e.player && e.description ? " — " : ""}
                              {e.description}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchCentre;

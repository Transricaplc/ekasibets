import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Trophy, ShieldCheck } from "lucide-react";
import AdminPromoManager from "@/components/AdminPromoManager";
import AdminRewardsManager from "@/components/AdminRewardsManager";
import AdminBroadcast from "@/components/AdminBroadcast";
import AdminMatchCentre from "@/components/AdminMatchCentre";

interface MatchRow {
  id: string;
  home_team: string;
  away_team: string;
  start_time: string;
  status: string;
  league?: { name: string } | null;
}

interface Selection { id: string; label: string; odds: number; }
interface Market { id: string; name: string; key: string; status: string; selections: Selection[]; }

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [winners, setWinners] = useState<Record<string, string>>({}); // marketId -> selectionId
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data } = await supabase
        .from("matches")
        .select("id, home_team, away_team, start_time, status, league:leagues(name)")
        .in("status", ["scheduled", "live"])
        .order("start_time", { ascending: true })
        .limit(50);
      setMatches((data as any) ?? []);
      setLoading(false);
    })();
  }, [isAdmin]);

  const loadMarkets = async (matchId: string) => {
    setSelectedMatch(matchId);
    setWinners({});
    const { data } = await supabase
      .from("markets")
      .select("id, name, key, status, selections(id, label, odds)")
      .eq("match_id", matchId);
    setMarkets((data as any) ?? []);
  };

  const settle = async () => {
    if (!selectedMatch) return;
    const winningIds = Object.values(winners).filter(Boolean);
    if (winningIds.length === 0) {
      return toast.error("Select at least one winning outcome");
    }
    if (!confirm(`Settle this match? ${winningIds.length} winning selection(s). This is irreversible.`)) return;
    setSettling(true);
    const { data, error } = await supabase.rpc("settle_match", {
      _match_id: selectedMatch,
      _winning_selection_ids: winningIds,
    });
    setSettling(false);
    if (error) return toast.error(error.message);
    toast.success(`Match settled — ${(data as any)?.bets_settled ?? 0} bets processed`);
    setMatches((m) => m.filter((x) => x.id !== selectedMatch));
    setSelectedMatch(null);
    setMarkets([]);
  };

  if (authLoading || roleLoading) {
    return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Checking access…</div>;
  }
  if (!user) return <Navigate to="/auth?redirect=/admin" replace />;
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <ShieldCheck className="mx-auto text-muted-foreground mb-3" size={40} />
        <h1 className="font-display text-2xl mb-2">Admin Only</h1>
        <p className="text-muted-foreground text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="font-display text-3xl md:text-4xl mb-1">Admin <span className="gradient-text">Panel</span></h1>
      <p className="text-muted-foreground mb-6">Settle matches and trigger bet payouts.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-premium p-5">
          <h2 className="font-bold mb-3 flex items-center gap-2"><Trophy size={18} className="text-primary" /> Open Matches</h2>
          {loading ? (
            <div className="text-muted-foreground text-sm"><Loader2 className="animate-spin inline mr-2" size={14} /> Loading…</div>
          ) : matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open matches to settle.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => loadMarkets(m.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedMatch === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-sm">{m.home_team} vs {m.away_team}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.league?.name ?? "—"} · {new Date(m.start_time).toLocaleString("en-ZA")} · {m.status}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-premium p-5">
          <h2 className="font-bold mb-3">Mark Outcomes</h2>
          {!selectedMatch ? (
            <p className="text-sm text-muted-foreground">Select a match to settle.</p>
          ) : markets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No markets for this match.</p>
          ) : (
            <div className="space-y-4">
              {markets.map((mk) => (
                <div key={mk.id}>
                  <p className="text-xs uppercase text-muted-foreground mb-2 font-bold">{mk.name}</p>
                  <div className="space-y-1">
                    {mk.selections.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg border border-border">
                        <input
                          type="radio"
                          name={mk.id}
                          checked={winners[mk.id] === s.id}
                          onChange={() => setWinners({ ...winners, [mk.id]: s.id })}
                        />
                        <span className="text-sm flex-1">{s.label}</span>
                        <input
                          type="number"
                          step="0.01"
                          min="1.01"
                          defaultValue={Number(s.odds).toFixed(2)}
                          onBlur={async (e) => {
                            const v = Number(e.target.value);
                            if (!v || v < 1.01) return;
                            const { error } = await supabase.from("selections").update({ odds: v }).eq("id", s.id);
                            if (error) toast.error(error.message);
                            else toast.success(`Odds updated to ${v.toFixed(2)}`);
                          }}
                          className="w-20 px-2 py-1 text-xs bg-muted border border-border rounded text-right focus:outline-none focus:border-primary"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => { const w = { ...winners }; delete w[mk.id]; setWinners(w); }}
                      className="text-[10px] text-muted-foreground hover:text-destructive"
                    >
                      Clear / Void this market
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={settle} disabled={settling} className="btn-kasi w-full py-2.5 text-sm">
                {settling ? <Loader2 className="animate-spin inline mr-2" size={14} /> : null}
                Settle Match & Pay Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <AdminMatchCentre />
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <AdminPromoManager />
        <AdminRewardsManager />
        <AdminBroadcast />
      </div>
    </div>
  );
};

export default AdminPage;

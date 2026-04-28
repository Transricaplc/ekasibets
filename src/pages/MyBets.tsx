import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Trophy, Banknote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BetRow {
  id: string;
  reference: string;
  type: string;
  stake: number;
  total_odds: number;
  potential_payout: number;
  payout: number | null;
  status: string;
  placed_at: string;
  bet_selections: {
    odds_snapshot: number;
    result: string | null;
    selection: { label: string } | null;
    market: { name: string } | null;
    match: { home_team: string; away_team: string } | null;
  }[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

const STATUS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  won: { label: "Won", variant: "default" },
  lost: { label: "Lost", variant: "destructive" },
  void: { label: "Void", variant: "outline" },
  cashed_out: { label: "Cashed Out", variant: "outline" },
};

const MyBets = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<BetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cashingOut, setCashingOut] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("bets")
      .select(`
        id, reference, type, stake, total_odds, potential_payout, payout, status, placed_at,
        bet_selections(
          odds_snapshot, result,
          selection:selections(label),
          market:markets(name),
          match:matches(home_team, away_team)
        )
      `)
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false })
      .limit(50);
    setBets((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const cashOut = async (betId: string) => {
    if (!confirm("Cash out this bet now? You'll receive the current value, not the full potential payout.")) return;
    setCashingOut(betId);
    const { data, error } = await supabase.rpc("cash_out_bet", { _bet_id: betId });
    setCashingOut(null);
    if (error) return toast.error(error.message);
    const value = (data as any)?.cashout;
    toast.success(`Cashed out R${Number(value).toFixed(2)}`);
    load();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-display text-3xl md:text-4xl mb-1">My <span className="gradient-text">Bets</span></h1>
      <p className="text-muted-foreground mb-6">Your full betting history.</p>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
      ) : bets.length === 0 ? (
        <div className="card-premium p-8 text-center">
          <Trophy className="mx-auto text-primary mb-3" size={32} />
          <p className="font-bold mb-1">No bets yet</p>
          <p className="text-sm text-muted-foreground mb-4">Head to the sportsbook and place your first bet.</p>
          <Link to="/sportsbook" className="btn-kasi inline-block px-5 py-2 text-sm">Browse Fixtures</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bets.map((b) => {
            const st = STATUS[b.status] ?? STATUS.pending;
            return (
              <div key={b.id} className="card-premium p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{b.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.placed_at).toLocaleString("en-ZA")} · {b.type}
                    </p>
                  </div>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {b.bet_selections.map((sel, i) => (
                    <div key={i} className="text-sm border-l-2 border-primary/40 pl-3">
                      <p className="font-medium">{sel.match?.home_team} vs {sel.match?.away_team}</p>
                      <p className="text-xs text-muted-foreground">
                        {sel.market?.name} · {sel.selection?.label} @ {Number(sel.odds_snapshot).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Stake</p>
                    <p className="font-bold">{fmt(Number(b.stake))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Odds</p>
                    <p className="font-bold text-primary">{Number(b.total_odds).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{b.status === "won" ? "Payout" : "Potential"}</p>
                    <p className="font-bold gradient-text-gold">
                      {fmt(Number(b.payout ?? b.potential_payout))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBets;

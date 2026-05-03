import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Trash2, Zap, Loader2, Share2 } from "lucide-react";
import { useBetSlip } from "@/contexts/BetSlipContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { buildBetShareText, shareToWhatsApp } from "@/lib/share";

const QUICK_STAKES = [10, 20, 50, 100];

const BetSlip = () => {
  const { items, open, setOpen, remove, clear, totalOdds } = useBetSlip();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stake, setStake] = useState<string>("20");
  const [placing, setPlacing] = useState(false);

  const stakeNum = Number(stake) || 0;
  const potential = Math.min(stakeNum * totalOdds, 500000);
  const betType: "single" | "multiple" = items.length > 1 ? "multiple" : "single";

  const handlePlace = async () => {
    if (!user) {
      toast.error("Please sign in to place a bet");
      setOpen(false);
      navigate("/auth");
      return;
    }
    if (items.length === 0) return;
    if (stakeNum < 5) {
      toast.error("Minimum stake is R5");
      return;
    }
    setPlacing(true);
    const { data, error } = await supabase.rpc("place_bet", {
      _selection_ids: items.map((i) => i.selectionId),
      _stake: stakeNum,
      _bet_type: betType,
    });
    setPlacing(false);
    if (error) {
      toast.error(error.message ?? "Could not place bet");
      return;
    }
    const result = data as any;
    const ref = result?.reference as string;
    const shareText = buildBetShareText({
      reference: ref,
      stake: stakeNum,
      totalOdds,
      potentialPayout: potential,
      selections: items.map((i) => ({
        matchLabel: i.matchLabel,
        marketName: i.marketName,
        selectionLabel: i.selectionLabel,
        odds: i.odds,
      })),
    });
    toast.success(`Sharp! Bet placed · ${ref}`, {
      action: { label: "Share on WhatsApp", onClick: () => shareToWhatsApp(shareText) },
      duration: 8000,
    });
    clear();
    setOpen(false);
    navigate("/my-bets");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            Bet Slip {items.length > 0 && <span className="text-sm text-muted-foreground">({items.length})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Your bet slip is empty.</p>
              <p className="text-xs mt-2">Tap any odds button to add a selection.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.selectionId} className="border border-border rounded-lg p-3 bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">{it.matchLabel}</p>
                      <p className="font-medium text-sm truncate">{it.marketName} · {it.selectionLabel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{it.odds.toFixed(2)}</p>
                    </div>
                    <button onClick={() => remove(it.selectionId)} className="text-muted-foreground hover:text-destructive">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                <Trash2 size={12} /> Clear all
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-3 bg-card/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bet type</span>
              <span className="font-bold capitalize">{betType}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total odds</span>
              <span className="font-bold text-primary">{totalOdds.toFixed(2)}</span>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stake (ZAR)</label>
              <Input type="number" min={5} value={stake} onChange={(e) => setStake(e.target.value)} className="text-lg font-bold" />
              <div className="flex gap-2 mt-2">
                {QUICK_STAKES.map((q) => (
                  <button key={q} onClick={() => setStake(String(q))} className="flex-1 text-xs py-1.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    R{q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
              <span className="text-muted-foreground">Potential payout</span>
              <span className="font-display text-lg gradient-text-gold">R{potential.toFixed(2)}</span>
            </div>

            <Button onClick={handlePlace} disabled={placing || stakeNum < 5} className="btn-kasi w-full">
              {placing ? <><Loader2 className="animate-spin mr-2" size={16} /> Placing…</> : `Place Bet · R${stakeNum.toFixed(2)}`}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              18+. <Link to="/responsible-gaming" className="text-primary hover:underline">Play responsibly</Link>. Max payout R500,000.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default BetSlip;

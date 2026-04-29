import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gift, Loader2, Sparkles, Ticket, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PromoRow {
  id: string;
  code: string;
  description: string;
  bonus_amount: number;
  expires_at: string | null;
  max_redemptions: number | null;
  total_redemptions: number;
}

const Promotions = () => {
  const { user } = useAuth();
  const [promos, setPromos] = useState<PromoRow[]>([]);
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: p } = await supabase
      .from("promo_codes")
      .select("id, code, description, bonus_amount, expires_at, max_redemptions, total_redemptions")
      .eq("active", true)
      .order("bonus_amount", { ascending: false });
    setPromos((p as PromoRow[]) ?? []);

    if (user) {
      const { data: r } = await supabase
        .from("promo_redemptions")
        .select("promo_code_id")
        .eq("user_id", user.id);
      setRedeemed(new Set((r ?? []).map((x: any) => x.promo_code_id)));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const redeem = async (codeStr: string) => {
    if (!user) { toast.error("Sign in to redeem promo codes"); return; }
    if (!codeStr.trim()) { toast.error("Enter a promo code"); return; }
    setSubmitting(true);
    const { data, error } = await supabase.rpc("redeem_promo_code", { _code: codeStr.trim() });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    const result = data as { bonus: number; code: string };
    toast.success(`R${result.bonus} bonus credited! 🎉`);
    setCode("");
    load();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary mb-1">Promotions</p>
        <h1 className="font-display text-3xl md:text-4xl">Bonuses & <span className="gradient-text-gold">Free Bets</span></h1>
        <p className="text-muted-foreground mt-2">Grab a code, boost your bankroll. Pure kasi vibes.</p>
      </div>

      {/* Redeem form */}
      <div className="card-premium p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Ticket className="text-kasi-gold" size={20} />
          <h2 className="font-display text-xl">Have a code?</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER PROMO CODE"
            className="flex-1 min-w-[200px] uppercase tracking-wider font-bold"
            maxLength={32}
          />
          <Button onClick={() => redeem(code)} disabled={submitting} className="btn-kasi gap-2">
            {submitting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            Redeem
          </Button>
        </div>
        {!user && (
          <p className="text-xs text-muted-foreground mt-2">
            <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to redeem codes.
          </p>
        )}
      </div>

      {/* Active promos */}
      <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
        <Gift className="text-primary" size={22} /> Active Offers
      </h2>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="animate-spin inline mr-2" /> Loading promos…
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No active promotions right now. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promos.map((p) => {
            const isRedeemed = redeemed.has(p.id);
            const remaining = p.max_redemptions ? p.max_redemptions - p.total_redemptions : null;
            const expSoon = p.expires_at && new Date(p.expires_at).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 3;
            return (
              <div key={p.id} className="card-premium p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-kasi-gold text-background font-display text-2xl px-4 py-2 rounded-bl-2xl">
                  R{Number(p.bonus_amount).toFixed(0)}
                </div>
                <div className="font-display text-lg tracking-widest mb-1">{p.code}</div>
                <p className="text-sm text-muted-foreground mb-4 pr-16">{p.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
                  {p.expires_at && (
                    <span className={`flex items-center gap-1 ${expSoon ? "text-fire font-bold" : ""}`}>
                      <Clock size={12} />
                      Expires {new Date(p.expires_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </span>
                  )}
                  {remaining !== null && remaining < 100 && (
                    <span className="text-fire font-bold">Only {remaining} left!</span>
                  )}
                </div>
                <Button
                  onClick={() => redeem(p.code)}
                  disabled={submitting || isRedeemed || !user}
                  className={isRedeemed ? "" : "btn-kasi w-full"}
                  variant={isRedeemed ? "secondary" : "default"}
                >
                  {isRedeemed ? "✓ Already redeemed" : "Claim Bonus"}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        Bonus funds carry wagering requirements. 18+. <Link to="/responsible-gaming" className="text-primary hover:underline">Play responsibly</Link>.
      </p>
    </div>
  );
};

export default Promotions;

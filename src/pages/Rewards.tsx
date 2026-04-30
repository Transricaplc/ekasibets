import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Award, Loader2, Sparkles, History, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";

type Category = "airtime" | "voucher" | "braai" | "data" | "other";
interface RewardItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  points_cost: number;
  rand_value: number;
  stock: number | null;
  active: boolean;
  image_emoji: string;
}
interface Redemption {
  id: string;
  reward_item_id: string;
  points_spent: number;
  status: "pending" | "fulfilled" | "cancelled";
  created_at: string;
  voucher_code: string | null;
  reward_items?: { name: string; image_emoji: string };
}

const CATEGORY_LABEL: Record<Category, string> = {
  airtime: "Airtime",
  data: "Data",
  voucher: "Vouchers",
  braai: "Braai",
  other: "Other",
};

const Rewards = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<RewardItem[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [lifetime, setLifetime] = useState<number>(0);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [selected, setSelected] = useState<RewardItem | null>(null);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: itemRows } = await supabase
      .from("reward_items").select("*").eq("active", true).order("points_cost");
    setItems((itemRows ?? []) as RewardItem[]);

    if (user) {
      const { data: pts } = await supabase
        .from("user_points").select("points, lifetime_earned").eq("user_id", user.id).maybeSingle();
      setPoints(pts?.points ?? 0);
      setLifetime(pts?.lifetime_earned ?? 0);

      const { data: reds } = await supabase
        .from("reward_redemptions")
        .select("id, reward_item_id, points_spent, status, created_at, voucher_code, reward_items(name, image_emoji)")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
      setRedemptions((reds ?? []) as any);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openRedeem = (item: RewardItem) => {
    if (!user) { toast.error("Sign in to redeem"); return; }
    if (points < item.points_cost) { toast.error("Not enough points yet — keep betting!"); return; }
    setSelected(item); setPhone(""); setNotes("");
  };

  const confirmRedeem = async () => {
    if (!selected) return;
    setSubmitting(true);
    const { data, error } = await supabase.rpc("redeem_reward", {
      _item_id: selected.id, _phone: phone || null, _notes: notes || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success(`Redeemed! ${(data as any).remaining_points} points left.`);
    setSelected(null);
    load();
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);
  const requiresPhone = selected && (selected.category === "airtime" || selected.category === "data");

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kasi-gold/10 border-2 border-kasi-gold/30 rounded-full mb-4">
              <Award size={16} className="text-kasi-gold" />
              <span className="text-sm font-bold text-kasi-gold uppercase tracking-wide">eKasi Rewards</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-3">EARN. REDEEM. ENJOY.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Earn 1 point for every R10 staked. Cash them in for airtime, spaza vouchers, data, or a braai pack.
            </p>
          </div>

          {/* Points balance */}
          {user ? (
            <div className="glass border-2 border-kasi-gold/30 p-6 rounded-2xl mb-8 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your Points</p>
              <p className="text-5xl font-display gradient-text-gold mb-1">{points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Lifetime earned: {lifetime.toLocaleString()}</p>
            </div>
          ) : (
            <div className="card-premium p-6 mb-8 text-center">
              <p className="text-sm text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline font-bold">Sign in</Link> to start earning and redeeming rewards.
              </p>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(["all", "airtime", "data", "voucher", "braai", "other"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${
                  filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {c === "all" ? "All" : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>

          {/* Catalog */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" />Loading rewards…</div>
          ) : filtered.length === 0 ? (
            <div className="card-premium p-8 text-center text-muted-foreground">No rewards in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {filtered.map((item) => {
                const canAfford = points >= item.points_cost;
                const outOfStock = item.stock !== null && item.stock <= 0;
                return (
                  <div key={item.id} className="card-kasi p-5 flex flex-col">
                    <div className="text-5xl mb-3">{item.image_emoji}</div>
                    <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 flex-1">{item.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-display text-2xl gradient-text-gold leading-none">{item.points_cost}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">points</p>
                      </div>
                      <span className="text-xs font-bold text-kasi-green">≈ R{item.rand_value}</span>
                    </div>
                    {item.stock !== null && (
                      <p className="text-[10px] text-muted-foreground mb-2">
                        {outOfStock ? "Out of stock" : `${item.stock} left`}
                      </p>
                    )}
                    <Button
                      onClick={() => openRedeem(item)}
                      disabled={!user || !canAfford || outOfStock}
                      className="btn-kasi w-full gap-2"
                      size="sm"
                    >
                      <Sparkles size={14} />
                      {outOfStock ? "Sold Out" : canAfford ? "Redeem" : `Need ${item.points_cost - points} more`}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Redemption history */}
          {user && redemptions.length > 0 && (
            <>
              <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
                <History size={20} /> RECENT REDEMPTIONS
              </h2>
              <div className="space-y-2 mb-12">
                {redemptions.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.reward_items?.image_emoji ?? "🎁"}</span>
                      <div>
                        <p className="text-sm font-bold text-foreground">{r.reward_items?.name ?? "Reward"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()} • -{r.points_spent} pts
                          {r.voucher_code && ` • Code: ${r.voucher_code}`}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      r.status === "fulfilled" ? "bg-kasi-green/20 text-kasi-green"
                      : r.status === "cancelled" ? "bg-fire/20 text-fire"
                      : "bg-kasi-gold/20 text-kasi-gold"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Redeem dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selected?.image_emoji}</span> Redeem {selected?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-muted/40 p-3 rounded-lg text-sm">
              <p>Cost: <span className="font-bold text-kasi-gold">{selected?.points_cost} points</span></p>
              <p>Balance after: <span className="font-bold">{points - (selected?.points_cost ?? 0)} pts</span></p>
            </div>
            {requiresPhone && (
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block flex items-center gap-1">
                  <Phone size={12} /> Mobile number
                </label>
                <Input
                  placeholder="0821234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="numeric"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                Notes (optional)
              </label>
              <Textarea
                placeholder="Pickup location, network, etc."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={confirmRedeem} disabled={submitting} className="btn-kasi gap-2">
              {submitting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              Confirm Redeem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Rewards;

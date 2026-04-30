import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Award, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Redemption {
  id: string;
  user_id: string;
  points_spent: number;
  status: "pending" | "fulfilled" | "cancelled";
  delivery_phone: string | null;
  delivery_notes: string | null;
  voucher_code: string | null;
  created_at: string;
  reward_items?: { name: string; image_emoji: string; category: string };
  profiles?: { first_name: string; last_name: string };
}

const AdminRewardsManager = () => {
  const [items, setItems] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "fulfilled" | "cancelled">("pending");
  const [codes, setCodes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reward_redemptions")
      .select("id, user_id, points_spent, status, delivery_phone, delivery_notes, voucher_code, created_at, reward_items(name, image_emoji, category)")
      .eq("status", filter)
      .order("created_at", { ascending: false })
      .limit(100);

    const list = (data ?? []) as any as Redemption[];
    if (list.length) {
      const ids = [...new Set(list.map((r) => r.user_id))];
      const { data: profs } = await supabase.from("profiles").select("id, first_name, last_name").in("id", ids);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p; });
      list.forEach((r) => { r.profiles = map[r.user_id]; });
    }
    setItems(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const update = async (id: string, status: "fulfilled" | "cancelled") => {
    const patch: any = { status };
    if (status === "fulfilled") {
      patch.fulfilled_at = new Date().toISOString();
      if (codes[id]) patch.voucher_code = codes[id];
    }
    const { error } = await supabase.from("reward_redemptions").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    load();
  };

  return (
    <div className="card-premium p-5">
      <h2 className="font-bold mb-3 flex items-center gap-2">
        <Award size={18} className="text-kasi-gold" /> Reward Redemptions
      </h2>

      <div className="flex gap-2 mb-4">
        {(["pending", "fulfilled", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm"><Loader2 className="animate-spin inline mr-2" size={14} />Loading…</div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {filter} redemptions.</p>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {items.map((r) => (
            <div key={r.id} className="p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{r.reward_items?.image_emoji}</span>
                  <div>
                    <p className="text-sm font-bold">{r.reward_items?.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {r.profiles?.first_name} {r.profiles?.last_name?.charAt(0)}. • {r.points_spent} pts • {new Date(r.created_at).toLocaleString("en-ZA")}
                    </p>
                  </div>
                </div>
              </div>
              {(r.delivery_phone || r.delivery_notes) && (
                <div className="text-xs text-muted-foreground mb-2 space-y-0.5">
                  {r.delivery_phone && <p>📞 {r.delivery_phone}</p>}
                  {r.delivery_notes && <p>📝 {r.delivery_notes}</p>}
                </div>
              )}
              {r.voucher_code && <p className="text-xs mb-2">Code: <span className="font-mono font-bold">{r.voucher_code}</span></p>}

              {filter === "pending" && (
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Voucher code (optional)"
                    value={codes[r.id] ?? ""}
                    onChange={(e) => setCodes({ ...codes, [r.id]: e.target.value })}
                    className="text-xs h-8"
                  />
                  <Button size="sm" onClick={() => update(r.id, "fulfilled")} className="btn-kasi gap-1 h-8">
                    <Check size={12} /> Fulfil
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => update(r.id, "cancelled")} className="gap-1 h-8">
                    <X size={12} /> Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRewardsManager;

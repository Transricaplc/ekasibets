import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Gift, Loader2, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Promo {
  id: string;
  code: string;
  description: string;
  bonus_amount: number;
  max_redemptions: number | null;
  total_redemptions: number;
  expires_at: string | null;
  active: boolean;
}

const AdminPromoManager = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("50");
  const [maxR, setMaxR] = useState("");
  const [days, setDays] = useState("30");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setPromos((data as Promo[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!code.trim() || !desc.trim() || !amount) return toast.error("Fill all required fields");
    setCreating(true);
    const expires = days ? new Date(Date.now() + Number(days) * 86400000).toISOString() : null;
    const { error } = await supabase.from("promo_codes").insert({
      code: code.trim().toUpperCase(),
      description: desc.trim(),
      bonus_amount: Number(amount),
      max_redemptions: maxR ? Number(maxR) : null,
      expires_at: expires,
      active: true,
    });
    setCreating(false);
    if (error) return toast.error(error.message);
    toast.success(`Promo ${code.toUpperCase()} created`);
    setCode(""); setDesc(""); setAmount("50"); setMaxR(""); setDays("30");
    load();
  };

  const toggle = async (p: Promo) => {
    const { error } = await supabase.from("promo_codes").update({ active: !p.active }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="card-premium p-5">
      <h2 className="font-bold mb-4 flex items-center gap-2">
        <Gift size={18} className="text-kasi-gold" /> Promo Codes
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
        <Input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="uppercase font-bold" />
        <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="col-span-2" />
        <Input placeholder="R amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Max uses" type="number" value={maxR} onChange={(e) => setMaxR(e.target.value)} />
      </div>
      <div className="flex gap-2 mb-5">
        <Input placeholder="Days valid" type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-32" />
        <Button onClick={create} disabled={creating} className="btn-kasi gap-2">
          {creating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Create
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground"><Loader2 className="animate-spin inline mr-2" size={14} /> Loading…</div>
      ) : promos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No promos yet.</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {promos.map((p) => (
            <div key={p.id} className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${p.active ? "border-border" : "border-border/30 opacity-60"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display tracking-wider">{p.code}</span>
                  <span className="text-kasi-gold font-bold text-sm">R{Number(p.bonus_amount).toFixed(0)}</span>
                  {!p.active && <span className="text-[10px] uppercase text-muted-foreground">paused</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                <p className="text-[10px] text-muted-foreground">
                  Redeemed {p.total_redemptions}{p.max_redemptions ? `/${p.max_redemptions}` : ""}
                  {p.expires_at && ` · Exp ${new Date(p.expires_at).toLocaleDateString("en-ZA")}`}
                </p>
              </div>
              <button onClick={() => toggle(p)} className="text-muted-foreground hover:text-foreground" title={p.active ? "Pause" : "Activate"}>
                <Power size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPromoManager;

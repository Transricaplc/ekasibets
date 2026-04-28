import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Shield, Lock } from "lucide-react";

interface Limits {
  daily_deposit_limit: number | null;
  weekly_deposit_limit: number | null;
  monthly_deposit_limit: number | null;
  daily_bet_limit: number | null;
  session_time_limit_min: number | null;
  self_exclusion_until: string | null;
}

const ResponsibleLimitsForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [excluding, setExcluding] = useState(false);
  const [limits, setLimits] = useState<Limits | null>(null);
  const [form, setForm] = useState({
    daily_deposit: "",
    weekly_deposit: "",
    monthly_deposit: "",
    daily_bet: "",
    session_minutes: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("user_limits")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setLimits(data as Limits);
        setForm({
          daily_deposit: data.daily_deposit_limit?.toString() ?? "",
          weekly_deposit: data.weekly_deposit_limit?.toString() ?? "",
          monthly_deposit: data.monthly_deposit_limit?.toString() ?? "",
          daily_bet: data.daily_bet_limit?.toString() ?? "",
          session_minutes: data.session_time_limit_min?.toString() ?? "",
        });
      }
      setLoading(false);
    })();
  }, [user]);

  const num = (v: string) => (v.trim() === "" ? null : Number(v));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.rpc("set_user_limits", {
      _daily_deposit: num(form.daily_deposit),
      _weekly_deposit: num(form.weekly_deposit),
      _monthly_deposit: num(form.monthly_deposit),
      _daily_bet: num(form.daily_bet),
      _session_minutes: num(form.session_minutes) as any,
      _self_exclude_days: null as any,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Limits saved");
  };

  const selfExclude = async (days: number) => {
    if (!confirm(`Self-exclude for ${days} days? You won't be able to bet until then.`)) return;
    setExcluding(true);
    const { error } = await supabase.rpc("set_user_limits", {
      _daily_deposit: null,
      _weekly_deposit: null,
      _monthly_deposit: null,
      _daily_bet: null,
      _session_minutes: null as any,
      _self_exclude_days: days as any,
    });
    setExcluding(false);
    if (error) return toast.error(error.message);
    toast.success(`Self-excluded for ${days} days`);
    setLimits((l) => ({ ...(l ?? {} as Limits), self_exclusion_until: new Date(Date.now() + days * 86400000).toISOString() }));
  };

  if (!user) return <p className="text-sm text-muted-foreground">Sign in to manage limits.</p>;
  if (loading) return <div className="text-muted-foreground"><Loader2 className="animate-spin inline mr-2" size={16} /> Loading…</div>;

  const excludedUntil = limits?.self_exclusion_until ? new Date(limits.self_exclusion_until) : null;
  const isExcluded = excludedUntil && excludedUntil > new Date();

  return (
    <div className="card-premium p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Shield className="text-primary" size={20} />
        <h3 className="font-display text-xl">My Limits</h3>
      </div>

      {isExcluded && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm flex items-center gap-2">
          <Lock size={16} /> Self-excluded until {excludedUntil!.toLocaleDateString("en-ZA")}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { k: "daily_deposit", label: "Daily Deposit Limit (R)" },
          { k: "weekly_deposit", label: "Weekly Deposit Limit (R)" },
          { k: "monthly_deposit", label: "Monthly Deposit Limit (R)" },
          { k: "daily_bet", label: "Daily Bet Limit (R)" },
          { k: "session_minutes", label: "Session Time Limit (min)" },
        ].map((f) => (
          <label key={f.k} className="block">
            <span className="text-xs text-muted-foreground uppercase">{f.label}</span>
            <input
              type="number"
              min="0"
              value={(form as any)[f.k]}
              onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              placeholder="No limit"
              className="mt-1 w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </label>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="btn-kasi px-6 py-2 text-sm">
        {saving ? <Loader2 className="animate-spin inline mr-2" size={14} /> : null} Save Limits
      </button>

      <div className="pt-4 border-t border-border">
        <h4 className="font-bold text-sm mb-2">Take a Break</h4>
        <p className="text-xs text-muted-foreground mb-3">Pause your account. You can't bet during this period.</p>
        <div className="flex flex-wrap gap-2">
          {[1, 7, 30, 180].map((d) => (
            <button
              key={d}
              onClick={() => selfExclude(d)}
              disabled={excluding}
              className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-destructive hover:text-destructive transition-colors"
            >
              {d === 180 ? "6 months" : d === 1 ? "24 hrs" : `${d} days`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsibleLimitsForm;

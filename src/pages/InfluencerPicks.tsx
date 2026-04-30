import { useEffect, useState } from "react";
import { Loader2, Mic, Lock, Zap, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Pick {
  id: string;
  prediction: string;
  confidence: "lock" | "solid" | "risky";
  reasoning: string | null;
  created_at: string;
  influencer: { name: string; handle: string; platform: string; image_url: string | null; category: string } | null;
  match: { home_team: string; away_team: string; start_time: string } | null;
}

const confMeta = {
  lock:   { label: "Lock",   icon: Lock,           color: "bg-success/15 text-success border-success/40" },
  solid:  { label: "Solid",  icon: Zap,            color: "bg-primary/15 text-primary border-primary/40" },
  risky:  { label: "Risky",  icon: AlertTriangle,  color: "bg-fire/15 text-fire border-fire/40" },
};

const InfluencerPicks = () => {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "lock" | "solid" | "risky">("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("influencer_picks")
        .select("id,prediction,confidence,reasoning,created_at, influencer:influencers(name,handle,platform,image_url,category), match:matches(home_team,away_team,start_time)")
        .order("created_at", { ascending: false })
        .limit(50);
      setPicks((data ?? []) as any);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === "all" ? picks : picks.filter((p) => p.confidence === filter);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-24">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary mb-1">Influencer Picks</p>
        <h1 className="font-display text-3xl md:text-4xl">The Word On <span className="gradient-text">The Street</span></h1>
        <p className="text-muted-foreground mt-2 text-sm">Predictions from real bettors and township voices. Not financial advice — bet responsibly.</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "lock", "solid", "risky"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide ${
              filter === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading picks…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No picks yet.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const meta = confMeta[p.confidence];
            const Icon = meta.icon;
            return (
              <div key={p.id} className="card-premium p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Mic size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-bold text-sm">{p.influencer?.name ?? "Unknown"}</p>
                        <p className="text-[11px] text-muted-foreground">@{p.influencer?.handle} · {p.influencer?.platform}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-md border uppercase font-bold tracking-wide flex items-center gap-1 ${meta.color}`}>
                        <Icon size={11} /> {meta.label}
                      </span>
                    </div>
                    {p.match && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {p.match.home_team} vs {p.match.away_team}
                      </p>
                    )}
                    <p className="font-display text-base mt-1">{p.prediction}</p>
                    {p.reasoning && <p className="text-sm text-foreground/80 mt-2 italic">"{p.reasoning}"</p>}
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
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

export default InfluencerPicks;

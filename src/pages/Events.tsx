import { useEffect, useState } from "react";
import { Loader2, MapPin, Calendar, Ticket, Gift, Music2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface EventRow {
  id: string; title: string; venue: string; city: string; event_date: string;
  ticket_url: string | null; ekasibets_presence: boolean; promo_code: string | null;
  image_url: string | null; description: string | null;
  artist: { name: string; tier: string } | null;
}

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("id,title,venue,city,event_date,ticket_url,ekasibets_presence,promo_code,image_url,description, artist:artists(name,tier)")
        .gte("event_date", new Date().toISOString())
        .order("event_date");
      setEvents((data ?? []) as any);
      setLoading(false);
    })();
  }, []);

  const claimPromo = async (code: string) => {
    if (!user) { toast.error("Sign in to claim bonus"); return; }
    setClaiming(code);
    const { data, error } = await supabase.rpc("redeem_promo_code", { _code: code });
    setClaiming(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`R${(data as any)?.bonus} bonus credited!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary mb-1">Events & Tours</p>
        <h1 className="font-display text-3xl md:text-4xl">eKasiBets <span className="gradient-text">Live</span></h1>
        <p className="text-muted-foreground mt-2 text-sm">Wherever the music plays, we're there. Claim exclusive bonuses at events.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading events…</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No upcoming events.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((e) => {
            const dt = new Date(e.event_date);
            return (
              <div key={e.id} className="card-premium p-5 relative overflow-hidden">
                {e.ekasibets_presence && (
                  <div className="absolute top-0 right-0 bg-fire text-fire-foreground text-[10px] font-bold uppercase px-2 py-1 rounded-bl-lg">
                    eKasiBets Presents
                  </div>
                )}
                <h3 className="font-display text-xl mb-2">{e.title}</h3>
                {e.artist && (
                  <p className="text-sm text-primary mb-3 flex items-center gap-1.5">
                    <Music2 size={14} /> {e.artist.name}
                    {e.artist.tier !== "none" && <span className="text-[10px] uppercase opacity-70">· {e.artist.tier}</span>}
                  </p>
                )}
                <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  <p className="flex items-center gap-2"><MapPin size={14} /> {e.venue}, {e.city}</p>
                  <p className="flex items-center gap-2"><Calendar size={14} /> {dt.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                {e.description && <p className="text-sm text-foreground/80 mb-4">{e.description}</p>}
                {e.promo_code && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
                    <p className="text-xs text-muted-foreground">Use code at this event:</p>
                    <p className="font-display text-lg gradient-text-gold">{e.promo_code}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {e.ticket_url && (
                    <a href={e.ticket_url} target="_blank" rel="noreferrer" className="btn-ghost flex-1 text-xs flex items-center justify-center gap-1.5">
                      <Ticket size={14} /> Tickets
                    </a>
                  )}
                  {e.promo_code && (
                    <button
                      onClick={() => claimPromo(e.promo_code!)}
                      disabled={claiming === e.promo_code}
                      className="btn-kasi flex-1 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Gift size={14} /> {claiming === e.promo_code ? "Claiming…" : "Claim Bonus"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        18+. <Link to="/responsible-gaming" className="text-primary hover:underline">Play responsibly</Link>.
      </p>
    </div>
  );
};

export default Events;

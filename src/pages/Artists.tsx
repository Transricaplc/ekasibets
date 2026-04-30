import { useEffect, useState } from "react";
import { Loader2, Crown, Star, Users, Heart, HeartOff, Instagram } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Artist {
  id: string; name: string; genre: string; bio: string | null; image_url: string | null;
  instagram_handle: string | null; tier: "platinum" | "gold" | "community" | "none";
}

const tierMeta = {
  platinum: { label: "Platinum Ambassador", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40", icon: Crown },
  gold: { label: "Gold Ambassador", color: "bg-amber-600/15 text-amber-400 border-amber-600/40", icon: Star },
  community: { label: "Community Voice", color: "bg-primary/15 text-primary border-primary/40", icon: Users },
  none: { label: "", color: "", icon: Users },
} as const;

const Artists = () => {
  const { user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [follows, setFollows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadFollows = async (uid: string) => {
    const { data } = await supabase.from("artist_follows").select("artist_id").eq("user_id", uid);
    setFollows(new Set((data ?? []).map((r: any) => r.artist_id)));
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("artists").select("*").eq("active", true).order("tier");
      setArtists((data ?? []) as Artist[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => { if (user) loadFollows(user.id); }, [user]);

  const toggleFollow = async (artistId: string) => {
    if (!user) { toast.error("Sign in to follow artists"); return; }
    if (follows.has(artistId)) {
      await supabase.from("artist_follows").delete().eq("user_id", user.id).eq("artist_id", artistId);
      setFollows((s) => { const n = new Set(s); n.delete(artistId); return n; });
      toast.success("Unfollowed");
    } else {
      const { error } = await supabase.from("artist_follows").insert({ user_id: user.id, artist_id: artistId });
      if (error) { toast.error(error.message); return; }
      setFollows((s) => new Set(s).add(artistId));
      toast.success("Following");
    }
  };

  const grouped: Record<string, Artist[]> = { platinum: [], gold: [], community: [], none: [] };
  artists.forEach((a) => grouped[a.tier].push(a));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary mb-1">Ambassadors</p>
        <h1 className="font-display text-3xl md:text-4xl">Our <span className="gradient-text">Artists</span></h1>
        <p className="text-muted-foreground mt-2 text-sm">The voices and beats of eKasiBets. Follow your favourites for event drops & promo codes.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
      ) : (
        (["platinum", "gold", "community"] as const).map((tier) => grouped[tier].length > 0 && (
          <section key={tier} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {(() => { const Icon = tierMeta[tier].icon; return <Icon size={18} className="text-primary" />; })()}
              <h2 className="font-display text-xl">{tierMeta[tier].label}s</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[tier].map((a) => {
                const isFollowing = follows.has(a.id);
                const meta = tierMeta[a.tier];
                return (
                  <div key={a.id} className="card-premium p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-display text-lg">{a.name}</h3>
                        <p className="text-xs text-muted-foreground">{a.genre}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-md border uppercase font-bold tracking-wide ${meta.color}`}>{tier}</span>
                    </div>
                    {a.bio && <p className="text-sm text-foreground/80 mb-4">{a.bio}</p>}
                    <div className="flex items-center justify-between gap-2">
                      {a.instagram_handle && (
                        <a href={`https://instagram.com/${a.instagram_handle.replace("@", "")}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                          <Instagram size={12} /> {a.instagram_handle}
                        </a>
                      )}
                      <button
                        onClick={() => toggleFollow(a.id)}
                        className={`ml-auto text-xs font-bold uppercase px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                          isFollowing ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {isFollowing ? <><HeartOff size={12} /> Following</> : <><Heart size={12} /> Follow</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Artists;

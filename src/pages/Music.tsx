import { useEffect, useState } from "react";
import { Loader2, Music2, Play, Pause, ListMusic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMusicPlayer, Playlist } from "@/contexts/MusicPlayerContext";

const Music = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { playlist: current, isPlaying, loadPlaylist, toggle } = useMusicPlayer();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("playlists")
        .select("id,name,curated_by,mood,image_url, tracks(id,title,artist_name,audio_url,duration,display_order)")
        .eq("active", true)
        .order("created_at");
      const rows = (data ?? []).map((p: any) => ({
        ...p,
        tracks: (p.tracks ?? []).sort((a: any, b: any) => a.display_order - b.display_order),
      })) as Playlist[];
      setPlaylists(rows);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary mb-1">Music</p>
        <h1 className="font-display text-3xl md:text-4xl">Bet With <span className="gradient-text">The Beat</span></h1>
        <p className="text-muted-foreground mt-2 text-sm">Curated playlists by your favourite Amapiano stars. Press play and grind.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading playlists…</div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No playlists yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((p) => {
            const isThis = current?.id === p.id;
            return (
              <div key={p.id} className="card-premium p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-fire flex items-center justify-center text-primary-foreground shrink-0">
                    <Music2 size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg leading-tight">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Curated by {p.curated_by}</p>
                    {p.mood && <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wide text-primary">{p.mood}</span>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                  <ListMusic size={12} /> {p.tracks.length} tracks
                </div>
                <button
                  onClick={() => (isThis ? toggle() : loadPlaylist(p, 0))}
                  disabled={p.tracks.length === 0}
                  className="btn-kasi w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isThis && isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> {isThis ? "Resume" : "Play playlist"}</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Music;

import { Play, Pause, SkipBack, SkipForward, X, Music2 } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

const MiniPlayer = () => {
  const { playlist, currentIndex, isPlaying, loaded, toggle, next, prev, stop } = useMusicPlayer();
  if (!playlist || playlist.tracks.length === 0) return null;
  const track = playlist.tracks[currentIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-30 bg-card/95 backdrop-blur border-t border-border shadow-lg">
      <div className="px-4 py-2.5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center text-primary shrink-0">
          <Music2 size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{track?.title}</p>
          <p className="text-[11px] text-muted-foreground truncate">
            {track?.artist_name} · {playlist.name} · curated by {playlist.curated_by}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="p-2 rounded-md hover:bg-muted text-foreground" aria-label="Previous">
            <SkipBack size={16} />
          </button>
          <button
            onClick={toggle}
            disabled={!loaded}
            className="p-2.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={next} className="p-2 rounded-md hover:bg-muted text-foreground" aria-label="Next">
            <SkipForward size={16} />
          </button>
          <button onClick={stop} className="p-2 rounded-md hover:bg-muted text-muted-foreground ml-1" aria-label="Close">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;

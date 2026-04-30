import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from "react";
import { Howl } from "howler";

export interface Track {
  id: string;
  title: string;
  artist_name: string;
  audio_url: string;
  duration: number;
}
export interface Playlist {
  id: string;
  name: string;
  curated_by: string;
  mood: string | null;
  image_url: string | null;
  tracks: Track[];
}

interface Ctx {
  playlist: Playlist | null;
  currentIndex: number;
  isPlaying: boolean;
  loaded: boolean;
  loadPlaylist: (p: Playlist, index?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
}

const MusicCtx = createContext<Ctx | null>(null);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  const cleanup = () => {
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
  };

  useEffect(() => {
    if (!playlist || playlist.tracks.length === 0) return;
    cleanup();
    setLoaded(false);
    const track = playlist.tracks[currentIndex];
    if (!track) return;
    const howl = new Howl({
      src: [track.audio_url],
      html5: true,
      volume: 0.7,
      onload: () => setLoaded(true),
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setCurrentIndex((i) => (i + 1) % playlist.tracks.length);
      },
      onloaderror: () => setLoaded(true), // unblock UI even on error
    });
    howlRef.current = howl;
    howl.play();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist?.id, currentIndex]);

  const loadPlaylist = useCallback((p: Playlist, index = 0) => {
    setPlaylist(p);
    setCurrentIndex(index);
  }, []);

  const toggle = useCallback(() => {
    const h = howlRef.current;
    if (!h) return;
    if (h.playing()) h.pause();
    else h.play();
  }, []);

  const next = useCallback(() => {
    if (!playlist) return;
    setCurrentIndex((i) => (i + 1) % playlist.tracks.length);
  }, [playlist]);

  const prev = useCallback(() => {
    if (!playlist) return;
    setCurrentIndex((i) => (i - 1 + playlist.tracks.length) % playlist.tracks.length);
  }, [playlist]);

  const stop = useCallback(() => {
    cleanup();
    setPlaylist(null);
    setIsPlaying(false);
  }, []);

  return (
    <MusicCtx.Provider value={{ playlist, currentIndex, isPlaying, loaded, loadPlaylist, toggle, next, prev, stop }}>
      {children}
    </MusicCtx.Provider>
  );
};

export const useMusicPlayer = () => {
  const ctx = useContext(MusicCtx);
  if (!ctx) throw new Error("useMusicPlayer must be inside MusicPlayerProvider");
  return ctx;
};

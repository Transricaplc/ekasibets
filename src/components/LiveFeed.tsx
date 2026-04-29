import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Send, Trash2, Lightbulb, MessageSquare, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ReactionType = "fire" | "laugh" | "clap" | "skull";
const REACTIONS: { key: ReactionType; emoji: string }[] = [
  { key: "fire", emoji: "🔥" },
  { key: "laugh", emoji: "😂" },
  { key: "clap", emoji: "👏" },
  { key: "skull", emoji: "💀" },
];

interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: "text" | "tip" | "bet_share";
  shared_bet_id: string | null;
  created_at: string;
  author?: string;
}
interface Reaction {
  post_id: string;
  user_id: string;
  reaction: ReactionType;
}

const timeAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const LiveFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"text" | "tip">("text");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadAuthors = async (userIds: string[]) => {
    if (userIds.length === 0) return {};
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", userIds);
    const map: Record<string, string> = {};
    (data ?? []).forEach((p: any) => {
      map[p.id] = `${p.first_name} ${(p.last_name || "").charAt(0)}.`.trim();
    });
    return map;
  };

  const load = async () => {
    setLoading(true);
    const { data: postRows } = await supabase
      .from("community_posts")
      .select("id, user_id, content, post_type, shared_bet_id, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    const list = (postRows ?? []) as Post[];
    const ids = [...new Set(list.map((p) => p.user_id))];
    const authors = await loadAuthors(ids);
    setPosts(list.map((p) => ({ ...p, author: authors[p.user_id] ?? "Anon" })));

    if (list.length) {
      const { data: rxs } = await supabase
        .from("post_reactions")
        .select("post_id, user_id, reaction")
        .in("post_id", list.map((p) => p.id));
      setReactions((rxs ?? []) as Reaction[]);
    } else {
      setReactions([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Realtime: new posts + reactions
  useEffect(() => {
    const ch = supabase
      .channel("community-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_posts" },
        async (payload) => {
          const newPost = payload.new as Post;
          const authors = await loadAuthors([newPost.user_id]);
          setPosts((prev) => [{ ...newPost, author: authors[newPost.user_id] ?? "Anon" }, ...prev].slice(0, 50));
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "community_posts" },
        (payload) => setPosts((prev) => prev.filter((p) => p.id !== (payload.old as any).id)))
      .on("postgres_changes", { event: "*", schema: "public", table: "post_reactions" },
        () => {
          // simple refetch of reactions
          supabase.from("post_reactions").select("post_id, user_id, reaction").then(({ data }) => {
            if (data) setReactions(data as Reaction[]);
          });
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, Record<ReactionType, number>> = {};
    reactions.forEach((r) => {
      if (!map[r.post_id]) map[r.post_id] = { fire: 0, laugh: 0, clap: 0, skull: 0 };
      map[r.post_id][r.reaction]++;
    });
    return map;
  }, [reactions]);

  const myReactions = useMemo(() => {
    if (!user) return {};
    const map: Record<string, ReactionType> = {};
    reactions.forEach((r) => { if (r.user_id === user.id) map[r.post_id] = r.reaction; });
    return map;
  }, [reactions, user]);

  const submit = async () => {
    if (!user) { toast.error("Sign in to post"); return; }
    const text = content.trim();
    if (!text) return;
    if (text.length > 500) { toast.error("Max 500 characters"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id, content: text, post_type: postType,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setContent("");
    toast.success("Posted!");
  };

  const react = async (postId: string, type: ReactionType) => {
    if (!user) { toast.error("Sign in to react"); return; }
    const existing = myReactions[postId];
    if (existing === type) {
      await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", user.id);
    } else if (existing) {
      await supabase.from("post_reactions").update({ reaction: type }).eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_reactions").insert({ post_id: postId, user_id: user.id, reaction: type });
    }
  };

  const remove = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("community_posts").delete().eq("id", postId);
    if (error) toast.error(error.message);
  };

  return (
    <div>
      {/* Composer */}
      <div className="card-premium p-4 mb-4">
        {user ? (
          <>
            <Textarea
              placeholder="Share your tip, brag a win, or talk kak about the derby…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={3}
              className="resize-none mb-3"
            />
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => setPostType("text")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${postType === "text" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  <MessageSquare size={12} /> Chat
                </button>
                <button
                  onClick={() => setPostType("tip")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${postType === "tip" ? "bg-kasi-gold text-background" : "bg-muted text-muted-foreground"}`}
                >
                  <Lightbulb size={12} /> Tip
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{content.length}/500</span>
                <Button onClick={submit} disabled={submitting || !content.trim()} className="btn-kasi gap-2" size="sm">
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} Post
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            <Link to="/auth" className="text-primary hover:underline font-bold">Sign in</Link> to join the conversation.
          </p>
        )}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading feed…</div>
      ) : posts.length === 0 ? (
        <div className="card-premium p-8 text-center text-muted-foreground">No posts yet. Be the first to share!</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const c = counts[p.id] ?? { fire: 0, laugh: 0, clap: 0, skull: 0 };
            const mine = myReactions[p.id];
            return (
              <div key={p.id} className="card-premium p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                      {p.author?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight">{p.author}</p>
                      <p className="text-[10px] text-muted-foreground">{timeAgo(p.created_at)}</p>
                    </div>
                    {p.post_type === "tip" && (
                      <span className="px-2 py-0.5 rounded-full bg-kasi-gold/20 text-kasi-gold text-[10px] font-bold uppercase flex items-center gap-1">
                        <Lightbulb size={10} /> Tip
                      </span>
                    )}
                    {p.post_type === "bet_share" && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase flex items-center gap-1">
                        <Receipt size={10} /> Bet
                      </span>
                    )}
                  </div>
                  {user?.id === p.user_id && (
                    <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-3">{p.content}</p>
                <div className="flex gap-1 flex-wrap">
                  {REACTIONS.map((r) => {
                    const count = c[r.key];
                    const active = mine === r.key;
                    return (
                      <button
                        key={r.key}
                        onClick={() => react(p.id, r.key)}
                        className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 transition-all ${
                          active ? "bg-primary/20 border border-primary text-foreground" : "bg-muted/40 border border-transparent hover:border-primary/30"
                        }`}
                      >
                        <span>{r.emoji}</span>
                        {count > 0 && <span className="font-bold">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveFeed;

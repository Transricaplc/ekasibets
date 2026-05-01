import { Link } from "react-router-dom";
import { Bell, Check, Trophy, Gift, Megaphone, Info, Calendar, Loader2 } from "lucide-react";
import { useNotifications, NotificationRow } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";

const iconFor = (t: NotificationRow["type"]) => {
  switch (t) {
    case "bet_settled": return Trophy;
    case "redemption": return Gift;
    case "promo": return Megaphone;
    case "event": return Calendar;
    default: return Info;
  }
};

const Notifications = () => {
  const { user } = useAuth();
  const { items, loading, unread, markAllRead, markRead } = useNotifications(100);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <Bell size={32} className="mx-auto text-muted-foreground mb-3" />
        <h1 className="font-display text-2xl mb-2">Sign in to view notifications</h1>
        <Link to="/auth" className="btn-kasi inline-block mt-4">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-primary mb-1">Inbox</p>
          <h1 className="font-display text-3xl">Notifications</h1>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-xs flex items-center gap-1.5">
            <Check size={14} /> Mark all read ({unread})
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="animate-spin inline mr-2" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <Bell size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No notifications yet. Place a bet or claim a reward to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const Icon = iconFor(n.type);
            const unreadItem = !n.read_at;
            const inner = (
              <div className={`flex gap-3 p-4 rounded-xl border transition-all ${unreadItem ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border/50"}`}>
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${unreadItem ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                  <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                    {new Date(n.created_at).toLocaleString("en-ZA")}
                  </p>
                </div>
                {unreadItem && <span className="w-2 h-2 rounded-full bg-fire flex-shrink-0 mt-2" />}
              </div>
            );
            return n.link ? (
              <Link key={n.id} to={n.link} onClick={() => markRead(n.id)} className="block">{inner}</Link>
            ) : (
              <button key={n.id} onClick={() => markRead(n.id)} className="block w-full text-left">{inner}</button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;

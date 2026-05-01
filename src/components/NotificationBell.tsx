import { Bell, Check, Trophy, Gift, Megaphone, Info, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications, NotificationRow } from "@/hooks/useNotifications";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

const NotificationBell = () => {
  const { user } = useAuth();
  const { items, unread, markAllRead, markRead } = useNotifications(15);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
        <Bell size={18} className="text-foreground" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-fire text-fire-foreground text-[10px] font-bold flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-y-auto bg-popover p-0">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <span className="font-display text-sm">Notifications</span>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Check size={12} /> Mark all read
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">No notifications yet</div>
        ) : (
          <div>
            {items.map((n) => {
              const Icon = iconFor(n.type);
              const unreadItem = !n.read_at;
              const Body = (
                <div className={`flex gap-3 p-3 border-b border-border/50 hover:bg-muted/40 transition-colors ${unreadItem ? "bg-primary/5" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${unreadItem ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                    {n.body && <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.created_at)} ago</p>
                  </div>
                  {unreadItem && <span className="w-2 h-2 rounded-full bg-fire flex-shrink-0 mt-1.5" />}
                </div>
              );
              return n.link ? (
                <Link key={n.id} to={n.link} onClick={() => markRead(n.id)}>{Body}</Link>
              ) : (
                <button key={n.id} onClick={() => markRead(n.id)} className="w-full text-left">{Body}</button>
              );
            })}
          </div>
        )}

        <Link to="/notifications" className="block text-center text-xs text-primary hover:underline py-2 border-t border-border">
          View all
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;

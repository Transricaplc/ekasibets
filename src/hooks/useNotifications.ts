import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface NotificationRow {
  id: string;
  type: "bet_settled" | "redemption" | "promo" | "system" | "event";
  title: string;
  body: string | null;
  link: string | null;
  metadata: any;
  read_at: string | null;
  created_at: string;
}

export const useNotifications = (limit = 30) => {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    setItems((data ?? []) as any);
    setLoading(false);
  }, [user, limit]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`notif-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, load]);

  const unread = items.filter((n) => !n.read_at).length;

  const markAllRead = useCallback(async () => {
    if (unread === 0) return;
    await supabase.rpc("mark_notifications_read", { _ids: null as any });
    load();
  }, [unread, load]);

  const markRead = useCallback(async (id: string) => {
    await supabase.rpc("mark_notifications_read", { _ids: [id] });
    load();
  }, [load]);

  return { items, loading, unread, markAllRead, markRead, reload: load };
};

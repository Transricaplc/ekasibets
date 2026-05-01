import { useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminBroadcast = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<"promo" | "system" | "event">("promo");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!title.trim()) { toast.error("Title required"); return; }
    setSending(true);
    const { data, error } = await supabase.rpc("broadcast_notification", {
      _title: title, _body: body || null, _link: link || null, _type: type,
    });
    setSending(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Sent to ${data} users`);
    setTitle(""); setBody(""); setLink("");
  };

  return (
    <div className="card-premium p-5">
      <h3 className="font-display text-lg mb-4 flex items-center gap-2">
        <Megaphone size={18} className="text-primary" /> Broadcast Notification
      </h3>
      <div className="space-y-3">
        <input
          className="input-kasi w-full"
          placeholder="Title (e.g. 🎉 Weekend boost — 2x odds!)"
          value={title} onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input-kasi w-full min-h-[80px]"
          placeholder="Body (optional)"
          value={body} onChange={(e) => setBody(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="input-kasi"
            placeholder="Link (e.g. /promotions)"
            value={link} onChange={(e) => setLink(e.target.value)}
          />
          <select className="input-kasi" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="promo">Promo</option>
            <option value="event">Event</option>
            <option value="system">System</option>
          </select>
        </div>
        <button onClick={send} disabled={sending} className="btn-kasi w-full text-sm flex items-center justify-center gap-2">
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Megaphone size={14} />}
          Send to all users
        </button>
      </div>
    </div>
  );
};

export default AdminBroadcast;

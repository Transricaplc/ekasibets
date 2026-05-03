import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "ekasi_install_dismissed_at";
const DISMISS_DAYS = 14;

const InstallPrompt = () => {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const last = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (last && Date.now() - last < DISMISS_DAYS * 86400000) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Hide once installed
    window.addEventListener("appinstalled", () => setVisible(false));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    setVisible(false);
    setEvt(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-40 card-premium p-4 shadow-2xl border-primary/40 animate-in slide-in-from-bottom-2">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Download className="text-primary" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm">Install eKasibets</p>
          <p className="text-xs text-muted-foreground mb-2">
            Save data, get faster loads, and bet offline-ready.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={install}>Install</Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>Not now</Button>
          </div>
        </div>
        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;

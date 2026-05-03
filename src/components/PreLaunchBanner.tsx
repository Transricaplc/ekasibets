import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const KEY = "ekasi_prelaunch_dismissed";

const PreLaunchBanner = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="bg-warning/15 border-b border-warning/40 text-foreground text-xs px-4 py-2">
      <div className="container mx-auto flex items-start gap-3">
        <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" />
        <p className="flex-1 leading-relaxed">
          <strong className="font-bold">Pre-launch notice:</strong> eKasiBets is in early-stage development.
          Our Provincial Bookmaker's Licence application (WCGRB) is in progress and no real-money wagers
          will be accepted until it's granted. Featured artists, ambassadors and influencers shown on this
          site are <em>desired partners</em> — formal partnerships are still being negotiated. All content
          is for preview purposes only.
        </p>
        <button onClick={dismiss} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default PreLaunchBanner;

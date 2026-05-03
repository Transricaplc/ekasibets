import { useEffect, useState } from "react";
import { ShieldAlert, Phone, AlertTriangle, Sparkles } from "lucide-react";

const COOKIE_NAME = "ekasi_age_verified";
const COOKIE_DAYS = 30;

const setCookie = (name: string, value: string, days: number) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string) => {
  return document.cookie.split("; ").find((r) => r.startsWith(name + "="))?.split("=")[1];
};

const AgeGate = () => {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dob, setDob] = useState("");

  useEffect(() => {
    setVerified(getCookie(COOKIE_NAME) === "1");
  }, []);

  const confirm = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const age = (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000);
    if (age < 18 || isNaN(age)) {
      setError("You must be 18 or older to access eKasibets. Please call NCPG 0800 006 008 for support.");
      return;
    }
    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    setVerified(true);
  };

  const block = () => {
    setError("Access denied. eKasibets is strictly for adults aged 18 and over.");
  };

  if (verified === null || verified) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      className="fixed inset-0 z-[100] bg-pitch/95 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md card-kasi text-center max-h-[95vh] overflow-y-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/15 flex items-center justify-center">
          <ShieldAlert className="text-primary" size={32} />
        </div>
        <h1 id="agegate-title" className="font-display text-3xl mb-2">18+ Only</h1>
        <p className="text-sm text-muted-foreground mb-4">
          eKasiBets is a South African sports betting platform. By law (NGA 7 of 2004), you must be 18 or older to enter.
        </p>

        {/* Pre-launch + partner disclosures (mandatory read at the gate) */}
        <div className="text-left space-y-2 mb-4">
          <div className="flex items-start gap-2 text-xs bg-warning/10 border border-warning/40 text-foreground px-3 py-2 rounded-lg">
            <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" />
            <p>
              <strong className="font-bold">Pre-launch notice:</strong> eKasiBets is in early-stage development.
              Our Provincial Bookmaker's Licence application (WCGRB) is in progress and{" "}
              <strong>no real-money wagers will be accepted</strong> until it's granted.
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs bg-primary/10 border border-primary/40 text-foreground px-3 py-2 rounded-lg">
            <Sparkles size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <p>
              <strong className="font-bold">Desired partners:</strong> Artists, ambassadors and influencers shown
              on the site are <em>desired partners</em>. Formal endorsements and partnerships are still being
              negotiated. All content is for preview purposes only.
            </p>
          </div>
        </div>

        <label className="block text-left text-xs uppercase tracking-wider text-muted-foreground mb-1">
          Date of birth
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => { setDob(e.target.value); setError(null); }}
          className="w-full px-3 py-2.5 mb-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary"
        />

        {error && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-2 mb-3">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button onClick={block} className="flex-1 btn-ghost text-xs py-3">I'm under 18</button>
          <button onClick={confirm} className="flex-1 btn-kasi text-xs py-3">I'm 18 or older — I understand</button>
        </div>

        <div className="mt-5 pt-4 border-t border-border text-[11px] text-muted-foreground">
          <p className="mb-1">Bet responsibly. National Responsible Gambling Programme:</p>
          <a href="tel:0800006008" className="inline-flex items-center gap-1.5 text-success font-bold">
            <Phone size={12} /> 0800 006 008
          </a>
          <p className="mt-2 opacity-70">Licence: WCGRB Bookmaker (application in progress) · Operated by Transrica PLC. T&Cs apply.</p>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;

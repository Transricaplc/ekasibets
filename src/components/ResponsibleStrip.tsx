import { Phone, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const ResponsibleStrip = () => {
  return (
    <div className="bg-pitch border-t border-border text-[11px] py-2 px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
          <Shield size={12} className="text-primary" /> 18+ Only
        </span>
        <span>Bet responsibly. T&Cs apply.</span>
        <Link to="/responsible-gaming" className="text-primary hover:underline font-bold">Self-exclude</Link>
        <a href="tel:0800006008" className="inline-flex items-center gap-1 text-success font-bold">
          <Phone size={11} /> NCPG 0800 006 008
        </a>
        <span className="opacity-70">Licence: WCGRB (pending) · Operated by Transrica PLC</span>
      </div>
    </div>
  );
};

export default ResponsibleStrip;

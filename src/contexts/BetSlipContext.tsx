import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

export interface BetSlipItem {
  selectionId: string;
  matchId: string;
  marketId: string;
  matchLabel: string;   // "Chiefs vs Pirates"
  marketName: string;   // "Match Result"
  selectionLabel: string; // "Home" / "Draw" / "Away"
  odds: number;
}

interface BetSlipCtx {
  items: BetSlipItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: (item: BetSlipItem) => void;
  remove: (selectionId: string) => void;
  clear: () => void;
  has: (selectionId: string) => boolean;
  updateOdds: (selectionId: string, odds: number) => void;
  totalOdds: number;
}

const Ctx = createContext<BetSlipCtx | null>(null);

export const BetSlipProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BetSlipItem[]>([]);
  const [open, setOpen] = useState(false);

  const toggle = useCallback((item: BetSlipItem) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.selectionId === item.selectionId);
      if (exists) return prev.filter((p) => p.selectionId !== item.selectionId);
      // Replace any existing selection from the same market (can only pick one outcome per market)
      const filtered = prev.filter((p) => p.marketId !== item.marketId);
      return [...filtered, item];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((selectionId: string) => {
    setItems((prev) => prev.filter((p) => p.selectionId !== selectionId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((selectionId: string) => items.some((i) => i.selectionId === selectionId), [items]);
  const updateOdds = useCallback((selectionId: string, odds: number) => {
    setItems((prev) => prev.map((i) => (i.selectionId === selectionId ? { ...i, odds } : i)));
  }, []);

  const totalOdds = useMemo(
    () => Number(items.reduce((acc, i) => acc * i.odds, 1).toFixed(2)),
    [items]
  );

  return (
    <Ctx.Provider value={{ items, open, setOpen, toggle, remove, clear, has, updateOdds, totalOdds }}>
      {children}
    </Ctx.Provider>
  );
};

export const useBetSlip = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBetSlip must be used inside BetSlipProvider");
  return ctx;
};

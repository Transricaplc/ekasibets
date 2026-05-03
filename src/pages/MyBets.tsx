import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Trophy, Banknote, Download, FileText, Filter, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { buildBetShareText, shareToWhatsApp } from "@/lib/share";

interface BetRow {
  id: string;
  reference: string;
  type: string;
  stake: number;
  total_odds: number;
  potential_payout: number;
  payout: number | null;
  status: string;
  placed_at: string;
  bet_selections: {
    odds_snapshot: number;
    result: string | null;
    selection: { label: string } | null;
    market: { name: string } | null;
    match: { home_team: string; away_team: string } | null;
  }[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

const STATUS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  won: { label: "Won", variant: "default" },
  lost: { label: "Lost", variant: "destructive" },
  void: { label: "Void", variant: "outline" },
  cashed_out: { label: "Cashed Out", variant: "outline" },
};

const MyBets = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<BetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cashingOut, setCashingOut] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("bets")
      .select(`
        id, reference, type, stake, total_odds, potential_payout, payout, status, placed_at,
        bet_selections(
          odds_snapshot, result,
          selection:selections(label),
          market:markets(name),
          match:matches(home_team, away_team)
        )
      `)
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false })
      .limit(500);
    setBets((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const cashOut = async (betId: string) => {
    if (!confirm("Cash out this bet now? You'll receive the current value, not the full potential payout.")) return;
    setCashingOut(betId);
    const { data, error } = await supabase.rpc("cash_out_bet", { _bet_id: betId });
    setCashingOut(null);
    if (error) return toast.error(error.message);
    const value = (data as any)?.cashout;
    toast.success(`Cashed out R${Number(value).toFixed(2)}`);
    load();
  };

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(fromDate).getTime() : 0;
    const to = toDate ? new Date(toDate).getTime() + 86400000 : Infinity;
    const q = search.trim().toLowerCase();
    return bets.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (typeFilter !== "all" && b.type !== typeFilter) return false;
      const t = new Date(b.placed_at).getTime();
      if (t < from || t > to) return false;
      if (q) {
        const hay = [
          b.reference,
          ...b.bet_selections.flatMap((s) => [
            s.match?.home_team, s.match?.away_team, s.market?.name, s.selection?.label,
          ]),
        ].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [bets, statusFilter, typeFilter, fromDate, toDate, search]);

  const stats = useMemo(() => {
    const totalStake = filtered.reduce((s, b) => s + Number(b.stake), 0);
    const totalReturn = filtered.reduce((s, b) => s + Number(b.payout ?? 0), 0);
    const settled = filtered.filter((b) => ["won", "lost", "cashed_out", "void"].includes(b.status));
    const wins = settled.filter((b) => b.status === "won" || b.status === "cashed_out").length;
    const winRate = settled.length ? (wins / settled.length) * 100 : 0;
    const profit = totalReturn - totalStake;
    return { count: filtered.length, totalStake, totalReturn, profit, winRate };
  }, [filtered]);

  const flatRows = () =>
    filtered.map((b) => ({
      reference: b.reference,
      placed_at: new Date(b.placed_at).toLocaleString("en-ZA"),
      type: b.type,
      status: b.status,
      stake: Number(b.stake).toFixed(2),
      odds: Number(b.total_odds).toFixed(2),
      potential: Number(b.potential_payout).toFixed(2),
      payout: Number(b.payout ?? 0).toFixed(2),
      selections: b.bet_selections
        .map((s) => `${s.match?.home_team} v ${s.match?.away_team} — ${s.market?.name}: ${s.selection?.label} @ ${Number(s.odds_snapshot).toFixed(2)}`)
        .join(" | "),
    }));

  const exportCSV = () => {
    const rows = flatRows();
    if (!rows.length) return toast.error("Nothing to export");
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${String((r as any)[h]).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ekasibets-statement-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const exportPDF = () => {
    const rows = flatRows();
    if (!rows.length) return toast.error("Nothing to export");
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("eKasiBets — Bet Statement", 14, 15);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString("en-ZA")}`, 14, 22);
    doc.text(
      `Bets: ${stats.count}  ·  Staked: ${fmt(stats.totalStake)}  ·  Returns: ${fmt(stats.totalReturn)}  ·  P/L: ${fmt(stats.profit)}  ·  Win-rate: ${stats.winRate.toFixed(1)}%`,
      14, 28,
    );
    autoTable(doc, {
      startY: 33,
      head: [["Ref", "Placed", "Type", "Status", "Stake", "Odds", "Payout", "Selections"]],
      body: rows.map((r) => [r.reference, r.placed_at, r.type, r.status, r.stake, r.odds, r.payout, r.selections]),
      styles: { fontSize: 7, cellPadding: 1.5, overflow: "linebreak" },
      headStyles: { fillColor: [198, 241, 53], textColor: 20 },
      columnStyles: { 7: { cellWidth: 110 } },
    });
    doc.save(`ekasibets-statement-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded");
  };

  const resetFilters = () => {
    setStatusFilter("all"); setTypeFilter("all"); setFromDate(""); setToDate(""); setSearch("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-1">My <span className="gradient-text">Bets</span></h1>
          <p className="text-muted-foreground">Full betting history, filters and exports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
            <Download size={14} /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF} className="gap-2">
            <FileText size={14} /> PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-premium p-4 mb-4">
        <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wide text-muted-foreground">
          <Filter size={14} /> Filters
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="cashed_out">Cashed Out</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="multiple">Multiple</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="From" />
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="To" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team / ref…" />
        </div>
        <div className="flex justify-end mt-3">
          <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="card-premium p-3"><p className="text-[10px] uppercase text-muted-foreground">Bets</p><p className="font-display text-xl">{stats.count}</p></div>
        <div className="card-premium p-3"><p className="text-[10px] uppercase text-muted-foreground">Staked</p><p className="font-display text-xl">{fmt(stats.totalStake)}</p></div>
        <div className="card-premium p-3"><p className="text-[10px] uppercase text-muted-foreground">Returns</p><p className="font-display text-xl">{fmt(stats.totalReturn)}</p></div>
        <div className="card-premium p-3"><p className="text-[10px] uppercase text-muted-foreground">P / L</p><p className={`font-display text-xl ${stats.profit >= 0 ? "text-primary" : "text-destructive"}`}>{fmt(stats.profit)}</p></div>
        <div className="card-premium p-3"><p className="text-[10px] uppercase text-muted-foreground">Win-rate</p><p className="font-display text-xl">{stats.winRate.toFixed(1)}%</p></div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="card-premium p-8 text-center">
          <Trophy className="mx-auto text-primary mb-3" size={32} />
          <p className="font-bold mb-1">No bets match your filters</p>
          <p className="text-sm text-muted-foreground mb-4">Try resetting filters or place a new bet.</p>
          <Link to="/sportsbook" className="btn-kasi inline-block px-5 py-2 text-sm">Browse Fixtures</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const st = STATUS[b.status] ?? STATUS.pending;
            return (
              <div key={b.id} className="card-premium p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{b.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.placed_at).toLocaleString("en-ZA")} · {b.type}
                    </p>
                  </div>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {b.bet_selections.map((sel, i) => (
                    <div key={i} className="text-sm border-l-2 border-primary/40 pl-3">
                      <p className="font-medium">{sel.match?.home_team} vs {sel.match?.away_team}</p>
                      <p className="text-xs text-muted-foreground">
                        {sel.market?.name} · {sel.selection?.label} @ {Number(sel.odds_snapshot).toFixed(2)}
                        {sel.result && <span className={`ml-2 font-bold ${sel.result === "won" ? "text-primary" : "text-destructive"}`}>· {sel.result.toUpperCase()}</span>}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Stake</p>
                    <p className="font-bold">{fmt(Number(b.stake))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Odds</p>
                    <p className="font-bold text-primary">{Number(b.total_odds).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{b.status === "won" ? "Payout" : b.status === "cashed_out" ? "Cashed Out" : "Potential"}</p>
                    <p className="font-bold gradient-text-gold">
                      {fmt(Number(b.payout ?? b.potential_payout))}
                    </p>
                  </div>
                </div>

                {b.status === "pending" && (
                  <button
                    onClick={() => cashOut(b.id)}
                    disabled={cashingOut === b.id}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 text-sm font-bold uppercase tracking-wide transition-colors"
                  >
                    {cashingOut === b.id ? <Loader2 className="animate-spin" size={14} /> : <Banknote size={14} />}
                    Cash Out Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBets;

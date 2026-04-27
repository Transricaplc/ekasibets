import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Shield, Clock, TrendingUp, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownLeft, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Profile {
  first_name: string;
  last_name: string;
  kyc_status: "pending" | "submitted" | "verified" | "rejected";
  account_status: string;
}
interface WalletRow {
  balance: number;
  bonus_balance: number;
  locked_amount: number;
  currency: string;
}
interface Tx {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  reference: string | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(n));

const KYC_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
  pending: { label: "Not Started", variant: "outline", icon: AlertCircle },
  submitted: { label: "Under Review", variant: "secondary", icon: Clock },
  verified: { label: "Verified", variant: "default", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", icon: AlertCircle },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<WalletRow | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: w }, { data: t }] = await Promise.all([
        supabase.from("profiles").select("first_name,last_name,kyc_status,account_status").eq("id", user.id).maybeSingle(),
        supabase.from("wallets").select("balance,bonus_balance,locked_amount,currency").eq("user_id", user.id).maybeSingle(),
        supabase.from("transactions").select("id,type,amount,status,created_at,reference").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setProfile(p as any);
      setWallet(w as any);
      setTxs((t as any) ?? []);
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading your dashboard...</div>;
  }

  const kyc = KYC_BADGE[profile?.kyc_status ?? "pending"];
  const KycIcon = kyc.icon;

  const totalAvailable = (Number(wallet?.balance ?? 0)) + (Number(wallet?.bonus_balance ?? 0));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-1">
          Sawubona, <span className="gradient-text">{profile?.first_name || "champ"}</span>!
        </h1>
        <p className="text-muted-foreground">Here's your eKasiBets command centre.</p>
      </div>

      {/* KYC banner */}
      {profile?.kyc_status !== "verified" && (
        <div className="card-premium p-5 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 border-primary/30">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Verify your identity (FICA)</h3>
            <p className="text-sm text-muted-foreground">
              Required by SA law before withdrawals. Takes about 2 minutes.
            </p>
          </div>
          <Link to="/kyc">
            <Button className="btn-kasi">Start Verification</Button>
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet card */}
        <div className="lg:col-span-2 card-premium p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Wallet size={16} /> Your Wallet
            </div>
            <Badge variant={kyc.variant} className="gap-1">
              <KycIcon size={12} /> KYC: {kyc.label}
            </Badge>
          </div>
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total Available</p>
            <p className="font-display text-4xl md:text-5xl gradient-text-gold mb-4">{fmt(totalAvailable)}</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Real Cash</p>
                <p className="font-bold">{fmt(Number(wallet?.balance ?? 0))}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bonus</p>
                <p className="font-bold text-primary">{fmt(Number(wallet?.bonus_balance ?? 0))}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">In Bets</p>
                <p className="font-bold">{fmt(Number(wallet?.locked_amount ?? 0))}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Link to="/wallet" className="flex-1">
                <Button className="btn-kasi w-full gap-2">
                  <ArrowDownLeft size={16} /> Deposit
                </Button>
              </Link>
              <Link to="/wallet" className="flex-1">
                <Button variant="outline" className="w-full gap-2" disabled={profile?.kyc_status !== "verified"}>
                  <ArrowUpRight size={16} /> Withdraw
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="card-premium p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
              <Gift size={14} /> Welcome Bonus
            </div>
            <p className="font-display text-2xl gradient-text">R150</p>
            <p className="text-xs text-muted-foreground">Use within 30 days</p>
          </div>
          <div className="card-premium p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
              <TrendingUp size={14} /> Active Bets
            </div>
            <p className="font-display text-2xl">0</p>
            <Link to="/live" className="text-xs text-primary">Place your first bet →</Link>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Recent Activity</h2>
          <Link to="/wallet" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {txs.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center">No activity yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {txs.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm capitalize">{tx.type.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleString("en-ZA")}
                    {tx.reference && ` · ${tx.reference}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${Number(tx.amount) >= 0 ? "text-success" : "text-foreground"}`}>
                    {Number(tx.amount) >= 0 ? "+" : ""}
                    {fmt(Number(tx.amount))}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

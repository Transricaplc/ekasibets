import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { Wallet, CreditCard, Smartphone, Banknote, ArrowUpRight, ArrowDownRight, Clock, Shield } from "lucide-react";

const paymentMethods = [
  { name: "EFT Transfer", icon: Banknote, desc: "Direct bank transfer", time: "Instant", fee: "Free" },
  { name: "Ozow", icon: CreditCard, desc: "Instant EFT payment", time: "Instant", fee: "Free" },
  { name: "PayFast", icon: CreditCard, desc: "Card & mobile money", time: "Instant", fee: "Free" },
  { name: "Airtime Deposit", icon: Smartphone, desc: "Pay with airtime credit", time: "Instant", fee: "Free" },
  { name: "e-Wallet", icon: Wallet, desc: "FNB, Capitec, Standard Bank", time: "< 5 min", fee: "Free" },
  { name: "Crypto", icon: Shield, desc: "Bitcoin, USDT accepted", time: "< 15 min", fee: "Free" },
];

const transactions = [
  { type: "deposit", amount: "+R500", method: "Ozow", time: "2 min ago", status: "complete" },
  { type: "win", amount: "+R1,200", method: "Chiefs Multi", time: "1 hr ago", status: "complete" },
  { type: "withdrawal", amount: "-R800", method: "EFT", time: "3 hrs ago", status: "complete" },
  { type: "deposit", amount: "+R200", method: "Airtime", time: "Yesterday", status: "complete" },
];

const WalletPayments = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kasi-gold/10 border-2 border-kasi-gold/30 rounded-full mb-6">
              <Wallet size={16} className="text-kasi-gold" />
              <span className="text-sm font-bold text-kasi-gold uppercase tracking-wide">{t("nav_wallet")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">{t("wallet_title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("wallet_subtitle")}</p>
          </div>

          {/* Balance Card */}
          <div className="glass border-2 border-primary/30 p-8 rounded-2xl mb-12 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Available Balance</p>
            <p className="text-5xl md:text-6xl font-display gradient-text-gold mb-6">R1,450.00</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-kasi py-3 px-8 flex items-center justify-center gap-2">
                <ArrowDownRight size={18} /> Deposit
              </button>
              <button className="btn-gold py-3 px-8 flex items-center justify-center gap-2">
                <ArrowUpRight size={18} /> Withdraw
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <h2 className="font-display text-2xl text-foreground mb-6">PAYMENT METHODS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {paymentMethods.map((method, i) => (
              <div key={i} className="card-kasi p-5 hover:border-primary/50 cursor-pointer transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <method.icon className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-sm">{method.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{method.desc}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-kasi-green"><Clock size={10} /> {method.time}</span>
                      <span className="text-muted-foreground">• {method.fee}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transaction History */}
          <h2 className="font-display text-2xl text-foreground mb-6">RECENT TRANSACTIONS</h2>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === "withdrawal" ? "bg-fire/10" : "bg-kasi-green/10"
                  }`}>
                    {tx.type === "withdrawal" ? (
                      <ArrowUpRight className="text-fire" size={18} />
                    ) : (
                      <ArrowDownRight className="text-kasi-green" size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground capitalize">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.method} • {tx.time}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === "withdrawal" ? "text-fire" : "text-kasi-green"}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WalletPayments;

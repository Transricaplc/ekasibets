import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, Trophy, MessageCircle, Camera, ThumbsUp, TrendingUp, Flame } from "lucide-react";
import { Link } from "react-router-dom";

const communityPosts = [
  { user: "Thabo M.", location: "Soweto", content: "Just hit a 5-leg multi! R50 turned into R2,400 🔥🔥🔥 Chiefs for the win!", time: "2 min ago", likes: 45, emoji: "🏆" },
  { user: "Nomvula D.", location: "Alex", content: "Who's watching the derby tonight? I've got Pirates by 2-1. Come challenge me!", time: "15 min ago", likes: 32, emoji: "⚽" },
  { user: "Sipho K.", location: "Khayelitsha", content: "Shisa nyama and live betting — perfect Saturday combo! 🥩⚽", time: "1 hr ago", likes: 67, emoji: "🔥" },
  { user: "Bongani T.", location: "Umlazi", content: "Third win this week! eKasibets payouts are lightning fast ⚡", time: "3 hrs ago", likes: 89, emoji: "💰" },
];

const trendingBets = [
  { match: "Chiefs vs Pirates", odds: "2.35", bettors: 1240, trend: "up" },
  { match: "Sundowns vs Arrows", odds: "1.65", bettors: 890, trend: "up" },
  { match: "Stellenbosch vs CT City", odds: "3.10", bettors: 456, trend: "down" },
];

const CommunityHub = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary/30 rounded-full mb-6">
              <Users size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">{t("nav_community")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">{t("community_title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("community_subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-display text-2xl text-foreground mb-4">🔥 LIVE FEED</h2>
              {communityPosts.map((post, i) => (
                <div key={i} className="card-kasi p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {post.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-foreground">{post.user}</span>
                        <span className="text-xs text-muted-foreground">• {post.location}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{post.time}</span>
                      </div>
                      <p className="text-foreground mb-3">{post.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm">
                          <ThumbsUp size={14} /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm">
                          <MessageCircle size={14} /> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Community Bet Creation */}
              <div className="card-kasi p-6 border-kasi-gold/30">
                <h3 className="font-display text-xl text-foreground mb-3">🗳️ PROPOSE A BET</h3>
                <p className="text-muted-foreground text-sm mb-4">Got a wild bet idea? Propose it and let the community vote!</p>
                <div className="flex gap-3">
                  <input placeholder="e.g., Who wins the next Soweto derby dance-off?" className="flex-1 px-4 py-3 bg-muted border-2 border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                  <button className="btn-gold py-3 px-6 text-sm">Submit</button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending */}
              <div className="card-kasi p-6">
                <h3 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                  <Flame className="text-fire" size={20} /> TRENDING BETS
                </h3>
                <div className="space-y-3">
                  {trendingBets.map((bet, i) => (
                    <Link key={i} to="/live" className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-primary/5 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-foreground">{bet.match}</p>
                        <p className="text-xs text-muted-foreground">{bet.bettors} bettors</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">{bet.odds}</span>
                        <TrendingUp size={14} className={bet.trend === "up" ? "text-kasi-green" : "text-fire"} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="card-kasi p-6">
                <h3 className="font-display text-xl text-foreground mb-4">🏆 TOP WINNERS</h3>
                {[
                  { name: "Thabo M.", wins: "R12,450", streak: 7 },
                  { name: "Nomvula D.", wins: "R8,200", streak: 5 },
                  { name: "Sipho K.", wins: "R6,800", streak: 4 },
                ].map((winner, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
                    <span className="text-xl font-display text-kasi-gold w-8">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{winner.name}</p>
                      <p className="text-xs text-muted-foreground">{winner.streak} win streak 🔥</p>
                    </div>
                    <span className="text-sm font-bold gradient-text-gold">{winner.wins}</span>
                  </div>
                ))}
              </div>

              {/* Photo Upload */}
              <div className="card-kasi p-6 text-center">
                <Camera className="mx-auto text-primary mb-3" size={32} />
                <h3 className="font-display text-lg text-foreground mb-2">SHARE YOUR WINS</h3>
                <p className="text-muted-foreground text-xs mb-4">Upload photos from match day celebrations!</p>
                <button className="btn-ghost py-2 px-4 text-sm w-full">Upload Photo</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommunityHub;

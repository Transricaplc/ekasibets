// WhatsApp share helper — SA's #1 messaging channel.
// Builds a deep link that works on both mobile (whatsapp://) and desktop (web.whatsapp.com).

export interface ShareableSelection {
  matchLabel?: string;
  marketName?: string;
  selectionLabel?: string;
  odds: number;
}

export interface ShareableBet {
  reference: string;
  stake: number;
  totalOdds: number;
  potentialPayout: number;
  selections: ShareableSelection[];
}

const fmt = (n: number) => `R${n.toFixed(2)}`;

export const buildBetShareText = (bet: ShareableBet): string => {
  const legs = bet.selections
    .map(
      (s, i) =>
        `${i + 1}. ${s.matchLabel ?? "Match"} — ${s.marketName ?? ""}: *${s.selectionLabel ?? ""}* @ ${s.odds.toFixed(2)}`,
    )
    .join("\n");

  return [
    `🏆 *eKasibets* slip ${bet.reference}`,
    "",
    legs,
    "",
    `Stake: ${fmt(bet.stake)}`,
    `Odds: ${bet.totalOdds.toFixed(2)}`,
    `To win: *${fmt(bet.potentialPayout)}*`,
    "",
    `Bet smart, bet kasi 👉 https://ekasibets.co.za`,
    `18+ · T&Cs apply · NCPG 0800 006 008`,
  ].join("\n");
};

export const shareToWhatsApp = (text: string) => {
  const encoded = encodeURIComponent(text);
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  const url = isMobile
    ? `whatsapp://send?text=${encoded}`
    : `https://web.whatsapp.com/send?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const shareNative = async (text: string, title = "My eKasibets slip") => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

import {
  IMPORTANCE_WEIGHT,
  type Card,
  type Deck,
  type DeckStats,
  type ResolvedEntry,
} from "./types";

/** cardId → Card の索引を作る */
export function indexCards(cards: Card[]): Map<string, Card> {
  return new Map(cards.map((c) => [c.id, c]));
}

/** 価格ソース群から最低値〜最高値。派生版（特価・パラレル）も含む。価格つきソースがなければ採用単価にフォールバック */
export function priceRange(card: Card): { min: number; max: number; samples: number } {
  const prices = card.priceSources
    .map((s) => s.priceJpy)
    .filter((p): p is number => typeof p === "number");
  if (prices.length === 0) return { min: card.priceJpy, max: card.priceJpy, samples: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices), samples: prices.length };
}

/** デッキ1面分の最安揃え〜最高値揃えの合計 */
export function deckPriceRange(
  deck: Deck,
  cards: Map<string, Card>,
): { minTotalJpy: number; maxTotalJpy: number } {
  let minTotalJpy = 0;
  let maxTotalJpy = 0;
  for (const e of deck.entries) {
    const card = cards.get(e.cardId);
    if (!card) continue;
    const r = priceRange(card);
    minTotalJpy += r.min * e.copies;
    maxTotalJpy += r.max * e.copies;
  }
  return { minTotalJpy, maxTotalJpy };
}

/** デッキの採用行を Card と結合する。欠損カードは除外する */
export function resolveEntries(deck: Deck, cards: Map<string, Card>): ResolvedEntry[] {
  const out: ResolvedEntry[] = [];
  for (const e of deck.entries) {
    const card = cards.get(e.cardId);
    if (!card) continue;
    out.push({
      card,
      copies: e.copies,
      importance: e.importance,
      note: e.note,
      lineTotalJpy: card.priceJpy * e.copies,
    });
  }
  return out.sort((a, b) => b.lineTotalJpy - a.lineTotalJpy);
}

/**
 * 仕入れ優先度スコア（0-100）
 * せどり視点: 「売れ筋（シェア×入賞）」×「単価の張り（必須額）」×「回転率（ステープル）」。
 * XP改善で重みはチューニング可能にするため純関数に切り出している。
 */
export function scoreDeck(deck: Deck, resolved: ResolvedEntry[]): number {
  const mustJpy = resolved
    .filter((r) => r.importance === "must" || r.importance === "key")
    .reduce((s, r) => s + r.lineTotalJpy, 0);
  const stapleKinds = resolved.filter((r) => r.card.staple).length;
  const weightedCopies = resolved.reduce(
    (s, r) => s + r.copies * (IMPORTANCE_WEIGHT[r.importance] ?? 0.3),
    0,
  );

  const shareTerm = Math.min(deck.sharePct / 25, 1) * 40; // シェア25%で満点
  const topTerm = Math.min(deck.topCount / 12, 1) * 25; // 入賞12回で満点
  const priceTerm = Math.min(mustJpy / 20000, 1) * 20; // 必須2万円で満点
  const stapleTerm = Math.min((stapleKinds * 2 + weightedCopies / 8) / 4, 1) * 15;

  return Math.round(Math.min(100, shareTerm + topTerm + priceTerm + stapleTerm));
}

export function statsDeck(deck: Deck, resolved: ResolvedEntry[]): DeckStats {
  const totalJpy = resolved.reduce((s, r) => s + r.lineTotalJpy, 0);
  const mustJpy = resolved
    .filter((r) => r.importance === "must")
    .reduce((s, r) => s + r.lineTotalJpy, 0);
  const totalCopies = resolved.reduce((s, r) => s + r.copies, 0);
  return {
    totalJpy,
    mustJpy,
    avgPriceJpy: totalCopies > 0 ? Math.round(totalJpy / totalCopies) : 0,
    mustCount: resolved
      .filter((r) => r.importance === "must")
      .reduce((s, r) => s + r.copies, 0),
    stapleCount: resolved.filter((r) => r.card.staple).length,
    priorityScore: scoreDeck(deck, resolved),
  };
}

export function formatJpy(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

/** 同一カードが複数デッキで使われる回数（横断需要＝せどりの積み増し根拠） */
export function crossDeckDemand(
  decks: Deck[],
  cards: Map<string, Card>,
): { card: Card; deckCount: number; totalCopies: number; maxImportance: string }[] {
  const acc = new Map<string, { deckCount: number; totalCopies: number; ranks: number[] }>();
  const rank: Record<string, number> = { must: 0, key: 1, optional: 2, tech: 3 };
  for (const d of decks) {
    const seen = new Set<string>();
    for (const e of d.entries) {
      const cur = acc.get(e.cardId) ?? { deckCount: 0, totalCopies: 0, ranks: [] };
      cur.totalCopies += e.copies;
      cur.ranks.push(rank[e.importance] ?? 9);
      if (!seen.has(e.cardId)) {
        seen.add(e.cardId);
        cur.deckCount += 1;
      }
      acc.set(e.cardId, cur);
    }
  }
  const invRank = ["must", "key", "optional", "tech"] as const;
  return [...acc.entries()]
    .map(([cardId, v]) => {
      const card = cards.get(cardId);
      if (!card) return null;
      return {
        card,
        deckCount: v.deckCount,
        totalCopies: v.totalCopies,
        maxImportance: invRank[Math.min(...v.ranks)] ?? "tech",
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.deckCount - a.deckCount || b.totalCopies - a.totalCopies);
}

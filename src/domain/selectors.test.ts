import { describe, expect, it } from "vitest";
import {
  crossDeckDemand,
  formatJpy,
  indexCards,
  resolveEntries,
  scoreDeck,
  statsDeck,
} from "./selectors";
import { CARDS, DECKS } from "../data/catalog";
import { indexCards as idx } from "./selectors";

const cardsById = indexCards(CARDS);

describe("formatJpy", () => {
  it("3桁区切りで円表示する", () => {
    expect(formatJpy(12345)).toBe("¥12,345");
    expect(formatJpy(0)).toBe("¥0");
  });
});

describe("resolveEntries", () => {
  it("金額順（降順）に解決される", () => {
    const deck = DECKS[0];
    const resolved = resolveEntries(deck, cardsById);
    expect(resolved.length).toBe(deck.entries.length);
    for (let i = 1; i < resolved.length; i++) {
      expect(resolved[i - 1].lineTotalJpy).toBeGreaterThanOrEqual(resolved[i].lineTotalJpy);
    }
  });

  it("欠損カードは除外される", () => {
    const deck = { ...DECKS[0], entries: [...DECKS[0].entries, { cardId: "missing", copies: 4 as const, importance: "must" as const }] };
    // copies型はnumberなのでキャスト不要だが明示
    const resolved = resolveEntries(
      { ...deck, entries: deck.entries.map((e) => ({ ...e })) },
      cardsById,
    );
    expect(resolved.length).toBe(DECKS[0].entries.length);
  });
});

describe("statsDeck / scoreDeck", () => {
  it("白連邦の合計・必須額が手計算と一致する", () => {
    const deck = DECKS.find((d) => d.id === "gcg-white-federation")!;
    const resolved = resolveEntries(deck, cardsById);
    const stats = statsDeck(deck, resolved);
    // 3800*4 + 1200*4 + 600*4 + 150*2 = 22700
    expect(stats.totalJpy).toBe(22700);
    // must: 3800*4 + 1200*4 = 20000
    expect(stats.mustJpy).toBe(20000);
    expect(stats.priorityScore).toBeGreaterThanOrEqual(0);
    expect(stats.priorityScore).toBeLessThanOrEqual(100);
  });

  it("シェア首位デッキの優先度が最下位より高い", () => {
    const scored = DECKS.map((d) => scoreDeck(d, resolveEntries(d, cardsById)));
    // 白(share22, top11) > 青(share9, top4) のはず
    expect(scored[0]).toBeGreaterThan(scored[2]);
  });
});

describe("crossDeckDemand", () => {
  it("補給作戦が3デッキ採用で首位になる", () => {
    const rows = crossDeckDemand(DECKS, idx(CARDS));
    expect(rows[0].card.id).toBe("gcg-supply-u");
    expect(rows[0].deckCount).toBe(3);
  });
});

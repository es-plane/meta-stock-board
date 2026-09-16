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
  it("青連邦の合計・必須額が手計算と一致する", () => {
    const deck = DECKS.find((d) => d.id === "gcg-blue-federation")!;
    const resolved = resolveEntries(deck, cardsById);
    const stats = statsDeck(deck, resolved);
    // 80*4 + 150*4 + 600*4 + 30*2 = 3380
    expect(stats.totalJpy).toBe(3380);
    // must: 80*4 + 150*4 = 920
    expect(stats.mustJpy).toBe(920);
    expect(stats.priorityScore).toBeGreaterThanOrEqual(0);
    expect(stats.priorityScore).toBeLessThanOrEqual(100);
  });

  it("シェア首位デッキの優先度が最下位より高い", () => {
    const scored = DECKS.map((d) => scoreDeck(d, resolveEntries(d, cardsById)));
    // 青連邦(share22, top11) > ウイング(share9, top4) のはず
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

describe("catalog品質（価格ソース）", () => {
  it("GD01-001はLR・青である", () => {
    const gundam = CARDS.find((c) => c.setCode === "GD01-001")!;
    expect(gundam.rarity).toBe("LR");
    expect(gundam.color).toBe("青");
  });

  it("全カードが1件以上のhttps価格ソースを持つ", () => {
    for (const c of CARDS) {
      expect(c.priceSources.length).toBeGreaterThanOrEqual(1);
      for (const s of c.priceSources) {
        expect(s.url.startsWith("https://")).toBe(true);
        expect(s.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it("デッキ採用カードが全てカタログに存在する", () => {
    for (const d of DECKS) {
      for (const e of d.entries) {
        expect(cardsById.has(e.cardId)).toBe(true);
      }
      for (const r of d.results) {
        expect(r.deckId).toBe(d.id);
      }
    }
  });
});

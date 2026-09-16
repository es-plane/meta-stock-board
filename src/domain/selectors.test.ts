import { describe, expect, it } from "vitest";
import {
  crossDeckDemand,
  deckPriceRange,
  formatJpy,
  indexCards,
  priceRange,
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
    // 80*4 + 80*4 + 30*4 + 30*2 = 820
    expect(stats.totalJpy).toBe(820);
    // must: 80*4 + 80*4 = 640
    expect(stats.mustJpy).toBe(640);
    expect(stats.priorityScore).toBeGreaterThanOrEqual(0);
    expect(stats.priorityScore).toBeLessThanOrEqual(100);
  });

  it("シェア首位デッキの優先度が最下位より高い", () => {
    const scored = DECKS.map((d) => scoreDeck(d, resolveEntries(d, cardsById)));
    // 青連邦(share22, top11) > ウイング(share9, top4) のはず
    expect(scored[0]).toBeGreaterThan(scored[2]);
  });
});

describe("priceRange / deckPriceRange", () => {
  it("ガンダムのレンジは特価50〜パラレル1680", () => {
    const gundam = CARDS.find((c) => c.setCode === "GD01-001")!;
    expect(priceRange(gundam)).toEqual({ min: 50, max: 1680, samples: 4 });
  });

  it("単一ソースはmin=maxになる", () => {
    const leo = CARDS.find((c) => c.setCode === "GD01-012")!;
    expect(priceRange(leo)).toEqual({ min: 30, max: 30, samples: 1 });
  });

  it("価格つきソースなしは採用単価にフォールバック", () => {
    const bare = { ...CARDS[2], priceSources: [] };
    expect(priceRange(bare)).toEqual({ min: 30, max: 30, samples: 0 });
  });

  it("青連邦の最安揃え700〜最高82100", () => {
    const deck = DECKS.find((d) => d.id === "gcg-blue-federation")!;
    // min: 50*4+80*4+30*4+30*2=700、max: 1680*4+18800*4+30*4+30*2=82100
    expect(deckPriceRange(deck, cardsById)).toEqual({ minTotalJpy: 700, maxTotalJpy: 82100 });
  });
});
describe("crossDeckDemand", () => {
  it("物資の輸送が3デッキ採用で首位になる", () => {
    const rows = crossDeckDemand(DECKS, idx(CARDS));
    expect(rows[0].card.id).toBe("gcg-gd01-102");
    expect(rows[0].deckCount).toBe(3);
  });
});

describe("catalog品質（価格ソース）", () => {
  it("GD01-001はLR・青である", () => {
    const gundam = CARDS.find((c) => c.setCode === "GD01-001")!;
    expect(gundam.rarity).toBe("LR");
    expect(gundam.color).toBe("青");
  });

  it("外ループ確定の正しい品番・色・価格である", () => {
    const byCode = new Map(CARDS.map((c) => [c.setCode, c]));
    expect(byCode.get("ST01-010")!.priceJpy).toBe(80);
    const char = byCode.get("GD05-093")!;
    expect(char.color).toBe("紫");
    expect(char.priceJpy).toBe(120);
    const zgok = byCode.get("GD03-027")!;
    expect(zgok.color).toBe("緑");
    expect(zgok.priceJpy).toBe(30);
    const wing = byCode.get("GD01-024")!;
    expect(wing.color).toBe("緑");
    expect(wing.priceJpy).toBe(980);
    const heero = byCode.get("GD05-098")!;
    expect(heero.color).toBe("白");
    expect(heero.priceJpy).toBe(80);
    const zaku = byCode.get("GD01-035")!;
    expect(zaku.priceJpy).toBe(80);
    const busshi = byCode.get("GD01-102")!;
    expect(busshi.priceJpy).toBe(30);
    // 誤品番は存在しない
    for (const code of ["GD02-008", "GD02-031", "GD03-002", "GD03-015", "GD01-040", "GD01-090"]) {
      expect(byCode.has(code)).toBe(false);
    }
  });

  it("全カードの価格がソース確認済みである", () => {
    for (const c of CARDS) {
      expect(c.priceVerified).toBe(true);
    }
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

  it("価格ソースに公式カードリストを使わない（メルカード主役）", () => {
    for (const c of CARDS) {
      for (const s of c.priceSources) {
        expect(s.url).not.toContain("gundam-gcg.com");
      }
      expect(c.priceSources.some((s) => s.url.includes("mercardgundam.jp"))).toBe(true);
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

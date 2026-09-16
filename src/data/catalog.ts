import type { Card, Deck, Environment, Game } from "../domain/types";

export const GAMES: Game[] = [
  {
    id: "gundam",
    name: "ガンダムカードゲーム",
    shortName: "GCG",
    status: "active",
    note: "中目標：まず対応。環境変動に追従して更新エージェントがデータを更新する。",
  },
  {
    id: "pokemon",
    name: "ポケモンカードゲーム",
    shortName: "PTCG",
    status: "coming-soon",
    note: "大目標：将来対応。GameId と情報モデルは先に用意し、UIは coming soon 表示。",
  },
];

export const ENVIRONMENTS: Environment[] = [
  {
    id: "gcg-2026-09",
    gameId: "gundam",
    label: "2026年9月環境",
    season: "2026 Season 3",
    regulation: "第3弾環境（サンプルデータ）",
    startsAt: "2026-09-01",
    endsAt: null,
    isCurrent: true,
    sourceUrls: [],
  },
  {
    id: "gcg-2026-07",
    gameId: "gundam",
    label: "2026年7月環境",
    season: "2026 Season 2",
    regulation: "第2弾環境（サンプルデータ）",
    startsAt: "2026-07-01",
    endsAt: "2026-08-31",
    isCurrent: false,
    sourceUrls: [],
  },
];

/**
 * メルカード検索URL（品番keyword）。価格ソースの主役。
 * 例: mercardSearch("GD01-001") → GD01-001の検索結果（一覧・各バリエーション価格つき）
 */
const mercardSearch = (keyword: string) =>
  `https://www.mercardgundam.jp/product-list?search_tmp=%E6%A4%9C%E7%B4%A2&keyword=${encodeURIComponent(keyword)}&Submit=%E6%A4%9C%E7%B4%A2`;

/**
 * 相場データ（2026-09-16に外ループ6explorerでメルカード主役検証済み）。
 * - priceVerified: true のみソース確認済み。それ以外はサンプル参考値で、
 *   更新エージェント（docs/AGENT_UPDATER.md）が priceSources の裏付けと一緒に更新する。
 * - 価格は税込・美品想定。パラレル版（LR+/LR++等）は別相場のため混同しないこと。
 * - 公式カードリストは参照リンクに使わない（テストで禁止を固定）。
 */
export const CARDS: Card[] = [
  {
    id: "gcg-gd01-001",
    gameId: "gundam",
    name: "ガンダム（LR）",
    rarity: "LR",
    setCode: "GD01-001",
    color: "青",
    priceJpy: 80,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: true,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥80",
        url: "https://www.mercardgundam.jp/product/262",
        observedAt: "2026-09-16",
        priceJpy: 80,
      },
      {
        label: "メルカード品番検索 GD01-001",
        url: mercardSearch("GD01-001"),
        observedAt: "2026-09-16",
        note: "LR通常版。LR+約1280円〜・LR++約94800円〜は別相場",
      },
      {
        label: "BIGWEB販売 GD01 LR ¥80",
        url: "https://www.bigweb.co.jp/ja/products/gundamgcg/cardViewer/3472654",
        observedAt: "2026-09-16",
        priceJpy: 80,
      },
    ],
    externalUrls: ["https://gamerch.com/gcg/993613"],
  },
  {
    id: "gcg-st01-010",
    gameId: "gundam",
    name: "アムロ・レイ（C）",
    rarity: "C",
    setCode: "ST01-010",
    color: "青",
    priceJpy: 80,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: true,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥80",
        url: "https://www.mercardgundam.jp/product/122",
        observedAt: "2026-09-16",
        priceJpy: 80,
        note: "在庫25点。PILOT/ST01/C/Blueを商品ページで確認",
      },
      {
        label: "メルカード品番検索 ST01-010",
        url: mercardSearch("ST01-010"),
        observedAt: "2026-09-16",
        note: "パラレルC+SP約18800円は別相場",
      },
      {
        label: "採用率統計",
        url: "https://gcg-stats.com/cards/ST01-010/",
        observedAt: "2026-09-16",
        note: "需要裏付け用。価格の根拠ではない",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-gd01-012",
    gameId: "gundam",
    name: "リーオー（ゼクス機）（U）",
    rarity: "U",
    setCode: "GD01-012",
    color: "青",
    priceJpy: 30,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: false,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥30",
        url: "https://www.mercardgundam.jp/product/273",
        observedAt: "2026-09-16",
        priceJpy: 30,
      },
      {
        label: "メルカード品番検索 GD01-012",
        url: mercardSearch("GD01-012"),
        observedAt: "2026-09-16",
      },
      {
        label: "買取リスト掲載（U・青）",
        url: "https://the-buyers.com/news/8154/",
        observedAt: "2026-09-16",
        note: "品番確認用",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-char-r",
    gameId: "gundam",
    name: "シャア・アズナブル（R）",
    rarity: "R",
    setCode: "GD05-093",
    color: "紫",
    priceJpy: 120,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "mid",
    staple: true,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥120",
        url: "https://www.mercardgundam.jp/product/2636",
        observedAt: "2026-09-16",
        priceJpy: 120,
        note: "在庫51点。他店200円前後とspread大・要再観測。パラレルR+約2480円は別相場",
      },
      {
        label: "メルカード品番検索 GD05-093",
        url: mercardSearch("GD05-093"),
        observedAt: "2026-09-16",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-gd03-027",
    gameId: "gundam",
    name: "ズゴックE（U）",
    rarity: "U",
    setCode: "GD03-027",
    color: "緑",
    priceJpy: 30,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: false,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥30",
        url: "https://www.mercardgundam.jp/product/1481",
        observedAt: "2026-09-16",
        priceJpy: 30,
        note: "在庫40点。メルカード表記U（公式表記はC）。他店2件も¥30で一致",
      },
      {
        label: "メルカード品番検索 GD03-027",
        url: mercardSearch("GD03-027"),
        observedAt: "2026-09-16",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-wing-lr",
    gameId: "gundam",
    name: "ウイングガンダムゼロ（LR）",
    rarity: "LR",
    setCode: "GD01-024",
    color: "緑",
    priceJpy: 980,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "high",
    staple: false,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥980",
        url: "https://www.mercardgundam.jp/product/285",
        observedAt: "2026-09-16",
        priceJpy: 980,
        note: "在庫30点。EW版GD05-067白約380円は別バージョン",
      },
      {
        label: "メルカード品番検索 GD01-024",
        url: mercardSearch("GD01-024"),
        observedAt: "2026-09-16",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-heero-r",
    gameId: "gundam",
    name: "ヒイロ・ユイ（R）",
    rarity: "R",
    setCode: "GD05-098",
    color: "白",
    priceJpy: 80,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "mid",
    staple: true,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥80",
        url: "https://www.mercardgundam.jp/product/2641",
        observedAt: "2026-09-16",
        priceJpy: 80,
        note: "在庫38点。bigweb同品番も80円で一致",
      },
      {
        label: "メルカード品番検索 GD05-098",
        url: mercardSearch("GD05-098"),
        observedAt: "2026-09-16",
      },
      {
        label: "BIGWEB販売 GD05 R ¥80",
        url: "https://www.bigweb.co.jp/ja/products/gundamgcg/cardViewer/3572736",
        observedAt: "2026-09-16",
        priceJpy: 80,
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-zaku-c",
    gameId: "gundam",
    name: "ザクII（C）",
    rarity: "C",
    setCode: "GD01-035",
    color: "緑",
    priceJpy: 80,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: false,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥80",
        url: "https://www.mercardgundam.jp/product/296",
        observedAt: "2026-09-16",
        priceJpy: 80,
        note: "在庫45点。他店3件も¥80で一致",
      },
      {
        label: "メルカード品番検索 GD01-035",
        url: mercardSearch("GD01-035"),
        observedAt: "2026-09-16",
      },
      {
        label: "BIGWEB販売 GD01 C ¥80",
        url: "https://www.bigweb.co.jp/ja/products/gundamgcg/cardViewer/3420171",
        observedAt: "2026-09-16",
        priceJpy: 80,
      },
      {
        label: "カードラボ販売 ¥80",
        url: "https://www.c-labo-online.jp/product/331922",
        observedAt: "2026-09-16",
        priceJpy: 80,
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-gd01-102",
    gameId: "gundam",
    name: "物資の輸送（U）",
    rarity: "U",
    setCode: "GD01-102",
    color: "青",
    priceJpy: 30,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: true,
    priceVerified: true,
    priceSources: [
      {
        label: "メルカード販売 ¥30",
        url: "https://www.mercardgundam.jp/product/363",
        observedAt: "2026-09-16",
        priceJpy: 30,
        note: "在庫41点。旧「補給作戦」は不存在のため置換",
      },
      {
        label: "メルカード品番検索 GD01-102",
        url: mercardSearch("GD01-102"),
        observedAt: "2026-09-16",
      },
    ],
    externalUrls: [],
  },
];

export const DECKS: Deck[] = [
  {
    id: "gcg-blue-federation",
    gameId: "gundam",
    environmentId: "gcg-2026-09",
    name: "青 連邦コントロール",
    colors: ["青"],
    archetype: "コントロール",
    sharePct: 22,
    topCount: 11,
    lastTopAt: "2026-09-14",
    summary:
      "ガンダムLR＋アムロで盤面を固める青軸。WB隊リンクが特徴で入賞数が多く回転率が高い。",
    stockNote:
      "LR通常版は安価で集めやすい。パラレル（LR+/LR++）は別相場のため混同注意。アムロC（¥80確定）・物資U（¥30確定）は汎用性あり。",
    entries: [
      { cardId: "gcg-gd01-001", copies: 4, importance: "must" },
      { cardId: "gcg-st01-010", copies: 4, importance: "must" },
      { cardId: "gcg-gd01-102", copies: 4, importance: "key", note: "他デッキでも採用" },
      { cardId: "gcg-gd01-012", copies: 2, importance: "tech" },
    ],
    results: [
      { event: "ショップ大会A", date: "2026-09-14", rank: "優勝", deckId: "gcg-blue-federation", entrants: 32 },
      { event: "ショップ大会B", date: "2026-09-13", rank: "ベスト4", deckId: "gcg-blue-federation", entrants: 24 },
    ],
    updatedAt: "2026-09-16",
  },
  {
    id: "gcg-zeon-aggro",
    gameId: "gundam",
    environmentId: "gcg-2026-09",
    name: "紫緑 ジオンアグロ",
    colors: ["紫", "緑"],
    archetype: "アグロ",
    sharePct: 18,
    topCount: 8,
    lastTopAt: "2026-09-13",
    summary: "シャア（GD05-093・紫）＋ズゴックE（GD03-027・緑）の速攻軸。単価が安く数さばき向け。（サンプル構成）",
    stockNote: "シャアRは価格spread大（120〜220）のため再観測。ズゴックE・物資は安価で複数セット確保。",
    entries: [
      { cardId: "gcg-char-r", copies: 4, importance: "must" },
      { cardId: "gcg-gd03-027", copies: 4, importance: "key" },
      { cardId: "gcg-gd01-102", copies: 3, importance: "key" },
    ],
    results: [
      { event: "ショップ大会C", date: "2026-09-13", rank: "準優勝", deckId: "gcg-zeon-aggro", entrants: 28 },
    ],
    updatedAt: "2026-09-16",
  },
  {
    id: "gcg-wing-combo",
    gameId: "gundam",
    environmentId: "gcg-2026-09",
    name: "緑白 ウイングコンボ",
    colors: ["緑", "白"],
    archetype: "コンボ",
    sharePct: 9,
    topCount: 4,
    lastTopAt: "2026-09-11",
    summary:
      "ウイングゼロLR（GD01-024・緑）が鍵のデッキ。ヒイロR（GD05-098・白）は安価で回転率あり。（サンプル構成）",
    stockNote: "LRは再録リスク高のため深追い注意。ヒイロR（¥80確定）は汎用性あり単体でも売れる。",
    entries: [
      { cardId: "gcg-wing-lr", copies: 3, importance: "must" },
      { cardId: "gcg-heero-r", copies: 4, importance: "key" },
      { cardId: "gcg-gd01-102", copies: 2, importance: "optional" },
    ],
    updatedAt: "2026-09-16",
    results: [
      { event: "ショップ大会D", date: "2026-09-11", rank: "ベスト8", deckId: "gcg-wing-combo", entrants: 20 },
    ],
  },
];

/** 将来 D1/API に置き換える際の境界。現状は静的データを返すだけ。 */
export async function getStaticData() {
  return { games: GAMES, environments: ENVIRONMENTS, cards: CARDS, decks: DECKS };
}

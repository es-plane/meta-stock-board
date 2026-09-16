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

const OFFICIAL_LIST = "https://www.gundam-gcg.com/jp/cards/";

/**
 * 相場データ。
 * - priceVerified: true のみソース確認済み。それ以外はサンプル参考値で、
 *   更新エージェント（docs/AGENT_UPDATER.md）が priceSources の裏付けと一緒に更新する。
 * - 価格は税込・美品想定。パラレル版（LR+/LR++等）は別相場のため混同しないこと。
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
        label: "公式カード詳細",
        url: "https://www.gundam-gcg.com/jp/cards/detail.php?detailSearch=GD01-001_p1",
        observedAt: "2026-09-16",
      },
      {
        label: "メルカード販売 ¥80",
        url: "https://www.mercardgundam.jp/product/262",
        observedAt: "2026-09-16",
        priceJpy: 80,
      },
      {
        label: "BIGWEB販売 GD01 LR ¥80",
        url: "https://www.bigweb.co.jp/ja/products/gundamgcg/cardViewer/3472654",
        observedAt: "2026-09-16",
        priceJpy: 80,
        note: "LR通常版。LR+約1480円・LR++約138000円は別相場",
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
    priceJpy: 150,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: true,
    priceVerified: false,
    priceSources: [
      {
        label: "公式カード詳細",
        url: "https://www.gundam-gcg.com/jp/cards/detail.php?detailSearch=ST01-010",
        observedAt: "2026-09-16",
        note: "品番・レアリティ確認用。価格はサンプル値・要確認",
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
    setCode: "GD02-008",
    color: "赤",
    priceJpy: 2400,
    priceUpdatedAt: "2026-09-16",
    trend: "up",
    reprintRisk: "mid",
    staple: true,
    priceVerified: false,
    priceSources: [
      {
        label: "公式カードリスト（品番要確認）",
        url: OFFICIAL_LIST,
        observedAt: "2026-09-16",
        note: "サンプル値・要確認。meta-updaterが品番・価格を検証すること",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-zgok-uc",
    gameId: "gundam",
    name: "ズゴック（UC）",
    rarity: "UC",
    setCode: "GD02-031",
    color: "赤",
    priceJpy: 400,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: false,
    priceVerified: false,
    priceSources: [
      {
        label: "公式カードリスト（品番要確認）",
        url: OFFICIAL_LIST,
        observedAt: "2026-09-16",
        note: "サンプル値・要確認。meta-updaterが品番・価格を検証すること",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-wing-lr",
    gameId: "gundam",
    name: "ウイングガンダムゼロ（LR）",
    rarity: "LR",
    setCode: "GD03-002",
    color: "青",
    priceJpy: 5200,
    priceUpdatedAt: "2026-09-16",
    trend: "up",
    reprintRisk: "high",
    staple: false,
    priceVerified: false,
    priceSources: [
      {
        label: "公式カードリスト（品番要確認）",
        url: OFFICIAL_LIST,
        observedAt: "2026-09-16",
        note: "サンプル値・要確認。meta-updaterが品番・価格を検証すること",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-heero-r",
    gameId: "gundam",
    name: "ヒイロ・ユイ（R）",
    rarity: "R",
    setCode: "GD03-015",
    color: "青",
    priceJpy: 1500,
    priceUpdatedAt: "2026-09-16",
    trend: "down",
    reprintRisk: "mid",
    staple: true,
    priceVerified: false,
    priceSources: [
      {
        label: "公式カードリスト（品番要確認）",
        url: OFFICIAL_LIST,
        observedAt: "2026-09-16",
        note: "サンプル値・要確認。meta-updaterが品番・価格を検証すること",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-zaku-c",
    gameId: "gundam",
    name: "ザクII（C）",
    rarity: "C",
    setCode: "GD01-040",
    color: "緑",
    priceJpy: 150,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: false,
    priceVerified: false,
    priceSources: [
      {
        label: "公式カードリスト（品番要確認）",
        url: OFFICIAL_LIST,
        observedAt: "2026-09-16",
        note: "サンプル値・要確認。meta-updaterが品番・価格を検証すること",
      },
    ],
    externalUrls: [],
  },
  {
    id: "gcg-supply-u",
    gameId: "gundam",
    name: "補給作戦（U）",
    rarity: "U",
    setCode: "GD01-090",
    color: "無",
    priceJpy: 600,
    priceUpdatedAt: "2026-09-16",
    trend: "flat",
    reprintRisk: "low",
    staple: true,
    priceVerified: false,
    priceSources: [
      {
        label: "公式カードリスト（品番要確認）",
        url: OFFICIAL_LIST,
        observedAt: "2026-09-16",
        note: "サンプル値・要確認。meta-updaterが品番・価格を検証すること",
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
      "ガンダムLR＋アムロで盤面を固める青軸。WB隊リンクが特徴で入賞数が多く回転率が高い。（サンプル構成）",
    stockNote:
      "LR通常版は安価で集めやすい。パラレル（LR+/LR++）は別相場のため混同注意。アムロCは採用率が高く汎用性あり。",
    entries: [
      { cardId: "gcg-gd01-001", copies: 4, importance: "must" },
      { cardId: "gcg-st01-010", copies: 4, importance: "must" },
      { cardId: "gcg-supply-u", copies: 4, importance: "key", note: "他デッキでも採用" },
      { cardId: "gcg-gd01-012", copies: 2, importance: "tech" },
    ],
    results: [
      { event: "ショップ大会A", date: "2026-09-14", rank: "優勝", deckId: "gcg-blue-federation", entrants: 32 },
      { event: "ショップ大会B", date: "2026-09-13", rank: "ベスト4", deckId: "gcg-blue-federation", entrants: 24 },
    ],
    updatedAt: "2026-09-16",
  },
  {
    id: "gcg-red-zeon",
    gameId: "gundam",
    environmentId: "gcg-2026-09",
    name: "赤 ジオンアグロ",
    colors: ["赤"],
    archetype: "アグロ",
    sharePct: 18,
    topCount: 8,
    lastTopAt: "2026-09-13",
    summary: "シャア＋ズゴックの速攻軸。単価は青より安く、数さばき向け。（サンプル構成・要検証）",
    stockNote: "シャアRは横断需要に注意。ズゴックは安価で複数セット確保。価格・品番とも要確認。",
    entries: [
      { cardId: "gcg-char-r", copies: 4, importance: "must" },
      { cardId: "gcg-zgok-uc", copies: 4, importance: "key" },
      { cardId: "gcg-supply-u", copies: 3, importance: "key" },
    ],
    results: [
      { event: "ショップ大会C", date: "2026-09-13", rank: "準優勝", deckId: "gcg-red-zeon", entrants: 28 },
    ],
    updatedAt: "2026-09-16",
  },
  {
    id: "gcg-blue-wing",
    gameId: "gundam",
    environmentId: "gcg-2026-09",
    name: "青 ウイングコンボ",
    colors: ["青"],
    archetype: "コンボ",
    sharePct: 9,
    topCount: 4,
    lastTopAt: "2026-09-11",
    summary:
      "ウイングゼロLRが鍵の高額デッキ。枚数は少ないが単価が高く粗利が大きい。（サンプル構成・要検証）",
    stockNote: "LRは再録リスク高のため深追い注意。ヒイロRは汎用性あり単体でも売れる。価格・品番とも要確認。",
    entries: [
      { cardId: "gcg-wing-lr", copies: 3, importance: "must" },
      { cardId: "gcg-heero-r", copies: 4, importance: "key" },
      { cardId: "gcg-supply-u", copies: 2, importance: "optional" },
    ],
    updatedAt: "2026-09-16",
    results: [
      { event: "ショップ大会D", date: "2026-09-11", rank: "ベスト8", deckId: "gcg-blue-wing", entrants: 20 },
    ],
  },
];

/** 将来 D1/API に置き換える際の境界。現状は静的データを返すだけ。 */
export async function getStaticData() {
  return { games: GAMES, environments: ENVIRONMENTS, cards: CARDS, decks: DECKS };
}

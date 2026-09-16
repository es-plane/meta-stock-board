/**
 * 情報モデル（中核ドメイン）
 *
 * Game ──< Environment（環境・シーズン）
 * Environment ──< Deck（環境デッキ）
 * Deck ──< DeckEntry（採用カード行） >── Card（カードマスタ）
 * Card ──< PricePoint（価格履歴・相場） / 入賞実績は Deck/Result に集約
 *
 * XP改善ポイント: このファイルの型を変えずに data層だけ差し替え可能。
 * 将来 D1/KV/外部API に置き換える場合は `DataProvider` 境界（src/data/provider.ts）
 * の背後だけを変える。
 */

/** 対象ゲーム */
export type GameId = "gundam" | "pokemon";

export interface Game {
  id: GameId;
  name: string;
  shortName: string;
  /** 一覧で選択可能か（ポケカは大目標＝将来対応＝coming soon） */
  status: "active" | "coming-soon";
  note: string;
}

/** 環境（シーズン / レギュレーション / 禁止改訂単位） */
export interface Environment {
  id: string;
  gameId: GameId;
  label: string;
  season: string;
  regulation: string;
  startsAt: string;
  endsAt: string | null;
  isCurrent: boolean;
  sourceUrls: string[];
}

/** カードの重要度（せどり在庫の積み増し判断用） */
export type Importance = "must" | "key" | "optional" | "tech";

export const IMPORTANCE_LABEL: Record<Importance, string> = {
  must: "必須",
  key: "主力",
  optional: "準主力",
  tech: "テック",
};

export const IMPORTANCE_WEIGHT: Record<Importance, number> = {
  must: 1.0,
  key: 0.7,
  optional: 0.4,
  tech: 0.25,
};

/** 再録・暴落リスク */
export type ReprintRisk = "low" | "mid" | "high";

/** 価格の根拠リンク。値段は必ずソースつきで持つ（捏造防止） */
export interface PriceSource {
  label: string;
  url: string;
  /** 価格を確認した日（YYYY-MM-DD） */
  observedAt: string;
  /** そのソースで確認した単価。中央値採用時などは省略可 */
  priceJpy?: number;
  /** 「サンプル値・要確認」などの但し書き */
  note?: string;
}

export interface Card {
  id: string;
  gameId: GameId;
  name: string;
  rarity: string;
  setCode: string;
  color: string;
  /** 相場単価（円・税込想定）。更新エージェントが定期更新する */
  priceJpy: number;
  priceUpdatedAt: string;
  /** 価格トレンド: 直近の上下 */
  trend: "up" | "flat" | "down";
  reprintRisk: ReprintRisk;
  /** 汎用ステープルか（複数デッキで使う＝回転率が高い） */
  staple: boolean;
  /** 価格の根拠リンク（空禁止）。更新時は priceJpy/priceUpdatedAt/trend とセットで更新する */
  priceSources: PriceSource[];
  /** 価格がソースで確認済みか。falseは参考値（UIに「参考」と表示） */
  priceVerified: boolean;
  externalUrls: string[];
}

/** デッキ内の採用1行 */
export interface DeckEntry {
  cardId: string;
  copies: number;
  importance: Importance;
  note?: string;
}

/** 大会入賞実績1件 */
export interface TopResult {
  event: string;
  date: string;
  rank: string;
  deckId: string;
  player?: string;
  entrants?: number;
  sourceUrl?: string;
}

/** 環境デッキ */
export interface Deck {
  id: string;
  gameId: GameId;
  environmentId: string;
  name: string;
  colors: string[];
  archetype: string;
  /** メタシェア %（推定） */
  sharePct: number;
  topCount: number;
  lastTopAt: string;
  summary: string;
  /** 仕入れメモ（せどり視点） */
  stockNote: string;
  entries: DeckEntry[];
  results: TopResult[];
  updatedAt: string;
}

/** デッキ×カードを解決した行（UI集計用） */
export interface ResolvedEntry {
  card: Card;
  copies: number;
  importance: Importance;
  note?: string;
  lineTotalJpy: number;
}

/** デッキの集計（せどりKPI） */
export interface DeckStats {
  totalJpy: number;
  mustJpy: number;
  avgPriceJpy: number;
  mustCount: number;
  stapleCount: number;
  /** 仕入れ優先度 0-100（シェア×入賞×必須額×汎用性。詳細は selectors.ts） */
  priorityScore: number;
}

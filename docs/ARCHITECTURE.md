# ARCHITECTURE

## 前提
- デプロイ先: Cloudflare Pages（`*.pages.dev`、静的ホスティング）
- 用途: プレイヤー用ではなく「せどり×大会入賞者向け取り揃え」の一括閲覧
- 改善方法: XP（小さく出して計測して直す）を回しやすい構成

## 選定まとめ
- **Vite 6 SPA + React 19 + TS + Tailwind v4**。SSRなし。
  - Pages は `dist/` を置くだけでよい。Next.js のようなアダプタ不要で失敗面が少ない。
  - ビルドチェックは `tsc --noEmit && vite build` の1本。
- **ルーターなし**。`App.tsx` の state（gameId/envId/selectedId/query/sort）で画面遷移。
  - `public/_redirects`（`/* /index.html 200`）だけでSPA成立。
  - URL共有が必要になったら `react-router` or hash-sync を足す（XP候補）。
- **ドメイン分離**: `domain/types.ts`（型）/ `domain/selectors.ts`（純関数）/ `data/catalog.ts`（調達）。
  - スコア式・集計は全部 `selectors.ts` の純関数。テスト・チューニングが容易。
  - 将来 D1/KV/外部API化しても `getStaticData()` 境界（将来 `DataProvider` interface化）の裏だけ変える。

## XP改善の余地（バックログ）
1. スコア重みのチューニング（`scoreDeck` の 40/25/20/15 を実売データで回帰）
2. ~~URLクエリ同期（`?game=&env=&deck=`）で共有可能に~~ → ✅ v0.2で実装済み（App.tsx）
3. 価格履歴グラフ（`PricePoint[]` を足して sparkline）
4. Pages Functions + D1/KV 化（更新エージェントの書き込み先）
5. 画像・外部リンク（公式DB/ショップ相場への導線）
6. PWA/オフライン（イベント会場での閲覧）

## 非目標（v0.1）
- 認証・決済・在庫DB・スクレイピング実行基盤（更新エージェント側の責務、別メモ参照）
- SSR/OGP動的生成（必要になったら Astro/Next への載せ替えを検討）

# Meta Stock Board — README

環境デッキ一覧を「せどり視点」で一括閲覧する Web アプリ（Cloudflare Pages 向け）。

- 小目標: `*.pages.dev` で動く環境デッキ一覧ボード
- 中目標: ガンダムカードゲーム対応＋更新エージェント（サブセッション）
- 大目標: ポケモンカード対応

## 技術選定（Cloudflare Pages 向け）

| 観点 | 選定 | 理由 |
|---|---|---|
| ビルド | Vite 6 + React 19 + TypeScript | Pages の静的デプロイ（`dist/`）と相性◎、XP改善しやすい |
| スタイル | Tailwind CSS v4 (`@tailwindcss/vite`) | 設定ファイル不要、Pages ビルドで追加手順なし |
| ルーティング | 自前 state（依存なし） | `react-router` を避け `_redirects` 1行でSPAフォールバック。将来的に追加可 |
| データ層 | `src/domain` + `src/data/catalog.ts` | JSON/TS直書き→将来 D1/KV/API に `DataProvider` 境界で差し替え |
| デプロイ | Cloudflare Pages（Static） | Build command `npm run build` / Output `dist` / Node 20 |

## 開発

```bash
npm install
npm run dev      # http://localhost:5173
npm run typecheck
npm run test -- --run  # vitest: selectors回帰テスト
npm run build    # tsc + vite build → dist/
npm run preview  # dist/ を localhost で確認
```

## デプロイ（Cloudflare Pages）

1. Cloudflare Dashboard → Pages → Create → Git リポジトリ連携
2. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20`（`.nvmrc` 参照、未指定なら Environment Variables `NODE_VERSION=20`）
3. Deploy。`*.pages.dev` で公開される。SPA遷移は `public/_redirects`（`/* /index.html 200`）で吸収。

Pages Functions / D1 を後付けする場合は `functions/` と `wrangler.toml` を足す（現状は静的のみ）。

## ディレクトリ

```
src/
  domain/types.ts      # 情報モデル（Game/Environment/Deck/Card/価格・重要度・入賞）
  domain/selectors.ts  # 集計・スコア（純関数、XP改善の主戦場）
  data/catalog.ts      # サンプルデータ＋将来の DataProvider 境界
  components/          # badges / DeckTable / DeckDetail / CrossDemand
  App.tsx              # 画面骨格（一覧＋詳細＋横断需要）
docs/
  ARCHITECTURE.md DATA_MODEL.md AGENT_UPDATER.md
.loops/inner/          # inner-loop ジャーナル（scratch、コミット任意）
```

## 現状のデータ

`src/data/catalog.ts` はサンプル相場（2026-09-16仮置き）。実運用では更新エージェントが上書きする。
ポケカ（`pokemon`）は `status: coming-soon` でUIに「準備中」表示。

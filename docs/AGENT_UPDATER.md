# AGENT_UPDATER（中目標: 更新エージェント / サブセッション設計メモ）

> 目的: 環境が変動しても、環境デッキ・カード相場・入賞実績を集め・更新できる
> Musespark 1.3（opencode-go）サブセッションを用意する。

## 位置づけ
- 本体サイト（Pages静的）は **読み専**。書き込みは更新エージェントが `src/data/catalog.ts`
  （将来は D1/KV）を更新するPR/コミットを作る。
- エージェントは定期実行（手動起動・cron・CI）され、**証跡つきで**データを更新する。

## サブセッション仕様（案）

- **名前**: `meta-updater`（opencode-go subagent / Musespark 1.3）
- **起動**: 親セッションから Task 委譲 or `opencode run meta-updater --prompt "..."`。
- **入力**: `{ gameId, environmentId, asOf }`
- **出力**: 更新後データの diff + `update-report.md`（根拠URL一覧・確信度・未確定項目）
- **成功条件**: `npm run build` が通る＋価格の `priceUpdatedAt` が実行日に更新される＋根拠URLが1件以上。

### 収集ソース（優先度順）
1. 公式: 禁止・制限改訂、公認大会結果、製品情報（再録＝暴落リスク）
2. 大会集計: ショップ大会入賞ツイート/note/大会集計サイト（Deck/results の裏付け）
3. 相場: 複数ショップの販売・買取価格（中央値を `priceJpy` に。最安単独は使わない）
4. メタ読み: シェア推定は複数ソースの合意がある場合のみ数値化、なければ `topCount` のみ更新

### 更新手順（エージェントの内部プロンプト骨子）
1. `ENVIRONMENTS` で現行環境を確認。改訂があれば新 `Environment` を追加。
2. ソースを3件以上参照し、デッキごとに `entries/sharePct/topCount/results` を更新。
3. カード相場を更新（`priceJpy/priceUpdatedAt/trend` セット更新、`reprintRisk` 見直し）。
   価格には必ず `priceSources`（1件以上のhttpsリンク＋確認日）を付け、確認済みのみ
   `priceVerified: true` にする。中央値を使い、最安単独は使わない。
4. `stockNote` をせどり視点で1–2文に要約し直す（煽り表現なし）。
5. `npm run typecheck && npm run build` を実行し、結果をレポートに添付。
6. 確信度が低い項目は値を変えず `update-report.md` の「未確定」に残す（幻覚で相場を作らない）。

### ガードレール
- 価格の捏造禁止: ソースなしの価格更新は却下。`trend` も根拠なしに変えない。
- 破壊的変更禁止: 旧環境データの削除禁止（履歴として残す）。
- スコープ: データ＋メモのみ。UI改修は別タスク。
- inner-loop 準拠: 失敗時は diagnose→adjust→retry、ジャーナルは `.loops/inner/updater-*`。

### 将来（大目標: ポケカ）
- `gameId: "pokemon"` の `Game` を `active` 化し、同手順で初期カタログを作成。
- ソースが爆発的に増えるため、ゲーム別に `sources/pokemon.md` の許可リストを持つ。
- D1移行後はエージェントの書き込み先を `seed.sql` / `upsertスクリプト` に切替（UIは `DataProvider` 境界のおかげで無改修）。

## opencode-go での定義先（次ステップ）
- `.opencode/agents/meta-updater.md`（または `agents/`）に上記を agent 定義として保存。
- 定期実行は GitHub Actions / Cloudflare Cron + Pages Build Hook で `catalog.ts` 更新→自動デプロイ。

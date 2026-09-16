# DATA_MODEL（情報モデル）

実装: `src/domain/types.ts` が正本。

```
Game 1──< Environment（環境・シーズン・レギュレーション単位）
Environment 1──< Deck（環境デッキ）
Deck 1──< DeckEntry（採用行: cardId × copies × importance）
Card（マスタ: 相場・トレンド・再録リスク・汎用フラグ）
Deck 1──< TopResult（入賞実績: 大会・日付・順位・参加人数）
```

## 型一覧

- `Game { id: "gundam"|"pokemon", name, status: active|coming-soon }`
- `Environment { id, gameId, label, season, regulation, startsAt, endsAt, isCurrent }`
- `Card { id, gameId, name, rarity, setCode, color, priceJpy, priceUpdatedAt, trend: up|flat|down, reprintRisk: low|mid|high, staple: boolean }`
- `DeckEntry { cardId, copies, importance: must|key|optional|tech }`
- `Deck { id, gameId, environmentId, name, colors, archetype, sharePct, topCount, lastTopAt, summary, stockNote, entries, results, updatedAt }`
- `TopResult { event, date, rank, entrants? }`
- `DeckStats { totalJpy, mustJpy, avgPriceJpy, mustCount, stapleCount, priorityScore }`（`selectors.ts` で算出）

## せどりKPIの定義

- **デッキ合計** = Σ(単価×枚数)。一括仕入れ額の目安。
- **必須額** = importance=must の小計。最低限押さえるべき金額。
- **仕入れ優先度 0–100** = シェア項(40)＋入賞項(25)＋必須額項(20)＋汎用項(15)。`scoreDeck()` 参照。
- **横断需要** = カードが何デッキで採用されているか（`crossDeckDemand()`）。複数デッキ需要＝積み増し根拠。

## 更新ルール（更新エージェント向け）
- 価格は `priceJpy + priceUpdatedAt + trend` をセットで更新。単価だけ変えない。
- 環境切替わりは `Environment` を追加し `isCurrent` を付け替え。旧環境の `Deck` は残す（履歴）。
- `sharePct/topCount` は推定値でもよいが `sourceUrls/results` の裏付けを残す。
- ポケカ追加時は `Game(status)` を `active` にし、`gameId: "pokemon"` の行を追加するだけ。UI改修不要。

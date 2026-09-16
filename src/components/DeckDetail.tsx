import type { Deck, DeckStats, ResolvedEntry } from "../domain/types";
import { formatJpy } from "../domain/selectors";
import { ImportanceBadge, RiskBadge, TrendBadge } from "./badges";

interface Props {
  deck: Deck;
  stats: DeckStats;
  entries: ResolvedEntry[];
}

export function DeckDetail({ deck, stats, entries }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{deck.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{deck.summary}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-0.5">{deck.archetype}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              {deck.colors.join(" / ")}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              合計 {formatJpy(stats.totalJpy)}
            </span>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">
              必須 {formatJpy(stats.mustJpy)}
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>
            シェア {deck.sharePct}% / 入賞 {deck.topCount}回
          </div>
          <div className="mt-1">更新 {deck.updatedAt}</div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
        <span className="font-bold text-amber-900">📦 仕入れメモ: </span>
        <span className="text-amber-950">{deck.stockNote}</span>
      </div>

      <h3 className="mt-5 mb-2 text-sm font-bold text-slate-800">採用カード（金額順）</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">カード</th>
              <th className="px-3 py-2 font-medium">重要度</th>
              <th className="px-3 py-2 font-medium">枚数</th>
              <th className="px-3 py-2 font-medium">単価</th>
              <th className="px-3 py-2 font-medium">小計</th>
              <th className="px-3 py-2 font-medium">動向</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((r) => (
              <tr key={r.card.id}>
                <td className="px-3 py-2">
                  <div className="font-medium text-slate-900">
                    {r.card.name}
                    {r.card.staple && (
                      <span className="ml-1 rounded bg-emerald-100 px-1 text-[11px] text-emerald-800">
                        汎用
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.card.rarity} {r.card.setCode} {r.card.color}
                    {r.note ? ` ・${r.note}` : ""}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <ImportanceBadge value={r.importance} />
                </td>
                <td className="px-3 py-2 tabular-nums">×{r.copies}</td>
                <td className="px-3 py-2 tabular-nums">
                  <div>
                    {formatJpy(r.card.priceJpy)}
                    {r.card.priceVerified ? (
                      <span
                        className="ml-1 rounded bg-emerald-100 px-1 text-[11px] text-emerald-800"
                        title={`根拠確認済み（${r.card.priceUpdatedAt}）`}
                      >
                        確認済
                      </span>
                    ) : (
                      <span
                        className="ml-1 rounded bg-slate-200 px-1 text-[11px] text-slate-600"
                        title="サンプル参考値。更新エージェントが検証予定"
                      >
                        参考
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex max-w-40 flex-wrap gap-x-2 gap-y-0.5">
                    {r.card.priceSources.map((s) => (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-normal text-sky-700 underline hover:text-sky-900"
                        title={`${s.label}${s.priceJpy ? `（${formatJpy(s.priceJpy)}）` : ""} / 確認日 ${s.observedAt}${s.note ? ` / ${s.note}` : ""}`}
                      >
                        🔗{s.label}
                      </a>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 font-bold tabular-nums">
                  {formatJpy(r.lineTotalJpy)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <TrendBadge value={r.card.trend} />
                    <RiskBadge value={r.card.reprintRisk} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-5 mb-2 text-sm font-bold text-slate-800">入賞実績</h3>
      <ul className="space-y-1 text-sm text-slate-700">
        {deck.results.map((r, i) => (
          <li key={i} className="flex flex-wrap gap-2">
            <span className="rounded bg-slate-900 px-1.5 py-0.5 text-xs font-bold text-white">
              {r.rank}
            </span>
            <span>
              {r.event}（{r.date}
              {r.entrants ? ` / ${r.entrants}名` : ""}）
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { Card } from "../domain/types";
import { formatJpy } from "../domain/selectors";
import { ImportanceBadge } from "./badges";

interface Row {
  card: Card;
  deckCount: number;
  totalCopies: number;
  maxImportance: string;
}

export function CrossDemand({ rows }: { rows: Row[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-900">🔁 横断需要（複数デッキで使われるカード）</h2>
      <p className="mt-1 text-xs text-slate-500">
        採用デッキ数が多い＝回転率が高く、厚めに在庫してよい根拠。せどりの積み増し判断に使う。
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">カード</th>
              <th className="px-3 py-2 font-medium">採用デッキ数</th>
              <th className="px-3 py-2 font-medium">延べ枚数</th>
              <th className="px-3 py-2 font-medium">最高重要度</th>
              <th className="px-3 py-2 font-medium">単価</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.slice(0, 8).map((r) => (
              <tr key={r.card.id}>
                <td className="px-3 py-2 font-medium text-slate-900">
                  {r.card.name}
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    {r.card.rarity} {r.card.setCode}
                  </span>
                </td>
                <td className="px-3 py-2 font-bold tabular-nums">{r.deckCount}デッキ</td>
                <td className="px-3 py-2 tabular-nums">計{r.totalCopies}枚</td>
                <td className="px-3 py-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <ImportanceBadge value={r.maxImportance as any} />
                </td>
                <td className="px-3 py-2 tabular-nums">{formatJpy(r.card.priceJpy)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

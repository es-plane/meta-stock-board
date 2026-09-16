import type { Deck, DeckStats } from "../domain/types";
import { formatJpy } from "../domain/selectors";
import { ScoreBar } from "./badges";

interface Props {
  decks: { deck: Deck; stats: DeckStats }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DeckTable({ decks, selectedId, onSelect }: Props) {
  if (decks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        条件に合うデッキがありません。フィルタを緩めてください。
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="px-4 py-2.5 font-medium">デッキ</th>
            <th className="px-4 py-2.5 font-medium">シェア</th>
            <th className="px-4 py-2.5 font-medium">入賞</th>
            <th className="px-4 py-2.5 font-medium">デッキ合計</th>
            <th className="px-4 py-2.5 font-medium">必須額</th>
            <th className="px-4 py-2.5 font-medium">仕入れ優先度</th>
            <th className="px-4 py-2.5 font-medium">最終入賞</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {decks.map(({ deck, stats }) => {
            const active = deck.id === selectedId;
            return (
              <tr
                key={deck.id}
                onClick={() => onSelect(deck.id)}
                className={`cursor-pointer transition-colors hover:bg-amber-50 ${
                  active ? "bg-amber-50/70" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{deck.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {deck.archetype} / {deck.colors.join("・")} / {deck.summary.slice(0, 28)}…
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums">{deck.sharePct}%</td>
                <td className="px-4 py-3 tabular-nums">{deck.topCount}回</td>
                <td className="px-4 py-3 font-bold tabular-nums">{formatJpy(stats.totalJpy)}</td>
                <td className="px-4 py-3 tabular-nums text-red-700">
                  {formatJpy(stats.mustJpy)}
                </td>
                <td className="px-4 py-3">
                  <ScoreBar score={stats.priorityScore} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{deck.lastTopAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import type { Importance, ReprintRisk } from "../domain/types";
import { IMPORTANCE_LABEL } from "../domain/types";

export function ImportanceBadge({ value }: { value: Importance }) {
  const styles: Record<Importance, string> = {
    must: "bg-red-100 text-red-800 border-red-200",
    key: "bg-amber-100 text-amber-900 border-amber-200",
    optional: "bg-slate-100 text-slate-700 border-slate-200",
    tech: "bg-violet-100 text-violet-800 border-violet-200",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${styles[value]}`}
    >
      {IMPORTANCE_LABEL[value]}
    </span>
  );
}

export function TrendBadge({ value }: { value: "up" | "flat" | "down" }) {
  const map = {
    up: { label: "↗ 上昇", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    flat: { label: "→ 横ばい", cls: "bg-slate-50 text-slate-600 border-slate-200" },
    down: { label: "↘ 下落", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  } as const;
  const m = map[value];
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${m.cls}`}>
      {m.label}
    </span>
  );
}

export function RiskBadge({ value }: { value: ReprintRisk }) {
  const map: Record<ReprintRisk, { label: string; cls: string }> = {
    low: { label: "再録低", cls: "bg-slate-50 text-slate-600 border-slate-200" },
    mid: { label: "再録中", cls: "bg-amber-50 text-amber-800 border-amber-200" },
    high: { label: "再録高⚠", cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const m = map[value];
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-xs ${m.cls}`}>{m.label}</span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-emerald-500" : score >= 45 ? "bg-amber-500" : "bg-slate-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-bold tabular-nums">{score}</span>
    </div>
  );
}

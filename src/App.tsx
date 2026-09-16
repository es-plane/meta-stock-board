import { useEffect, useMemo, useState } from "react";
import { CARDS, DECKS, ENVIRONMENTS, GAMES } from "./data/catalog";
import { crossDeckDemand, formatJpy, indexCards, resolveEntries, statsDeck } from "./domain/selectors";
import { DeckTable } from "./components/DeckTable";
import { DeckDetail } from "./components/DeckDetail";
import { CrossDemand } from "./components/CrossDemand";

type SortKey = "priority" | "total" | "share" | "top";

const SORT_LABEL: Record<SortKey, string> = {
  priority: "仕入れ優先度",
  total: "デッキ合計額",
  share: "シェア",
  top: "入賞数",
};

export default function App() {
  // XP改善: URLクエリ（?game=&env=&deck=）とstateを同期し、在庫判断の共有を可能にする
  const [gameId, setGameId] = useState<string>(() => {
    const g = new URLSearchParams(window.location.search).get("game");
    return GAMES.some((x) => x.id === g) ? (g as string) : "gundam";
  });
  const [envId, setEnvId] = useState<string>(() => {
    const e = new URLSearchParams(window.location.search).get("env");
    return ENVIRONMENTS.some((x) => x.id === e) ? (e as string) : "gcg-2026-09";
  });
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const d = new URLSearchParams(window.location.search).get("deck");
    return DECKS.some((x) => x.id === d) ? (d as string) : "gcg-blue-federation";
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("game", gameId);
    params.set("env", envId);
    if (selectedId) params.set("deck", selectedId);
    else params.delete("deck");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [gameId, envId, selectedId]);

  const cardsById = useMemo(() => indexCards(CARDS), []);
  const game = GAMES.find((g) => g.id === gameId);
  const envs = ENVIRONMENTS.filter((e) => e.gameId === gameId);
  const env = envs.find((e) => e.id === envId) ?? envs[0];

  const deckRows = useMemo(() => {
    const inEnv = DECKS.filter(
      (d) => d.gameId === gameId && d.environmentId === (env?.id ?? ""),
    );
    const withStats = inEnv.map((deck) => {
      const resolved = resolveEntries(deck, cardsById);
      return { deck, resolved, stats: statsDeck(deck, resolved) };
    });
    const q = query.trim();
    const filtered = withStats.filter(({ deck }) => {
      if (colorFilter !== "all" && !deck.colors.includes(colorFilter)) return false;
      if (q && !deck.name.includes(q) && !deck.summary.includes(q)) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "total":
          return b.stats.totalJpy - a.stats.totalJpy;
        case "share":
          return b.deck.sharePct - a.deck.sharePct;
        case "top":
          return b.deck.topCount - a.deck.topCount;
        case "priority":
        default:
          return b.stats.priorityScore - a.stats.priorityScore;
      }
    });
    return sorted;
  }, [gameId, env, colorFilter, query, sortKey, cardsById]);

  const selected = deckRows.find((r) => r.deck.id === selectedId) ?? deckRows[0] ?? null;
  const demand = useMemo(
    () => crossDeckDemand(deckRows.map((r) => r.deck), cardsById),
    [deckRows, cardsById],
  );
  const colors = useMemo(
    () => [...new Set(DECKS.filter((d) => d.gameId === gameId).flatMap((d) => d.colors))],
    [gameId],
  );

  const totalTops = deckRows.reduce((s, r) => s + r.deck.topCount, 0);
  const maxDeck = deckRows[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <div className="text-xs tracking-widest text-amber-300">META STOCK BOARD</div>
            <h1 className="text-xl font-bold">環境デッキ × せどり在庫ボード</h1>
            <p className="mt-0.5 text-xs text-slate-300">
              値段・重要度・入賞実績を一括閲覧 — 大会入賞者向けの取り揃え判断用
            </p>
          </div>
          <div className="flex gap-2">
            {GAMES.map((g) => (
              <button
                key={g.id}
                disabled={g.status !== "active"}
                onClick={() => {
                  setGameId(g.id);
                  const firstEnv = ENVIRONMENTS.find(
                    (e) => e.gameId === g.id && e.isCurrent,
                  );
                  if (firstEnv) setEnvId(firstEnv.id);
                  setSelectedId(null);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  gameId === g.id
                    ? "bg-amber-400 text-slate-950"
                    : g.status !== "active"
                      ? "cursor-not-allowed bg-slate-800 text-slate-500"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
                title={g.status !== "active" ? "将来対応（大目標）" : g.name}
              >
                {g.shortName}
                {g.status !== "active" ? " (準備中)" : ""}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        {/* 環境選択 */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-slate-700">環境:</span>
          {envs.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                setEnvId(e.id);
                setSelectedId(null);
              }}
              className={`rounded-full border px-3 py-1 ${
                env?.id === e.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {e.label}
              {e.isCurrent ? "（現行）" : ""}
            </button>
          ))}
          {env && (
            <span className="ml-1 text-xs text-slate-500">
              {env.season} / {env.regulation}
            </span>
          )}
        </div>

        {game?.status !== "active" ? (
          <div className="rounded-lg border bg-white p-10 text-center">
            <div className="text-lg font-bold">{game?.name}は準備中です</div>
            <p className="mt-2 text-sm text-slate-500">
              大目標として対応予定。情報モデル（GameId={game?.id}）は既に用意済みです。
            </p>
          </div>
        ) : (
          <>
            {/* KPI */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "環境デッキ数", value: `${deckRows.length}` },
                { label: "入賞数（合計）", value: `${totalTops}回` },
                {
                  label: "最高優先度デッキ",
                  value: maxDeck ? `${maxDeck.stats.priorityScore}点` : "-",
                },
                {
                  label: "最高額デッキ",
                  value:
                    deckRows.length > 0
                      ? formatJpy(Math.max(...deckRows.map((r) => r.stats.totalJpy)))
                      : "-",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="text-xs text-slate-500">{k.label}</div>
                  <div className="mt-0.5 text-lg font-bold tabular-nums">{k.value}</div>
                </div>
              ))}
            </div>

            {/* フィルタ */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="デッキ名・特徴で検索"
                className="w-52 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-amber-500"
              />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">色:</span>
                {["all", ...colors].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorFilter(c)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      colorFilter === c
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {c === "all" ? "全色" : c}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="text-xs text-slate-500">並び替え:</span>
                {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSortKey(k)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      sortKey === k
                        ? "bg-amber-400 font-bold text-slate-950"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {SORT_LABEL[k]}
                  </button>
                ))}
              </div>
            </div>

            <DeckTable
              decks={deckRows}
              selectedId={selected?.deck.id ?? null}
              onSelect={setSelectedId}
            />

            {selected && (
              <DeckDetail deck={selected.deck} stats={selected.stats} entries={selected.resolved} />
            )}

            <CrossDemand rows={demand} />

            <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500">
              <span className="font-bold text-slate-700">凡例・注意: </span>
              重要度（必須/主力/準主力/テック）は仕入れの積み増し優先度。動向↗↘は直近相場の上下、再録高⚠は暴落注意。
              単価の「確認済」は価格ソースで裏付け済み、「参考」はサンプル参考値（🔗から根拠を確認できます）。
              「参考」価格は実運用では更新エージェントが定期更新します。
              本ボードは在庫判断の補助であり、相場変動リスクを保証しません。
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Meta Stock Board v0.1.0 — Cloudflare Pages (dist/) デプロイ想定 / データ更新: 更新エージェント設計は
        docs/AGENT_UPDATER.md
      </footer>
    </div>
  );
}

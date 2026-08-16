import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TOPICS } from "../data/content";
import type { Weights } from "../lib/engine";

// ── Types ──────────────────────────────────────

export interface HistoryPoint {
  step: number;
  diversity: number;
}

interface BrainPanelProps {
  weights: Weights;
  history: HistoryPoint[];
}

// ── Component ──────────────────────────────────

/**
 * "Algorithm Brain" sidebar panel.
 *
 * Shows every topic as a horizontal bar sorted by weight descending,
 * plus a diversity-over-time sparkline (teal).
 *
 * Color grammar: amber bars = what the algorithm is amplifying.
 * Topics below 35 % of the max weight are shown dimmer (amber-dim).
 */
export default function BrainPanel({ weights, history }: BrainPanelProps) {
  const sortedTopics = [...TOPICS].sort(
    (a, b) => weights[b.id] - weights[a.id],
  );
  const maxWeight = Math.max(...Object.values(weights), 1);

  return (
    <div className="rounded-xl border border-panel-border bg-panel p-4">
      {/* ── Section heading ── */}
      <div className="mb-3 font-mono text-xs tracking-widest text-text-dim">
        ALGORITHM BRAIN — LIVE WEIGHTS
      </div>

      {/* ── Weight bars ── */}
      <div className="mb-4 flex flex-col gap-2">
        {sortedTopics.map((t) => {
          const w = weights[t.id];
          const pct = Math.max(4, (w / maxWeight) * 100);
          const isDim = w / maxWeight < 0.35;

          return (
            <div key={t.id} className="flex items-center gap-2">
              {/* Icon */}
              <div className="w-5 text-[13px] shrink-0">{t.icon}</div>

              {/* Label */}
              <div
                className={[
                  "w-24 sm:w-28 shrink-0 font-mono text-[11px] truncate",
                  isDim ? "text-text-dim" : "text-text",
                ].join(" ")}
                title={t.label}
              >
                {t.label}
              </div>

              {/* Bar track */}
              <div className="flex-1 h-2 rounded bg-background overflow-hidden">
                <div
                  className={[
                    "h-full rounded transition-[width,background] duration-[260ms] ease-out",
                    isDim ? "bg-amber-dim" : "bg-amber",
                  ].join(" ")}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Numeric weight */}
              <div className="w-10 text-right font-mono text-[11px] text-text-dim shrink-0">
                {w.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Diversity sparkline ── */}
      <div className="h-[90px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <XAxis dataKey="step" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                background: "var(--color-background)",
                border: "1px solid var(--color-panel-border)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                borderRadius: "6px",
              }}
              labelFormatter={() => ""}
              formatter={(v: number) => [`${v}%`, "diversity"]}
            />
            <Line
              type="monotone"
              dataKey="diversity"
              stroke="var(--color-teal)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

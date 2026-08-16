import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TOPICS, type Topic } from "../data/content";
import type { Weights } from "../lib/engine";

export interface HistoryPoint {
  step: number;
  diversity: number;
}

interface BrainBubbleOceanProps {
  weights: Weights;
  history: HistoryPoint[];
}

/**
 * Interactive Bubble Ocean — REPLACES PROGRESS BARS COMPLETELY.
 *
 * Each topic exists as a floating ocean bubble.
 * - Bubble diameter scales dynamically based on topic weight.
 * - As users click cards, dominant bubbles swell and pulse with light.
 * - Non-clicked bubbles shrink into small drifting ocean nodes.
 * - Includes an embedded Ocean Current Depth Meter (diversity sparkline).
 */
export default function BrainBubbleOcean({
  weights,
  history,
}: BrainBubbleOceanProps) {
  const [hoveredTopic, setHoveredTopic] = useState<Topic | null>(null);

  // Compute maximum weight to calculate scaling
  const maxWeight = useMemo(
    () => Math.max(...Object.values(weights), 1),
    [weights],
  );

  // Identify dominant topic (highest weight)
  const dominantTopicId = useMemo(() => {
    return Object.entries(weights).reduce(
      (maxId, [id, w]) => (w > (weights[maxId] ?? 0) ? id : maxId),
      TOPICS[0].id,
    );
  }, [weights]);

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[11px] font-semibold tracking-widest text-ocean-deep uppercase">
            ALGORITHM BRAIN · BUBBLE ECOSYSTEM
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Topic bubble size expands as the algorithm amplifies it.
          </p>
        </div>
      </div>

      {/* ── Floating Bubble Ocean Container ── */}
      <div className="relative w-full h-[320px] rounded-xl bg-gradient-to-b from-cyan-50/50 via-sky-50/30 to-blue-100/40 border border-ocean-card-border p-4 flex flex-wrap items-center justify-center gap-3 overflow-hidden select-none">
        {/* Soft background ocean wave rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[260px] h-[260px] rounded-full border border-cyan-400/15 animate-ping [animation-duration:8s]" />
          <div className="absolute w-[180px] h-[180px] rounded-full border border-sky-400/20" />
        </div>

        {/* ── 8 Topic Ocean Bubbles ── */}
        {TOPICS.map((topic, idx) => {
          const w = weights[topic.id] ?? 1;
          const isDominant = topic.id === dominantTopicId && w > 1.5;

          // Calculate dynamic bubble size: 54px min to 130px max based on sqrt of weight
          const baseRatio = Math.min(1, (w - 0.2) / (maxWeight || 1));
          const sizePx = Math.round(54 + Math.sqrt(baseRatio) * 72);

          // Float staggered animations
          const floatDelays = [
            "[animation-delay:0s]",
            "[animation-delay:0.7s]",
            "[animation-delay:1.4s]",
            "[animation-delay:2.1s]",
            "[animation-delay:0.3s]",
            "[animation-delay:1.1s]",
            "[animation-delay:1.8s]",
            "[animation-delay:2.5s]",
          ];

          return (
            <div
              key={topic.id}
              onMouseEnter={() => setHoveredTopic(topic)}
              onMouseLeave={() => setHoveredTopic(null)}
              style={{
                width: `${sizePx}px`,
                height: `${sizePx}px`,
              }}
              className={[
                "relative rounded-full flex flex-col items-center justify-center p-2 text-center",
                "cursor-pointer transition-all duration-300 ease-out animate-float-slow",
                floatDelays[idx % floatDelays.length],
                isDominant
                  ? "bg-gradient-to-br from-cyan-300/90 via-sky-400/90 to-ocean-blue text-white shadow-xl shadow-cyan-500/30 scale-105 z-20 animate-pulse-glow"
                  : w > 1.2
                    ? "bg-white/85 text-ocean-deep border-2 border-ocean-aqua/60 shadow-md z-10"
                    : "bg-white/50 text-text-muted border border-sky-200/60 opacity-70 hover:opacity-100 hover:scale-105",
              ].join(" ")}
            >
              {/* Icon */}
              <span className={sizePx > 80 ? "text-2xl" : "text-lg"}>
                {topic.icon}
              </span>

              {/* Label */}
              <span
                className={[
                  "font-mono leading-tight font-medium mt-0.5 px-1 truncate max-w-full",
                  sizePx > 90
                    ? "text-[11px]"
                    : sizePx > 70
                      ? "text-[10px]"
                      : "text-[9px]",
                ].join(" ")}
              >
                {topic.label}
              </span>

              {/* Weight Pill Badge */}
              <span
                className={[
                  "mt-0.5 px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold",
                  isDominant
                    ? "bg-white text-ocean-deep shadow-sm"
                    : "bg-ocean-deep/10 text-ocean-deep",
                ].join(" ")}
              >
                {w.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Hover Tooltip Banner ── */}
      <div className="mt-3 min-h-[28px] px-3 py-1.5 rounded-lg bg-cyan-50/70 border border-cyan-200/50 flex items-center justify-between text-xs font-mono text-ocean-deep">
        {hoveredTopic ? (
          <>
            <span>
              {hoveredTopic.icon} {hoveredTopic.label}
            </span>
            <span className="font-bold">
              Weight: {(weights[hoveredTopic.id] ?? 1).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-text-muted italic">
            Hover any bubble to inspect its algorithm amplification weight.
          </span>
        )}
      </div>

      {/* ── Ocean Current Depth Meter (Diversity Sparkline) ── */}
      <div className="mt-4 pt-3 border-t border-ocean-card-border">
        <div className="flex items-center justify-between mb-2 font-mono text-[10px] tracking-wider text-text-muted uppercase">
          <span>OCEAN CURRENT DEPTH METER</span>
          <span className="text-ocean-blue font-semibold">
            {history[history.length - 1]?.diversity ?? 100}% DIVERSITY
          </span>
        </div>

        <div className="h-[75px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <XAxis dataKey="step" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{
                  background: "#F0FDFF",
                  border: "1px solid #22D3EE",
                  fontFamily: "IBM Plex Mono",
                  fontSize: "11px",
                  borderRadius: "8px",
                  color: "#0369A1",
                }}
                labelFormatter={() => ""}
                formatter={(v: number) => [`${v}%`, "Ocean Diversity"]}
              />
              <Line
                type="monotone"
                dataKey="diversity"
                stroke="#0EA5E9"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

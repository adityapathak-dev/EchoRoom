import { useState } from "react";
import { TOPICS, type ContentItem } from "../data/content";
import type { Stance } from "../data/content";
import { getEscapeCards, type EscapeCard, type Weights } from "../lib/engine";
import ShareCard from "./ShareCard";

interface EscapePanelProps {
  weights: Weights;
  diversity: number;
  hasBeenBelow50: boolean;
  engagedIds: ReadonlySet<number>;
  engagedStanceByTopic: Readonly<Record<string, ReadonlySet<Stance>>>;
  onEngage: (card: ContentItem, manual: boolean) => void;
}

function getTopic(topicId: string) {
  return TOPICS.find((t) => t.id === topicId);
}

/**
 * "Surfacing from the Deep" — Rebuilt Outside Your Bubble panel.
 *
 * Shows perspectives rising up from beneath the surface line,
 * featuring side-by-side contrast between "What You Saw" vs "What You Missed",
 * and the Information Ocean Health Report.
 */
export default function EscapePanel({
  weights,
  diversity,
  hasBeenBelow50,
  engagedIds,
  engagedStanceByTopic,
  onEngage,
}: EscapePanelProps) {
  const [activeTab, setActiveTab] = useState<"missed" | "saw">("missed");

  const cards: EscapeCard[] = getEscapeCards(
    weights,
    undefined,
    engagedIds,
    engagedStanceByTopic,
  );

  // Derive dominant topic for "What You Saw" contrast
  const sortedTopics = [...TOPICS].sort(
    (a, b) => (weights[b.id] ?? 1) - (weights[a.id] ?? 1),
  );
  const dominantTopic = sortedTopics[0];

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border-2 border-ocean-aqua/40 shadow-2xl animate-rise-up">
      {/* ── Surface Water Gradient Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-4 border-b border-ocean-card-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/80 text-ocean-deep text-xs font-mono font-semibold mb-1">
            <span>🌊</span>
            <span>SURFACING FROM THE DEEP</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-text-main">
            Perspectives Hidden By Your Feed
          </h3>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-cyan-100/50 border border-cyan-200/60 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("missed")}
            className={[
              "px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150",
              activeTab === "missed"
                ? "bg-white text-ocean-deep font-bold shadow-sm"
                : "text-text-muted hover:text-text-main",
            ].join(" ")}
          >
            What You Missed ({cards.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saw")}
            className={[
              "px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150",
              activeTab === "saw"
                ? "bg-white text-ocean-deep font-bold shadow-sm"
                : "text-text-muted hover:text-text-main",
            ].join(" ")}
          >
            What You Saw ({dominantTopic.label})
          </button>
        </div>
      </div>

      {/* ── Content View ── */}
      {activeTab === "missed" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const topic = getTopic(card.topic);
            return (
              <div
                key={card.id}
                className="glass-panel-hover rounded-xl p-4 flex flex-col justify-between border border-ocean-aqua/30 bg-white/80"
              >
                <div>
                  <div className="mb-2 font-mono text-[11px] font-semibold text-ocean-deep flex items-center gap-1.5">
                    <span>{topic?.icon}</span>
                    <span>{topic?.label}</span>
                    <span className="text-ocean-seafoam">· {card.reason}</span>
                  </div>

                  <h4 className="font-display text-sm font-semibold leading-snug text-text-main mb-2">
                    {card.headline}
                  </h4>

                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    {card.blurb}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onEngage(card, true)}
                  className={[
                    "bg-gradient-to-r from-ocean-seafoam to-ocean-aqua text-slate-900",
                    "font-mono text-xs font-bold px-3 py-2 rounded-lg cursor-pointer shadow-sm",
                    "transition-all duration-150 hover:shadow-md hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-aqua",
                  ].join(" ")}
                >
                  Bring Into My Feed ↑
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/60 font-mono text-xs text-ocean-deep">
          <div className="font-bold text-sm mb-1">
            Dominant Bubble: {dominantTopic.icon} {dominantTopic.label}
          </div>
          <p className="text-text-muted leading-relaxed">
            The algorithm continuously boosted stories matching this topic while
            suppressing alternative viewpoints across other ocean areas.
          </p>
        </div>
      )}

      {/* ── Information Ocean Health Report ── */}
      {hasBeenBelow50 && (
        <div className="mt-8 pt-6 border-t border-ocean-card-border">
          <div className="mb-4 text-center">
            <div className="font-mono text-xs font-semibold tracking-widest text-ocean-deep uppercase">
              INFORMATION OCEAN HEALTH REPORT
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Export your feed bias audit report to share.
            </p>
          </div>
          <ShareCard weights={weights} diversity={diversity} />
        </div>
      )}
    </div>
  );
}

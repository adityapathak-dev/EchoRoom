import { useState } from "react";
import type { ScoredItem } from "../lib/engine";
import type { Weights } from "../lib/engine";
import { TOPICS, type ContentItem } from "../data/content";

function getTopic(topicId: string) {
  return TOPICS.find((t) => t.id === topicId);
}

interface FeedCardProps {
  card: ScoredItem;
  weights: Weights;
  isEngaged: boolean;
  onEngage: (card: ContentItem) => void;
}

/**
 * Modern Social Feed Card with Glassmorphism, ocean metadata,
 * hover interaction, and "Why am I seeing this?" inspector.
 */
export default function FeedCard({
  card,
  weights,
  isEngaged,
  onEngage,
}: FeedCardProps) {
  const [showWhy, setShowWhy] = useState(false);
  const topic = getTopic(card.topic);

  function handleActivate() {
    onEngage(card);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  }

  function handleWhyToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setShowWhy((prev) => !prev);
  }

  function handleWhyKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      e.preventDefault();
      setShowWhy((prev) => !prev);
    }
  }

  return (
    <div
      id={`feed-card-${card.id}`}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className={[
        "group relative rounded-2xl glass-panel glass-panel-hover p-5 cursor-pointer",
        "transition-all duration-200 ease-out select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-blue",
        isEngaged ? "opacity-75 bg-sky-50/40" : "opacity-100",
      ].join(" ")}
    >
      {/* ── Top row: Topic badge, Stance, Engaged tag ── */}
      <div className="mb-2.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 font-mono text-xs text-ocean-deep">
          <span className="px-2 py-0.5 rounded-full bg-cyan-100/70 border border-cyan-200/60 font-semibold flex items-center gap-1">
            <span>{topic?.icon}</span>
            <span>{topic?.label}</span>
          </span>
          <span className="text-ocean-blue font-medium">· {card.stanceLabel}</span>
        </div>

        {isEngaged && (
          <span className="font-mono text-xs font-semibold text-ocean-seafoam flex items-center gap-1">
            ✓ engaged
          </span>
        )}
      </div>

      {/* ── Headline ── */}
      <h3 className="font-display text-lg font-bold text-text-main leading-snug group-hover:text-ocean-deep transition-colors duration-150">
        {card.headline}
      </h3>

      {/* ── Blurb ── */}
      <p className="mt-2 text-sm leading-relaxed text-text-muted font-body">
        {card.blurb}
      </p>

      {/* ── Bottom row: Inspector toggle ── */}
      <div className="mt-4 pt-3 border-t border-ocean-card-border/60 flex items-center justify-between">
        <button
          type="button"
          onClick={handleWhyToggle}
          onKeyDown={handleWhyKeyDown}
          className={[
            "font-mono text-xs text-text-muted hover:text-ocean-blue underline cursor-pointer",
            "transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-blue",
          ].join(" ")}
        >
          {showWhy ? "Hide inspector" : "Why am I seeing this?"}
        </button>

        <span className="text-[11px] font-mono text-text-muted/70">
          Rank Score: {card.score.toFixed(1)}
        </span>
      </div>

      {/* ── "Why am I seeing this?" Inspector Panel ── */}
      {showWhy && (
        <div
          className={[
            "mt-3 rounded-xl bg-cyan-50/80 border border-cyan-200/80 p-3",
            "font-mono text-xs text-ocean-deep leading-relaxed animate-fade-in",
          ].join(" ")}
        >
          <div className="font-bold mb-1">ALGORITHM METRICS:</div>
          <div>• Topic Weight: {(weights[card.topic] ?? 1).toFixed(2)}</div>
          <div>• Score: {card.score.toFixed(2)} (Weight + Jitter)</div>
        </div>
      )}
    </div>
  );
}

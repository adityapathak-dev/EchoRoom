import { useRef, useCallback, useMemo } from "react";
import { toPng } from "html-to-image";
import { TOPICS, CONTENT } from "../data/content";
import { buildShareSummary, type ShareSummary } from "../lib/shareCard";
import type { Weights } from "../lib/engine";

interface ShareCardProps {
  weights: Weights;
  diversity: number;
}

function weightPct(topicId: string, weights: Weights): number {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  return total === 0 ? 0 : Math.round((weights[topicId] / total) * 100);
}

/**
 * Information Ocean Health Report Share Card.
 * Redesigned with premium glassmorphism, aqua ocean gradients,
 * status badges, and PNG export capability.
 */
export default function ShareCard({ weights, diversity }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const summary: ShareSummary = useMemo(() => {
    const sorted = [...TOPICS].sort(
      (a, b) => (weights[b.id] ?? 1) - (weights[a.id] ?? 1),
    );
    const dominant = sorted[0];
    const suppressed = sorted[sorted.length - 1];
    const suppCard = CONTENT.find((c) => c.topic === suppressed.id);

    return buildShareSummary(
      dominant.label,
      suppressed.label,
      suppCard?.headline ?? "A story hidden beneath the surface",
      suppCard?.blurb ?? "",
      diversity,
      weightPct(dominant.id, weights),
    );
  }, [weights, diversity]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#F0FDFF",
      });
      const link = document.createElement("a");
      link.download = "ocean-health-report.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate share card PNG:", err);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ── Rendered Ocean Health Report (Captured by html-to-image) ── */}
      <div
        ref={cardRef}
        style={{ width: "100%", maxWidth: 380, minHeight: 490 }}
        className={[
          "relative overflow-hidden rounded-2xl",
          "border border-ocean-blue/30 bg-gradient-to-b from-white/90 via-cyan-50/80 to-sky-100/90",
          "flex flex-col p-6 shadow-xl text-text-main",
        ].join(" ")}
      >
        {/* Top ocean accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ocean-blue via-ocean-aqua to-ocean-seafoam" />

        {/* Header Branding */}
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[10px] font-bold tracking-widest text-ocean-deep uppercase">
            ECHOROOM · OCEAN REPORT
          </div>
          <span className="text-xs">🌊</span>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={[
              "inline-block px-3 py-1 rounded-full font-mono text-xs font-semibold shadow-sm",
              diversity >= 70
                ? "bg-teal-100 text-teal-800 border border-teal-300"
                : diversity >= 40
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-cyan-100 text-cyan-900 border border-cyan-400 animate-pulse",
            ].join(" ")}
          >
            ● {summary.status}
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-display text-2xl font-bold text-ocean-deep leading-tight mb-2">
          {summary.headline}
        </h3>

        {/* Body */}
        <p className="text-xs leading-relaxed text-text-muted mb-4 font-body">
          {summary.body}
        </p>

        {/* Hidden Story Box */}
        <div className="rounded-xl border border-ocean-aqua/40 bg-white/70 p-3.5 mb-5 shadow-sm">
          <div className="font-mono text-[10px] font-bold text-ocean-deep tracking-wider mb-1 uppercase">
            HIDDEN BENEATH THE SURFACE · {summary.suppressedTopicLabel}
          </div>
          <div className="font-display text-xs font-semibold leading-snug text-text-main">
            {summary.suppressedHeadline}
          </div>
          {summary.suppressedBlurb && (
            <div className="mt-1 text-[11px] text-text-muted leading-relaxed">
              {summary.suppressedBlurb}
            </div>
          )}
        </div>

        {/* Diversity & Hidden Perspectives Footer */}
        <div className="mt-auto pt-3 border-t border-ocean-card-border">
          <div className="grid grid-cols-2 gap-2 mb-2 font-mono">
            <div>
              <div className="text-[10px] text-text-muted uppercase">DIVERSITY</div>
              <div className="text-2xl font-bold text-ocean-blue">{diversity}%</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase">HIDDEN VIEWS</div>
              <div className="text-2xl font-bold text-ocean-seafoam">{summary.hiddenCount}</div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-ocean-deep italic bg-cyan-100/50 px-2.5 py-1.5 rounded-lg border border-cyan-200/50">
            Recommendation: Explore opposing viewpoints to restore ocean balance.
          </div>
        </div>
      </div>

      {/* ── Download Action Button ── */}
      <button
        type="button"
        onClick={handleDownload}
        className={[
          "bg-gradient-to-r from-ocean-blue to-ocean-deep text-white",
          "font-display text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md cursor-pointer",
          "transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02]",
          "active:scale-[0.98]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-blue",
        ].join(" ")}
      >
        Download Health Report (PNG) 📥
      </button>
    </div>
  );
}

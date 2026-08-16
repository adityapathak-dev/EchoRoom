import { useState, useCallback, useRef } from "react";
import OceanCanvas from "./components/OceanCanvas";
import HeroSection from "./components/HeroSection";
import Feed from "./components/Feed";
import BrainBubbleOcean, { type HistoryPoint } from "./components/BrainBubbleOcean";
import LogTicker, { type LogEntry } from "./components/LogTicker";
import EscapePanel from "./components/EscapePanel";
import { TOPICS } from "./data/content";
import type { ContentItem, Stance } from "./data/content";
import {
  initWeights,
  diversityPct,
  ENGAGE_BOOST,
  DECAY,
  type Weights,
} from "./lib/engine";

function getTopic(topicId: string) {
  return TOPICS.find((t) => t.id === topicId);
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "\u2026" : s;
}

export default function App() {
  const [weights, setWeights] = useState<Weights>(initWeights);
  const [engagedIds, setEngagedIds] = useState<Set<number>>(new Set());
  const [engagedStanceByTopic, setEngagedStanceByTopic] = useState<
    Record<string, Set<Stance>>
  >({});
  const [history, setHistory] = useState<HistoryPoint[]>([
    { step: 0, diversity: 100 },
  ]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [showEscape, setShowEscape] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const escapeRef = useRef<HTMLDivElement>(null);

  const diversity = history[history.length - 1].diversity;
  const hasBeenBelow50 = history.some((h) => h.diversity < 50);

  const handleEngage = useCallback(
    (card: ContentItem, manual = false) => {
      const next: Weights = {};
      for (const t of TOPICS) {
        if (t.id === card.topic) {
          next[t.id] = +(weights[t.id] + ENGAGE_BOOST).toFixed(2);
        } else {
          next[t.id] = +Math.max(0.2, weights[t.id] * DECAY).toFixed(2);
        }
      }

      const prevDiv = diversityPct(weights);
      const nextDiv = diversityPct(next);
      const topicLabel = getTopic(card.topic)?.label ?? card.topic;
      const shortHead = truncate(card.headline, 46);

      setWeights(next);
      setHistory((h) => [...h, { step: h.length, diversity: nextDiv }]);
      setLog((l) =>
        [
          {
            id: Date.now() + Math.random(),
            manual,
            text: `${manual ? "brought in" : "engaged"} \u201C${shortHead}\u201D \u2014 ${topicLabel} weight ${weights[card.topic].toFixed(1)} \u2192 ${next[card.topic].toFixed(1)}, diversity ${prevDiv}% \u2192 ${nextDiv}%`,
          },
          ...l,
        ].slice(0, 5),
      );

      setEngagedIds((prev) => {
        const s = new Set(prev);
        s.add(card.id);
        return s;
      });

      setEngagedStanceByTopic((prev) => {
        const set = new Set(prev[card.topic] ?? []);
        set.add(card.stance);
        return { ...prev, [card.topic]: set };
      });
    },
    [weights],
  );

  const handleReset = useCallback(() => {
    setWeights(initWeights());
    setEngagedIds(new Set());
    setEngagedStanceByTopic({});
    setHistory([{ step: 0, diversity: 100 }]);
    setLog([]);
    setShowEscape(false);
  }, []);

  const handleScrollToFeed = useCallback(() => {
    const el = document.getElementById("simulation-feed");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleToggleEscape = useCallback(() => {
    setShowEscape((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          escapeRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      return next;
    });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-ocean-bg via-ocean-bg-alt to-slate-100 text-text-main relative overflow-x-hidden pb-24">
      {/* ── Background Ocean Particles Canvas ── */}
      <OceanCanvas />

      {/* ── Top Header Navigation Bar ── */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-ocean-card-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌊</span>
            <span className="font-display font-extrabold text-lg text-ocean-deep">
              Echo<span className="text-ocean-blue">Room</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-text-muted hidden sm:inline">Ocean Diversity:</span>
              <span
                className={[
                  "font-bold text-sm px-2 py-0.5 rounded-md",
                  diversity >= 70
                    ? "bg-teal-100 text-teal-800"
                    : diversity >= 40
                      ? "bg-amber-100 text-amber-800"
                      : "bg-cyan-100 text-cyan-900 animate-pulse",
                ].join(" ")}
              >
                {diversity}%
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleEscape}
              className="glass-pill px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-ocean-deep hover:border-ocean-blue cursor-pointer transition-all"
            >
              {showEscape ? "Hide Surface" : "Break Bubble"}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <HeroSection
        onStartSimulation={handleScrollToFeed}
        onBreakBubble={handleToggleEscape}
      />

      {/* ── Simulation Main Section ── */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
        {/* Left Column (3 cols): Feed */}
        <div ref={feedRef} className="lg:col-span-3">
          {/* Onboarding hint */}
          {engagedIds.size === 0 && (
            <div className="mb-4 rounded-xl glass-panel border-2 border-ocean-aqua/60 px-4 py-3 font-mono text-xs text-ocean-deep flex items-center gap-2.5 shadow-md">
              <span className="text-lg shrink-0">💡</span>
              <span>
                Click any card below — watch the topic bubbles on the right react
              </span>
            </div>
          )}

          <Feed
            weights={weights}
            engagedIds={engagedIds}
            onEngage={handleEngage}
          />
        </div>

        {/* Right Column (2 cols): Interactive Bubble Ocean + Log Ticker */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <BrainBubbleOcean weights={weights} history={history} />
          <LogTicker log={log} />

          <button
            type="button"
            onClick={handleToggleEscape}
            className={[
              "w-full bg-gradient-to-r from-ocean-seafoam via-ocean-aqua to-ocean-blue text-slate-900",
              "font-display text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg cursor-pointer",
              "transition-all duration-200 hover:shadow-cyan-500/25 hover:scale-[1.01]",
              "active:scale-[0.99]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-blue",
            ].join(" ")}
          >
            {showEscape ? "Hide Surface Panel" : "Break My Bubble 🌊"}
            {diversity < 40 && !showEscape && (
              <span className="ml-2 text-xs font-normal text-red-700 bg-white/70 px-2 py-0.5 rounded-full">
                Diversity Low
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── Escape Panel ("Surfacing from the Deep") ── */}
      {showEscape && (
        <section ref={escapeRef} className="max-w-6xl mx-auto px-4 mt-8 relative z-10">
          <EscapePanel
            weights={weights}
            diversity={diversity}
            hasBeenBelow50={hasBeenBelow50}
            engagedIds={engagedIds}
            engagedStanceByTopic={engagedStanceByTopic}
            onEngage={handleEngage}
          />
        </section>
      )}

      {/* ── Floating Reset Demo Button ── */}
      <button
        type="button"
        onClick={handleReset}
        title="Reset simulation state to default"
        className={[
          "fixed bottom-5 right-5 z-50",
          "flex items-center gap-2",
          "glass-panel text-ocean-deep border border-ocean-blue/30",
          "hover:border-ocean-blue hover:scale-105",
          "font-mono text-xs font-semibold px-4 py-3 rounded-full shadow-xl cursor-pointer",
          "transition-all duration-150 ease-out active:scale-95",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-blue",
        ].join(" ")}
      >
        <span className="text-sm">↺</span>
        <span>Reset demo</span>
      </button>
    </main>
  );
}

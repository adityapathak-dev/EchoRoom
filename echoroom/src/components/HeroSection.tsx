import { TOPICS } from "../data/content";

interface HeroSectionProps {
  onStartSimulation: () => void;
  onBreakBubble: () => void;
}

/**
 * Ocean of Information Hero Section.
 * Designed with Apple Vision Pro / Linear aesthetic:
 * - Floating topic nodes
 * - Glass badge
 * - Gradient typography
 * - Dual CTAs
 */
export default function HeroSection({
  onStartSimulation,
  onBreakBubble,
}: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 max-w-5xl mx-auto text-center z-10 px-4">
      {/* ── Background floating topic nodes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {TOPICS.slice(0, 5).map((t, idx) => {
          const positions = [
            "top-4 left-[5%] animate-float-slow",
            "top-12 right-[8%] animate-float-slow [animation-delay:1.5s]",
            "bottom-6 left-[10%] animate-float-slow [animation-delay:3s]",
            "bottom-12 right-[12%] animate-float-slow [animation-delay:2s]",
            "top-[45%] left-[2%] animate-float-slow [animation-delay:2.5s]",
          ];
          return (
            <div
              key={t.id}
              className={[
                "absolute hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full",
                "glass-pill text-xs font-mono text-ocean-deep shadow-sm opacity-70",
                positions[idx % positions.length],
              ].join(" ")}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Badge ── */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill mb-6">
        <span className="w-2 h-2 rounded-full bg-ocean-aqua animate-ping" />
        <span className="font-mono text-xs font-semibold tracking-widest text-ocean-deep uppercase">
          MEDIA &amp; INFORMATION LITERACY EXPERIENCE
        </span>
      </div>

      {/* ── Heading ── */}
      <h1 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-text-main leading-tight mb-3">
        Echo<span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-blue via-ocean-aqua to-ocean-seafoam">Room</span>
      </h1>

      <p className="font-display text-xl sm:text-3xl font-semibold text-ocean-deep mb-6">
        See What Your Feed Hides
      </p>

      {/* ── Supporting Text ── */}
      <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-text-muted mb-8 font-body">
        Every click shapes the world you see. Watch an algorithm build an echo
        chamber around you in real time, discover the perspectives it hides, and
        learn how media literacy helps you navigate the modern information ocean.
      </p>

      {/* ── Dual CTAs ── */}
      <div className="flex items-center justify-center flex-wrap gap-4">
        <button
          type="button"
          onClick={onStartSimulation}
          className={[
            "bg-gradient-to-r from-ocean-blue to-ocean-deep text-white",
            "font-display text-sm font-semibold px-6 py-3.5 rounded-xl shadow-lg cursor-pointer",
            "transition-all duration-200 ease-out hover:shadow-cyan-500/25 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-blue",
          ].join(" ")}
        >
          Start Simulation ↓
        </button>

        <button
          type="button"
          onClick={onBreakBubble}
          className={[
            "glass-panel text-ocean-deep border border-ocean-card-border",
            "font-display text-sm font-semibold px-6 py-3.5 rounded-xl cursor-pointer",
            "transition-all duration-200 ease-out hover:bg-white/90 hover:border-ocean-aqua",
            "active:scale-[0.98]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-aqua",
          ].join(" ")}
        >
          Break My Bubble 🌊
        </button>
      </div>
    </section>
  );
}

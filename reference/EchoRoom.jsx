import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ---------------- palette / tokens ---------------- */
const BG = "#12151B";
const PANEL = "#1A1F27";
const PANEL_BORDER = "#262C36";
const TEXT = "#D7DAE0";
const TEXT_DIM = "#8B93A1";
const AMBER = "#E8A33D";
const AMBER_DIM = "#4A3D22";
const TEAL = "#3FBFAD";
const TEAL_DIM = "#1B3B37";
const RED = "#D96C4A";

const DISPLAY_FONT = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const BODY_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

/* ---------------- content pool ---------------- */
const TOPICS = [
  { id: "phones", label: "Phones in School", icon: "\u{1F4F1}" },
  { id: "ai", label: "AI in the Classroom", icon: "\u{1F916}" },
  { id: "fashion", label: "Fast Fashion", icon: "\u{1F455}" },
  { id: "gaming", label: "Gaming & Mental Health", icon: "\u{1F3AE}" },
  { id: "climate", label: "Climate Action", icon: "\u{1F30E}" },
  { id: "grades", label: "Grades & Testing", icon: "\u{1F4DD}" },
  { id: "social", label: "Social Media & Loneliness", icon: "\u{1F4AC}" },
  { id: "influencer", label: "Influencer Culture", icon: "\u2728" },
];

const CONTENT = [
  { id: 1, topic: "phones", stance: "A", stanceLabel: "Restrict", headline: "One district's phone ban cut classroom disruptions in half", blurb: "Teachers say students are talking to each other at lunch again instead of scrolling." },
  { id: 2, topic: "phones", stance: "A", stanceLabel: "Restrict", headline: "Test scores rose the term after the ban began", blurb: "Administrators point to fewer mid-class interruptions as the likely driver." },
  { id: 3, topic: "phones", stance: "B", stanceLabel: "Against bans", headline: "A blanket ban shuts out students who rely on translation apps", blurb: "Some students use their phones for accessibility needs a ban doesn't account for." },
  { id: 4, topic: "phones", stance: "B", stanceLabel: "Against bans", headline: "Bans just push phone use into bathrooms, some schools found", blurb: "Without a policy that teaches use, enforcement turns into hide and seek." },

  { id: 5, topic: "ai", stance: "A", stanceLabel: "Embrace", headline: "Students using AI tutors caught up two grade levels faster in a pilot", blurb: "Personalized pacing helped students who'd fallen behind close the gap." },
  { id: 6, topic: "ai", stance: "A", stanceLabel: "Embrace", headline: "Teachers say AI drafting tools free up class time for real discussion", blurb: "Less time on first drafts means more time on argument and structure." },
  { id: 7, topic: "ai", stance: "B", stanceLabel: "Caution", headline: "Students who lean on AI answers retain less a week later", blurb: "A small study found recall dropped sharply without the struggle of a first attempt." },
  { id: 8, topic: "ai", stance: "B", stanceLabel: "Caution", headline: "Teachers report a rise in submissions that read identically", blurb: "Some are rethinking assignments entirely rather than trying to detect AI use." },

  { id: 9, topic: "fashion", stance: "A", stanceLabel: "Access", headline: "$8 trends make style accessible to teens who couldn't afford it before", blurb: "Fast fashion lowered the price of keeping up, for better or worse." },
  { id: 10, topic: "fashion", stance: "A", stanceLabel: "Access", headline: "Fast fashion lets small creators test bold looks with little financial risk", blurb: "Low-cost pieces make experimentation cheap instead of high-stakes." },
  { id: 11, topic: "fashion", stance: "B", stanceLabel: "Cost", headline: "A single garment can shed thousands of microplastic fibers per wash", blurb: "Synthetic blends dominate the fastest, cheapest product lines." },
  { id: 12, topic: "fashion", stance: "B", stanceLabel: "Cost", headline: "Workers describe quota systems that leave no time for breaks", blurb: "Reporting from several supply chains points to the same pattern." },

  { id: 13, topic: "gaming", stance: "A", stanceLabel: "Benefits", headline: "Multiplayer games were how some teens stayed connected in isolation", blurb: "For some, a shared server was the closest thing to hanging out." },
  { id: 14, topic: "gaming", stance: "A", stanceLabel: "Benefits", headline: "Researchers link certain puzzle games to measurable stress reduction", blurb: "Short, focused sessions showed the biggest effect in the study." },
  { id: 15, topic: "gaming", stance: "B", stanceLabel: "Risks", headline: "Some teens describe feeling unable to stop even when they want to", blurb: "Self-reported loss of control was highest around live-service titles." },
  { id: 16, topic: "gaming", stance: "B", stanceLabel: "Risks", headline: "Loot-box mechanics share design patterns with known gambling triggers", blurb: "Several regulators are now reviewing how these systems are labeled." },

  { id: 17, topic: "climate", stance: "A", stanceLabel: "Individual", headline: "A teen-led recycling program cut a school's landfill waste 40%", blurb: "The pilot started with three classrooms and spread campus-wide." },
  { id: 18, topic: "climate", stance: "A", stanceLabel: "Individual", headline: "Small local composting projects are scaling into city-wide programs", blurb: "Several began as single-neighborhood volunteer efforts." },
  { id: 19, topic: "climate", stance: "B", stanceLabel: "Systemic", headline: "Just 100 companies are linked to most industrial emissions", blurb: "Analysts argue this reframes where responsibility should sit." },
  { id: 20, topic: "climate", stance: "B", stanceLabel: "Systemic", headline: "Individual-action messaging traces back to early fossil fuel PR", blurb: "Historians point to decades-old campaigns shaping today's framing." },

  { id: 21, topic: "grades", stance: "A", stanceLabel: "Pro-grades", headline: "Clear grading gives students an early signal before problems compound", blurb: "Advocates say ambiguity helps no one when a student is already behind." },
  { id: 22, topic: "grades", stance: "A", stanceLabel: "Pro-grades", headline: "Standardized tests remain one of the few cross-school comparisons", blurb: "Without them, some colleges say they lose a shared reference point." },
  { id: 23, topic: "grades", stance: "B", stanceLabel: "Anti-grades", headline: "Schools that moved to narrative feedback saw anxiety scores drop", blurb: "Students reported less fear of a single number defining them." },
  { id: 24, topic: "grades", stance: "B", stanceLabel: "Anti-grades", headline: "Critics argue testing rewards test-taking skill over understanding", blurb: "Coaching-heavy prep can inflate scores without deeper learning." },

  { id: 25, topic: "social", stance: "A", stanceLabel: "Connective", headline: "Teens with niche interests say online communities are where they found real friends", blurb: "Shared, specific interests can matter more than geography." },
  { id: 26, topic: "social", stance: "A", stanceLabel: "Connective", headline: "Video calls let long-distance friendships stay genuinely close", blurb: "Regular calls kept several friend groups intact after a move." },
  { id: 27, topic: "social", stance: "B", stanceLabel: "Isolating", headline: "Heavy passive scrolling is linked to lower mood the same evening", blurb: "Several studies found the effect strongest for scrolling without posting." },
  { id: 28, topic: "social", stance: "B", stanceLabel: "Isolating", headline: "Some teens report comparing their lives to filtered highlight reels daily", blurb: "The comparison, not the platform itself, tracked closest with mood dips." },

  { id: 29, topic: "influencer", stance: "A", stanceLabel: "Opportunity", headline: "Teen creators are building real small businesses with a laptop and a following", blurb: "Some now employ classmates to help manage orders and editing." },
  { id: 30, topic: "influencer", stance: "A", stanceLabel: "Opportunity", headline: "Some influencers use their reach to fund community projects directly", blurb: "A handful have redirected brand deal income into local fundraisers." },
  { id: 31, topic: "influencer", stance: "B", stanceLabel: "Concern", headline: "Undisclosed sponsorships are far more common than platform rules allow", blurb: "Spot checks keep finding the same disclosure gap across regions." },
  { id: 32, topic: "influencer", stance: "B", stanceLabel: "Concern", headline: "Researchers link heavy influencer exposure to lower body-image scores", blurb: "The effect held even when the content wasn't about appearance directly." },
];

const ENGAGE_BOOST = 4.5;
const DECAY = 0.82;
const VISIBLE_COUNT = 6;

function initWeights() {
  const w = {};
  TOPICS.forEach((t) => (w[t.id] = 1));
  return w;
}

function jitter(id) {
  return (((id * 9301 + 49297) % 233280) / 233280) * 0.6;
}

function diversityPct(weights) {
  const vals = Object.values(weights);
  const sum = vals.reduce((a, b) => a + b, 0);
  const probs = vals.map((v) => v / sum).filter((p) => p > 0);
  const H = -probs.reduce((acc, p) => acc + p * Math.log2(p), 0);
  const Hmax = Math.log2(vals.length);
  return Math.round((H / Hmax) * 100);
}

function computeFeed(weights) {
  const scored = CONTENT.map((c) => ({ ...c, score: weights[c.topic] + jitter(c.id) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, VISIBLE_COUNT);
}

function getTopic(id) {
  return TOPICS.find((t) => t.id === id);
}

function diversityColor(v) {
  if (v >= 70) return TEAL;
  if (v >= 40) return AMBER;
  return RED;
}

/* ---------------- component ---------------- */
export default function EchoRoom() {
  const [weights, setWeights] = useState(initWeights());
  const [engagedIds, setEngagedIds] = useState(new Set());
  const [engagedStanceByTopic, setEngagedStanceByTopic] = useState({});
  const [history, setHistory] = useState([{ step: 0, diversity: 100 }]);
  const [log, setLog] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showEscape, setShowEscape] = useState(false);

  const feed = useMemo(() => computeFeed(weights), [weights]);
  const diversity = history[history.length - 1].diversity;
  const sortedTopics = useMemo(
    () => [...TOPICS].sort((a, b) => weights[b.id] - weights[a.id]),
    [weights]
  );
  const maxWeight = Math.max(...Object.values(weights), 1);

  function engage(card, manual = false) {
    const next = { ...weights };
    TOPICS.forEach((t) => {
      if (t.id === card.topic) next[t.id] = +(next[t.id] + ENGAGE_BOOST).toFixed(2);
      else next[t.id] = +Math.max(0.2, next[t.id] * DECAY).toFixed(2);
    });
    const prevDiv = diversityPct(weights);
    const nextDiv = diversityPct(next);
    const shortHead = card.headline.length > 46 ? card.headline.slice(0, 46) + "\u2026" : card.headline;
    setWeights(next);
    setHistory((h) => [...h, { step: h.length, diversity: nextDiv }]);
    setLog((l) =>
      [
        {
          id: Date.now() + Math.random(),
          manual,
          text: `${manual ? "brought in" : "engaged"} \u201C${shortHead}\u201D \u2014 ${getTopic(card.topic).label} weight ${weights[card.topic].toFixed(1)} \u2192 ${next[card.topic].toFixed(1)}, diversity ${prevDiv}% \u2192 ${nextDiv}%`,
        },
        ...l,
      ].slice(0, 5)
    );
    setEngagedIds((prev) => new Set(prev).add(card.id));
    setEngagedStanceByTopic((prev) => {
      const set = new Set(prev[card.topic] || []);
      set.add(card.stance);
      return { ...prev, [card.topic]: set };
    });
  }

  function reset() {
    setWeights(initWeights());
    setEngagedIds(new Set());
    setEngagedStanceByTopic({});
    setHistory([{ step: 0, diversity: 100 }]);
    setLog([]);
    setShowEscape(false);
    setExpandedId(null);
  }

  function getEscapeCards() {
    const sorted = [...TOPICS].sort((a, b) => weights[a.id] - weights[b.id]);
    const lowTopics = sorted.slice(0, 2).map((t) => t.id);
    const picks = [];
    const domTopic = sorted[sorted.length - 1].id;
    const engagedStances = engagedStanceByTopic[domTopic] || new Set();
    const missingStance = ["A", "B"].find((s) => !engagedStances.has(s));
    if (missingStance) {
      const oppCard = CONTENT.find((c) => c.topic === domTopic && c.stance === missingStance);
      if (oppCard) picks.push({ ...oppCard, reason: "same topic, other side" });
    }
    lowTopics.forEach((tid) => {
      const candidates = CONTENT.filter((c) => c.topic === tid && !engagedIds.has(c.id));
      const pick = candidates[0] || CONTENT.find((c) => c.topic === tid);
      if (pick) picks.push({ ...pick, reason: "0 clicks here recently" });
    });
    return picks.slice(0, 3);
  }

  const escapeCards = showEscape ? getEscapeCards() : [];

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: BODY_FONT, minHeight: "100%" }} className="p-5 md:p-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        .er-card { transition: transform 120ms ease, border-color 120ms ease, opacity 120ms ease; cursor: pointer; }
        .er-card:hover { transform: translateY(-2px); border-color: ${AMBER}; }
        .er-card:focus-visible, .er-btn:focus-visible { outline: 2px solid ${TEAL}; outline-offset: 2px; }
        .er-btn { transition: filter 120ms ease, transform 120ms ease; cursor: pointer; }
        .er-btn:hover { filter: brightness(1.12); }
        .er-btn:active { transform: scale(0.97); }
        .er-bar-fill { transition: width 260ms ease, background 260ms ease; }
        .er-log-line { animation: er-fade-in 200ms ease; }
        @keyframes er-fade-in { from { opacity: 0; transform: translateY(-3px);} to { opacity: 1; transform: translateY(0);} }
        @media (prefers-reduced-motion: reduce) {
          .er-card, .er-btn, .er-bar-fill, .er-log-line { transition: none !important; animation: none !important; }
        }
      `}</style>

      {/* header */}
      <header className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div className="max-w-xl">
          <div style={{ fontFamily: MONO_FONT, fontSize: "12px", letterSpacing: "0.14em", color: TEAL }}>
            LIVE FEED SIMULATION
          </div>
          <h1 style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "36px", margin: "6px 0 8px" }}>
            EchoRoom
          </h1>
          <p style={{ color: TEXT_DIM, fontSize: "14px", lineHeight: 1.5 }}>
            Click what interests you below. The panel on the right shows the real numbers deciding
            what you see next \u2014 not an animation, the actual ranking weights.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center" style={{ minWidth: "84px" }}>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontWeight: 600,
                fontSize: "30px",
                color: diversityColor(diversity),
              }}
            >
              {diversity}%
            </div>
            <div style={{ fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.1em", color: TEXT_DIM }}>
              DIVERSITY
            </div>
          </div>
          <button
            onClick={reset}
            className="er-btn"
            style={{
              background: "transparent",
              border: `1px solid ${PANEL_BORDER}`,
              color: TEXT_DIM,
              fontFamily: MONO_FONT,
              fontSize: "12px",
              padding: "8px 14px",
              borderRadius: "8px",
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* feed */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {feed.map((card) => {
            const topic = getTopic(card.topic);
            const isEngaged = engagedIds.has(card.id);
            const isExpanded = expandedId === card.id;
            return (
              <div
                key={card.id}
                className="er-card"
                tabIndex={0}
                role="button"
                onClick={() => engage(card)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); engage(card); } }}
                style={{
                  background: PANEL,
                  border: `1px solid ${PANEL_BORDER}`,
                  borderRadius: "12px",
                  padding: "14px 16px",
                  opacity: isEngaged ? 0.72 : 1,
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2" style={{ fontFamily: MONO_FONT, fontSize: "11px", color: TEXT_DIM }}>
                    <span>{topic.icon}</span>
                    <span>{topic.label}</span>
                    <span style={{ color: AMBER }}>\u00B7 {card.stanceLabel}</span>
                  </div>
                  {isEngaged && (
                    <span style={{ fontFamily: MONO_FONT, fontSize: "10px", color: TEAL }}>\u2713 engaged</span>
                  )}
                </div>
                <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 500, fontSize: "16px", lineHeight: 1.35 }}>
                  {card.headline}
                </div>
                <p style={{ color: TEXT_DIM, fontSize: "13px", marginTop: "6px", lineHeight: 1.5 }}>
                  {card.blurb}
                </p>
                <button
                  className="er-btn"
                  onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : card.id); }}
                  style={{
                    marginTop: "10px",
                    background: "transparent",
                    border: "none",
                    color: TEXT_DIM,
                    fontFamily: MONO_FONT,
                    fontSize: "11px",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  {isExpanded ? "hide why" : "why am I seeing this?"}
                </button>
                {isExpanded && (
                  <div
                    style={{
                      marginTop: "8px",
                      fontFamily: MONO_FONT,
                      fontSize: "11px",
                      color: TEXT_DIM,
                      background: BG,
                      border: `1px solid ${PANEL_BORDER}`,
                      borderRadius: "6px",
                      padding: "8px 10px",
                    }}
                  >
                    topic weight: {weights[card.topic].toFixed(2)} \u00B7 rank score: {(weights[card.topic] + jitter(card.id)).toFixed(2)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* algorithm brain */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontFamily: MONO_FONT, fontSize: "12px", letterSpacing: "0.1em", color: TEXT_DIM, marginBottom: "10px" }}>
              ALGORITHM BRAIN \u2014 LIVE WEIGHTS
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {sortedTopics.map((t) => {
                const w = weights[t.id];
                const pct = Math.max(4, (w / maxWeight) * 100);
                const dim = w / maxWeight < 0.35;
                return (
                  <div key={t.id} className="flex items-center gap-2">
                    <div style={{ width: "20px", fontSize: "13px" }}>{t.icon}</div>
                    <div style={{ width: "108px", fontSize: "11px", color: dim ? TEXT_DIM : TEXT, fontFamily: MONO_FONT }}>
                      {t.label}
                    </div>
                    <div style={{ flex: 1, height: "8px", background: BG, borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        className="er-bar-fill"
                        style={{ width: `${pct}%`, height: "100%", background: dim ? AMBER_DIM : AMBER }}
                      />
                    </div>
                    <div style={{ width: "38px", textAlign: "right", fontFamily: MONO_FONT, fontSize: "11px", color: TEXT_DIM }}>
                      {w.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ height: "90px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <XAxis dataKey="step" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
                    contentStyle={{ background: BG, border: `1px solid ${PANEL_BORDER}`, fontFamily: MONO_FONT, fontSize: "11px" }}
                    labelFormatter={() => ""}
                    formatter={(v) => [`${v}%`, "diversity"]}
                  />
                  <Line type="monotone" dataKey="diversity" stroke={TEAL} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* log ticker */}
          <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: "12px", padding: "14px 16px" }}>
            <div style={{ fontFamily: MONO_FONT, fontSize: "11px", letterSpacing: "0.1em", color: TEXT_DIM, marginBottom: "8px" }}>
              SESSION LOG
            </div>
            {log.length === 0 && (
              <div style={{ fontFamily: MONO_FONT, fontSize: "11px", color: TEXT_DIM }}>Click a card to begin.</div>
            )}
            <div className="flex flex-col gap-1.5">
              {log.map((entry) => (
                <div
                  key={entry.id}
                  className="er-log-line"
                  style={{ fontFamily: MONO_FONT, fontSize: "11px", color: entry.manual ? TEAL : TEXT_DIM, lineHeight: 1.4 }}
                >
                  {"> "}{entry.text}
                </div>
              ))}
            </div>
          </div>

          <button
            className="er-btn"
            onClick={() => setShowEscape((s) => !s)}
            style={{
              background: showEscape ? TEAL_DIM : "transparent",
              border: `1px solid ${TEAL}`,
              color: TEAL,
              fontFamily: MONO_FONT,
              fontSize: "13px",
              fontWeight: 600,
              padding: "12px 16px",
              borderRadius: "10px",
            }}
          >
            {showEscape ? "Hide" : "Break My Bubble"} {diversity < 40 && !showEscape ? " \u2014 diversity is low" : ""}
          </button>
        </div>
      </div>

      {/* escape panel */}
      {showEscape && (
        <div className="mt-6" style={{ background: TEAL_DIM, border: `1px solid ${TEAL}`, borderRadius: "12px", padding: "16px" }}>
          <div style={{ fontFamily: MONO_FONT, fontSize: "12px", letterSpacing: "0.1em", color: TEAL, marginBottom: "10px" }}>
            OUTSIDE YOUR BUBBLE
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {escapeCards.map((card) => {
              const topic = getTopic(card.topic);
              return (
                <div key={card.id} style={{ background: BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontFamily: MONO_FONT, fontSize: "10px", color: TEAL, marginBottom: "6px" }}>
                    {topic.icon} {topic.label} \u00B7 {card.reason}
                  </div>
                  <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 500, fontSize: "14px", lineHeight: 1.35, marginBottom: "8px" }}>
                    {card.headline}
                  </div>
                  <button
                    className="er-btn"
                    onClick={() => engage(card, true)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${TEAL}`,
                      color: TEAL,
                      fontFamily: MONO_FONT,
                      fontSize: "11px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    Bring into my feed
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { describe, it, expect } from "vitest";
import {
  initWeights,
  jitter,
  diversityPct,
  computeFeed,
  getEscapeCards,
  ENGAGE_BOOST,
  DECAY,
  type Weights,
} from "./engine";
import { TOPICS, CONTENT, type Stance } from "../data/content";

// ── helpers ────────────────────────────────────

/** Simulate an engagement: boost the engaged topic, decay the rest. */
function simulateEngage(weights: Weights, topic: string): Weights {
  const next: Weights = {};
  for (const t of TOPICS) {
    if (t.id === topic) {
      next[t.id] = +(weights[t.id] + ENGAGE_BOOST).toFixed(2);
    } else {
      next[t.id] = +Math.max(0.2, weights[t.id] * DECAY).toFixed(2);
    }
  }
  return next;
}

// ── initWeights ────────────────────────────────

describe("initWeights", () => {
  it("creates a weight for every topic, all equal to 1", () => {
    const w = initWeights();
    const keys = Object.keys(w);
    expect(keys).toHaveLength(TOPICS.length);
    for (const t of TOPICS) {
      expect(w[t.id]).toBe(1);
    }
  });
});

// ── jitter ─────────────────────────────────────

describe("jitter", () => {
  it("returns a value in [0, 0.6)", () => {
    for (let id = 1; id <= 32; id++) {
      const j = jitter(id);
      expect(j).toBeGreaterThanOrEqual(0);
      expect(j).toBeLessThan(0.6);
    }
  });

  it("is deterministic for the same id", () => {
    expect(jitter(7)).toBe(jitter(7));
  });

  it("produces different values for different ids", () => {
    // Not all 32 can collide — check a handful
    const values = new Set([1, 2, 3, 4, 5].map(jitter));
    expect(values.size).toBeGreaterThan(1);
  });
});

// ── diversityPct ───────────────────────────────

describe("diversityPct", () => {
  it("returns 100 when all weights are equal", () => {
    const w = initWeights();
    expect(diversityPct(w)).toBe(100);
  });

  it("still returns 100 when all weights are equal but not 1", () => {
    const w: Weights = {};
    for (const t of TOPICS) w[t.id] = 5;
    expect(diversityPct(w)).toBe(100);
  });

  it("drops below 50 when one topic dominates heavily", () => {
    const w = initWeights();
    // Simulate many engagements on the same topic
    let current = w;
    for (let i = 0; i < 10; i++) {
      current = simulateEngage(current, "phones");
    }
    const d = diversityPct(current);
    expect(d).toBeLessThan(50);
    expect(d).toBeGreaterThan(0);
  });

  it("decreases monotonically with repeated same-topic engagements", () => {
    let w = initWeights();
    const scores: number[] = [diversityPct(w)];
    for (let i = 0; i < 5; i++) {
      w = simulateEngage(w, "ai");
      scores.push(diversityPct(w));
    }
    // Each score should be ≤ the previous one
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
    }
  });

  it("is a real computed number, not a hardcoded animation value", () => {
    // Sanity: two different weight states produce different results
    const w1 = initWeights();
    const w2 = simulateEngage(w1, "gaming");
    expect(diversityPct(w1)).not.toBe(diversityPct(w2));
  });
});

// ── computeFeed ────────────────────────────────

describe("computeFeed", () => {
  it("returns exactly visibleCount items", () => {
    const w = initWeights();
    expect(computeFeed(w, CONTENT, 6)).toHaveLength(6);
    expect(computeFeed(w, CONTENT, 3)).toHaveLength(3);
  });

  it("returns items sorted by score descending", () => {
    const w = initWeights();
    const feed = computeFeed(w, CONTENT, 10);
    for (let i = 1; i < feed.length; i++) {
      expect(feed[i].score).toBeLessThanOrEqual(feed[i - 1].score);
    }
  });

  it("surfaces boosted-topic cards after engagement", () => {
    let w = initWeights();
    // Boost "climate" heavily
    for (let i = 0; i < 5; i++) {
      w = simulateEngage(w, "climate");
    }
    const feed = computeFeed(w, CONTENT, 6);
    const climateCards = feed.filter((c) => c.topic === "climate");
    // All 4 climate cards should appear in top 6 given 5x boost
    expect(climateCards.length).toBe(4);
  });

  it("pushes low-weight topics out of the feed", () => {
    let w = initWeights();
    // Engage "phones" many times → other topics decay
    for (let i = 0; i < 8; i++) {
      w = simulateEngage(w, "phones");
    }
    const feed = computeFeed(w, CONTENT, 6);
    const topicSet = new Set(feed.map((c) => c.topic));
    // Should NOT contain every topic — most should be crowded out
    expect(topicSet.size).toBeLessThanOrEqual(3);
    expect(topicSet.has("phones")).toBe(true);
  });

  it("handles empty content gracefully", () => {
    const w = initWeights();
    expect(computeFeed(w, [], 6)).toHaveLength(0);
  });

  it("handles visibleCount larger than content pool", () => {
    const w = initWeights();
    const feed = computeFeed(w, CONTENT, 999);
    expect(feed).toHaveLength(CONTENT.length);
  });
});

// ── getEscapeCards ─────────────────────────────

describe("getEscapeCards", () => {
  it("returns at most 3 cards", () => {
    const w = initWeights();
    const cards = getEscapeCards(w, CONTENT, new Set(), {});
    expect(cards.length).toBeLessThanOrEqual(3);
  });

  it("includes the opposite stance on the dominant topic", () => {
    let w = initWeights();
    // Boost "ai" and only engage stance A
    for (let i = 0; i < 5; i++) {
      w = simulateEngage(w, "ai");
    }
    const engagedStances: Record<string, ReadonlySet<Stance>> = {
      ai: new Set<Stance>(["A"]),
    };
    const cards = getEscapeCards(w, CONTENT, new Set([5, 6]), engagedStances);
    const oppCard = cards.find((c) => c.reason === "same topic, other side");
    expect(oppCard).toBeDefined();
    expect(oppCard!.topic).toBe("ai");
    expect(oppCard!.stance).toBe("B");
  });

  it("includes cards from the two lowest-weighted topics", () => {
    let w = initWeights();
    // Boost "phones" to push everything else down
    for (let i = 0; i < 5; i++) {
      w = simulateEngage(w, "phones");
    }
    const cards = getEscapeCards(w, CONTENT, new Set(), {});
    const lowCards = cards.filter(
      (c) => c.reason === "0 clicks here recently",
    );
    expect(lowCards.length).toBeGreaterThanOrEqual(2);

    // Those cards should be from topics that are NOT the dominant one
    for (const c of lowCards) {
      expect(c.topic).not.toBe("phones");
    }
  });

  it("prefers unseen cards from low-weight topics", () => {
    let w = initWeights();
    for (let i = 0; i < 5; i++) {
      w = simulateEngage(w, "phones");
    }
    // Mark some cards as already engaged
    const engagedIds = new Set([17, 21]); // first climate + first grades card
    const cards = getEscapeCards(w, CONTENT, engagedIds, {});
    const lowCards = cards.filter(
      (c) => c.reason === "0 clicks here recently",
    );
    // Engaged ids should be skipped in favor of unseen ones
    for (const c of lowCards) {
      expect(engagedIds.has(c.id)).toBe(false);
    }
  });
});

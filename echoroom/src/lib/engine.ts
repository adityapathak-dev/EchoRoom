/**
 * EchoRoom ranking engine — pure, testable functions.
 *
 * Color grammar reminder:
 *   amber = what the algorithm feeds you (amplified topics)
 *   teal  = what it hides (suppressed / escape topics)
 */

import { TOPICS, CONTENT, type ContentItem, type Stance } from "../data/content";

// ── Types ──────────────────────────────────────

/** Map of topicId → weight. */
export type Weights = Record<string, number>;

/** A content item annotated with its ranking score. */
export interface ScoredItem extends ContentItem {
  score: number;
}

/** An escape-panel card with an explanation for *why* it's shown. */
export interface EscapeCard extends ContentItem {
  reason: string;
}

// ── Constants ──────────────────────────────────

export const ENGAGE_BOOST = 4.5;
export const DECAY = 0.82;
export const DEFAULT_VISIBLE_COUNT = 6;

// ── Core functions ─────────────────────────────

/**
 * Create a fresh weight map with every topic at equal weight (1.0).
 */
export function initWeights(): Weights {
  const w: Weights = {};
  for (const t of TOPICS) {
    w[t.id] = 1;
  }
  return w;
}

/**
 * Deterministic per-card jitter so cards within the same topic
 * don't always sort identically. Uses a simple LCG seeded by `id`.
 */
export function jitter(id: number): number {
  return (((id * 9301 + 49297) % 233280) / 233280) * 0.6;
}

/**
 * Shannon-entropy diversity score as a percentage of maximum entropy.
 *
 * - All-equal weights → 100 %
 * - One dominant weight → approaches 0 %
 *
 * Every number shown in the UI is this function's real output,
 * never a fake animation.
 */
export function diversityPct(weights: Weights): number {
  const vals = Object.values(weights);
  const sum = vals.reduce((a, b) => a + b, 0);
  const probs = vals.map((v) => v / sum).filter((p) => p > 0);
  const H = -probs.reduce((acc, p) => acc + p * Math.log2(p), 0);
  const Hmax = Math.log2(vals.length);
  return Math.round((H / Hmax) * 100);
}

/**
 * Rank the full content pool by topic weight + jitter,
 * return the top `visibleCount` items.
 */
export function computeFeed(
  weights: Weights,
  content: ContentItem[] = CONTENT,
  visibleCount: number = DEFAULT_VISIBLE_COUNT,
): ScoredItem[] {
  const scored: ScoredItem[] = content.map((c) => ({
    ...c,
    score: (weights[c.topic] ?? 0) + jitter(c.id),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, visibleCount);
}

/**
 * Build "Break My Bubble" escape cards:
 *
 * 1. The opposite stance on the current dominant topic (if unseen).
 * 2. One card each from the two lowest-weighted topics (unseen preferred).
 *
 * Returns at most 3 cards.
 */
export function getEscapeCards(
  weights: Weights,
  content: ContentItem[] = CONTENT,
  engagedIds: ReadonlySet<number>,
  engagedStanceByTopic: Readonly<Record<string, ReadonlySet<Stance>>>,
): EscapeCard[] {
  const sorted = [...TOPICS].sort((a, b) => weights[a.id] - weights[b.id]);
  const lowTopics = sorted.slice(0, 2).map((t) => t.id);
  const picks: EscapeCard[] = [];

  // 1. opposite stance on the dominant topic
  const domTopic = sorted[sorted.length - 1].id;
  const engagedStances = engagedStanceByTopic[domTopic] ?? new Set<Stance>();
  const missingStance: Stance | undefined = (["A", "B"] as Stance[]).find(
    (s) => !engagedStances.has(s),
  );

  if (missingStance) {
    const oppCard = content.find(
      (c) => c.topic === domTopic && c.stance === missingStance,
    );
    if (oppCard) {
      picks.push({ ...oppCard, reason: "same topic, other side" });
    }
  }

  // 2. one card each from the two lowest-weighted topics
  for (const tid of lowTopics) {
    const candidates = content.filter(
      (c) => c.topic === tid && !engagedIds.has(c.id),
    );
    const pick = candidates[0] ?? content.find((c) => c.topic === tid);
    if (pick) {
      picks.push({ ...pick, reason: "0 clicks here recently" });
    }
  }

  return picks.slice(0, 3);
}

/**
 * Information Ocean Health Report builder — pure, offline-safe.
 */

export interface ShareSummary {
  /** e.g. "Information Ocean Health Report" */
  title: string;
  /** e.g. "My feed was 86% Climate Action" */
  headline: string;
  /** Human-readable explanation of ocean bubble trap. */
  body: string;
  /** Status badge e.g. "Critical Bubble Formation" | "Healthy Current" */
  status: string;
  /** The headline/blurb of the hidden story. */
  suppressedHeadline: string;
  suppressedBlurb: string;
  /** Label of the suppressed topic. */
  suppressedTopicLabel: string;
  /** Label of the dominant topic. */
  dominantTopicLabel: string;
  /** Number of hidden perspectives. */
  hiddenCount: number;
  /** Diversity score (0-100). */
  diversity: number;
}

export function buildShareSummary(
  dominantTopicLabel: string,
  suppressedTopicLabel: string,
  suppressedHeadline: string,
  suppressedBlurb: string,
  diversity: number,
  dominantPct: number,
): ShareSummary {
  const headline = `My Feed Was ${dominantPct}% ${dominantTopicLabel}`;

  const status =
    diversity >= 70
      ? "Healthy Ocean Current"
      : diversity >= 40
        ? "Moderate Bubble Formation"
        : "Critical Bubble Formation";

  const body =
    `While the recommendation algorithm pulled my feed toward ${dominantTopicLabel}, ` +
    `it buried vital perspectives about ${suppressedTopicLabel}. ` +
    `Overall ocean diversity dropped to ${diversity}%.`;

  return {
    title: "Information Ocean Health Report",
    headline,
    body,
    status,
    suppressedHeadline,
    suppressedBlurb,
    suppressedTopicLabel,
    dominantTopicLabel,
    hiddenCount: 6,
    diversity,
  };
}

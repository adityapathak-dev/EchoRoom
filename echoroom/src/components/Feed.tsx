import FeedCard from "./FeedCard";
import type { ContentItem } from "../data/content";
import { computeFeed, type Weights } from "../lib/engine";

interface FeedProps {
  weights: Weights;
  engagedIds: ReadonlySet<number>;
  onEngage: (card: ContentItem) => void;
}

/**
 * Feed container — renders top 6 cards computed by engine.computeFeed().
 */
export default function Feed({ weights, engagedIds, onEngage }: FeedProps) {
  const visibleCards = computeFeed(weights);

  return (
    <div id="simulation-feed" className="flex flex-col gap-4">
      <div className="flex items-center justify-between font-mono text-xs text-text-muted px-1">
        <span className="font-semibold tracking-wider text-ocean-deep uppercase">
          SIMULATED FEED · LIVE RANKED TOP 6
        </span>
        <span>Click any card to engage</span>
      </div>

      {visibleCards.map((card) => (
        <FeedCard
          key={card.id}
          card={card}
          weights={weights}
          isEngaged={engagedIds.has(card.id)}
          onEngage={onEngage}
        />
      ))}
    </div>
  );
}

export interface LogEntry {
  id: number;
  manual: boolean;
  text: string;
}

interface LogTickerProps {
  log: LogEntry[];
}

/**
 * Ocean Stream Log — Ticker recording last 5 interactions.
 */
export default function LogTicker({ log }: LogTickerProps) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-2 font-mono text-[11px] font-semibold tracking-widest text-ocean-deep uppercase">
        OCEAN STREAM LOG · LIVE ACTIONS
      </div>

      {log.length === 0 && (
        <div className="font-mono text-xs text-text-muted italic">
          No interactions recorded yet. Click a card to begin.
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {log.map((entry) => (
          <div
            key={entry.id}
            className={[
              "font-mono text-xs leading-relaxed break-words animate-fade-in",
              entry.manual ? "text-ocean-seafoam font-semibold" : "text-text-muted",
            ].join(" ")}
          >
            &gt; {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}

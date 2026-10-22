import type { Brief, MemeSignal } from "../shared/index.js";

/**
 * Duet-style monitor: watches signals and writes a short brief.
 * It does not submit transactions. The owner decides what, if anything, happens next.
 */
export class ProactiveMonitor {
  review(signals: MemeSignal[]): Brief[] {
    return signals.flatMap((item) => {
      const briefs: Brief[] = [];
      if (item.volume24hUsd < 20_000) {
        briefs.push(brief(item, "risk", "Thin market", `${item.symbol} printed about ${formatUsd(item.volume24hUsd)} of volume. A paper idea here can gap through a stop.`));
      }
      if (item.change24hPct >= 50) {
        briefs.push(brief(item, "watch", "Fast move", `${item.symbol} is up ${item.change24hPct}% on the day. The default mandate still requires approval before any paper buy.`));
      }
      if (item.change24hPct <= -15) {
        briefs.push(brief(item, "info", "Pullback", `${item.symbol} is down ${Math.abs(item.change24hPct)}%. That is a note, not an order.`));
      }
      return briefs;
    });
  }
}

function brief(signal: MemeSignal, level: Brief["level"], title: string, body: string): Brief {
  return {
    id: `${signal.symbol}-${title}`.toLowerCase().replace(/\s+/g, "-"),
    level,
    title: `${signal.symbol}: ${title}`,
    body,
    observedAt: signal.observedAt,
  };
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

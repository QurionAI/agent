import type { MemeSignal } from "../shared/index.js";

/** Reads named Binance-style signals. Does not trade. */
export class TapeAgent {
  brief(signals: MemeSignal[], needle = ""): string {
    const hits = signals.filter((item) => !needle || item.symbol.toUpperCase().includes(needle.toUpperCase())).slice(0, 6);
    if (!hits.length) return "No named tape.";
    return hits.map((item) => `${item.symbol} ${item.priceUsd} 24h ${item.change24hPct}%`).join("\n");
  }
}

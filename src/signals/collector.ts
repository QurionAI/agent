import type { MemeSignal } from "../shared/index.js";

/**
 * Signal source for meme pairs: price, volume, and new listings.
 * EXPERIMENTAL. The mock source is the only adapter in v1.
 * A later adapter can read a public market API. It must not hold a trading key.
 */
export interface SignalCollector {
  collect(): Promise<MemeSignal[]>;
}

export class MockSignalCollector implements SignalCollector {
  constructor(private readonly now: () => Date = () => new Date()) {}

  async collect(): Promise<MemeSignal[]> {
    const observedAt = this.now().toISOString();
    return [
      signal("WBNB/SAMP", "Sample", 0.00042, 180_000, 36, observedAt),
      signal("WBNB/QUIET", "Quiet", 0.00011, 12_000, -18, observedAt),
      signal("WBNB/NEW", "Newpair", 0.00008, 4_500, 140, observedAt),
    ];
  }
}

function signal(pair: string, symbol: string, priceUsd: number, volume24hUsd: number, change24hPct: number, observedAt: string): MemeSignal {
  return {
    pair,
    token: "0x0000000000000000000000000000000000000000",
    symbol,
    priceUsd,
    volume24hUsd,
    change24hPct,
    source: "mock",
    observedAt,
  };
}

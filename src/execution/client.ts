import type { PaperRequest, PaperResult } from "../shared/index.js";

/**
 * Placeholder client for a later Binance Agent OS, MCP, or agentic-wallet adapter.
 *
 * EXPERIMENTAL. This object has no private key, no RPC signer, and no withdraw method.
 * Live mode is rejected even if a caller asks for it. Paper results are labels, not fills on a venue.
 */
export class ExecutionClient {
  async submit(request: PaperRequest): Promise<PaperResult> {
    if (request.kind === "withdraw") {
      return { status: "rejected", reason: "The agent cannot withdraw funds." };
    }
    if (request.kind === "live" || request.mode !== "paper") {
      return { status: "rejected", reason: "Live execution is disabled in v1." };
    }
    if (request.mandate?.revoked) {
      return { status: "rejected", reason: "The mandate has been revoked." };
    }
    if (request.mandate?.paused) {
      return { status: "rejected", reason: "The mandate is paused." };
    }
    const notional = BigInt(request.notionalWei);
    const max = request.mandate?.maxPositionWei ? BigInt(request.mandate.maxPositionWei) : undefined;
    const daily = request.mandate?.dailyLimitWei ? BigInt(request.mandate.dailyLimitWei) : undefined;
    if (notional <= 0n || (max !== undefined && notional > max) || (daily !== undefined && notional > daily)) {
      return { status: "rejected", reason: "The notional is outside the mandate." };
    }
    return {
      status: "needs_approval",
      reason: "Paper intent recorded locally. Nothing was sent to a venue or to the chain.",
    };
  }
}

/**
 * Shared shapes for the agent layer and the frontend.
 * EXPERIMENTAL. Meme trading is high-risk. These types have no live-trading mode.
 */

export type ExecutionMode = "paper";

export type ActionKind = "buy" | "sell";

export interface MandateDraft {
  maxPositionWei: string;
  dailyLimitWei: string;
  stopLossBps: number;
  approvalRequired: boolean;
  /** Always false in v1. The contracts reject true. */
  autoExecute: false;
  /** Always true in v1. The contracts reject false. */
  paperOnly: true;
  allowedTokens: string[];
  plainLanguage: string;
}

export interface MemeSignal {
  pair: string;
  token: string;
  symbol: string;
  priceUsd: number;
  volume24hUsd: number;
  change24hPct: number;
  source: "mock";
  observedAt: string;
}

export interface Brief {
  id: string;
  level: "info" | "watch" | "risk";
  title: string;
  body: string;
  observedAt: string;
}

export type WorkflowNodeType = "signal" | "condition" | "action" | "approval" | "paper" | "blocked";

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  params: Record<string, string | number | boolean>;
  next?: string[];
}

/** Visual-canvas compatible graph. Every graph ends in paper or blocked. */
export interface Workflow {
  id: string;
  title: string;
  mode: ExecutionMode;
  risk: "high";
  nodes: WorkflowNode[];
}

export interface PaperRequest {
  mode: ExecutionMode;
  kind: ActionKind | "withdraw" | "live";
  notionalWei: string;
  token?: string;
  workflowId?: string;
  mandate?: {
    paused?: boolean;
    revoked?: boolean;
    maxPositionWei?: string;
    dailyLimitWei?: string;
  };
}

export interface PaperResult {
  status: "paper_filled" | "needs_approval" | "rejected";
  reason: string;
}

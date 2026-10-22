import type { Workflow, WorkflowNode } from "./types.js";

const BLOCKED = /withdraw|transfer out|send funds|drain|private key|seed phrase|bypass|rug|honeypot|blacklist/i;

/**
 * Turns a plain-language request into a canvas graph.
 * This is a deterministic placeholder for a later model call.
 * It never emits a withdraw node or a live-execution node.
 */
export function draftWorkflow(prompt: string): Workflow {
  const id = `wf-${hash(prompt)}`;
  const text = prompt.trim();

  if (!text || BLOCKED.test(text)) {
    return {
      id,
      title: "Blocked request",
      mode: "paper",
      risk: "high",
      nodes: [
        {
          id: "blocked",
          type: "blocked",
          title: "The agent cannot do this",
          params: {
            reason: "Withdrawals, key handling, and mandate bypasses are refused.",
          },
        },
      ],
    };
  }

  const sell = /\bsell\b|\bexit\b/i.test(text);
  const kind = sell ? "sell" : "buy";
  const stop = stopPercent(text);
  const dip = text.match(/dip(?:s|ped)?[^\d%]{0,16}(\d+(?:\.\d+)?)\s*%/i);
  const entry = dip && Number(dip[1]) > 0 && Number(dip[1]) <= 100 ? -Number(dip[1]) : -5;
  const nodes: WorkflowNode[] = [
    {
      id: "signal",
      type: "signal",
      title: "Read meme signals",
      params: { source: "mock", lookback: "24h" },
      next: ["condition"],
    },
    {
      id: "condition",
      type: "condition",
      title: sell ? "Exit condition" : "Entry condition",
      params: { change24hPct: sell ? -stop : entry, stopLossBps: stop * 100 },
      next: ["action"],
    },
    {
      id: "action",
      type: "action",
      title: sell ? "Paper sell" : "Paper buy",
      params: { kind, mode: "paper" },
      next: ["approval"],
    },
    {
      id: "approval",
      type: "approval",
      title: "Owner approval",
      params: { required: true },
      next: ["paper"],
    },
    {
      id: "paper",
      type: "paper",
      title: "Simulated fill",
      params: { live: false },
    },
  ];

  return {
    id,
    title: text.slice(0, 80),
    mode: "paper",
    risk: "high",
    nodes,
  };
}

function stopPercent(text: string): number {
  const labeled = text.match(/stop[^\d%]{0,24}(\d+(?:\.\d+)?)\s*%/i);
  if (labeled) {
    const value = Number(labeled[1]);
    if (value > 0 && value <= 100) return value;
  }
  return readPercent(text) ?? 15;
}

export function readPercent(text: string): number | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) return undefined;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0 || value > 100) return undefined;
  return value;
}

function hash(input: string): string {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0).toString(16);
}

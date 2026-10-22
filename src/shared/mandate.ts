import { DEFAULT_DAILY_LIMIT_WEI, DEFAULT_MAX_POSITION_WEI, DEFAULT_STOP_LOSS_BPS } from "./constants.js";
import type { MandateDraft } from "./types.js";
import { readPercent } from "./workflow.js";

const ADDRESS = /0x[a-fA-F0-9]{40}/g;

/**
 * Fills a mandate form from a sentence. Missing fields stay at the safe defaults.
 * autoExecute is forced off and paperOnly is forced on.
 */
export function parseMandate(text: string, allowedTokens: string[] = []): MandateDraft {
  const max = readBnb(text, /max(?:imum)?(?: position)?[^\d]*(\d+(?:\.\d+)?)/i);
  const daily = readBnb(text, /daily[^\d]*(\d+(?:\.\d+)?)/i);
  const stopPct = readPercent(text);
  const found = text.match(ADDRESS) ?? [];
  const tokens = [...allowedTokens, ...found].map((item) => item.toLowerCase());

  return {
    maxPositionWei: max ?? DEFAULT_MAX_POSITION_WEI,
    dailyLimitWei: daily ?? DEFAULT_DAILY_LIMIT_WEI,
    stopLossBps: stopPct ? Math.round(stopPct * 100) : DEFAULT_STOP_LOSS_BPS,
    approvalRequired: !/without approval|no approval/i.test(text),
    autoExecute: false,
    paperOnly: true,
    allowedTokens: [...new Set(tokens)],
    plainLanguage: text.trim(),
  };
}

function readBnb(text: string, pattern: RegExp): string | undefined {
  const match = text.match(pattern);
  if (!match) return undefined;
  const whole = Number(match[1]);
  if (!Number.isFinite(whole) || whole <= 0 || whole > 1000) return undefined;
  const wei = BigInt(Math.round(whole * 1e6)) * 10n ** 12n;
  return wei.toString();
}

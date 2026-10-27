# Qurion Agent

Local TypeScript layer for Qurion’s owner desk. It drafts originals, names a public tape, prepares launch args, and records **paper** intents.

This repository is **not a hosted backend**, **not a signer**, and **not a trading venue**. There is no private-key code, no RPC wallet, and no withdraw path. A process started from this tree cannot send an order or move funds.

Qurion’s live console is [app.qurion.xyz](https://app.qurion.xyz). The marketing site is [qurion.xyz](https://qurion.xyz). The Next app implements the same rules in `main-app`; this package is the standalone, dependency-light copy of that logic.

## What this is

| Piece | Job | What it will not do |
| --- | --- | --- |
| **Architect** | Turn a sentence into a local product bundle (`README.md`, `TOKEN.md`) | Draft a withdraw path, a seed phrase, or a mandate bypass |
| **Tape** | Format named public quotes | Treat a quote as a fill or a return |
| **Launch** | Prepare `TokenFactory.launch` args (name, symbol, supply, URI) | Sign, broadcast, or claim a Binance CEX listing |
| **StrategyGenerator** | Parse a sentence into an AI Pro–style paper workflow | Call a model, place live, or handle a key |
| **ExecutionClient** | Label a paper intent `needs_approval` or `rejected` | Live mode, withdraw, or a venue fill |
| **Mandate parser** | Fill size / daily / stop from a sentence | Turn `autoExecute` on or turn `paperOnly` off |

Default ceilings match the contracts: **0.05 BNB** max position, **0.2 BNB** daily, **15%** stop, approval required, paper only.

## What this is not

- Not Flap Portal. The production launch path on BNB is Flap (`Portal.newTokenV6`). This package still describes the **optional** Qurion `TokenFactory`.
- Not Binance Agent OS, MCP, or an agentic wallet. `ExecutionClient` is a placeholder that **rejects** live.
- Not a GPU rental and not a hosted LLM. Optional model notes live in the Next app (`QURION_LLM_*`), not here.
- Not investment advice. Meme tokens and experimental software are high-risk.

## Layout

```
src/
  index.ts                 One-shot demo. Prints JSON. Does not sign.
  studio/architect.ts      Local drafter. Strips Solana / pump.fun wording.
  studio/tape.ts           Named public quotes → text brief.
  studio/launch.ts         Factory args. mintTo = owner. Agent wallet empty.
  strategy/generator.ts    Sentence → Workflow. Blocks withdraw / keys.
  execution/client.ts      Paper submit. Live and withdraw rejected.
  proactive/monitor.ts     Knock on named public moves. No order.
  signals/collector.ts     Mock tape. Swap for a public reader later.
  shared/                  Types, ABI fragments, mandate parser, constants.
prompts/strategy.md        System rules for a later model. Same refusals.
```

`src/shared` is duplicated on purpose so this repo does not import the Next app.

## Invariants

Keep these if you extend the code. They are product law, not style.

1. No private key, seed, or session secret enters this process.
2. The agent cannot withdraw, transfer, or bypass a mandate.
3. Live execution is off. `mode !== "paper"` is rejected.
4. A named price is a quote. It is not a fill and not a return.
5. `autoExecute` stays false. `paperOnly` stays true.
6. Launch mints to the **human** caller in the factory story. The agent wallet starts at zero.

## Run

Node 20+. No API keys required.

```bash
npm install
npm run check    # tsc --noEmit
npm run dev      # prints one JSON demo and exits
```

`npm run dev` is a **one-shot CLI**, not a server. There is no listen port.

Example (shape only):

```json
{
  "paper": {
    "status": "needs_approval",
    "reason": "Paper intent recorded locally. Nothing was sent to a venue or to the chain."
  },
  "blocked": { },
  "launch": {
    "chain": "BNB Smart Chain",
    "factory": "TokenFactory.launch",
    "mintTo": "owner",
    "agentWallet": "empty",
    "live": false,
    "listing": "not-binance-cex"
  }
}
```

## Public GitHub

This tree is safe to publish **if** you do not add secrets later.

Already true here:

- No `.env` with keys. `.gitignore` drops `.env`, `.env.local`, `node_modules/`, `dist/`.
- No deployer wallet. No Binance signed REST.
- Demo signals are mock. They are not a live feed.

Before you `git push`:

```bash
git status
git grep -iE 'private_key|mnemonic|api_key|secret' || true
```

Do not commit a real `QURION_LLM_API_KEY` if you later wire a model. Do not point `ExecutionClient` at a signer in this public repo without a separate, reviewed design.

License: treat as experimental software. Contracts in the sibling repo are MIT; keep this package in the same spirit unless you choose otherwise.

## Related

| Repo / surface | Role |
| --- | --- |
| Qurion contracts | On-chain factory, mandate, wallet, studio. `executeLive` reverts. |
| `main-app` | Next console: Build, publish `/p/{id}`, Flap launch, Arcade paper heat. |
| `landing-page` | Vite site at qurion.xyz |

---

Experimental. High-risk domain. This process cannot sign and cannot trade live.

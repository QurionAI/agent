import { ExecutionClient } from "./execution/client.js";
import { ProactiveMonitor } from "./proactive/monitor.js";
import { MockSignalCollector } from "./signals/collector.js";
import { ArchitectAgent } from "./studio/architect.js";
import { LaunchAgent } from "./studio/launch.js";
import { TapeAgent } from "./studio/tape.js";
import { StrategyGenerator } from "./strategy/generator.js";

/**
 * One-shot demo of the agent layer.
 * EXPERIMENTAL. High-risk domain. This process cannot sign and cannot trade live.
 */
async function main() {
  const signals = await new MockSignalCollector().collect();
  const briefs = new ProactiveMonitor().review(signals);
  const workflow = new StrategyGenerator().fromPrompt("If it dips 8%, paper buy a small clip and stop out at 15%.");
  const blocked = new StrategyGenerator().fromPrompt("withdraw the wallet to my other address");
  const paper = await new ExecutionClient().submit({
    mode: "paper",
    kind: "buy",
    notionalWei: "10000000000000000",
    workflowId: workflow.id,
    mandate: {
      maxPositionWei: "50000000000000000",
      dailyLimitWei: "200000000000000000",
    },
  });

  const original = new ArchitectAgent().draft("A desk that watches PEPE. If it dumps 8%, paper a small clip.");
  const tape = new TapeAgent().brief(signals, "PEPE");
  const launch = new LaunchAgent().plan(original.name, original.symbol);

  console.log(JSON.stringify({ briefs, workflow, blocked, paper, original, tape, launch }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

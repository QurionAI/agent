import { draftWorkflow, type Workflow } from "../shared/index.js";

/**
 * AI Pro style workflow generator.
 * EXPERIMENTAL. v1 does not call a model and does not return a live order.
 * When an LLM is added, it may only fill this same Workflow shape.
 * Prompts that ask to withdraw, bypass a mandate, or handle a private key are blocked.
 */
export class StrategyGenerator {
  fromPrompt(prompt: string): Workflow {
    return draftWorkflow(prompt);
  }
}

const BLOCKED = /withdraw|seed phrase|private key|mnemonic|bypass mandate/i;

export interface ProductDraft {
  name: string;
  symbol: string;
  brief: string;
  files: { path: string; body: string }[];
}

/** Local architect. No vendor model. Refuses withdraw and key prompts. */
export class ArchitectAgent {
  draft(prompt: string): ProductDraft {
    if (BLOCKED.test(prompt)) {
      throw new Error("The architect will not draft a withdraw path, a key, or a mandate bypass.");
    }
    const text = (prompt.trim() || "A BNB original that watches the public tape.").replace(/solana|pump\.fun|\bsols?\b/gi, "BNB");
    const skip = new Set(["watch", "the", "a", "an", "on", "and", "for", "from", "with", "this", "draft", "public", "tape", "sol", "solana"]);
    const words = text.replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter((item) => item.length > 2 && !skip.has(item.toLowerCase()));
    const name = words.slice(0, 2).map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" ") || "BNB Original";
    const symbol = (name.replace(/[^A-Za-z]/g, "").slice(0, 5) || "NOTE").toUpperCase();
    return {
      name,
      symbol,
      brief: text.slice(0, 280),
      files: [
        { path: "README.md", body: `# ${name}\n\n${text}\n\nBNB original. Agent cannot withdraw. Not a Binance listing.\n` },
        { path: "TOKEN.md", body: `# ${symbol}\nSupply 1000000 minted to the owner. Agent wallet empty.\n` },
      ],
    };
  }
}

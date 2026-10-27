/** Prepares TokenFactory args. Does not sign and does not list on Binance CEX. */
export class LaunchAgent {
  plan(name: string, symbol: string) {
    return {
      chain: "BNB Smart Chain",
      factory: "TokenFactory.launch",
      name,
      symbol,
      supply: "1000000000000000000000000",
      mintTo: "owner",
      agentWallet: "empty",
      live: false,
      listing: "not-binance-cex",
    };
  }
}

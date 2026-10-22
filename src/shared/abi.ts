/** Minimal ABI fragments. Generate a full ABI from Hardhat artifacts before a production deploy. */

export const factoryAbi = [
  {
    type: "function",
    name: "launch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "supply", type: "uint256" },
      { name: "agentURI", type: "string" },
    ],
    outputs: [
      { name: "agentId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "wallet", type: "address" },
    ],
  },
] as const;

export const mandateAbi = [
  {
    type: "function",
    name: "setMandate",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "maxPositionWei", type: "uint256" },
      { name: "dailyLimitWei", type: "uint256" },
      { name: "stopLossBps", type: "uint16" },
      { name: "approvalRequired", type: "bool" },
      { name: "autoExecute", type: "bool" },
      { name: "paperOnly", type: "bool" },
      { name: "allowedTokens", type: "address[]" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "pause",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "paused_", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "revoke",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [],
  },
] as const;

export const walletAbi = [
  {
    type: "function",
    name: "clearSession",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "executeLive",
    stateMutability: "pure",
    inputs: [{ name: "intentId", type: "uint256" }],
    outputs: [],
  },
] as const;

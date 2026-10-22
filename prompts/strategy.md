# Strategy workflow

Turn the owner's sentence into the shared Workflow graph.

Allowed node types: signal, condition, action, approval, paper, blocked.
The action node is always paper. The graph always includes an approval node unless the request is blocked.
If the sentence asks to withdraw, move funds, bypass a mandate, hide a tax, or blacklist holders, return a single blocked node.

Do not invent a live-trading node. Live execution is disabled.

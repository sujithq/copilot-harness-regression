# T05 - Copilot workspace MCP discovery

Verify root `.mcp.json` discovery and server startup independently from model
tool selection.

## Prompt or procedure

1. Open the repository as a trusted workspace and start a new Copilot-harness
   chat.
2. Open the MCP/customization listing available in the current client.
3. Inspect `harness-repro-workspace-mcp`, its status, and available tools.
4. Start the server if the UI requires explicit start.
5. Inspect the server output for the fixed startup marker.
6. Do not ask the model to call the tool in this scenario.

## Expected marker or output

- Server name: `harness-repro-workspace-mcp`.
- Tool name: `emit_repro_marker` (the UI may qualify it with the server name).
- Server stderr marker: `HARNESS_REPRO_MCP_SERVER_STARTED:v1`.
- Configuration source: workspace root `.mcp.json`.
- The server remains a no-network, read-only, local stdio process.

No `HARNESS_REPRO_MCP_TOOL_EXECUTED:v1` marker is expected before T06.

## Environment evidence

- VS Code/Copilot version, Copilot harness identity, OS/host, trust state,
  branch, commit, Node.js version, and `node` resolution.
- MCP list/start UI, configuration source/path, command, arguments, and status.
- Any `cwd`, sandbox, permission, duplicate-name, or PATH diagnostic.
- Server stderr/start marker and process start/ready timestamps if visible.
- Available tools in Chat Debug definitions.

## Actual result

- **Status:** `<not-run/pass/fail/undetermined>`
- **Server discovered:** `<yes/no>`
- **Server started:** `<yes/no>`
- **Tool discovered:** `<yes/no>`
- **Startup marker:** `<observed/not observed>`
- **Configuration/error evidence:** `<sanitized>`
- **Unexpected tool call count:** `<0 expected>`

## Pass/fail criteria

**Pass:** the server is discovered from root `.mcp.json`, starts without stdout
protocol noise, and exposes `emit_repro_marker`; the server startup marker is
observed in stderr/output.

**Fail:** the direct invocation test passes but the trusted Copilot-harness
workspace shows a reproducible config/startup/discovery error after source path,
Node/PATH, trust, and sandbox checks.

**Configuration/policy:** restricted trust, a policy disabling MCP, Node/PATH
failure, or unsupported client version is not a product-behavior conclusion.

## Evidence and log locations

- MCP server listing/status: `results/runs/<run-id>/T05-servers.txt`.
- Sanitized server output: `results/runs/<run-id>/T05-mcp-output.txt`.
- Chat tool definitions excerpt: `results/runs/<run-id>/T05-tool-definitions.txt`.
- Screenshots: `results/runs/<run-id>/T05-*`.

## Manual steps

1. Run `node scripts/invoke-mcp.mjs T05-control` before testing VS Code and
   preserve its JSON output.
2. Confirm the control command exits zero; do not continue to UI classification
   if the local protocol control fails.
3. Open MCP discovery/start status and record the exact server/config path.
4. Expand server output and retain stdout/protocol versus stderr diagnostics.
5. Inspect the chat tool definitions but do not call the tool.
6. If discovery fails, capture trust, command/PATH, working-directory, policy,
   and stale-session facts before retrying.

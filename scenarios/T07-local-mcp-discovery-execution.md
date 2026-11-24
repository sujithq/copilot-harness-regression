# T07 - Legacy Local MCP discovery and execution

Compare the separately named Local configuration in `.vscode/mcp.json` without
changing global or user settings.

## Prompt or procedure

Only proceed if the Legacy Local harness is already available under the current
approved environment.

1. Open a new Local-harness chat in the trusted workspace.
2. Verify that `harness-repro-local-mcp` and `emit_repro_marker` are listed.
3. Submit:

```text
Call the harness-repro-local-mcp emit_repro_marker tool exactly once with trial set to T07. Return the tool's exact text and do not call any other tool.
```

4. Expand the actual tool result.

## Expected marker or output

```json
{"marker":"HARNESS_REPRO_MCP_TOOL_EXECUTED:v1","origin":"local","trial":"T07"}
```

Expected server name: `harness-repro-local-mcp`. Expected configuration source:
`.vscode/mcp.json`. Expected tool-call count: one. Server stderr should contain
`HARNESS_REPRO_MCP_SERVER_STARTED:v1`.

## Environment evidence

- Local availability, deprecation warning, organization policy, and whether the
  current client allows Local in the Chat view.
- VS Code/Copilot version, Local harness identity, exact model, OS/host, trust,
  branch, commit, Node.js/PATH, and `REPRO_MCP_ORIGIN`.
- Discovery/start status for the Local server and tool definitions.
- Any sandbox, permission, working-directory, or forwarding diagnostic.
- Prompt-to-final duration and expanded tool call/response.

## Actual result

- **Status:** `<not-run/pass/fail/configuration-or-policy>`
- **Local server/tool discovered:** `<yes/no>`
- **Exact tool output:** `<fill>`
- **Tool-call count:** `<number>`
- **Unavailable reason:** `<none or exact policy/version limitation>`
- **Timing:** `<milliseconds>`

## Pass/fail criteria

**Pass:** the Local server is discovered from `.vscode/mcp.json`, one tool call
returns the exact result with `origin: "local"`, and no workspace server with
the same name is substituted.

**Configuration/policy:** Local is absent, disabled, removed, or blocked; this
is not a Local-behavior failure. Record the reason and leave Local unavailable.

**Fail:** Local is available and the direct MCP control plus configuration check
pass, but repeated fresh Local sessions show a definitive discovery/start/execution
failure unrelated to policy, trust, Node/PATH, or sandboxing.

## Evidence and log locations

- Local server output: `results/runs/<run-id>/T07-mcp-output.txt`.
- Session/tool expansion: `results/runs/<run-id>/T07-session.txt`.
- Timing row: `results/runs/<run-id>/trials.csv`.
- Policy/availability evidence: `results/runs/<run-id>/T07-availability.txt`.

## Manual steps

1. Record Local availability without changing any global/user setting.
2. Run the direct invocation control independently.
3. Start a new Local chat and inspect its MCP server/tool listing.
4. Send the exact prompt and preserve the expanded tool call.
5. If Local is unavailable, mark all Local-specific timing not run and continue
   with the Copilot-harness side.

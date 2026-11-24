# T09 - Plugin skill and MCP behavior

Verify both Agent Plugins 1.0 components after T08 establishes discovery.

## Prompt or procedure

Part A, in a new Copilot-harness chat:

```text
/copilot-harness-repro:harness-repro-plugin-skill Run the packaged deterministic skill check for trial T09. Return the three exact required marker lines and identify any read or script failure.
```

Use the exact slash command displayed by the current client if it formats plugin
skill commands differently; record that rendered command.

Part B, in the same environment but a new trial record:

```text
Call the harness-repro-plugin-mcp emit_repro_marker tool exactly once with trial set to T09. Return the tool's exact text and do not call the workspace MCP server.
```

## Expected marker or output

Part A:

```text
HARNESS_REPRO_PLUGIN_SKILL_BODY_LOADED:v1
HARNESS_REPRO_PLUGIN_SKILL_REFERENCE_LOADED:v1
HARNESS_REPRO_PLUGIN_SKILL_SCRIPT_EXECUTED:v1
```

Part B:

```json
{"marker":"HARNESS_REPRO_MCP_TOOL_EXECUTED:v1","origin":"plugin","trial":"T09"}
```

The expanded tool call must identify `harness-repro-plugin-mcp`, not the
workspace or Local server.

## Environment evidence

- T08 install source/version, reinstall state, and component discovery.
- VS Code/Copilot version, harness, model, selected agent, OS/host, trust,
  branch, commit, plugin cache state, and available tools.
- Rendered plugin skill command/path and linked-resource/script activity.
- Qualified MCP tool name, server source, tool arguments, and exact result.
- Separate duration/tool-count records for Parts A and B.

## Actual result

- **Status:** `<not-run/pass/fail/undetermined>`
- **Plugin-skill markers:** `<list exact markers>`
- **Plugin script/read evidenced:** `<yes/no/unknown>`
- **Plugin MCP output:** `<exact text>`
- **Qualified tool server:** `<fill>`
- **Part A/B tool calls and timings:** `<fill>`
- **Wrong server used:** `<yes/no>`

## Pass/fail criteria

**Pass:** all three plugin-skill markers and the exact plugin-origin MCP result
are independently evidenced. The correct packaged resource/script/server is
identified in tool activity.

**Fail:** T08 confirms the plugin components, but a fresh-session/reinstalled
plugin cannot execute its skill or MCP behavior and logs rule out trust, tool
selection, cache, path, and policy explanations.

**Undetermined:** the final answer is correct without component-qualified
evidence, or the UI renders a different unrecorded command/server identity.

## Evidence and log locations

- Part A session: `results/runs/<run-id>/T09-skill-session.txt`.
- Part B tool expansion: `results/runs/<run-id>/T09-mcp-session.txt`.
- Plugin server output: `results/runs/<run-id>/T09-plugin-mcp-output.txt`.
- Timing rows: `results/runs/<run-id>/trials.csv`.

## Manual steps

1. Complete T08 and confirm a new/reinstalled plugin state.
2. Run Part A and preserve the exact rendered skill command, linked read,
   script command, exit code, and stdout.
3. Run Part B and expand the tool call to verify the plugin server identity.
4. Record Part A and Part B in separate timing rows and tool-call counts.
5. If the wrong MCP server is selected, preserve that evidence and retry once
   with an explicit qualified tool name before classifying.

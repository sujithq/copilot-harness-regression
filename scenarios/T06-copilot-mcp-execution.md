# T06 - Copilot workspace MCP execution

Verify that the Copilot harness discovers and actually executes the workspace
MCP tool, rather than only producing a plausible text response.

## Prompt or procedure

In a new Copilot-harness chat, after T05 succeeds, submit:

```text
Call the harness-repro-workspace-mcp emit_repro_marker tool exactly once with trial set to T06. Return the tool's exact text and do not call any other tool.
```

Use the qualified tool name shown by the current UI if the UI requires it.

## Expected marker or output

The tool result and final response must contain:

```json
{"marker":"HARNESS_REPRO_MCP_TOOL_EXECUTED:v1","origin":"workspace","trial":"T06"}
```

Expected tool-call count is one. Expected server start marker:
`HARNESS_REPRO_MCP_SERVER_STARTED:v1`.

## Environment evidence

- T05 server/tool discovery state and current process status.
- VS Code/Copilot version, harness, model, selected agent, OS/host, trust,
  branch, commit, and Node.js version.
- Tool picker/listing name and approval state.
- Prompt-to-first-output, tool start/end, and prompt-to-final times.
- Expanded tool call showing the `tools/call` result and any response References.
- Server stderr/output and error state.

## Actual result

- **Status:** `<not-run/pass/fail/undetermined>`
- **Tool selected/called:** `<yes/no plus qualified name>`
- **Exact tool text:** `<fill>`
- **Marker/origin/trial:** `<fill>`
- **Tool-call count:** `<number>`
- **Timing:** `<first output ms; total ms>`
- **Model-only plausible text:** `<yes/no>`

## Pass/fail criteria

**Pass:** one tool call to the discovered workspace server returns the exact JSON
above with `origin` equal to `workspace`, and the expanded call is preserved.

**Fail:** T05 and the direct control pass, but repeated fresh-session runs with
the same model show a definitive server/tool execution error or wrong origin.
If the model does not select the tool, classify it separately as selection.

**Undetermined:** the final text is correct but no tool-call activity/result can
be inspected.

## Evidence and log locations

- Session and tool expansion: `results/runs/<run-id>/T06-session.txt`.
- MCP output: `results/runs/<run-id>/T06-mcp-output.txt`.
- Timing and call count: `results/runs/<run-id>/trials.csv`.
- Sanitized support excerpt: `results/runs/<run-id>/T06-support.txt`.

## Manual steps

1. Confirm the T05 workspace server is running or start it explicitly.
2. Start timing immediately before sending the prompt.
3. Submit once and expand the exact `emit_repro_marker` tool call.
4. Record arguments, server response, final response, and tool-call count.
5. Do not accept matching final prose without the expanded tool result.
6. If selection fails, record whether another tool was called and retry once in a
   new session with the same environment.

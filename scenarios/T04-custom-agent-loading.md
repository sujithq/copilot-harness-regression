# T04 - Custom agent loading

Verify that selecting the repository custom agent loads its body instructions
and respects its explicit empty tool list.

## Prompt or procedure

1. Open a new Copilot-harness chat.
2. Select `harness-repro-agent` from the agent picker.
3. Submit:

```text
Run the custom-agent body loading check for trial T04. Return only the agent's required marker lines.
```

4. Repeat in each other already-available harness. Do not select a skill at the
   same time.

## Expected marker or output

The custom-agent response must be exactly:

```text
HARNESS_REPRO_AGENT_BODY_LOADED:v1
HARNESS_REPRO_AGENT_INSTRUCTIONS_ACTIVE:v1
```

Because the agent declares `tools: []`, expected tool-call count is zero.

## Environment evidence

- T01 custom-agent discovery state and the selected agent name/path.
- VS Code/Copilot version, harness, model, OS/host, trust, branch, commit, and
  dirty state.
- Agent tool definitions or tool-list evidence showing no tools.
- Prompt-to-first-output and total response duration.
- Agent Debug/Chat Debug event identifying the selected agent and body context.

## Actual result

- **Status:** `<not-run/pass/fail/undetermined>`
- **Selected agent:** `<exact UI value>`
- **Markers observed:** `<list exact markers>`
- **Tool calls:** `<count and names>`
- **Additional response text:** `<none or sanitized text>`
- **Duration:** `<milliseconds>`

## Pass/fail criteria

**Pass:** both body markers appear exactly, the custom agent is recorded as
selected, and no tool call occurs.

**Fail:** the available, discovered agent is selected in a new session but its
body markers are absent after log review, or a tool is called despite the empty
tool list. An unlisted agent is a T01 discovery failure, not by itself proof of
T04 non-inclusion.

## Evidence and log locations

- Session export: `results/runs/<run-id>/T04-session.txt`.
- Agent-selection/context log: `results/runs/<run-id>/T04-debug.txt`.
- Timing row and zero tool count: `results/runs/<run-id>/trials.csv`.
- Selection screenshot: `results/runs/<run-id>/T04-agent.png`.

## Manual steps

1. Confirm the agent, not a similarly named prior chat, is selected.
2. Start capture before submitting the prompt.
3. Submit the exact prompt and do not continue the conversation before copying
   the agent-selection context.
4. Expand the tool activity and record an explicit zero if none are present.
5. If markers are missing, inspect the agent body/discovery event and retry in a
   fresh session once before classification.

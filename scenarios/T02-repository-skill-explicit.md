# T02 - Repository skill explicit invocation

Verify explicit repository-skill invocation and collect body, linked-resource,
script, and tool-activity evidence.

## Prompt or procedure

In a new Copilot-harness chat, submit:

```text
/harness-repro-skill Run the deterministic repository skill check for trial T02. Return the three exact required marker lines and identify any read or script failure.
```

Repeat once in Local only if that harness is already available. Keep the
prompt, model, workspace, trust state, and available tools unchanged.

## Expected marker or output

The response must include these exact lines:

```text
HARNESS_REPRO_REPOSITORY_SKILL_BODY_LOADED:v1
HARNESS_REPRO_REPOSITORY_SKILL_REFERENCE_LOADED:v1
HARNESS_REPRO_REPOSITORY_SKILL_SCRIPT_EXECUTED:v1
```

Tool activity should show a read of `references/marker.txt` and execution of
`scripts/emit-marker.mjs`, with exit code zero. The script's exact stdout is the
third marker.

## Environment evidence

- T01 discovery state for the same harness and session start.
- VS Code/Copilot version, harness, model, selected agent, OS/host, trust state,
  branch, commit, and dirty state.
- Skill command source/path and available tool definitions.
- Start/end timestamps, prompt-to-first-output, total response time, and
  tool-call count.
- References section, Agent Debug/Chat Debug logs, and terminal tool details.

## Actual result

- **Status:** `<not-run/pass/fail/undetermined>`
- **Markers observed:** `<list exact markers>`
- **Read resource evidenced:** `<yes/no/unknown plus log>`
- **Script exit/stdout evidenced:** `<yes/no/unknown plus log>`
- **Tool-call count:** `<number>`
- **Duration:** `<milliseconds and timing scope>`
- **Unexpected output:** `<sanitized summary>`

## Pass/fail criteria

**Pass:** all three exact marker lines appear, the linked reference and script
execution are evidenced in tool activity/logs, and the script exits zero.

**Fail:** the scenario is executed in the same discovered configuration and the
required markers or executions are definitively absent or rejected. A failed
reply alone is not enough; first classify discovery, inclusion, resource, and
tool failures separately.

**Undetermined:** logs are unavailable and the response cannot be corroborated.

## Evidence and log locations

- Chat/session export: `results/runs/<run-id>/T02-session.txt`.
- Tool references/debug excerpt: `results/runs/<run-id>/T02-debug.txt`.
- Timing row: `results/runs/<run-id>/trials.csv`.
- Screenshots: `results/runs/<run-id>/T02-*`.

## Manual steps

1. Confirm T01 discovered the skill in this harness.
2. Start the Agent Debug/Chat Debug capture if already available in the approved
   environment; logging is not retroactive.
3. Submit the exact slash prompt and record the start time before sending.
4. Expand each tool call and preserve the read, command, exit code, and stdout.
5. Record first-output and completion times without substituting local benchmark
   metrics.
6. If a response fails, capture `/troubleshoot` or discovery/rejection evidence
   before retrying in a new session.

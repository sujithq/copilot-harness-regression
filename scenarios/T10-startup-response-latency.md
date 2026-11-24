# T10 - Startup and response latency

Compare repeated Copilot- and available Local-harness startup/execution timing
under fixed prompts, model, tools, trust, and workspace. Local Node timing is a
separate control, not part of the harness comparison.

## Prompt or procedure

Run the control once:

```text
node scripts/measure-mcp-latency.mjs 20
```

For each available harness, collect at least **five cold** and **ten warm**
trials. A cold trial starts after a new chat/session has selected the intended
harness; a warm trial starts after the same chat has completed one successful
tool call. Use this Copilot prompt, substituting only the server name for Local:

```text
Call the <harness-specific-server> emit_repro_marker tool exactly once with trial set to T10-<harness>-<trial>. Return the tool's exact text and no other content.
```

Server names:

- Copilot: `harness-repro-workspace-mcp`
- Local: `harness-repro-local-mcp`

Start timing immediately before sending, record first visible output, and stop
at the final response. Use the same model and available tool set. Do not change
environment settings between alternating harness batches.

## Expected marker or output

Every harness trial must contain:

```text
HARNESS_REPRO_MCP_TOOL_EXECUTED:v1
```

Its tool text must identify the expected `origin` (`workspace` or `local`) and
the exact trial label. Local protocol control output must have
`metricType: "local-mcp-stdio-protocol"` and the explicit warning that it does
not measure VS Code/Copilot latency.

## Environment evidence

- Every field in `results/run-template.json`, with versions captured before the
  first trial.
- Harness, model, selected agent, trust, OS, host, CPU/power state if available,
  and network/remote mode.
- Server discovery state, tool approval, plugin state, branch, commit, dirty
  state, and Node version.
- Cold/warm definition, trial order, excluded retries, exact start/end
  timestamps, first-output and final-response duration, and tool-call count.
- Agent Debug/Chat Debug start/execution events where capture is available.

## Actual result

- **Copilot cold trials:** `<count, metrics, outcome>`
- **Copilot warm trials:** `<count, metrics, outcome>`
- **Local cold trials:** `<count, metrics, or not run reason>`
- **Local warm trials:** `<count, metrics, or not run reason>`
- **Local protocol control:** `<summary or path>`
- **Tool-call/output failures:** `<none or classified details>`
- **Outliers/exclusions:** `<none or exact reason>`
- **Comparison classification:** `<timing-only / environment / undetermined>`

## Pass/fail criteria

**Pass:** all required trials have complete timing, origin-correct tool results,
and consistent environment records. A latency difference is an observation,
not an automatic pass/fail or product defect.

**Fail:** the configured protocol cannot produce correct origin/marker output
for the repeated trials, or required timing/tool evidence is incomplete after
reliable capture attempts.

**Not run:** a harness is unavailable, unapproved, or policy-disabled. Do not
infer lower performance from a missing harness.

Classify a measured difference as `product-behavior-candidate` only after
repeated runs and equivalent version, model, prompt, trust, server, tool, and
host conditions are established.

## Evidence and log locations

- Harness trial rows: `results/runs/<run-id>/trials.csv`.
- Local protocol JSON: `results/runs/<run-id>/T10-local-mcp-metrics.json`.
- Sanitized session/debug excerpts: `results/runs/<run-id>/T10-*.txt`.
- Environment snapshot: `results/runs/<run-id>/run.json`.

## Manual steps

1. Run `npm run check` before the timing experiment and preserve the exit code.
2. Run the 20-trial local protocol control and label it separately.
3. Create the run JSON and record environment/configuration once.
4. Collect Copilot cold then warm trials using the exact prompt substitution.
5. If Local is available, collect the same cold/warm trial counts.
6. Do not omit failed or slow trials; mark exclusions and reasons explicitly.
7. Sanitize trial output and compute summary metrics only from equivalent
   timing scopes and successful, origin-correct tool calls.

# Result capture

Do not overwrite the templates. Copy `run-template.json` to a new local file,
replace placeholders, and add sanitized logs under a local
`results/runs/<run-id>/` directory. The checked-in `.gitignore` blocks raw files
under that directory from normal Git status; verify with `git status` before
sharing anything.

## Machine-readable run template

[`run-template.json`](run-template.json) captures:

- VS Code, Copilot extension/app, model, harness, and selected agent.
- OS, architecture, host type, workspace trust, branch, commit, Node.js, and
  workspace/plugin/MCP configuration facts.
- Every T01-T10 expected result, actual result, manual step state, timing,
  tool-call count, evidence path, and classification.
- Sanitization state and the public-safety review decision.

Use exact product version strings. Do not replace an unavailable value with an
assumption; use `null` and explain it in `notes`.

## Trial template

[`trial-template.csv`](trial-template.csv) is copy-safe and intentionally flat.
Use one row per timing or repeated invocation trial. Keep `timing_scope` equal to
one of:

- `local_mcp_process_to_initialize`
- `local_mcp_tool_call`
- `local_mcp_process_lifetime`
- `harness_cold_start_to_final`
- `harness_warm_prompt_to_final`

Keep local MCP and harness measurements separate. The local benchmark is a
control for server/protocol correctness, not an estimate of model or VS Code
latency.

## Classification

Use one of these values:

- `not-run`
- `pass`
- `configuration-or-policy`
- `model-or-tool-selection`
- `trust-or-sandbox`
- `plugin-cache-or-install`
- `timing-or-environment`
- `product-behavior-candidate`
- `undetermined`

Only use `product-behavior-candidate` when the same current configuration was
reproduced in repeated trials and discovery, inclusion, execution, trust, and
environment alternatives were checked.

## Evidence hygiene

Raw debug logs and chat exports can contain secrets and confidential source.
Keep them outside version control, sanitize copies before review, and record the
review state. An omitted or redacted log is not a pass. Note what was omitted and
why.

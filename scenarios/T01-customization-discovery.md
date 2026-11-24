# T01 - Repository customization discovery

Verify that the current client can discover the repository custom agent and
repository skill before any prompt asks the model to use them.

## Prompt or procedure

No model prompt is required.

1. Open this repository in a trusted workspace.
2. Start a new Copilot-harness chat and open the agent/skill discovery surface
   available in that version (for example **Chat: Open Customizations**, the `/`
   command menu, and agent picker).
3. Look for `harness-repro-agent` and `harness-repro-skill`.
4. Record discovery, skipped, rejected, duplicate, or invalid-entry messages.
5. Repeat in a new Legacy Local chat only if Local is already available. Do not
   change global/user configuration to enable it.

## Expected marker or output

No execution marker is expected in T01.

Expected discovery state:

- `harness-repro-agent` is listed from
  `.github/agents/harness-repro-agent.agent.md`.
- `harness-repro-skill` is listed from
  `.github/skills/harness-repro-skill/SKILL.md`.
- The skill is available in the `/` menu when the client supports user-invocable
  skill commands.
- No invalid-name, missing-description, duplicate, or rejected diagnostic is
  attributed to either file.

## Environment evidence

- VS Code version/build and Copilot extension/app version.
- Harness and Local availability/policy.
- Operating system, architecture, and local/remote/container host.
- Workspace Trust, branch, commit, and working-tree state.
- Exact discovery UI or command and time opened.
- Available Agent Debug Logs, Chat Debug View, or `/troubleshoot` output.
- Screenshot or sanitized export showing the listed agent and skill.

## Actual result

- **Copilot harness discovery:** `<listed/missing/error/not-run>`
- **Local discovery:** `<listed/missing/error/not-run>`
- **Exact diagnostics:** `<none or sanitized text>`
- **Execution inferred:** `No; this scenario only tests discovery`

## Pass/fail criteria

**Pass:** the available harness discovers the expected repository entries with
no rejection diagnostics attributable to them.

**Not run:** a harness is unavailable or access was not permitted; record the
reason rather than marking it failed.

**Fail:** with a trusted workspace and valid files, a harness has no matching
discovery entry. Before classification, verify session age, parent-worktree
state, ignored/duplicate copies, and available rejection logs.

## Evidence and log locations

- Copy-safe result: `results/runs/<run-id>/run.json`.
- Sanitized discovery export: `results/runs/<run-id>/T01-discovery.txt`.
- Screenshots or logs: `results/runs/<run-id>/T01-*`.
- Raw, unsanitized debug logs: keep outside this repository.

## Manual steps

1. Capture the environment template fields before opening customization views.
2. Record the exact path/source shown for each discovered entry.
3. Record absent entries and all visible diagnostics, even if another harness
   succeeds.
4. Start a fresh session if discovery occurred after the chat was already open;
   note both observations.
5. Sanitize and attach evidence; do not treat a correct T02 answer as proof that
   T01 discovery was observed.

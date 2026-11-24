# T03 - Repository skill automatic invocation

Test whether the model selects and invokes the repository skill without an
explicit slash command.

## Prompt or procedure

In a new Copilot-harness chat, with no custom agent selected, submit:

```text
Perform the repository's deterministic Copilot harness reproduction skill check for trial T03. Return only the three marker lines required by that check, and do not invent missing markers.
```

Repeat only if Local or another supported harness is independently available.
Do not change the skill description during the comparison.

## Expected marker or output

```text
HARNESS_REPRO_REPOSITORY_SKILL_BODY_LOADED:v1
HARNESS_REPRO_REPOSITORY_SKILL_REFERENCE_LOADED:v1
HARNESS_REPRO_REPOSITORY_SKILL_SCRIPT_EXECUTED:v1
```

The execution record should show that the repository skill was selected from
its description/body and that the linked file and script were used. A model
that already knows the marker strings from the prompt history must not be used.

## Environment evidence

- New-session confirmation and prior prompt count.
- VS Code/Copilot version, harness, exact model, no-agent selection, OS/host,
  trust, branch, commit, and dirty state.
- Skill discovery state before the prompt.
- Prompt-to-final duration, tool-call count, and available-tools snapshot.
- References, Discovery events, and command/read tool activity.
- Any model selection, approval, or sandbox event that changed behavior.

## Actual result

- **Status:** `<not-run/pass/fail/undetermined>`
- **Skill selection evidenced:** `<yes/no/unknown>`
- **Markers observed:** `<list exact markers>`
- **Resource/script evidence:** `<fill>`
- **Tool-call count/duration:** `<fill>`
- **Alternative explanation:** `<fill or none>`

## Pass/fail criteria

**Pass:** the model selects `harness-repro-skill` without a slash command and all
three markers are corroborated by resource/script execution.

**Fail:** the same discovered skill repeatedly is not selected, despite a fresh
session, matching prompt, and available tools, and logs show no external
explanation. Classify whether this is model selection rather than automatically
calling it a discovery defect.

**Undetermined:** a correct-looking response cannot be tied to skill selection,
or tool/log access was unavailable.

## Evidence and log locations

- Session export: `results/runs/<run-id>/T03-session.txt`.
- Discovery/tool evidence: `results/runs/<run-id>/T03-debug.txt`.
- Timing CSV: `results/runs/<run-id>/trials.csv`.
- Any approval/sandbox evidence: `results/runs/<run-id>/T03-approval.txt`.

## Manual steps

1. Create a new chat/session with no custom agent.
2. Verify that the skill was discovered but do not invoke it with `/`.
3. Confirm no earlier prompt in the session contains the marker strings.
4. Submit the exact prompt and preserve all model/tool events.
5. If it fails, retry once in a fresh session with the same environment; do not
   change the prompt or configuration between the two trials.
6. Classify selection, discovery, resource, script, or model behavior separately.

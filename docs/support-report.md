# Public-safe support report template

Copy this document only after replacing every placeholder with sanitized
evidence. Delete sections that do not apply rather than inserting secrets or
customer-confidential text.

## Summary

- **Scenario IDs:** `<Txx, ...>`
- **Observed behavior:** `<brief factual statement>`
- **Expected behavior:** `<exact marker/output or documented discovery state>`
- **Manual reproduction completed:** `<yes/no; name the operator role, not a person>`
- **Current classification:** `<product defect | configuration/policy | model/tool selection | trust/sandbox | timing/environment | undetermined>`
- **Confidence:** `<low/medium/high plus reason>`

## Environment

- **VS Code version/build:** `<fill>`
- **Copilot extension/app version:** `<fill>`
- **Harness:** `<Copilot | Local | other>`
- **Model:** `<exact model identifier>`
- **Custom agent:** `<none | exact agent name>`
- **OS/architecture:** `<fill>`
- **Execution host:** `<local | remote | container>`
- **Workspace Trust:** `<trusted | restricted | not recorded>`
- **Workspace root:** `<sanitized path>`
- **Git branch/commit/dirty state:** `<fill>`
- **Node.js version:** `<fill>`
- **Plugin install source/state:** `<none | local folder | cache status>`

## Reproduction

1. Start from `<new chat/new VS Code process/trusted workspace>` as recorded.
2. Follow `<scenario file>`.
3. Submit the exact prompt: `<sanitized prompt or attached local reference>`.
4. Capture the result at `<timestamp and timing scope>`.
5. Record tool-call count and exact marker lines.

## Expected versus actual

| Check | Expected | Actual | Evidence |
|---|---|---|---|
| Discovery | `<fill>` | `<fill>` | `<sanitized log path>` |
| Skill/custom agent inclusion | `<fill>` | `<fill>` | `<sanitized log path>` |
| Tool call and response | `<fill>` | `<fill>` | `<sanitized log path>` |
| Timing | `<scope and metric>` | `<fill>` | `<trial CSV path>` |

## Trial data

- **Trials completed:** `<count>`
- **Cold/warm definition:** `<fill>`
- **Median/p95 or min/mean/p95/max:** `<fill>`
- **Tool-call count per trial:** `<fill>`
- **Excluded trials and reason:** `<none or factual reason>`

Do not treat `scripts/measure-mcp-latency.mjs` output as VS Code harness
latency. It is local Node stdio process/protocol timing only.

## Sanitization checklist

- [ ] Removed tokens, cookies, authorization headers, secrets, and environment
      values not required for the report.
- [ ] Replaced customer names, repository contents, personal names, and machine
      paths with neutral labels.
- [ ] Confirmed screenshots do not reveal unrelated tabs, notifications, source,
      or organization data.
- [ ] Reviewed every debug/log export as untrusted text before sharing.
- [ ] Preserved marker strings and protocol facts unchanged.

## Classification rationale

State whether the evidence distinguishes:

- discovery/configuration failure;
- skill/agent inclusion or selection failure;
- tool discovery/start/execution failure;
- Workspace Trust, policy, sandbox, remote-path, or plugin-cache behavior;
- model-quality or prompt-selection variation;
- a reproducible product behavior difference.

If the evidence cannot distinguish these, classify the result as
**undetermined** rather than a product defect.

## Attachments

- Sanitized scenario export: `<path>`
- Sanitized Agent Debug/Chat Debug log excerpt: `<path>`
- Sanitized timing CSV: `<path>`
- Screenshots: `<none or paths>`

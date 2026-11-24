# copilot-harness-regression

Minimal regression reproduction for Copilot harness skills, custom agents, plugins, MCP, and performance.

This repository is a public-safe comparison environment. It does not presume
that a difference between the legacy Local harness and the Copilot harness is a
product defect.

## What is included

| Surface | Repository path | Fixed evidence |
|---|---|---|
| Custom agent | `.github/agents/harness-repro-agent.agent.md` | Two body-only agent markers |
| Repository skill | `.github/skills/harness-repro-skill/` | Body, linked reference, and script markers |
| Copilot-harness MCP | `.mcp.json` | `emit_repro_marker` with `origin: "workspace"` |
| Legacy Local MCP | `.vscode/mcp.json` | `emit_repro_marker` with `origin: "local"` |
| Agent Plugins 1.0 | `plugins/copilot-harness-repro/` | Packaged skill and self-contained MCP server |
| Manual scenarios | `scenarios/T01-*` through `scenarios/T10-*` | Discovery, invocation, latency, and log evidence |
| Results capture | `results/` | JSON run data plus CSV trial data |

The Agent Plugins 1.0 plugin is deliberately a child folder, not an entry under
`.github/extensions/`. A local folder plugin must be installed or registered by
the tester; its mere presence in the repository is not a discovery test.

## Local validation

Node.js 18 or later is required. No package installation is required and there
are no runtime or development dependencies.

```text
node scripts/validate-config.mjs
node --test tests/repro-mcp.test.mjs
node scripts/invoke-mcp.mjs direct-trial
node scripts/measure-mcp-latency.mjs 20
```

The combined check is:

```text
npm run check
```

`npm run check` does not install anything and only uses the Node.js standard
library and repository files. The direct invocation utility exercises the MCP
stdio protocol independently of VS Code. The timing utility measures local
process/protocol timing only; it does **not** measure Copilot, model, UI, or
harness startup and response time.

## Manual Copilot comparison

1. Open this worktree as a trusted VS Code workspace and start with a new chat.
2. Record the environment in a copy of [`results/run-template.json`](results/run-template.json).
3. Run [`scenarios/T01-customization-discovery.md`](scenarios/T01-customization-discovery.md)
   through [`scenarios/T10-startup-response-latency.md`](scenarios/T10-startup-response-latency.md).
4. For the plugin scenarios, install
   `plugins/copilot-harness-repro` with **Chat: Install Plugin from Source** or
   the Agent Customizations Plugins UI. Reinstall after changing plugin files.
5. Preserve only sanitized logs and use [`docs/support-report.md`](docs/support-report.md)
   if reporting a result.

The Local harness is unavailable in some environments and is being deprecated.
Do not alter global or user VS Code/Copilot settings to force it on. If it is not
already available, mark T07 and the Local side of T10 as blocked by
configuration/policy rather than failed.

## Interpretation

A response that looks correct does not prove discovery or execution. A
discovery miss does not prove the customization was not loaded if it has a
failure, stale-session, trust, model-selection, or log-capture explanation.
Record discovery events, tool activity, References where available, exact
markers, and relevant sanitized logs before classifying a result.

Official source URLs, the 2026-11-24 validation date, documented paths, and
known specification limitations are recorded in
[`docs/environment.md`](docs/environment.md). No VS Code UI harness comparison
was performed while building this repository.

# Repository guidance

This repository is a public-safe, dependency-free Copilot harness reproduction.
Keep the deterministic marker contract stable unless every scenario, template,
validator, and packaged copy changes with it.

## Commands

- Validate configuration: `node scripts/validate-config.mjs`
- Run protocol tests: `node --test tests/repro-mcp.test.mjs`
- Run both checks: `npm run check`
- Invoke MCP directly: `node scripts/invoke-mcp.mjs <trial>`
- Measure local protocol timing: `node scripts/measure-mcp-latency.mjs 20`

## Required conventions

- Use only Node.js built-ins and the standard JSON/stdio protocols.
- Keep stdout protocol-clean for MCP servers; diagnostics go to stderr.
- Keep execution markers out of skill descriptions and plugin manifests.
- Do not edit global/user VS Code or Copilot configuration.
- Do not commit credentials, tokens, customer data, or unsanitized chat/debug logs.
- Treat UI discovery, customization inclusion, model selection, and execution as
  separate observations.
- Record manual harness results in sanitized copies of `results/run-template.json`.

## Maintenance matrix

| Change | Also update |
|---|---|
| `scripts/repro-mcp-server.mjs` | packaged server copy, protocol tests, scenarios T05-T07/T09-T10 |
| Agent/skill markers | validators, marker resources/scripts, scenario expectations, run template |
| `.mcp.json` or `.vscode/mcp.json` | environment docs, affected scenarios, config validator |
| Plugin manifest or layout | docs, plugin scenarios, config validator, local protocol parity test |
| Result fields | run template, CSV template, `results/README.md`, support report |
| Official spec assumptions | `docs/environment.md` and affected config/scenario files |

## Done means

- `npm run check` exits successfully.
- Direct MCP invocation returns the expected marker JSON.
- Configuration validation covers every T01-T10 scenario and result template field.
- Plugin packaging remains self-contained and its server is byte-identical to the
  repository server.
- Manual-only behavior is marked manual; no UI or model result is claimed.
- Committed artifacts contain no credentials or customer-confidential content.

## Never merges without a human

The listed conditions require explicit human review even when automated checks pass.

These conditions require explicit human review rather than agent-only completion:

- changes to `.mcp.json`, `.vscode/mcp.json`, or plugin transport/server behavior;
- marker or specification changes intended to support a product defect report;
- any actual UI/model run or log that is proposed for committing to the repository;
- dependency additions, including runtime or development dependencies.

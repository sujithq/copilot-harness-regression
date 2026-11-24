# Environment and specification baseline

## Validation date

The official documentation and paths below were verified on **2026-11-24**.
VS Code pages inspected for this repository reported `ms.date` 11/18/2026. The
GitHub pages did not expose a per-page date. Recheck the links before relying on
this reproduction after a material client release.

## Official source record

| Topic | Official sources |
|---|---|
| Custom agents | [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents), [VS Code custom-agent file reference](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference), [GitHub custom-agent reference](https://docs.github.com/en/copilot/reference/custom-agents-configuration) |
| Skills | [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills), [GitHub skill concept](https://docs.github.com/en/copilot/concepts/customizations/agent-skills), [GitHub Copilot CLI skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) |
| Workspace MCP | [VS Code MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration), [VS Code MCP verification](https://code.visualstudio.com/docs/agent-customization/mcp-servers), [GitHub Copilot CLI MCP setup](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) |
| MCP management and trust | [VS Code MCP server management](https://code.visualstudio.com/docs/agents/run/manage-mcp-servers), [GitHub MCP server configuration](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers) |
| Agent Plugins 1.0 | [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins), [VS Code plugin reference](https://code.visualstudio.com/docs/agents/reference/agent-plugin-reference), [GitHub plugin creation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating), [GitHub plugin reference](https://docs.github.com/en/copilot/reference/plugin-and-marketplace-reference) |
| Harnesses, migration, and logs | [VS Code agent harnesses](https://code.visualstudio.com/docs/agents/run/agent-harnesses), [VS Code customization migration](https://code.visualstudio.com/docs/agent-customization/migrate-customizations), [VS Code chat debug view](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view), [VS Code troubleshooting](https://code.visualstudio.com/docs/agents/agent-troubleshooting/troubleshooting) |

Only official GitHub and VS Code documentation was used to choose paths and
formats. The plugin schema URLs are recorded because the official creation
guidance requires the 1.0.0 `$schema` values; this repository does not rely on
third-party schema fetches or packages.

## Chosen portable layout

| Feature | Location | Consumer distinction |
|---|---|---|
| Custom agent | `.github/agents/harness-repro-agent.agent.md` | Repository custom-agent format; `tools: []` makes the no-tool boundary explicit |
| Repository skill | `.github/skills/harness-repro-skill/SKILL.md` | Portable project skill path documented for Copilot, Local, CLI, and cloud agent |
| Copilot-harness workspace MCP | `.mcp.json` with `mcpServers` | Copilot harness and Copilot CLI |
| Legacy Local MCP | `.vscode/mcp.json` with `servers` | Local/legacy VS Code format |
| Agent Plugins 1.0 | `plugins/copilot-harness-repro/` | Root `plugin.json`; fixed `skills/` and root `mcp.json` locations |

The hypothesized `.github/extensions/<name>/plugin.json` layout is **not** the
documented Agent Plugins 1.0 layout. `.github/extensions/<name>/` is a separate
experimental Copilot CLI extension location requiring an `extension.mjs`,
`extension.cjs`, or `extension.js` entry file. The repository therefore uses a
self-contained local plugin folder and requires explicit installation or local
registration.

## Runtime prerequisites

- Node.js 18 or later on `PATH`.
- A trusted workspace when testing workspace MCP configurations.
- VS Code and a GitHub Copilot extension/app version that support the tested
  customization surface.
- For Local-only scenarios, a build/policy where the Local harness is already
  available. This repository does not change global or user configuration.
- Access to Agent Debug Logs, Chat Debug View, or `/troubleshoot` when available.
  Enabling logging is left to the tester's existing approved environment.

## Required environment capture

Record all of the following for every manual run:

- VS Code version/build and Copilot extension or app version.
- Selected harness, exact model name, and selected custom agent.
- Operating system/version, architecture, local/remote/container location, and
  whether the workspace is trusted.
- Workspace root, Git branch, commit, dirty-state status, and Node.js version.
- MCP config paths actually discovered and any server start errors.
- Plugin install source/version and whether it was installed from cache.
- Start/end timestamps, cold/warm state, prompt, response duration, and tool-call
  count for each trial.
- Available debug settings and which logs were exported. Never infer a failure
  from a missing log.

Use `results/run-template.json` and `results/trial-template.csv` so the same
facts can be compared without exposing raw chat or source content.

## Known specification and environment limitations

- The Local harness is deprecated and availability can be controlled by
  organization policy. Absence is a configuration limitation unless contrary
  evidence is captured.
- Current official VS Code text does not document a Windows-specific MCP stdio
  launch command. This repository intentionally uses `node` plus a repository
  script and tests that combination directly.
- The default working directory for a root `.mcp.json` stdio server is not
  stated consistently across all official pages. This reproduction sets
  `cwd: "."` and requires the discovery scenario to record the actual host.
- `${PLUGIN_ROOT}` expansion is documented for plugin MCP configuration, but
  the VS Code text is inconsistent about whether expansion or environment
  propagation is performed by the editor or plugin runtime.
- A plugin folder inside a workspace is not documented as auto-discovered.
  T08 requires local installation or registration.
- No official page defines a single conclusive “skill executed” event. Use a
  combination of discovery logs, References/tool activity, and the body,
  linked-reference, and script markers.
- Official GitHub and VS Code pages leave some Local/Copilot precedence and
  cross-harness details ambiguous. Tests use distinct MCP server names to avoid
  adding a duplicate-name ambiguity.
- The local timing utility measures local Node stdio protocol latency only.
  It is not a substitute for T10's UI/model/harness timing.

## Public-safety boundary

Raw prompts, debug exports, Chat Debug View captures, and MCP logs can contain
source code, names, paths, tokens, or customer data. Keep raw artifacts outside
the repository by default, review every field, and attach only sanitized evidence
to a public support report.

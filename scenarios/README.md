# Manual scenarios

Run T01 through T10 in a trusted workspace and a new chat/session after the
workspace is opened. Record product versions before the first prompt and do not
change global or user VS Code/Copilot configuration for this repository.

| ID | Focus |
|---|---|
| [T01](T01-customization-discovery.md) | Repository skill/custom-agent discovery |
| [T02](T02-repository-skill-explicit.md) | Explicit repository skill invocation |
| [T03](T03-repository-skill-automatic.md) | Automatic/model-selected repository skill invocation |
| [T04](T04-custom-agent-loading.md) | Repository custom-agent body loading |
| [T05](T05-copilot-mcp-discovery.md) | Copilot-harness workspace MCP discovery |
| [T06](T06-copilot-mcp-execution.md) | Copilot-harness workspace MCP execution |
| [T07](T07-local-mcp-discovery-execution.md) | Legacy Local MCP discovery and execution |
| [T08](T08-plugin-loading.md) | Agent Plugins 1.0 local installation and discovery |
| [T09](T09-plugin-skill-mcp-behavior.md) | Packaged skill and plugin MCP behavior |
| [T10](T10-startup-response-latency.md) | Harness startup/response latency |

## Common evidence rules

- Capture VS Code/Copilot version, harness, model, OS, host, trust state,
  branch/commit, Node.js version, configuration paths, and available debug
  facilities before testing.
- Treat **discovery**, **inclusion/invocation**, and **effective execution** as
  separate facts. A correct-looking answer is not a discovery record.
- Preserve available Agent Debug Logs, Chat Debug View excerpts, MCP server
  output, References, and tool activity. If logging was unavailable, say so.
- A missing marker or failed answer is not proof that a skill was not loaded.
  Check discovery/rejection events, trust, policy, tool availability, and the
  session age; classify the result rather than presuming a defect.
- Use a new session where a scenario says so, and reinstall a local plugin after
  changing its files.
- Use one copied `results/run-template.json` per environment and
  `results/trial-template.csv` for repeated trials.
- Keep raw evidence outside Git by default. Only sanitized copies may be shared.

## Fixed marker inventory

| Component | Markers |
|---|---|
| Repository custom agent | `HARNESS_REPRO_AGENT_BODY_LOADED:v1`, `HARNESS_REPRO_AGENT_INSTRUCTIONS_ACTIVE:v1` |
| Repository skill | `HARNESS_REPRO_REPOSITORY_SKILL_BODY_LOADED:v1`, `HARNESS_REPRO_REPOSITORY_SKILL_REFERENCE_LOADED:v1`, `HARNESS_REPRO_REPOSITORY_SKILL_SCRIPT_EXECUTED:v1` |
| Packaged skill | `HARNESS_REPRO_PLUGIN_SKILL_BODY_LOADED:v1`, `HARNESS_REPRO_PLUGIN_SKILL_REFERENCE_LOADED:v1`, `HARNESS_REPRO_PLUGIN_SKILL_SCRIPT_EXECUTED:v1` |
| MCP tool | `HARNESS_REPRO_MCP_TOOL_EXECUTED:v1` |
| MCP process stderr | `HARNESS_REPRO_MCP_SERVER_STARTED:v1` |

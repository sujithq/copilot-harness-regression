# T08 - Agent Plugins 1.0 local loading

Verify explicit local installation/registration and discovery of the packaged
Agent Plugins 1.0 skill and MCP server.

## Prompt or procedure

This is an installation/discovery procedure, not a model prompt.

1. In VS Code, open **Chat: Install Plugin from Source** or the Agent
   Customizations editor's Plugins `+` action.
2. Choose the repository's `plugins/copilot-harness-repro` folder.
3. Record the install source, cache/install state, and installed version.
4. Start a new chat/session and open the customizations/skill/MCP views.
5. Confirm `copilot-harness-repro` and its packaged skill/server are listed
   without manifest/schema/component-path errors.
6. If plugin files later change, reinstall; an existing local install can be
   cached.

## Expected marker or output

No skill/tool execution marker is required in T08.

Expected:

- Plugin name: `copilot-harness-repro`.
- Skill: `harness-repro-plugin-skill`.
- MCP server: `harness-repro-plugin-mcp`.
- MCP tool: `emit_repro_marker`.
- Server startup stderr marker may appear when started:
  `HARNESS_REPRO_MCP_SERVER_STARTED:v1`.
- No `.github/extensions` path is used or expected.

## Environment evidence

- VS Code/Copilot version, plugin feature availability, harness, OS/host,
  trust, branch, commit, and plugin source path.
- Install method, resulting cache/state, manifest version, and reinstall status.
- Customizations view showing plugin, skill, and server components.
- Install/start diagnostics, schema errors, skipped servers, and plugin list.
- Whether workspace/root `.mcp.json` server and plugin server both appear under
  distinct names.

## Actual result

- **Status:** `<not-run/pass/fail/undetermined>`
- **Plugin installed:** `<yes/no plus method>`
- **Plugin listed:** `<yes/no>`
- **Skill/server/tool listed:** `<each yes/no>`
- **Manifest/install diagnostics:** `<none or sanitized>`
- **Cache freshness:** `<new/reinstalled/stale-possible/unknown>`

## Pass/fail criteria

**Pass:** the explicit local install succeeds and the skill plus MCP server/tool
are discoverable after a new session, with no invalid 1.0 layout diagnostic.

**Configuration/not run:** the current client does not expose local plugin
installation or policy disables it. Record that limitation.

**Fail:** a supported client rejects the manifest/fixed component layout or
cannot discover the installed components after reinstall/new-session checks.

## Evidence and log locations

- Plugin list/install state: `results/runs/<run-id>/T08-plugin-list.txt`.
- Install/manifest diagnostics: `results/runs/<run-id>/T08-diagnostics.txt`.
- Discovery screenshots: `results/runs/<run-id>/T08-*`.
- Plugin source identity: `results/runs/<run-id>/T08-source.txt`.

## Manual steps

1. Record the plugin folder's exact sanitized source and commit.
2. Install or register the local folder; never treat folder presence as loading.
3. Start a new chat and list plugin-provided components.
4. Keep workspace MCP and plugin MCP names distinct when reviewing tools.
5. If the plugin was installed earlier, reinstall from the current folder and
   record that cache-clearing action.

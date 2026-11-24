import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  initializeMcpSession,
  withMcpSession,
} from "../scripts/lib/mcp-stdio-client.mjs";

const testsDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = dirname(testsDirectory);
const repositoryServer = join(workspaceRoot, "scripts", "repro-mcp-server.mjs");
const pluginServer = join(
  workspaceRoot,
  "plugins",
  "copilot-harness-repro",
  "server",
  "repro-mcp-server.mjs",
);
const directInvoker = join(workspaceRoot, "scripts", "invoke-mcp.mjs");
const protocolVersion = "2025-06-18";

async function callMarkerTool(serverPath, origin, trial) {
  return withMcpSession(
    {
      serverPath,
      origin,
      cwd: workspaceRoot,
    },
    async (session) => {
      const initialize = await initializeMcpSession(session);
      const tools = await session.request("tools/list", {});
      const call = await session.request("tools/call", {
        name: "emit_repro_marker",
        arguments: {
          trial,
        },
      });
      return {
        initialize,
        tools,
        call,
        stderr: session.getStderr().trim(),
      };
    },
  );
}

test("MCP server negotiates initialization and reports deterministic capabilities", async () => {
  await withMcpSession(
    {
      serverPath: repositoryServer,
      origin: "protocol-test",
      cwd: workspaceRoot,
    },
    async (session) => {
      const response = await initializeMcpSession(session);
      assert.equal(response.result.protocolVersion, protocolVersion);
      assert.deepEqual(response.result.capabilities, {
        tools: {
          listChanged: false,
        },
      });
      assert.equal(
        response.result.serverInfo.name,
        "copilot-harness-repro-mcp",
      );
      assert.equal(
        session.getStderr().trim(),
        "HARNESS_REPRO_MCP_SERVER_STARTED:v1",
      );
    },
  );
});

test("MCP tools/list returns the deterministic read-only tool", async () => {
  const result = await callMarkerTool(
    repositoryServer,
    "protocol-test",
    "tools-list",
  );
  assert.equal(result.tools.result.tools.length, 1);
  assert.equal(result.tools.result.tools[0].name, "emit_repro_marker");
  assert.deepEqual(result.tools.result.tools[0].annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  });
});

test("MCP tools/call emits the fixed marker and supplied trial", async () => {
  const result = await callMarkerTool(
    repositoryServer,
    "protocol-test",
    "protocol-call",
  );
  assert.equal(result.call.result.isError, false);
  assert.deepEqual(JSON.parse(result.call.result.content[0].text), {
    marker: "HARNESS_REPRO_MCP_TOOL_EXECUTED:v1",
    origin: "protocol-test",
    trial: "protocol-call",
  });
});

test("MCP server rejects unknown methods with a JSON-RPC error", async () => {
  await withMcpSession(
    {
      serverPath: repositoryServer,
      origin: "protocol-test",
      cwd: workspaceRoot,
    },
    async (session) => {
      await initializeMcpSession(session);
      const response = await session.request("not/a-real-method", {});
      assert.equal(response.error.code, -32601);
      assert.match(response.error.message, /Method not found/);
    },
  );
});

test("MCP server rejects unsupported tool arguments", async () => {
  await withMcpSession(
    {
      serverPath: repositoryServer,
      origin: "protocol-test",
      cwd: workspaceRoot,
    },
    async (session) => {
      await initializeMcpSession(session);
      const response = await session.request("tools/call", {
        name: "emit_repro_marker",
        arguments: {
          unexpected: true,
        },
      });
      assert.equal(response.error.code, -32602);
      assert.match(response.error.message, /unexpected/);
    },
  );
});

test("MCP server returns a JSON-RPC parse error for malformed input", () => {
  const invocation = spawnSync(process.execPath, [repositoryServer], {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      REPRO_MCP_ORIGIN: "protocol-test",
    },
    input: "{not-json}\n",
    encoding: "utf8",
  });
  assert.equal(invocation.status, 0, invocation.stderr);
  assert.equal(
    invocation.stderr.trim(),
    "HARNESS_REPRO_MCP_SERVER_STARTED:v1",
  );
  assert.deepEqual(JSON.parse(invocation.stdout), {
    jsonrpc: "2.0",
    id: null,
    error: {
      code: -32700,
      message: "Parse error",
    },
  });
});

test("repository and plugin skill scripts emit deterministic markers", () => {
  const scripts = [
    {
      path: join(
        workspaceRoot,
        ".github",
        "skills",
        "harness-repro-skill",
        "scripts",
        "emit-marker.mjs",
      ),
      marker: "HARNESS_REPRO_REPOSITORY_SKILL_SCRIPT_EXECUTED:v1",
    },
    {
      path: join(
        workspaceRoot,
        "plugins",
        "copilot-harness-repro",
        "skills",
        "harness-repro-plugin-skill",
        "scripts",
        "emit-marker.mjs",
      ),
      marker: "HARNESS_REPRO_PLUGIN_SKILL_SCRIPT_EXECUTED:v1",
    },
  ];

  for (const script of scripts) {
    const invocation = spawnSync(process.execPath, [script.path], {
      cwd: workspaceRoot,
      encoding: "utf8",
    });
    assert.equal(invocation.status, 0, invocation.stderr);
    assert.equal(invocation.stdout.trim(), script.marker);
  }
});

test("Agent Plugins 1.0 copy preserves MCP protocol behavior", async () => {
  const result = await callMarkerTool(pluginServer, "plugin", "plugin-copy");
  assert.deepEqual(JSON.parse(result.call.result.content[0].text), {
    marker: "HARNESS_REPRO_MCP_TOOL_EXECUTED:v1",
    origin: "plugin",
    trial: "plugin-copy",
  });
});

test("direct invocation utility returns copy-safe JSON", () => {
  const invocation = spawnSync(
    process.execPath,
    [directInvoker, "direct-test"],
    {
      cwd: workspaceRoot,
      encoding: "utf8",
    },
  );
  assert.equal(invocation.status, 0, invocation.stderr);
  const result = JSON.parse(invocation.stdout);
  assert.equal(result.ok, true);
  assert.deepEqual(result.toolOutput, {
    marker: "HARNESS_REPRO_MCP_TOOL_EXECUTED:v1",
    origin: "direct",
    trial: "direct-test",
  });
  assert.deepEqual(result.toolsListed, ["emit_repro_marker"]);
});

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  initializeMcpSession,
  withMcpSession,
} from "./lib/mcp-stdio-client.mjs";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = dirname(scriptsDirectory);
const serverPath = join(scriptsDirectory, "repro-mcp-server.mjs");
const trial = process.argv[2] ?? "direct-invocation";

const result = await withMcpSession(
  {
    serverPath,
    origin: "direct",
    cwd: workspaceRoot,
  },
  async (session) => {
    const initialize = await initializeMcpSession(session);
    const tools = await session.request("tools/list", {});
    const toolCall = await session.request("tools/call", {
      name: "emit_repro_marker",
      arguments: {
        trial,
      },
    });
    return {
      initialize,
      tools,
      toolCall,
      stderr: session.getStderr().trim(),
    };
  },
);

const text = result.toolCall.result?.content?.[0]?.text;
if (result.initialize.error || result.tools.error || result.toolCall.error || !text) {
  throw new Error(`Unexpected MCP protocol result: ${JSON.stringify(result)}`);
}

process.stdout.write(
  `${JSON.stringify(
    {
      ok: true,
      toolName: "emit_repro_marker",
      toolOutput: JSON.parse(text),
      serverInfo: result.initialize.result.serverInfo,
      toolsListed: result.tools.result.tools.map((tool) => tool.name),
      stderr: result.stderr,
    },
    null,
    2,
  )}\n`,
);

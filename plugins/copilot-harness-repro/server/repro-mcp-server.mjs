import { createInterface } from "node:readline";

const SERVER_NAME = "copilot-harness-repro-mcp";
const SERVER_VERSION = "1.0.0";
const TOOL_NAME = "emit_repro_marker";
const TOOL_MARKER = "HARNESS_REPRO_MCP_TOOL_EXECUTED:v1";
const SERVER_MARKER = "HARNESS_REPRO_MCP_SERVER_STARTED:v1";
const ALLOWED_ORIGINS = new Set([
  "direct",
  "workspace",
  "local",
  "plugin",
  "protocol-test",
  "benchmark",
]);

const origin = process.env.REPRO_MCP_ORIGIN ?? "direct";
if (!ALLOWED_ORIGINS.has(origin)) {
  process.stderr.write(`REPRO_MCP_CONFIG_ERROR: unsupported origin ${origin}\n`);
  process.exit(2);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function sendResult(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function toolDefinition() {
  return {
    name: TOOL_NAME,
    description:
      "Return fixed public-safe markers for a Copilot harness MCP regression test.",
    inputSchema: {
      type: "object",
      properties: {
        trial: {
          type: "string",
          description: "Optional trial label copied into the deterministic result.",
          maxLength: 80,
        },
      },
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  };
}

function callTool(id, params) {
  if (!isObject(params) || typeof params.name !== "string") {
    sendError(id, -32602, "tools/call requires a tool name");
    return;
  }

  if (params.name !== TOOL_NAME) {
    sendError(id, -32602, `Unknown tool: ${params.name}`);
    return;
  }

  const argumentsValue = params.arguments ?? {};
  if (!isObject(argumentsValue)) {
    sendError(id, -32602, "tools/call arguments must be an object");
    return;
  }

  const unknownKeys = Object.keys(argumentsValue).filter((key) => key !== "trial");
  if (unknownKeys.length > 0) {
    sendError(
      id,
      -32602,
      `Unsupported tool argument: ${unknownKeys.join(", ")}`,
    );
    return;
  }

  const trial = argumentsValue.trial ?? "default";
  if (typeof trial !== "string" || trial.length > 80) {
    sendError(id, -32602, "trial must be a string of at most 80 characters");
    return;
  }

  sendResult(id, {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          marker: TOOL_MARKER,
          origin,
          trial,
        }),
      },
    ],
    isError: false,
  });
}

function handleMessage(message) {
  if (!isObject(message) || message.jsonrpc !== "2.0") {
    sendError(isObject(message) && "id" in message ? message.id : null, -32600, "Invalid request");
    return;
  }

  if (typeof message.method !== "string") {
    sendError("id" in message ? message.id : null, -32600, "Invalid request");
    return;
  }

  const hasId = Object.hasOwn(message, "id");
  const id = hasId ? message.id : null;

  switch (message.method) {
    case "initialize": {
      if (!hasId) {
        return;
      }
      if (!isObject(message.params) || typeof message.params.protocolVersion !== "string") {
        sendError(id, -32602, "initialize requires protocolVersion");
        return;
      }
      sendResult(id, {
        protocolVersion: message.params.protocolVersion,
        capabilities: {
          tools: {
            listChanged: false,
          },
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
        instructions: `Call ${TOOL_NAME} to emit the fixed reproduction marker.`,
      });
      return;
    }
    case "notifications/initialized":
      return;
    case "ping":
      if (hasId) {
        sendResult(id, {});
      }
      return;
    case "tools/list":
      if (hasId) {
        sendResult(id, { tools: [toolDefinition()] });
      }
      return;
    case "tools/call":
      if (hasId) {
        callTool(id, message.params);
      }
      return;
    default:
      if (hasId) {
        sendError(id, -32601, `Method not found: ${message.method}`);
      }
  }
}

const input = createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
  terminal: false,
});

process.stderr.write(`${SERVER_MARKER}\n`);

input.on("line", (line) => {
  if (line.trim().length === 0) {
    return;
  }

  let message;
  try {
    message = JSON.parse(line);
  } catch {
    sendError(null, -32700, "Parse error");
    return;
  }

  handleMessage(message);
});

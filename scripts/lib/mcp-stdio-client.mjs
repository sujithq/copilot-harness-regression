import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const DEFAULT_TIMEOUT_MS = 5_000;

export async function openMcpSession({
  serverPath,
  origin = "direct",
  timeoutMs = DEFAULT_TIMEOUT_MS,
  cwd,
}) {
  const child = spawn(process.execPath, [serverPath], {
    cwd,
    env: {
      ...process.env,
      REPRO_MCP_ORIGIN: origin,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  const pending = new Map();
  let nextId = 1;
  let stderr = "";
  let fatalError;

  const failPending = (error) => {
    fatalError = error;
    for (const request of pending.values()) {
      clearTimeout(request.timer);
      request.reject(error);
    }
    pending.clear();
  };

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const output = createInterface({
    input: child.stdout,
    crlfDelay: Infinity,
    terminal: false,
  });

  output.on("line", (line) => {
    let message;
    try {
      message = JSON.parse(line);
    } catch (error) {
      failPending(new Error(`MCP server wrote invalid JSON: ${line}`, { cause: error }));
      return;
    }

    if (!Object.hasOwn(message, "id")) {
      return;
    }

    const request = pending.get(message.id);
    if (!request) {
      failPending(new Error(`MCP server returned unknown request id ${String(message.id)}`));
      return;
    }

    clearTimeout(request.timer);
    pending.delete(message.id);
    request.resolve(message);
  });

  const exit = new Promise((resolve) => {
    child.once("exit", (code, signal) => {
      const explanation = signal ? `signal ${signal}` : `exit code ${String(code)}`;
      if (pending.size > 0) {
        failPending(
          new Error(
            `MCP server stopped before replying (${explanation}); stderr=${stderr.trim()}`,
          ),
        );
      }
      resolve({ code, signal });
    });
  });

  child.once("error", (error) => {
    failPending(new Error(`Could not start MCP server: ${error.message}`, { cause: error }));
  });

  function send(message) {
    if (fatalError) {
      throw fatalError;
    }
    child.stdin.write(`${JSON.stringify(message)}\n`);
  }

  function notify(method, params) {
    send({ jsonrpc: "2.0", method, params });
  }

  function request(method, params) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`MCP request timed out after ${timeoutMs}ms: ${method}`));
      }, timeoutMs);
      pending.set(id, { resolve, reject, timer });
      send({ jsonrpc: "2.0", id, method, params });
    });
  }

  async function close() {
    child.stdin.end();
    let timeout;
    const deadline = new Promise((resolve) => {
      timeout = setTimeout(() => {
        child.kill();
        resolve({ timedOut: true });
      }, timeoutMs);
    });

    try {
      await Promise.race([exit, deadline]);
    } finally {
      clearTimeout(timeout);
      output.close();
    }
  }

  return {
    notify,
    request,
    close,
    getStderr: () => stderr,
  };
}

export async function withMcpSession(options, callback) {
  const session = await openMcpSession(options);
  try {
    return await callback(session);
  } finally {
    await session.close();
  }
}

export async function initializeMcpSession(session) {
  const initialize = await session.request("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: {
      name: "copilot-harness-regression-local-client",
      version: "1.0.0",
    },
  });
  session.notify("notifications/initialized", {});
  return initialize;
}

import { performance } from "node:perf_hooks";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  initializeMcpSession,
  openMcpSession,
} from "./lib/mcp-stdio-client.mjs";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = dirname(scriptsDirectory);
const serverPath = join(scriptsDirectory, "repro-mcp-server.mjs");
const trialCount = Number.parseInt(process.argv[2] ?? "20", 10);

if (!Number.isInteger(trialCount) || trialCount < 1 || trialCount > 1_000) {
  throw new Error("Trial count must be an integer from 1 through 1000");
}

function summarize(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const sum = sorted.reduce((total, value) => total + value, 0);
  return {
    minMs: Number(sorted[0].toFixed(3)),
    meanMs: Number((sum / sorted.length).toFixed(3)),
    p95Ms: Number(sorted[Math.ceil(sorted.length * 0.95) - 1].toFixed(3)),
    maxMs: Number(sorted.at(-1).toFixed(3)),
  };
}

const trials = [];

for (let index = 1; index <= trialCount; index += 1) {
  const processStarted = performance.now();
  const session = await openMcpSession({
    serverPath,
    origin: "benchmark",
    cwd: workspaceRoot,
  });

  try {
    const initializeResponse = await initializeMcpSession(session);
    const initializedAt = performance.now();
    const toolCallStarted = performance.now();
    const toolCall = await session.request("tools/call", {
      name: "emit_repro_marker",
      arguments: {
        trial: String(index),
      },
    });
    const toolCallFinished = performance.now();

    if (initializeResponse.error || toolCall.error) {
      throw new Error(
        `MCP trial ${index} failed: ${JSON.stringify({ initializeResponse, toolCall })}`,
      );
    }

    await session.close();
    const processFinished = performance.now();
    trials.push({
      trial: index,
      processToInitializedMs: Number((initializedAt - processStarted).toFixed(3)),
      toolCallMs: Number((toolCallFinished - toolCallStarted).toFixed(3)),
      processLifetimeMs: Number((processFinished - processStarted).toFixed(3)),
    });
  } catch (error) {
    await session.close();
    throw error;
  }
}

process.stdout.write(
  `${JSON.stringify(
    {
      metricType: "local-mcp-stdio-protocol",
      note: "These timings do not measure VS Code, Copilot, model, UI, or harness startup/response latency.",
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      trialCount,
      processToInitialized: summarize(
        trials.map((trial) => trial.processToInitializedMs),
      ),
      toolCall: summarize(trials.map((trial) => trial.toolCallMs)),
      processLifetime: summarize(trials.map((trial) => trial.processLifetimeMs)),
      trials,
    },
    null,
    2,
  )}\n`,
);

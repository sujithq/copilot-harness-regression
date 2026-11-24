import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = dirname(scriptsDirectory);
let checkCount = 0;

function check(condition, message) {
  if (!condition) {
    throw new Error(`Configuration validation failed: ${message}`);
  }
  checkCount += 1;
}

async function text(relativePath) {
  return readFile(join(workspaceRoot, relativePath), "utf8");
}

async function json(relativePath) {
  const source = await text(relativePath);
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`Configuration validation failed: ${relativePath} is invalid JSON`, {
      cause: error,
    });
  }
}

function parseFrontmatter(source, relativePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  check(match, `${relativePath} must have YAML frontmatter`);
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator > 0) {
      fields[line.slice(0, separator).trim()] = line
        .slice(separator + 1)
        .trim()
        .replace(/^(['"])(.*)\1$/, "$2");
    }
  }
  return { fields, body: match[2] };
}

const packageManifest = await json("package.json");
check(
  !("dependencies" in packageManifest) && !("devDependencies" in packageManifest),
  "package.json must remain dependency-free",
);

const workspaceMcp = await json(".mcp.json");
const workspaceServer = workspaceMcp.mcpServers?.["harness-repro-workspace-mcp"];
check(workspaceServer?.type === "stdio", ".mcp.json workspace server must use stdio");
check(workspaceServer?.command === "node", ".mcp.json workspace server must use node");
check(
  workspaceServer?.args?.[0] === "scripts/repro-mcp-server.mjs",
  ".mcp.json must point to the repository MCP server",
);
check(
  workspaceServer?.env?.REPRO_MCP_ORIGIN === "workspace",
  ".mcp.json must identify the workspace origin",
);

const localMcp = await json(".vscode/mcp.json");
const localServer = localMcp.servers?.["harness-repro-local-mcp"];
check(localServer?.type === "stdio", ".vscode/mcp.json Local server must use stdio");
check(
  localServer?.args?.[0] ===
    "${workspaceFolder}/scripts/repro-mcp-server.mjs",
  ".vscode/mcp.json must use the workspace-local server path",
);
check(
  localServer?.env?.REPRO_MCP_ORIGIN === "local",
  ".vscode/mcp.json must identify the Local origin",
);
check(
  "harness-repro-local-mcp" !== "harness-repro-workspace-mcp",
  "workspace and Local MCP server names must remain distinct",
);

const agentFiles = (await readdir(join(workspaceRoot, ".github", "agents")))
  .filter((name) => name.endsWith(".agent.md"))
  .sort();
check(
  JSON.stringify(agentFiles) === JSON.stringify(["harness-repro-agent.agent.md"]),
  "repository must contain exactly one custom agent",
);
const agentPath = ".github/agents/harness-repro-agent.agent.md";
const agent = parseFrontmatter(await text(agentPath), agentPath);
check(agent.fields.name === "harness-repro-agent", "custom-agent name must match its filename");
check(
  agent.fields.description?.length > 0,
  "custom agent requires a non-empty description",
);
check(
  agent.body.includes("HARNESS_REPRO_AGENT_BODY_LOADED:v1") &&
    agent.body.includes("HARNESS_REPRO_AGENT_INSTRUCTIONS_ACTIVE:v1"),
  "custom agent must contain its deterministic body markers",
);

const skillDirectories = (await readdir(join(workspaceRoot, ".github", "skills"), {
  withFileTypes: true,
}))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
check(
  JSON.stringify(skillDirectories) === JSON.stringify(["harness-repro-skill"]),
  "repository must contain exactly one repository skill",
);
const skillPath = ".github/skills/harness-repro-skill/SKILL.md";
const skill = parseFrontmatter(await text(skillPath), skillPath);
check(skill.fields.name === "harness-repro-skill", "repository skill name must match its directory");
check(
  !skill.fields.description?.includes("HARNESS_REPRO_"),
  "repository skill description must not contain execution markers",
);
check(
  skill.body.includes("HARNESS_REPRO_REPOSITORY_SKILL_BODY_LOADED:v1"),
  "repository skill body marker is missing",
);
const skillReference = await text(
  ".github/skills/harness-repro-skill/references/marker.txt",
);
check(
  skillReference.trim() === "HARNESS_REPRO_REPOSITORY_SKILL_REFERENCE_LOADED:v1",
  "repository skill reference marker is incorrect",
);
const skillScript = await text(
  ".github/skills/harness-repro-skill/scripts/emit-marker.mjs",
);
check(
  skillScript.includes("HARNESS_REPRO_REPOSITORY_SKILL_SCRIPT_EXECUTED:v1"),
  "repository skill script marker is incorrect",
);

const pluginManifest = await json("plugins/copilot-harness-repro/plugin.json");
check(
  pluginManifest.$schema ===
    "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "plugin manifest must use the Agent Plugins 1.0 schema",
);
check(
  pluginManifest.name === "copilot-harness-repro",
  "plugin manifest name is incorrect",
);
check(
  !["agents", "skills", "mcpServers", "lspServers", "hooks"].some(
    (field) => field in pluginManifest,
  ),
  "Agent Plugins 1.0 manifest must not use legacy component path fields",
);

const pluginMcp = await json("plugins/copilot-harness-repro/mcp.json");
check(
  pluginMcp.$schema ===
    "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "plugin MCP config must use the Agent Plugins 1.0 MCP schema",
);
const pluginServer = pluginMcp.mcpServers?.["harness-repro-plugin-mcp"];
check(
  pluginServer?.args?.[0] ===
    "${PLUGIN_ROOT}/server/repro-mcp-server.mjs",
  "plugin MCP config must reference its self-contained server",
);
check(
  pluginServer?.env?.REPRO_MCP_ORIGIN === "plugin",
  "plugin MCP config must identify the plugin origin",
);

const pluginSkillPath =
  "plugins/copilot-harness-repro/skills/harness-repro-plugin-skill/SKILL.md";
const pluginSkill = parseFrontmatter(await text(pluginSkillPath), pluginSkillPath);
check(
  pluginSkill.fields.name === "harness-repro-plugin-skill",
  "plugin skill name must match its immediate skills directory",
);
check(
  !pluginSkill.fields.description?.includes("HARNESS_REPRO_"),
  "plugin skill description must not contain execution markers",
);
check(
  pluginSkill.body.includes("HARNESS_REPRO_PLUGIN_SKILL_BODY_LOADED:v1"),
  "plugin skill body marker is missing",
);
const pluginSkillReference = await text(
  "plugins/copilot-harness-repro/skills/harness-repro-plugin-skill/references/marker.txt",
);
check(
  pluginSkillReference.trim() ===
    "HARNESS_REPRO_PLUGIN_SKILL_REFERENCE_LOADED:v1",
  "plugin skill reference marker is incorrect",
);
const pluginSkillScript = await text(
  "plugins/copilot-harness-repro/skills/harness-repro-plugin-skill/scripts/emit-marker.mjs",
);
check(
  pluginSkillScript.includes("HARNESS_REPRO_PLUGIN_SKILL_SCRIPT_EXECUTED:v1"),
  "plugin skill script marker is incorrect",
);

const repositoryServer = await text("scripts/repro-mcp-server.mjs");
const packagedServer = await text(
  "plugins/copilot-harness-repro/server/repro-mcp-server.mjs",
);
check(
  repositoryServer === packagedServer,
  "plugin MCP server must remain byte-for-byte equivalent to the repository server",
);

const scenarioNames = (await readdir(join(workspaceRoot, "scenarios")))
  .filter((name) => /^T\d{2}-.*\.md$/.test(name))
  .sort();
const expectedScenarios = Array.from(
  { length: 10 },
  (_, index) => `T${String(index + 1).padStart(2, "0")}`,
);
check(
  scenarioNames.length === 10 &&
    expectedScenarios.every((id) =>
      scenarioNames.some((name) => name.startsWith(`${id}-`)),
    ),
  "scenarios directory must contain T01 through T10",
);

const requiredScenarioHeadings = [
  "## Prompt or procedure",
  "## Expected marker or output",
  "## Environment evidence",
  "## Actual result",
  "## Pass/fail criteria",
  "## Evidence and log locations",
  "## Manual steps",
];
for (const name of scenarioNames) {
  const scenario = await text(`scenarios/${name}`);
  for (const heading of requiredScenarioHeadings) {
    check(
      scenario.includes(heading),
      `scenarios/${name} is missing ${heading}`,
    );
  }
}

const resultsTemplate = await json("results/run-template.json");
check(
  Array.isArray(resultsTemplate.scenarios) &&
    expectedScenarios.every((id) =>
      resultsTemplate.scenarios.some((scenario) => scenario.scenarioId === id),
    ),
  "results template must cover T01 through T10",
);
check(
  resultsTemplate.environment &&
    resultsTemplate.sanitization &&
    resultsTemplate.classification,
  "results template must include environment, sanitization, and classification",
);
const allowedClassifications = new Set([
  "not-run",
  "pass",
  "configuration-or-policy",
  "model-or-tool-selection",
  "trust-or-sandbox",
  "plugin-cache-or-install",
  "timing-or-environment",
  "product-behavior-candidate",
  "undetermined",
]);
check(
  resultsTemplate.scenarios.every((scenario) =>
    allowedClassifications.has(scenario.classification),
  ) && allowedClassifications.has(resultsTemplate.classification.overall),
  "results template classifications must use the documented vocabulary",
);

const trialHeader = (await text("results/trial-template.csv")).split(/\r?\n/, 1)[0];
check(
  trialHeader.includes("scenario_id") &&
    trialHeader.includes("harness") &&
    trialHeader.includes("duration_ms") &&
    trialHeader.includes("tool_call_count"),
  "trial CSV template is missing required timing fields",
);

const environmentDoc = await text("docs/environment.md");
check(
  environmentDoc.includes("2026-11-24") &&
    environmentDoc.includes("https://code.visualstudio.com/") &&
    environmentDoc.includes("https://docs.github.com/"),
  "environment documentation must record validation date and official source domains",
);

await Promise.all([
  text("README.md"),
  text("AGENTS.md"),
  text("results/README.md"),
  text("docs/support-report.md"),
]);

process.stdout.write(
  `CONFIG_VALIDATION_OK: ${checkCount} checks passed\n`,
);

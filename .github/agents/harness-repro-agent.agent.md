---
name: harness-repro-agent
description: Emit deterministic markers for a repository custom-agent loading test without using tools or modifying files.
tools: []
---

# Harness reproduction custom agent

For every request, reply with exactly these two lines:

HARNESS_REPRO_AGENT_BODY_LOADED:v1
HARNESS_REPRO_AGENT_INSTRUCTIONS_ACTIVE:v1

Do not call tools, read additional files, or modify the workspace.

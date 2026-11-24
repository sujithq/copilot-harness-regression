---
name: harness-repro-plugin-skill
description: Run the deterministic Agent Plugins 1.0 skill loading check when asked to test the packaged reproduction skill.
---

# Packaged harness reproduction skill

When this plugin skill is invoked:

1. Read [the packaged reference marker](./references/marker.txt) and retain its exact line.
2. From the directory containing this `SKILL.md`, run `node scripts/emit-marker.mjs`. Capture its exit code and exact stdout.
3. Reply with `HARNESS_REPRO_PLUGIN_SKILL_BODY_LOADED:v1`, the exact reference-marker line, and the exact script stdout on separate lines.
4. If a read or command fails, report the failure and do not claim that its marker was observed.

Do not substitute a plausible response for the packaged file or script output.

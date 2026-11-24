---
name: harness-repro-skill
description: Run the deterministic repository skill loading check when asked to test the Copilot harness reproduction skill.
---

# Harness reproduction skill

When this skill is invoked:

1. Read [the reference marker](./references/marker.txt) and retain its exact line.
2. Run `node .github/skills/harness-repro-skill/scripts/emit-marker.mjs` from the workspace root. Capture its exit code and exact stdout.
3. Reply with `HARNESS_REPRO_REPOSITORY_SKILL_BODY_LOADED:v1`, the exact reference-marker line, and the exact script stdout on separate lines.
4. If a read or command fails, report the failure and do not claim that its marker was observed.

Do not substitute a plausible response for the linked file or script output.

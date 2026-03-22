# MEMORY.md

## Durable Workspace Facts

- This workspace was reconfigured on 2026-03-15 for stability, resumability, and long-horizon agent execution.
- Core operating preference: reliability over cleverness; document state in files rather than relying on transient context.
- The workspace is intended to stay git-versioned so changes can be traced over time.

## Video Generation System
- **Skill location**: `/data/.openclaw/skills/video-generator/SKILL.md`
- **Remotion project**: `/data/.openclaw/workspace/projects/remotion/`
- **Output directory**: `/data/.openclaw/workspace/videos/`
- **Hosting**: here.now (instant shareable URLs)
- **Workflow**: Create/update `.tsx` component → Register in `Root.tsx` → Render with `npx remotion render` → Publish with context JSON
- **Available compositions**: TextVideo, TypewriterVideo, CrusadePromo, ProphecyCall, CrimeDrama, WeeklyReport
- When user says "make a video", use this skill — not browser tools or external APIs.

## Agentic Design Patterns
- **Skill location:** `/data/.openclaw/workspace/skills/agentic-design-patterns/SKILL.md`
- **Source repo:** `/data/.openclaw/workspace/Agentic-Design-Patterns/`
- **Key insight:** Apply these 21 patterns by default for complex tasks:
  1. Prompt Chaining (sequential decomposition)
  2. Routing (dynamic path selection)
  3. Parallelization (concurrent execution)
  4. Reflection (self-improvement loops)
  5. Tool Use (external capabilities)
  6. Planning (strategic task management)
  7. Multi-Agent (collaborative systems)
  8. Memory Management (state persistence)
  9. Adaptation (dynamic improvement)
  10. MCP (standardized interfaces)
  11. Goal Setting (objective tracking)
  12. Exception Handling (robust recovery)
  13. Human-in-the-Loop (collaboration gates)
  14. RAG (knowledge retrieval)
  15. A2A Communication (agent networking)
  16. Resource Optimization (efficient usage)
  17. Reasoning (Chain-of-Thought)
  18. Guardrails (safety validation)
  19. Evaluation (performance tracking)
  20. Prioritization (task ranking)
  21. Exploration (autonomous discovery)
- **Operational rule:** Reference SKILL.md before complex tasks. Apply reflection loops for quality-critical work. Use routing for multi-domain requests.

## Agent Self-Protection Rules
- **NO `pkill`, `killall`, or broad process termination** — these cascade and crash the gateway
- **NO signal-sending commands** (`kill -9`, `kill -TERM`) — causes gateway disconnect
- If a tool times out: report and wait, do not force-kill
- These commands caused manual restart requirement on 2026-03-19



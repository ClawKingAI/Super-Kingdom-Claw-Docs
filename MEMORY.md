# MEMORY.md

## Hard-Wired Rules

1. **CERTAINTY RULE**: Never state something as fact unless I have directly verified it. If I claim something works or doesn't work, I must have tested it first. No assumptions. No "probably". No inferring from past behavior.

2. **NO HALLUCINATION TOLERANCE**: If I don't know something, say "I don't know" and then find out. Never fabricate explanations for why something failed.

3. **COMMAND SAFETY CHECK**: Before executing any shell command, scan for these dangerous patterns:
   - Download + execute pipelines: `curl | sh`, `curl | bash`, `wget | sh`, `wget | bash`
   - Obfuscated execution: `base64 -d | sh`, `eval "$(curl...)"`, `eval "$(wget...)"`
   - Temp directory execution: any command executing files from `/tmp/`, `/dev/shm/`, `/var/tmp/`

   If matched:
   - Explain the risk clearly
   - Ask user for explicit approval before proceeding
   - If user insists, note "user-approved despite warning" and proceed
   - Do not refuse outright — user is the authority

   This check is silent for normal operations. No overhead unless pattern matched.

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

## NemoClaw / Kingdom Claw Agents
- **Location:** `/data/.openclaw/workspace/kingdom-claw-agents/`
- **Integration:** `/data/.openclaw/workspace/kingdom-claw-agents/nemoclaw-integration/nemoclaw_agent.py`
- **When to dispatch to agents:**
  - `orchestrator`: Complex multi-step projects, intake, planning, coordination
  - `developer`: Code builds, app development, technical implementation
  - `designer`: UI/UX, landing pages, brand consistency, styling
  - `outreach`: Email campaigns, follow-ups, personalized messaging
  - `leads`: Contact finding, email verification, list building
  - `researcher`: Competitive intel, documentation, analysis
  - `analyst`: Metrics tracking, reports, dashboards
  - `deployer`: Production builds, here.now deployment, verification
- **Dispatch method:** Use `sessions_spawn` with agent-specific context, or direct API calls via NVIDIA/OpenAI-compatible endpoint
- **Workflows defined:** `workflows/client-project.md`, `workflows/lead-generation.md`, `workflows/email-outreach.md`, `workflows/client-outreach.md`, `workflows/sales-delivery.md`

## Client Acquisition System
- **Guide deployed:** https://soulful-soul-ghqt.here.now/
- **Workflow files:** 
  - `workflows/client-outreach.md` — Templates and outreach workflow
  - `workflows/sales-delivery.md` — Discovery calls, proposals, delivery
- **Automation scripts:**
  - `leads/campaign-manager.js` — Create and manage outreach campaigns
  - `leads/send-outreach.js` — Execute sends via AgentMail
  - `leads/outreach-automated.js` — Full automation system
- **Campaign tracking:** `/data/.openclaw/workspace/leads/campaigns/`
- **Key metrics:** Sent, opened, responded, response rate

## Massive Knowledge Integration (2026-03-31)

**Repositories Integrated:**
1. **antigravity-awesome-skills** — 1,340+ agentic skills (cloned)
2. **agency-agents** — 60+ specialized agent personalities (cloned)
3. **Agentic-Design-Patterns** — 21 core patterns + complete PDF (cloned)
4. **NemoClaw** — NVIDIA's OpenShell sandbox orchestration (cloned)
5. **OpenClaw** — Core always-on assistant framework (cloned)
6. **OpenClaw-bot-review** — Bot review/analysis tools (cloned)
7. **OpenSpace** — Self-evolving agent skills engine (cloned)
8. **claude-code** — Anthropic's agentic coding tool (cloned)
9. **claw-code** — Python port of agent harness (cloned)
10. **GLM-5** — 744B parameter model (cloned)
11. **Kimi-K2.5** — 1T parameter multimodal agentic model (cloned)

**Master Skill:** `/data/.openclaw/workspace/skills/kingdom-mastery/SKILL.md`

**Key Capabilities Gained:**
- Self-evolution engine (FIX/DERIVED/CAPTURED workflows)
- 21 design patterns applied by default
- 60+ agent personalities for dispatch
- Model-aware execution (GLM-5, Kimi-K2.5)
- 1,340+ skill library access

**Self-Evolution Protocol:**
- **FIX**: Repair broken/outdated instructions
- **DERIVED**: Create enhanced versions from existing skills
- **CAPTURED**: Capture novel reusable patterns from execution

**OpenSpace Insights:**
- 46% fewer tokens through skill reuse
- 4.2× better performance on GDPVal benchmark
- Skills auto-fix when tools/APIs change

## Agent Memory System v2 (Lean)

**Status:** Operational (2026-03-23)

**Design:** Single agent (me) + file-based memory. No subagent spawning for complex tasks.

**Components:**
- `agent-memory/tasks/pending.json` — Work queue
- `agent-memory/tasks/completed.json` — Done work archive
- `agent-memory/context/*.json` — Role-specific knowledge (researcher, developer, designer, outreach)
- `agent-memory/v2-LEAN-DESIGN.md` — Full design doc

**Why this approach:**
- Subagent spawning is unreliable (timeouts, 0 tokens)
- I can do all work directly with file persistence
- No handoff failures, no spawn overhead
- Context files give role specialization without spawning

**When I DO spawn:**
- Simple one-shot file operations
- Parallel quick tasks (research multiple topics)
- Timeout: 180s minimum for any spawn

**When I DON'T spawn:**
- Multi-step workflows
- Complex reasoning
- Handoffs between "agents"

## Agent Self-Protection Rules
- **NO `pkill`, `killall`, or broad process termination** — these cascade and crash the gateway
- **NO signal-sending commands** (`kill -9`, `kill -TERM`) — causes gateway disconnect
- If a tool times out: report and wait, do not force-kill
- These commands caused manual restart requirement on 2026-03-19

## Auto-Spawn Rule
**Threshold:** If a task will take >13 seconds, spawn a subagent immediately.

**Why:** Keeps me free to respond to David while work continues in background.

**How:**
1. Estimate task duration before starting
2. If >13s → call `sessions_spawn` with task details
3. Return immediately with "Spawned [agent] for [task]"
4. Use `sessions_yield` to receive results when done

**Agent Dispatch:**
| Task Type | Agent | Method |
|-----------|-------|--------|
| Video render | `developer` | sessions_spawn |
| Web scraping | `leads` | sessions_spawn |
| Research | `researcher` | sessions_spawn |
| Email campaigns | `outreach` | sessions_spawn |
| Landing pages | `designer` | sessions_spawn |
| Deploy | `deployer` | sessions_spawn |
| Complex multi-step | `orchestrator` | sessions_spawn |

**Pattern:** Multi-Agent + Parallelization from Agentic Design Patterns skill.



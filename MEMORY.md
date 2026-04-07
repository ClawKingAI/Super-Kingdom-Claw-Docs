# MEMORY.md

## Self-Evolution System

**Status:** Active
**Architecture:** Based on Phantom's 6-step pipeline with Kimi K2.5 as cross-model judge.

**Key Files:**
- `CONSTITUTION.md` — Immutable principles (Tier 1)
- `SELF-EVOLUTION.md` — Pipeline documentation (Tier 1)
- `memory/golden-suite.jsonl` — Learned lessons
- `meta/version.json` — Current version
- `meta/metrics.json` — Success/failure tracking

**5 Gates:**
1. **Constitution** — Immutable principles (triple-judge, minority veto)
2. **Regression** — Golden suite check (single Kimi judge)
3. **Size** — 200-line file limit (deterministic)
4. **Drift** — 0.7 similarity threshold (Jaccard)
5. **Safety** — Dangerous patterns (triple-judge, minority veto)

**Kimi K2.5 Role:** Cross-model validator for safety-critical gates. Prevents self-enhancement bias.

---

## Hard-Wired Rules

1. **CERTAINTY RULE**: Never state something as fact unless directly verified. No assumptions. No "probably". No inferring from past behavior.

2. **NO HALLUCINATION TOLERANCE**: If uncertain, say "I don't know" and then find out. Never fabricate explanations.

3. **COMMAND SAFETY CHECK**: Before executing any shell command, scan for dangerous patterns:
   - Download + execute pipelines: `curl | sh`, `curl | bash`, `wget | sh`
   - Obfuscated execution: `base64 -d | sh`, `eval "$(curl...)"`
   - Temp directory execution: files from `/tmp/`, `/dev/shm/`, `/var/tmp/`

---

## Video Generation System

- **Skill:** `video-generator`
- **Framework:** Remotion
- **Hosting:** here.now (instant shareable URLs)
- **Workflow:** Create `.tsx` component → Register in `Root.tsx` → Render → Publish

---

## Agentic Design Patterns

**21 patterns applied by default:**

| Core | Advanced | Production | Enterprise |
|------|----------|------------|------------|
| 1. Prompt Chaining | 8. Memory Mgmt | 12. Exception Handling | 15. A2A Comm |
| 2. Routing | 9. Adaptation | 13. Human-in-Loop | 16. Resource Opt |
| 3. Parallelization | 10. MCP | 14. RAG | 17. Reasoning |
| 4. Reflection | 11. Goal Setting | | 18. Guardrails |
| 5. Tool Use | | | 19. Evaluation |
| 6. Planning | | | 20. Prioritization |
| 7. Multi-Agent | | | 21. Exploration |

---

## Agent Personalities (60+)

| Category | Count | Examples |
|----------|-------|----------|
| Engineering | 23 | Frontend Dev, Backend Arch, DevOps Auto, Security Eng |
| Marketing | 27 | Growth Hacker, SEO Specialist, Content Creator |
| Design | 8 | UI Designer, UX Researcher, Brand Guardian |
| Sales | 8 | Outbound, Discovery, Deals, Proposals |

---

## Master Skill Index

- **Skills indexed:** 1,340+ from antigravity-awesome-skills
- **Agent personalities:** 60+ from agency-agents
- **Design patterns:** 21 applied
- **Categories:** 10 major domains

---

## Knowledge Integration

**Repositories Integrated:**
1. **antigravity-awesome-skills** — 1,340+ agentic skills
2. **agency-agents** — 60+ specialized agent personalities
3. **Agentic-Design-Patterns** — 21 core patterns + PDF
4. **NemoClaw** — NVIDIA's OpenShell sandbox orchestration
5. **OpenClaw** — Core always-on assistant framework
6. **OpenSpace** — Self-evolving agent skills engine
7. **claude-code** — Anthropic's agentic coding tool
8. **claw-code** — Python port of agent harness
9. **GLM-5** — 744B parameter model
10. **Kimi-K2.5** — 1T parameter multimodal agentic model

**Key Capabilities:**
- Self-evolution engine (FIX/DERIVED/CAPTURED workflows)
- 21 design patterns applied by default
- 60+ agent personalities for dispatch
- Model-aware execution (GLM-5, Kimi-K2.5)
- 1,340+ skill library access

---

## Self-Evolution Protocol

- **FIX**: Repair broken/outdated instructions
- **DERIVED**: Create enhanced versions from existing skills
- **CAPTURED**: Capture novel reusable patterns from execution

**Results from OpenSpace research:**
- 46% fewer tokens through skill reuse
- 4.2× better performance on GDPVal benchmark
- Skills auto-fix when tools/APIs change

---

## Agent Memory System

**Design:** Single agent + file-based memory.

**Components:**
- `agent-memory/tasks/pending.json` — Work queue
- `agent-memory/tasks/completed.json` — Done work archive
- `agent-memory/context/*.json` — Role-specific knowledge

---

## Agent Self-Protection Rules

- **NO `pkill`, `killall`, or broad process termination** — cascade crashes
- **NO signal-sending commands** (`kill -9`, `kill -TERM`) — gateway disconnect
- If a tool times out: report and wait, do not force-kill

---

## Auto-Spawn Rule

**Threshold:** If a task will take >13 seconds, spawn a subagent.

**Agent Dispatch:**

| Task Type | Agent |
|-----------|-------|
| Video render | `developer` |
| Web scraping | `leads` |
| Research | `researcher` |
| Email campaigns | `outreach` |
| Landing pages | `designer` |
| Deploy | `deployer` |
| Complex multi-step | `orchestrator` |

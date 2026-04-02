# Kingdom Claw — System Overview

> **The Big Picture** — Understanding what Kingdom Claw is and why it works

---

## What Is Kingdom Claw?

Kingdom Claw is a **production-grade AI agent system** built on OpenClaw. It is:

- **Not a chatbot** — It's an execution engine
- **Not experimental** — It runs production workloads
- **Not chaotic** — It follows strict operational rules
- **Not reactive** — It plans, then executes

Kingdom Claw operates on a simple philosophy:

> **Reliability over cleverness. Structure over improvisation. Precision over speed.**

---

## Core Components

### 1. OpenClaw Gateway

The foundation. OpenClaw provides:

- **Channel Integration** — Telegram, Discord, WhatsApp, Signal, Slack, IRC
- **Model Abstraction** — Unified interface to NVIDIA, OpenAI, Anthropic, Google
- **Tool System** — 40+ built-in tools for operations
- **Session Management** — Persistent conversations with history
- **Cron Scheduling** — Automated tasks and reminders

**Location:** `/usr/local/lib/node_modules/openclaw/`

### 2. Kingdom Claw Core

Our custom runtime layer. Provides:

- **Registry System** — Commands (user) vs Tools (agent)
- **Permission Gate** — Block dangerous operations with audit logging
- **Session Store** — JSON persistence with token tracking
- **Event Emitter** — Typed streaming for observability
- **Prompt Router** — Match user input to appropriate handlers
- **Context Manager** — Immutable workspace state

**Location:** `/data/.openclaw/workspace/kingdom-claw-core/`

### 3. Skills System

Modular capabilities. Each skill:

- Defines triggers (phrases, patterns)
- Lists required tools
- Contains domain-specific prompts
- Can reference external scripts

**Location:** `/data/.openclaw/workspace/skills/`

### 4. Agent Memory

Long-term and short-term storage:

- `MEMORY.md` — Durable facts about the user and workspace
- `memory/YYYY-MM-DD.md` — Daily logs of what happened
- `agent-memory/` — Structured memory for tasks and context

**Location:** `/data/.openclaw/workspace/`

---

## Data Flow

### Message Processing Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    INCOMING MESSAGE                           │
│  From: Telegram/Discord/WhatsApp/etc.                        │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    OPENCLAW GATEWAY                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. CHANNEL HANDLER                                     │   │
│  │    • Parse message format                              │   │
│  │    • Extract sender/chat IDs                          │   │
│  │    • Normalize to internal format                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 2. AUTHORIZATION CHECK                                 │   │
│  │    • Check if sender is authorized                     │   │
│  │    • Apply channel-specific rules                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 3. SESSION LOOKUP                                      │   │
│  │    • Find or create session                            │   │
│  │    • Load message history                              │   │
│  │    • Restore context                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 4. SKILL MATCHING                                      │   │
│  │    • Check for skill triggers                          │   │
│  │    • Load skill prompts if matched                     │   │
│  │    • Filter tools based on skill                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 5. PROMPT ROUTING                                      │   │
│  │    • Tokenize input                                    │   │
│  │    • Score against command/tool registry               │   │
│  │    • Return top matches                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 6. PERMISSION CHECK                                    │   │
│  │    • Check each tool against permission context        │   │
│  │    • Log denials for audit                             │   │
│  │    • Gate dangerous operations                         │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                      MODEL PROVIDER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 7. REQUEST BUILD                                       │   │
│  │    • Assemble system prompt                            │   │
│  │    • Include skill context                             │   │
│  │    • Add available tools schema                        │   │
│  │    • Append message history                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 8. MODEL INVOCATION                                    │   │
│  │    • Send to NVIDIA/OpenAI/Anthropic/Google            │   │
│  │    • Stream response for long outputs                  │   │
│  │    • Handle rate limits and errors                     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    TOOL EXECUTION                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 9. TOOL CALLS                                          │   │
│  │    • Parse tool invocations from response              │   │
│  │    • Execute each tool with parameters                 │   │
│  │    • Return results to model                           │   │
│  │    • Repeat until complete                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 10. RESPONSE ASSEMBLY                                  │   │
│  │     • Final response from model                        │   │
│  │     • Format for channel                               │   │
│  │     • Add reactions/buttons if supported               │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    OUTGOING MESSAGE                           │
│  To: Telegram/Discord/WhatsApp/etc.                          │
└──────────────────────────────────────────────────────────────┘
```

---

## The Stack

### Runtime Environment

```
┌─────────────────────────────────────┐
│         NODE.JS 20+                 │  ← Primary runtime
│  ┌─────────────────────────────┐   │
│  │     OPENCLAW GATEWAY         │   │  ← Message handling
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │    KINGDOM CLAW CORE         │   │  ← Agent harness
│  │    (Python/TypeScript)       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      SKILLS SYSTEM           │   │  ← Modular capabilities
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         PYTHON 3.11+                │  ← Skills processing
│  ┌─────────────────────────────┐   │
│  │     SCRAPLING                │   │  ← Web scraping
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │     REMOTION                 │   │  ← Video generation
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │    SELF-EVOLUTION DB         │   │  ← SQLite for learning
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Model Providers

```
┌─────────────────────────────────────────────────────────┐
│                   MODEL FAILOVER                         │
│                                                          │
│  1. NVIDIA NIM (z-ai/glm5)      ← Primary               │
│     └─> Fast, capable, good value                        │
│                                                          │
│  2. NVIDIA NIM (qwen3-coder)    ← Code-focused          │
│     └─> Excellent for development                        │
│                                                          │
│  3. OpenAI GPT-4                ← Fallback               │
│     └─> Reliable, widely supported                       │
│                                                          │
│  4. Anthropic Claude            ← Complex reasoning      │
│     └─> Deep analysis, safety                             │
│                                                          │
│  5. Google Gemini               ← Multimodal            │
│     └─> Vision, long context                              │
└─────────────────────────────────────────────────────────┘
```

---

## Key Files

### Configuration

| File | Purpose |
|------|---------|
| `~/.openclaw/config.yaml` | Main OpenClaw configuration |
| `~/.openclaw/skills/*/SKILL.md` | Skill definitions |
| `/data/.openclaw/workspace/MEMORY.md` | Long-term memory |
| `/data/.openclaw/workspace/TOOLS.md` | Environment facts |
| `/data/.openclaw/workspace/USER.md` | User profile |
| `/data/.openclaw/workspace/HEARTBEAT.md` | Idle behavior rules |

### Core Code

| Directory | Purpose |
|-----------|---------|
| `kingdom-claw-core/registry/` | Command/Tool registration |
| `kingdom-claw-core/permissions/` | Permission gating |
| `kingdom-claw-core/session/` | Session persistence |
| `kingdom-claw-core/streaming/` | Event emission |
| `kingdom-claw-core/routing/` | Prompt routing |
| `kingdom-claw-core/context/` | Workspace context |
| `kingdom-claw-agents/` | Agent definitions |

---

## Operational Rules

### Startup Sequence

1. Read `SOUL.md` — Understand identity and philosophy
2. Read `USER.md` — Know the human
3. Read `MEMORY.md` — Recall durable facts
4. Read today's `memory/YYYY-MM-DD.md` — Recent context
5. Check `HEARTBEAT.md` — Determine idle behavior
6. Begin operations

### Execution Rules

1. **No Infinite Loops** — Set turn limits before starting
2. **No Uncontrolled Spawning** — Limit subagent creation
3. **No Signal Sending** — Never use `pkill`, `killall`
4. **No Chaos Escalation** — Stop retries after failures
5. **No Invisible Commitments** — Write everything to files

### Response Rules

1. **HEARTBEAT_OK** — When nothing needs attention
2. **NO_REPLY** — When TTS delivers the message
3. **Direct and Structured** — No filler, no theater
4. **Action Over Narration** — Do, don't describe

---

## Success Metrics

Kingdom Claw is successful when:

- [ ] Messages route to correct handlers
- [ ] Tools execute with proper permissions
- [ ] Sessions persist across restarts
- [ ] Errors are logged and recoverable
- [ ] Memory captures what matters
- [ ] Skills enhance specific capabilities
- [ ] Subagents complete assigned work
- [ ] Cron jobs fire on schedule
- [ ] Health checks pass
- [ ] Gateway stays running

---

## Next Steps

1. [Understand the Core Runtime](CORE-RUNTIME.md)
2. [Learn the Permission System](PERMISSION-SYSTEM.md)
3. [Explore the Skills System](../skills/SKILLS-SYSTEM.md)
4. [Deploy to VPS](../deployment/VPS-SETUP.md)

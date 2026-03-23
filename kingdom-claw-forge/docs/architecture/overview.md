# Kingdom Claw Forge Architecture

## Overview

Kingdom Claw Forge is a unified agent framework for OpenClaw that synthesizes design patterns with specialist agent roles.

## Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│                   (Telegram, WhatsApp, etc)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (Main)                       │
│  - Talks to user directly                                    │
│  - Decides: work directly vs delegate                        │
│  - Applies patterns                                          │
│  - Evaluates outputs                                         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │Researcher│   │ Builder  │   │ Evaluator│
        │ Agent    │   │  Agent   │   │  Agent   │
        └──────────┘   └──────────┘   └──────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     MEMORY LAYER                             │
│  - Working memory (current task)                             │
│  - Task memory (pending/completed)                           │
│  - Project memory (MEMORY.md, context/)                      │
│  - Long-term memory (daily logs)                             │
└─────────────────────────────────────────────────────────────┘
```

## Decision Flow

```
Task arrives
     │
     ▼
┌─────────────────┐
│ Check Memory    │ ← Look for context
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Assess Task     │ ← Complexity, time, dependencies
└────────┬────────┘
         │
         ▼
┌─────────────────┐    YES    ┌─────────────────┐
│ Simple task?    │──────────▶│ Work directly   │
└────────┬────────┘           └─────────────────┘
         │ NO
         ▼
┌─────────────────┐
│ Choose Pattern  │ ← Routing, Parallel, Reflection, etc.
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Spawn agents    │ ← Only when beneficial
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Evaluate output │ ← Verify before claiming done
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store learnings │ ← Update memory
└─────────────────┘
```

## Pattern-to-Agent Mapping

| Pattern | Orchestrator Action | Specialist Used |
|---------|---------------------|-----------------|
| Prompt Chaining | Execute sequence directly | None |
| Routing | Decide path, then execute | None or Researcher |
| Parallelization | Spawn multiple simultaneously | Multiple Researchers/Builders |
| Reflection | Generate → Critique → Iterate | Self or Evaluator |
| Memory | Check/Store memory | Memory-Keeper (future) |
| RAG | Retrieve then generate | Researcher |
| Planning | Decompose task | Planner |
| Evaluation | Verify outputs | Evaluator |

## Specialist Agent Library

### Core Specialists
| Agent | Purpose | When to Spawn |
|-------|---------|---------------|
| Researcher | Find and synthesize info | Need external data |
| Builder | Create files/code | Focused build task |
| Evaluator | Verify outputs | Quality check needed |
| Planner | Decompose complex tasks | Multiple phases |

### Extended Specialists (Future)
| Agent | Purpose | When to Spawn |
|-------|---------|---------------|
| Debugger | Fix failing code | Code not working |
| Tester | Write tests | Need test coverage |
| Doc-Writer | Create documentation | Docs needed |
| Memory-Keeper | Manage memory layer | Memory operations |

## Memory Architecture

```
/data/.openclaw/workspace/
├── MEMORY.md                    # Long-term facts
├── memory/
│   └── YYYY-MM-DD.md           # Daily session logs
└── agent-memory/
    ├── tasks/
    │   ├── pending.json        # Active work queue
    │   └── completed.json      # Done work archive
    └── context/
        ├── researcher.json     # Research knowledge
        ├── builder.json        # Build conventions
        ├── designer.json       # Design tokens
        └── outreach.json       # Outreach context
```

## Integration with OpenClaw

### As Skills
Place prompts in `/prompts/` and reference via `@` syntax.

### As Context Files
Agent context stored in `/agent-memory/context/*.json` for role-specific knowledge.

### As Subagent Tasks
Spawn with:
```javascript
sessions_spawn({
  runtime: "subagent",
  task: `@kingdom-claw-forge/prompts/specialists/researcher.md\n\nTask: ${specificTask}`
})
```

## Design Principles

1. **Orchestrator is primary** — Main agent handles most work
2. **Specialists are focused** — Each has clear scope
3. **Patterns are explicit** — Consciously applied, not accidental
4. **Memory is persistent** — Context survives across sessions
5. **Evaluation is built-in** — Verify before claiming done

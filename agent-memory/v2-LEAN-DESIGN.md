# Agent Memory System v2 — Lean Design

## What Works
1. File-based shared memory (JSON)
2. Session state persistence
3. Simple subagent tasks (one action)
4. Heartbeat detection for stalled work

## What Doesn't Work
1. Complex multi-step subagent tasks
2. Handoff routing via subagent spawning
3. Persistent sessions (requires thread binding)

## Lean Solution: Main Agent + Memory Files

Instead of spawning subagents for everything, I do the work myself
and use files to persist context across sessions.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ MAIN AGENT (me)                                              │
│ - Does all work directly                                     │
│ - Reads/writes memory files                                  │
│ - Maintains conversation with David                          │
│ - Uses cron for scheduled tasks                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ MEMORY FILES (persistent)                                    │
│ - memory/daily/YYYY-MM-DD.md — Daily logs                   │
│ - MEMORY.md — Long-term facts                               │
│ - agent-memory/tasks/pending.json — Work queue              │
│ - agent-memory/tasks/completed.json — Done work             │
│ - agent-memory/context/*.json — Role-specific knowledge     │
└─────────────────────────────────────────────────────────────┘
```

### Task Queue System

Instead of handoffs between agents, use a task queue:

```json
{
  "tasks": [
    {
      "id": "task-001",
      "type": "research",
      "status": "pending",
      "created": "timestamp",
      "description": "Research competitor landing pages",
      "context": {},
      "result": null
    }
  ]
}
```

### Workflow

1. David gives task → I add to queue
2. I work on task → Update status in real-time
3. Task complete → Move to completed.json
4. Next session → Read completed.json for context

### When To Spawn Subagents

ONLY for:
- Parallel research (simple: "find X, write to file")
- One-shot file operations
- Quick validation tests

NEVER for:
- Multi-step workflows
- Handoffs between "agents"
- Complex reasoning tasks

### Session Context Files

Store role-specific knowledge that I read at session start:

```
agent-memory/context/
├── researcher.json    — Research patterns, sources, methods
├── developer.json     — Code conventions, project structure
├── designer.json      — Brand guidelines, design tokens
└── outreach.json      — Email templates, campaign history
```

When doing "researcher work", I read researcher.json first.
When doing "developer work", I read developer.json first.

This gives role specialization WITHOUT spawning subagents.

## Implementation

1. Create task queue structure
2. Update HEARTBEAT.md to check queue
3. Create context files for each role
4. Test: Add task → Do work → Mark complete
5. Verify: Next session reads completed work

## Benefits

- No timeout failures (I do the work)
- No handoff dropping (no handoffs needed)
- Full context always (I remember everything)
- Faster execution (no spawn overhead)
- Reliable (fewer moving parts)

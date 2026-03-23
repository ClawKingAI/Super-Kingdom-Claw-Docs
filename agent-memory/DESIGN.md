# Agent Memory System — Revised Design

## The Problem
I can only spawn generic subagents, not specialist agents like "developer", "researcher", etc.
- `agents_list` shows only `main` available
- `sessions_spawn` with `agentId` returns forbidden

## What Still Works

### Option A: Single Agent + Shared Memory
Instead of multiple persistent agents, I use:
1. **One main session** (me) that stays alive
2. **Shared memory files** that persist between spawns
3. **Spawned subagents** that read/write shared memory
4. **Handoffs via files** (not agent-to-agent messages)

```
┌─────────────────────────────────────────────────────────────┐
│                     MAIN SESSION (me)                        │
│  - Stays alive                                               │
│  - Monitors handoffs/pending/                                │
│  - Routes tasks by spawning subagents                        │
│  - Maintains conversation with David                         │
└─────────────────────────────────────────────────────────────┘
        │
        │ spawns (runtime: "subagent", mode: "run")
        ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUBAGENT (transient)                     │
│  - Born: reads shared memory + handoffs                      │
│  - Works: writes outputs to shared memory                    │
│  - Dies: leaves handoff if work incomplete                   │
└─────────────────────────────────────────────────────────────┘
        │
        │ reads/writes
        ▼
┌─────────────────────────────────────────────────────────────┐
│                   SHARED MEMORY (files)                      │
│  - sessions/*.json — Agent state                             │
│  - handoffs/pending/*.json — Work to pick up                 │
│  - outputs/**/*.json — Completed work                        │
│  - lessons-learned.json — Accumulated wisdom                 │
└─────────────────────────────────────────────────────────────┘
```

### How It Actually Works

**Step 1: David gives me a complex task**
```
David: "Research LaunchPad competitors, then build a comparison page"
```

**Step 2: I spawn a research subagent**
```
I: "This will take >13s. Spawning research agent..."

sessions_spawn(
  runtime: "subagent",
  mode: "run",
  task: `
    You are doing RESEARCH work.
    
    1. Read /data/.openclaw/workspace/agent-memory/sessions/researcher.json
    2. Check /data/.openclaw/workspace/agent-memory/handoffs/pending/ for any pending research tasks
    3. Do the research task
    4. Write findings to /data/.openclaw/workspace/agent-memory/outputs/researcher/[task-id].json
    5. Update /data/.openclaw/workspace/agent-memory/sessions/researcher.json with what you learned
    6. If work incomplete, write handoff to /data/.openclaw/workspace/agent-memory/handoffs/pending/
    
    Task: Research LaunchPad competitors...
  `
)

I: "Spawned research agent. Will notify when complete."
sessions_yield()
```

**Step 3: Research agent does work, writes to files**
```
Research agent:
- Reads sessions/researcher.json for context
- Does research
- Writes outputs/researcher/launchpad-competitors.json
- Updates sessions/researcher.json with findings
- Creates handoff for developer: handoffs/pending/researcher-to-developer-001.json
```

**Step 4: I receive result, check for handoff**
```
I: "Research done. Found 5 competitors. Checking for handoffs..."

I reads: handoffs/pending/researcher-to-developer-001.json

I: "Researcher left handoff for Developer. Spawning developer agent..."

sessions_spawn(
  runtime: "subagent", 
  mode: "run",
  task: `
    You are doing DEVELOPER work.
    
    1. Read /data/.openclaw/workspace/agent-memory/sessions/developer.json
    2. Read handoff: /data/.openclaw/workspace/agent-memory/handoffs/pending/researcher-to-developer-001.json
    3. Move handoff to handoffs/completed/
    4. Build the page using context from handoff
    5. Write outputs to /data/.openclaw/workspace/agent-memory/outputs/developer/[task-id].json
    6. Update sessions/developer.json
    7. Deploy and write final handoff if needed
    
    Task: Build LaunchPad comparison page using research findings...
  `
)
```

---

## Why This Works

1. **No agent type restrictions** — Each spawn just gets a task description telling it what "role" it's playing
2. **Shared memory persists** — Files survive between spawns
3. **Handoffs are explicit** — JSON files, not magic agent communication
4. **I stay responsive** — Spawns happen in background, I yield and wait
5. **Context accumulates** — Each session file grows with learnings

---

## Test Results (2026-03-23)

**Tests run:**
1. ✅ Researcher session write/read — works, 39s
2. ✅ Simple file write — works, 17s
3. ✅ Heartbeat detection — correctly identified 91-min-old handoff
4. ⚠️ Complex handoff (60s timeout) — timed out, partial work
5. ✅ Simple handoff (180s timeout) — completed in 32s

**Key findings:**
- Timeout matters — 60s too short for multi-step tasks, 180s works well
- Subagents DO complete work even if they report timeout
- Handoff moving is fragile when timeout hits mid-task
- Session state accumulation works perfectly
- `mode: "session"` requires `thread: true` but thread binding unavailable in DM context

**Recommended timeout by task complexity:**
- Simple file write: 45-60s
- Single handoff pickup: 90-120s
- Multi-step implementation: 180-300s

---

## What I Need to Do

### 1. Before Spawning: Write Context
Before I spawn any subagent, I should:
```javascript
// Update the session file with current context
write("agent-memory/sessions/researcher.json", {
  current_task: "Research LaunchPad competitors",
  parent_session: "main",
  created: timestamp,
  context: { what David asked, relevant background }
})
```

### 2. In Spawn Task: Include Instructions
```javascript
task: `
  ROLE: You are the researcher agent.
  
  CONTEXT FILES:
  - Read: /data/.openclaw/workspace/agent-memory/sessions/researcher.json
  - Check: /data/.openclaw/workspace/agent-memory/handoffs/pending/
  
  OUTPUT FILES:
  - Write findings: /data/.openclaw/workspace/agent-memory/outputs/researcher/[id].json
  - Update state: /data/.openclaw/workspace/agent-memory/sessions/researcher.json
  - Handoff if incomplete: /data/.openclaw/workspace/agent-memory/handoffs/pending/
  
  TASK: [actual task]
`
```

### 3. After Spawn: Check Handoffs
When subagent completes, I should:
```javascript
// Check for pending handoffs
ls("agent-memory/handoffs/pending/")

// If handoff exists, route it
if (handoff.to_agent === "developer") {
  spawn developer subagent with handoff context
}
```

---

## The Missing Piece: Main Agent Monitoring

**Problem:** If I don't check handoffs, they pile up.

**Solution:** Add to my heartbeat check:
```
On heartbeat:
1. Check agent-memory/handoffs/pending/
2. If handoffs exist >1 hour old, alert David
3. Offer to route them
```

---

## Updated File Structure

```
/data/.openclaw/workspace/agent-memory/
├── DESIGN.md                    # This file
├── HANDOFF_SCHEMA.json          # Handoff format
├── lessons-learned.json         # Accumulated wisdom
├── sessions/
│   ├── researcher.json          # Researcher state
│   ├── developer.json           # Developer state
│   ├── designer.json            # Designer state
│   └── ...                      # Other roles
├── handoffs/
│   ├── pending/                 # Work to be picked up
│   └── completed/               # Work that was done
└── outputs/
    ├── researcher/
    ├── developer/
    └── designer/
```

---

## Summary

**What we wanted:** Multiple persistent specialist agents talking to each other.

**What we can have:** Single main agent spawning transient subagents that coordinate via shared files.

**Why it still works:** 
- Files persist between spawns
- Handoffs create continuity
- Session files accumulate context
- I can route handoffs when I see them

**What we lose:**
- No real-time agent-to-agent chat
- No agents running continuously in background
- Must manually check/route handoffs

**What we gain:**
- Works within OpenClaw's actual capabilities
- Simple file-based coordination
- No special infrastructure needed
- David still gets fast responses

# Agent Dispatch Process

## Auto-Spawn Threshold
**If task >13 seconds → spawn subagent immediately**

## Dispatch Protocol

### 1. Estimate Duration
Before starting any task, estimate:
- Simple reads/writes → <13s → Do directly
- Video renders → >60s → SPAWN
- Web scraping → >30s → SPAWN
- Research/fetch → >20s → SPAWN
- Email campaigns → >15s → SPAWN
- Landing page builds → >30s → SPAWN

### 2. Spawn Command
```
sessions_spawn with:
- task: "Clear description of what to do"
- agentId: Which specialist (developer, designer, researcher, etc.)
- runtime: "subagent"
- mode: "run" (one-shot) or "session" (persistent)
- streamTo: "parent" (to receive results)
```

### 3. Yield for Results
```
sessions_yield with:
- message: "Spawned [agent] for [task]. Will notify when complete."
```

### 4. Receive Results
When subagent completes, results arrive in next message.

## Agent Roles

| Agent | Specialty | Typical Tasks |
|-------|-----------|---------------|
| orchestrator | Coordination | Multi-step projects, planning |
| developer | Code | Apps, scripts, video renders |
| designer | Visual | Landing pages, styling, branding |
| outreach | Email | Campaigns, follow-ups |
| leads | Prospecting | Scraping, contact finding |
| researcher | Intel | Documentation, analysis |
| analyst | Metrics | Reports, tracking |
| deployer | Shipping | here.now, production |

## Example: Video Render

**Before (wrong):**
```
I: *renders video for 90 seconds*
User: *waiting, no response*
I: "Done!"
```

**After (correct):**
```
I: "This will take ~90 seconds. Spawning developer agent..."
I: calls sessions_spawn
I: "Spawned developer for video render. Will notify when complete."
I: calls sessions_yield
[...time passes, I'm free to respond to other messages...]
System: Subagent complete
I: "Video done: https://..."
```

## When NOT to Spawn
- Quick reads/writes (<13s)
- Simple lookups
- Direct responses
- Already spawned for similar task (check subagents list)

## Check Active Agents
```
subagents(action="list")
```

## Kill If Needed
```
subagents(action="kill", target="session_id")
```

---

*This process ensures I stay responsive while long tasks run in background.*

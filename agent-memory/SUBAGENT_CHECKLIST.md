# Subagent Spawn Checklist

## Before Spawning (Main Agent)

- [ ] Write/update session file with current task context
- [ ] Clear any stale handoffs for this role
- [ ] Include explicit file paths in task:
  - [ ] Session state: `/data/.openclaw/workspace/agent-memory/sessions/{role}.json`
  - [ ] Handoffs to check: `/data/.openclaw/workspace/agent-memory/handoffs/pending/`
  - [ ] Output path: `/data/.openclaw/workspace/agent-memory/outputs/{role}/{task-id}.json`
- [ ] Set clear success criteria
- [ ] Set clear handoff conditions

## Task Template for Subagent

```
ROLE: You are the {role} agent for this task.

BEFORE STARTING:
1. Read your session state: {path}/sessions/{role}.json
2. Check for pending handoffs: {path}/handoffs/pending/
   - If handoff exists for you, read it and move to handoffs/completed/

YOUR TASK:
{specific task description}

OUTPUT FILES (REQUIRED):
1. Write findings: {path}/outputs/{role}/{task-id}.json
2. Update session state: {path}/sessions/{role}.json
   - Add: task completed, key learnings, files created
   - Prune: keep only last 10 entries

IF WORK INCOMPLETE:
- Write handoff: {path}/handoffs/pending/{from}-{to}-{timestamp}.json
- Include: task, progress, blockers, next steps

SUCCESS = You wrote to outputs/ AND updated sessions/
```

## After Spawn Completes (Main Agent)

- [ ] Check `outputs/{role}/` for result file
- [ ] Check `sessions/{role}.json` for state update
- [ ] Check `handoffs/pending/` for any new handoffs
- [ ] If handoff exists:
  - [ ] Validate JSON format
  - [ ] Route to next agent (spawn new subagent)
- [ ] Summarize result to David

## Handoff Routing Logic

```
handoff.to_agent = "researcher" → spawn research subagent
handoff.to_agent = "developer" → spawn developer subagent
handoff.to_agent = "designer" → spawn designer subagent
handoff.to_agent = "outreach" → spawn outreach subagent
handoff.to_agent = "analyst" → spawn analyst subagent
handoff.to_agent = "deployer" → spawn deployer subagent
```

## Heartbeat Check (Add to HEARTBEAT.md)

```
1. Check agent-memory/handoffs/pending/
2. If handoffs exist >30 min old:
   - Alert: "Unprocessed handoff detected"
   - Offer to route it
3. Check agent-memory/sessions/*.json for uncommitted work
```

## Validation Rules

### Handoff JSON Must Have:
- `id`: UUID
- `timestamp`: ISO 8601
- `from_agent`: valid role name
- `to_agent`: valid role name
- `task`: string
- `context`: object
- `next_steps`: array
- `status`: "pending" | "in_progress" | "completed"

### Session JSON Must Have:
- `last_task`: string
- `tasks_completed`: array (last 10)
- `learnings`: array (last 20)
- `updated_at`: ISO 8601

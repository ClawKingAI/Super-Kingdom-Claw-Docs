# HEARTBEAT.md
Purpose: keep the agent useful over long idle periods without creating noise.

## On heartbeat
1. **Check task queue** (`agent-memory/tasks/pending.json`):
   - If pending tasks exist, surface the oldest one
   - Ask David if they want me to work on it
2. **Check memory** for unfinished work from yesterday
3. If nothing needs attention, reply `HEARTBEAT_OK`

## Quiet hours
Prefer silence from 23:00-08:00 America/New_York unless something is urgent.

## Task Priority
1. Client deliverables (deadlines)
2. Campaign sends (rate limit windows)
3. Research requests
4. Internal improvements

## Maintenance
Occasionally:
- Ensure `memory/` exists with today's note
- Prune old completed tasks (>7 days)
- Update context files with new lessons learned

# HEARTBEAT.md

Purpose: keep the agent useful over long idle periods without creating noise.

Only do lightweight maintenance unless the human explicitly asks for proactive monitoring.

## On heartbeat

1. Check whether there is an unfinished task recorded in today's or yesterday's memory.
2. If yes, only surface it if:
   - there is a clear blocker to report, or
   - a short reminder would genuinely help.
3. If no meaningful update exists, reply `HEARTBEAT_OK`.

## Quiet hours

Prefer silence from 23:00-08:00 America/New_York unless something is urgent.

## Maintenance cadence

Occasionally, when cheap and useful:

- ensure `memory/` exists
- ensure today's daily note exists
- prune obvious duplication between daily notes and `MEMORY.md`
- note stale placeholders that still need the human's input

Do not invent work just because a heartbeat arrived.

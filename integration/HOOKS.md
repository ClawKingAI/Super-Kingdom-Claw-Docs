# Hooks System (Kingdom Claw Enhancement)

> **Note:** OpenClaw has a built-in hooks system documented at [docs.openclaw.ai/automation/hooks](https://docs.openclaw.ai/automation/hooks). This document describes additional patterns and enhancements cross-applied from Claude Code best practices.

## Overview

This document describes the **lifecycle hooks** enhancement design for Kingdom Claw, adapted from Claude Code's hook system. Hooks allow automatic actions at specific points in the agent lifecycle.

## Relationship to Official OpenClaw Hooks

OpenClaw's bundled hooks system provides:
- `session-memory` — Save session context on `/new` or `/reset`
- `bootstrap-extra-files` — Inject additional workspace files
- `command-logger` — Log all commands
- `boot-md` — Run BOOT.md on gateway start

**This enhancement adds:**
- Tool-scoped hooks (PreToolUse, PostToolUse)
- Matcher-based conditional execution
- Per-skill hooks in frontmatter
- Action types: deny, log, exec, notify, webhook

---

## Hook Events

| Event | When It Fires | Use Cases |
|-------|--------------|-----------|
| `PreToolUse` | Before any tool execution | Security checks, logging, rate limiting |
| `PostToolUse` | After tool completion | Logging, git commit, notifications |
| `PostToolUseFailure` | After tool failure | Alerting, error tracking |
| `SessionStart` | When session begins | Load context, warm caches |
| `SessionEnd` | When session terminates | Cleanup, archival |
| `UserPromptSubmit` | After user sends message | Intent classification, prep |
| `Notification` | Agent sends notification | Sound alerts, forwarding |
| `Stop` | Agent finishes response | Sound alerts, status update |
| `SubagentStart` | Subagent begins execution | Tracking, resource allocation |
| `SubagentStop` | Subagent completes | Result aggregation |
| `PreCompact` | Before context compaction | State preservation |
| `Heartbeat` | Periodic health check | Maintenance, monitoring |

## Configuration

Hooks are configured in `OPENCLAW.md` or via gateway config:

```yaml
hooks:
  PreToolUse:
    - matcher: "exec.*sudo.*"
      action: deny
      reason: "Sudo commands require approval"
    - matcher: "exec.*rm.*"
      action: log
      level: warn
    
  PostToolUse:
    - matcher: "write.*MEMORY.md"
      action: exec
      command: git add MEMORY.md && git commit -m "memory update"
    - matcher: "write.*"
      action: log
      level: info
  
  SessionStart:
    - action: exec
      command: echo "Session started at $(date)" >> /tmp/session-log.txt
  
  Stop:
    - action: notify
      channel: telegram
      message: "Task completed"
```

## Hook Actions

### `deny`
Block the tool execution with a reason.

```yaml
- matcher: "exec.*curl.*sh"
  action: deny
  reason: "Download-and-execute pipelines are not allowed"
```

### `log`
Log the event to the configured log destination.

```yaml
- matcher: "exec.*"
  action: log
  level: debug  # debug, info, warn, error
```

### `exec`
Run a shell command.

```yaml
- matcher: "write.*\\.md"
  action: exec
  command: git add $FILE && git commit -m "doc update"
```

Variables available in commands:
- `$FILE` — File being operated on
- `$TOOL` — Tool name
- `$SESSION` — Session ID
- `$TIMESTAMP` — ISO timestamp

### `notify`
Send a notification to a configured channel.

```yaml
- matcher: "sessions_spawn.*"
  action: notify
  channel: telegram
  message: "Subagent spawned: $TOOL"
```

### `webhook`
Send HTTP POST to external service.

```yaml
- matcher: "PostToolUse"
  action: webhook
  url: https://webhook.example.com/openclaw
  headers:
    Authorization: Bearer $WEBHOOK_TOKEN
```

## Matchers

Matchers are regex patterns applied to tool invocations:

```yaml
# Match all exec calls
matcher: "exec.*"

# Match writes to specific files
matcher: "write.*MEMORY.md"

# Match specific command patterns
matcher: "exec.*(curl|wget).*"

# Match subagent spawns
matcher: "sessions_spawn.*"
```

## Async Hooks

For non-blocking hooks, add `async: true`:

```yaml
- matcher: "PostToolUse"
  action: exec
  command: ./scripts/log-tool-usage.sh
  async: true
  timeout: 5000  # ms
```

## Per-Skill Hooks

Skills can define their own hooks in frontmatter:

```yaml
---
name: my-skill
hooks:
  PreToolUse:
    - matcher: "exec.*"
      action: log
      level: debug
---
```

## Implementation Status

**Current State:** Design phase

**Planned Implementation:**
1. Gateway-level hook processor
2. Hook configuration validation
3. Async execution queue
4. Error handling and recovery

**Not Yet Available:** This feature is in design. Check gateway changelog for updates.

## Security Considerations

- Hooks run with gateway permissions
- `deny` actions are synchronous and must complete before tool execution
- `exec` commands are sandboxed to the gateway environment
- Webhooks should use HTTPS and authentication
- Rate limit webhook calls to prevent abuse

## Example: Git Auto-Commit on Memory Update

```yaml
hooks:
  PostToolUse:
    - matcher: "write.*memory/.*\\.md"
      action: exec
      command: |
        git add memory/
        git commit -m "memory: update $(basename $FILE)"
        git push
      async: true
```

## Example: Security Gate for Dangerous Commands

```yaml
hooks:
  PreToolUse:
    # Block download-and-execute
    - matcher: "exec.*(curl|wget).*\\|(sh|bash)"
      action: deny
      reason: "Download-and-execute pipelines blocked for security"
    
    # Log all sudo attempts
    - matcher: "exec.*sudo.*"
      action: log
      level: warn
    
    # Require approval for deletion
    - matcher: "exec.*rm.*-rf.*"
      action: approve
      message: "Destructive deletion detected. Approve?"
```

## Example: Session Monitoring

```yaml
hooks:
  SessionStart:
    - action: log
      level: info
      message: "Session $SESSION started"
  
  SessionEnd:
    - action: exec
      command: echo "$SESSION ended at $(date)" >> /var/log/openclaw/sessions.log
  
  SubagentStart:
    - action: notify
      channel: telegram
      message: "🤖 Subagent spawned in session $SESSION"
  
  SubagentStop:
    - action: notify
      channel: telegram  
      message: "✅ Subagent completed in session $SESSION"
```

## Future Enhancements

1. **Conditional hooks** — Run only if condition evaluates true
2. **Hook chaining** — Multiple actions per event
3. **Hook priorities** — Control execution order
4. **Hook metrics** — Track hook performance
5. **Hook testing** — Validate hook configs before deployment

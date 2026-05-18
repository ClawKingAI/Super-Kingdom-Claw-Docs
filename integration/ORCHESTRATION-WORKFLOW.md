# OpenClaw Orchestration Workflow

## Overview

This document describes the orchestration patterns available in OpenClaw, adapted from Claude Code's Command → Agent → Skill architecture.

## Architecture

### Claude Code Pattern
```
User → /command → Agent (with skills) → Skill → Output
```

### OpenClaw Adaptation
```
User → Tool Call → sessions_spawn (with skillPreload) → Tool Execution → Output
```

## Key Differences

| Aspect | Claude Code | OpenClaw |
|--------|-------------|----------|
| Entry Point | Slash commands | Tool calls (message, exec, etc.) |
| Agent Creation | Agent tool | sessions_spawn |
| Skill Preload | `skills:` in agent def | `skillPreload` param (planned) |
| Orchestration | Command-level | Session-level |
| Output | Files + terminal | Tools + responses |

## Orchestration Patterns

### Pattern 1: Direct Tool Execution

Simplest pattern — tools called directly by main session.

```
User Request
    │
    ▼
Tool Call (exec, read, write, etc.)
    │
    ▼
Result returned to user
```

**Use Case:** Single operations, simple queries

### Pattern 2: Skill-Enhanced Execution

Skill provides instructions, session executes.

```
User Request
    │
    ▼
Skill Activation (read SKILL.md)
    │
    ▼
Tool Calls per Skill Instructions
    │
    ▼
Result returned to user
```

**Use Case:** Complex operations needing guidance (video generation, web scraping)

### Pattern 3: Spawned Subagent

Main session spawns subagent for parallel work.

```
User Request
    │
    ▼
sessions_spawn (runtime: "subagent")
    │         │
    │         ▼
    │    Subagent Session
    │         │
    │         ▼
    │    Tool Execution
    │         │
    │         ▼
    │    Result
    │         │
    ▼    ◄────┘
Main Session receives result
    │
    ▼
User receives response
```

**Use Case:** Long-running tasks, parallel processing

### Pattern 4: Skill-Preloaded Subagent (Planned)

Subagent spawns with skills preloaded into context.

```
User Request
    │
    ▼
sessions_spawn({
  skillPreload: ["agent-reach", "weather"]
})
    │         │
    │         ▼
    │    Subagent with Skills Preloaded
    │         │
    │         ▼
    │    Execute using preloaded knowledge
    │         │
    ▼    ◄────┘
Main Session receives result
```

**Use Case:** Specialized tasks requiring domain knowledge

## Implementation Examples

### Example 1: Weather Data Fetching

**Claude Code:**
```markdown
/weather-orchestrator
  → Agent: weather-agent (skills: weather-fetcher)
    → Skill: weather-svg-creator
      → Output: weather.svg
```

**OpenClaw:**
```javascript
// Main session
sessions_spawn({
  task: "Fetch weather for Dubai and create SVG card",
  runtime: "subagent",
  skillPreload: ["weather"]  // Planned feature
})
```

### Example 2: Video Generation

**Claude Code:**
```markdown
/video-create
  → Agent: video-agent (skills: video-generator)
    → Output: video.mp4 + here.now URL
```

**OpenClaw:**
```javascript
// Direct skill execution (current)
// Skill: video-generator provides instructions
// Session: Executes Remotion commands and publishes

// Or spawned for long renders:
sessions_spawn({
  task: "Generate video: 'Introduction to our product'",
  runtime: "subagent",
  timeoutSeconds: 300
})
```

### Example 3: Multi-Platform Search

**OpenClaw:**
```javascript
// Use agent-reach skill for guidance
// Execute searches in parallel via spawned subagents

const platforms = ["twitter", "reddit", "github"];

platforms.forEach(platform => {
  sessions_spawn({
    task: `Search ${platform} for: ${query}`,
    runtime: "subagent"
  });
});
```

## Best Practices

### 1. Choose the Right Pattern

| Task Type | Pattern |
|-----------|---------|
| Single operation | Direct tool execution |
| Multi-step with guidance | Skill-enhanced |
| Long-running (>13s) | Spawned subagent |
| Domain-specific | Skill-preloaded subagent |

### 2. Skill Design

Skills should be:
- **Focused** — One clear purpose
- **Composable** — Work with other skills
- **Stateless** — No reliance on previous calls
- **Documented** — Clear frontmatter + examples

### 3. Orchestration Flow

```
1. Identify task complexity
2. Select appropriate pattern
3. Load skill if needed
4. Execute tools per skill instructions
5. Return results to user
6. Log/memory as needed
```

### 4. Error Handling

```javascript
try {
  const result = await sessions_spawn({
    task: "...",
    runtime: "subagent"
  });
  // Handle success
} catch (error) {
  // Log error
  // Fallback to direct execution
  // Notify user
}
```

## Future Enhancements

### 1. Skill Preload Parameter

Add to `sessions_spawn`:
```javascript
sessions_spawn({
  task: "...",
  skillPreload: ["agent-reach", "video-generator"]
})
```

### 2. Workflow Definitions

Define reusable workflows:
```yaml
# workflows/research-workflow.yaml
name: research-workflow
steps:
  - skill: agent-reach
    action: search
  - skill: scrapling
    action: scrape
  - skill: memory
    action: store
```

### 3. Hook Integration

Hooks at orchestration points:
```yaml
hooks:
  SubagentStart:
    - action: log
      message: "Subagent spawned: $TASK"
  SubagentStop:
    - action: notify
      channel: telegram
```

### 4. Parallel Execution

Native parallel spawning:
```javascript
sessions_spawn_parallel([
  { task: "Search Twitter" },
  { task: "Search Reddit" },
  { task: "Search GitHub" }
]);
```

## Migration from Claude Code

If migrating Claude Code workflows:

1. **Commands → Tool Calls:** Replace `/commands` with direct tool invocations
2. **Agents → sessions_spawn:** Use `sessions_spawn` for agent-like behavior
3. **Skills → Skills:** Mostly compatible, add OpenClaw frontmatter
4. **Hooks → Planned:** Hook system in design phase

## Related Documentation

- [SKILL-FRONTMATTER.md](SKILL-FRONTMATTER.md) — Skill frontmatter standard
- [HOOKS.md](HOOKS.md) — Hook system design
- [MEMORY.md](../MEMORY.md) — Memory system

## Changelog

- **2026-04-06:** Initial documentation, adapted from Claude Code best practices

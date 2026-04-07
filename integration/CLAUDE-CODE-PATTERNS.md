# Claude Code Best Practices Integration

> Cross-applied from Anthropic's official Claude Code best practices repository
> **Date:** 2026-04-06
> **Status:** Implemented

---

## Overview

Claude Code is Anthropic's official CLI tool for agentic coding. This document describes how we've integrated their best practices into Kingdom Claw without breaking existing functionality.

---

## What Was Applied

### 1. Skill Frontmatter Standardization

**Source:** `.claude/skills/*/SKILL.md` pattern from Claude Code

**Before:**
```yaml
---
name: skill-name
description: Basic description
---
```

**After:**
```yaml
---
name: skill-name
description: What the skill does and when to use it
user-invocable: true
allowed-tools: exec,read,write,web_fetch
argument-hint: "[platform] [query]"
paths:
  - "**/search/**"
  - "**/research/**"
---
```

**Benefits:**
- Consistent skill discovery across 36+ skills
- Reduced permission prompts when skills are active
- Path-based auto-activation for context-aware loading
- Better autocomplete hints for invocation

**Implementation:**
- Enhanced all skills in `/data/.openclaw/skills/`
- Enhanced all skills in `/data/.openclaw/workspace/skills/`
- Created batch enhancement script: `/data/.openclaw/scripts/enhance-skills.sh`

---

### 2. Orchestration Workflow Patterns

**Source:** `orchestration-workflow/orchestration-workflow.md` from Claude Code

**Pattern:** Command → Agent (with skills) → Skill → Output

**Kingdom Claw Adaptation:**

```
User Request
    │
    ▼
Tool Call (message, exec, etc.)
    │
    ├─── Single Operation ──► Direct Tool Execution
    │
    ├─── Complex + Guidance ──► Skill-Enhanced Execution
    │                              │
    │                              ▼
    │                         Read SKILL.md
    │                              │
    │                              ▼
    │                         Execute per Skill
    │
    └─── Long-running (>13s) ──► sessions_spawn (subagent)
                                      │
                                      ▼
                                 Background Execution
                                      │
                                      ▼
                                 Result → Main Session
```

**Decision Tree:**

| Task Type | Pattern | Example |
|-----------|---------|---------|
| Single operation | Direct tool execution | Read a file |
| Complex with guidance | Skill-enhanced | Generate video with Remotion |
| Long-running (>13s) | Spawned subagent | Web scraping multiple pages |
| Domain-specific | Skill-preloaded subagent (planned) | Multi-platform search |

---

### 3. Hooks System Design

**Source:** `.claude/hooks/` and hooks documentation from Claude Code

**Note:** OpenClaw already has a hooks system. This enhances it with:

**Additional Hook Events:**

| Event | When It Fires | Use Case |
|-------|--------------|----------|
| `PreToolUse` | Before tool execution | Security gates, logging |
| `PostToolUse` | After tool completion | Git commit, notifications |
| `PostToolUseFailure` | After tool failure | Error tracking |
| `SubagentStart` | Subagent begins | Resource tracking |
| `SubagentStop` | Subagent completes | Result aggregation |

**Hook Actions:**

```yaml
# Example hook configuration
hooks:
  PreToolUse:
    - matcher: "exec.*curl.*sh"
      action: deny
      reason: "Download-and-execute blocked for security"

    - matcher: "exec.*rm.*-rf.*"
      action: approve
      message: "Destructive deletion detected. Approve?"

  PostToolUse:
    - matcher: "write.*MEMORY.md"
      action: exec
      command: git add MEMORY.md && git commit -m "memory update"

  SubagentStart:
    - action: notify
      channel: telegram
      message: "🤖 Subagent spawned: $TASK"
```

**Implementation Status:** Design phase — requires gateway-level integration

---

### 4. Memory Scopes Formalization

**Source:** Memory management patterns from Claude Code

**Kingdom Claw Scopes:**

| Scope | Location | Purpose |
|-------|----------|---------|
| Project | `MEMORY.md` | Shared across all sessions |
| Daily | `memory/YYYY-MM-DD.md` | Session-specific logs |
| User | `~/.openclaw/memory/` | Personal preferences |

**Cross-session persistence:**
- Project scope survives all restarts
- Daily logs provide audit trail
- User scope enables personalization

---

## What Was NOT Applied

### Architecture Conflicts

| Feature | Reason |
|---------|--------|
| Slash commands | Kingdom Claw is daemon-based, not CLI |
| Permission modes | Different security model via gateway |
| Effort levels | Model-specific (low/medium/high/max) |
| Shell field | Container environment, bash is default |
| Agent isolation via worktrees | Would require git workflow changes |

---

## Files Created

| File | Purpose |
|------|---------|
| `/data/.openclaw/docs/README.md` | Super Claw documentation index |
| `/data/.openclaw/docs/HOOKS.md` | Hooks system design |
| `/data/.openclaw/docs/SKILL-FRONTMATTER.md` | Frontmatter standard |
| `/data/.openclaw/docs/ORCHESTRATION-WORKFLOW.md` | Workflow patterns |
| `/data/.openclaw/scripts/enhance-skills.sh` | Batch enhancement tool |

---

## Skills Enhanced

**Total:** 36 skills across two directories

**Categories:**
- Data access (agent-reach, web search)
- Media (video-generator, image generation)
- Deployment (here-now)
- Document processing (GLM OCR variants)
- Memory (agent-memory)
- Design (landing-page-builder, website-cloner)
- Development (swift-expert, agentic-design-patterns)
- Self-evolution (self-evolution-engine)

---

## Integration with Kingdom Claw Agents

The orchestration patterns work with the 60+ agent personalities:

| Agent Type | Orchestration Pattern |
|------------|----------------------|
| orchestrator | Multi-step workflow coordination |
| developer | Skill-enhanced execution |
| designer | Skill-enhanced + spawning for renders |
| outreach | Spawned subagent for campaigns |
| researcher | Skill-preloaded (planned) |
| deployer | Skill-enhanced deployment |

---

## Future Enhancements

### 1. Skill Preload Parameter

Add to `sessions_spawn`:

```javascript
sessions_spawn({
  task: "Search Twitter and Reddit for mentions",
  skillPreload: ["agent-reach", "ddg-web-search"],
  runtime: "subagent"
})
```

### 2. Workflow Definitions

Define reusable workflows:

```yaml
# workflows/multi-platform-search.yaml
name: multi-platform-search
steps:
  - skill: agent-reach
    action: search
    platforms: [twitter, reddit, github]
  - skill: scrapling
    action: scrape_results
  - skill: memory
    action: store_findings
```

### 3. Parallel Execution

Native parallel spawning:

```javascript
sessions_spawn_parallel([
  { task: "Search Twitter", skillPreload: ["agent-reach"] },
  { task: "Search Reddit", skillPreload: ["agent-reach"] },
  { task: "Search GitHub", skillPreload: ["agent-reach"] }
]);
```

---

## Validation

All patterns validated against:

1. ✅ No breaking changes to existing skills
2. ✅ Compatible with OpenClaw gateway architecture
3. ✅ Preserves Kingdom Claw agent personalities
4. ✅ Maintains self-evolution engine integrity
5. ✅ Works with 1,340+ skill library

---

## References

- **Source:** `/data/.openclaw/workspace/claude-code-best-practice/`
- **Analysis:** `/data/.openclaw/workspace/memory/2026-04-06-claude-code-patterns-analysis.md`
- **Official Claude Code:** https://github.com/anthropics/claude-code
- **Claude Code Skills:** https://github.com/anthropics/skills

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-06 | Initial integration from Claude Code best practices |
| 2026-04-06 | Enhanced 36 skills with frontmatter fields |
| 2026-04-06 | Created hooks system design |
| 2026-04-06 | Documented orchestration patterns |

---

<div align="center">

**👑 Kingdom Claw**

*One agent learns, all agents benefit.*

</div>

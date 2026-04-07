# Kingdom Claw Roadmap

## Recent Additions

### 2026-04-06: Claude Code Best Practices Integration

**Status:** ✅ Complete

**What was added:**
- 36 skills enhanced with standardized frontmatter
- Orchestration workflow patterns documented
- Hooks system design (enhancement layer)
- Memory scopes formalized
- Batch enhancement script

**Files:**
- `integration/CLAUDE-CODE-PATTERNS.md` — Full integration documentation
- `integration/HOOKS.md` — Hooks system design
- `integration/SKILL-FRONTMATTER.md` — Frontmatter standard
- `integration/ORCHESTRATION-WORKFLOW.md` — Workflow patterns

---

### 2026-04-01: Master Skill Index

**Status:** ✅ Complete

- 1,340+ skills indexed from antigravity-awesome-skills
- 60+ agent personalities mapped
- 21 design patterns documented
- Self-evolution engine integrated

---

### 2026-03-31: Massive Knowledge Integration

**Status:** ✅ Complete

11 repositories integrated:
1. antigravity-awesome-skills — 1,340+ agentic skills
2. agency-agents — 60+ agent personalities
3. Agentic-Design-Patterns — 21 core patterns
4. NemoClaw — NVIDIA sandbox orchestration
5. OpenClaw — Core framework
6. OpenClaw-bot-review — Bot analysis tools
7. OpenSpace — Self-evolution engine
8. claude-code — Anthropic's coding tool
9. claw-code — Python harness port
10. GLM-5 — 744B model
11. Kimi-K2.5 — 1T multimodal model

---

## Upcoming

### Phase: Hooks Implementation

**Status:** Design complete, implementation pending

- PreToolUse/PostToolUse hooks
- Matcher-based conditional execution
- Per-skill hooks in frontmatter
- Action types: deny, log, exec, notify, webhook

### Phase: Skill Preload

**Status:** Planned

Add `skillPreload` parameter to `sessions_spawn`:

```javascript
sessions_spawn({
  task: "...",
  skillPreload: ["agent-reach", "weather"]
})
```

### Phase: Workflow Definitions

**Status:** Planned

Define reusable workflows in YAML:

```yaml
name: multi-platform-search
steps:
  - skill: agent-reach
    action: search
  - skill: scrapling
    action: scrape
  - skill: memory
    action: store
```

---

## Long-Term

| Priority | Feature | Status |
|----------|---------|--------|
| High | Hooks implementation | Design |
| High | Skill preload | Planned |
| Medium | Workflow definitions | Planned |
| Medium | Parallel spawning | Planned |
| Low | Model routing | Future |

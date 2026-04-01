---
name: self-evolution-engine
description: Self-evolving skill system for Kingdom Claw. Auto-learns from execution, captures successful patterns, fixes broken skills, and derives enhanced versions. No human intervention required.
version: 1.0.0
---

# Self-Evolution Engine

Kingdom Claw's autonomous learning system. Skills improve automatically through real-world use.

## Core Architecture

Based on OpenSpace (HKUDS) + Hermes patterns + ArgentOS SIS.

### Three Evolution Modes

1. **FIX** — Repair broken/outdated instructions in-place
   - Skill failed or produced wrong results
   - Tool/API changed, commands outdated
   - Path/dependency issues discovered
   - Same skill, new version

2. **DERIVED** — Create enhanced version from existing skill
   - Compose multiple skills into unified workflow
   - Specialize general skill for specific use case
   - Add error handling, fallbacks, verification
   - New skill directory, coexists with parents

3. **CAPTURED** — Extract novel reusable pattern from execution
   - Successful multi-step workflow discovered
   - Repeatable pattern worth saving
   - Brand new skill, no parent

### Three Trigger Sources

1. **Post-Execution Analysis** — After every task
   - Analyze execution recording
   - Assess skill effectiveness
   - Generate evolution suggestions
   - Apply immediately or queue

2. **Tool Degradation** — When tools fail
   - Monitor success rates per tool
   - Flag problematic tool calls
   - Batch-evolve dependent skills
   - Fix before next use

3. **Metric Monitor** — Periodic health check
   - Track: applied_rate, completion_rate, fallback_rate
   - Identify underperforming skills
   - Trigger evolution for low-effectiveness skills

## Storage Architecture

### SQLite Database: `.openspace/openspace.db`

Tables:
- `skill_records` — Identity, lineage, quality metrics
- `skill_lineage_parents` — Parent-child relationships (version DAG)
- `execution_analyses` — One per task execution
- `skill_judgments` — Per-skill assessment within analysis
- `skill_tool_deps` — Tool dependencies

### Skill Identity

Every skill has a persistent `skill_id`:
- Imported: `{name}__imp_{uuid8}`
- Evolved: `{name}__v{generation}_{uuid8}`
- Stored in `.skill_id` sidecar file

### Version DAG Model

```
IMPORTED/CAPTURED → root node (generation=0)
DERIVED → 1+ parents, generation = max(parents) + 1
FIXED → exactly 1 parent, same name/path, new skill_id
```

Only latest version has `is_active=True`.

## Execution Analysis

After each task:

```python
ExecutionAnalysis:
  task_id: str
  task_completed: bool
  execution_note: str
  tool_issues: List[str]
  skill_judgments: List[SkillJudgment]
  evolution_suggestions: List[EvolutionSuggestion]
```

### SkillJudgment

```python
SkillJudgment:
  skill_id: str
  skill_applied: bool  # Did agent follow the skill?
  note: str  # Observations
```

### EvolutionSuggestion

```python
EvolutionSuggestion:
  evolution_type: FIX | DERIVED | CAPTURED
  target_skill_ids: List[str]  # Parents (empty for CAPTURED)
  category: TOOL_GUIDE | WORKFLOW | REFERENCE
  direction: str  # What to evolve
```

## Patch System

Three LLM output formats:

1. **FULL** — Complete file content
2. **DIFF** — SEARCH/REPLACE blocks (single file)
3. **PATCH** — Multi-file format (Add/Update/Delete)

Auto-detection via `PatchType.AUTO`.

### Skill Operations

```python
fix_skill(skill_dir, content, patch_type) → SkillEditResult
derive_skill(parent_dirs, content, patch_type) → SkillEditResult
create_skill(name, content, category) → SkillEditResult
```

## Quality Metrics

Per-skill tracking:

| Metric | Formula | Meaning |
|--------|---------|---------|
| `applied_rate` | applied / selections | How often skill was actually used |
| `completion_rate` | completions / applied | Did using skill lead to success? |
| `effective_rate` | completions / selections | End-to-end effectiveness |
| `fallback_rate` | fallbacks / selections | Skill was unusable signal |

## Integration with Kingdom Claw

### Memory Layer

- `.openspace/openspace.db` — Skill evolution database
- `skills/` — Skill directories (SKILL.md + aux files)
- `memory/evolution-log/` — Human-readable evolution history

### Auto-Patch Integration

The existing `skill-patch-utils` skill is enhanced:

- Post-execution analysis triggers auto-patch
- Broken skills detected and fixed immediately
- Successful patterns captured automatically
- No human approval needed for FIX (in-place repair)

### Hermes Patterns Applied

From Hermes Agent deep-dive (2026-03-29):

1. **Frozen memory snapshot** — Skills loaded once per session
2. **Context injection** — Skill metadata in system prompt
3. **Tool registry** — Clean tool discovery/dispatch
4. **Session search** — FTS5 across evolution history

## Usage

### Automatic Mode (Default)

Skills evolve autonomously. No action required.

1. Agent completes task
2. Post-execution analysis runs
3. Evolution suggestions generated
4. Fixes/derivations applied automatically
5. Database updated

### Manual Triggers

```
# Force analysis of recent execution
analyze_last_execution()

# Check skill health metrics
skill_health_report()

# Manually fix a skill
fix_skill(
  skill_dir="/path/to/skill",
  direction="Update API endpoint from v1 to v2"
)

# Capture new pattern
capture_skill(
  name="docker-health-check",
  category="workflow",
  pattern_description="Check container health, restart if unhealthy, notify on failure"
)
```

## Safety Guards

- **Confirmation gates** — DERIVED/CAPTURED require explicit confirmation for major changes
- **Anti-loop guards** — Prevent runaway evolution cycles (max 3 retries per evolution)
- **Safety checks** — Flag dangerous patterns (prompt injection, credential exfiltration)
- **Validation** — Evolved skills tested before replacing predecessors
- **Rollback** — Previous version preserved in `content_snapshot`

## Cloud Community (Optional)

- Share evolved skills via `open-space.cloud`
- Import community skills with provenance tracking
- Network effects: one agent's improvement → every agent's upgrade

Requires `OPENSPACE_API_KEY` (optional, local evolution works without it).

## Key Insight from OpenSpace

> "Most skills focus on tool reliability and error recovery, not task-specific knowledge."

The agent learned **resilient execution patterns**:
- File format fallbacks (PDF, DOCX, Excel handling)
- Execution recovery (sandbox → shell → file-write → heredoc)
- Quality assurance (post-write verification)
- Task orchestration (multi-file tracking)

These patterns transfer across domains. Evolution captures **how** to execute reliably, not just **what** to do.

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| SQLite schema | ✅ Ready | Based on OpenSpace `store.py` |
| Execution analyzer | ⚠️ Pending | Need LLM prompt templates |
| Skill evolver | ⚠️ Pending | Core evolution logic |
| Patch system | ✅ Partial | Need to port from OpenSpace |
| Quality metrics | ⚠️ Pending | Need metric monitor loop |
| Tool degradation | ⚠️ Pending | Need ToolQualityManager |
| Metric monitor | ⚠️ Pending | Need periodic scan |

---

## References

- OpenSpace: `/data/.openclaw/workspace/OpenSpace/`
- Hermes Agent: `/data/.openclaw/workspace/hermes-agent/`
- Skill patch utils: `/data/.openclaw/workspace/skills/skill-patch-utils/`
- Context scanner: `/data/.openclaw/workspace/security/context_scanner.py`

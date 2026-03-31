# Kingdom Claw Plugins — Official Patterns

> **Production-Grade Plugin Architecture** — Based on Anthropic's Claude Code

---

## Overview

Kingdom Claw now implements the **official plugin architecture** from Anthropic's Claude Code repository. This brings production-grade patterns for:

- **Parallel Agent Execution** — Multiple agents working simultaneously
- **Confidence Scoring** — Filter false positives automatically
- **Hook System** — Event-based interventions
- **Plugin Structure** — Standardized capability packaging

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PLUGIN SYSTEM                             │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   HOOKS     │  │  PARALLEL   │  │   PLUGIN    │         │
│  │  SYSTEM     │  │   AGENTS    │  │  REGISTRY   │         │
│  │             │  │             │  │             │         │
│  │ SessionStart│  │ Execute N   │  │ Discover    │         │
│  │ PreToolUse  │  │ agents in   │  │ Load        │         │
│  │ PostToolUse │  │ parallel    │  │ Manage      │         │
│  │ Stop        │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 CONFIDENCE SCORING                    │   │
│  │                                                       │   │
│  │  Score 0-100 → Filter below threshold → Validate     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Parallel Agent Execution

### What It Does

Execute multiple specialized agents simultaneously, then aggregate results with confidence scoring.

### When to Use

- Code review (multiple perspectives)
- Complex analysis (parallel decomposition)
- Quality assurance (redundant validation)

### Implementation

```python
from plugins.parallel_agents import (
    ParallelAgentExecutor,
    AgentTask,
    AgentRole,
)

# Create executor
executor = ParallelAgentExecutor()

# Define tasks
tasks = [
    AgentTask(
        name="security_review",
        role=AgentRole.OPUS,
        prompt="Review for security vulnerabilities"
    ),
    AgentTask(
        name="performance_review",
        role=AgentRole.SONNET,
        prompt="Review for performance issues"
    ),
    AgentTask(
        name="style_review",
        role=AgentRole.HAIKU,
        prompt="Check code style and conventions"
    ),
]

# Execute in parallel
results = executor.execute_parallel(tasks)

# Get high-confidence results
high_confidence = [
    r for r in results
    if r.confidence >= 80
]
```

### Agent Roles

| Role | Use Case | Cost | Speed |
|------|----------|------|-------|
| `HAIKU` | Quick checks, filtering | Low | Fast |
| `SONNET` | Standard tasks, analysis | Medium | Medium |
| `OPUS` | Deep analysis, validation | High | Slow |

### Confidence Scoring

```python
from plugins.parallel_agents import ConfidenceScorer, ConfidenceLevel

scorer = ConfidenceScorer()

# Score an issue
issue = {
    "type": "security",
    "evidence": ["eval() detected", "user input concatenated"],
    "rule_violation": "No eval with user input"
}

score = scorer.score_issue(issue)
print(score.score)  # 75-100 for this example

# Use levels
from plugins.parallel_agents import ConfidenceLevel
score = ConfidenceLevel.HIGH  # 75
score = ConfidenceLevel.CERTAIN  # 100
```

---

## Hook System

### What It Does

Intercept operations at specific points to modify, block, or redirect behavior.

### Hook Points

| Point | When It Fires | Use Case |
|-------|---------------|----------|
| `SESSION_START` | Session begins | Inject context, load guidelines |
| `PRE_TOOL_USE` | Before tool execution | Security checks, validation |
| `POST_TOOL_USE` | After tool execution | Logging, transformation |
| `STOP` | Agent tries to exit | Intercept exit, continue work |
| `MESSAGE_RECEIVED` | User message arrives | Preprocessing |
| `RESPONSE_SENT` | Before sending response | Postprocessing |

### Implementation

```python
from plugins.hooks import (
    HookRegistry,
    HookDefinition,
    HookPoint,
    HookContext,
    HookResult,
    HookAction,
    create_security_hook,
    create_session_start_hook,
)

# Create registry
registry = HookRegistry()

# Register built-in security hook
registry.register(create_security_hook())

# Register custom hook
def my_hook(ctx: HookContext) -> HookResult:
    if ctx.tool_name == "exec":
        command = ctx.tool_params.get("command", "")
        if "rm -rf" in command:
            return HookResult(
                action=HookAction.BLOCK,
                block_reason="Dangerous command blocked"
            )
    return HookResult(action=HookAction.ALLOW)

registry.register(HookDefinition(
    name="no-rm-rf",
    hook_point=HookPoint.PRE_TOOL_USE,
    handler=my_hook,
    priority=10,  # Lower = earlier
    description="Block rm -rf commands"
))
```

### Built-in Hooks

```python
# Security guidance (warns about patterns)
from plugins.hooks import create_security_hook
registry.register(create_security_hook())

# Session start (injects context)
from plugins.hooks import create_session_start_hook
registry.register(create_session_start_hook("Your system prompt here"))

# Stop intercept (Ralph Wiggum pattern)
from plugins.hooks import create_stop_intercept_hook
registry.register(create_stop_intercept_hook("Continue working on task"))
```

---

## Plugin Structure

### Standard Format

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json      # Metadata
├── commands/            # Slash commands
│   └── my-cmd.md
├── agents/              # Specialized agents
│   └── my-agent.md
├── skills/              # Domain skills
│   └── my-skill.md
├── hooks/               # Event handlers
│   └── hooks.json
├── settings/            # Configuration
│   └── settings.json
└── README.md            # Documentation
```

### Creating a Plugin

```python
from plugins.plugin_system import PluginBuilder, create_plugin_directory
from pathlib import Path

# Build plugin
plugin = (PluginBuilder("code-review-enhanced")
    .version("1.0.0")
    .description("Enhanced code review with parallel agents")
    .author("Kingdom Claw", "kingdom@claw.ai")
    .add_command("review", "Review code with multiple perspectives")
    .add_agent("security-agent", "Check for security issues", role="opus")
    .add_agent("style-agent", "Check code style", role="haiku")
    .add_skill("review-skill", "Auto-review on PR creation")
    .add_hook("PreToolUse", {"check": "security"})
    .build())

# Create directory
plugin_path = create_plugin_directory(plugin, Path("~/.openclaw/plugins"))
```

### Plugin Discovery

```python
from plugins.plugin_system import PluginRegistry

registry = PluginRegistry()

# Discover all plugins
plugins = registry.discover()

# Get specific plugin
code_review = registry.get("code-review")

# Get all commands/agents/skills
all_commands = registry.get_commands()
all_agents = registry.get_agents()
all_skills = registry.get_skills()
```

---

## Code Review Workflow

### Complete Example

```python
from plugins.parallel_agents import CodeReviewWorkflow

# Create workflow
workflow = CodeReviewWorkflow()

# Review a PR
issues = workflow.review(pr_number=123, post_comment=True)

# Issues returned have confidence scores
for issue in issues:
    print(f"[{issue['confidence']}] {issue['description']}")
    print(f"  → {issue['fix_suggestion']}")
```

### Workflow Steps

1. **Check if review needed** (Haiku) — Skip closed/draft/trivial PRs
2. **Gather guidelines** (Haiku) — Collect CLAUDE.md files
3. **Summarize changes** (Sonnet) — Understand what changed
4. **Parallel review** (4 agents):
   - Agent 1: CLAUDE.md compliance
   - Agent 2: CLAUDE.md compliance (redundancy)
   - Agent 3: Bug detection
   - Agent 4: Historical context
5. **Score issues** — Rate 0-100
6. **Validate high-confidence** — Confirm with secondary agents
7. **Output filtered results** — Only ≥80 confidence

---

## Integration with Kingdom Claw Core

### File Structure

```
kingdom-claw-core/
├── plugins/
│   ├── __init__.py
│   ├── parallel_agents.py   # Parallel execution
│   ├── hooks.py             # Hook system
│   └── plugin_system.py     # Plugin registry
├── registry/
├── permissions/
├── session/
├── streaming/
├── routing/
└── context/
```

### Usage in Runtime

```python
from kingdom_claw_core import create_runtime
from plugins.hooks import execute_hooks, HookContext, HookPoint

# Create runtime
runtime = create_runtime()

# Execute hooks before tool use
ctx = HookContext(
    hook_point=HookPoint.PRE_TOOL_USE,
    tool_name="exec",
    tool_params={"command": "ls -la"}
)

should_proceed, ctx = execute_hooks(HookPoint.PRE_TOOL_USE, ctx)

if should_proceed:
    result = runtime.submit_turn(ctx.message)
```

---

## Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Agent Execution | Sequential | Parallel |
| Result Quality | All returned | Confidence-filtered |
| Extensibility | Custom code | Plugin system |
| Security | Permission gate | + Security hooks |
| Reliability | Manual validation | Validation loops |

---

## Best Practices

### Parallel Agents

1. Use Haiku for filtering, Opus for deep analysis
2. Always set confidence thresholds (≥80 recommended)
3. Validate high-stakes results with secondary agents
4. Limit parallel workers to avoid rate limits

### Hooks

1. High priority (low number) for security checks
2. Low priority for logging/monitoring
3. Block sparingly — prefer warnings
4. Always log hook actions

### Plugins

1. One responsibility per plugin
2. Document all commands/agents
3. Include README with examples
4. Version plugins properly

---

## Next Steps

1. [Parallel Agents Deep Dive](PARALLEL-AGENTS.md)
2. [Hook System Reference](HOOKS.md)
3. [Plugin Development Guide](PLUGIN-DEV.md)

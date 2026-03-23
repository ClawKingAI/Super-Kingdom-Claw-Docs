# Kingdom Claw Forge

A unified agent framework for OpenClaw that synthesizes design patterns from Agentic Design Patterns with practical specialist roles from agency-agents.

## Purpose

Build one clean, practical agent framework that works inside OpenClaw:
- Master orchestrator talks to user directly
- Pattern engine applies the right approach to each task
- Specialist agents are spawned only when useful
- Memory layer persists context across sessions
- Evaluation layer prevents fake completions

## Philosophy

1. **Direct over delegated** — Main agent handles simple work itself
2. **Pattern-aware** — Apply the right pattern to the right problem
3. **Specialist when needed** — Spawn focused agents for complex parallel work
4. **Memory-first** — Context persists, agents don't start fresh
5. **Evaluation built-in** — Verify outputs before claiming done

## Quick Start

```
/data/.openclaw/workspace/kingdom-claw-forge/
├── README.md           — This file
├── docs/               — Architecture and pattern documentation
├── prompts/            — Ready-to-use prompts for OpenClaw
├── agents/             — Agent definitions and configurations
├── patterns/           — Pattern implementations
├── examples/           — Example workflows
└── templates/          — Reusable templates
```

## Components

### Orchestrator
The main brain. Reads prompts/orchestrator/main.md to understand:
- When to work directly
- When to delegate
- Which pattern to apply
- How to evaluate output

### Pattern Engine
Reusable patterns for agent work:
- **Routing** — Decide which path to take
- **Parallel** — Run multiple agents simultaneously
- **Reflection** — Self-critique and improve
- **Memory** — Store and retrieve context
- **RAG** — Retrieve relevant information
- **Planning** — Decompose complex tasks

### Specialist Agents
Focused agents for specific work:
- researcher — Find and synthesize information
- builder — Create files, websites, automations
- evaluator — Check quality and completeness
- memory-keeper — Manage context persistence
- planner — Decompose complex tasks

### Evaluation Layer
Reality-check before completion:
- Verify tools actually succeeded
- Check outputs match requirements
- Flag uncertainty clearly
- Route failures for repair

## Installation

1. Clone or copy to your OpenClaw workspace:
```bash
cp -r kingdom-claw-forge ~/.openclaw/workspace/
```

2. Reference the orchestrator prompt:
```bash
# In your AGENTS.md or system context
@kingdom-claw-forge/prompts/orchestrator/main.md
```

3. Use specialist agents when needed:
```bash
# Spawn with the relevant prompt
sessions_spawn(runtime="subagent", task="@kingdom-claw-forge/prompts/specialists/researcher.md + [your task]")
```

## Pattern Reference

| Pattern | Use When | Example |
|---------|----------|---------|
| Routing | Multiple valid paths, need to choose | "Research X then decide: build or buy" |
| Parallel | Independent tasks, can run together | "Check 5 competitor sites simultaneously" |
| Reflection | Quality critical, needs review | "Write code, then critique and improve" |
| Memory | Context from previous work needed | "Continue yesterday's landing page build" |
| Planning | Complex multi-step task | "Launch new outreach campaign" |

## License

MIT

## Credits

See CREDITS.md for source acknowledgments.

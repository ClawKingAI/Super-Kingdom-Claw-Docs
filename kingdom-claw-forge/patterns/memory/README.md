# Memory Pattern

Persist and retrieve context across sessions and agents.

## When to Use

- Task spans multiple sessions
- Need context from previous work
- Building on past decisions
- User shares preferences to remember

## Memory Layers

### Layer 1: Working Memory (Current Session)
- Current task state
- Active decisions
- In-progress work
- **Storage**: Session context (implicit)

### Layer 2: Task Memory (Current Task)
- Task requirements
- Progress made
- Blockers encountered
- **Storage**: `agent-memory/tasks/pending.json`

### Layer 3: Project Memory (Current Project)
- Project structure
- Key decisions
- Technical context
- **Storage**: `MEMORY.md`, `agent-memory/context/*.json`

### Layer 4: Long-term Memory (Historical)
- User preferences
- Past learnings
- Recurring patterns
- **Storage**: `memory/YYYY-MM-DD.md`, `MEMORY.md`

## Implementation

### Check Before Starting
```markdown
1. memory_search(query: [task topic])
2. read MEMORY.md
3. read memory/YYYY-MM-DD.md (today + yesterday)
4. read agent-memory/tasks/pending.json
```

### Store After Completing
```markdown
1. Update task status in pending.json
2. Write learnings to memory/YYYY-MM-DD.md
3. Update MEMORY.md if durable fact discovered
4. Update context/*.json if role-specific learning
```

## Storage Rules

### Always Store
- User preferences explicitly stated
- API keys and credentials (securely)
- Project structure decisions
- Failure patterns to avoid

### Sometimes Store
- Interesting solutions discovered
- Useful code snippets
- Reference information

### Never Store
- Transient information
- Already-documented facts
- Information that will be obsolete

## Retrieval Strategy

1. **Working task?** → Check task memory first
2. **Need context?** → Search MEMORY.md
3. **Recent history?** → Read last 2 daily logs
4. **Role-specific?** → Check context/*.json

## Anti-Patterns

- Don't store everything (memory bloat)
- Don't skip the check step
- Don't duplicate existing memory
- Don't store sensitive data in plain text

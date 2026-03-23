# Parallel Pattern

Run multiple tasks simultaneously when they don't depend on each other.

## When to Use

- Multiple independent research tasks
- Checking several sources at once
- Building components that don't interact
- Time-sensitive work that benefits from parallelism

## Implementation

### Step 1: Identify Independence
```markdown
## Task Decomposition

### Task A: [Description]
- Depends on: nothing
- Can run: immediately

### Task B: [Description]
- Depends on: nothing
- Can run: immediately

### Task C: [Description]
- Depends on: Task A
- Can run: after Task A completes
```

### Step 2: Group Parallel Sets
- Set 1: Tasks A, B (no dependencies)
- Set 2: Task C (depends on A)

### Step 3: Execute
- Spawn agents for each task in Set 1 simultaneously
- Wait for all Set 1 to complete
- Execute Set 2

## OpenClaw Example

```javascript
// Parallel research
const sources = [
  "competitor A website",
  "competitor B website",
  "competitor C website"
];

// Spawn 3 researcher agents simultaneously
sources.forEach(source => {
  sessions_spawn({
    runtime: "subagent",
    task: `Research ${source}. Write findings to /tmp/${source}.json`
  });
});

// Wait for all to complete (they auto-announce)
```

## Success Criteria

- All parallel tasks complete before dependent work starts
- Results are merged/combined at the end
- No race conditions on shared resources

## Anti-Patterns

- Don't run dependent tasks in parallel
- Don't spawn more agents than needed
- Don't forget to collect all results

# Planning Pattern

Decompose complex tasks into manageable steps.

## When to Use

- Task has multiple phases
- Unclear where to start
- Dependencies between steps
- Risk of missing steps

## Implementation

### Step 1: Define Goal
```markdown
## Goal
[One clear sentence describing the end state]
```

### Step 2: Decompose
```markdown
## Phases

### Phase 1: [Name]
- **Goal**: [What this phase accomplishes]
- **Steps**:
  1. [Step 1]
  2. [Step 2]
- **Deliverable**: [What proves phase complete]
- **Dependencies**: [What must exist first]

### Phase 2: [Name]
...
```

### Step 3: Identify Parallelism
- Which phases can run together?
- Which must be sequential?

### Step 4: Execute and Track
- Mark completed phases
- Note blockers
- Adjust plan as needed

## Example

**Task**: "Launch email campaign to GA churches"

**Plan**:
- Phase 1: Research (compile church list)
- Phase 2: Draft (write email template)
- Phase 3: Configure (set up sender)
- Phase 4: Test (send to 3 contacts)
- Phase 5: Execute (send to full list)

**Parallelism**: Phase 1 and 2 can run together.

## Anti-Patterns

- Don't plan without executing
- Don't make phases too granular
- Don't ignore dependencies
- Don't forget to track progress

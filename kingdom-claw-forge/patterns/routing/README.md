# Routing Pattern

Decide which path to take when multiple valid options exist.

## When to Use

- Multiple approaches could solve the problem
- Need to choose between build vs buy vs skip
- Task could go to different specialists
- Uncertainty about best approach

## Implementation

### Step 1: List Options
```markdown
## Options for [Task]

### Option A: [Name]
- Pros: [benefits]
- Cons: [drawbacks]
- Effort: low/medium/high
- Risk: low/medium/high

### Option B: [Name]
- Pros: [benefits]
- Cons: [drawbacks]
- Effort: low/medium/high
- Risk: low/medium/high
```

### Step 2: Evaluate
- Which option has best effort/outcome ratio?
- Which option has lowest risk?
- Which option aligns with user preferences?

### Step 3: Decide
- Choose one option
- Explain reasoning briefly
- Execute chosen path

## Example

**Task**: "Add analytics to landing page"

**Options**:
1. Google Analytics — Standard, free, familiar
2. Plausible — Privacy-focused, simpler
3. Custom events — Full control, more work

**Decision**: Use Plausible for privacy alignment and simplicity.

## Anti-Patterns

- Don't route without evaluating
- Don't create too many options (analysis paralysis)
- Don't forget to actually execute the chosen path

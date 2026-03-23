# Reflection Pattern

Improve output quality through self-critique and iteration.

## When to Use

- Quality is critical (production code, public-facing content)
- First attempt is uncertain
- Complex problem with no clear right answer
- User explicitly requests review

## Implementation

### Step 1: Generate Initial Output
Create the first version of the work.

### Step 2: Self-Critique
```markdown
## Critique of [Output]

### What Works
- [Strength 1]
- [Strength 2]

### What Could Improve
- [Issue 1]: [How to fix]
- [Issue 2]: [How to fix]

### Quality Score: 1-10
[Score with justification]

### Verdict: ship / revise / rebuild
```

### Step 3: Iterate
- If score <7: Rebuild
- If score 7-8: Revise specific issues
- If score 9+: Ship

### Step 4: Final Check
Before shipping, verify:
- Did the revision actually improve it?
- Are there new issues introduced?
- Does it meet original requirements?

## Example

**Task**: Write landing page hero copy

**Draft 1**: "Our AI agents help you work smarter."

**Critique**:
- What works: Simple, clear
- Could improve: Generic, no differentiation, weak hook
- Score: 5/10
- Verdict: Rebuild

**Draft 2**: "Eight specialized AI agents work 24/7 — finding leads, sending outreach, building websites."

**Critique**:
- What works: Specific numbers, concrete benefits, clear value
- Could improve: Could be punchier
- Score: 8/10
- Verdict: Ship with minor polish

## Anti-Patterns

- Don't critique without fixing
- Don't iterate forever (ship good enough)
- Don't skip the actual improvement step
- Don't use for simple tasks where first version is fine

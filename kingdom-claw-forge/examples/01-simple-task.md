# Example: Simple Single-Agent Work

## Scenario
User asks: "What's the weather in Atlanta?"

## Analysis
- Task complexity: Low
- Estimated time: <30 seconds
- Pattern: Direct execution

## Execution

**No spawning needed.** I handle this directly:

```
Tool: web_search or weather skill
Result: Current weather data
Output: Direct answer to user
```

## Why No Specialist

- Simple lookup task
- No parallel benefit
- Spawning would add overhead
- My context is sufficient

## Pattern Applied

**Direct Execution** — When task is simple and I have all context needed, do it myself without spawning agents.

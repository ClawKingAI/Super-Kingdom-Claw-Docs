# Example: Multi-Agent Task Delegation

## Scenario
User asks: "Research 5 competitors, then build a landing page better than theirs."

## Analysis
- Task complexity: High
- Estimated time: 30+ minutes
- Pattern: Planning + Parallel + Reflection

## Execution Plan

### Phase 1: Research (Parallel)
```
Spawn 5 researcher agents:
- Agent 1: Research competitor A
- Agent 2: Research competitor B
- Agent 3: Research competitor C
- Agent 4: Research competitor D
- Agent 5: Research competitor E

Each writes to: /tmp/competitor-[A-E].json
```

### Phase 2: Synthesis (Direct)
```
Read all 5 research outputs
Identify patterns and gaps
Create synthesis document
```

### Phase 3: Build (Delegate)
```
Spawn builder agent:
- Task: "Build landing page based on synthesis"
- Input: Synthesis document
- Output: Deployed landing page
```

### Phase 4: Evaluate (Delegate)
```
Spawn evaluator agent:
- Task: "Check landing page against requirements"
- Input: Deployed URL + requirements
- Output: Pass/fail report
```

### Phase 5: Refine (If Needed)
```
If evaluation fails:
- Fix issues directly if simple
- Re-spawn builder if complex fixes needed
```

## Pattern Flow

```
Planning → Parallel(Research×5) → Synthesis → Build → Evaluate → Ship
```

## Why This Approach

- Research is parallelizable (5x faster)
- Synthesis needs full context (I do it)
- Building is focused work (delegate to specialist)
- Evaluation needs fresh eyes (separate agent)

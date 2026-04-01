# Reflection Pattern

Self-evaluation and improvement loop. Agents assess their own output, iterate, and improve before handoff.

---

## Pattern Overview

**Category**: Core Pattern
**Purpose**: Enable agents to evaluate and improve their own work
**Applies To**: All agents, especially Evaluator

---

## Problem

Agents produce output in one shot. Without reflection, errors propagate downstream, quality varies, and there's no self-correction mechanism.

---

## Solution

Implement reflection loops where agents:
1. **Generate** initial output
2. **Evaluate** against criteria
3. **Identify** gaps and issues
4. **Refine** output
5. **Repeat** until threshold met

---

## Implementation

### Reflection Loop Structure

```python
def reflection_loop(
    agent: Agent,
    task: Task,
    criteria: List[Criterion],
    max_iterations: int = 3,
    threshold: float = 0.85
) -> Output:
    """
    Execute reflection loop for an agent task.
    
    Args:
        agent: The agent executing the task
        task: The task to complete
        criteria: Success criteria for evaluation
        max_iterations: Maximum refinement cycles
        threshold: Quality threshold to pass
    
    Returns:
        Output that meets quality threshold
    """
    iteration = 0
    output = None
    evaluation = None
    
    while iteration < max_iterations:
        # Generate or refine output
        if iteration == 0:
            output = agent.generate(task)
        else:
            output = agent.refine(task, output, evaluation.feedback)
        
        # Self-evaluate
        evaluation = agent.evaluate(output, criteria)
        
        # Check if good enough
        if evaluation.score >= threshold:
            return output
        
        # Log iteration
        log_reflection_iteration(
            agent=agent.name,
            task=task.id,
            iteration=iteration,
            score=evaluation.score,
            feedback=evaluation.feedback
        )
        
        iteration += 1
    
    # Max iterations reached, return best effort
    return output
```

### Self-Evaluation Prompt Template

```markdown
## Self-Evaluation

You have produced the following output:
[OUTPUT]

Evaluate against these criteria:
[CRITERIA]

For each criterion, assess:
1. ✅ PASS - Criterion fully met
2. ⚠️ PARTIAL - Criterion partially met (explain gap)
3. ❌ FAIL - Criterion not met (explain issue)

### Evaluation
| Criterion | Status | Evidence | Gap/Issue |
|-----------|--------|----------|-----------|
| [Criterion 1] | [status] | [evidence] | [if applicable] |
| [Criterion 2] | [status] | [evidence] | [if applicable] |

### Overall Score: [X/100]

### Issues to Address
[If score below threshold, list specific improvements needed]

### Refinement Plan
[If refining, what changes will you make]
```

### Agent Reflection Capability

```python
class ReflectiveAgent:
    """
    Agent with built-in reflection capability.
    """
    
    def execute_with_reflection(self, task: Task) -> Output:
        """Execute task with self-reflection loop."""
        
        # Initial generation
        output = self.generate(task)
        
        # Reflection cycle
        for i in range(self.max_reflections):
            # Evaluate own output
            evaluation = self.reflect(output, task.criteria)
            
            if evaluation.passes_threshold():
                self.log_success(iteration=i, score=evaluation.score)
                return output
            
            # Identify improvements
            improvements = self.identify_improvements(evaluation)
            
            # Refine output
            output = self.refine(output, improvements)
        
        # Return best effort after max iterations
        return output
    
    def reflect(self, output: Output, criteria: List[Criterion]) -> Evaluation:
        """Self-evaluate output against criteria."""
        prompt = self.build_reflection_prompt(output, criteria)
        response = self.llm.generate(prompt)
        return self.parse_evaluation(response)
    
    def identify_improvements(self, evaluation: Evaluation) -> List[Improvement]:
        """Extract specific improvements from evaluation."""
        improvements = []
        for issue in evaluation.issues:
            improvements.append(Improvement(
                target=issue.location,
                action=issue.suggested_fix,
                priority=issue.priority
            ))
        return improvements
    
    def refine(self, output: Output, improvements: List[Improvement]) -> Output:
        """Apply improvements to output."""
        prompt = self.build_refinement_prompt(output, improvements)
        return self.llm.generate(prompt)
```

---

## Decision Flow

```
    ┌─────────────┐
    │ Generate    │
    │ Output      │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ Evaluate    │
    │ Output      │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ Score >=    │
    │ Threshold?  │
    └─────┬───┬───┘
          │   │
     YES  │   │  NO
          │   │
          ▼   ▼
     ┌────────┐ ┌────────────┐
     │ Return │ │ Identify   │
     │ Output │ │ Improvements│
     └────────┘ └─────┬──────┘
                      │
                      ▼
               ┌────────────┐
               │ Iterations │
               │ < Max?     │
               └─────┬───┬──┘
                     │   │
                YES  │   │  NO
                     │   │
                     ▼   ▼
              ┌──────────┐ ┌────────┐
              │ Refine   │ │ Return │
              │ Output   │ │ Best   │
              └────┬─────┘ └────────┘
                   │
                   └──────────► (back to Evaluate)
```

---

## Examples

### Backend Architect Reflection

```markdown
## Iteration 1

**Output**: Initial API design
**Evaluation**: 
- ✅ RESTful conventions: PASS
- ⚠️ Error handling: PARTIAL - missing rate limit handling
- ❌ Security: FAIL - no authentication specified
- **Score**: 65/100

**Improvements**:
1. [Critical] Add JWT authentication to all endpoints
2. [Important] Implement rate limiting with 429 responses
3. [Nice-to-have] Add request validation middleware

## Iteration 2

**Output**: Refined API design with auth and rate limiting
**Evaluation**:
- ✅ RESTful conventions: PASS
- ✅ Error handling: PASS
- ⚠️ Security: PARTIAL - auth present, missing input validation
- **Score**: 85/100

## Iteration 3

**Output**: Final API design with input validation
**Evaluation**:
- ✅ RESTful conventions: PASS
- ✅ Error handling: PASS
- ✅ Security: PASS
- **Score**: 92/100

**Result**: PASS - Return output
```

### Content Specialist Reflection

```markdown
## Iteration 1

**Output**: Initial blog post draft
**Evaluation**:
- ✅ Topic coverage: PASS
- ⚠️ Readability: PARTIAL - some sentences >25 words
- ❌ SEO: FAIL - missing target keywords
- **Score**: 60/100

**Improvements**:
1. [Critical] Include "API design" keyword 3-5 times
2. [Important] Break up long sentences
3. [Nice-to-have] Add subheadings

## Iteration 2

**Output**: Revised blog post
**Evaluation**:
- ✅ Topic coverage: PASS
- ✅ Readability: PASS
- ✅ SEO: PASS
- **Score**: 88/100

**Result**: PASS - Return output
```

---

## Anti-Patterns

### ❌ Infinite Reflection
Agent keeps reflecting forever, never passing threshold.

```python
# Bad: No iteration limit
while evaluation.score < threshold:
    output = refine(output)  # Could loop forever
```

### ❌ Threshold Too High
Perfectionism prevents forward progress.

```yaml
# Bad: Unrealistic threshold
threshold: 0.99  # Agent may never pass
```

### ❌ Generic Feedback
"Improve quality" doesn't help.

```markdown
# Bad: Vague feedback
"Issues: Quality could be better"

# Good: Specific feedback  
"Issues: Missing error handling for 401 responses"
```

### ❌ Skipping Reflection
One-shot generation without evaluation.

```python
# Bad: No reflection
def execute(task):
    return generate(task)  # No evaluation, no refinement
```

---

## Configuration

```yaml
reflection:
  default_threshold: 0.85
  max_iterations: 3
  log_all_iterations: true
  domain_thresholds:
    engineering: 0.90
    content: 0.80
    design: 0.85
```

---

## Integration Points

- **All Agents**: Build reflection into execute method
- **Evaluator**: Uses reflection logic for quality gates
- **Orchestrator**: Sets reflection thresholds per task
- **Memory**: Logs reflection history for learning

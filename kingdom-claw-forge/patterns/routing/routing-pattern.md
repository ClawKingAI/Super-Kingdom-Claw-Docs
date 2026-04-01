# Routing Pattern

Dynamic task routing for agent selection. Directs work to appropriate specialists based on task characteristics.

---

## Pattern Overview

**Category**: Core Pattern
**Purpose**: Select the right agent for the right task
**Applies To**: Orchestrator, task intake systems

---

## Problem

When a request enters the system, how do you determine which specialist should handle it? Manual routing doesn't scale, and wrong routing wastes time and degrades quality.

---

## Solution

Implement rule-based routing with:
1. **Intent classification** - detect what the task is about
2. **Capability matching** - map intent to specialist capabilities
3. **Conflict resolution** - handle cases where multiple specialists apply
4. **Fallback handling** - default routing for ambiguous cases

---

## Implementation

### Routing Rules Format

```yaml
routing_rules:
  - name: "design-ux"
    triggers:
      keywords: ["design", "ux", "ui", "interface", "user experience", "wireframe"]
      patterns: ["design.*for", "how should.*look", "ux for"]
    target_agent: "ux-architect"
    priority: 1
    
  - name: "backend-architecture"
    triggers:
      keywords: ["architecture", "backend", "api", "database", "scale", "infrastructure"]
      patterns: ["build.*api", "design.*system", "data.*schema"]
    target_agent: "backend-architect"
    priority: 1
    
  - name: "devops"
    triggers:
      keywords: ["deploy", "ci/cd", "pipeline", "kubernetes", "docker", "terraform"]
      patterns: ["set up.*deployment", "automate.*pipeline", "infrastructure.*as code"]
    target_agent: "devops-automator"
    priority: 1
    
  - name: "content"
    triggers:
      keywords: ["write", "copy", "content", "blog", "article", "documentation"]
      patterns: ["write.*for", "create.*content", "draft.*documentation"]
    target_agent: "content-specialist"
    priority: 1
```

### Routing Function

```python
def route_task(request: str, context: dict) -> AgentAssignment:
    """
    Route a request to the appropriate specialist.
    
    Args:
        request: The incoming request text
        context: Additional context (files, history, etc.)
    
    Returns:
        AgentAssignment with target agent and confidence
    """
    # Step 1: Keyword matching
    keyword_matches = []
    for rule in routing_rules:
        for keyword in rule.triggers.keywords:
            if keyword.lower() in request.lower():
                keyword_matches.append((rule, 1.0))
    
    # Step 2: Pattern matching
    pattern_matches = []
    for rule in routing_rules:
        for pattern in rule.triggers.patterns:
            if re.search(pattern, request, re.IGNORECASE):
                pattern_matches.append((rule, 0.8))
    
    # Step 3: Combine and rank
    all_matches = keyword_matches + pattern_matches
    ranked = rank_matches(all_matches)
    
    # Step 4: Resolve conflicts
    if len(ranked) > 1:
        top_match = resolve_conflict(ranked)
    elif len(ranked) == 1:
        top_match = ranked[0]
    else:
        top_match = default_routing(request)
    
    return AgentAssignment(
        agent=top_match.target_agent,
        confidence=top_match.confidence,
        reasoning=top_match.explanation
    )
```

### Conflict Resolution

```python
def resolve_conflict(matches: list) -> Match:
    """
    Resolve when multiple specialists could handle the task.
    """
    # Priority 1: Explicit domain indicators
    for match in matches:
        if has_explicit_domain_indicator(match):
            return match
    
    # Priority 2: Highest confidence + least loaded agent
    sorted_matches = sorted(
        matches, 
        key=lambda m: (m.confidence, -get_agent_load(m.agent)),
        reverse=True
    )
    
    # Priority 3: Ask for clarification if close tie
    if len(matches) > 1 and scores_are_close(matches):
        return request_clarification(matches)
    
    return sorted_matches[0]
```

---

## Decision Tree

```
Incoming Request
       │
       ▼
   ┌───────────────┐
   │ Extract       │
   │ Keywords/     │
   │ Patterns      │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │ Match Rules   │
   └───────┬───────┘
           │
           ▼
    ┌────────────┐
    │  Matches?  │
    └────┬───┬───┘
         │   │
    YES  │   │  NO
         │   │
         ▼   ▼
    ┌────────┐ ┌────────────┐
    │Rank &  │ │ Default    │
    │Resolve │ │ Routing    │
    └───┬────┘ └─────┬──────┘
        │            │
        └─────┬──────┘
              │
              ▼
      ┌───────────────┐
      │ Assign to     │
      │ Specialist    │
      └───────────────┘
```

---

## Examples

### Single Match

```markdown
Request: "Design the user interface for the checkout flow"

Routing Analysis:
- Keywords: "design", "user interface"
- Patterns: "design.*for"
- Matched Rules: design-ux (confidence: 1.0)
- Conflict: None

Assignment: ux-architect
Confidence: 100%
```

### Multiple Matches - Conflict Resolution

```markdown
Request: "Build a scalable API for the payment system"

Routing Analysis:
- Keywords: "build", "scalable", "api", "payment system"
- Matched Rules:
  - backend-architecture (confidence: 1.0) - "api", "scale"
  - devops (confidence: 0.6) - "build" (weak match)
- Conflict: backend-architecture vs devops

Resolution: 
- backend-architecture has higher confidence
- Request is about API design, not deployment

Assignment: backend-architect
Confidence: 100%
```

### Ambiguous - Requires Clarification

```markdown
Request: "Fix the performance issue"

Routing Analysis:
- Keywords: "performance", "fix"
- Matched Rules:
  - backend-architecture (confidence: 0.5) - could be backend
  - devops (confidence: 0.5) - could be infrastructure
  - ux-architect (confidence: 0.3) - could be frontend
- Conflict: Multiple with similar confidence

Resolution: Request clarification
- "Is this a backend API performance, frontend rendering, or infrastructure scaling issue?"

Assignment: request-clarification
Options: [backend-architect, devops, ux-architect]
```

---

## Anti-Patterns

### ❌ Keyword-Only Routing
Matching keywords without context leads to wrong assignments.

```python
# Bad: "api" matches both backend and devops
if "api" in request:
    route_to("backend-architect")  # Wrong if about API deployment
```

### ❌ Single-Specialist Default
Defaulting to one specialist for all ambiguous requests creates bottleneck.

```python
# Bad: Everything goes to generalist
if not matches:
    route_to("general-specialist")  # Bottleneck
```

### ❌ No Confidence Tracking
Routing without confidence scores prevents proper escalation.

```python
# Bad: No way to know if routing was uncertain
return match.agent  # No confidence, no transparency
```

---

## Configuration

```yaml
routing:
  confidence_threshold: 0.7
  ambiguity_threshold: 0.15  # if top 2 scores within this, ask
  default_agent: "orchestrator-for-clarification"
  track_routing_accuracy: true
  update_rules_from_feedback: true
```

---

## Integration Points

- **Orchestrator**: Primary consumer of routing decisions
- **Memory**: Logs routing history for learning
- **Evaluator**: Tracks if correct specialist was selected
- **Feedback Loop**: Updates rules based on routing accuracy

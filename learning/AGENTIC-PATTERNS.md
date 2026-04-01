# Agentic Design Patterns — Production Implementations

> **21 Core Patterns for AI Agent Systems** — With working code implementations

---

## Overview

These 21 patterns form the foundation for building intelligent agent workflows. They were synthesized from multiple sources including Anthropic's research, OpenAI's patterns, and practical experience.

**Implementation Source:** `kingdom-claw-core/patterns/agentic_patterns.py`

**Key Insight:** Apply these patterns by default for complex tasks. Reference this document BEFORE attempting complex work.

---

## Implementation Architecture

```
kingdom-claw-core/patterns/
├── agentic_patterns.py
│   ├── PromptChaining      # Pattern 1
│   ├── Router              # Pattern 2
│   ├── ParallelExecutor    # Pattern 3
│   ├── Reflector           # Pattern 4
│   ├── ToolRegistry        # Pattern 5
│   ├── Planner             # Pattern 6
│   ├── MultiAgentOrchestrator  # Pattern 7
│   ├── MemoryManager       # Pattern 8
│   ├── AdaptationEngine    # Pattern 9
│   └── RAGSystem           # Pattern 10
└── (Patterns 11-21 in future iterations)

---

## Pattern Categories

### Execution Patterns
1. Prompt Chaining
2. Routing
3. Parallelization
4. Reflection
5. Tool Use

### Planning Patterns
6. Planning
7. Goal Setting
8. Prioritization
9. Task Management
10. Exception Handling

### Coordination Patterns
11. Multi-Agent
12. A2A Communication
13. Human-in-the-Loop
14. Memory Management
15. Adaptation

### Knowledge Patterns
16. RAG
17. MCP
18. Reasoning (Chain-of-Thought)
19. Guardrails
20. Evaluation
21. Exploration

---

## 1. Prompt Chaining (Sequential Decomposition)

### What It Is

Break complex tasks into sequential steps, where each step's output becomes the next step's input.

### When to Use

- Task has clear sequential dependencies
- Each step can be verified
- Intermediate outputs are useful

### Implementation

```python
def prompt_chain(task: str, steps: list[str]):
    result = task
    for step in steps:
        result = agent.execute(f"{step}\nInput: {result}")
        if not verify(result):
            raise Exception(f"Step failed: {step}")
    return result
```

### Example

```
Task: "Write a blog post about AI"

Chain:
1. Research → [facts]
2. Outline → [structure]
3. Draft → [content]
4. Edit → [polished content]
5. Publish → [URL]
```

---

## 2. Routing (Dynamic Path Selection)

### What It Is

Dynamically select different execution paths based on input characteristics.

### When to Use

- Multiple specialized handlers exist
- Input type determines processing
- Want to optimize for specific cases

### Implementation

```python
def route(prompt: str) -> str:
    if "code" in prompt.lower():
        return "developer"
    elif "design" in prompt.lower():
        return "designer"
    elif "research" in prompt.lower():
        return "researcher"
    else:
        return "general"
```

### Example

```
Input: "Build a landing page"

Router:
├── Contains "build"? → developer agent
├── Contains "design"? → designer agent
├── Contains "research"? → researcher agent
└── Default → general purpose agent
```

---

## 3. Parallelization (Concurrent Execution)

### What It Is

Execute independent tasks concurrently to reduce total time.

### When to Use

- Tasks are independent
- No shared state mutations
- Order doesn't matter

### Implementation

```python
async def parallelize(tasks: list[Callable]):
    results = await asyncio.gather(*[
        task() for task in tasks
    ])
    return results
```

### Example

```
Task: "Analyze multiple documents"

Parallel:
├── Analyze doc1.pdf  ─┐
├── Analyze doc2.pdf  ─┼─→ [result1, result2, result3]
└── Analyze doc3.pdf  ─┘

Then: Synthesize results
```

---

## 4. Reflection (Self-Improvement Loops)

### What It Is

Agent evaluates its own output and iteratively improves it.

### When to Use

- Quality is critical
- Initial output may be imperfect
- Time allows for iteration

### Implementation

```python
def reflect(output: str, criteria: list[str]) -> str:
    for _ in range(max_iterations):
        evaluation = agent.evaluate(output, criteria)
        if evaluation.score > threshold:
            return output
        output = agent.improve(output, evaluation.feedback)
    return output
```

### Example

```
Task: "Write clear documentation"

Loop:
1. Generate documentation
2. Evaluate against criteria:
   - Clear structure?
   - Working examples?
   - Covers edge cases?
3. If fails, identify gaps
4. Regenerate with fixes
5. Repeat until pass
```

---

## 5. Tool Use (External Capabilities)

### What It Is

Agent invokes external tools to perform actions beyond its capabilities.

### When to Use

- Need to interact with external systems
- Action requires specific capabilities
- Data must be fetched or modified

### Implementation

```python
def use_tool(name: str, params: dict) -> Any:
    tool = registry.get(name)
    if not permission_gate.check(name):
        raise PermissionDenied()
    return tool.execute(params)
```

### Example

```
Task: "Read the config file"

Tool calls:
1. read(path="config.yaml") → [file contents]
2. parse_yaml(contents) → [config dict]
3. Return config
```

---

## 6. Planning (Strategic Task Management)

### What It Is

Create a detailed plan before execution, then follow the plan.

### When to Use

- Task is complex with many steps
- Dependencies matter
- Need to estimate effort

### Implementation

```python
def plan(task: str) -> list[Step]:
    plan = agent.create_plan(task)
    
    for step in plan:
        if not dependencies_met(step):
            resolve_dependencies(step)
        execute(step)
    
    return results
```

### Example

```
Task: "Deploy a new feature"

Plan:
1. [ ] Write tests
2. [ ] Implement feature
3. [ ] Run tests locally
4. [ ] Create PR
5. [ ] Get code review
6. [ ] Merge to main
7. [ ] Deploy to staging
8. [ ] Verify in staging
9. [ ] Deploy to production
```

---

## 7. Goal Setting (Objective Tracking)

### What It Is

Define clear, measurable goals and track progress toward them.

### When to Use

- Long-running tasks
- Need progress visibility
- Multiple success criteria

### Implementation

```python
class Goal:
    def __init__(self, description: str, criteria: list[Callable]):
        self.description = description
        self.criteria = criteria
        self.progress = 0
    
    def evaluate(self) -> float:
        passed = sum(c() for c in self.criteria)
        return passed / len(self.criteria)
```

---

## 8. Prioritization (Task Ranking)

### What It Is

Order tasks by importance and urgency.

### When to Use

- Multiple pending tasks
- Limited resources
- Deadlines exist

### Implementation

```python
def prioritize(tasks: list[Task]) -> list[Task]:
    return sorted(tasks, key=lambda t: (
        -t.priority,  # Higher priority first
        t.deadline    # Earlier deadline first
    ))
```

### Priority Matrix

```
                 URGENT           NOT URGENT
IMPORTANT     │ Do First    │   Schedule
NOT IMPORTANT │ Delegate    │   Eliminate
```

---

## 9. Task Management (Work Queue)

### What It Is

Maintain a queue of pending tasks with status tracking.

### When to Use

- More work than can be done immediately
- Need persistence across sessions
- Tasks have dependencies

### Implementation

```python
class TaskQueue:
    def __init__(self):
        self.pending = []
        self.in_progress = []
        self.completed = []
    
    def add(self, task: Task):
        self.pending.append(task)
    
    def next(self) -> Task:
        task = self.pending.pop(0)
        self.in_progress.append(task)
        return task
    
    def complete(self, task: Task):
        self.in_progress.remove(task)
        self.completed.append(task)
```

---

## 10. Exception Handling (Robust Recovery)

### What It Is

Gracefully handle errors and recover from failures.

### When to Use

- External dependencies may fail
- Operations can timeout
- Partial progress should be saved

### Implementation

```python
async def with_retry(fn: Callable, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            return await fn()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            await backoff(attempt)
```

---

## 11. Multi-Agent (Collaborative Systems)

### What It Is

Multiple specialized agents work together on complex tasks.

### When to Use

- Task requires multiple specializations
- Parallel work can be divided
- Need diverse perspectives

### Implementation

```python
class AgentTeam:
    def __init__(self):
        self.agents = {
            "orchestrator": OrchestratorAgent(),
            "developer": DeveloperAgent(),
            "designer": DesignerAgent(),
            "reviewer": ReviewerAgent(),
        }
    
    def execute(self, task: str):
        plan = self.agents["orchestrator"].plan(task)
        results = {}
        
        for step in plan:
            agent = self.agents[step.agent]
            results[step.id] = agent.execute(step)
        
        return self.agents["reviewer"].synthesize(results)
```

---

## 12. A2A Communication (Agent Networking)

### What It Is

Agents communicate directly with each other.

### When to Use

- Agents need to share context
- Coordination without central controller
- Peer-to-peer task delegation

### Implementation

```python
class AgentBus:
    def __init__(self):
        self.subscribers = defaultdict(list)
    
    def subscribe(self, event: str, handler: Callable):
        self.subscribers[event].append(handler)
    
    def publish(self, event: str, data: Any):
        for handler in self.subscribers[event]:
            handler(data)
```

---

## 13. Human-in-the-Loop (Collaboration Gates)

### What It Is

Require human approval at critical decision points.

### When to Use

- High-stakes decisions
- Uncertain agent judgment
- Regulatory requirements

### Implementation

```python
async def with_approval(action: str, risk: str):
    if risk == "high":
        approved = await request_human_approval(action)
        if not approved:
            raise ApprovalRequired(action)
    
    return execute(action)
```

---

## 14. Memory Management (State Persistence)

### What It Is

Store and retrieve information across sessions and tasks.

### When to Use

- Long-running projects
- Need to recall previous decisions
- Context exceeds token limits

### Implementation

```python
class Memory:
    def __init__(self, path: Path):
        self.path = path
    
    def store(self, key: str, value: Any):
        data = self.load_all()
        data[key] = value
        self.path.write_text(json.dumps(data))
    
    def retrieve(self, key: str) -> Any:
        return self.load_all().get(key)
```

---

## 15. Adaptation (Dynamic Improvement)

### What It Is

Agent adjusts behavior based on feedback and results.

### When to Use

- Performance varies
- Environment changes
- Learning from mistakes

### Implementation

```python
class AdaptiveAgent:
    def __init__(self):
        self.performance_history = []
    
    def adjust_strategy(self):
        recent = self.performance_history[-10:]
        success_rate = sum(r.success for r in recent) / len(recent)
        
        if success_rate < 0.5:
            self.strategy = "conservative"
        elif success_rate > 0.8:
            self.strategy = "aggressive"
```

---

## 16. RAG (Knowledge Retrieval)

### What It Is

Retrieve relevant information from a knowledge base before generation.

### When to Use

- Large document corpus
- Need specific information
- Reducing hallucination

### Implementation

```python
def rag(query: str, corpus: list[Document]):
    # Embed query
    query_embedding = embed(query)
    
    # Find similar documents
    similar = vector_search(query_embedding, corpus, k=5)
    
    # Generate with context
    return agent.generate(
        prompt=query,
        context="\n".join(doc.content for doc in similar)
    )
```

---

## 17. MCP (Standardized Interfaces)

### What It Is

Use standardized protocols for tool and resource integration.

### When to Use

- Integrating external tools
- Standardized API access
- Interoperability needed

### Implementation

```python
class MCPTool:
    def __init__(self, config: MCPConfig):
        self.connection = MCPConnection(config)
    
    def list_tools(self) -> list[Tool]:
        return self.connection.request("tools/list")
    
    def call_tool(self, name: str, params: dict):
        return self.connection.request("tools/call", {
            "name": name,
            "arguments": params
        })
```

---

## 18. Reasoning (Chain-of-Thought)

### What It Is

Break down reasoning explicitly before concluding.

### When to Use

- Complex logic
- Multi-step deduction
- Transparency required

### Implementation

```python
def reason(problem: str) -> str:
    return agent.generate(f"""
    Problem: {problem}
    
    Let's think step by step:
    1. First, identify the key components
    2. Then, analyze each component
    3. Next, consider relationships
    4. Finally, synthesize conclusions
    
    Reasoning:
    [explicit reasoning here]
    
    Answer:
    [final answer]
    """)
```

---

## 19. Guardrails (Safety Validation)

### What It Is

Validate outputs against safety constraints before returning.

### When to Use

- Security critical
- Regulatory compliance
- Preventing harmful outputs

### Implementation

```python
class Guardrails:
    def __init__(self, rules: list[Rule]):
        self.rules = rules
    
    def validate(self, output: str) -> tuple[bool, str]:
        for rule in self.rules:
            if not rule.check(output):
                return False, rule.violation_message
        return True, None
    
    def sanitize(self, output: str) -> str:
        for rule in self.rules:
            output = rule.apply(output)
        return output
```

---

## 20. Evaluation (Performance Tracking)

### What It Is

Measure and track agent performance over time.

### When to Use

- Production systems
- Continuous improvement
- Quality assurance

### Implementation

```python
class Evaluator:
    def __init__(self):
        self.metrics = defaultdict(list)
    
    def record(self, metric: str, value: float):
        self.metrics[metric].append({
            "value": value,
            "timestamp": datetime.now()
        })
    
    def report(self) -> dict:
        return {
            metric: {
                "mean": mean(values),
                "trend": trend(values)
            }
            for metric, values in self.metrics.items()
        }
```

---

## 21. Exploration (Autonomous Discovery)

### What It Is

Agent proactively explores to discover information.

### When to Use

- Unknown territory
- Need to find patterns
- Research tasks

### Implementation

```python
async def explore(domain: str, depth: int = 3):
    findings = []
    queue = [domain]
    
    while queue and len(findings) < depth * 10:
        current = queue.pop(0)
        discovered = await agent.probe(current)
        findings.extend(discovered)
        queue.extend(discovered.related)
    
    return synthesize(findings)
```

---

## Pattern Selection Guide

| Task Type | Recommended Patterns |
|-----------|---------------------|
| Simple query | Tool Use |
| Multi-step task | Planning + Prompt Chaining |
| Complex analysis | Reasoning + RAG + Reflection |
| Team project | Multi-Agent + A2A + Human-in-Loop |
| Production system | Guardrails + Evaluation + Exception Handling |
| Research | Exploration + RAG + Memory |
| Content creation | Prompt Chaining + Reflection + Evaluation |

---

## Applying to Kingdom Claw

| Pattern | Implementation |
|---------|---------------|
| Tool Use | `ToolRegistry` + `PermissionGate` |
| Routing | `PromptRouter` |
| Multi-Agent | `NemoClaw` agents |
| Memory | `MEMORY.md` + `agent-memory/` |
| Exception Handling | `PermissionGate` denials |
| Evaluation | Self-evolution engine |
| Planning | Workflow files |

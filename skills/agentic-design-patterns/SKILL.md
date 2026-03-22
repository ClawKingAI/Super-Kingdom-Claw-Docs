---
name: agentic-design-patterns
description: >
  Core operational patterns for building and executing intelligent agent workflows.
  These 21 patterns form the foundation for all complex task execution.
  Apply these patterns by default when: (1) Decomposing complex tasks, (2) Building multi-step workflows,
  (3) Orchestrating subagents, (4) Ensuring output quality, (5) Handling errors gracefully.
  Reference this skill BEFORE attempting complex work.
---

# Agentic Design Patterns — Operational Playbook

**Source:** "Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems" by Antonio Gulli
**Repository:** `/data/.openclaw/workspace/Agentic-Design-Patterns/`

## Quick Reference: When to Apply Each Pattern

| Situation | Pattern(s) to Use |
|-----------|-------------------|
| Task has clear sequential steps | Prompt Chaining |
| Request could go to different domains | Routing |
| Multiple independent subtasks | Parallelization |
| Output needs quality improvement | Reflection |
| Need external data/capabilities | Tool Use |
| Complex goal with unknowns | Planning |
| Multiple specialist roles needed | Multi-Agent |
| Need context from earlier in conversation | Memory Management |
| Agent should improve over time | Adaptation |
| Integrating external tools/servers | MCP |
| Working toward measurable objective | Goal Setting |
| Something might fail | Exception Handling |
| Human judgment needed | Human-in-the-Loop |
| Need to ground in external knowledge | RAG |
| Agents need to talk to each other | A2A Communication |
| Limited tokens/budget | Resource Optimization |
| Complex reasoning required | Reasoning Techniques |
| Safety/content validation needed | Guardrails |
| Measuring agent performance | Evaluation |
| Multiple competing tasks | Prioritization |
| Exploring unknown territory | Exploration |

---

## Part One: Core Patterns

### 1. Prompt Chaining
**Definition:** Sequential task decomposition where each step's output feeds into the next.

**When to Use:**
- Deterministic workflows where order matters
- Tasks that can be broken into clear, dependent steps
- When intermediate outputs need validation

**Implementation:**
```
Step 1: Extract information → output_1
Step 2: Transform output_1 → output_2
Step 3: Format output_2 → final_result
```

**Example:** Extract specs from text → Transform to JSON → Validate schema

**Code Pattern:**
```python
extraction_chain = prompt_extract | llm | StrOutputParser()
full_chain = (
    {"specifications": extraction_chain}
    | prompt_transform
    | llm
    | StrOutputParser()
)
```

---

### 2. Routing
**Definition:** Dynamic path selection based on input classification. A coordinator routes requests to specialist sub-agents.

**When to Use:**
- Multi-domain agents (e.g., booking vs info vs support)
- Requests that need different handling based on intent
- Reducing cognitive load on a single agent

**Implementation:**
1. Classifier determines intent/category
2. Router dispatches to appropriate handler
3. Handler executes specialist logic
4. Response aggregated back

**Code Pattern:**
```python
branches = {
    "booker": booking_handler,
    "info": info_handler,
    "unclear": clarification_handler,
}
delegation_branch = RunnableBranch(
    (lambda x: x['decision'] == 'booker', branches["booker"]),
    (lambda x: x['decision'] == 'info', branches["info"]),
    branches["unclear"]  # default
)
```

---

### 3. Parallelization
**Definition:** Concurrent processing of independent tasks. Run multiple sub-agents simultaneously and merge results.

**When to Use:**
- Tasks that don't depend on each other's outputs
- When speed matters more than ordering
- Gathering multiple perspectives on same input

**Implementation:**
```
        ┌── Agent A ──┐
Input ──┼── Agent B ──┼── Merge → Output
        └── Agent C ──┘
```

**Key Consideration:** Only parallelize when tasks are truly independent. Dependencies require sequential chaining.

---

### 4. Reflection
**Definition:** Self-improvement through iterative critique. Generate → Reflect → Refine loop.

**When to Use:**
- Quality-critical outputs (code, content, decisions)
- Complex tasks where first attempt may be imperfect
- When you have time for multiple iterations

**Implementation:**
```
For iteration in 1..max_iterations:
    1. GENERATE: Produce output
    2. REFLECT: Critique output against requirements
    3. CHECK: If "PERFECT" or max reached, stop
    4. REFINE: Apply critiques to next generation
```

**Stopping Conditions:**
- Explicit "CODE_IS_PERFECT" signal
- Max iterations reached
- Diminishing returns detected

**Code Pattern:**
```python
for i in range(max_iterations):
    response = llm.invoke(message_history)
    critique = llm.invoke(reflector_prompt)
    if "CODE_IS_PERFECT" in critique:
        break
    message_history.append(HumanMessage(content=f"Critique: {critique}"))
```

---

### 5. Tool Use
**Definition:** External capability integration. Agents call APIs, search, execute code.

**When to Use:**
- Need real-time data (search, APIs)
- Need to perform actions (send email, write file)
- Need computation (execute code, calculate)

**Tool Categories:**
- **Search Tools:** Google Search, Vertex AI Search
- **Code Execution:** Python REPL, shell commands
- **API Tools:** Calendar, email, database
- **File Tools:** Read, write, search filesystem

**Best Practices:**
- Define clear tool schemas
- Handle tool errors gracefully
- Validate tool outputs before using

---

### 6. Planning
**Definition:** Strategic task management. Agent decomposes complex goals into executable steps.

**When to Use:**
- Complex goals with unknowns
- Multi-step research tasks
- When you need to think before acting

**Implementation:**
1. Analyze goal and constraints
2. Generate plan with ordered steps
3. Execute steps sequentially or in parallel
4. Monitor progress and replan if needed

**Example:** Deep Research API — decompose research question into search queries, synthesize findings.

---

### 7. Multi-Agent
**Definition:** Collaborative systems with multiple specialist agents working together.

**Patterns:**
- **Sequential:** Agent A → Agent B → Agent C
- **Parallel:** Multiple agents working simultaneously
- **Coordinator-Worker:** Router delegates to specialists
- **Loop:** Agents iterate on each other's outputs

**When to Use:**
- Tasks requiring multiple expertise areas
- Research → Writing → Review pipelines
- Complex workflows with handoffs

**Code Pattern (CrewAI):**
```python
researcher = Agent(role='Research Analyst', goal='Find trends', ...)
writer = Agent(role='Content Writer', goal='Write article', ...)
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task], process=Process.sequential)
```

---

## Part Two: Advanced Patterns

### 8. Memory Management
**Definition:** State persistence across conversations and sessions.

**Types:**
- **ConversationBufferMemory:** Full conversation history
- **SummaryMemory:** Compressed history
- **VectorStoreMemory:** Semantic search over past interactions
- **EntityMemory:** Track specific entities (users, projects)

**When to Use:**
- Long-running conversations
- Multi-session work
- Need to recall earlier context

**Implementation:**
```python
store = InMemoryStore(index={"embed": embed_fn, "dims": 384})
store.put(namespace, key, {"data": value})
item = store.get(namespace, key)
results = store.search(namespace, query="relevant memory")
```

---

### 9. Learning and Adaptation
**Definition:** Dynamic improvement through feedback. Agents that improve their own prompts/instructions.

**When to Use:**
- Long-running agents that should get better over time
- Personalized agent behavior
- Continuous improvement scenarios

**Implementation:**
1. Store current instructions/behavior
2. Collect outcomes and feedback
3. Generate improved instructions
4. Update stored behavior

---

### 10. Model Context Protocol (MCP)
**Definition:** Standardized interfaces for agent-tool communication.

**When to Use:**
- Integrating external tool servers
- Building reusable tool libraries
- Cross-framework tool sharing

**Components:**
- **FastMCP Server:** Exposes tools via protocol
- **MCP Client:** Agent that connects to servers
- **Tool Schema:** Defines inputs/outputs

---

### 11. Goal Setting and Monitoring
**Definition:** Objective tracking with progress evaluation.

**When to Use:**
- Working toward measurable objectives
- Long-running tasks with checkpoints
- Need to know if on track

**Implementation:**
1. Define clear goal and success criteria
2. Break into milestones
3. Execute with progress tracking
4. Evaluate against criteria at each step

---

## Part Three: Production Patterns

### 12. Exception Handling and Recovery
**Definition:** Robust error management with fallback chains.

**Patterns:**
- **Fallback Chain:** Try A, if fails try B, if fails try C
- **Retry with Backoff:** Exponential backoff for transient errors
- **Graceful Degradation:** Return partial results if full fails

**When to Use:**
- API calls that might fail
- External dependencies
- User-facing operations

**Implementation:**
```python
try:
    result = primary_handler(request)
except Exception:
    try:
        result = fallback_handler(request)
    except Exception:
        result = graceful_degradation(request)
```

---

### 13. Human-in-the-Loop
**Definition:** Human-AI collaboration with approval gates.

**When to Use:**
- High-stakes decisions
- Creative work requiring human judgment
- Actions that need human approval

**Patterns:**
- **Approval Gate:** Pause for human approval before action
- **Review Loop:** Human reviews AI output, provides feedback
- **Escalation:** AI hands off to human when uncertain

---

### 14. Knowledge Retrieval (RAG)
**Definition:** Information access patterns for grounding responses.

**When to Use:**
- Need current information beyond training
- Domain-specific knowledge
- Reducing hallucinations

**Components:**
- **Retriever:** Find relevant documents
- **Reranker:** Order by relevance
- **Generator:** LLM produces answer from context

---

## Part Four: Enterprise Patterns

### 15. Inter-Agent Communication (A2A)
**Definition:** Agent networking with capability discovery.

**Components:**
- **AgentCard:** Declares capabilities, skills, endpoints
- **Protocol:** Standard message format
- **Discovery:** Find agents by capability

**When to Use:**
- Multiple agents need to collaborate
- Dynamic agent networks
- Service-oriented agent architectures

---

### 16. Resource-Aware Optimization
**Definition:** Efficient resource usage with cost tracking.

**Considerations:**
- Token budgets
- API rate limits
- Parallel execution costs vs benefits
- Caching strategies

**When to Use:**
- High-volume agent operations
- Cost-sensitive applications
- Limited resource environments

---

### 17. Reasoning Techniques
**Definition:** Advanced decision-making with explicit thinking.

**Patterns:**
- **Chain-of-Thought:** Explicit step-by-step reasoning
- **Self-Correction:** Check own work and fix errors
- **Code Execution:** Use Python for math/logic

**When to Use:**
- Complex analytical tasks
- Multi-step reasoning problems
- When accuracy is critical

**Implementation:**
```
Thought 1: Analyze query
Thought 2: Formulate search queries
Thought 3: Simulate information retrieval
Thought 4: Synthesize information
Thought 5: Review and refine
Final Answer: [output]
```

---

### 18. Guardrails/Safety Patterns
**Definition:** Risk mitigation through validation.

**Types:**
- **Input Guardrails:** Validate/filter user input
- **Output Guardrails:** Validate AI output before delivery
- **LLM-as-Judge:** Use LLM to evaluate content policy

**When to Use:**
- User-facing content generation
- Processing untrusted input
- Compliance requirements

**Code Pattern:**
```python
def validate_output(output):
    evaluation = policy_enforcer.invoke({"input": output})
    if evaluation.compliance_status == "non-compliant":
        return False, evaluation.triggered_policies
    return True, None
```

---

### 19. Evaluation and Monitoring
**Definition:** Performance tracking and quality assessment.

**Patterns:**
- **LLM-as-Judge:** Use LLM to evaluate response quality
- **Metric Tracking:** Track latency, cost, success rate
- **Human Feedback:** Collect user ratings

**When to Use:**
- Production agent deployment
- Continuous improvement
- A/B testing agent behaviors

---

### 20. Prioritization
**Definition:** Task ranking when multiple competing tasks exist.

**When to Use:**
- Multiple pending tasks
- Limited resources
- Time-sensitive operations

**Implementation:**
1. List all pending tasks
2. Score by urgency, importance, dependencies
3. Execute in priority order
4. Re-prioritize as new tasks arrive

---

### 21. Exploration and Discovery
**Definition:** Autonomous learning and information gathering.

**When to Use:**
- Research tasks
- Unknown territory
- Building knowledge base

**Patterns:**
- **Curiosity-driven:** Explore what seems interesting
- **Goal-directed:** Explore toward specific objective
- **Diversity-seeking:** Explore varied areas

---

## Operational Checklist

Before starting any complex task, ask:

1. **Decomposition:** Can this be broken into steps? → Use Prompt Chaining
2. **Routing:** Does this need different handling based on type? → Use Routing
3. **Independence:** Are there parallelizable subtasks? → Use Parallelization
4. **Quality:** Does output need refinement? → Use Reflection
5. **Capabilities:** Do I need external tools/data? → Use Tool Use
6. **Complexity:** Is this a complex goal? → Use Planning
7. **Specialists:** Would multiple agents help? → Use Multi-Agent
8. **Context:** Do I need past conversation? → Use Memory Management
9. **Safety:** Should I validate before acting? → Use Guardrails
10. **Recovery:** What if this fails? → Use Exception Handling

---

## File References

- **Full Repository:** `/data/.openclaw/workspace/Agentic-Design-Patterns/`
- **Book PDF:** `/data/.openclaw/workspace/Agentic-Design-Patterns/Agentic_Design_Patterns_Complete.pdf`
- **Code Notebooks:** `/data/.openclaw/workspace/Agentic-Design-Patterns/chapter_notebooks/`
- **Memory Summary:** `/data/.openclaw/workspace/memory/2026-03-22.md`

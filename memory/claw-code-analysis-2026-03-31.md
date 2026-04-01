# Claw Code — Comprehensive Analysis for Kingdom Claw

## What Claw Code Is

**Claw Code** is a clean-room Python port of Claude Code's agent harness architecture, created by Sigrid Jin (@instructkr) after the original TypeScript source was leaked on March 31, 2026.

This is NOT copied code — it's a **reimplementation** that captures the architectural patterns without copying proprietary source. Think of it as "the recipe, not the dish."

---

## Why This Matters for Kingdom Claw

This gives us a **production-grade blueprint** for how a top-tier AI agent harness is structured. We can learn from it without reinventing the wheel.

---

## What I Can Learn From This

### 1. ARCHITECTURE PATTERNS

#### The Command/Tool Dual System

**Commands** (207 entries) — User-facing CLI operations:
- `add-dir` — Add directory to context
- `agents` — Manage subagents
- `compact` — Compress memory/context
- `config` — Configuration management
- `doctor` — System diagnostics
- `init` — Project initialization
- `memory` — Memory operations
- `permissions` — Permission management
- `plan` — Planning mode
- `status` — Status display
- `vim` — Vim keybindings

**Tools** (184 entries) — Agent-invoked operations:
- `AgentTool` — Subagent spawning
- `BashTool` — Shell execution
- `FileReadTool` — File operations
- `MemoryTool` — Memory management
- `SearchTool` — Codebase search
- `WebFetchTool` — Web content
- `ImageTool` — Image analysis
- `McpTool` — Model Context Protocol

**Key Insight:** Commands are what users type. Tools are what agents invoke. They're separate registries with different permission models.

---

### 2. PERMISSION GATING SYSTEM

From `src/permissions.py`:

```python
@dataclass(frozen=True)
class ToolPermissionContext:
    deny_names: frozenset[str]  # Exact tool names to block
    deny_prefixes: tuple[str, ...]  # Prefixes to block (e.g., "bash")
    
    def blocks(self, tool_name: str) -> bool:
        lowered = tool_name.lower()
        return lowered in self.deny_names or any(
            lowered.startswith(prefix) for prefix in self.deny_prefixes
        )
```

**What we learn:**
- Permissions are checked at tool invocation time
- Can block by exact name OR by prefix
- Destructive operations (bash) are explicitly gated
- Permission denials are tracked and logged

**How to apply:**
- Implement similar `ToolPermissionContext` in Kingdom Claw
- Block `pkill`, `killall`, `rm -rf` by default
- Add user-configurable allowlists
- Log all permission denials for audit

---

### 3. SESSION MANAGEMENT

From `src/session_store.py`:

```python
@dataclass(frozen=True)
class StoredSession:
    session_id: str
    messages: tuple[str, ...]
    input_tokens: int
    output_tokens: int
```

**What we learn:**
- Sessions are persisted as JSON files
- Token counts are tracked for cost/limits
- Messages are stored as a tuple (immutable)
- Sessions can be loaded and resumed

**How to apply:**
- Our agent-memory system should persist sessions similarly
- Track token usage per session
- Support session resumption for long-running tasks
- Store sessions in `.port_sessions/` or similar

---

### 4. QUERY ENGINE / TURN MANAGEMENT

From `src/query_engine.py`:

```python
@dataclass(frozen=True)
class QueryEngineConfig:
    max_turns: int = 8
    max_budget_tokens: int = 2000
    compact_after_turns: int = 12
    structured_output: bool = False
```

**What we learn:**
- Turn loops have configurable limits
- Budget is tracked in tokens
- Context compaction happens after N turns
- Structured output mode for JSON responses

**How to apply:**
- Implement turn limits to prevent infinite loops
- Add token budget tracking
- Auto-compact context after threshold
- Support structured output for tool calls

---

### 5. ROUTING SYSTEM

From `src/runtime.py`:

```python
def route_prompt(self, prompt: str, limit: int = 5) -> list[RoutedMatch]:
    tokens = {token.lower() for token in prompt.replace('/', ' ').replace('-', ' ').split() if token}
    
    by_kind = {
        'command': self._collect_matches(tokens, PORTED_COMMANDS, 'command'),
        'tool': self._collect_matches(tokens, PORTED_TOOLS, 'tool'),
    }
    # ... scoring and selection logic
```

**What we learn:**
- Prompts are tokenized for matching
- Commands and tools are searched separately
- Scoring based on token overlap
- Top N matches are selected

**How to apply:**
- Implement similar prompt → tool routing
- Score matches by relevance
- Return multiple candidates for disambiguation
- Log routing decisions for debugging

---

### 6. SUBAGENT SYSTEM (AgentTool)

From `src/reference_data/tools_snapshot.json`:

The `AgentTool` has these components:
- `forkSubagent` — Create new subagent
- `resumeAgent` — Resume paused agent
- `runAgent` — Execute agent
- `agentMemory` — Agent memory management
- `agentMemorySnapshot` — Memory snapshots
- `builtInAgents` — Predefined agent types

**Built-in agents:**
- `claudeCodeGuideAgent` — Guide/assistant
- `exploreAgent` — Codebase exploration
- `generalPurposeAgent` — Generic tasks
- `planAgent` — Planning
- `verificationAgent` — Testing/verification

**What we learn:**
- Subagents have specific roles
- Memory is snapshottable
- Agents can be forked, resumed, paused
- Built-in agents cover common patterns

**How to apply:**
- Our NemoClaw agents should follow similar patterns
- Implement agent forking for parallel work
- Add agent memory snapshots
- Define role-specific agents (developer, researcher, etc.)

---

### 7. SKILLS SYSTEM

From `src/reference_data/subsystems/skills.json`:

**20 skill modules:**
- `batch` — Batch operations
- `claudeApi` — Claude API integration
- `debug` — Debugging utilities
- `keybindings` — Keyboard shortcuts
- `loop` — Loop/repetition handling
- `remember` — Memory persistence
- `simplify` — Response simplification
- `verify` — Verification utilities
- `skillify` — Skill creation

**What we learn:**
- Skills are modular capabilities
- Skills can be bundled or custom
- Skills are loaded from directories
- Skills can be MCP-based

**How to apply:**
- Our skill system aligns with this pattern
- Keep skills modular and loadable
- Support bundled skills (built-in) + custom skills
- Consider MCP integration

---

### 8. STREAMING ARCHITECTURE

From `src/query_engine.py`:

```python
def stream_submit_message(self, prompt: str, ...):
    yield {'type': 'message_start', 'session_id': self.session_id, 'prompt': prompt}
    if matched_commands:
        yield {'type': 'command_match', 'commands': matched_commands}
    if matched_tools:
        yield {'type': 'tool_match', 'tools': matched_tools}
    if denied_tools:
        yield {'type': 'permission_denial', 'denials': [...]}
    result = self.submit_message(...)
    yield {'type': 'message_delta', 'text': result.output}
    yield {'type': 'message_stop', 'usage': {...}, 'stop_reason': ...}
```

**What we learn:**
- Events are yielded as a stream
- Each step emits a typed event
- Usage is reported at the end
- Permission denials are streamed

**How to apply:**
- Implement event streaming for long operations
- Emit typed events (start, delta, stop, error)
- Report usage/cost at completion
- Stream permission decisions

---

### 9. CONTEXT MANAGEMENT

From `src/context.py`:

```python
@dataclass(frozen=True)
class PortContext:
    source_root: Path
    tests_root: Path
    assets_root: Path
    archive_root: Path
    python_file_count: int
    test_file_count: int
    asset_file_count: int
    archive_available: bool
```

**What we learn:**
- Context is passed as an immutable object
- Context includes workspace structure
- File counts are pre-computed
- Paths are resolved at build time

**How to apply:**
- Use immutable context objects
- Pre-compute expensive metadata
- Pass context through the call chain
- Support multiple workspace types

---

### 10. EXECUTION REGISTRY

From `src/execution_registry.py`:

```python
@dataclass(frozen=True)
class ExecutionRegistry:
    commands: tuple[MirroredCommand, ...]
    tools: tuple[MirroredTool, ...]
    
    def command(self, name: str) -> MirroredCommand | None:
        # Lookup by name
        
    def tool(self, name: str) -> MirroredTool | None:
        # Lookup by name
```

**What we learn:**
- Commands and tools are registered at startup
- Registry provides lookup by name
- Execution returns a message/handled flag

**How to apply:**
- Implement a unified registry pattern
- Support dynamic registration
- Add metadata to each entry (source, permissions, etc.)
- Log all registry lookups

---

## How We Can Use This

### Immediate Applications

1. **Architecture Audit**
   - Compare our NemoClaw structure to Claw Code
   - Identify gaps in our tool/command coverage
   - Document our architecture similarly

2. **Permission System**
   - Implement `ToolPermissionContext` pattern
   - Add prefix-based blocking
   - Log all permission denials

3. **Session Persistence**
   - Add session store with JSON persistence
   - Track token usage per session
   - Support session resumption

4. **Routing System**
   - Implement prompt → tool routing
   - Score matches by relevance
   - Support disambiguation

5. **Streaming Events**
   - Add event streaming for long operations
   - Emit typed events (start, delta, stop)
   - Report usage at completion

### Medium-Term Applications

1. **Subagent System**
   - Implement agent forking
   - Add agent memory snapshots
   - Define role-specific agents

2. **Skills System**
   - Align our skill structure with Claw Code patterns
   - Support bundled + custom skills
   - Add MCP skill builders

3. **Context Compaction**
   - Implement auto-compaction after N turns
   - Track context size
   - Support manual compaction

### Long-Term Applications

1. **Full Harness Implementation**
   - Build a production-grade agent harness
   - Support all command/tool patterns
   - Integrate with multiple model providers

2. **Plugin System**
   - Add plugin architecture
   - Support dynamic loading
   - Add plugin permissions

---

## Key Files to Study Further

| Priority | File | Purpose |
|----------|------|---------|
| HIGH | `src/runtime.py` | Core orchestrator |
| HIGH | `src/query_engine.py` | Turn management |
| HIGH | `src/permissions.py` | Permission gating |
| HIGH | `src/tools.py` | Tool registry |
| MEDIUM | `src/commands.py` | Command registry |
| MEDIUM | `src/session_store.py` | Session persistence |
| MEDIUM | `src/execution_registry.py` | Execution routing |
| LOW | `src/context.py` | Context passing |

---

## Action Items

1. [ ] Implement `ToolPermissionContext` in Kingdom Claw
2. [ ] Add session persistence with token tracking
3. [ ] Implement prompt routing with scoring
4. [ ] Add streaming events for long operations
5. [ ] Document our architecture similarly
6. [ ] Compare NemoClaw structure to Claw Code
7. [ ] Add context compaction logic
8. [ ] Implement agent forking for parallel work

---

## Summary

Claw Code is a **goldmine of architectural patterns** for building production agent harnesses. The key lessons are:

1. **Separate commands (user) from tools (agent)** — different permission models
2. **Gate destructive operations** — prefix-based blocking
3. **Persist sessions** — token tracking, resumable
4. **Stream events** — typed events for observability
5. **Route prompts** — score matches, disambiguate
6. **Compact context** — prevent unbounded growth
7. **Fork subagents** — parallel work, role-specific
8. **Use immutable context** — pass through call chain

We should systematically incorporate these patterns into Kingdom Claw.

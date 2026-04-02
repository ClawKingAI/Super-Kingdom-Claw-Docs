# Learning — Claw Code Analysis

> **What We Learned from Claude Code's Architecture** — Extracting patterns from the source

---

## Background

On March 31, 2026, Sigrid Jin (@instructkr) created a clean-room Python port of Claude Code after the original TypeScript source was exposed. This repository, called **Claw Code**, provided unprecedented insight into how Anthropic builds their agent harness.

We analyzed Claw Code to extract architectural patterns that could be applied to Kingdom Claw.

---

## What Claw Code Revealed

### Repository Stats

| Metric | Value |
|--------|-------|
| Python files | 66 |
| Command entries | 207 |
| Tool entries | 184 |
| Subsystems | 29 |
| Total modules | 391+ |

### Core Discoveries

1. **Command/Tool Dual System**
2. **Permission Gating Architecture**
3. **Session Persistence Model**
4. **Event Streaming Pattern**
5. **Prompt Routing Mechanism**
6. **Context Management Approach**
7. **Subagent Spawning System**
8. **Skills Organization**

---

## Pattern 1: Command/Tool Dual System

### Discovery

Claude Code maintains **separate registries** for commands and tools:

- **Commands** — User-facing CLI operations (207 entries)
- **Tools** — Agent-invoked operations (184 entries)

### Why This Matters

Commands are **trusted** (a human typed them). Tools are **gated** (an agent decided to invoke them).

This separation enables:
- Different permission models
- Separate audit trails
- Independent evolution
- Clear responsibility boundaries

### Implementation

```python
# Command Registry - User-facing
class CommandRegistry:
    def register(self, entry: CommandEntry):
        self._entries[entry.name] = entry
    
    def execute(self, name: str, *args):
        return self._entries[name].handler(*args)

# Tool Registry - Agent-facing
class ToolRegistry:
    def register(self, entry: ToolEntry):
        self._entries[entry.name] = entry
    
    def execute(self, name: str, payload: dict):
        # Check permissions first
        if not self._check_permission(name):
            raise PermissionDenied(name)
        return self._entries[name].handler(payload)
```

### Applied to Kingdom Claw

Our `kingdom-claw-core` implements this exact pattern with `CommandRegistry` and `ToolRegistry` classes.

---

## Pattern 2: Permission Gating

### Discovery

Tools have **permission levels**:
- `normal` — Always allowed
- `elevated` — Requires confirmation
- `dangerous` — Explicit allowlist only

Permission checking uses both **exact names** and **prefixes**.

### Default Blocked Patterns

```python
DEFAULT_DENY_PREFIXES = [
    "pkill",
    "killall", 
    "kill -9",
    "rm -rf",
    "dd if=",
    "mkfs",
    "format",
]
```

### Why This Matters

This prevents agents from accidentally:
- Killing system processes
- Deleting important files
- Corrupting disks

### Implementation

```python
class PermissionGate:
    def check(self, tool_name: str, command: str) -> tuple[bool, str]:
        # Check prefix blocking
        for prefix in self.DEFAULT_DENY_PREFIXES:
            if prefix in command.lower():
                return False, f"Blocked pattern: {prefix}"
        
        return True, None
```

### Applied to Kingdom Claw

Our `PermissionGate` class implements prefix-based blocking with audit logging.

---

## Pattern 3: Session Persistence

### Discovery

Sessions are stored as JSON files with:
- Message history
- Token counts
- Session ID
- Timestamps

### Session Structure

```json
{
  "session_id": "abc123",
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi!"}
  ],
  "input_tokens": 50,
  "output_tokens": 100
}
```

### Why This Matters

- Conversations survive restarts
- Token usage is tracked for limits
- Sessions can be analyzed later

### Auto-Compaction

Sessions auto-compact when they get large:
```python
def compact_messages_if_needed(self):
    if len(self.messages) > self.config.compact_after_turns:
        self.messages = self.messages[-self.config.compact_after_turns:]
```

### Applied to Kingdom Claw

Our `SessionStore` and `SessionManager` implement JSON persistence with auto-compaction.

---

## Pattern 4: Event Streaming

### Discovery

Operations emit **typed events**:
- `message_start`
- `message_delta`
- `message_stop`
- `tool_call`
- `tool_result`
- `permission_denial`

### Event Flow

```python
yield {'type': 'message_start', 'session_id': '...'}
yield {'type': 'tool_match', 'tools': ['read', 'write']}
yield {'type': 'message_delta', 'text': 'Reading file...'}
yield {'type': 'message_stop', 'usage': {...}}
```

### Why This Matters

- Observable execution
- Debug friendly
- Stream to UI
- Export to logs

### Applied to Kingdom Claw

Our `EventEmitter` class implements typed event streaming with JSONL export.

---

## Pattern 5: Prompt Routing

### Discovery

User input is **tokenized and scored** against command/tool names.

### Tokenization

```python
def tokenize(prompt: str) -> set[str]:
    # Remove stop words
    STOP_WORDS = {"a", "an", "the", "is", "are", ...}
    
    # Split and normalize
    tokens = prompt.lower().split()
    return {t for t in tokens if t not in STOP_WORDS}
```

### Scoring

```python
def score(tokens: set[str], entry: Entry) -> int:
    score = 0
    for token in tokens:
        if token in entry.name:
            score += 10
        if token in entry.description:
            score += 5
        if entry.name.startswith(token):
            score += 15
    return score
```

### Applied to Kingdom Claw

Our `PromptRouter` implements tokenization with stop word removal and relevance scoring.

---

## Pattern 6: Context Management

### Discovery

Context is an **immutable object** passed through the call chain.

### Context Structure

```python
@dataclass(frozen=True)
class PortContext:
    source_root: Path
    tests_root: Path
    assets_root: Path
    python_file_count: int
    archive_available: bool
```

### Why This Matters

- No unexpected mutations
- Thread-safe
- Clear data flow
- Easy to test

### Applied to Kingdom Claw

Our `AgentContext` uses frozen dataclasses with builder pattern.

---

## Pattern 7: Subagent Spawning

### Discovery

The `AgentTool` has components for:
- `forkSubagent` — Create new agent
- `resumeAgent` — Resume paused agent
- `agentMemory` — Memory management

### Built-in Agents

- `exploreAgent` — Codebase exploration
- `planAgent` — Planning
- `verificationAgent` — Testing
- `generalPurposeAgent` — Generic tasks

### Applied to Kingdom Claw

Our NemoClaw agents follow similar patterns with role-specific agents.

---

## Pattern 8: Skills Organization

### Discovery

Skills are modular with:
- Bundled skills (built-in)
- Custom skills (user-defined)
- MCP skills (external)

### Skill Structure

```
skills/
├── bundled/
│   ├── batch.ts
│   ├── debug.ts
│   ├── remember.ts
│   └── verify.ts
└── loadSkillsDir.ts
```

### Applied to Kingdom Claw

Our skill system mirrors this with bundled + custom skills.

---

## Architectural Insights

### Layer Separation

```
┌─────────────────────────────────────┐
│  USER INTERFACE (Channels)          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  APPLICATION LAYER (Gateway)        │
│  • Session Management                │
│  • Permission Checking               │
│  • Event Streaming                   │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  DOMAIN LAYER (Core Runtime)        │
│  • Command/Tool Registries           │
│  • Prompt Routing                    │
│  • Context Management                │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  INFRASTRUCTURE (Model Providers)   │
│  • NVIDIA / OpenAI / Anthropic       │
└─────────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns** — Each layer has clear responsibility
2. **Immutable Context** — Data doesn't change unexpectedly
3. **Observable Execution** — Every operation emits events
4. **Permission First** — Safety checks before execution
5. **Graceful Degradation** — Fallbacks for failures

---

## What We Built

Based on Claw Code analysis, Kingdom Claw Core implements:

| Pattern | Status |
|---------|--------|
| Command/Tool Registry | ✅ Implemented |
| Permission Gate | ✅ Implemented |
| Session Store | ✅ Implemented |
| Event Emitter | ✅ Implemented |
| Prompt Router | ✅ Implemented |
| Context Builder | ✅ Implemented |
| Runtime Config | ✅ Implemented |

---

## Source Files Analyzed

| File | Lines | Key Learning |
|------|-------|--------------|
| `src/runtime.py` | 303 | Core orchestrator |
| `src/tools.py` | 186 | Tool registry pattern |
| `src/commands.py` | 186 | Command registry pattern |
| `src/permissions.py` | 240 | Permission gating |
| `src/session_store.py` | 260 | Session persistence |
| `src/query_engine.py` | 337 | Turn management |
| `src/streaming/__init__.py` | 337 | Event emission |
| `src/routing/__init__.py` | 238 | Prompt routing |
| `src/context.py` | 250 | Immutable context |

---

## Further Reading

- [Agentic Design Patterns](AGENTIC-PATTERNS.md)
- [Harness Engineering](HARNESS-ENGINEERING.md)
- [Self-Evolution](SELF-EVOLUTION.md)

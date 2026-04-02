# Kingdom Claw Core — Runtime

> **How the Agent Actually Runs** — The execution engine that powers Kingdom Claw

---

## Overview

Kingdom Claw Core is a **production-grade agent harness** that implements patterns extracted from Claude Code's architecture. It provides:

- **Command/Tool Registry** — Separate user and agent operation registries
- **Permission Gate** — Block dangerous operations with audit logging
- **Session Store** — Persist conversations with token tracking
- **Event Emitter** — Stream typed events for observability
- **Prompt Router** — Match input to handlers by relevance
- **Context Manager** — Immutable workspace state

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  KINGDOM CLAW RUNTIME                         │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  COMMAND     │  │    TOOL      │  │  EXECUTION   │       │
│  │  REGISTRY    │  │  REGISTRY    │  │  REGISTRY    │       │
│  │              │  │              │  │              │       │
│  │ User-facing  │  │ Agent-facing │  │ Unified      │       │
│  │ operations   │  │ operations   │  │ lookup       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ PERMISSION   │  │   SESSION    │  │    EVENT     │       │
│  │    GATE      │  │   MANAGER    │  │   EMITTER    │       │
│  │              │  │              │  │              │       │
│  │ Block ops    │  │ Persist      │  │ Stream       │       │
│  │ Audit logs   │  │ Track tokens │  │ Observe      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   PROMPT     │  │   CONTEXT    │  │   RUNTIME    │       │
│  │   ROUTER     │  │   BUILDER    │  │   CONFIG     │       │
│  │              │  │              │  │              │       │
│  │ Score match  │  │ Workspace    │  │ Limits       │       │
│  │ Route input  │  │ Immutable    │  │ Thresholds   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Registry System

#### Command Registry

Commands are **user-facing operations**. They're triggered by direct user input and are generally trusted.

```python
@dataclass
class CommandEntry:
    name: str
    description: str
    source_hint: str
    handler: Callable
    aliases: tuple[str, ...]
    requires_confirm: bool
    category: str
```

**Example Commands:**
- `status` — Show session status
- `help` — Display help
- `clear` — Clear context
- `commit` — Commit changes
- `deploy` — Deploy to production

**Usage:**
```python
# Register a command
registry.commands.register(CommandEntry(
    name="status",
    description="Show session status",
    source_hint="builtin",
    handler=lambda: get_status()
))

# Execute a command
result = registry.commands.execute("status")
```

#### Tool Registry

Tools are **agent-invoked operations**. They require permission checking and have different security levels.

```python
@dataclass
class ToolEntry:
    name: str
    description: str
    source_hint: str
    handler: Callable
    permission_level: str  # "normal", "elevated", "dangerous"
    is_mcp: bool
    deny_by_default: bool
```

**Permission Levels:**

| Level | Behavior | Examples |
|-------|----------|----------|
| `normal` | Always allowed | `read`, `web_search`, `memory_get` |
| `elevated` | Requires confirmation | `write`, `edit`, `exec`, `browser` |
| `dangerous` | Explicit allowlist only | `exec` with `rm -rf`, `pkill` |

**Usage:**
```python
# Register a tool
registry.tools.register(ToolEntry(
    name="read",
    description="Read file contents",
    source_hint="builtin",
    permission_level="normal"
))

# Check and execute
allowed, denial = gate.check("read")
if allowed:
    result = registry.tools.execute("read", path="config.yaml")
```

---

### 2. Permission Gate

The permission gate blocks dangerous operations and logs all decisions.

#### Permission Context

```python
@dataclass
class PermissionContext:
    deny_names: set[str]       # Exact tool names to block
    deny_prefixes: tuple[str, ...]  # Prefixes to block
    allow_names: set[str]      # Explicitly allowed (override deny)
    allow_prefixes: tuple[str, ...]
    min_permission_level: PermissionLevel
```

#### Default Blocked Patterns

```python
DEFAULT_DENY_PREFIXES = [
    "pkill",
    "killall", 
    "kill -9",
    "rm -rf",
    "dd if=",
    "mkfs",
    "format",
    "> /dev/",
    "chmod 777",
    "chown root",
]
```

#### Permission Checking

```python
def check(self, tool_name: str, level: PermissionLevel) -> tuple[bool, PermissionDenial]:
    # 1. Check explicit allow (overrides deny)
    if tool_name in self.allow_names:
        return True, None
    
    # 2. Check permission level threshold
    if level == PermissionLevel.DANGEROUS:
        if tool_name not in self.allow_names:
            return False, PermissionDenial(...)
    
    # 3. Check deny by name
    if tool_name in self.deny_names:
        return False, PermissionDenial(...)
    
    # 4. Check deny by prefix
    for prefix in self.deny_prefixes:
        if tool_name.startswith(prefix):
            return False, PermissionDenial(...)
    
    return True, None
```

#### Audit Logging

All denials are logged to:
```
/data/.openclaw/workspace/logs/permission_audit.jsonl
```

Format:
```json
{
  "tool_name": "bash",
  "reason": "Command contains blocked pattern: pkill",
  "timestamp": "2026-03-31T12:00:00Z",
  "context": {"command": "pkill -9 node"}
}
```

---

### 3. Session Manager

Sessions persist conversation state across messages.

#### Session Structure

```python
@dataclass
class StoredSession:
    session_id: str
    created_at: str
    updated_at: str
    messages: list[StoredMessage]
    usage: UsageSummary
    metadata: dict
```

#### Message Structure

```python
@dataclass
class StoredMessage:
    role: str  # "user", "assistant", "system", "tool"
    content: str
    timestamp: str
    metadata: dict
```

#### Usage Tracking

```python
@dataclass
class UsageSummary:
    input_tokens: int = 0
    output_tokens: int = 0
    
    def total(self) -> int:
        return self.input_tokens + self.output_tokens
```

#### Session Persistence

Sessions are stored as JSON files:
```
/data/.openclaw/workspace/sessions/<session-id>.json
```

#### Auto-Compaction

When messages exceed a threshold, old messages are removed:
```python
def compact(self, keep_last: int = 10) -> int:
    removed = len(self.messages) - keep_last
    self.messages = self.messages[-keep_last:]
    return removed
```

---

### 4. Event Emitter

Stream typed events for observability.

#### Event Types

```python
class EventType(Enum):
    MESSAGE_START = "message_start"
    MESSAGE_DELTA = "message_delta"
    MESSAGE_STOP = "message_stop"
    TOOL_CALL = "tool_call"
    TOOL_RESULT = "tool_result"
    PERMISSION_CHECK = "permission_check"
    PERMISSION_DENIAL = "permission_denial"
    ERROR = "error"
    USAGE = "usage"
    PROGRESS = "progress"
```

#### Event Structure

```python
@dataclass
class StreamEvent:
    type: EventType
    timestamp: str
    data: dict
```

#### Emission

```python
emitter = EventEmitter(session_id="abc123")

# Start
emitter.emit_start("What is the weather?")

# Progress
emitter.emit_delta("Checking weather...")

# Tool call
emitter.emit_tool_call("web_search", {"query": "weather NYC"})

# Result
emitter.emit_tool_result("web_search", "Sunny, 72°F")

# Stop
emitter.emit_stop("completed", usage={"input": 50, "output": 100})
```

---

### 5. Prompt Router

Match user input to handlers by relevance.

#### Tokenization

```python
def tokenize(self, prompt: str) -> set[str]:
    # Split on delimiters
    raw = prompt.replace("/", " ").replace("-", " ").lower().split()
    
    # Remove stop words
    return {t for t in raw if t not in STOP_WORDS and len(t) > 1}
```

#### Scoring

```python
def _score(self, tokens: set[str], entry: RegistryEntry) -> int:
    score = 0
    
    # Token matching
    for token in tokens:
        if token in entry.name.lower():
            score += 10
        if token in entry.description.lower():
            score += 5
    
    # Prefix bonus
    for token in tokens:
        if entry.name.lower().startswith(token):
            score += 15
    
    return score
```

#### Routing

```python
def route(self, prompt: str, limit: int = 5) -> list[RoutedMatch]:
    tokens = self.tokenize(prompt)
    
    # Collect matches
    command_matches = self._match_commands(tokens)
    tool_matches = self._match_tools(tokens)
    
    # Combine and sort
    all_matches = command_matches + tool_matches
    all_matches.sort(key=lambda m: -m.score)
    
    return all_matches[:limit]
```

---

### 6. Context Builder

Create immutable workspace context.

#### Context Structure

```python
@dataclass(frozen=True)
class AgentContext:
    workspace: WorkspaceInfo
    config: AgentConfig
    session_id: str
    user_id: Optional[str]
    channel: Optional[str]
    metadata: dict
```

#### Builder Pattern

```python
ctx = (ContextBuilder()
    .workspace("/data/.openclaw/workspace")
    .model("nvidia/z-ai/glm5")
    .user("david")
    .channel("telegram")
    .metadata(foo="bar")
    .build())

# Immutable - cannot modify
# ctx.session_id = "different"  # Raises error

# Create modified copy
new_ctx = ctx.with_metadata(extra="value")
```

---

## Integration Example

```python
from kingdom_claw_core import create_runtime

# Create runtime
runtime = create_runtime()

# Start session
session = runtime.start_session()

# Route prompt
matches = runtime.route("read the config file")
# → [RoutedMatch(name='read', kind='tool', score=40)]

# Check permissions
allowed, reason = runtime.check_permission("read")
# → True, None

allowed, reason = runtime.check_permission("bash")
# → False, "Blocked by default: dangerous tool"

# Execute
result = runtime.submit_turn("read the config file")
# → TurnResult(output="...", matched_tools=('read',), ...)

# Persist
runtime.save_session()
```

---

## Configuration

```yaml
runtime:
  max_turns: 10
  max_budget_tokens: 100000
  compact_after_turns: 20
  session_persist_interval: 5
  log_permissions: true
  log_routing: true
```

---

## File Structure

```
kingdom-claw-core/
├── __init__.py           # Package exports
├── runtime.py            # Main runtime class
├── registry/
│   └── __init__.py       # Command/Tool registries
├── permissions/
│   └── __init__.py       # Permission gate
├── session/
│   └── __init__.py       # Session manager
├── streaming/
│   └── __init__.py       # Event emitter
├── routing/
│   └── __init__.py       # Prompt router
├── context/
│   └── __init__.py       # Context builder
└── tests/
    └── test_core.py      # Unit tests
```

---

## Key Learnings from Claw Code

This runtime implements patterns extracted from Claude Code:

| Pattern | Implementation |
|---------|---------------|
| Command/Tool Dual Registry | Separate `CommandRegistry` and `ToolRegistry` |
| Permission Gating | `PermissionGate` with prefix blocking |
| Session Persistence | `SessionStore` with JSON files |
| Event Streaming | `EventEmitter` with typed events |
| Prompt Routing | `PromptRouter` with token scoring |
| Immutable Context | `AgentContext` frozen dataclass |

---

## Next Steps

1. [Permission System Deep Dive](PERMISSION-SYSTEM.md)
2. [Session Management Details](SESSION-MANAGEMENT.md)
3. [Tool Registry Reference](TOOL-REGISTRY.md)

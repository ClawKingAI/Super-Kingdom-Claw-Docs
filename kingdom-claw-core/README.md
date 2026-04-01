# Kingdom Claw Core

Production-grade agent harness for Kingdom Claw, based on architectural patterns from Claw Code.

## Architecture

Based on analysis of Claw Code (Claude Code Python port), this implements:

### 1. Command/Tool Dual System
- **Commands**: User-facing CLI operations (trusted)
- **Tools**: Agent-invoked operations (gated)
- Separate registries with different permission models

### 2. Permission Gating
- Block by exact name or prefix
- Permission levels: `normal`, `elevated`, `dangerous`
- Audit logging for all denials
- Default blocks: `pkill`, `killall`, `rm -rf`, etc.

### 3. Session Management
- JSON file persistence
- Token tracking
- Auto-compaction
- Session resumption

### 4. Event Streaming
- Typed events: `start`, `delta`, `stop`, `error`
- Usage reporting
- Permission check events
- JSONL export

### 5. Prompt Routing
- Tokenize prompts
- Score matches by relevance
- Disambiguation support
- Context-aware routing

### 6. Context Management
- Immutable context objects
- Workspace info
- Pre-computed metadata
- Fluent builder pattern

## Quick Start

```python
from kingdom_claw_core import create_runtime

# Create runtime with defaults
runtime = create_runtime()

# Start a session
session = runtime.start_session()

# Route a prompt
matches = runtime.route("read the config file")
print(matches)
# [RoutedMatch(kind=MatchKind.TOOL, name='read', score=15, ...)]

# Check permissions
allowed, reason = runtime.check_permission("bash")
# False, "Blocked by permission context"

# Submit a turn
result = runtime.submit_turn("read the config file")
print(result.output)

# Save session
runtime.save_session()
```

## Module Reference

### Registry (`registry/`)
- `CommandRegistry` - User-facing commands
- `ToolRegistry` - Agent-invoked tools
- `ExecutionRegistry` - Unified registry

### Permissions (`permissions/`)
- `PermissionContext` - Permission configuration
- `PermissionGate` - Permission checking
- `PermissionLevel` - Enum for levels

### Session (`session/`)
- `SessionStore` - File-based persistence
- `SessionManager` - Active session management
- `StoredSession` - Session data structure

### Streaming (`streaming/`)
- `EventEmitter` - Event emission
- `EventType` - Event types enum
- `StreamingOperation` - Context manager

### Routing (`routing/`)
- `PromptRouter` - Prompt → command/tool routing
- `RoutedMatch` - Match result

### Context (`context/`)
- `AgentContext` - Immutable context
- `ContextBuilder` - Fluent builder
- `WorkspaceInfo` - Workspace metadata

## Integration with Kingdom Claw

This core module is designed to be integrated with:

1. **NemoClaw agents** - Use for agent orchestration
2. **OpenClaw gateway** - Use for tool routing
3. **Telegram bot** - Use for command handling

## Based On

Architectural patterns extracted from Claw Code analysis:
- https://github.com/instructkr/claw-code

Key learnings documented in: `/data/.openclaw/workspace/memory/claw-code-analysis-2026-03-31.md`

## License

MIT

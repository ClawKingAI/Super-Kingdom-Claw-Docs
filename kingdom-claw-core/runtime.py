"""
Kingdom Claw Runtime - Unified Agent Harness

Combines all components into a cohesive runtime:
- Registry (commands/tools)
- Permissions
- Sessions
- Streaming
- Routing
- Context
"""

from dataclasses import dataclass, field
from typing import Any, Optional, Generator
from pathlib import Path
from uuid import uuid4

try:
    from .registry import (
        CommandRegistry, ToolRegistry, ExecutionRegistry,
        CommandEntry, ToolEntry
    )
    from .permissions import PermissionGate, PermissionContext, PermissionLevel
    from .session import SessionManager, StoredSession, StoredMessage
    from .streaming import EventEmitter, EventType, StreamEvent, StreamingOperation
    from .routing import PromptRouter, RoutedMatch, route_prompt
    from .context import AgentContext, ContextBuilder, build_default_context
except ImportError:
    # Allow standalone import
    from registry import (
        CommandRegistry, ToolRegistry, ExecutionRegistry,
        CommandEntry, ToolEntry
    )
    from permissions import PermissionGate, PermissionContext, PermissionLevel
    from session import SessionManager, StoredSession, StoredMessage
    from streaming import EventEmitter, EventType, StreamEvent, StreamingOperation
    from routing import PromptRouter, RoutedMatch, route_prompt
    from context import AgentContext, ContextBuilder, build_default_context


@dataclass
class TurnResult:
    """Result of a single turn"""
    prompt: str
    output: str
    matched_commands: tuple[str, ...]
    matched_tools: tuple[str, ...]
    permission_denials: tuple[str, ...]
    usage: dict
    stop_reason: str


@dataclass
class RuntimeConfig:
    """Configuration for the runtime"""
    max_turns: int = 10
    max_budget_tokens: int = 100000
    compact_after_turns: int = 20
    session_persist_interval: int = 5
    log_permissions: bool = True
    log_routing: bool = True


class KingdomClawRuntime:
    """
    Production-grade agent harness for Kingdom Claw.
    
    Integrates:
    - Command and tool registries
    - Permission gating
    - Session management
    - Event streaming
    - Prompt routing
    - Context management
    """
    
    def __init__(
        self,
        registry: Optional[ExecutionRegistry] = None,
        permissions: Optional[PermissionGate] = None,
        sessions: Optional[SessionManager] = None,
        config: Optional[RuntimeConfig] = None
    ):
        self.registry = registry or ExecutionRegistry()
        self.permissions = permissions or PermissionGate()
        self.sessions = sessions or SessionManager()
        self.config = config or RuntimeConfig()
        
        self._router = PromptRouter(self.registry)
        self._emitter: Optional[EventEmitter] = None
        
    def start_session(
        self,
        session_id: Optional[str] = None,
        context: Optional[AgentContext] = None
    ) -> StoredSession:
        """Start a new session"""
        session = self.sessions.start_session(session_id)
        self._emitter = EventEmitter(session.session_id)
        
        # Log session start
        if self._emitter:
            event = self._emitter.emit_start(prompt="Session started")
            
        return session
    
    def load_session(self, session_id: str) -> Optional[StoredSession]:
        """Load an existing session"""
        session = self.sessions.load_session(session_id)
        if session:
            self._emitter = EventEmitter(session.session_id)
        return session
    
    def route(self, prompt: str, limit: int = 5) -> list[RoutedMatch]:
        """Route a prompt to matching commands/tools"""
        return self._router.route(prompt, limit)
    
    def check_permission(
        self,
        tool_name: str,
        level: PermissionLevel = PermissionLevel.NORMAL
    ) -> tuple[bool, Optional[str]]:
        """Check if a tool is allowed"""
        allowed, denial = self.permissions.check(tool_name, level)
        reason = denial.reason if denial else None
        
        # Emit permission check event
        if self._emitter:
            self._emitter.emit_permission_check(tool_name, allowed, reason)
            
        return allowed, reason
    
    def submit_turn(
        self,
        prompt: str,
        context: Optional[AgentContext] = None,
        matched_commands: tuple[str, ...] = (),
        matched_tools: tuple[str, ...] = ()
    ) -> TurnResult:
        """
        Submit a single turn.
        
        Routes the prompt, checks permissions, and returns results.
        """
        # Route if not provided
        if not matched_commands and not matched_tools:
            matches = self.route(prompt)
            matched_commands = tuple(
                m.name for m in matches if m.is_command()
            )
            matched_tools = tuple(
                m.name for m in matches if m.is_tool()
            )
            
        # Check permissions for tools
        denials = []
        for tool in matched_tools:
            allowed, reason = self.check_permission(tool)
            if not allowed:
                denials.append(tool)
                
        # Execute allowed operations (stub - real implementation would call handlers)
        output = self._execute_turn(prompt, matched_commands, matched_tools, denials)
        
        # Log to session
        if self.sessions.current():
            self.sessions.add_message(
                "user", prompt,
                matched_commands=len(matched_commands),
                matched_tools=len(matched_tools),
                denials=len(denials)
            )
            self.sessions.add_message(
                "assistant", output,
                matched_commands=len(matched_commands),
                matched_tools=len(matched_tools)
            )
            
        return TurnResult(
            prompt=prompt,
            output=output,
            matched_commands=matched_commands,
            matched_tools=matched_tools,
            permission_denials=tuple(denials),
            usage={"input_tokens": 0, "output_tokens": 0},
            stop_reason="completed"
        )
    
    def _execute_turn(
        self,
        prompt: str,
        commands: tuple[str, ...],
        tools: tuple[str, ...],
        denials: list[str]
    ) -> str:
        """Execute a turn (stub implementation)"""
        lines = [
            f"Processed: {prompt[:100]}...",
            f"Matched commands: {', '.join(commands) or 'none'}",
            f"Matched tools: {', '.join(tools) or 'none'}",
            f"Blocked tools: {', '.join(denials) or 'none'}"
        ]
        return "\n".join(lines)
    
    def stream_turn(
        self,
        prompt: str,
        context: Optional[AgentContext] = None
    ) -> Generator[StreamEvent, None, None]:
        """Stream events for a turn"""
        with StreamingOperation(self._emitter, prompt) as op:
            matches = self.route(prompt)
            
            # Emit matches
            commands = [m.name for m in matches if m.is_command()]
            tools = [m.name for m in matches if m.is_tool()]
            
            if commands:
                self._emitter.emit_command_match(commands)
                op.delta(f"Commands: {', '.join(commands)}\n")
                
            if tools:
                self._emitter.emit_tool_match(tools)
                op.delta(f"Tools: {', '.join(tools)}\n")
                
            # Check permissions
            for tool in tools:
                allowed, reason = self.check_permission(tool)
                if not allowed:
                    self._emitter.emit_permission_denial(tool, reason or "")
                    op.delta(f"Blocked: {tool} ({reason})\n")
                    
            # Emit usage
            self._emitter.emit_usage(0, 0)
            
    def save_session(self) -> Optional[Path]:
        """Save the current session"""
        return self.sessions.save()
    
    def get_event_log(self) -> list[StreamEvent]:
        """Get all emitted events"""
        if self._emitter:
            return self._emitter.get_events()
        return []
    
    def get_permission_denials(self) -> list:
        """Get all permission denials"""
        return self.permissions.get_denials()
    
    @classmethod
    def create_default(cls, workspace: Optional[Path] = None) -> 'KingdomClawRuntime':
        """Create a runtime with sensible defaults"""
        from pathlib import Path
        
        # Create default registries
        cmd_registry = CommandRegistry()
        tool_registry = ToolRegistry()
        
        # Register some basic commands
        cmd_registry.register(CommandEntry(
            name="status",
            description="Show session status",
            source_hint="builtin"
        ))
        cmd_registry.register(CommandEntry(
            name="help",
            description="Show help",
            source_hint="builtin"
        ))
        
        # Register some basic tools
        tool_registry.register(ToolEntry(
            name="read",
            description="Read a file",
            source_hint="builtin",
            permission_level="normal"
        ))
        tool_registry.register(ToolEntry(
            name="write",
            description="Write a file",
            source_hint="builtin",
            permission_level="normal"
        ))
        tool_registry.register(ToolEntry(
            name="bash",
            description="Execute shell command",
            source_hint="builtin",
            permission_level="dangerous"
        ))
        
        registry = ExecutionRegistry(cmd_registry, tool_registry)
        permissions = PermissionGate()
        from session import SessionStore
        store = SessionStore(Path("/data/.openclaw/workspace/sessions"))
        sessions = SessionManager(store=store)
        
        return cls(registry=registry, permissions=permissions, sessions=sessions)


# Convenience function
def create_runtime() -> KingdomClawRuntime:
    """Create a default runtime"""
    return KingdomClawRuntime.create_default()

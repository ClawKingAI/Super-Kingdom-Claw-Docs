"""
Kingdom Claw Core - Production-Grade Agent Harness

Based on architectural patterns from Claw Code analysis:
- Command/Tool dual system
- Permission gating
- Session persistence
- Streaming events
- Prompt routing
- Context management
"""

from .registry import CommandRegistry, ToolRegistry, ExecutionRegistry
from .permissions import PermissionContext, PermissionGate
from .session import SessionStore, StoredSession
from .streaming import EventEmitter, EventType
from .routing import PromptRouter, RoutedMatch
from .context import AgentContext, ContextBuilder

__version__ = "1.0.0"
__all__ = [
    "CommandRegistry",
    "ToolRegistry", 
    "ExecutionRegistry",
    "PermissionContext",
    "PermissionGate",
    "SessionStore",
    "StoredSession",
    "EventEmitter",
    "EventType",
    "PromptRouter",
    "RoutedMatch",
    "AgentContext",
    "ContextBuilder",
]

"""
Registry System - Command and Tool Registration

Implements the Command/Tool dual system from Claw Code:
- Commands: User-facing CLI operations
- Tools: Agent-invoked operations
- Separate registries with different permission models
"""

from dataclasses import dataclass, field
from typing import Callable, Any, Optional
from functools import lru_cache
import json
from pathlib import Path


@dataclass(frozen=True)
class RegistryEntry:
    """Base class for registry entries"""
    name: str
    description: str
    source_hint: str
    handler: Optional[Callable] = None
    metadata: dict = field(default_factory=dict)
    
    def __post_init__(self):
        # Ensure name is lowercase for consistent lookup
        object.__setattr__(self, 'name', self.name.lower())


@dataclass(frozen=True)
class CommandEntry(RegistryEntry):
    """User-facing command entry"""
    aliases: tuple[str, ...] = ()
    requires_confirm: bool = False
    category: str = "general"


@dataclass(frozen=True)
class ToolEntry(RegistryEntry):
    """Agent-invoked tool entry"""
    permission_level: str = "normal"  # "normal", "elevated", "dangerous"
    is_mcp: bool = False
    deny_by_default: bool = False


class CommandRegistry:
    """
    Registry for user-facing commands.
    
    Commands are typed by users and have different permission
    model than tools - they're generally trusted since a human
    initiated them.
    """
    
    def __init__(self):
        self._entries: dict[str, CommandEntry] = {}
        self._aliases: dict[str, str] = {}  # alias -> canonical name
        
    def register(self, entry: CommandEntry) -> None:
        """Register a command entry"""
        self._entries[entry.name] = entry
        for alias in entry.aliases:
            self._aliases[alias.lower()] = entry.name
            
    def get(self, name: str) -> Optional[CommandEntry]:
        """Lookup command by name or alias"""
        name = name.lower()
        if name in self._entries:
            return self._entries[name]
        if name in self._aliases:
            return self._entries[self._aliases[name]]
        return None
    
    def all(self) -> list[CommandEntry]:
        """Get all registered commands"""
        return list(self._entries.values())
    
    def by_category(self, category: str) -> list[CommandEntry]:
        """Get commands by category"""
        return [e for e in self._entries.values() if e.category == category]
    
    def execute(self, name: str, *args, **kwargs) -> Any:
        """Execute a command by name"""
        entry = self.get(name)
        if entry is None:
            raise ValueError(f"Unknown command: {name}")
        if entry.handler is None:
            raise ValueError(f"Command {name} has no handler")
        return entry.handler(*args, **kwargs)


class ToolRegistry:
    """
    Registry for agent-invoked tools.
    
    Tools are invoked by agents and require permission checking
    before execution. They have different permission levels.
    """
    
    def __init__(self):
        self._entries: dict[str, ToolEntry] = {}
        
    def register(self, entry: ToolEntry) -> None:
        """Register a tool entry"""
        self._entries[entry.name] = entry
        
    def get(self, name: str) -> Optional[ToolEntry]:
        """Lookup tool by name"""
        return self._entries.get(name.lower())
    
    def all(self) -> list[ToolEntry]:
        """Get all registered tools"""
        return list(self._entries.values())
    
    def by_permission_level(self, level: str) -> list[ToolEntry]:
        """Get tools by permission level"""
        return [e for e in self._entries.values() if e.permission_level == level]
    
    def dangerous(self) -> list[ToolEntry]:
        """Get all dangerous tools"""
        return self.by_permission_level("dangerous")
    
    def mcp_tools(self) -> list[ToolEntry]:
        """Get all MCP tools"""
        return [e for e in self._entries.values() if e.is_mcp]


class ExecutionRegistry:
    """
    Unified registry for both commands and tools.
    
    Provides a single interface for looking up and executing
    both user commands and agent tools.
    """
    
    def __init__(
        self,
        commands: Optional[CommandRegistry] = None,
        tools: Optional[ToolRegistry] = None
    ):
        self.commands = commands or CommandRegistry()
        self.tools = tools or ToolRegistry()
        
    def command(self, name: str) -> Optional[CommandEntry]:
        """Lookup command"""
        return self.commands.get(name)
    
    def tool(self, name: str) -> Optional[ToolEntry]:
        """Lookup tool"""
        return self.tools.get(name)
    
    def route(self, prompt: str) -> list['RoutedMatch']:
        """Route a prompt to matching commands/tools"""
        # Import here to avoid circular dependency
        try:
            from ..routing import PromptRouter, RoutedMatch
        except ImportError:
            from routing import PromptRouter, RoutedMatch
        router = PromptRouter(self)
        return router.route(prompt)


# Global registries for convenience
_global_commands = CommandRegistry()
_global_tools = ToolRegistry()


def get_command_registry() -> CommandRegistry:
    """Get the global command registry"""
    return _global_commands


def get_tool_registry() -> ToolRegistry:
    """Get the global tool registry"""
    return _global_tools


def register_command(entry: CommandEntry) -> None:
    """Register a command globally"""
    _global_commands.register(entry)


def register_tool(entry: ToolEntry) -> None:
    """Register a tool globally"""
    _global_tools.register(entry)

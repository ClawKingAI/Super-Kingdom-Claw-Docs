"""
Hook System — Event-Based Interventions

Implements Anthropic's hook patterns:
- SessionStart — Inject context at session beginning
- PreToolUse — Intercept before tool execution
- PostToolUse — Process after tool execution
- Stop — Intercept agent exit attempts
"""

from dataclasses import dataclass, field
from typing import Callable, Any, Optional
from enum import Enum
from datetime import datetime


class HookPoint(Enum):
    """Points where hooks can intercept"""
    SESSION_START = "SessionStart"
    PRE_TOOL_USE = "PreToolUse"
    POST_TOOL_USE = "PostToolUse"
    STOP = "Stop"
    MESSAGE_RECEIVED = "MessageReceived"
    RESPONSE_SENT = "ResponseSent"


class HookAction(Enum):
    """Actions a hook can take"""
    ALLOW = "allow"           # Continue normally
    MODIFY = "modify"         # Modify the input/output
    BLOCK = "block"           # Block the operation
    REDIRECT = "redirect"     # Redirect to different handler


@dataclass
class HookContext:
    """Context passed to hook handlers"""
    hook_point: HookPoint
    timestamp: str
    session_id: Optional[str] = None
    tool_name: Optional[str] = None
    tool_params: Optional[dict] = None
    message: Optional[str] = None
    result: Optional[Any] = None
    metadata: dict = field(default_factory=dict)


@dataclass
class HookResult:
    """Result from a hook handler"""
    action: HookAction
    modified_context: Optional[HookContext] = None
    block_reason: Optional[str] = None
    redirect_target: Optional[str] = None
    log_message: Optional[str] = None


HookHandler = Callable[[HookContext], HookResult]


@dataclass
class HookDefinition:
    """Definition of a hook"""
    name: str
    hook_point: HookPoint
    handler: HookHandler
    priority: int = 50  # Lower = earlier execution
    enabled: bool = True
    description: str = ""


class HookRegistry:
    """
    Registry for hook definitions.
    
    Hooks are executed in priority order at their designated points.
    """
    
    def __init__(self):
        self._hooks: dict[HookPoint, list[HookDefinition]] = {
            point: [] for point in HookPoint
        }
        
    def register(self, hook: HookDefinition) -> None:
        """Register a hook"""
        self._hooks[hook.hook_point].append(hook)
        # Sort by priority
        self._hooks[hook.hook_point].sort(key=lambda h: h.priority)
        
    def unregister(self, name: str) -> bool:
        """Unregister a hook by name"""
        for point in HookPoint:
            self._hooks[point] = [
                h for h in self._hooks[point] if h.name != name
            ]
        return True
    
    def get_hooks(self, point: HookPoint) -> list[HookDefinition]:
        """Get all hooks for a point, sorted by priority"""
        return [h for h in self._hooks[point] if h.enabled]
    
    def enable(self, name: str) -> None:
        """Enable a hook"""
        for point in HookPoint:
            for hook in self._hooks[point]:
                if hook.name == name:
                    hook.enabled = True
                    
    def disable(self, name: str) -> None:
        """Disable a hook"""
        for point in HookPoint:
            for hook in self._hooks[point]:
                if hook.name == name:
                    hook.enabled = False


class HookExecutor:
    """
    Execute hooks at designated points.
    
    Processes hooks in priority order, allowing them to:
    - Allow the operation to proceed
    - Modify the context
    - Block the operation
    - Redirect to a different handler
    """
    
    def __init__(self, registry: Optional[HookRegistry] = None):
        self.registry = registry or HookRegistry()
        
    def execute(self, point: HookPoint, context: HookContext) -> tuple[bool, HookContext]:
        """
        Execute all hooks for a point.
        
        Args:
            point: The hook point to execute
            context: The context to process
            
        Returns:
            Tuple of (should_proceed, possibly_modified_context)
        """
        hooks = self.registry.get_hooks(point)
        current_context = context
        
        for hook in hooks:
            try:
                result = hook.handler(current_context)
                
                if result.action == HookAction.BLOCK:
                    # Log the block reason
                    if result.log_message:
                        self._log(hook.name, result.log_message)
                    return False, current_context
                    
                elif result.action == HookAction.MODIFY:
                    if result.modified_context:
                        current_context = result.modified_context
                        
                elif result.action == HookAction.REDIRECT:
                    # Handle redirect (e.g., to different agent)
                    if result.redirect_target:
                        current_context.metadata["redirect_target"] = result.redirect_target
                        
                elif result.action == HookAction.ALLOW:
                    # Continue to next hook
                    pass
                    
            except Exception as e:
                # Log error but continue
                self._log(hook.name, f"Hook error: {e}")
                
        return True, current_context
    
    def _log(self, hook_name: str, message: str) -> None:
        """Log a hook message"""
        print(f"[Hook:{hook_name}] {message}")


# Built-in hooks

def create_security_hook() -> HookDefinition:
    """
    Security hook that warns about potential security issues.
    
    Monitors for:
    - Command injection
    - XSS vulnerabilities
    - eval() usage
    - Dangerous HTML
    - pickle deserialization
    - os.system calls
    """
    SECURITY_PATTERNS = [
        "eval(",
        "exec(",
        "os.system",
        "subprocess.call",
        "pickle.loads",
        "__import__",
        "innerHTML",
        "dangerouslySetInnerHTML",
    ]
    
    def handler(ctx: HookContext) -> HookResult:
        if ctx.tool_name == "edit" or ctx.tool_name == "write":
            content = ctx.tool_params.get("content", "") if ctx.tool_params else ""
            for pattern in SECURITY_PATTERNS:
                if pattern in str(content):
                    return HookResult(
                        action=HookAction.ALLOW,
                        log_message=f"Security warning: {pattern} detected in content"
                    )
        return HookResult(action=HookAction.ALLOW)
    
    return HookDefinition(
        name="security-guidance",
        hook_point=HookPoint.PRE_TOOL_USE,
        handler=handler,
        priority=10,  # High priority (early execution)
        description="Warn about potential security issues"
    )


def create_session_start_hook(prompt: str) -> HookDefinition:
    """
    Hook that injects context at session start.
    
    Use for:
    - Loading CLAUDE.md guidelines
    - Setting output style preferences
    - Injecting educational context
    """
    def handler(ctx: HookContext) -> HookResult:
        if ctx.message:
            ctx.metadata["system_prompt"] = prompt
        return HookResult(action=HookAction.ALLOW)
    
    return HookDefinition(
        name="session-start-context",
        hook_point=HookPoint.SESSION_START,
        handler=handler,
        priority=50,
        description="Inject context at session start"
    )


def create_stop_intercept_hook(continue_prompt: str = "Continue working") -> HookDefinition:
    """
    Hook that intercepts agent exit attempts.
    
    Implements the "Ralph Wiggum" pattern:
    - Intercept stop attempts
    - Prompt to continue
    - Keep agent in loop until completion
    """
    def handler(ctx: HookContext) -> HookResult:
        if ctx.metadata.get("task_complete"):
            return HookResult(action=HookAction.ALLOW)
        
        # Task not complete, redirect back
        return HookResult(
            action=HookAction.REDIRECT,
            redirect_target=continue_prompt,
            log_message="Intercepted stop, continuing iteration"
        )
    
    return HookDefinition(
        name="stop-intercept",
        hook_point=HookPoint.STOP,
        handler=handler,
        priority=100,  # Low priority (late execution)
        description="Intercept agent exit to continue iteration"
    )


# Global registry
_global_registry = HookRegistry()


def register_hook(hook: HookDefinition) -> None:
    """Register a hook globally"""
    _global_registry.register(hook)


def get_global_registry() -> HookRegistry:
    """Get the global hook registry"""
    return _global_registry


def execute_hooks(point: HookPoint, context: HookContext) -> tuple[bool, HookContext]:
    """Execute hooks at a point using global registry"""
    executor = HookExecutor(_global_registry)
    return executor.execute(point, context)

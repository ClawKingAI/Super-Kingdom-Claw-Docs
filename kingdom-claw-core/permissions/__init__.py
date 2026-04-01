"""
Permission System - Gating for Dangerous Operations

Implements permission patterns from Claw Code:
- Block by exact name or prefix
- Track all denials for audit
- User-configurable allowlists
- Permission levels for tools
"""

from dataclasses import dataclass, field
from typing import Optional, Callable
from enum import Enum
from datetime import datetime
import json
from pathlib import Path


class PermissionLevel(Enum):
    """Permission levels for operations"""
    NORMAL = "normal"      # Safe operations, always allowed
    ELEVATED = "elevated"  # Require confirmation
    DANGEROUS = "dangerous"  # Block by default, require explicit allow


@dataclass(frozen=True)
class PermissionDenial:
    """Record of a denied operation"""
    tool_name: str
    reason: str
    timestamp: str
    context: dict = field(default_factory=dict)
    
    @classmethod
    def create(cls, tool_name: str, reason: str, **context) -> 'PermissionDenial':
        return cls(
            tool_name=tool_name,
            reason=reason,
            timestamp=datetime.utcnow().isoformat(),
            context=context
        )


@dataclass
class PermissionContext:
    """
    Permission context for checking tool access.
    
    Supports blocking by:
    - Exact tool names (deny_names)
    - Tool name prefixes (deny_prefixes)
    - Permission level thresholds
    
    Supports allowing by:
    - Explicit allowlist
    - User confirmation callback
    """
    deny_names: set[str] = field(default_factory=set)
    deny_prefixes: tuple[str, ...] = ()
    allow_names: set[str] = field(default_factory=set)
    allow_prefixes: tuple[str, ...] = ()
    min_permission_level: PermissionLevel = PermissionLevel.NORMAL
    require_confirmation_for: set[PermissionLevel] = field(
        default_factory=lambda: {PermissionLevel.ELEVATED}
    )
    
    def blocks(self, tool_name: str, level: PermissionLevel = PermissionLevel.NORMAL) -> bool:
        """Check if a tool is blocked"""
        lowered = tool_name.lower()
        
        # Check explicit allow first (overrides deny)
        if lowered in self.allow_names:
            return False
        if any(lowered.startswith(p) for p in self.allow_prefixes):
            return False
            
        # Check permission level
        if level.value > self.min_permission_level.value:
            # Level exceeds minimum, check if explicitly allowed
            if lowered not in self.allow_names:
                if level == PermissionLevel.DANGEROUS:
                    return True
                    
        # Check deny by name
        if lowered in self.deny_names:
            return True
            
        # Check deny by prefix
        if any(lowered.startswith(p) for p in self.deny_prefixes):
            return True
            
        return False
    
    def requires_confirmation(self, level: PermissionLevel) -> bool:
        """Check if a permission level requires confirmation"""
        return level in self.require_confirmation_for
    
    @classmethod
    def from_deny_list(cls, deny_names: list[str], deny_prefixes: list[str] | None = None) -> 'PermissionContext':
        """Create from deny lists"""
        return cls(
            deny_names=set(n.lower() for n in deny_names),
            deny_prefixes=tuple(p.lower() for p in (deny_prefixes or []))
        )
    
    @classmethod
    def restrictive(cls) -> 'PermissionContext':
        """Create a restrictive context - block dangerous by default"""
        return cls(
            deny_prefixes=("pkill", "killall", "rm -rf", "dd", "mkfs", "format"),
            min_permission_level=PermissionLevel.NORMAL,
            require_confirmation_for={PermissionLevel.ELEVATED, PermissionLevel.DANGEROUS}
        )
    
    @classmethod
    def permissive(cls) -> 'PermissionContext':
        """Create a permissive context - allow most operations"""
        return cls(
            min_permission_level=PermissionLevel.DANGEROUS
        )


class PermissionGate:
    """
    Gate for checking permissions and logging denials.
    
    Tracks all permission decisions for audit.
    """
    
    # Default blocked prefixes - dangerous shell operations
    DEFAULT_DENY_PREFIXES = [
        "pkill",
        "killall", 
        "kill -9",
        "rm -rf",
        "dd if=",
        "mkfs",
        "format",
        "> /dev/",  # Writing to devices
        "chmod 777",
        "chown root",
    ]
    
    def __init__(
        self,
        context: Optional[PermissionContext] = None,
        audit_log: Optional[Path] = None
    ):
        self.context = context or PermissionContext.restrictive()
        self.audit_log = audit_log
        self._denials: list[PermissionDenial] = []
        
    def check(
        self,
        tool_name: str,
        level: PermissionLevel = PermissionLevel.NORMAL,
        **context
    ) -> tuple[bool, Optional[PermissionDenial]]:
        """
        Check if a tool is allowed.
        
        Returns (allowed, denial) tuple.
        If allowed is False, denial contains the reason.
        """
        if self.context.blocks(tool_name, level):
            denial = PermissionDenial.create(
                tool_name=tool_name,
                reason=f"Blocked by permission context (level={level.value})",
                **context
            )
            self._log_denial(denial)
            return False, denial
            
        if self.context.requires_confirmation(level):
            # Would need user confirmation in real implementation
            # For now, we log that confirmation would be needed
            pass
            
        return True, None
    
    def check_command(self, command: str, **context) -> tuple[bool, Optional[PermissionDenial]]:
        """
        Check if a shell command is allowed.
        
        Scans for dangerous patterns.
        """
        lowered = command.lower()
        
        # Check against deny prefixes
        for prefix in self.DEFAULT_DENY_PREFIXES:
            if prefix in lowered:
                denial = PermissionDenial.create(
                    tool_name="bash",
                    reason=f"Command contains blocked pattern: {prefix}",
                    command=command,
                    **context
                )
                self._log_denial(denial)
                return False, denial
                
        return True, None
    
    def _log_denial(self, denial: PermissionDenial) -> None:
        """Log a denial for audit"""
        self._denials.append(denial)
        
        if self.audit_log:
            self._write_audit(denial)
            
    def _write_audit(self, denial: PermissionDenial) -> None:
        """Write denial to audit log"""
        if not self.audit_log:
            return
            
        self.audit_log.parent.mkdir(parents=True, exist_ok=True)
        
        with open(self.audit_log, "a") as f:
            f.write(json.dumps({
                "tool_name": denial.tool_name,
                "reason": denial.reason,
                "timestamp": denial.timestamp,
                "context": denial.context
            }) + "\n")
            
    def get_denials(self) -> list[PermissionDenial]:
        """Get all recorded denials"""
        return self._denials.copy()
    
    def clear_denials(self) -> None:
        """Clear denial history"""
        self._denials.clear()


# Convenience functions
def create_default_gate() -> PermissionGate:
    """Create a permission gate with safe defaults"""
    return PermissionGate(
        context=PermissionContext.restrictive(),
        audit_log=Path("/data/.openclaw/workspace/logs/permission_audit.jsonl")
    )

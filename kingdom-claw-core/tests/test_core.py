"""
Tests for Kingdom Claw Core

Run with: python -m pytest tests/
"""

import pytest
from pathlib import Path
import tempfile

# Import modules
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from registry import (
    CommandRegistry, ToolRegistry, ExecutionRegistry,
    CommandEntry, ToolEntry
)
from permissions import (
    PermissionContext, PermissionGate, PermissionLevel
)
from session import (
    SessionStore, SessionManager, StoredSession
)
from streaming import EventEmitter, EventType
from routing import PromptRouter, route_prompt
from context import ContextBuilder, AgentContext


class TestRegistry:
    """Tests for registry system"""
    
    def test_command_registry(self):
        """Test command registration and lookup"""
        registry = CommandRegistry()
        
        cmd = CommandEntry(
            name="test",
            description="Test command",
            source_hint="test.py"
        )
        
        registry.register(cmd)
        
        # Lookup by name
        found = registry.get("test")
        assert found is not None
        assert found.name == "test"
        
        # Case insensitive
        found = registry.get("TEST")
        assert found is not None
        
    def test_tool_registry(self):
        """Test tool registration and lookup"""
        registry = ToolRegistry()
        
        tool = ToolEntry(
            name="read",
            description="Read file",
            source_hint="tools.py",
            permission_level="normal"
        )
        
        registry.register(tool)
        
        found = registry.get("read")
        assert found is not None
        assert found.permission_level == "normal"
        
    def test_execution_registry(self):
        """Test unified registry"""
        cmds = CommandRegistry()
        tools = ToolRegistry()
        
        registry = ExecutionRegistry(cmds, tools)
        
        # Should have empty registries
        assert len(registry.commands.all()) == 0
        assert len(registry.tools.all()) == 0


class TestPermissions:
    """Tests for permission system"""
    
    def test_permission_context_blocks(self):
        """Test permission blocking"""
        ctx = PermissionContext.from_deny_list(
            deny_names=["dangerous_tool"],
            deny_prefixes=["bash", "rm"]
        )
        
        # Block exact name
        assert ctx.blocks("dangerous_tool")
        
        # Block prefix
        assert ctx.blocks("bash_run")
        assert ctx.blocks("rm_file")
        
        # Allow others
        assert not ctx.blocks("safe_tool")
        
    def test_permission_gate(self):
        """Test permission gate"""
        gate = PermissionGate()
        
        # Check dangerous command
        allowed, denial = gate.check_command("pkill -9 node")
        assert not allowed
        assert "pkill" in denial.reason
        
        # Check safe command
        allowed, _ = gate.check_command("ls -la")
        assert allowed
        
    def test_permission_levels(self):
        """Test permission levels"""
        ctx = PermissionContext.restrictive()
        
        # Normal should be allowed
        assert not ctx.blocks("read", PermissionLevel.NORMAL)
        
        # Dangerous should be blocked
        assert ctx.blocks("dangerous_op", PermissionLevel.DANGEROUS)


class TestSession:
    """Tests for session management"""
    
    def test_session_creation(self):
        """Test session creation"""
        session = StoredSession.create()
        
        assert session.session_id is not None
        assert len(session.messages) == 0
        assert session.usage["input_tokens"] == 0
        
    def test_session_messages(self):
        """Test adding messages"""
        session = StoredSession.create()
        
        msg = StoredMessage.create("user", "Hello")
        session.add_message(msg)
        
        assert session.message_count() == 1
        assert session.messages[0]["role"] == "user"
        
    def test_session_compaction(self):
        """Test session compaction"""
        session = StoredSession.create()
        
        # Add many messages
        for i in range(20):
            msg = StoredMessage.create("user", f"Message {i}")
            session.add_message(msg)
            
        assert session.message_count() == 20
        
        # Compact
        removed = session.compact(keep_last=5)
        assert removed == 15
        assert session.message_count() == 5


class TestStreaming:
    """Tests for event streaming"""
    
    def test_event_emission(self):
        """Test event emission"""
        emitter = EventEmitter(session_id="test")
        
        # Emit start
        emitter.emit_start("test prompt")
        
        # Emit delta
        emitter.emit_delta("partial response")
        
        # Emit stop
        emitter.emit_stop("completed")
        
        events = emitter.get_events()
        assert len(events) == 3
        assert events[0].type == EventType.MESSAGE_START
        
    def test_event_types(self):
        """Test event types"""
        emitter = EventEmitter()
        
        # Test different event types
        emitter.emit_tool_call("read", {"path": "/tmp/test"})
        emitter.emit_permission_denial("bash", "dangerous")
        emitter.emit_progress(5, 10, "processing")
        
        events = emitter.get_events()
        assert len(events) == 3
        assert events[0].type == EventType.TOOL_CALL
        assert events[1].type == EventType.PERMISSION_DENIAL
        assert events[2].type == EventType.PROGRESS


class TestRouting:
    """Tests for prompt routing"""
    
    def test_tokenization(self):
        """Test prompt tokenization"""
        # Create mock registry
        registry = ExecutionRegistry()
        router = PromptRouter(registry)
        
        tokens = router.tokenize("Please read the config file")
        
        # Stop words should be removed
        assert "please" not in tokens
        assert "the" not in tokens
        
        # Content words should remain
        assert "read" in tokens
        assert "config" in tokens
        assert "file" in tokens
        
    def test_routing(self):
        """Test prompt routing"""
        # Create registry with some entries
        cmds = CommandRegistry()
        tools = ToolRegistry()
        
        cmds.register(CommandEntry(
            name="status",
            description="Show status",
            source_hint="builtin"
        ))
        
        tools.register(ToolEntry(
            name="read",
            description="Read file",
            source_hint="builtin"
        ))
        
        registry = ExecutionRegistry(cmds, tools)
        router = PromptRouter(registry)
        
        # Route a prompt
        matches = router.route("read config file")
        
        # Should match read tool
        assert any(m.name == "read" for m in matches)


class TestContext:
    """Tests for context management"""
    
    def test_context_builder(self):
        """Test context builder"""
        ctx = (
            ContextBuilder()
            .model("nvidia/z-ai/glm5")
            .user("test_user")
            .channel("telegram")
            .metadata(foo="bar")
            .build()
        )
        
        assert ctx.config.model == "nvidia/z-ai/glm5"
        assert ctx.user_id == "test_user"
        assert ctx.channel == "telegram"
        assert ctx.metadata["foo"] == "bar"
        
    def test_context_immutability(self):
        """Test context is immutable"""
        ctx = ContextBuilder().build()
        
        with pytest.raises(Exception):
            ctx.session_id = "different"
            
    def test_context_with_methods(self):
        """Test context modification methods"""
        ctx = ContextBuilder().build()
        
        # with_metadata returns new context
        new_ctx = ctx.with_metadata(extra="value")
        
        # Original unchanged
        assert "extra" not in ctx.metadata
        
        # New has extra
        assert new_ctx.metadata["extra"] == "value"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

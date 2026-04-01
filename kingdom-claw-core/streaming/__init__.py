"""
Streaming Events - Typed Event Emission

Implements streaming patterns from Claw Code:
- Typed events (start, delta, stop, error)
- Event emission for observability
- Usage reporting
- Stream control
"""

from dataclasses import dataclass, field
from typing import Any, Generator, Optional, Callable
from enum import Enum
from datetime import datetime
import json


class EventType(Enum):
    """Types of events in a stream"""
    MESSAGE_START = "message_start"
    MESSAGE_DELTA = "message_delta"
    MESSAGE_STOP = "message_stop"
    TOOL_CALL = "tool_call"
    TOOL_RESULT = "tool_result"
    COMMAND_MATCH = "command_match"
    TOOL_MATCH = "tool_match"
    PERMISSION_CHECK = "permission_check"
    PERMISSION_DENIAL = "permission_denial"
    ERROR = "error"
    USAGE = "usage"
    PROGRESS = "progress"
    DEBUG = "debug"


@dataclass
class StreamEvent:
    """A single event in a stream"""
    type: EventType
    timestamp: str
    data: dict = field(default_factory=dict)
    
    @classmethod
    def create(cls, event_type: EventType, **data) -> 'StreamEvent':
        return cls(
            type=event_type,
            timestamp=datetime.utcnow().isoformat(),
            data=data
        )
    
    def to_dict(self) -> dict:
        return {
            "type": self.type.value,
            "timestamp": self.timestamp,
            **self.data
        }
    
    def to_json(self) -> str:
        return json.dumps(self.to_dict())


class EventEmitter:
    """
    Emit typed events for streaming operations.
    
    Provides a clean interface for emitting events
    in a consistent format.
    """
    
    def __init__(self, session_id: Optional[str] = None):
        self.session_id = session_id
        self._events: list[StreamEvent] = []
        self._listeners: list[Callable[[StreamEvent], None]] = []
        
    def on_event(self, listener: Callable[[StreamEvent], None]) -> None:
        """Add a listener for events"""
        self._listeners.append(listener)
        
    def emit(self, event: StreamEvent) -> None:
        """Emit an event to all listeners"""
        self._events.append(event)
        for listener in self._listeners:
            listener(event)
            
    def emit_start(self, prompt: str, **metadata) -> StreamEvent:
        """Emit a message start event"""
        event = StreamEvent.create(
            EventType.MESSAGE_START,
            session_id=self.session_id,
            prompt=prompt,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_delta(self, text: str, **metadata) -> StreamEvent:
        """Emit a message delta (partial content)"""
        event = StreamEvent.create(
            EventType.MESSAGE_DELTA,
            text=text,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_stop(
        self,
        stop_reason: str,
        usage: Optional[dict] = None,
        **metadata
    ) -> StreamEvent:
        """Emit a message stop event"""
        event = StreamEvent.create(
            EventType.MESSAGE_STOP,
            session_id=self.session_id,
            stop_reason=stop_reason,
            usage=usage or {},
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_tool_call(
        self,
        tool_name: str,
        arguments: dict,
        **metadata
    ) -> StreamEvent:
        """Emit a tool call event"""
        event = StreamEvent.create(
            EventType.TOOL_CALL,
            tool_name=tool_name,
            arguments=arguments,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_tool_result(
        self,
        tool_name: str,
        result: Any,
        success: bool = True,
        **metadata
    ) -> StreamEvent:
        """Emit a tool result event"""
        event = StreamEvent.create(
            EventType.TOOL_RESULT,
            tool_name=tool_name,
            result=result if isinstance(result, str) else str(result),
            success=success,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_command_match(
        self,
        commands: list[str],
        **metadata
    ) -> StreamEvent:
        """Emit a command match event"""
        event = StreamEvent.create(
            EventType.COMMAND_MATCH,
            commands=commands,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_tool_match(
        self,
        tools: list[str],
        **metadata
    ) -> StreamEvent:
        """Emit a tool match event"""
        event = StreamEvent.create(
            EventType.TOOL_MATCH,
            tools=tools,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_permission_check(
        self,
        tool_name: str,
        allowed: bool,
        reason: Optional[str] = None,
        **metadata
    ) -> StreamEvent:
        """Emit a permission check event"""
        event = StreamEvent.create(
            EventType.PERMISSION_CHECK,
            tool_name=tool_name,
            allowed=allowed,
            reason=reason,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_permission_denial(
        self,
        tool_name: str,
        reason: str,
        **metadata
    ) -> StreamEvent:
        """Emit a permission denial event"""
        event = StreamEvent.create(
            EventType.PERMISSION_DENIAL,
            tool_name=tool_name,
            reason=reason,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_error(
        self,
        error: str,
        code: Optional[str] = None,
        **metadata
    ) -> StreamEvent:
        """Emit an error event"""
        event = StreamEvent.create(
            EventType.ERROR,
            error=error,
            code=code,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_usage(
        self,
        input_tokens: int,
        output_tokens: int,
        **metadata
    ) -> StreamEvent:
        """Emit a usage event"""
        event = StreamEvent.create(
            EventType.USAGE,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=input_tokens + output_tokens,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_progress(
        self,
        current: int,
        total: int,
        message: str = "",
        **metadata
    ) -> StreamEvent:
        """Emit a progress event"""
        event = StreamEvent.create(
            EventType.PROGRESS,
            current=current,
            total=total,
            percent=round(current / total * 100, 1) if total > 0 else 0,
            message=message,
            **metadata
        )
        self.emit(event)
        return event
    
    def emit_debug(self, message: str, **metadata) -> StreamEvent:
        """Emit a debug event"""
        event = StreamEvent.create(
            EventType.DEBUG,
            message=message,
            **metadata
        )
        self.emit(event)
        return event
    
    def get_events(self) -> list[StreamEvent]:
        """Get all emitted events"""
        return self._events.copy()
    
    def get_events_by_type(self, event_type: EventType) -> list[StreamEvent]:
        """Get events of a specific type"""
        return [e for e in self._events if e.type == event_type]
    
    def to_jsonl(self) -> str:
        """Convert all events to JSONL format"""
        return "\n".join(e.to_json() for e in self._events)
    
    def clear(self) -> None:
        """Clear all events"""
        self._events.clear()


class StreamingOperation:
    """
    Context manager for streaming operations.
    
    Automatically emits start and stop events.
    """
    
    def __init__(
        self,
        emitter: EventEmitter,
        prompt: str,
        **metadata
    ):
        self.emitter = emitter
        self.prompt = prompt
        self.metadata = metadata
        self.start_event: Optional[StreamEvent] = None
        self.stop_event: Optional[StreamEvent] = None
        self.deltas: list[str] = []
        
    def __enter__(self) -> 'StreamingOperation':
        self.start_event = self.emitter.emit_start(self.prompt, **self.metadata)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type is not None:
            self.emitter.emit_error(str(exc_val), code=exc_type.__name__)
        
        self.stop_event = self.emitter.emit_stop(
            stop_reason="error" if exc_type else "completed",
            **self.metadata
        )
    
    def delta(self, text: str) -> None:
        """Emit a delta"""
        self.deltas.append(text)
        self.emitter.emit_delta(text)
    
    def full_content(self) -> str:
        """Get all delta content"""
        return "".join(self.deltas)

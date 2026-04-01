"""
Session Management - Persistence and Resumption

Implements session patterns from Claw Code:
- JSON file storage
- Token tracking
- Session resumption
- Message history
"""

from dataclasses import dataclass, field, asdict
from typing import Optional, Any
from datetime import datetime
from uuid import uuid4
import json
from pathlib import Path


@dataclass
class UsageSummary:
    """Track token usage"""
    input_tokens: int = 0
    output_tokens: int = 0
    
    def add(self, input: int = 0, output: int = 0) -> 'UsageSummary':
        """Add to usage totals"""
        return UsageSummary(
            input_tokens=self.input_tokens + input,
            output_tokens=self.output_tokens + output
        )
    
    def total(self) -> int:
        """Get total tokens"""
        return self.input_tokens + self.output_tokens


@dataclass
class StoredMessage:
    """A stored message in a session"""
    role: str  # "user", "assistant", "system", "tool"
    content: str
    timestamp: str
    metadata: dict = field(default_factory=dict)
    
    @classmethod
    def create(cls, role: str, content: str, **metadata) -> 'StoredMessage':
        return cls(
            role=role,
            content=content,
            timestamp=datetime.utcnow().isoformat(),
            metadata=metadata
        )


@dataclass
class StoredSession:
    """A persisted session with full history"""
    session_id: str
    created_at: str
    updated_at: str
    messages: list[dict]  # List of StoredMessage as dict
    usage: dict  # UsageSummary as dict
    metadata: dict = field(default_factory=dict)
    
    @classmethod
    def create(cls, session_id: Optional[str] = None, **metadata) -> 'StoredSession':
        """Create a new session"""
        now = datetime.utcnow().isoformat()
        return cls(
            session_id=session_id or uuid4().hex,
            created_at=now,
            updated_at=now,
            messages=[],
            usage={"input_tokens": 0, "output_tokens": 0},
            metadata=metadata
        )
    
    def add_message(self, message: StoredMessage) -> None:
        """Add a message to the session"""
        self.messages.append(asdict(message))
        self.updated_at = datetime.utcnow().isoformat()
        
    def add_usage(self, input_tokens: int, output_tokens: int) -> None:
        """Add to usage totals"""
        self.usage["input_tokens"] += input_tokens
        self.usage["output_tokens"] += output_tokens
        self.updated_at = datetime.utcnow().isoformat()
        
    def get_messages(self) -> list[StoredMessage]:
        """Get all messages as StoredMessage objects"""
        return [
            StoredMessage(**msg) for msg in self.messages
        ]
    
    def get_usage(self) -> UsageSummary:
        """Get usage as UsageSummary"""
        return UsageSummary(**self.usage)
    
    def message_count(self) -> int:
        """Get number of messages"""
        return len(self.messages)
    
    def compact(self, keep_last: int = 10) -> int:
        """
        Compact messages, keeping only recent ones.
        
        Returns number of messages removed.
        """
        if len(self.messages) <= keep_last:
            return 0
            
        removed = len(self.messages) - keep_last
        self.messages = self.messages[-keep_last:]
        self.updated_at = datetime.utcnow().isoformat()
        return removed


class SessionStore:
    """
    Store for session persistence.
    
    Sessions are stored as JSON files in a directory.
    Supports loading, saving, and listing sessions.
    """
    
    def __init__(self, store_dir: Optional[Path] = None):
        self.store_dir = store_dir or Path("/data/.openclaw/workspace/sessions")
        self.store_dir.mkdir(parents=True, exist_ok=True)
        
    def save(self, session: StoredSession) -> Path:
        """Save a session to disk"""
        path = self.store_dir / f"{session.session_id}.json"
        path.write_text(json.dumps(asdict(session), indent=2))
        return path
    
    def load(self, session_id: str) -> Optional[StoredSession]:
        """Load a session from disk"""
        path = self.store_dir / f"{session_id}.json"
        if not path.exists():
            return None
        data = json.loads(path.read_text())
        return StoredSession(**data)
    
    def exists(self, session_id: str) -> bool:
        """Check if a session exists"""
        return (self.store_dir / f"{session_id}.json").exists()
    
    def list(self, limit: int = 100) -> list[str]:
        """List all session IDs"""
        sessions = []
        for path in self.store_dir.glob("*.json"):
            try:
                data = json.loads(path.read_text())
                sessions.append({
                    "session_id": data["session_id"],
                    "created_at": data["created_at"],
                    "message_count": len(data["messages"])
                })
            except (json.JSONDecodeError, KeyError):
                continue
        # Sort by created_at descending
        sessions.sort(key=lambda x: x["created_at"], reverse=True)
        return sessions[:limit]
    
    def delete(self, session_id: str) -> bool:
        """Delete a session"""
        path = self.store_dir / f"{session_id}.json"
        if path.exists():
            path.unlink()
            return True
        return False
    
    def cleanup_old(self, max_age_days: int = 30) -> int:
        """
        Clean up sessions older than max_age_days.
        
        Returns number of sessions deleted.
        """
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(days=max_age_days)
        deleted = 0
        
        for path in self.store_dir.glob("*.json"):
            try:
                data = json.loads(path.read_text())
                updated = datetime.fromisoformat(data["updated_at"])
                if updated < cutoff:
                    path.unlink()
                    deleted += 1
            except (json.JSONDecodeError, KeyError, ValueError):
                continue
                
        return deleted


class SessionManager:
    """
    Active session manager with memory.
    
    Manages the current session and provides
    convenience methods for message handling.
    """
    
    def __init__(
        self,
        store: Optional[SessionStore] = None,
        max_messages: int = 100,
        auto_compact_at: int = 50
    ):
        self.store = store or SessionStore()
        self.max_messages = max_messages
        self.auto_compact_at = auto_compact_at
        self._session: Optional[StoredSession] = None
        
    def start_session(self, session_id: Optional[str] = None) -> StoredSession:
        """Start a new session"""
        self._session = StoredSession.create(session_id)
        return self._session
    
    def load_session(self, session_id: str) -> Optional[StoredSession]:
        """Load an existing session"""
        self._session = self.store.load(session_id)
        return self._session
    
    def current(self) -> Optional[StoredSession]:
        """Get the current session"""
        return self._session
    
    def add_message(
        self,
        role: str,
        content: str,
        input_tokens: int = 0,
        output_tokens: int = 0,
        **metadata
    ) -> None:
        """Add a message to the current session"""
        if self._session is None:
            self.start_session()
            
        message = StoredMessage.create(role, content, **metadata)
        self._session.add_message(message)
        self._session.add_usage(input_tokens, output_tokens)
        
        # Auto-compact if needed
        if self._session.message_count() > self.auto_compact_at:
            self._session.compact(keep_last=self.auto_compact_at // 2)
            
    def save(self) -> Optional[Path]:
        """Save the current session"""
        if self._session is None:
            return None
        return self.store.save(self._session)
    
    def get_history(self, limit: int = 20) -> list[StoredMessage]:
        """Get recent message history"""
        if self._session is None:
            return []
        messages = self._session.get_messages()
        return messages[-limit:]

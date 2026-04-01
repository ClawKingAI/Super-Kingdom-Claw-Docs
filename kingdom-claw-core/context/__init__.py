"""
Context Management - Immutable Context Objects

Implements context patterns from Claw Code:
- Immutable context objects
- Pre-computed metadata
- Workspace structure
- Context passing through call chain
"""

from dataclasses import dataclass, field
from typing import Any, Optional
from pathlib import Path
import os


@dataclass(frozen=True)
class WorkspaceInfo:
    """Information about the current workspace"""
    root: Path
    name: str
    file_count: int
    dir_count: int
    has_git: bool
    has_readme: bool
    
    @classmethod
    def from_path(cls, root: Path) -> 'WorkspaceInfo':
        """Create from a path"""
        root = root.resolve()
        name = root.name
        
        file_count = 0
        dir_count = 0
        
        for item in root.rglob("*"):
            if item.is_file():
                file_count += 1
            elif item.is_dir():
                dir_count += 1
                # Skip hidden dirs and common exclusions
                if item.name.startswith(".") or item.name in {"node_modules", "__pycache__", ".git"}:
                    continue
                    
        return cls(
            root=root,
            name=name,
            file_count=file_count,
            dir_count=dir_count,
            has_git=(root / ".git").exists(),
            has_readme=any((root / f).exists() for f in ["README.md", "README.txt", "readme.md"])
        )


@dataclass(frozen=True)
class AgentConfig:
    """Configuration for an agent"""
    model: str = "nvidia/z-ai/glm5"
    max_tokens: int = 4096
    temperature: float = 0.7
    system_prompt: str = ""
    
    @classmethod
    def default(cls) -> 'AgentConfig':
        return cls()


@dataclass(frozen=True)
class AgentContext:
    """
    Immutable context object for agent operations.
    
    Contains all the information an agent needs to operate:
    - Workspace information
    - Configuration
    - Session state
    - Custom metadata
    """
    workspace: WorkspaceInfo
    config: AgentConfig
    session_id: str
    user_id: Optional[str] = None
    channel: Optional[str] = None
    metadata: dict = field(default_factory=dict)
    
    def with_metadata(self, **kwargs) -> 'AgentContext':
        """Create a new context with additional metadata"""
        new_metadata = {**self.metadata, **kwargs}
        return AgentContext(
            workspace=self.workspace,
            config=self.config,
            session_id=self.session_id,
            user_id=self.user_id,
            channel=self.channel,
            metadata=new_metadata
        )
    
    def with_config(self, **kwargs) -> 'AgentContext':
        """Create a new context with modified config"""
        new_config = AgentConfig(**{**self.config.__dict__, **kwargs})
        return AgentContext(
            workspace=self.workspace,
            config=new_config,
            session_id=self.session_id,
            user_id=self.user_id,
            channel=self.channel,
            metadata=self.metadata
        )
    
    def workspace_path(self) -> Path:
        """Get the workspace root path"""
        return self.workspace.root
    
    def relative_path(self, path: Path | str) -> Path:
        """Get a path relative to workspace root"""
        path = Path(path)
        if path.is_absolute():
            try:
                return path.relative_to(self.workspace.root)
            except ValueError:
                return path
        return path
    
    def absolute_path(self, path: Path | str) -> Path:
        """Get an absolute path within the workspace"""
        path = Path(path)
        if path.is_absolute():
            return path
        return self.workspace.root / path


class ContextBuilder:
    """
    Builder for creating AgentContext instances.
    
    Provides a fluent interface for constructing contexts.
    """
    
    def __init__(self):
        self._workspace: Optional[WorkspaceInfo] = None
        self._config: AgentConfig = AgentConfig.default()
        self._session_id: Optional[str] = None
        self._user_id: Optional[str] = None
        self._channel: Optional[str] = None
        self._metadata: dict = {}
        
    def workspace(self, root: Path | str) -> 'ContextBuilder':
        """Set the workspace root"""
        self._workspace = WorkspaceInfo.from_path(Path(root))
        return self
        
    def workspace_from_cwd(self) -> 'ContextBuilder':
        """Use current working directory as workspace"""
        self._workspace = WorkspaceInfo.from_path(Path.cwd())
        return self
        
    def config(self, **kwargs) -> 'ContextBuilder':
        """Set configuration options"""
        self._config = AgentConfig(**{**self._config.__dict__, **kwargs})
        return self
        
    def model(self, model: str) -> 'ContextBuilder':
        """Set the model"""
        return self.config(model=model)
        
    def session(self, session_id: str) -> 'ContextBuilder':
        """Set the session ID"""
        self._session_id = session_id
        return self
        
    def user(self, user_id: str) -> 'ContextBuilder':
        """Set the user ID"""
        self._user_id = user_id
        return self
        
    def channel(self, channel: str) -> 'ContextBuilder':
        """Set the channel"""
        self._channel = channel
        return self
        
    def metadata(self, **kwargs) -> 'ContextBuilder':
        """Add metadata"""
        self._metadata.update(kwargs)
        return self
        
    def build(self) -> AgentContext:
        """Build the context"""
        if self._workspace is None:
            self._workspace = WorkspaceInfo.from_path(Path.cwd())
            
        from uuid import uuid4
        session_id = self._session_id or uuid4().hex
        
        return AgentContext(
            workspace=self._workspace,
            config=self._config,
            session_id=session_id,
            user_id=self._user_id,
            channel=self._channel,
            metadata=self._metadata.copy()
        )


def build_default_context(
    workspace: Optional[Path] = None,
    session_id: Optional[str] = None
) -> AgentContext:
    """Build a default context"""
    builder = ContextBuilder()
    
    if workspace:
        builder.workspace(workspace)
    else:
        builder.workspace_from_cwd()
        
    if session_id:
        builder.session(session_id)
        
    return builder.build()


def render_context(context: AgentContext) -> str:
    """Render context as a human-readable string"""
    lines = [
        f"Workspace: {context.workspace.root}",
        f"  Name: {context.workspace.name}",
        f"  Files: {context.workspace.file_count}",
        f"  Dirs: {context.workspace.dir_count}",
        f"  Git: {'yes' if context.workspace.has_git else 'no'}",
        "",
        f"Config:",
        f"  Model: {context.config.model}",
        f"  Max tokens: {context.config.max_tokens}",
        f"  Temperature: {context.config.temperature}",
        "",
        f"Session: {context.session_id}",
    ]
    
    if context.user_id:
        lines.append(f"User: {context.user_id}")
    if context.channel:
        lines.append(f"Channel: {context.channel}")
        
    if context.metadata:
        lines.append("")
        lines.append("Metadata:")
        for key, value in context.metadata.items():
            lines.append(f"  {key}: {value}")
            
    return "\n".join(lines)

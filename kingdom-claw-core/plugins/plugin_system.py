"""
Plugin System — Extensible Capability Architecture

Implements Anthropic's plugin structure:
- Standardized plugin format
- Command/Agent/Skill/Hook organization
- Plugin metadata and discovery
- Marketplace compatibility
"""

from dataclasses import dataclass, field
from typing import Optional, Any
from pathlib import Path
import json


@dataclass
class PluginMetadata:
    """Plugin metadata from plugin.json"""
    name: str
    version: str
    description: str
    author: dict
    homepage: Optional[str] = None
    repository: Optional[str] = None
    license: Optional[str] = None
    keywords: list[str] = field(default_factory=list)
    
    @classmethod
    def from_dict(cls, data: dict) -> 'PluginMetadata':
        return cls(
            name=data.get("name", "unknown"),
            version=data.get("version", "0.0.0"),
            description=data.get("description", ""),
            author=data.get("author", {}),
            homepage=data.get("homepage"),
            repository=data.get("repository"),
            license=data.get("license"),
            keywords=data.get("keywords", [])
        )


@dataclass
class PluginStructure:
    """
    Standard plugin structure.
    
    Follows Anthropic's format:
    ```
    plugin-name/
    ├── .claude-plugin/
    │   └── plugin.json    # Metadata
    ├── commands/          # Slash commands
    ├── agents/            # Specialized agents
    ├── skills/            # Domain skills
    ├── hooks/             # Event handlers
    ├── settings/          # Configuration
    └── README.md          # Documentation
    ```
    """
    name: str
    path: Path
    metadata: PluginMetadata
    commands: list[dict] = field(default_factory=list)
    agents: list[dict] = field(default_factory=list)
    skills: list[dict] = field(default_factory=list)
    hooks: list[dict] = field(default_factory=list)
    
    @classmethod
    def from_directory(cls, path: Path) -> 'PluginStructure':
        """Load plugin from directory"""
        plugin_json = path / ".claude-plugin" / "plugin.json"
        
        if plugin_json.exists():
            metadata_dict = json.loads(plugin_json.read_text())
            metadata = PluginMetadata.from_dict(metadata_dict)
        else:
            metadata = PluginMetadata(
                name=path.name,
                version="0.0.0",
                description="",
                author={}
            )
        
        # Scan for components
        commands = cls._scan_commands(path)
        agents = cls._scan_agents(path)
        skills = cls._scan_skills(path)
        hooks = cls._scan_hooks(path)
        
        return cls(
            name=metadata.name,
            path=path,
            metadata=metadata,
            commands=commands,
            agents=agents,
            skills=skills,
            hooks=hooks
        )
    
    @staticmethod
    def _scan_commands(path: Path) -> list[dict]:
        """Scan for command definitions"""
        commands_dir = path / "commands"
        if not commands_dir.exists():
            return []
        
        commands = []
        for cmd_file in commands_dir.glob("*.md"):
            # Parse frontmatter for command metadata
            content = cmd_file.read_text()
            commands.append({
                "name": cmd_file.stem,
                "path": str(cmd_file),
                "type": "command"
            })
        return commands
    
    @staticmethod
    def _scan_agents(path: Path) -> list[dict]:
        """Scan for agent definitions"""
        agents_dir = path / "agents"
        if not agents_dir.exists():
            return []
        
        agents = []
        for agent_file in agents_dir.glob("*.md"):
            agents.append({
                "name": agent_file.stem,
                "path": str(agent_file),
                "type": "agent"
            })
        return agents
    
    @staticmethod
    def _scan_skills(path: Path) -> list[dict]:
        """Scan for skill definitions"""
        skills_dir = path / "skills"
        if not skills_dir.exists():
            return []
        
        skills = []
        for skill_file in skills_dir.glob("*.md"):
            skills.append({
                "name": skill_file.stem,
                "path": str(skill_file),
                "type": "skill"
            })
        return skills
    
    @staticmethod
    def _scan_hooks(path: Path) -> list[dict]:
        """Scan for hook definitions"""
        hooks_dir = path / "hooks"
        if not hooks_dir.exists():
            return []
        
        hooks_json = hooks_dir / "hooks.json"
        if hooks_json.exists():
            return json.loads(hooks_json.read_text())
        return []


class PluginRegistry:
    """
    Registry for managing plugins.
    
    Handles:
    - Plugin discovery
    - Loading and unloading
    - Dependency resolution
    - Marketplace integration
    """
    
    def __init__(self, plugin_dirs: Optional[list[Path]] = None):
        self.plugin_dirs = plugin_dirs or [
            Path.home() / ".openclaw" / "plugins",
            Path("/data/.openclaw/workspace/plugins"),
        ]
        self._plugins: dict[str, PluginStructure] = {}
        
    def discover(self) -> list[PluginStructure]:
        """Discover all plugins in configured directories"""
        discovered = []
        
        for plugin_dir in self.plugin_dirs:
            if not plugin_dir.exists():
                continue
                
            for plugin_path in plugin_dir.iterdir():
                if plugin_path.is_dir():
                    try:
                        plugin = PluginStructure.from_directory(plugin_path)
                        discovered.append(plugin)
                        self._plugins[plugin.name] = plugin
                    except Exception as e:
                        print(f"Error loading plugin {plugin_path}: {e}")
        
        return discovered
    
    def get(self, name: str) -> Optional[PluginStructure]:
        """Get a plugin by name"""
        return self._plugins.get(name)
    
    def all(self) -> list[PluginStructure]:
        """Get all loaded plugins"""
        return list(self._plugins.values())
    
    def get_commands(self) -> list[dict]:
        """Get all commands from all plugins"""
        commands = []
        for plugin in self._plugins.values():
            commands.extend(plugin.commands)
        return commands
    
    def get_agents(self) -> list[dict]:
        """Get all agents from all plugins"""
        agents = []
        for plugin in self._plugins.values():
            agents.extend(plugin.agents)
        return agents
    
    def get_skills(self) -> list[dict]:
        """Get all skills from all plugins"""
        skills = []
        for plugin in self._plugins.values():
            skills.extend(plugin.skills)
        return skills
    
    def get_hooks(self) -> list[dict]:
        """Get all hooks from all plugins"""
        hooks = []
        for plugin in self._plugins.values():
            hooks.extend(plugin.hooks)
        return hooks


@dataclass
class PluginBuilder:
    """
    Builder for creating new plugins.
    
    Usage:
    ```python
    plugin = (PluginBuilder("my-plugin")
        .version("1.0.0")
        .description("My awesome plugin")
        .author("Developer", "dev@example.com")
        .add_command("my-cmd", "My command prompt")
        .add_agent("my-agent", "My agent prompt")
        .add_skill("my-skill", "My skill prompt")
        .build())
    ```
    """
    name: str
    _version: str = "1.0.0"
    _description: str = ""
    _author: dict = field(default_factory=dict)
    _commands: list[dict] = field(default_factory=list)
    _agents: list[dict] = field(default_factory=list)
    _skills: list[dict] = field(default_factory=list)
    _hooks: list[dict] = field(default_factory=list)
    
    def __init__(self, name: str):
        self.name = name
        
    def version(self, version: str) -> 'PluginBuilder':
        self._version = version
        return self
    
    def description(self, desc: str) -> 'PluginBuilder':
        self._description = desc
        return self
    
    def author(self, name: str, email: str) -> 'PluginBuilder':
        self._author = {"name": name, "email": email}
        return self
    
    def add_command(self, name: str, prompt: str) -> 'PluginBuilder':
        self._commands.append({"name": name, "prompt": prompt})
        return self
    
    def add_agent(self, name: str, prompt: str, role: str = "sonnet") -> 'PluginBuilder':
        self._agents.append({"name": name, "prompt": prompt, "role": role})
        return self
    
    def add_skill(self, name: str, prompt: str, triggers: list[str] | None = None) -> 'PluginBuilder':
        self._skills.append({
            "name": name,
            "prompt": prompt,
            "triggers": triggers or []
        })
        return self
    
    def add_hook(self, hook_point: str, handler: dict) -> 'PluginBuilder':
        self._hooks.append({"hook_point": hook_point, "handler": handler})
        return self
    
    def build(self) -> PluginStructure:
        """Build the plugin structure"""
        metadata = PluginMetadata(
            name=self.name,
            version=self._version,
            description=self._description,
            author=self._author
        )
        
        return PluginStructure(
            name=self.name,
            path=Path(f"./{self.name}"),
            metadata=metadata,
            commands=self._commands,
            agents=self._agents,
            skills=self._skills,
            hooks=self._hooks
        )


def create_plugin_directory(plugin: PluginStructure, base_path: Path) -> Path:
    """Create a plugin directory structure"""
    plugin_path = base_path / plugin.name
    
    # Create directories
    (plugin_path / ".claude-plugin").mkdir(parents=True, exist_ok=True)
    (plugin_path / "commands").mkdir(exist_ok=True)
    (plugin_path / "agents").mkdir(exist_ok=True)
    (plugin_path / "skills").mkdir(exist_ok=True)
    (plugin_path / "hooks").mkdir(exist_ok=True)
    
    # Write plugin.json
    plugin_json = plugin_path / ".claude-plugin" / "plugin.json"
    plugin_json.write_text(json.dumps({
        "name": plugin.metadata.name,
        "version": plugin.metadata.version,
        "description": plugin.metadata.description,
        "author": plugin.metadata.author
    }, indent=2))
    
    # Write commands
    for cmd in plugin.commands:
        cmd_path = plugin_path / "commands" / f"{cmd['name']}.md"
        cmd_path.write_text(f"---\nname: {cmd['name']}\n---\n\n{cmd.get('prompt', '')}")
    
    # Write agents
    for agent in plugin.agents:
        agent_path = plugin_path / "agents" / f"{agent['name']}.md"
        agent_path.write_text(f"---\nname: {agent['name']}\nrole: {agent.get('role', 'sonnet')}\n---\n\n{agent.get('prompt', '')}")
    
    # Write skills
    for skill in plugin.skills:
        skill_path = plugin_path / "skills" / f"{skill['name']}.md"
        triggers = skill.get('triggers', [])
        triggers_yaml = "\n".join([f"  - \"{t}\"" for t in triggers])
        skill_path.write_text(f"---\nname: {skill['name']}\ntriggers:\n{triggers_yaml}\n---\n\n{skill.get('prompt', '')}")
    
    return plugin_path


# Global registry
_global_plugin_registry = PluginRegistry()


def get_plugin_registry() -> PluginRegistry:
    """Get the global plugin registry"""
    return _global_plugin_registry

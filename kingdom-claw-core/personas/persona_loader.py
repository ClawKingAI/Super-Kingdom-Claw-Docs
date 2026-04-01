"""
Persona Loader — Agent Persona Management

Loads and manages agent personas from the Agency-Agents library.
Provides routing, selection, and integration with Kingdom Claw Core.
"""

from dataclasses import dataclass, field
from typing import Optional
from pathlib import Path
import re


@dataclass
class AgentPersona:
    """An agent persona definition"""
    name: str
    description: str
    color: str = "blue"
    emoji: str = "🤖"
    vibe: str = ""
    category: str = ""
    
    # Full persona content
    identity: str = ""
    mission: str = ""
    critical_rules: list[str] = field(default_factory=list)
    deliverables: str = ""
    communication_style: str = ""
    
    # Full markdown content
    content: str = ""
    path: Path | None = None
    
    @classmethod
    def from_markdown(cls, path: Path) -> 'AgentPersona':
        """Parse persona from markdown file"""
        content = path.read_text()
        
        # Parse frontmatter
        frontmatter = cls._parse_frontmatter(content)
        
        # Parse sections
        identity = cls._extract_section(content, "Identity & Memory")
        mission = cls._extract_section(content, "Core Mission")
        rules = cls._extract_list(content, "Critical Rules")
        deliverables = cls._extract_section(content, "Technical Deliverables")
        style = cls._extract_section(content, "Communication Style")
        
        return cls(
            name=frontmatter.get("name", path.stem),
            description=frontmatter.get("description", ""),
            color=frontmatter.get("color", "blue"),
            emoji=frontmatter.get("emoji", "🤖"),
            vibe=frontmatter.get("vibe", ""),
            category=path.parent.name,
            identity=identity,
            mission=mission,
            critical_rules=rules,
            deliverables=deliverables,
            communication_style=style,
            content=content,
            path=path
        )
    
    @staticmethod
    def _parse_frontmatter(content: str) -> dict:
        """Extract YAML frontmatter"""
        if not content.startswith("---"):
            return {}
        
        # Find end of frontmatter
        end = content.find("---", 3)
        if end == -1:
            return {}
        
        fm = content[3:end].strip()
        result = {}
        
        for line in fm.split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                result[key.strip()] = value.strip().strip('"\'')
        
        return result
    
    @staticmethod
    def _extract_section(content: str, section_name: str) -> str:
        """Extract a section by name"""
        # Pattern: ## 🧠 Section Name or ## Section Name
        pattern = rf"##\s*[🧠🎯🚨📋💬🔧]?\s*{re.escape(section_name)}\s*\n(.*?)(?=##\s|$)"
        match = re.search(pattern, content, re.DOTALL)
        return match.group(1).strip() if match else ""
    
    @staticmethod
    def _extract_list(content: str, section_name: str) -> list[str]:
        """Extract bullet list from a section"""
        section = AgentPersona._extract_section(content, section_name)
        items = []
        for line in section.split("\n"):
            line = line.strip()
            if line.startswith("- ") or line.startswith("* "):
                items.append(line[2:])
        return items
    
    def get_system_prompt(self) -> str:
        """Generate system prompt for this persona"""
        parts = [
            f"# {self.emoji} {self.name}",
            f"\n{self.description}",
            f"\n\n{self.identity}",
            f"\n\n## Mission\n{self.mission}",
        ]
        
        if self.critical_rules:
            parts.append("\n\n## Critical Rules")
            for rule in self.critical_rules:
                parts.append(f"- {rule}")
        
        if self.deliverables:
            parts.append(f"\n\n## Deliverables\n{self.deliverables}")
        
        if self.communication_style:
            parts.append(f"\n\n## Communication Style\n{self.communication_style}")
        
        return "\n".join(parts)


class PersonaRegistry:
    """
    Registry for managing agent personas.
    
    Loads personas from Agency-Agents library and provides
    lookup, routing, and selection functionality.
    """
    
    def __init__(self, persona_dirs: Optional[list[Path]] = None):
        self.persona_dirs = persona_dirs or [
            Path("/data/.openclaw/workspace/agency-agents-clawking"),
            Path.home() / ".openclaw" / "personas",
        ]
        self._personas: dict[str, AgentPersona] = {}
        self._by_category: dict[str, list[AgentPersona]] = {}
        
    def discover(self) -> list[AgentPersona]:
        """Discover and load all personas"""
        discovered = []
        
        for persona_dir in self.persona_dirs:
            if not persona_dir.exists():
                continue
            
            # Walk through categories
            for category_dir in persona_dir.iterdir():
                if not category_dir.is_dir():
                    continue
                if category_dir.name.startswith(".") or category_dir.name in ["scripts", "examples"]:
                    continue
                
                # Load personas in category
                for persona_file in category_dir.glob("*.md"):
                    try:
                        persona = AgentPersona.from_markdown(persona_file)
                        persona.category = category_dir.name
                        discovered.append(persona)
                        self._personas[persona.name.lower()] = persona
                        
                        if category_dir.name not in self._by_category:
                            self._by_category[category_dir.name] = []
                        self._by_category[category_dir.name].append(persona)
                    except Exception as e:
                        print(f"Error loading persona {persona_file}: {e}")
        
        return discovered
    
    def get(self, name: str) -> Optional[AgentPersona]:
        """Get persona by name (case-insensitive)"""
        return self._personas.get(name.lower())
    
    def get_by_category(self, category: str) -> list[AgentPersona]:
        """Get all personas in a category"""
        return self._by_category.get(category, [])
    
    def all(self) -> list[AgentPersona]:
        """Get all loaded personas"""
        return list(self._personas.values())
    
    def categories(self) -> list[str]:
        """Get all categories"""
        return list(self._by_category.keys())
    
    def search(self, query: str) -> list[AgentPersona]:
        """Search personas by name or description"""
        query = query.lower()
        return [
            p for p in self._personas.values()
            if query in p.name.lower() or query in p.description.lower()
        ]
    
    def match_task(self, task: str) -> Optional[AgentPersona]:
        """
        Match a task description to the best persona.
        
        Uses keyword matching to find relevant personas.
        """
        task_lower = task.lower()
        
        # Keyword mapping
        keyword_map = {
            # Engineering
            "frontend": ["frontend-developer", "ui-developer"],
            "backend": ["backend-architect", "api-developer"],
            "api": ["backend-architect", "api-developer"],
            "react": ["frontend-developer"],
            "database": ["database-optimizer", "data-engineer"],
            "security": ["security-engineer"],
            "test": ["test-engineer", "quality-engineer"],
            "devops": ["devops-engineer"],
            "code review": ["code-reviewer"],
            
            # Design
            "design": ["ui-designer", "ux-designer"],
            "ui": ["ui-designer"],
            "ux": ["ux-researcher"],
            "brand": ["brand-guardian"],
            
            # Marketing
            "marketing": ["content-creator", "growth-hacker"],
            "content": ["content-creator"],
            "growth": ["growth-hacker"],
            "seo": ["seo-specialist"],
            "email": ["email-marketer"],
            
            # Sales
            "sales": ["outbound-specialist", "account-executive"],
            "outreach": ["outbound-specialist"],
            "deal": ["deal-strategist"],
            
            # Product
            "product": ["product-manager"],
            "roadmap": ["product-manager"],
            "prioritize": ["product-manager"],
        }
        
        # Find matching keywords
        for keyword, persona_names in keyword_map.items():
            if keyword in task_lower:
                for name in persona_names:
                    persona = self.get(name)
                    if persona:
                        return persona
        
        return None


class PersonaRouter:
    """
    Routes tasks to appropriate personas.
    
    Integrates with Kingdom Claw's hook system for
    automatic persona selection.
    """
    
    def __init__(self, registry: Optional[PersonaRegistry] = None):
        self.registry = registry or PersonaRegistry()
        if not self.registry._personas:
            self.registry.discover()
    
    def route(self, task: str) -> tuple[Optional[AgentPersona], float]:
        """
        Route a task to the best matching persona.
        
        Returns (persona, confidence) tuple.
        """
        persona = self.registry.match_task(task)
        
        if persona:
            return persona, 0.8
        
        # No direct match, search by similarity
        results = self.registry.search(task)
        if results:
            return results[0], 0.5
        
        return None, 0.0
    
    def route_multi(self, task: str, max_personas: int = 3) -> list[tuple[AgentPersona, float]]:
        """
        Route a task to multiple relevant personas.
        
        Returns list of (persona, confidence) tuples.
        """
        results = []
        
        # Search for matching personas
        matches = self.registry.search(task)
        
        # Score by relevance
        for persona in matches[:max_personas]:
            # Simple scoring based on keyword overlap
            task_words = set(task.lower().split())
            persona_words = set(persona.name.lower().split())
            persona_words.update(persona.description.lower().split())
            
            overlap = len(task_words & persona_words)
            score = min(overlap / 5, 1.0)
            
            results.append((persona, score))
        
        return sorted(results, key=lambda x: -x[1])


# Convenience functions
_global_registry: Optional[PersonaRegistry] = None


def get_persona_registry() -> PersonaRegistry:
    """Get the global persona registry"""
    global _global_registry
    if _global_registry is None:
        _global_registry = PersonaRegistry()
        _global_registry.discover()
    return _global_registry


def load_persona(name: str) -> Optional[AgentPersona]:
    """Load a persona by name"""
    return get_persona_registry().get(name)


def get_persona_prompt(name: str) -> str:
    """Get the system prompt for a persona"""
    persona = load_persona(name)
    if persona:
        return persona.get_system_prompt()
    return ""


def list_personas(category: Optional[str] = None) -> list[AgentPersona]:
    """List all personas, optionally filtered by category"""
    registry = get_persona_registry()
    if category:
        return registry.get_by_category(category)
    return registry.all()

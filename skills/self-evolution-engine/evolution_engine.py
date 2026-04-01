"""
Self-Evolution Engine for Kingdom Claw

Core engine for autonomous skill evolution. Based on OpenSpace (HKUDS) architecture.

Three evolution types:
- FIX: Repair broken/outdated instructions (in-place)
- DERIVED: Create enhanced version from existing skill
- CAPTURED: Extract novel reusable pattern from execution

Three trigger sources:
1. Post-execution analysis (every task)
2. Tool degradation monitoring
3. Metric-based health checks
"""

import asyncio
import json
import re
import sqlite3
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from contextlib import contextmanager

# ============================================================================
# Types (from OpenSpace skill_engine/types.py)
# ============================================================================

class SkillCategory(str, Enum):
    TOOL_GUIDE = "tool_guide"
    WORKFLOW = "workflow"
    REFERENCE = "reference"

class SkillVisibility(str, Enum):
    PRIVATE = "private"
    PUBLIC = "public"

class EvolutionType(str, Enum):
    FIX = "fix"
    DERIVED = "derived"
    CAPTURED = "captured"

class SkillOrigin(str, Enum):
    IMPORTED = "imported"
    CAPTURED = "captured"
    DERIVED = "derived"
    FIXED = "fixed"

@dataclass
class SkillLineage:
    origin: SkillOrigin
    generation: int = 0
    parent_skill_ids: List[str] = field(default_factory=list)
    source_task_id: Optional[str] = None
    change_summary: str = ""
    content_diff: str = ""
    content_snapshot: Dict[str, str] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    created_by: str = ""

@dataclass
class SkillJudgment:
    skill_id: str
    skill_applied: bool = False
    note: str = ""

@dataclass
class EvolutionSuggestion:
    evolution_type: EvolutionType
    target_skill_ids: List[str] = field(default_factory=list)
    category: Optional[SkillCategory] = None
    direction: str = ""

@dataclass
class ExecutionAnalysis:
    task_id: str
    timestamp: datetime
    task_completed: bool = False
    execution_note: str = ""
    tool_issues: List[str] = field(default_factory=list)
    skill_judgments: List[SkillJudgment] = field(default_factory=list)
    evolution_suggestions: List[EvolutionSuggestion] = field(default_factory=list)
    analyzed_by: str = ""
    analyzed_at: datetime = field(default_factory=datetime.now)

@dataclass
class SkillRecord:
    skill_id: str
    name: str
    description: str
    path: str = ""
    is_active: bool = True
    category: SkillCategory = SkillCategory.WORKFLOW
    visibility: SkillVisibility = SkillVisibility.PRIVATE
    creator_id: str = ""
    lineage: SkillLineage = field(default_factory=lambda: SkillLineage(origin=SkillOrigin.IMPORTED))
    tool_dependencies: List[str] = field(default_factory=list)
    critical_tools: List[str] = field(default_factory=list)
    total_selections: int = 0
    total_applied: int = 0
    total_completions: int = 0
    total_fallbacks: int = 0
    first_seen: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)

    @property
    def applied_rate(self) -> float:
        return self.total_applied / self.total_selections if self.total_selections else 0.0

    @property
    def completion_rate(self) -> float:
        return self.total_completions / self.total_applied if self.total_applied else 0.0

    @property
    def effective_rate(self) -> float:
        return self.total_completions / self.total_selections if self.total_selections else 0.0

    @property
    def fallback_rate(self) -> float:
        return self.total_fallbacks / self.total_selections if self.total_selections else 0.0

# ============================================================================
# Skill Store (SQLite persistence)
# ============================================================================

class SkillStore:
    """SQLite-based skill registry and evolution history."""
    
    DB_PATH = Path("/data/.openclaw/workspace/.openspace/openspace.db")
    
    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = db_path or self.DB_PATH
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
    
    @contextmanager
    def _get_conn(self):
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()
    
    def _init_db(self):
        schema_path = Path("/data/.openclaw/workspace/.openspace/schema.sql")
        if schema_path.exists():
            schema = schema_path.read_text()
        else:
            schema = self._get_inline_schema()
        
        with self._get_conn() as conn:
            conn.executescript(schema)
            conn.commit()
    
    def _get_inline_schema(self) -> str:
        """Minimal inline schema if file not found."""
        return """
        CREATE TABLE IF NOT EXISTS skill_records (
            skill_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            path TEXT NOT NULL DEFAULT '',
            is_active INTEGER NOT NULL DEFAULT 1,
            category TEXT NOT NULL DEFAULT 'workflow',
            lineage_origin TEXT NOT NULL DEFAULT 'imported',
            lineage_generation INTEGER NOT NULL DEFAULT 0,
            lineage_change_summary TEXT NOT NULL DEFAULT '',
            total_selections INTEGER NOT NULL DEFAULT 0,
            total_applied INTEGER NOT NULL DEFAULT 0,
            total_completions INTEGER NOT NULL DEFAULT 0,
            total_fallbacks INTEGER NOT NULL DEFAULT 0,
            first_seen TEXT NOT NULL,
            last_updated TEXT NOT NULL
        );
        """
    
    def get_skill(self, skill_id: str) -> Optional[SkillRecord]:
        with self._get_conn() as conn:
            row = conn.execute(
                "SELECT * FROM skill_records WHERE skill_id = ?", (skill_id,)
            ).fetchone()
            return self._row_to_record(row) if row else None
    
    def get_active_skills(self) -> List[SkillRecord]:
        with self._get_conn() as conn:
            rows = conn.execute(
                "SELECT * FROM skill_records WHERE is_active = 1"
            ).fetchall()
            return [self._row_to_record(r) for r in rows]
    
    def save_skill(self, record: SkillRecord):
        with self._get_conn() as conn:
            conn.execute("""
                INSERT OR REPLACE INTO skill_records (
                    skill_id, name, description, path, is_active, category,
                    lineage_origin, lineage_generation, lineage_change_summary,
                    total_selections, total_applied, total_completions, total_fallbacks,
                    first_seen, last_updated, lineage_created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                record.skill_id, record.name, record.description, record.path,
                1 if record.is_active else 0, record.category.value,
                record.lineage.origin.value, record.lineage.generation,
                record.lineage.change_summary,
                record.total_selections, record.total_applied,
                record.total_completions, record.total_fallbacks,
                record.first_seen.isoformat(), record.last_updated.isoformat(),
                record.lineage.created_at.isoformat()
            ))
            conn.commit()
    
    def record_analysis(self, analysis: ExecutionAnalysis):
        """Record execution analysis and update skill counters."""
        with self._get_conn() as conn:
            analysis_id = str(uuid.uuid4())
            conn.execute("""
                INSERT INTO execution_analyses (
                    analysis_id, task_id, timestamp, task_completed,
                    execution_note, analyzed_by, analyzed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                analysis_id, analysis.task_id, analysis.timestamp.isoformat(),
                1 if analysis.task_completed else 0,
                analysis.execution_note, analysis.analyzed_by,
                analysis.analyzed_at.isoformat()
            ))
            
            # Record skill judgments
            for j in analysis.skill_judgments:
                conn.execute("""
                    INSERT INTO skill_judgments (
                        analysis_id, skill_id, skill_applied, note
                    ) VALUES (?, ?, ?, ?)
                """, (analysis_id, j.skill_id, 1 if j.skill_applied else 0, j.note))
                
                # Update skill counters atomically
                conn.execute("""
                    UPDATE skill_records SET
                        total_selections = total_selections + 1,
                        total_applied = total_applied + ?,
                        total_completions = total_completions + ?,
                        total_fallbacks = total_fallbacks + ?,
                        last_updated = ?
                    WHERE skill_id = ?
                """, (
                    1 if j.skill_applied else 0,
                    1 if (j.skill_applied and analysis.task_completed) else 0,
                    1 if (not j.skill_applied) else 0,
                    datetime.now().isoformat(),
                    j.skill_id
                ))
            
            conn.commit()
    
    def _row_to_record(self, row: sqlite3.Row) -> SkillRecord:
        def safe_get(key, default=None):
            try:
                val = row[key]
                return val if val is not None else default
            except (KeyError, IndexError):
                return default
        
        return SkillRecord(
            skill_id=row["skill_id"],
            name=row["name"],
            description=row["description"] or "",
            path=row["path"] or "",
            is_active=bool(row["is_active"]),
            category=SkillCategory(row["category"]) if row["category"] else SkillCategory.WORKFLOW,
            lineage=SkillLineage(
                origin=SkillOrigin(row["lineage_origin"]) if row["lineage_origin"] else SkillOrigin.IMPORTED,
                generation=safe_get("lineage_generation", 0) or 0,
                change_summary=safe_get("lineage_change_summary", "") or "",
            ),
            total_selections=safe_get("total_selections", 0) or 0,
            total_applied=safe_get("total_applied", 0) or 0,
            total_completions=safe_get("total_completions", 0) or 0,
            total_fallbacks=safe_get("total_fallbacks", 0) or 0,
        )

# ============================================================================
# Skill Registry (Discovery & Matching)
# ============================================================================

class SkillRegistry:
    """Discover, load, match, and inject skills."""
    
    SKILL_FILENAME = "SKILL.md"
    SKILL_ID_FILENAME = ".skill_id"
    
    def __init__(self, skill_dirs: List[Path], store: SkillStore):
        self.skill_dirs = skill_dirs
        self.store = store
        self._cache: Dict[str, SkillRecord] = {}
    
    def discover(self) -> List[SkillRecord]:
        """Discover all skills from configured directories."""
        skills = []
        for skill_dir in self.skill_dirs:
            if not skill_dir.exists():
                continue
            for subdir in skill_dir.iterdir():
                if subdir.is_dir() and (subdir / self.SKILL_FILENAME).exists():
                    record = self._load_skill(subdir)
                    if record:
                        skills.append(record)
                        self._cache[record.skill_id] = record
        return skills
    
    def _load_skill(self, skill_dir: Path) -> Optional[SkillRecord]:
        """Load skill from directory, creating ID if needed."""
        skill_file = skill_dir / self.SKILL_FILENAME
        if not skill_file.exists():
            return None
        
        content = skill_file.read_text(encoding="utf-8")
        frontmatter, body = self._parse_frontmatter(content)
        
        name = frontmatter.get("name", skill_dir.name)
        description = frontmatter.get("description", "")
        
        # Read or create skill_id
        skill_id = self._read_or_create_skill_id(name, skill_dir)
        
        # Check if record exists in DB
        existing = self.store.get_skill(skill_id)
        if existing:
            existing.name = name
            existing.description = description
            existing.path = str(skill_dir)
            return existing
        
        return SkillRecord(
            skill_id=skill_id,
            name=name,
            description=description,
            path=str(skill_dir),
        )
    
    def _read_or_create_skill_id(self, name: str, skill_dir: Path) -> str:
        """Read skill_id from sidecar, or create one."""
        id_file = skill_dir / self.SKILL_ID_FILENAME
        if id_file.exists():
            return id_file.read_text(encoding="utf-8").strip()
        
        new_id = f"{name}__imp_{uuid.uuid4().hex[:8]}"
        id_file.write_text(new_id + "\n", encoding="utf-8")
        return new_id
    
    def _parse_frontmatter(self, content: str) -> Tuple[Dict[str, str], str]:
        """Parse YAML frontmatter from SKILL.md."""
        if not content.startswith("---"):
            return {}, content
        
        parts = content.split("---", 2)
        if len(parts) < 3:
            return {}, content
        
        # Simple YAML-like parsing without external dependency
        frontmatter = {}
        for line in parts[1].strip().split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                frontmatter[key] = value
        
        return frontmatter, parts[2].strip()
    
    def search(self, query: str, limit: int = 20) -> List[SkillRecord]:
        """Search skills by name/description using FTS5."""
        # Simple implementation: filter by substring
        # TODO: Use FTS5 when available
        skills = self.discover()
        query_lower = query.lower()
        scored = []
        for s in skills:
            score = 0
            if query_lower in s.name.lower():
                score += 10
            if query_lower in s.description.lower():
                score += 5
            if score > 0:
                scored.append((score, s))
        
        scored.sort(key=lambda x: -x[0])
        return [s for _, s in scored[:limit]]

# ============================================================================
# Patch System
# ============================================================================

class PatchType(str, Enum):
    AUTO = "auto"
    FULL = "full"
    DIFF = "diff"
    PATCH = "patch"

@dataclass
class SkillEditResult:
    skill_dir: Path
    content_diff: str = ""
    content_snapshot: Dict[str, str] = field(default_factory=dict)
    error: Optional[str] = None
    
    @property
    def ok(self) -> bool:
        return self.error is None

def apply_fix(skill_dir: Path, new_content: str) -> SkillEditResult:
    """Apply FIX evolution - in-place repair of SKILL.md."""
    skill_file = skill_dir / "SKILL.md"
    if not skill_file.exists():
        return SkillEditResult(skill_dir, error=f"SKILL.md not found: {skill_file}")
    
    old_content = skill_file.read_text(encoding="utf-8")
    
    # Compute unified diff
    import difflib
    diff = "".join(difflib.unified_diff(
        old_content.splitlines(keepends=True),
        new_content.splitlines(keepends=True),
        fromfile="SKILL.md",
        tofile="SKILL.md"
    ))
    
    # Create snapshot
    snapshot = {"SKILL.md": new_content}
    for f in skill_dir.iterdir():
        if f.is_file() and f.name != "SKILL.md" and f.name != ".skill_id":
            try:
                snapshot[f.name] = f.read_text(encoding="utf-8")
            except:
                pass
    
    # Write new content
    skill_file.write_text(new_content, encoding="utf-8")
    
    return SkillEditResult(
        skill_dir=skill_dir,
        content_diff=diff,
        content_snapshot=snapshot
    )

# ============================================================================
# Evolution Engine
# ============================================================================

class EvolutionEngine:
    """Core evolution logic - FIX, DERIVED, CAPTURED."""
    
    SKILLS_DIR = Path("/data/.openclaw/workspace/skills")
    
    def __init__(self, store: SkillStore, registry: SkillRegistry):
        self.store = store
        self.registry = registry
    
    def evolve_fix(self, skill_id: str, direction: str, new_content: str) -> Optional[SkillRecord]:
        """FIX: In-place repair of existing skill."""
        old_record = self.store.get_skill(skill_id)
        if not old_record:
            return None
        
        skill_dir = Path(old_record.path)
        result = apply_fix(skill_dir, new_content)
        
        if not result.ok:
            return None
        
        # Create new record (new version)
        new_id = f"{old_record.name}__v{old_record.lineage.generation + 1}_{uuid.uuid4().hex[:8]}"
        new_record = SkillRecord(
            skill_id=new_id,
            name=old_record.name,
            description=old_record.description,
            path=old_record.path,
            category=old_record.category,
            lineage=SkillLineage(
                origin=SkillOrigin.FIXED,
                generation=old_record.lineage.generation + 1,
                parent_skill_ids=[skill_id],
                change_summary=direction,
                content_diff=result.content_diff,
                content_snapshot=result.content_snapshot,
            )
        )
        
        # Deactivate old, activate new
        old_record.is_active = False
        self.store.save_skill(old_record)
        self.store.save_skill(new_record)
        
        return new_record
    
    def evolve_derived(self, parent_ids: List[str], name: str, 
                       direction: str, content: str) -> Optional[SkillRecord]:
        """DERIVED: Create enhanced version from parent(s)."""
        parents = [self.store.get_skill(pid) for pid in parent_ids]
        parents = [p for p in parents if p]
        
        if not parents:
            return None
        
        # Create new skill directory
        skill_dir = self.SKILLS_DIR / name.lower().replace(" ", "-").replace("_", "-")
        skill_dir.mkdir(parents=True, exist_ok=True)
        
        # Write SKILL.md
        (skill_dir / "SKILL.md").write_text(content, encoding="utf-8")
        
        # Generate skill_id
        max_gen = max(p.lineage.generation for p in parents)
        new_id = f"{name}__v{max_gen + 1}_{uuid.uuid4().hex[:8]}"
        (skill_dir / ".skill_id").write_text(new_id + "\n", encoding="utf-8")
        
        # Create record
        new_record = SkillRecord(
            skill_id=new_id,
            name=name,
            description=f"Derived from {', '.join(p.name for p in parents)}",
            path=str(skill_dir),
            lineage=SkillLineage(
                origin=SkillOrigin.DERIVED,
                generation=max_gen + 1,
                parent_skill_ids=parent_ids,
                change_summary=direction,
            )
        )
        
        self.store.save_skill(new_record)
        return new_record
    
    def evolve_captured(self, name: str, category: SkillCategory,
                        direction: str, content: str) -> Optional[SkillRecord]:
        """CAPTURED: Extract novel pattern from execution."""
        skill_dir = self.SKILLS_DIR / name.lower().replace(" ", "-").replace("_", "-")
        skill_dir.mkdir(parents=True, exist_ok=True)
        
        (skill_dir / "SKILL.md").write_text(content, encoding="utf-8")
        
        new_id = f"{name}__imp_{uuid.uuid4().hex[:8]}"
        (skill_dir / ".skill_id").write_text(new_id + "\n", encoding="utf-8")
        
        new_record = SkillRecord(
            skill_id=new_id,
            name=name,
            description=direction,
            path=str(skill_dir),
            category=category,
            lineage=SkillLineage(
                origin=SkillOrigin.CAPTURED,
                generation=0,
                change_summary=direction,
            )
        )
        
        self.store.save_skill(new_record)
        return new_record

# ============================================================================
# Quality Monitor
# ============================================================================

class QualityMonitor:
    """Monitor skill quality metrics and trigger evolution."""
    
    # Thresholds
    MIN_SELECTIONS = 5  # Minimum selections before monitoring
    LOW_APPLIED_RATE = 0.5  # Below this = skill not being used
    LOW_COMPLETION_RATE = 0.6  # Below this = skill not effective
    HIGH_FALLBACK_RATE = 0.3  # Above this = skill often unusable
    
    def __init__(self, store: SkillStore, engine: EvolutionEngine):
        self.store = store
        self.engine = engine
    
    def check_skills(self) -> List[EvolutionSuggestion]:
        """Scan all active skills for quality issues."""
        suggestions = []
        skills = self.store.get_active_skills()
        
        for skill in skills:
            if skill.total_selections < self.MIN_SELECTIONS:
                continue
            
            # Check applied rate
            if skill.applied_rate < self.LOW_APPLIED_RATE:
                suggestions.append(EvolutionSuggestion(
                    evolution_type=EvolutionType.FIX,
                    target_skill_ids=[skill.skill_id],
                    direction=f"Low applied rate ({skill.applied_rate:.1%}) - skill often not used when selected"
                ))
            
            # Check completion rate
            if skill.completion_rate < self.LOW_COMPLETION_RATE:
                suggestions.append(EvolutionSuggestion(
                    evolution_type=EvolutionType.FIX,
                    target_skill_ids=[skill.skill_id],
                    direction=f"Low completion rate ({skill.completion_rate:.1%}) - skill applied but tasks fail"
                ))
            
            # Check fallback rate
            if skill.fallback_rate > self.HIGH_FALLBACK_RATE:
                suggestions.append(EvolutionSuggestion(
                    evolution_type=EvolutionType.FIX,
                    target_skill_ids=[skill.skill_id],
                    direction=f"High fallback rate ({skill.fallback_rate:.1%}) - skill often unusable"
                ))
        
        return suggestions

# ============================================================================
# Main Interface
# ============================================================================

class SelfEvolutionEngine:
    """Main entry point for self-evolution."""
    
    def __init__(self):
        self.store = SkillStore()
        self.registry = SkillRegistry(
            skill_dirs=[
                Path("/data/.openclaw/workspace/skills"),
                Path("/data/.openclaw/skills"),
            ],
            store=self.store
        )
        self.engine = EvolutionEngine(self.store, self.registry)
        self.monitor = QualityMonitor(self.store, self.engine)
    
    def initialize(self):
        """Initialize engine - discover and register all skills."""
        skills = self.registry.discover()
        for skill in skills:
            self.store.save_skill(skill)
        return len(skills)
    
    def analyze_execution(self, task_id: str, skills_used: List[str],
                          task_completed: bool, execution_note: str = "") -> ExecutionAnalysis:
        """Analyze task execution and generate evolution suggestions."""
        analysis = ExecutionAnalysis(
            task_id=task_id,
            timestamp=datetime.now(),
            task_completed=task_completed,
            execution_note=execution_note,
            analyzed_by="kingdom-claw",
        )
        
        # Add skill judgments
        for skill_id in skills_used:
            analysis.skill_judgments.append(SkillJudgment(
                skill_id=skill_id,
                skill_applied=True,  # If listed, it was used
                note=""
            ))
        
        # Record analysis
        self.store.record_analysis(analysis)
        
        return analysis
    
    def check_health(self) -> List[EvolutionSuggestion]:
        """Check skill health and return evolution suggestions."""
        return self.monitor.check_skills()
    
    def get_skill_report(self) -> Dict[str, Any]:
        """Generate skill health report."""
        skills = self.store.get_active_skills()
        return {
            "total_skills": len(skills),
            "skills": [
                {
                    "name": s.name,
                    "skill_id": s.skill_id,
                    "category": s.category.value,
                    "metrics": {
                        "selections": s.total_selections,
                        "applied": s.total_applied,
                        "completions": s.total_completions,
                        "fallbacks": s.total_fallbacks,
                        "applied_rate": f"{s.applied_rate:.1%}",
                        "completion_rate": f"{s.completion_rate:.1%}",
                        "effective_rate": f"{s.effective_rate:.1%}",
                    }
                }
                for s in sorted(skills, key=lambda x: -x.total_selections)
            ]
        }

# CLI entry point
if __name__ == "__main__":
    import sys
    
    engine = SelfEvolutionEngine()
    count = engine.initialize()
    print(f"Initialized: {count} skills discovered")
    
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "report":
            report = engine.get_skill_report()
            print(json.dumps(report, indent=2))
        elif cmd == "health":
            suggestions = engine.check_health()
            print(f"Found {len(suggestions)} evolution suggestions:")
            for s in suggestions:
                print(f"  - {s.evolution_type.value}: {s.direction}")

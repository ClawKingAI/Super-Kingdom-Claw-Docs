-- OpenSpace-compatible SQLite schema for Kingdom Claw self-evolution
-- Location: .openspace/openspace.db

-- Skill Records: identity + lineage + quality
CREATE TABLE IF NOT EXISTS skill_records (
    skill_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    path TEXT NOT NULL DEFAULT '',
    is_active INTEGER NOT NULL DEFAULT 1,
    category TEXT NOT NULL DEFAULT 'workflow',
    visibility TEXT NOT NULL DEFAULT 'private',
    creator_id TEXT NOT NULL DEFAULT '',
    
    -- Lineage
    lineage_origin TEXT NOT NULL DEFAULT 'imported',
    lineage_generation INTEGER NOT NULL DEFAULT 0,
    lineage_source_task_id TEXT,
    lineage_change_summary TEXT NOT NULL DEFAULT '',
    lineage_content_diff TEXT NOT NULL DEFAULT '',
    lineage_content_snapshot TEXT NOT NULL DEFAULT '{}',
    lineage_created_at TEXT NOT NULL,
    lineage_created_by TEXT NOT NULL DEFAULT '',
    
    -- Quality metrics
    total_selections INTEGER NOT NULL DEFAULT 0,
    total_applied INTEGER NOT NULL DEFAULT 0,
    total_completions INTEGER NOT NULL DEFAULT 0,
    total_fallbacks INTEGER NOT NULL DEFAULT 0,
    
    -- Metadata
    first_seen TEXT NOT NULL,
    last_updated TEXT NOT NULL
);

-- Lineage parent-child relationships (many-to-many)
CREATE TABLE IF NOT EXISTS skill_lineage_parents (
    child_skill_id TEXT NOT NULL,
    parent_skill_id TEXT NOT NULL,
    PRIMARY KEY (child_skill_id, parent_skill_id),
    FOREIGN KEY (child_skill_id) REFERENCES skill_records(skill_id),
    FOREIGN KEY (parent_skill_id) REFERENCES skill_records(skill_id)
);

-- Execution analyses (one per task)
CREATE TABLE IF NOT EXISTS execution_analyses (
    analysis_id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    task_completed INTEGER NOT NULL DEFAULT 0,
    execution_note TEXT NOT NULL DEFAULT '',
    tool_issues TEXT NOT NULL DEFAULT '[]',
    analyzed_by TEXT NOT NULL DEFAULT '',
    analyzed_at TEXT NOT NULL
);

-- Per-skill judgments within an analysis
CREATE TABLE IF NOT EXISTS skill_judgments (
    analysis_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    skill_applied INTEGER NOT NULL DEFAULT 0,
    note TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (analysis_id, skill_id),
    FOREIGN KEY (analysis_id) REFERENCES execution_analyses(analysis_id),
    FOREIGN KEY (skill_id) REFERENCES skill_records(skill_id)
);

-- Evolution suggestions from analyses
CREATE TABLE IF NOT EXISTS evolution_suggestions (
    suggestion_id TEXT PRIMARY KEY,
    analysis_id TEXT NOT NULL,
    evolution_type TEXT NOT NULL,  -- 'fix', 'derived', 'captured'
    target_skill_ids TEXT NOT NULL DEFAULT '[]',
    category TEXT,
    direction TEXT NOT NULL DEFAULT '',
    applied INTEGER NOT NULL DEFAULT 0,
    applied_at TEXT,
    FOREIGN KEY (analysis_id) REFERENCES execution_analyses(analysis_id)
);

-- Tool dependencies for skills
CREATE TABLE IF NOT EXISTS skill_tool_deps (
    skill_id TEXT NOT NULL,
    tool_key TEXT NOT NULL,
    is_critical INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (skill_id, tool_key),
    FOREIGN KEY (skill_id) REFERENCES skill_records(skill_id)
);

-- Auxiliary tags for skills
CREATE TABLE IF NOT EXISTS skill_tags (
    skill_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (skill_id, tag),
    FOREIGN KEY (skill_id) REFERENCES skill_records(skill_id)
);

-- Tool quality tracking
CREATE TABLE IF NOT EXISTS tool_quality (
    tool_key TEXT PRIMARY KEY,
    total_calls INTEGER NOT NULL DEFAULT 0,
    total_successes INTEGER NOT NULL DEFAULT 0,
    total_failures INTEGER NOT NULL DEFAULT 0,
    last_success TEXT,
    last_failure TEXT,
    last_error_message TEXT,
    flagged INTEGER NOT NULL DEFAULT 0,
    flagged_reason TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_skill_records_name ON skill_records(name);
CREATE INDEX IF NOT EXISTS idx_skill_records_active ON skill_records(is_active);
CREATE INDEX IF NOT EXISTS idx_skill_records_category ON skill_records(category);
CREATE INDEX IF NOT EXISTS idx_execution_analyses_task ON execution_analyses(task_id);
CREATE INDEX IF NOT EXISTS idx_execution_analyses_timestamp ON execution_analyses(timestamp);
CREATE INDEX IF NOT EXISTS idx_skill_judgments_skill ON skill_judgments(skill_id);
CREATE INDEX IF NOT EXISTS idx_evolution_suggestions_type ON evolution_suggestions(evolution_type);

-- FTS5 for skill search
CREATE VIRTUAL TABLE IF NOT EXISTS skill_search USING fts5(
    skill_id,
    name,
    description,
    content='skill_records',
    content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS skill_search_insert AFTER INSERT ON skill_records BEGIN
    INSERT INTO skill_search(rowid, skill_id, name, description)
    VALUES (new.rowid, new.skill_id, new.name, new.description);
END;

CREATE TRIGGER IF NOT EXISTS skill_search_update AFTER UPDATE ON skill_records BEGIN
    UPDATE skill_search SET 
        name = new.name,
        description = new.description
    WHERE rowid = new.rowid;
END;

CREATE TRIGGER IF NOT EXISTS skill_search_delete AFTER DELETE ON skill_records BEGIN
    DELETE FROM skill_search WHERE rowid = old.rowid;
END;

# Antigravity Skills — Production Agent Skills

> **21 Battle-Tested Skills** — Ready-to-use agent capabilities

---

## What This Is

Antigravity Awesome Skills provides **21 production-ready agent skills** designed for real-world use. Each skill follows a structured format with:
- Clear triggers
- Tool specifications
- System prompts
- Output guidelines

---

## Skills Overview

| Skill | Purpose | Triggers |
|-------|---------|----------|
| `codebase-analyzer` | Analyze code structure, dependencies, architecture | "analyze codebase", "understand structure" |
| `bug-fixer` | Identify and fix bugs in code | "fix bug", "debug issue", "error" |
| `feature-implementer` | Implement new features | "implement feature", "add feature" |
| `test-generator` | Generate test cases | "generate tests", "write tests" |
| `code-reviewer` | Review code for issues | "review code", "code review" |
| `documenter` | Generate documentation | "document code", "write docs" |
| `refactorer` | Refactor and improve code | "refactor", "improve code" |
| `optimizer` | Optimize performance | "optimize", "improve performance" |
| `security-auditor` | Find security vulnerabilities | "security audit", "vulnerability" |
| `api-designer` | Design API endpoints | "design api", "create api" |
| `database-designer` | Design database schemas | "design database", "create schema" |
| `devops-automator` | Automate deployment | "automate deployment", "devops" |
| `dependency-manager` | Manage dependencies | "update dependencies", "manage packages" |
| `performance-profiler` | Profile and analyze performance | "profile", "analyze performance" |
| `error-handler` | Implement error handling | "add error handling", "handle errors" |
| `logging-implementer` | Add logging | "add logging", "implement logging" |
| `config-generator` | Generate configuration | "generate config", "create config" |
| `migration-creator` | Create database migrations | "create migration", "database migration" |
| `scaffold-generator` | Generate project scaffolds | "scaffold", "create project" |
| `cli-builder` | Build CLI interfaces | "build cli", "create cli" |
| `hook-implementer` | Implement webhooks/hooks | "implement hook", "webhook" |

---

## Skill Structure

Each skill follows this format:

```yaml
---
name: Codebase Analyzer
description: Analyzes code structure and architecture
triggers:
  - "analyze codebase"
  - "understand structure"
  - "codebase overview"
tools:
  - read
  - exec
  - web_search
---

# Codebase Analyzer

## Mission
Analyze code structure and provide architectural overview.

## Steps
1. Scan directory structure
2. Identify entry points
3. Map dependencies
4. Analyze patterns
5. Generate overview

## Output Format
### Architecture Overview
[High-level architecture]

### Key Files
[List of important files]

### Dependencies
[Dependency graph]

### Recommendations
[Improvement suggestions]
```

---

## Integration with Kingdom Claw

### Method 1: Copy to Skills Directory

```bash
# Copy all skills
cp -r antigravity-awesome-skills/skills/* ~/.openclaw/skills/

# Copy specific skills
cp -r antigravity-awesome-skills/skills/bug-fixer ~/.openclaw/skills/
```

### Method 2: Use with Persona System

```python
from kingdom_claw_core.personas import load_persona
from kingdom_claw_core.skills import load_skill

# Combine persona + skill
persona = load_persona("backend-architect")
skill = load_skill("codebase-analyzer")

# Generate system prompt
system_prompt = persona.get_system_prompt() + "\n\n" + skill.get_prompt()
```

### Method 3: Spawn with Skill

```python
from kingdom_claw_core.plugins.parallel_agents import AgentTask, AgentRole

task = AgentTask(
    name="analyze",
    role=AgentRole.SONNET,
    prompt=load_skill("codebase-analyzer").get_prompt() + "\n\nAnalyze this project"
)
```

---

## Key Skills Deep Dive

### 1. Codebase Analyzer

**Purpose:** Understand project architecture quickly.

**What it does:**
- Scans directory structure
- Identifies entry points
- Maps dependencies
- Detects patterns
- Generates architecture overview

**Output includes:**
- Architecture diagram
- Key files list
- Dependency graph
- Recommendations

---

### 2. Bug Fixer

**Purpose:** Identify and fix bugs systematically.

**Process:**
1. Reproduce the bug
2. Isolate the cause
3. Identify affected areas
4. Implement fix
5. Add test case
6. Verify fix

**Output format:**
```
### Bug Analysis
- Root cause: [analysis]
- Affected files: [list]

### Fix Applied
- Changes: [description]
- Files modified: [list]

### Verification
- Test added: [test case]
- Fix verified: [yes/no]
```

---

### 3. Security Auditor

**Purpose:** Find security vulnerabilities.

**Checks for:**
- SQL injection
- XSS vulnerabilities
- Authentication flaws
- Authorization issues
- Sensitive data exposure
- Security misconfigurations

**Output format:**
```
### Security Audit Report

#### Critical Issues
- [severity] [issue]

#### High Severity
- [severity] [issue]

#### Recommendations
- [fix recommendations]
```

---

### 4. Performance Profiler

**Purpose:** Analyze and optimize performance.

**Analyzes:**
- CPU usage
- Memory allocation
- I/O operations
- Network calls
- Database queries

**Output:**
```
### Performance Profile

#### Bottlenecks Identified
- [bottleneck]: [impact]

#### Optimization Opportunities
- [opportunity]: [expected improvement]

#### Recommendations
- [recommendations]
```

---

## Skill Quality Standards

Each Antigravity skill follows these standards:

### 1. Clear Triggers
```yaml
triggers:
  - "specific phrase"
  - "another phrase"
```

### 2. Tool Specification
```yaml
tools:
  - read
  - write
  - exec
  - web_search
```

### 3. Step-by-Step Process
```markdown
## Steps
1. First step
2. Second step
3. Third step
```

### 4. Output Format
```markdown
## Output Format
### Section 1
[content]

### Section 2
[content]
```

### 5. Quality Gates
```markdown
## Quality Gates
- [ ] All tests pass
- [ ] No regressions
- [ ] Documentation updated
```

---

## Comparison: Antigravity vs. Agency-Agents

| Aspect | Antigravity Skills | Agency-Agents |
|--------|-------------------|---------------|
| Focus | Task execution | Persona personalities |
| Format | SKILL.md | Persona markdown |
| Tools | Explicit tool lists | Implicit tool access |
| Output | Structured output format | Communication style |
| Count | 21 skills | 194 personas |

**Key difference:** Skills define **what to do**, personas define **who to be**.

---

## Combining Skills + Personas

### Example: Bug Fix with Persona

```python
# Persona: who to be
persona = load_persona("security-engineer")

# Skill: what to do
skill = load_skill("security-auditor")

# Combined prompt
system_prompt = f"""
{persona.get_system_prompt()}

{skill.get_prompt()}

Task: Audit this codebase for security issues.
"""
```

### Example: Code Review with Persona

```python
persona = load_persona("code-reviewer")
skill = load_skill("code-reviewer")

# Persona provides tone and expertise
# Skill provides process and output format
```

---

## Best Practices

### 1. Skill Selection
Match skill to task type:
- Bug → `bug-fixer`
- Architecture → `codebase-analyzer`
- Security → `security-auditor`
- Performance → `performance-profiler`

### 2. Tool Permissions
Each skill specifies required tools. Ensure permissions are set:
```yaml
# In config.yaml
tools:
  permissions:
    exec: elevated  # For bug-fixer, optimizer
    write: elevated  # For refactorer, implementer
```

### 3. Output Validation
Skills define output formats. Validate results:
```python
result = execute_skill("codebase-analyzer")
assert "Architecture Overview" in result
assert "Key Files" in result
```

---

## Installation

```bash
# Clone repository
git clone https://github.com/sickn33/antigravity-awesome-skills.git

# Copy to Kingdom Claw
cp -r antigravity-awesome-skills/skills/* ~/.openclaw/skills/

# Verify
ls ~/.openclaw/skills/
```

---

## Integration Checklist

- [ ] Copy skills to `~/.openclaw/skills/`
- [ ] Configure tool permissions
- [ ] Test each skill
- [ ] Add skill router hook
- [ ] Integrate with persona system
- [ ] Document in Super Kingdom Claw Docs

---

## Resources

- **Repository**: https://github.com/sickn33/antigravity-awesome-skills
- **Skill Count**: 21
- **Format**: SKILL.md (compatible with Kingdom Claw)
- **License**: MIT

---

## Summary

Antigravity skills provide **task-specific execution patterns** while Agency-Agents provide **personality templates**. Together they form a complete system:

| Layer | What | Source |
|-------|------|--------|
| **Who** | Personas | Agency-Agents |
| **What** | Skills | Antigravity |
| **How** | Patterns | Agentic Design |
| **Where** | Architecture | Kingdom Claw Core |

**Skills + Personas + Patterns + Architecture = Complete Agent System**

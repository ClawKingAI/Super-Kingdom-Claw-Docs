# Skills System — How Capabilities Work

> **Modular Excellence** — Understanding Kingdom Claw's skill architecture

---

## What Are Skills?

Skills are **modular capabilities** that enhance agent behavior. Each skill:

- Defines what triggers it (phrases, patterns)
- Lists required tools
- Contains domain-specific prompts
- Can reference external scripts
- Is self-contained and portable

Skills transform a generic AI agent into a specialized system for specific tasks.

---

## Skill Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    SKILLS SYSTEM                              │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. SKILL DISCOVERY                                    │   │
│  │     • Scan directories                                 │   │
│  │     • Load SKILL.md files                              │   │
│  │     • Parse frontmatter                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  2. TRIGGER MATCHING                                   │   │
│  │     • Check message against triggers                   │   │
│  │     • Score by relevance                               │   │
│  │     • Select best match                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  3. CONTEXT INJECTION                                  │   │
│  │     • Add skill prompt to system                       │   │
│  │     • Filter available tools                           │   │
│  │     • Load skill-specific config                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  4. EXECUTION                                          │   │
│  │     • Run with skill context                           │   │
│  │     • Monitor for skill-specific behavior              │   │
│  │     • Post-process if needed                           │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Skill Structure

### Directory Layout

```
my-skill/
├── SKILL.md          # Skill definition (required)
├── scripts/          # Optional helper scripts
│   ├── preprocess.sh
│   └── postprocess.py
├── references/       # Optional reference files
│   └── example.yaml
└── README.md         # Optional documentation
```

### SKILL.md Format

```yaml
---
# Frontmatter (YAML)
name: my-skill
description: What this skill does
version: 1.0.0
author: Your Name

# Triggers
triggers:
  - phrase: "trigger phrase"
  - phrase: "another trigger"
  - pattern: "^regex pattern$"

# Tools this skill needs
tools:
  - read
  - write
  - exec

# Optional configuration
config:
  setting: value
  timeout: 30

# Dependencies on other skills
dependencies:
  - other-skill
---

# Skill Prompt (Markdown)

You are operating in [specific domain/context].

## Instructions

1. First step
2. Second step
3. Third step

## Output Format

Provide output in this format:
- Item 1
- Item 2

## Examples

Example 1: [demonstration]

Example 2: [demonstration]
```

---

## Skill Loading

Skills are loaded from multiple directories:

```
1. ~/.openclaw/skills/           # User skills (highest priority)
2. ~/.openclaw/workspace/skills/ # Workspace skills
3. /usr/local/lib/node_modules/openclaw/skills/  # Bundled skills
```

### Loading Process

```python
def load_skills():
    skills = []
    
    for directory in SKILL_DIRECTORIES:
        for skill_dir in directory.glob("*/"):
            skill_file = skill_dir / "SKILL.md"
            if skill_file.exists():
                skill = parse_skill(skill_file)
                skills.append(skill)
    
    return skills
```

---

## Trigger Matching

### Phrase Matching

Exact or fuzzy phrase matching:

```python
def match_phrase(message: str, trigger: str) -> float:
    message_lower = message.lower()
    trigger_lower = trigger.lower()
    
    # Exact match
    if trigger_lower in message_lower:
        return 1.0
    
    # Fuzzy match (Levenshtein distance)
    distance = levenshtein(message_lower, trigger_lower)
    max_len = max(len(message_lower), len(trigger_lower))
    similarity = 1 - (distance / max_len)
    
    return similarity
```

### Pattern Matching

Regex patterns for complex triggers:

```python
def match_pattern(message: str, pattern: str) -> float:
    if re.search(pattern, message, re.IGNORECASE):
        return 1.0
    return 0.0
```

### Scoring

Skills are scored by trigger relevance:

```python
def score_skill(message: str, skill: Skill) -> float:
    scores = []
    
    for trigger in skill.triggers:
        if trigger.phrase:
            score = match_phrase(message, trigger.phrase)
        elif trigger.pattern:
            score = match_pattern(message, trigger.pattern)
        scores.append(score)
    
    return max(scores)
```

---

## Tool Filtering

Skills can limit available tools:

```python
def filter_tools(tools: list[Tool], skill: Skill) -> list[Tool]:
    if not skill.tools:
        return tools  # All tools available
    
    return [t for t in tools if t.name in skill.tools]
```

---

## Kingdom Claw Skills

### Built-in Skills

| Skill | Location | Purpose |
|-------|----------|---------|
| `agent-team-orchestration` | `~/.openclaw/skills/` | Coordinate multi-agent teams |
| `agentic-design-patterns` | `~/.openclaw/skills/` | Apply 21 core patterns |
| `kingdom-reasoning` | `~/.openclaw/skills/` | Assess task complexity |
| `landing-page-builder` | `~/.openclaw/skills/` | Build landing pages |
| `video-generator` | `~/.openclaw/skills/` | Create videos |
| `here-now` | `~/.openclaw/skills/` | Publish to web |
| `anima` | `~/.openclaw/skills/` | Design-aware code |
| `scrapling` | `~/.openclaw/skills/` | Web scraping |
| `weather` | `npm/openclaw/skills/` | Weather information |
| `himalaya` | `npm/openclaw/skills/` | Email management |

### Custom Skills

Located at `/data/.openclaw/workspace/skills/`:

| Skill | Purpose |
|-------|---------|
| `agent-browser` | Headless browser automation |
| `capability-check` | Environment verification |
| `ddg-search` | DuckDuckGo fallback search |
| `self-evolution-engine` | Continuous improvement |
| `skill-patch-utils` | Auto-patch skills |
| `swift-expert` | iOS/macOS development |
| `typewriter-effect` | Text animations |
| `website-cloner` | Clone websites |

---

## Creating a Skill

### Step 1: Create Directory

```bash
mkdir -p ~/.openclaw/skills/my-skill
```

### Step 2: Write SKILL.md

```yaml
---
name: code-review
description: Review code for issues and improvements
triggers:
  - phrase: "review this code"
  - phrase: "check for bugs"
  - phrase: "analyze this code"
tools:
  - read
  - write
config:
  max_files: 10
  output_format: markdown
---

# Code Review Skill

When reviewing code, analyze:

1. **Security Issues**
   - SQL injection
   - XSS vulnerabilities
   - Authentication flaws
   - Data validation

2. **Performance Problems**
   - Inefficient algorithms
   - Memory leaks
   - N+1 queries
   - Blocking operations

3. **Code Quality**
   - Naming conventions
   - Code organization
   - Documentation
   - Test coverage

## Output Format

### Summary
[Brief summary of findings]

### Critical Issues
- [Issue 1]
- [Issue 2]

### Recommendations
- [Recommendation 1]
- [Recommendation 2]

## Example

**Input:** "Review this code"
**Code:**
```python
def get_user(id):
    return db.query(f"SELECT * FROM users WHERE id = {id}")
```

**Output:**
### Summary
SQL injection vulnerability detected.

### Critical Issues
- Direct string interpolation in SQL query

### Recommendations
- Use parameterized queries
- Add input validation
```

### Step 3: Test

```bash
# Reload skills
openclaw gateway restart

# Test trigger
# Send: "review this code in app.py"
```

---

## Skill Best Practices

### 1. Single Purpose

Each skill should do **one thing well**.

```
✅ Good: "code-review" — Reviews code
❌ Bad: "code-helper" — Reviews, writes, tests, deploys
```

### 2. Clear Triggers

Use specific, unambiguous triggers.

```
✅ Good: "review this code", "analyze code quality"
❌ Bad: "help with code", "do something"
```

### 3. Explicit Tools

List only the tools you actually need.

```yaml
tools:
  - read    # Need to read code
  - write   # Need to write review
  # NOT: exec (don't need shell access)
```

### 4. Structured Output

Define expected output format.

```markdown
## Output Format

### Summary
[Brief summary]

### Issues Found
- Issue 1
- Issue 2

### Recommendations
- Recommendation 1
```

### 5. Handle Errors

Include error handling in prompts.

```markdown
## Error Handling

If you encounter:
- File not found: Report which file is missing
- Permission denied: Suggest permission fix
- Syntax error: Show the line with error
```

---

## Skill Evolution

Skills can self-improve using the self-evolution engine:

```python
# Capture successful pattern
evolution.capture_pattern(
    skill="code-review",
    pattern="Always check for SQL injection first",
    success_rate=0.95
)

# Derived skill enhancement
evolution.derive_enhancement(
    base_skill="code-review",
    enhancement="security-review",
    trigger_phrase: "security audit this code"
)
```

---

## Debugging Skills

### Check Loading

```bash
openclaw skills list
```

### Test Trigger

```bash
openclaw skills test "review this code"
```

### View Details

```bash
openclaw skills show code-review
```

### View Logs

```bash
grep "skill" ~/.openclaw/logs/gateway.log
```

---

## Next Steps

1. [Agent Orchestration](AGENT-ORCHESTRATION.md)
2. [Memory System](MEMORY-SYSTEM.md)
3. [Self-Improvement](SELF-IMPROVEMENT.md)

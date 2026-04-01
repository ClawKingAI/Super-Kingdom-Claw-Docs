---
name: skill-patch-utils
description: Utilities for self-improving skills - detect issues mid-use and auto-patch
version: 1.0.0
---

# Skill Patch Utilities

This skill provides patterns for self-improving skills. When a skill is loaded and has issues, the agent can automatically patch it.

## When to Patch

Patch a skill when:
1. Instructions are outdated or wrong
2. OS-specific failures occur
3. Missing steps or pitfalls discovered during use
4. Commands have changed (new flags, deprecated options)
5. Dependencies have been updated

## Patch Mechanism

### Using skill_manage(action='patch')

The primary method for targeted fixes:

```
skill_manage(
  action='patch',
  name='skill-name',
  old_string='text to find (unique match)',
  new_string='replacement text'
)
```

**Best Practices:**
- Include enough context to make the match unique
- For multiple occurrences, set `replace_all=true`
- Test after patching to verify the fix

### Full Skill Rewrite

For major overhauls:

```
skill_manage(
  action='edit',
  name='skill-name',
  content='---\nname: skill-name\ndescription: ...\n---\n\nNew full content...'
)
```

## Auto-Patch Triggers

The agent should auto-patch when:

1. **Command failure**: Skill suggests `npm install` but user uses `pnpm`
2. **Path issues**: Skill hardcodes `~/.hermes` but should use `$HERMES_HOME`
3. **API changes**: Skill uses deprecated endpoint
4. **Missing pitfalls**: New error discovered not documented in skill

## Example Patch Flow

```
# Agent loads skill
skill_view('deployment')

# Agent tries to use it, hits error
# Error: pnpm not found, skill assumed npm

# Agent patches immediately
skill_manage(
  action='patch',
  name='deployment',
  old_string='npm install',
  new_string='npm install  # or: pnpm install'
)

# Agent continues with corrected approach
```

## Patch Logging

Each patch should include:
- Timestamp (inferred from file mtime)
- What was fixed
- Why it needed fixing

Example in SKILL.md:

```markdown
## Patches

### 2026-03-29: Fixed package manager assumption
- Old: `npm install`
- New: `npm install  # or: pnpm install`
- Reason: User uses pnpm, command failed

### 2026-03-28: Fixed hardcoded path
- Old: `~/.hermes/config.yaml`
- New: `$HERMES_HOME/config.yaml`
- Reason: Works with profile overrides
```

## Verification After Patch

Always verify the patch worked:

1. Re-read the skill: `skill_view('skill-name')`
2. Check the patched section
3. Test the workflow
4. If still broken, patch again or escalate to full edit

## Related

- `skill_manage` tool documentation
- Hermes Agent: `tools/skill_manager_tool.py`
- Skills Guard: `tools/skills_guard.py` (security scanning)

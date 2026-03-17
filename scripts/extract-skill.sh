#!/bin/bash
# Skill Extraction Helper
# Creates a new skill from a learning entry
# Usage: ./extract-skill.sh <skill-name>

set -e

SKILLS_DIR="${SKILLS_DIR:-$HOME/.openclaw/skills}"

# Parse arguments
SKILL_NAME="$1"
DRY_RUN="${2:-false}"

if [ -z "$SKILL_NAME" ]; then
  echo "Usage: $(basename "$0") <skill-name> [--dry-run]"
  echo ""
  echo "Examples:"
  echo "  $(basename "$0") docker-m1-fixes"
  echo "  $(basename "$0") api-timeout-patterns --dry-run"
  exit 1
fi

# Validate skill name (lowercase, hyphens, numbers)
if ! [[ "$SKILL_NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Error: Skill name must be lowercase with hyphens (e.g., 'docker-fixes', 'api-patterns')"
  exit 1
fi

SKILL_PATH="$SKILLS_DIR/$SKILL_NAME"

# Check if exists
if [ -d "$SKILL_PATH" ] && [ "$DRY_RUN" != "--dry-run" ]; then
  echo "Error: Skill already exists at $SKILL_PATH"
  exit 1
fi

# Dry run
if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "Would create:"
  echo "  $SKILL_PATH/"
  echo "  $SKILL_PATH/SKILL.md"
  exit 0
fi

# Create skill
echo "Creating skill: $SKILL_NAME"
mkdir -p "$SKILL_PATH"

# Convert name to title (docker-m1-fixes -> Docker M1 Fixes)
TITLE=$(echo "$SKILL_NAME" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

cat > "$SKILL_PATH/SKILL.md" << EOF
---
name: $SKILL_NAME
description: "[TODO: What this skill does and when to use it. Be specific about triggers.]"
---

# $TITLE

[TODO: Brief intro explaining the purpose]

## Quick Reference

| Situation | Action |
|-----------|--------|
| [When to use] | [What to do] |

## Details

[TODO: Main content]

## Examples

\`\`\`
[TODO: Code or command examples]
\`\`\`

## References

- Source: [Where this knowledge came from]
EOF

echo "Created: $SKILL_PATH/SKILL.md"
echo ""
echo "Next: Edit the SKILL.md and fill in the TODO sections"

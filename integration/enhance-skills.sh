#!/bin/bash
# Enhance all SKILL.md files with Claude Code pattern frontmatter
# Usage: ./enhance-skills.sh [--dry-run]

DRY_RUN=${1:-""}
SKILLS_DIR="/data/.openclaw/skills"
WORKSPACE_SKILLS="/data/.openclaw/workspace/skills"

echo "=== OpenClaw Skill Enhancement ==="
echo "Adding Claude Code pattern frontmatter to skills"
echo ""

enhance_skill() {
    local skill_file="$1"
    local skill_name=$(basename $(dirname "$skill_file"))
    
    # Skip if already enhanced
    if grep -q "user-invocable:" "$skill_file" 2>/dev/null; then
        echo "✓ Already enhanced: $skill_name"
        return
    fi
    
    # Determine category based on skill name
    local category="general"
    local allowed_tools="exec,read,write"
    local arg_hint=""
    local paths=""
    
    case "$skill_name" in
        *video*|*remotion*)
            category="media"
            allowed_tools="exec,read,write,edit"
            arg_hint="[prompt]"
            paths="- \"**/video/**\"\n  - \"**/remotion/**\""
            ;;
        *agent-reach*|*search*|*web*)
            category="data-access"
            allowed_tools="exec,read,write,web_fetch,web_search"
            arg_hint="[platform] [query]"
            paths="- \"**/*.url\"\n  - \"**/search/**\""
            ;;
        *here-now*|*deploy*|*publish*)
            category="deployment"
            allowed_tools="exec,read,write"
            arg_hint="[path]"
            paths="- \"**/deploy/**\""
            ;;
        *landing*|*page*|*design*)
            category="design"
            allowed_tools="exec,read,write,edit,image_generate"
            arg_hint="[description]"
            paths="- \"**/landing/**\""
            ;;
        *ocr*|*pdf*|*document*)
            category="document"
            allowed_tools="read,write,pdf,image"
            arg_hint="[file]"
            paths="- \"**/*.pdf\""
            ;;
        *test*|*debug*)
            category="development"
            allowed_tools="exec,read,write,edit"
            arg_hint="[target]"
            paths="- \"**/test/**\""
            ;;
        *git*|*repo*)
            category="version-control"
            allowed_tools="exec,read"
            arg_hint="[command]"
            paths="- \"**/.git/**\""
            ;;
        *memory*|*context*)
            category="memory"
            allowed_tools="read,write,memory_search,memory_get"
            arg_hint="[query]"
            paths="- \"**/MEMORY.md\"\n  - \"**/memory/**\""
            ;;
    esac
    
    # Build enhancement block
    local enhancement="\n# Claude Code Pattern Enhancements\nuser-invocable: true\nallowed-tools: $allowed_tools"
    
    if [ -n "$arg_hint" ]; then
        enhancement="$enhancement\nargument-hint: \"$arg_hint\""
    fi
    
    if [ -n "$paths" ]; then
        enhancement="$enhancement\npaths:\n  $paths"
    fi
    
    # Find the closing --- and insert enhancement before it
    if [ -n "$DRY_RUN" ]; then
        echo "WOULD ENHANCE: $skill_name"
        echo "  Category: $category"
        echo "  Tools: $allowed_tools"
        echo ""
    else
        # Use sed to insert enhancement before the closing ---
        sed -i "s|^---$|$enhancement\n---|" "$skill_file" 2>/dev/null && \
            echo "✓ Enhanced: $skill_name" || \
            echo "✗ Failed: $skill_name"
    fi
}

# Process all skills in main skills directory
for skill_dir in "$SKILLS_DIR"/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        enhance_skill "$skill_dir/SKILL.md"
    fi
done

# Process workspace skills (those with SKILL.md directly)
for skill_dir in "$WORKSPACE_SKILLS"/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        enhance_skill "$skill_dir/SKILL.md"
    fi
done

echo ""
echo "=== Enhancement Complete ==="
echo ""
echo "Next steps:"
echo "1. Review enhanced SKILL.md files"
echo "2. Test skill invocation"
echo "3. Update MEMORY.md with any changes"

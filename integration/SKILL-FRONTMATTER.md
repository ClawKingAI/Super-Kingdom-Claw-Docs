# Skill Frontmatter Standard

## Overview

This document defines the standard frontmatter fields for OpenClaw skills, incorporating best practices from Claude Code while maintaining OpenClaw-specific patterns.

## Required Fields

### `name`
- **Type:** string
- **Required:** Yes
- **Description:** Unique skill identifier, used for skill invocation

```yaml
name: agent-reach
```

### `description`
- **Type:** string (multiline allowed)
- **Required:** Yes
- **Description:** What the skill does, when to use it
- **Note:** Used for auto-discovery and skill listing

```yaml
description: >
  17 platform internet access tool.
  Use when searching, reading, or interacting on supported platforms.
```

## OpenClaw-Specific Fields

### `triggers`
- **Type:** object
- **Required:** No (but recommended)
- **Description:** Keyword triggers for skill activation

```yaml
triggers:
  - search: 搜/查/找/search/搜索
  - social:
    - 小红书: xiaohongshu/xhs/小红书
    - Twitter: twitter/推特/x.com
```

### `metadata`
- **Type:** object
- **Required:** No
- **Description:** Additional metadata for skill management

```yaml
metadata:
  openclaw:
    homepage: https://github.com/example/skill
    version: 1.4.0
    category: data-access
    author: agent-name
    created: 2026-04-06
    updated: 2026-04-06
```

## Claude Code Pattern Fields (Cross-Applied)

### `user-invocable`
- **Type:** boolean
- **Default:** true
- **Description:** Whether skill appears in skill listings
- **Use Case:** Set to `false` for background knowledge skills

```yaml
user-invocable: true
```

### `allowed-tools`
- **Type:** string (comma-separated)
- **Default:** all tools
- **Description:** Tools allowed without permission prompts when skill active

```yaml
allowed-tools: exec,read,write,web_fetch
```

### `argument-hint`
- **Type:** string
- **Default:** none
- **Description:** Hint shown during autocomplete/invocation

```yaml
argument-hint: "[platform] [query]"
```

### `paths`
- **Type:** array
- **Default:** none
- **Description:** Glob patterns for auto-activation

```yaml
paths:
  - "**/video/**"
  - "**/remotion/**"
```

### `disable-model-invocation`
- **Type:** boolean
- **Default:** false
- **Description:** Prevent automatic skill invocation
- **Use Case:** Skills that should only be explicitly called

```yaml
disable-model-invocation: true
```

### `context`
- **Type:** string
- **Values:** `default`, `fork`
- **Default:** `default`
- **Description:** Execution context
- **Note:** `fork` runs skill in isolated subagent

```yaml
context: fork
```

### `agent`
- **Type:** string
- **Default:** `general-purpose`
- **Description:** Subagent type when `context: fork`

```yaml
context: fork
agent: researcher
```

### `hooks`
- **Type:** object
- **Default:** none
- **Description:** Skill-scoped lifecycle hooks

```yaml
hooks:
  PreToolUse:
    - matcher: "exec.*"
      action: log
```

## Field Priority

When determining skill behavior, fields are evaluated in this order:

1. **Skill frontmatter** — Highest priority
2. **Session configuration** — Per-session overrides
3. **Global configuration** — Gateway defaults

## Example: Complete Frontmatter

```yaml
---
name: agent-reach
description: >
  Give your AI agent eyes to see the entire internet. 17 platforms via CLI, MCP, 
  curl, and Python scripts. Zero config for 8 channels.
  
  Use when user asks to search, read, or interact on any supported platform.

# OpenClaw triggers
triggers:
  - search: 搜/查/找/search/搜索/查一下/帮我搜
  - social:
    - Twitter: twitter/推特/x.com/推文
    - Reddit: reddit
    - GitHub: github/代码/仓库/gh

# Metadata
metadata:
  openclaw:
    homepage: https://github.com/Panniantong/Agent-Reach
    version: 1.4.0
    category: data-access
    author: community

# Claude Code Pattern Enhancements
user-invocable: true
allowed-tools: exec,read,write,web_fetch,web_search
argument-hint: "[platform] [query]"
paths:
  - "**/*.url"
  - "**/search/**"
  - "**/research/**"

# Execution context
context: default

# Skill-scoped hooks
hooks:
  PostToolUse:
    - matcher: "exec.*twitter.*"
      action: log
      level: info
---
```

## Validation

Skills are validated on load. Required validations:

1. `name` is present and unique
2. `description` is present
3. `allowed-tools` references valid tools
4. `paths` patterns are valid globs
5. `hooks` actions are valid

## Migration from Legacy Skills

Legacy skills without frontmatter defaults:

```yaml
name: <directory-name>
description: <first-paragraph-of-content>
user-invocable: true
```

## Changelog

- **2026-04-06:** Initial standard, cross-applied from Claude Code best practices
- **Future:** Add `model` and `effort` fields when supported

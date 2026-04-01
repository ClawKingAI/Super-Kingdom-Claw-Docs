# Agent Prompts — Kingdom Claw

Production-ready agent prompts for specialized tasks.

## Available Agents

### 1. OpenClaw Documentation Agent
**File:** `openclaw-documentation-agent.md`
**Purpose:** Generate comprehensive technical documentation for OpenClaw

**Use when:**
- Documenting OpenClaw architecture
- Creating API references
- Writing integration guides
- Producing troubleshooting docs

**To deploy:**
```bash
# In OpenClaw session, send:
"Use the OpenClaw Documentation Agent prompt from /data/.openclaw/workspace/agent-prompts/openclaw-documentation-agent.md"
```

### 2. Full-Stack Tech Engineer Agent
**File:** `fullstack-tech-engineer-agent.md`
**Purpose:** Build complete full-stack applications

**Use when:**
- Starting new projects
- Building APIs and frontends
- Setting up DevOps pipelines
- Integrating AI/ML features

**To deploy:**
```bash
# In OpenClaw session, send:
"Use the Full-Stack Tech Engineer Agent prompt from /data/.openclaw/workspace/agent-prompts/fullstack-tech-engineer-agent.md"
```

## Customization

Both prompts can be customized by:
1. Adding project-specific requirements
2. Modifying technology stack preferences
3. Adjusting output format requirements
4. Adding domain-specific constraints

## Integration with Kingdom Claw Core

These prompts are designed to work with the Kingdom Claw Core runtime:

```python
from kingdom_claw_core import create_runtime

runtime = create_runtime()
session = runtime.start_session()

# Load agent prompt as system message
# Execute tasks through the runtime
```

## Creating New Agent Prompts

To create a new agent prompt:

1. Define clear identity and mission
2. Specify competencies and tools
3. Set operating principles
4. Define success criteria
5. Add constraints and safety checks

Template available at: `agent-prompt-template.md`

## Best Practices

### For Documentation Agent
- Start with architecture overview
- Document stable APIs only
- Include working code examples
- Keep troubleshooting practical

### For Full-Stack Agent
- Ship working code early
- Test incrementally
- Document as you build
- Plan for production from start

## Version History

- **2026-03-31** — Initial creation of both prompts

# NVIDIA API Compatibility Guide for Agency Agents

This fork is optimized for NVIDIA NIM API endpoints. All agent prompts work with NVIDIA's hosted models.

## Quick Setup for NVIDIA API

### 1. Environment Variables
```bash
# Set NVIDIA API key
export NVIDIA_API_KEY="nvapi-xxxxx"

# Default model endpoints (OpenClaw auto-configures)
# Primary: nvidia/z-ai/glm5
# Fallback: nvidia/meta/llama-3.1-70b-instruct
```

### 2. Using Agents with NVIDIA API

All 193 agents in this repo are compatible with NVIDIA API through OpenClaw. The agent prompts are model-agnostic and work with any capable LLM.

### 3. Activation Methods

**Option A: OpenClaw Skills (Recommended)**
```bash
# Copy agent to skills directory
cp engineering/engineering-frontend-developer.md ~/.openclaw/workspace/skills/frontend-dev/SKILL.md

# Activate in session
# "Use the frontend-dev skill"
```

**Option B: Direct Prompt Injection**
```bash
# Read agent file and paste into conversation
cat engineering/engineering-frontend-developer.md
# Then: "Act as this agent"
```

**Option C: System Prompt Mode**
```bash
# For Claude Code / other tools
# Add agent content to system prompt
```

## Agent Categories

| Category | Count | Best For |
|----------|-------|----------|
| Engineering | 21 | Development, DevOps, Security |
| Design | 8 | UI/UX, Brand, Visual |
| Marketing | 28 | Content, Growth, Social |
| Sales | 8 | Outbound, Deals, Pipeline |
| Product | 5 | PM, Prioritization |
| Project Management | 5 | Sprints, Tracking |
| Paid Media | 6 | PPC, Ads, Tracking |
| Strategy | 12 | Planning, Analysis |
| Integrations | 12 | Platform connections |
| Game Development | 8 | Unity, Unreal, Design |
| Academic | 3 | Research, Writing |
| Support | 3 | Customer Success |
| Specialized | 10 | Domain-specific |

## NVIDIA API Advantages

- **Fast inference** — optimized for low latency
- **Cost-effective** — pay per token
- **Multiple models** — switch based on task complexity
- **No rate limits** on most tiers

## Recommended Agents for NVIDIA API

High-complexity tasks (use larger models):
- `engineering-software-architect.md`
- `engineering-backend-architect.md`
- `product-manager.md`
- `strategy-*.md`

Fast iteration tasks (use faster models):
- `engineering-frontend-developer.md`
- `engineering-rapid-prototyper.md`
- `marketing-content-creator.md`
- `design-ui-designer.md`

## Integration with OpenClaw

This repo integrates with OpenClaw's skill system. Each agent can become a callable skill:

```yaml
# Example: ~/.openclaw/workspace/skills/frontend-dev/SKILL.md
---
name: frontend-dev
description: Frontend developer agent for React/Vue/Angular
---

[Agent content here]
```

## Fork Information

- **Original**: https://github.com/msitarzewski/agency-agents
- **Fork optimized for**: NVIDIA NIM API + OpenClaw
- **License**: MIT
- **Agent count**: 193

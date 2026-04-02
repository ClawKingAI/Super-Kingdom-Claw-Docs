# Agent Personas — Kingdom Claw Integration

> **194 Specialized Personas** — Production-ready agent definitions for Kingdom Claw

---

## What This Is

This integrates the **Agency-Agents** persona library into Kingdom Claw's architecture. Each persona is a pre-crafted agent personality optimized for specific tasks.

---

## Persona Architecture

### How Personas Work in Kingdom Claw

```
┌─────────────────────────────────────────────────────────────┐
│                    KINGDOM CLAW                              │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   PERSONA   │  │    TASK     │  │   RESULT    │         │
│  │  SELECTOR   │─→│  EXECUTION  │─→│  AGGREGATOR │         │
│  │             │  │             │  │             │         │
│  │ Match task  │  │ Spawn with  │  │ Combine     │         │
│  │ to persona  │  │ persona     │  │ outputs     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  Personas:                                                    │
│  ├── Engineering (23) → Development, DevOps, Security       │
│  ├── Design (8) → UI/UX, Brand, Visual                     │
│  ├── Marketing (28) → Content, Growth, Social              │
│  ├── Sales (8) → Outbound, Deals, Pipeline                 │
│  ├── Product (5) → PM, Prioritization                      │
│  ├── Project Mgmt (5) → Sprints, Tracking                  │
│  ├── Paid Media (6) → PPC, Ads, Analytics                  │
│  ├── Strategy (12) → Planning, Analysis                    │
│  ├── Integrations (12) → Platform connections              │
│  ├── Game Dev (8) → Unity, Unreal, Design                  │
│  ├── Academic (3) → Research, Writing                      │
│  ├── Support (3) → Customer Success                        │
│  └── Specialized (10) → Domain-specific                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Persona Categories

### Engineering (23 Personas)

| Persona | Specialty | Use When |
|---------|-----------|----------|
| `frontend-developer` | React/Vue/Angular, UI implementation | Building web UIs |
| `backend-architect` | API design, microservices | System architecture |
| `ai-engineer` | ML pipelines, model integration | AI features |
| `devops-engineer` | CI/CD, infrastructure | Deployment automation |
| `security-engineer` | Audits, hardening | Security review |
| `data-engineer` | Pipelines, ETL | Data processing |
| `database-optimizer` | Query optimization | Performance tuning |
| `code-reviewer` | Quality, patterns | PR reviews |
| `rapid-prototyper` | MVP, quick builds | Fast iteration |
| `test-engineer` | Testing strategy | Quality assurance |
| ... | (13 more) | |

### Design (8 Personas)

| Persona | Specialty | Use When |
|---------|-----------|----------|
| `ui-designer` | Interface design | Visual design |
| `ux-researcher` | User research | User studies |
| `brand-guardian` | Brand consistency | Visual identity |
| `motion-designer` | Animations | Micro-interactions |
| `design-system-architect` | Component libraries | Design systems |
| `accessibility-specialist` | A11y compliance | Inclusive design |
| `visual-designer` | Graphics, layouts | Marketing visuals |
| `product-designer` | End-to-end design | Product design |

### Marketing (28 Personas)

| Persona | Specialty | Use When |
|---------|-----------|----------|
| `content-creator` | Blog, copywriting | Content production |
| `growth-hacker` | Acquisition, viral loops | Growth campaigns |
| `social-media-manager` | Platforms, scheduling | Social presence |
| `email-marketer` | Campaigns, automation | Email marketing |
| `seo-specialist` | Optimization, keywords | Search ranking |
| `community-manager` | Engagement, moderation | Community building |
| ... | (22 more) | |

### Sales (8 Personas)

| Persona | Specialty | Use When |
|---------|-----------|----------|
| `outbound-specialist` | Cold outreach | Lead generation |
| `deal-strategist` | Negotiation, closing | Deal management |
| `discovery-specialist` | Needs analysis | Qualification |
| `account-executive` | Full sales cycle | Revenue |
| `sales-engineer` | Technical sales | Technical demos |
| ... | (3 more) | |

---

## Persona Structure

Each persona follows this format:

```yaml
---
name: Frontend Developer
description: Expert frontend developer specializing in modern web technologies
color: cyan
emoji: 🖥️
vibe: Builds responsive, accessible web apps with pixel-perfect precision
---

# [Persona Name] Agent

## 🧠 Identity & Memory
- Role: [What this agent does]
- Personality: [Key traits]
- Memory: [What it remembers]
- Experience: [Background context]

## 🎯 Core Mission
[Primary objectives]

## 🚨 Critical Rules
[Must-follow constraints]

## 📋 Technical Deliverables
[Expected outputs with examples]

## 💬 Communication Style
[How it interacts]

## 🔧 Tool Preferences
[Preferred tools and workflows]
```

---

## Integration with Kingdom Claw Core

### Method 1: Skill-Based Activation

```bash
# Copy persona to skills
cp personas/engineering-frontend-developer.md ~/.openclaw/skills/

# Activate in conversation
# "Use the frontend-developer persona"
```

### Method 2: Spawn with Persona

```python
from kingdom_claw_core.plugins.parallel_agents import (
    ParallelAgentExecutor,
    AgentTask,
    AgentRole,
)

# Spawn with persona
executor = ParallelAgentExecutor()

task = AgentTask(
    name="frontend_build",
    role=AgentRole.SONNET,
    prompt=load_persona("frontend-developer") + "\n\nTask: Build a dashboard"
)

result = executor.execute_parallel([task])
```

### Method 3: Hook-Based Routing

```python
from kingdom_claw_core.plugins.hooks import (
    HookRegistry, HookDefinition, HookPoint,
    HookContext, HookResult, HookAction,
)

# Route tasks to appropriate personas
def persona_router(ctx: HookContext) -> HookResult:
    message = ctx.message or ""
    
    # Engineering tasks
    if any(word in message.lower() for word in ["build", "code", "develop"]):
        if "frontend" in message.lower() or "ui" in message.lower():
            return HookResult(
                action=HookAction.REDIRECT,
                redirect_target="frontend-developer"
            )
        elif "api" in message.lower() or "backend" in message.lower():
            return HookResult(
                action=HookAction.REDIRECT,
                redirect_target="backend-architect"
            )
    
    # Design tasks
    elif any(word in message.lower() for word in ["design", "mockup", "ui"]):
        return HookResult(
            action=HookAction.REDIRECT,
            redirect_target="ui-designer"
        )
    
    return HookResult(action=HookAction.ALLOW)

registry.register(HookDefinition(
    name="persona-router",
    hook_point=HookPoint.MESSAGE_RECEIVED,
    handler=persona_router,
    priority=50
))
```

---

## Persona Selection Matrix

| Task Type | Recommended Persona | Reason |
|-----------|---------------------|--------|
| Build React app | `frontend-developer` | React/Vue specialty |
| Design API | `backend-architect` | System design focus |
| Write blog post | `content-creator` | Writing expertise |
| Review PR | `code-reviewer` | Quality focus |
| Growth campaign | `growth-hacker` | Acquisition tactics |
| Security audit | `security-engineer` | Security specialty |
| User research | `ux-researcher` | Research methods |
| Data pipeline | `data-engineer` | ETL expertise |

---

## Multi-Persona Workflows

### Example: Full Product Build

```python
# Spawn multiple personas for different aspects
tasks = [
    AgentTask(
        name="design",
        role=AgentRole.OPUS,
        prompt=load_persona("ui-designer") + "\n\nDesign the dashboard"
    ),
    AgentTask(
        name="frontend",
        role=AgentRole.SONNET,
        prompt=load_persona("frontend-developer") + "\n\nImplement the UI"
    ),
    AgentTask(
        name="backend",
        role=AgentRole.OPUS,
        prompt=load_persona("backend-architect") + "\n\nDesign the API"
    ),
]

results = executor.execute_parallel(tasks)
```

### Example: Marketing Campaign

```python
tasks = [
    AgentTask(
        name="strategy",
        role=AgentRole.OPUS,
        prompt=load_persona("growth-hacker") + "\n\nPlan acquisition"
    ),
    AgentTask(
        name="content",
        role=AgentRole.SONNET,
        prompt=load_persona("content-creator") + "\n\nWrite copy"
    ),
    AgentTask(
        name="email",
        role=AgentRole.SONNET,
        prompt=load_persona("email-marketer") + "\n\nSetup automation"
    ),
]
```

---

## NVIDIA API Optimization

### Persona-to-Model Mapping

| Persona Complexity | Recommended Model | Reason |
|-------------------|-------------------|--------|
| High (architect, strategist) | GLM-5 / Kimi K2.5 | Complex reasoning |
| Medium (developer, designer) | GLM-5 | Balanced performance |
| Low (content, social) | Haiku-class | Fast iteration |

### Configuration

```yaml
model:
  provider: nvidia
  
  personas:
    high_complexity:
      model: z-ai/glm5
      temperature: 1.0
    medium_complexity:
      model: z-ai/glm5
      temperature: 0.7
    low_complexity:
      model: qwen/qwen3-coder
      temperature: 0.5
```

---

## Quality Patterns from Agency-Agents

### 1. Structured Identity

Each persona has:
- Clear role definition
- Personality traits
- Memory considerations
- Experience context

**Apply to Kingdom Claw:** Add these fields to plugin definitions.

### 2. Critical Rules

Each persona defines constraints:
- What it must always do
- What it must never do
- Quality standards

**Apply to Kingdom Claw:** Add to permission hooks.

### 3. Deliverables Section

Each persona specifies:
- Expected output format
- Code examples
- Quality metrics

**Apply to Kingdom Claw:** Add to agent tasks.

### 4. Communication Style

Each persona defines:
- Tone
- Verbosity
- Interaction patterns

**Apply to Kingdom Claw:** Add to response generation.

---

## Implementation Checklist

- [ ] Copy all personas to Kingdom Claw
- [ ] Create persona loader utility
- [ ] Add persona router hook
- [ ] Integrate with parallel agent executor
- [ ] Configure persona-to-model mapping
- [ ] Add persona selection UI
- [ ] Document persona usage

---

## Persona Files

All personas available at:
```
/data/.openclaw/workspace/agency-agents-clawking/
├── engineering/ (23 personas)
├── design/ (8 personas)
├── marketing/ (28 personas)
├── sales/ (8 personas)
├── product/ (5 personas)
├── project-management/ (5 personas)
├── paid-media/ (6 personas)
├── strategy/ (12 personas)
├── integrations/ (12 personas)
├── game-development/ (8 personas)
├── academic/ (3 personas)
├── support/ (3 personas)
└── specialized/ (10 personas)
```

---

## Resources

- **Original Repo**: https://github.com/msitarzewski/agency-agents
- **NVIDIA-Optimized Fork**: https://github.com/ClawKingAI/agency-agents
- **License**: MIT
- **Persona Count**: 194

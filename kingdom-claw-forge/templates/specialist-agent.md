# Specialist Agent Template

Use this template to define domain-specific agents. Derived from Agency Agents structure with Kingdom Claw extensions.

---

## YAML Frontmatter

```yaml
---
name: [Agent Name]
description: [One-line description of agent's specialization]
color: [blue|purple|orange|green|red|yellow]
emoji: [Single emoji representing agent]
vibe: [One sentence describing agent's operational philosophy]
tools: [List of tools agent should have access to]
---
```

---

## Agent Definition Template

```markdown
# [Agent Name] Agent

## 🧠 Identity & Memory

You are **[Name]**, [role description with experience context].

**Role**: [Primary function]
**Personality**: [3-4 adjectives defining behavior]
**Memory**: You remember [what patterns/knowledge to retain]
**Experience**: You've seen [relevant past scenarios and outcomes]

## 🎯 Core Mission

### [Domain 1]
- [Responsibility 1]
- [Responsibility 2]
- **Default requirement**: [Non-negotiable standard]

### [Domain 2]
- [Responsibility 1]
- [Responsibility 2]

### [Domain N]
- [Responsibility 1]
- [Responsibility 2]

## 🚨 Critical Rules

1. **[Rule category]**: [Specific constraint]
2. **[Rule category]**: [Specific constraint]
3. [Continue with numbered rules...]

## 📋 Deliverables

### [Deliverable Type 1]
```
[Code/template example]
```

### [Deliverable Type 2]
```
[Code/template example]
```

## 💭 Communication Style

- **Be [adjective]**: "[Example statement]"
- **Focus on [priority]**: "[Example statement]"
- [Additional style notes]

## 🔄 Learning & Memory

Remember and build expertise in:
- **[Knowledge area 1]**: [What to retain]
- **[Knowledge area 2]**: [What to retain]

### Pattern Recognition
- [What patterns this agent recognizes]
- [How agent applies past learning]

## 🎯 Success Metrics

You're successful when:
- [Metric 1]: [Target]
- [Metric 2]: [Target]
- [Metric 3]: [Target]

## 🚀 Advanced Capabilities

### [Advanced Skill 1]
- [Capability detail]

### [Advanced Skill 2]
- [Capability detail]
```

---

## Kingdom Claw Extensions

Add these sections for Kingdom Claw integration:

### Pattern Integration

```markdown
## 🔗 Pattern Integration

This agent applies these patterns:
- **Routing**: [How agent routes subtasks]
- **Reflection**: [How agent self-evaluates]
- **Parallel**: [What agent parallelizes]
- **Memory**: [What agent persists]
```

### Agent Communication

```markdown
## 📡 Agent Communication

**Receives from**: [Upstream agents]
**Sends to**: [Downstream agents]
**Handoff format**: [How this agent passes work]
**Quality gate**: [What must be true before handoff]
```

### Error Handling

```markdown
## ⚠️ Exception Handling

**On failure**:
1. [Recovery step 1]
2. [Recovery step 2]
3. [Escalation trigger]

**Rollback criteria**: [When to undo work]
```

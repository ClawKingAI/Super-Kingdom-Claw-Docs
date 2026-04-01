<p align="center">
  <img src="https://img.shields.io/badge/Kingdom-Claw-purple?style=for-the-badge&logo=crown&logoColor=white" alt="Kingdom Claw"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge" alt="Version"/>
  <img src="https://img.shields.io/badge/Status-Production-green?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
</p>

<h1 align="center">👑 Super Kingdom Claw Docs</h1>

<p align="center">
  <strong>The Complete Blueprint for Building Production-Grade AI Agent Systems</strong>
</p>

<p align="center">
  <em>Architecture • Skills • Integration • Deployment • Learning</em>
</p>

---

## 🎯 What This Is

This repository contains the **complete documentation of Kingdom Claw** — a production-grade AI agent system built on OpenClaw. It captures every architectural decision, every skill pattern, every integration technique, and every learning extracted from analyzing multiple cutting-edge AI systems.

**This is not a tutorial. This is a blueprint.**

With this documentation, you can recreate Kingdom Claw from scratch on any VPS, understanding not just *what* to do, but *why* each decision was made.

---

## 📚 Documentation Map

```
Super-Kingdom-Claw-Docs/
│
├── 📖 README.md                    ← You are here
│
├── 🏗️ architecture/
│   ├── SYSTEM-OVERVIEW.md          ← The big picture
│   ├── CORE-RUNTIME.md             ← How the agent actually runs
│   ├── PERMISSION-SYSTEM.md        ← Safety and security architecture
│   ├── SESSION-MANAGEMENT.md       ← How conversations persist
│   ├── TOOL-REGISTRY.md            ← How tools are discovered and executed
│   └── EVENT-STREAMING.md          ← How operations are observed
│
├── 🧠 skills/
│   ├── SKILLS-SYSTEM.md            ← How skills work
│   ├── AGENT-ORCHESTRATION.md      ← Multi-agent coordination
│   ├── PROMPT-ENGINEERING.md       ← How to write agent prompts
│   ├── MEMORY-SYSTEM.md            ← Long-term and short-term memory
│   └── SELF-IMPROVEMENT.md         ← How the agent learns and evolves
│
├── 🔗 integration/
│   ├── OPENCLAW-SETUP.md           ← OpenClaw configuration
│   ├── TELEGRAM-INTEGRATION.md     ← Telegram bot setup
│   ├── NEMOCLAW-AGENTS.md          ← NVIDIA NemoClaw integration
│   ├── MODEL-PROVIDERS.md          ← Multi-model support
│   ├── CHANNEL-MULTIPLEXING.md     ← Multiple communication channels
│   └── GLM5-SKILLS.md              ← GLM-5 official skill ecosystem
│
├── 🚀 deployment/
│   ├── VPS-SETUP.md                ← Complete VPS deployment
│   ├── DOCKER-DEPLOYMENT.md        ← Container deployment
│   ├── PRODUCTION-CHECKLIST.md     ← Pre-flight checklist
│   └── DISASTER-RECOVERY.md        ← Backup and recovery
│
├── 📖 learning/
│   ├── CLAW-CODE-ANALYSIS.md       ← Lessons from Claude Code port
│   ├── AGENTIC-PATTERNS.md         ← 21 core design patterns
│   ├── HARNESS-ENGINEERING.md      ← How to build agent harnesses
│   └── SELF-EVOLUTION.md           ← Continuous improvement system
│
└── 📋 reference/
    ├── CONFIG-TEMPLATE.yaml        ← Complete config template
    ├── PROMPT-LIBRARY.md           ← Reusable prompt templates
    ├── TOOL-REFERENCE.md           ← All available tools
    └── TROUBLESHOOTING.md          ← Common issues and solutions
```

---

## 🌟 Key Innovations Documented

### 1. **Kingdom Claw Core Runtime**
A production-grade agent harness implementing patterns from Claude Code:
- Command/Tool dual registry system
- Permission gating with audit logging
- Session persistence with token tracking
- Event streaming for observability
- Prompt routing with relevance scoring

[→ Read the Architecture](architecture/SYSTEM-OVERVIEW.md)

### 2. **Self-Improvement System**
The agent learns from execution:
- Captures successful patterns
- Detects issues mid-use and auto-patches
- Maintains evolution history in SQLite
- Derives new skills from experience

[→ Read about Self-Improvement](skills/SELF-IMPROVEMENT.md)

### 3. **Multi-Agent Orchestration**
Coordinate specialized agents:
- Orchestrator — intake and planning
- Developer — code builds
- Designer — UI/UX
- Researcher — analysis
- Deployer — production releases

[→ Read about Orchestration](skills/AGENT-ORCHESTRATION.md)

### 4. **Agentic Design Patterns**
21 core patterns for AI systems:
- Prompt Chaining
- Routing
- Parallelization
- Reflection
- Tool Use
- Planning
- Multi-Agent
- Memory Management
- ...and 13 more

[→ Read the Patterns](learning/AGENTIC-PATTERNS.md)

### 5. **GLM-5 Official Skills**
Model-specific skills for GLM-5 (the model Kingdom Claw runs on):
- GLM-OCR: Text, table, formula, handwriting extraction
- GLM-V: Vision, captioning, document processing
- GLM-Image: Text-to-image generation

[→ Read GLM-5 Integration](integration/GLM5-SKILLS.md)

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 20+
node --version

# Python 3.11+ (for skills)
python3 --version

# Docker (optional)
docker --version
```

### Clone and Setup

```bash
# Clone the documentation
git clone https://github.com/ClawKingAI/Super-Kingdom-Claw-Docs.git
cd Super-Kingdom-Claw-Docs

# Read the architecture overview
cat architecture/SYSTEM-OVERVIEW.md

# Follow the VPS setup guide
cat deployment/VPS-SETUP.md
```

### Deploy Your Own Kingdom Claw

```bash
# 1. Set up OpenClaw
bash scripts/install-openclaw.sh

# 2. Configure the gateway
cp reference/CONFIG-TEMPLATE.yaml ~/.openclaw/config.yaml
# Edit with your API keys

# 3. Deploy skills
cp -r skills/* ~/.openclaw/skills/

# 4. Start the gateway
openclaw gateway start
```

---

## 🏗️ Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     KINGDOM CLAW ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Telegram   │    │  Discord    │    │  WhatsApp   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OPENCLAW GATEWAY                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SESSION MANAGER                        │  │
│  │  • Persist conversations    • Track token usage          │  │
│  │  • Auto-compact history     • Resume sessions            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   PERMISSION GATE                         │  │
│  │  • Block dangerous ops      • Audit all denials          │  │
│  │  • Prefix-based blocking    • Allowlist support          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    TOOL REGISTRY                          │  │
│  │  • 40+ built-in tools      • Dynamic registration        │  │
│  │  • Permission levels       • Handler dispatch            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SKILLS SYSTEM                          │  │
│  │  • Load from directory      • Trigger matching           │  │
│  │  • Tool filtering          • Context injection           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MODEL PROVIDERS                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  NVIDIA  │  │  OpenAI  │  │Anthropic │  │  Google  │       │
│  │  NIM     │  │  GPT-4   │  │ Claude   │  │ Gemini   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Skills Overview

Kingdom Claw uses a modular skill system. Each skill is a self-contained capability:

| Skill | Purpose | Triggers |
|-------|---------|----------|
| `agent-team-orchestration` | Coordinate multi-agent teams | "set up a team", "orchestrate agents" |
| `agentic-design-patterns` | Apply 21 core patterns | Complex multi-step tasks |
| `kingdom-reasoning` | Assess task complexity | Every request |
| `landing-page-builder` | Build landing pages | "build a landing page" |
| `video-generator` | Create videos | "make a video" |
| `here-now` | Publish to web | "publish this", "host this" |
| `anima` | Design-aware code | Figma URLs, "design", "build" |
| `scrapling` | Web scraping | "scrape", "extract data" |
| `weather` | Weather info | "weather", "temperature" |
| `skill-creator` | Create new skills | "create a skill" |

[→ See All Skills](skills/SKILLS-SYSTEM.md)

---

## 📖 Learning Sources

This documentation synthesizes knowledge from:

| Source | What We Learned |
|--------|-----------------|
| **Claw Code** (Claude Code port) | Harness architecture, tool registry, permission patterns, session management |
| **Anthropic's Claude Code** | Official plugin patterns, parallel agents, hooks, confidence scoring |
| **Agentic Design Patterns** | 21 core patterns for AI systems |
| **GLM-5 Official** | Model-specific skills, OCR, vision, document processing |
| **OpenClaw Source** | Gateway architecture, channel integration, cron system |
| **NemoClaw SDK** | Multi-agent coordination, model failover |
| **Here.now** | Instant web deployment |
| **Remotion** | Programmatic video generation |

[→ Read Claw Code Analysis](learning/CLAW-CODE-ANALYSIS.md)
[→ Read GLM-5 Integration](integration/GLM5-SKILLS.md)

---

## 🔧 Configuration

### Minimal Config

```yaml
model:
  provider: nvidia
  model: z-ai/glm5

channels:
  - provider: telegram
    token: $TELEGRAM_BOT_TOKEN
```

### Production Config

See [CONFIG-TEMPLATE.yaml](reference/CONFIG-TEMPLATE.yaml) for complete configuration with:
- Multi-model failover
- All channels enabled
- Permission levels
- Session persistence
- Cron jobs
- Logging

---

## 🚀 Deployment Options

### Option 1: VPS (Recommended)

Full control, maximum customization.

[→ VPS Deployment Guide](deployment/VPS-SETUP.md)

### Option 2: Docker

Isolated, reproducible environment.

[→ Docker Deployment Guide](deployment/DOCKER-DEPLOYMENT.md)

### Option 3: Cloud Platform

Deploy to Railway, Render, or Fly.io.

[→ Cloud Deployment Guide](deployment/CLOUD-DEPLOYMENT.md)

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Documentation Files | 25+ |
| Architecture Diagrams | 15+ |
| Code Examples | 100+ |
| Skills Documented | 20+ |
| Tools Documented | 40+ |
| Total Content | 50,000+ words |

---

## 🤝 Contributing

This is a living documentation project. To contribute:

1. **Found an error?** Open an issue
2. **Have an improvement?** Submit a PR
3. **New pattern?** Add to `learning/`

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT License — Use freely, attribute appropriately.

---

## 👑 About Kingdom Claw

Kingdom Claw is a production-grade AI agent system designed for:

- **Stability** — Graceful degradation, error recovery
- **Extensibility** — Modular skills, dynamic tools
- **Observability** — Event streaming, audit logging
- **Performance** — Async operations, efficient routing

Built with discipline. Designed for longevity.

---

<p align="center">
  <strong>Kingdom Claw exists to build structure inside chaos.</strong>
</p>

<p align="center">
  <em>This is not a chat assistant.<br>
  This is disciplined execution.</em>
</p>

<p align="center">
  <a href="architecture/SYSTEM-OVERVIEW.md">→ Begin with the Architecture</a>
</p>

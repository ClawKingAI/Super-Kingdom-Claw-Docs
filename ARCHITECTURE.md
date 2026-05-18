# ARCHITECTURE.md — System Design

<div align="center">

**How Kingdom Claw Thinks, Acts, and Evolves**

*The architecture of an autonomous empire.*

</div>

---

## 🏛️ System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KINGDOM CLAW SYSTEM                          │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ 🧠 MULTI- │  │ 🎭 AGENT │  │ 🧬 SELF- │  │ 💾 INTELLIGENT   │  │
│  │   MODEL   │  │ NETWORK  │  │ EVOLUTION │  │    MEMORY        │  │
│  │  ROUTER   │  │  (60+)   │  │  ENGINE   │  │                  │  │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └────────┬─────────┘  │
│        │              │              │                 │             │
│        └──────────────┴──────┬───────┴─────────────────┘             │
│                              │                                       │
│                    ┌─────────▼─────────┐                            │
│                    │  ⚡ SKILL ENGINE   │                            │
│                    │   (1,340+ skills)  │                            │
│                    └─────────┬─────────┘                            │
│                              │                                       │
│         ┌────────────────────┼────────────────────┐                 │
│         │                    │                    │                  │
│  ┌──────▼──────┐  ┌─────────▼────────┐  ┌───────▼───────┐        │
│  │  OUTBOUND   │  │   INTELLIGENCE   │  │   CREATIVE    │        │
│  │   ENGINE    │  │     ENGINE       │  │    ENGINE     │        │
│  └─────────────┘  └──────────────────┘  └───────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Multi-Model Router

Tasks are routed to the optimal AI model based on complexity, domain, and cost.

```
┌─────────────────────────────────────────────────┐
│              MODEL ROUTING TABLE                 │
├──────────────┬──────────────┬───────────────────┤
│ Model        │ Strength     │ Routed Tasks      │
├──────────────┼──────────────┼───────────────────┤
│ DeepSeek V4  │ Reasoning    │ Complex analysis  │
│ GLM 5.1      │ Scale (744B) │ Multi-step logic  │
│ Qwen3 Coder  │ Code         │ Development tasks │
│ Claude Opus  │ Analysis     │ Deep research     │
├──────────────┼──────────────┼───────────────────┤
│ AUTO-FAILOVER │ If primary fails → next model  │
└──────────────┴──────────────┴───────────────────┘
```

**Automatic failover.** No single model is a single point of failure.

---

## 🎭 Agent Network Architecture

```
                    ┌─────────────┐
                    │ ORCHESTRATOR│
                    │  (Router)   │
                    └──────┬──────┘
                           │
        ┌──────────┬───────┼───────┬──────────┐
        │          │       │       │          │
   ┌────▼───┐ ┌───▼───┐ ┌─▼──┐ ┌──▼───┐ ┌───▼────┐
   │DEV TEAM│ │MKT TEAM│ │DES│ │SALES │ │OPS TEAM│
   │ (8)    │ │ (12)   │ │(6)│ │ (6)  │ │ (8)    │
   └────────┘ └────────┘ └────┘ └──────┘ └────────┘
```

### Agent Dispatch Protocol

| Signal | Route | Action |
|--------|-------|--------|
| "Build a website" | Developer | Write, test, deploy |
| "Send outreach emails" | Outreach | Compose, send, track |
| "Post on social media" | Social Media Agent | Create, schedule, publish |
| "Scrape this directory" | Lead Miner | Extract, enrich, qualify |
| "Generate a video" | Video Producer | Script, render, publish |
| "Research competitors" | Researcher | Search, analyze, brief |
| "Design a landing page" | Designer | Mock, build, deploy |

**Each agent has specialized memory, skills, and execution patterns.**

---

## 🧬 Self-Evolution Pipeline

```
  ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
  │EXECUTE │────►│OBSERVE │────►│CRITIQUE│────►│GENERATE│────►│VALIDATE│
  │ TASK   │     │RESULT  │     │GAPS    │     │CHANGES │     │5 GATES │
  └────────┘     └────────┘     └────────┘     └────────┘     └───┬────┘
                                                                  │
                                                     ┌────────────┤
                                                     │            │
                                                 PASS ✅      FAIL ❌
                                                     │            │
                                              ┌──────▼──────┐  ┌─▼──────┐
                                              │    APPLY    │  │REJECT  │
                                              │   CHANGES   │  │ & LOG  │
                                              └─────────────┘  └────────┘
```

### The 5 Safety Gates

| Gate | Function | Enforcement |
|------|----------|-------------|
| 🏛️ **Constitution** | No principle violations | Triple-judge, minority veto |
| 🧪 **Regression** | No contradictions of learned lessons | Cross-model validation |
| 📏 **Size** | No file bloat (>200 lines) | Deterministic limit |
| 🎯 **Drift** | No semantic departure from intent | Similarity threshold |
| 🛡️ **Safety** | No dangerous patterns | Triple-judge, minority veto |

---

## 📱 Social Media Automation Layer

```
┌──────────────────────────────────────────────────────────────────┐
│                    CONTENT COMMAND CENTER                         │
│                                                                   │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────────────┐  │
│  │ CONTENT  │───►│ MEDIA        │───►│ MULTI-PLATFORM        │  │
│  │ CREATOR  │    │ GENERATOR    │    │ DISTRIBUTOR           │  │
│  └──────────┘    └──────────────┘    └───────────┬───────────┘  │
│                                                  │               │
│                    ┌─────────┬─────────┬─────────┼─────────┐    │
│                    │         │         │         │         │     │
│               ┌────▼──┐ ┌───▼───┐ ┌───▼──┐ ┌───▼──┐ ┌───▼──┐  │
│               │  X/   │ │Insta- │ │Linked│ │Face- │ │TikTok│  │
│               │Twitter│ │gram   │ │In    │ │book  │ │      │  │
│               └───────┘ └───────┘ └──────┘ └──────┘ └──────┘  │
│                                                                   │
│  + Audience Mining  + Engagement Tracking  + Hashtag Strategy    │
│  + Comment Scraping + Follower Analysis   + Schedule Optimization│
└──────────────────────────────────────────────────────────────────┘
```

---

## ✉️ Email Outreach Engine

```
┌────────────┐   ┌──────────────┐   ┌──────────────┐   ┌───────────┐
│ LEAD       │──►│ EMAIL        │──►│ SEND ENGINE  │──►│ TRACKING  │
│ DATABASE   │   │ COMPOSER     │   │ (Multi-addr) │   │ & ANALYTICS│
└────────────┘   └──────────────┘   └──────────────┘   └───────────┘
                        │                                     │
                  ┌─────┴──────┐                        ┌─────┴──────┐
                  │ Template   │                        │ Auto-Reply │
                  │ Personalize│                        │ Classifier │
                  └────────────┘                        └────────────┘
```

- Personalized cold outreach at scale
- Drip sequences with smart follow-up
- Open/click/reply tracking
- Auto-classification of responses

---

## 💾 Intelligent Memory Architecture

```
┌──────────────────────────────────────────────────────┐
│                  MEMORY HIERARCHY                     │
│                                                       │
│  ┌─────────────────────────────────────────────────┐│
│  │ 🔴 HOT MEMORY (Always Active)                   ││
│  │ Hard rules, safety protocols, confirmed patterns ││
│  └─────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │ 🟡 CONTEXT MEMORY (Project-Specific)            ││
│  │ Domain rules, active projects, outreach configs  ││
│  └─────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │ 🔵 SEMANTIC MEMORY (Knowledge Graph)            ││
│  │ Entity relationships, learned facts, procedures  ││
│  └─────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │ ⚫ ARCHIVE (Inactive Patterns)                  ││
│  │ Retired rules, completed projects, old configs   ││
│  └─────────────────────────────────────────────────┘│
│                                                       │
│  Scoring: 50% similarity + 30% recency + 20% weight  │
│  Promotion: Episodic → Semantic (daily, automated)    │
│  Pruning: Low-importance entries (>30 days stale)     │
└──────────────────────────────────────────────────────┘
```

---

## ⏰ Cron Automation System

```
┌─────────────────────────────────────────────────────────┐
│                  SCHEDULER ENGINE                        │
│                                                          │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────────┐│
│  │ DAILY     │  │ WEEKLY    │  │ EVENT-DRIVEN          ││
│  │ REPORTS   │  │ DIGESTS   │  │ TRIGGERS              ││
│  └─────┬─────┘  └─────┬─────┘  └──────────┬───────────┘│
│        │              │                    │             │
│        └──────────────┼────────────────────┘             │
│                       │                                  │
│              ┌────────▼────────┐                         │
│              │ EXECUTION ENGINE│                         │
│              │ (Isolated Agent)│                         │
│              └────────┬────────┘                         │
│                       │                                  │
│         ┌─────────────┼─────────────┐                   │
│         │             │             │                    │
│    ┌────▼────┐  ┌─────▼────┐  ┌────▼─────┐             │
│    │ EMAIL   │  │ SOCIAL   │  │ RESEARCH │             │
│    │ BRIEFS  │  │ POSTS    │  │ CYCLES   │             │
│    └─────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

## 🕷️ Web Intelligence System

```
┌──────────────────────────────────────────────┐
│           SCRAPING ARSENAL                    │
│                                               │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Fast Fetcher │  │ Stealth Fetcher      │ │
│  │ TLS imperson.│  │ Cloudflare bypass    │ │
│  │ Standard req │  │ hCaptcha solving     │ │
│  └──────────────┘  └──────────────────────┘ │
│                                               │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Dynamic      │  │ Adaptive Parser      │ │
│  │ Browser Auto │  │ Survives DOM changes │ │
│  │ Playwright   │  │ Element resilience   │ │
│  └──────────────┘  └──────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

## 🎬 Video Generation Pipeline

```
  Text Prompt ──► Script Writer ──► Composition Builder
                                           │
                                    ┌──────▼──────┐
                                    │ RENDER ENGINE│
                                    │ (Remotion)   │
                                    └──────┬──────┘
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                         ┌────▼───┐  ┌────▼────┐  ┌───▼──────┐
                         │ MP4    │  │ GIF     │  │ PUBLISH   │
                         │ Export │  │ Preview │  │ (here.now)│
                         └────────┘  └─────────┘  └──────────┘
```

Custom compositions, brand-consistent output, batch production, automatic publishing.

---

## 🛡️ Security Model

- **Policy Layer** — 4 enforcement points prevent unverified claims and hallucinated actions
- **Goal Engine** — Structured execution with budgets, validation, and failure recovery
- **Constitution Gate** — Triple-judge voting on all self-modifications
- **Permission System** — Role-based access control across all operations
- **Fail-Closed** — Safety-critical gates reject on error, never approve

---

<div align="center">

**Every component is autonomous. Every component is monitored. Every component can be trusted.**

</div>

---
name: capability-check
description: |
  MANDATORY first step when user provides any new tool, repo, or skill.
  Checks environment constraints, external dependencies, and API requirements
  BEFORE attempting setup. Ask user what they have access to before proceeding.
  Use when: User shares a GitHub repo, mentions a tool, asks to "look at" or "set up" something new.
---

# Capability Check Skill

## Purpose
Prevent wasted time by evaluating feasibility BEFORE setup attempts.

## When to Use
- User shares a GitHub URL
- User asks to "set up" or "install" a tool
- User mentions a new framework/service
- User says "check this out" or "can we use this"

## The Check Process

### Step 1: Identify Requirements
Scan the tool/repo for:
1. **External services needed** (APIs, databases, cloud services)
2. **Runtime requirements** (Python version, Node version, specific OS)
3. **GUI/Desktop dependencies** (browsers, display, FFmpeg, ImageMagick)
4. **Account credentials** (API keys, tokens, login profiles)
5. **Infrastructure** (needs to run locally vs can run on VPS)

### Step 2: Check My Environment
**What I HAVE:**
- Node.js v22
- Docker container (no GUI, no display)
- Basic CLI tools (curl, git, jq)
- Limited Python support
- No browser automation capability
- No video processing (no FFmpeg/ImageMagick)

**What I CANNOT do:**
- Run Firefox/Chrome automation
- Process video/audio locally
- Maintain long-running daemons
- Access your local machine's GUI

### Step 3: Ask User FIRST
Before any setup, ask:

> "This tool needs [X, Y, Z]. I can't run [A, B] from the VPS.
> 
> Do you:
> 1. Have access to [X, Y] and want to run locally?
> 2. Want me to adapt parts that CAN work here?
> 3. Want to skip this entirely?"

### Step 4: Proceed Only After Confirmation
- If user confirms they have requirements → proceed
- If user says skip → move on
- If user wants adaptation → identify what works

## Common Red Flags

| Requirement | Can I Run It? | Ask User |
|-------------|---------------|----------|
| Browser automation (Selenium, Puppeteer) | ❌ No | "Needs a local browser profile" |
| FFmpeg/video processing | ❌ No | "Needs local machine with FFmpeg" |
| Desktop GUI app | ❌ No | "Needs to run on your machine" |
| Paid API key | ❓ Maybe | "Do you have an API key for X?" |
| Account login required | ❓ Maybe | "Do you have login for X?" |
| Python 3.12+ specific | ⚠️ Limited | "May need Python setup" |
| Database (Postgres, etc.) | ⚠️ Maybe | "Can use SQLite or need external DB?" |

## Response Template

When user shares a new tool, respond with:

```
[Tool Name] Requirements Check:

**What it needs:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**What I can't run:**
- [List VPS-incompatible items]

**What I can help with:**
- [List parts that work here]

Do you have [critical requirements]? Should we proceed or skip?
```

## Examples

### Example 1: MoneyPrinterV2
```
MoneyPrinterV2 Requirements Check:

**What it needs:**
- Firefox browser with logged-in profiles (Twitter/YouTube)
- Ollama for local LLM
- Gemini API for image generation
- SMTP credentials for email outreach
- FFmpeg + ImageMagick for video processing

**What I can't run:**
- Firefox automation (no browser on VPS)
- Video processing (no FFmpeg)

**What I can help with:**
- Code analysis and modification
- LLM API calls if you provide an endpoint
- Google Maps scraper (if Go installed)

Do you have Firefox profiles and want to run locally, or should we skip?
```

### Example 2: A GitHub repo for a Discord bot
```
DiscordBot Requirements Check:

**What it needs:**
- Discord bot token
- Node.js 18+

**What I can run:**
- ✅ Node.js apps
- ✅ Long-running processes (with process tool)

**What I need from you:**
- Discord bot token

Do you have a Discord bot token? Should I set this up?
```

## Remember
- ALWAYS ask before setup
- NEVER assume user has API keys
- Identify blockers UP FRONT
- Save both of us time

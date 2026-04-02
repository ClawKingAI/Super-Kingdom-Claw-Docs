# 🚀 Quick Start: Deploy Your Kingdom Claw Instance

**30 minutes to a running enterprise AI agent system.**

---

## Prerequisites

- VPS or cloud server (2GB RAM minimum)
- Ubuntu 22.04+ or similar Linux
- Domain name (optional)
- API keys for models (OpenAI, NVIDIA, Anthropic, etc.)

---

## Step 1: Install OpenClaw (5 min)

```bash
# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install OpenClaw
npm install -g openclaw

# Create workspace
mkdir -p ~/.openclaw/workspace
cd ~/.openclaw/workspace
```

---

## Step 2: Clone This Repository (2 min)

```bash
cd ~/.openclaw/workspace
git clone https://github.com/ClawKingAI/Super-Kingdom-Claw-Docs.git kingdom-claw
cd kingdom-claw
```

---

## Step 3: Configure API Keys (5 min)

Create `~/.openclaw/config.yaml`:

```yaml
providers:
  - name: nvidia
    apiKey: YOUR_NVIDIA_API_KEY
    models:
      - nvidia/z-ai/glm5
      - nvidia/moonshotai/kimi-k2.5
      
  - name: openai
    apiKey: YOUR_OPENAI_API_KEY
    models:
      - openai/gpt-4.1
      - openai/gpt-5.2

agents:
  defaultModel: nvidia/z-ai/glm5
  skills:
    - ~/.openclaw/workspace/kingdom-claw/skills/kingdom-mastery
    - ~/.openclaw/workspace/kingdom-claw/repos/antigravity-awesome-skills/skills

memory:
  path: ~/.openclaw/workspace/kingdom-claw/memory
```

---

## Step 4: Start the Gateway (2 min)

```bash
openclaw gateway start
```

---

## Step 5: Connect Telegram (10 min)

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add to config:

```yaml
channels:
  - name: telegram
    token: YOUR_BOT_TOKEN
```

4. Restart gateway:

```bash
openclaw gateway restart
```

---

## Step 6: Test Your Agent

Send a message to your Telegram bot:

```
Hello Kingdom Claw! Use @kingdom-mastery to help me plan a marketing campaign.
```

---

## Step 7: Customize Your Agents

Edit `kingdom-claw-core/personas/library/` to add your custom agents.

---

## Troubleshooting

### Gateway won't start
```bash
openclaw gateway status
openclaw gateway restart
```

### Model errors
```bash
# Check API keys
openclaw config get providers

# Test model
openclaw model test nvidia/z-ai/glm5
```

### Skills not loading
```bash
# Verify skill path
ls -la ~/.openclaw/workspace/kingdom-claw/skills/

# Check skill format
cat ~/.openclaw/workspace/kingdom-claw/skills/kingdom-mastery/SKILL.md
```

---

## Next Steps

1. Read [SYSTEM-OVERVIEW.md](../architecture/SYSTEM-OVERVIEW.md)
2. Browse [Agent Library](../kingdom-claw-core/personas/library/)
3. Explore [1,340+ Skills](../repos/antigravity-awesome-skills/skills/)
4. Set up [Self-Evolution](../skills/self-evolution-engine/)

---

**You now have an enterprise AI system running.** 🎉

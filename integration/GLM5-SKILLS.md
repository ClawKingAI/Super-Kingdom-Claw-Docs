# GLM-5 Integration — Official Skill Ecosystem

> **The Model Behind Kingdom Claw** — GLM-5 skills and optimization

---

## What This Is

Kingdom Claw runs on **GLM-5** (`nvidia/z-ai/glm5`) — a 744B parameter model with 40B active parameters, purpose-built for complex systems engineering and long-horizon agentic tasks.

This document captures the **official skill ecosystem** from the GLM-5 repository.

---

## Model Specifications

| Spec | Value |
|------|-------|
| Total Parameters | 744B |
| Active Parameters | 40B |
| Pre-training Data | 28.5T tokens |
| Sparse Attention | DeepSeek DSA |
| Context Length | Long-context capable |
| Precision | BF16 / FP8 |

---

## Performance Benchmarks

### vs GLM-4.7
- **Reasoning**: Significantly improved
- **Coding**: Best-in-class open source
- **Agentic tasks**: Best-in-class open source

### vs Claude Opus 4.5
- **Vending Bench 2**: $4,432 balance (approaching Opus)
- **CC-Bench-V2**: Narrowing gap on frontend, backend, long-horizon tasks

### Key Insight
GLM-5 ranks **#1 among open-source models** on long-term operational benchmarks, demonstrating strong planning and resource management over extended horizons.

---

## Official Skill Ecosystem

### GLM-OCR Skills

| Skill | Purpose | Use Case |
|-------|---------|----------|
| `glmocr` | General OCR | Text extraction from images |
| `glmocr-table` | Table extraction | Parse tables from PDFs/images |
| `glmocr-formula` | Formula extraction | Extract math formulas |
| `glmocr-handwriting` | Handwriting OCR | Read handwritten documents |

### GLM-Image Skills

| Skill | Purpose | Use Case |
|-------|---------|----------|
| `glm-image-gen` | Text-to-image | Generate images from prompts |

### GLM-V Skills (Vision)

| Skill | Purpose | Use Case |
|-------|---------|----------|
| `glmv-caption` | Image/video captioning | Describe visual content |
| `glmv-prompt-gen` | Prompt generation | Generate prompts from visuals |
| `glmv-resume-screen` | Resume screening | Analyze candidate documents |
| `glmv-grounding` | Object localization | Find objects in images/video |
| `glmv-doc-based-writing` | Document generation | Create content from PDF/DOCX |
| `glmv-pdf-to-ppt` | PDF to presentation | Convert PDFs to slides |
| `glmv-pdf-to-web` | PDF to website | Create academic websites |
| `glmv-prd-to-app` | PRD to application | Build full-stack apps from PRD |
| `glmv-web-replication` | Website cloning | Replicate frontend designs |

---

## Skill Format

GLM skills use the same SKILL.md format as Kingdom Claw:

```yaml
---
name: glmv-prd-to-app
description: Build full-stack web app from PRD documents
metadata:
  openclaw:
    requires:
      env: [ZHIPU_API_KEY]
      bins: []
    emoji: "🚀"
    homepage: https://github.com/zai-org/GLM-V
---

# Skill implementation...
```

---

## Installation

### Method A: Clawhub (Recommended)

```bash
# Install individual skills
npx clawhub@latest install glmocr
npx clawhub@latest install glmv-caption
npx clawhub@latest install glmv-prd-to-app

# Install multiple at once
npx clawhub@latest install \
  glmocr glmocr-table glmocr-formula \
  glmv-caption glmv-prompt-gen glmv-prd-to-app
```

### Method B: GitHub Clone

```bash
# Clone the repositories
git clone https://github.com/zai-org/GLM-OCR.git
git clone https://github.com/zai-org/GLM-V.git
git clone https://github.com/zai-org/GLM-Image.git

# Copy skills to Kingdom Claw
cp -r GLM-OCR/skills/* ~/.openclaw/skills/
cp -r GLM-V/skills/* ~/.openclaw/skills/
cp -r GLM-Image/skills/* ~/.openclaw/skills/
```

---

## Configuration for GLM-5

### Model Settings

```yaml
model:
  provider: nvidia
  model: z-ai/glm5
  
  # GLM-5 specific parsers (per official docs)
  tool-call-parser: glm47
  reasoning-parser: glm45
  
  # Fallback configuration
  fallback:
    - provider: nvidia
      model: qwen/qwen3-coder-480b-a35b-instruct
    - provider: openai
      model: gpt-4
```

### Environment Variables

```bash
# Required for GLM skills
export ZHIPU_API_KEY="your-key-here"

# For NVIDIA NIM (what we use)
export NVIDIA_API_KEY="your-nvidia-key"
```

---

## Integration with Kingdom Claw Core

### Using GLM Skills with Parallel Agents

```python
from kingdom_claw_core.plugins.parallel_agents import (
    ParallelAgentExecutor,
    AgentTask,
    AgentRole,
)

# Use GLM-V skill for document analysis
executor = ParallelAgentExecutor()

tasks = [
    AgentTask(
        name="ocr_extract",
        role=AgentRole.HAIKU,
        prompt="Extract text from document using glmocr"
    ),
    AgentTask(
        name="caption_generate",
        role=AgentRole.SONNET,
        prompt="Generate caption using glmv-caption"
    ),
    AgentTask(
        name="app_build",
        role=AgentRole.OPUS,
        prompt="Build app from PRD using glmv-prd-to-app"
    ),
]

results = executor.execute_parallel(tasks)
```

### Using GLM Skills with Hooks

```python
from kingdom_claw_core.plugins.hooks import (
    HookRegistry,
    HookDefinition,
    HookPoint,
    HookContext,
    HookResult,
    HookAction,
)

# Register hook for GLM skill activation
def glm_skill_router(ctx: HookContext) -> HookResult:
    message = ctx.message or ""
    
    # Route to appropriate GLM skill
    if "extract" in message.lower() and "pdf" in message.lower():
        return HookResult(
            action=HookAction.REDIRECT,
            redirect_target="glmocr-table"
        )
    elif "build" in message.lower() and "app" in message.lower():
        return HookResult(
            action=HookAction.REDIRECT,
            redirect_target="glmv-prd-to-app"
        )
    
    return HookResult(action=HookAction.ALLOW)

registry = HookRegistry()
registry.register(HookDefinition(
    name="glm-skill-router",
    hook_point=HookPoint.MESSAGE_RECEIVED,
    handler=glm_skill_router,
    priority=50
))
```

---

## Recommended Skills for Kingdom Claw

### Priority 1: Document Processing
- `glmocr` — Text extraction
- `glmocr-table` — Table parsing
- `glmv-doc-based-writing` — Content generation

### Priority 2: App Development
- `glmv-prd-to-app` — Build apps from requirements
- `glmv-pdf-to-web` — Convert documents to websites
- `glmv-web-replication` — Clone frontend designs

### Priority 3: Vision Tasks
- `glmv-caption` — Image/video description
- `glmv-grounding` — Object localization
- `glm-image-gen` — Image generation

---

## Deployment Optimization

### vLLM Configuration

```bash
vllm serve zai-org/GLM-5-FP8 \
  --tensor-parallel-size 8 \
  --gpu-memory-utilization 0.85 \
  --speculative-config.method mtp \
  --speculative-config.num_speculative_tokens 1 \
  --tool-call-parser glm47 \
  --reasoning-parser glm45 \
  --enable-auto-tool-choice \
  --served-model-name glm-5-fp8
```

### SGLang Configuration

```bash
sglang serve \
  --model-path zai-org/GLM-5-FP8 \
  --tp-size 8 \
  --tool-call-parser glm47 \
  --reasoning-parser glm45 \
  --speculative-algorithm EAGLE \
  --speculative-num-steps 3 \
  --speculative-eagle-topk 1 \
  --speculative-num-draft-tokens 4 \
  --mem-fraction-static 0.85
```

---

## Why This Matters

### The Complete Picture

| Layer | What We Have |
|-------|---------------|
| **Model** | GLM-5 (744B/40B active) |
| **Architecture** | Kingdom Claw Core |
| **Patterns** | Official Anthropic + Agentic |
| **Skills** | GLM-5 official ecosystem |
| **Deployment** | vLLM/SGLang guides |

### Integration Benefits

1. **Native Optimization** — Skills designed specifically for GLM-5
2. **Proven Performance** — Benchmarked on Vending Bench 2, CC-Bench-V2
3. **Long-Horizon Capability** — Proven planning over extended periods
4. **Tool Call Support** — Native `glm47` tool parser
5. **Reasoning Support** — Native `glm45` reasoning parser

---

## Key Learnings

### 1. Model-Specific Skills Exist
GLM-5 has a **dedicated skill ecosystem** optimized for its capabilities.

### 2. Skill Format Is Compatible
GLM skills use the same SKILL.md format we already support.

### 3. Clawhub Integration
Skills can be installed via `npx clawhub@latest install <skill>`.

### 4. Parser Configuration
GLM-5 requires specific parsers:
- `tool-call-parser: glm47`
- `reasoning-parser: glm45`

### 5. Long-Horizon Strength
Vending Bench 2 result ($4,432) shows GLM-5 excels at extended planning — ideal for multi-step agent workflows.

---

## Action Items

- [x] Document GLM-5 skill ecosystem
- [ ] Install priority GLM skills
- [ ] Configure GLM-5 parsers in config
- [ ] Create GLM skill routing examples
- [ ] Benchmark GLM-5 on Kingdom Claw tasks

---

## Resources

- **GLM-5 Repo**: https://github.com/zai-org/GLM-5
- **GLM-OCR**: https://github.com/zai-org/GLM-OCR
- **GLM-V**: https://github.com/zai-org/GLM-V
- **GLM-Image**: https://github.com/zai-org/GLM-Image
- **API Docs**: https://docs.z.ai/guides/llm/glm-5
- **Technical Report**: https://arxiv.org/abs/2602.15763

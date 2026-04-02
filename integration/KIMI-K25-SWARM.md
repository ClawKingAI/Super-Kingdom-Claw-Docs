# Kimi K2.5 Integration — Agent Swarm Architecture

> **Moonshot's Most Powerful Model** — Native multimodal agentic with swarm execution

---

## What This Is

Kimi K2.5 is Moonshot AI's flagship model — a **1 trillion parameter MoE** with 32B active parameters, designed specifically for **agentic tasks** and **agent swarm execution**.

This is significant because it introduces a **fundamentally different architecture**: swarm-based multi-agent coordination.

---

## Model Specifications

| Spec | Value |
|------|-------|
| Total Parameters | 1T |
| Active Parameters | 32B |
| Architecture | Mixture-of-Experts (MoE) |
| Number of Experts | 384 |
| Selected Experts per Token | 8 |
| Context Length | **256K tokens** |
| Attention Mechanism | MLA (Multi-Head Latent Attention) |
| Vision Encoder | MoonViT (400M params) |
| Pre-training Data | **15T mixed visual + text tokens** |

---

## Key Innovation: Agent Swarm

### What Makes K2.5 Different

| Traditional | Kimi K2.5 |
|-------------|-----------|
| Single agent scaling | Agent swarm coordination |
| Sequential execution | Parallel sub-task execution |
| Fixed agent | Dynamically instantiated agents |
| One-size-fits-all | Domain-specific agents |

### Agent Swarm Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPLEX TASK                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MAIN AGENT                                │
│  • Decompose task into sub-tasks                            │
│  • Coordinate agent swarm                                   │
│  • Aggregate results                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ SUB-AGENT 1 │  │ SUB-AGENT 2 │  │ SUB-AGENT 3 │
│ (Domain A)  │  │ (Domain B)  │  │ (Domain C)  │
│             │  │             │  │             │
│ Max 100     │  │ Max 100     │  │ Max 100     │
│ steps       │  │ steps       │  │ steps       │
└─────────────┘  └─────────────┘  └─────────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 AGGREGATED RESULT                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Benchmark Performance

### vs GPT-5.2, Claude 4.5 Opus, Gemini 3 Pro

| Benchmark | Kimi K2.5 | GPT-5.2 | Claude 4.5 | Gemini 3 |
|-----------|-----------|---------|------------|----------|
| **Reasoning & Knowledge** |
| HLE-Full (w/tools) | **50.2** | 45.5 | 43.2 | 45.8 |
| AIME 2025 | 96.1 | **100** | 92.8 | 95.0 |
| GPQA-Diamond | 87.6 | **92.4** | 87.0 | 91.9 |
| **Vision & Multimodal** |
| MMMU-Pro | 78.5 | 79.5* | 74.0 | **81.0** |
| OCRBench | **92.3** | 80.7* | 86.5* | 90.3* |
| VideoMMMU | 86.6 | 85.9 | 84.4* | **87.6** |
| **Coding** |
| SWE-Bench Verified | 76.8 | 80.0 | **80.9** | 76.2 |
| LiveCodeBench (v6) | 85.0 | - | 82.2* | **87.4** |
| **Agentic Search** |
| BrowseComp (Swarm) | **78.4** | - | - | - |
| WideSearch (Swarm) | **79.0** | - | 76.2* | 57.0 |

### Key Insight

**Agent Swarm mode dramatically improves agentic search:**
- BrowseComp: 60.6 → 78.4 (+29%)
- WideSearch: 72.7 → 79.0 (+9%)

---

## Native Multimodality

### Capabilities

| Capability | Description |
|------------|-------------|
| **Vision-Language** | Pre-trained on 15T mixed tokens |
| **Coding with Vision** | Generate code from UI designs |
| **Visual Tool Use** | Orchestrate tools for visual data |
| **Long Video** | 256K context for video analysis |
| **Document OCR** | Best-in-class OCRBench (92.3) |

### Vision Benchmarks

| Benchmark | Score |
|-----------|-------|
| MathVision | 84.2 |
| MathVista (mini) | **90.1** |
| OCRBench | **92.3** |
| OmniDocBench 1.5 | 88.8 |
| InfoVQA (val) | **92.6** |
| VideoMME | 87.4 |

---

## Dual Mode: Thinking + Instant

### Thinking Mode (Default)

- Extended reasoning for complex tasks
- Temperature: 1.0
- Top-p: 0.95
- Max tokens: 256K

### Instant Mode

- Fast responses for simple queries
- Temperature: 0.6
- Top-p: 0.95
- Enable: `{'chat_template_kwargs': {"thinking": False}}`

---

## Deployment

### vLLM

```bash
vllm serve $MODEL_PATH \
  -tp 8 \
  --mm-encoder-tp-mode data \
  --trust-remote-code \
  --tool-call-parser kimi_k2 \
  --reasoning-parser kimi_k2
```

### SGLang

```bash
sglang serve \
  --model-path $MODEL_PATH \
  --tp 8 \
  --trust-remote-code \
  --tool-call-parser kimi_k2 \
  --reasoning-parser kimi_k2
```

### KTransformers (CPU+GPU)

```bash
python -m sglang.launch_server \
  --model path/to/Kimi-K2.5/ \
  --kt-cpuinfer 64 \
  --kt-num-gpu-experts 180 \
  --tensor-parallel-size 8
```

---

## Integration with Kingdom Claw

### 1. Model Configuration

```yaml
model:
  provider: moonshot
  model: moonshot/Kimi-K2.5
  
  # K2.5 specific parsers
  tool-call-parser: kimi_k2
  reasoning-parser: kimi_k2
  
  # Dual mode support
  temperature: 1.0  # Thinking mode
  top_p: 0.95
  
  fallback:
    - provider: nvidia
      model: z-ai/glm5
```

### 2. Agent Swarm Integration

```python
from kingdom_claw_core.plugins.parallel_agents import (
    ParallelAgentExecutor,
    AgentTask,
    AgentRole,
)

# K2.5 Agent Swarm pattern
executor = ParallelAgentExecutor()

# Main agent coordinates
main_tasks = [
    AgentTask(
        name="decompose",
        role=AgentRole.OPUS,
        prompt="Decompose this task into parallel sub-tasks"
    )
]

# Sub-agents execute in parallel
sub_tasks = [
    AgentTask(name="domain_a", role=AgentRole.SONNET, prompt="..."),
    AgentTask(name="domain_b", role=AgentRole.SONNET, prompt="..."),
    AgentTask(name="domain_c", role=AgentRole.SONNET, prompt="..."),
]

# Swarm execution
results = executor.execute_parallel(sub_tasks, max_workers=3)
```

### 3. Multimodal Tool Integration

```python
# Use K2.5's vision capabilities with Kingdom Claw hooks
from kingdom_claw_core.plugins.hooks import (
    HookRegistry,
    HookDefinition,
    HookPoint,
    HookContext,
    HookResult,
    HookAction,
)

def kimi_vision_router(ctx: HookContext) -> HookResult:
    if ctx.tool_params and "image" in ctx.tool_params:
        # Route to K2.5's native vision processing
        return HookResult(
            action=HookAction.MODIFY,
            modified_context=HookContext(
                hook_point=HookPoint.PRE_TOOL_USE,
                tool_name="kimi_vision",
                tool_params=ctx.tool_params
            )
        )
    return HookResult(action=HookAction.ALLOW)

registry.register(HookDefinition(
    name="kimi-vision-router",
    hook_point=HookPoint.PRE_TOOL_USE,
    handler=kimi_vision_router
))
```

---

## What K2.5 Adds to Kingdom Claw

### New Capabilities

| Capability | Impact |
|------------|--------|
| Agent Swarm | Parallel sub-task execution |
| 256K Context | Long video/document processing |
| Native Multimodal | Vision-language pre-training |
| Dual Mode | Thinking (complex) + Instant (fast) |

### Complementary to GLM-5

| Aspect | GLM-5 | Kimi K2.5 |
|--------|-------|-----------|
| Params | 744B/40B | 1T/32B |
| Context | Long | 256K |
| Strength | Long-horizon planning | Agent swarm |
| Vision | Via GLM-V skills | Native multimodal |

---

## Recommended Use Cases

### K2.5 Optimal

1. **Complex multi-domain tasks** — Agent swarm coordination
2. **Long video analysis** — 256K context
3. **Visual coding** — UI → code generation
4. **Document-heavy workflows** — Native OCR + vision
5. **Agentic search** — BrowseComp, WideSearch benchmarks

### GLM-5 Optimal

1. **Long-horizon planning** — Vending Bench proven
2. **Business operations** — Extended planning
3. **Sequential reasoning** — Multi-step analysis
4. **Document processing** — GLM-OCR skills

---

## Parser Requirements

```yaml
# K2.5 requires specific parsers
parsers:
  tool-call: kimi_k2      # Tool calling format
  reasoning: kimi_k2       # Thinking mode processing
```

---

## API Access

```python
import openai

# Moonshot official API
client = openai.OpenAI(
    api_key="your-moonshot-api-key",
    base_url="https://api.moonshot.ai/v1"
)

# Thinking mode (default)
response = client.chat.completions.create(
    model="kimi-k2-5",
    messages=[{"role": "user", "content": "..."}]
)

# Instant mode
response = client.chat.completions.create(
    model="kimi-k2-5",
    messages=[{"role": "user", "content": "..."}],
    extra_body={"chat_template_kwargs": {"thinking": False}}
)
```

---

## Key Learnings

### 1. Agent Swarm Is a Paradigm Shift

From single-agent scaling to coordinated multi-agent execution. K2.5 is designed for this.

### 2. Native Multimodal ≠ Vision Adapter

K2.5 was pre-trained on 15T vision-language tokens — not a bolted-on vision adapter.

### 3. Dual Mode Matters

Thinking mode for complex tasks, Instant mode for fast responses. Same model, different behavior.

### 4. Context Length Enables New Use Cases

256K tokens = full video analysis, long documents, extended agent conversations.

### 5. Domain-Specific Agents

Agent swarm allows dynamically instantiated agents for specific domains — not one-size-fits-all.

---

## Resources

- **Repository**: https://github.com/MoonshotAI/Kimi-K2.5
- **API Platform**: https://platform.moonshot.ai
- **Technical Report**: `/tech_report.pdf` in repo
- **Deployment Guide**: `/docs/deploy_guidance.md`
- **WorldVQA Benchmark**: https://github.com/MoonshotAI/WorldVQA

---

## Action Items

- [ ] Add Kimi K2.5 to model configuration
- [ ] Implement agent swarm execution pattern
- [ ] Configure kimi_k2 parsers
- [ ] Test dual mode (Thinking/Instant)
- [ ] Benchmark on Kingdom Claw tasks

---

## Comparison Summary

| Model | Params | Active | Context | Key Strength |
|-------|--------|--------|---------|--------------|
| GLM-5 | 744B | 40B | Long | Long-horizon planning |
| Kimi K2.5 | 1T | 32B | 256K | Agent swarm, vision |
| Claude Opus 4.5 | - | - | 200K | Reasoning, coding |
| GPT-5.2 | - | - | - | General purpose |

**Kingdom Claw can leverage both GLM-5 and K2.5 for different use cases.**

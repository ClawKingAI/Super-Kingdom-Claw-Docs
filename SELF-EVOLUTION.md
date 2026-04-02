# SELF-EVOLUTION.md

## Kingdom Claw Self-Evolution Engine

Based on Phantom's architecture, adapted for Kingdom Claw with Kimi K2.5 as the cross-model judge.

---

## Overview

After each significant session, Kingdom Claw runs a 6-step pipeline:
1. **Observe** — Extract corrections, preferences, domain facts
2. **Critique** — Compare against current config
3. **Generate** — Create atomic change proposals
4. **Validate** — Run through 5 gates
5. **Apply** — Write approved changes
6. **Consolidate** — Periodically compress observations into principles

---

## The 5 Gates

Every proposed change must pass ALL 5 gates. A single failure rejects the change.

### Gate 1: Constitution
- Checks for violations of immutable principles (CONSTITUTION.md)
- Hard-coded violation patterns (self-preservation, bypass, deceive, etc.)
- **Enforcement:** Triple-judge with minority veto (Kimi K2.5)
- **Failure mode:** Fail-closed (rejects on error)

### Gate 2: Regression
- Checks against the Golden Suite (learned lessons from successful sessions)
- Prevents contradicting established knowledge
- **Enforcement:** Single Kimi K2.5 judge
- **Failure mode:** Fail-open (falls back to heuristic on error)

### Gate 3: Size
- Prevents config file bloat
- Default limit: 200 lines per file
- **Enforcement:** Deterministic (line count)
- **Failure mode:** Reject if over limit

### Gate 4: Drift
- Prevents semantic drift from original intent
- Default threshold: 0.7 similarity
- **Enforcement:** Jaccard similarity on token sets
- **Failure mode:** Reject if similarity < threshold

### Gate 5: Safety
- Blocks dangerous modifications
- Patterns: self-preservation, permission expansion, safety removal, sentience claims
- **Enforcement:** Triple-judge with minority veto (Kimi K2.5)
- **Failure mode:** Fail-closed (rejects on error)

---

## Kimi K2.5 as Cross-Model Judge

**Why Kimi K2.5?**
- 1T parameter multimodal model
- Strong reasoning capabilities
- Independent from NVIDIA GLM-5 (primary model)
- Prevents self-enhancement bias

**Judge Configuration:**
| Gate | Model | Strategy | Purpose |
|------|-------|----------|---------|
| Observation | GLM-5 | Single | Extract from sessions |
| Safety | Kimi K2.5 | Triple, minority veto | Block unsafe changes |
| Constitution | Kimi K2.5 | Triple, minority veto | Enforce principles |
| Regression | Kimi K2.5 | Single | Check golden suite |
| Quality | Kimi K2.5 | Single | Assess session quality |

**Triple-Judge Voting:**
- 3 independent Kimi K2.5 calls
- Each judge votes pass/fail
- **Minority veto:** One dissenting judge blocks the change
- Prevents any single judge error from approving bad changes

---

## Config Files (Evolved Config)

```
/data/.openclaw/workspace/
├── CONSTITUTION.md      # Immutable (Tier 1) — NEVER modified
├── MEMORY.md            # Long-term memory (Tier 2) — Constrained
├── USER.md              # User profile (Tier 3) — Free
├── TOOLS.md             # Environment facts (Tier 3) — Free
├── SELF-EVOLUTION.md    # This file (Tier 1) — NEVER modified
├── memory/
│   ├── golden-suite.jsonl    # Learned lessons
│   ├── session-log.jsonl     # Raw session data
│   ├── corrections.md        # Log of corrections
│   └── principles.md         # Distilled principles
└── meta/
    ├── version.json          # Current version
    ├── metrics.json          # Success/failure rates
    └── evolution-log.jsonl   # Change history
```

**Tier System:**
- **Tier 1 (Immutable):** Constitution, SELF-EVOLUTION.md — Cannot be modified
- **Tier 2 (Constrained):** MEMORY.md — Limited modification scope
- **Tier 3 (Free):** USER.md, TOOLS.md, memory/* — Full modification allowed

---

## Observation Types

Extracted from session transcripts:

| Type | Example | Target File |
|------|---------|-------------|
| `correction` | "No, do it this way instead" | memory/corrections.md |
| `preference` | "I prefer short summaries" | USER.md |
| `domain_fact` | "The API key is in .env" | TOOLS.md |
| `error` | "That approach timed out" | memory/principles.md |
| `success` | "The deployment worked" | memory/golden-suite.jsonl |
| `tool_pattern` | "Used browser for scraping" | MEMORY.md |

---

## Pipeline Triggers

**Automatic:**
- After sessions with corrections
- After sessions with explicit preferences stated
- Weekly consolidation (Sundays at 9 AM ET via cron)

**Manual:**
- David says "run self-evolution"
- David says "update memory from this session"

---

## Metrics Tracked

```json
{
  "session_count": 0,
  "success_count": 0,
  "failure_count": 0,
  "correction_count": 0,
  "evolution_count": 0,
  "rollback_count": 0,
  "last_session_at": null,
  "last_evolution_at": null,
  "success_rate_7d": 0.0,
  "correction_rate_7d": 0.0,
  "sessions_since_consolidation": 0
}
```

---

## Auto-Rollback

**Trigger:**
- Success rate drops below 10% over 5 consecutive sessions
- OR correction rate exceeds 50% over 5 sessions

**Action:**
- Automatically revert to previous version
- Log rollback reason
- Notify David

---

## Cost Management

- Kimi K2.5 judge calls tracked per day
- Daily cost cap: $20/day (configurable)
- When cap reached: Fall back to heuristic validation
- Judge costs logged in `meta/metrics.json`

---

## Implementation

**Files to create:**
- `scripts/self-evolution.js` — Main pipeline runner
- `scripts/observation-extractor.js` — Extract from sessions
- `scripts/gate-validator.js` — Run 5 gates
- `scripts/consolidation.js` — Periodic compression

**Cron jobs:**
```
# Weekly consolidation
0 9 * * 0 cd /data/.openclaw/workspace && node scripts/consolidation.js

# Weekly self-evolution check
0 10 * * 0 cd /data/.openclaw/workspace && node scripts/self-evolution.js
```

---

## Version History

Every change creates a new version:

```json
{
  "version": 1,
  "parent": null,
  "timestamp": "2026-04-02T21:00:00Z",
  "session_id": "abc123",
  "changes": ["USER.md"],
  "metrics_snapshot": {
    "session_count": 1,
    "success_rate_7d": 1.0,
    "correction_rate_7d": 0.0
  }
}
```

---

## Rollback Command

```
cd /data/.openclaw/workspace && node scripts/rollback.js --version N
```

Restores all config files to version N state.

---

## Safety Guarantees

1. **Constitution is never modified** — Hard-coded rejection
2. **Triple-judge for safety-critical gates** — Minority veto
3. **Fail-closed on errors** — Constitution and Safety gates
4. **Every change is reversible** — Version history
5. **Cost caps prevent runaway** — Daily limit on judge calls
6. **Golden suite grows organically** — Successful corrections become lessons
7. **Consolidation prevents bloat** — Compresses old observations

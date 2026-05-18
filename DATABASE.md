# DATABASE.md — Intelligent Data Architecture

<div align="center">

**The Memory That Powers an Empire**

*Not a database. A living knowledge system.*

</div>

---

## 🧠 Memory System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                    INTELLIGENT MEMORY CORE                     │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐         │
│  │  EPISODIC    │  │  SEMANTIC   │  │  PROCEDURAL  │         │
│  │  MEMORY      │  │  MEMORY     │  │  MEMORY      │         │
│  │              │  │             │  │              │         │
│  │ Sessions     │  │ Facts       │  │ How-to       │         │
│  │ Events       │  │ Concepts    │  │ Workflows    │         │
│  │ Corrections  │  │ Entities    │  │ Procedures   │         │
│  └──────┬───────┘  └──────┬──────┘  └──────┬───────┘         │
│         │                  │                 │                  │
│         └──────────────────┼─────────────────┘                 │
│                            │                                    │
│                   ┌────────▼────────┐                          │
│                   │  BEHAVIORAL     │                          │
│                   │  MEMORY         │                          │
│                   │                 │                          │
│                   │  Rules          │                          │
│                   │  Guardrails     │                          │
│                   │  Corrections    │                          │
│                   └────────┬────────┘                          │
│                            │                                    │
│                   ┌────────▼────────┐                          │
│                   │ KNOWLEDGE GRAPH │                          │
│                   │                 │                          │
│                   │ Entity → Rel → │                          │
│                   │ Target triples  │                          │
│                   └─────────────────┘                          │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 Memory Types

| Type | Purpose | Retention | Example |
|------|---------|-----------|---------|
| **Episodic** | Session events & corrections | Promoted daily | "Operator prefers brief reports" |
| **Semantic** | Confirmed facts & concepts | Permanent | "Competitor pricing is $299/mo" |
| **Procedural** | Workflows & methods | Until superseded | "Deploy via here.now for speed" |
| **Behavioral** | Hard rules from corrections | Permanent | "Never auto-send outreach drafts" |
| **Knowledge Graph** | Entity relationships | Permanent | "Client → Industry → Competitors" |

---

## 🔄 Memory Lifecycle

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  CAPTURE │────►│  EPISODIC│────►│  PROMOTE │────►│ SEMANTIC │
│  (Live)  │     │  (Short) │     │  (Daily) │     │ (Long)   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                          │
                                                   ┌──────▼──────┐
                                                   │   PRUNE     │
                                                   │  (Weekly)   │
                                                   │ Low-wt >30d │
                                                   └─────────────┘
```

### Promotion Criteria
- Same observation appears **3+ times** → candidate for promotion
- Cross-validated across sessions → confirmed fact
- Operator correction → immediate behavioral rule

### Pruning Criteria
- Importance score < 0.3
- Age > 30 days with no recall hits
- Superseded by newer entry

---

## 🕸️ Knowledge Graph

```
┌──────────┐    serves    ┌──────────┐    competes    ┌──────────┐
│ Operator │─────────────►│ Industry │◄──────────────│Competitor│
└──────────┘              └──────────┘               └──────────┘
     │                         │                           │
     │ prefers                 │ contains                  │ targets
     ▼                         ▼                           ▼
┌──────────┐             ┌──────────┐                ┌──────────┐
│ Workflow │             │ Segment  │                │ Audience │
└──────────┘             └──────────┘                └──────────┘
```

**Supported Relations:** `serves`, `prefers`, `contains`, `competes`, `targets`, `depends_on`, `produces`, `tracks`

---

## 📋 Task Management System

```
┌──────────────────────────────────────────────┐
│              TASK QUEUE                        │
│                                                │
│  ┌─────────────────┐  ┌─────────────────┐    │
│  │   PENDING       │  │   COMPLETED     │    │
│  │                 │  │                 │    │
│  │ • Priority      │  │ • Output log    │    │
│  │ • Dependencies  │  │ • Duration      │    │
│  │ • Assigned Agent│  │ • Agent used    │    │
│  │ • Created at    │  │ • Completed at  │    │
│  └─────────────────┘  └─────────────────┘    │
│                                                │
│  Routing: Auto-assign based on task type      │
│  Timeout: Configurable per task (180s default)│
│  Retry: Max 3 with exponential backoff        │
└──────────────────────────────────────────────┘
```

---

## 📈 Campaign & Outreach Tracking

```
┌────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────┐
│  CAMPAIGN  │──►│  CONTACTS    │──►│  INTERACTIONS │──►│ METRICS  │
│            │   │              │   │               │   │          │
│ • Name     │   │ • Email      │   │ • Sent at     │   │ • Opens  │
│ • Status   │   │ • Name       │   │ • Opened at   │   │ • Clicks │
│ • Channel  │   │ • Source      │   │ • Replied at  │   │ • Reply  │
│ • Created  │   │ • Segment     │   │ • Clicked at  │   │ • Conv.  │
│ • Template │   │ • Score       │   │ • Body        │   │ • Revenue│
└────────────┘   └──────────────┘   └──────────────┘   └──────────┘
```

**Guardrail:** All outreach is draft-for-review. Nothing auto-sent externally without Operator approval.

---

## 🧮 Scoring Algorithm

Memory retrieval uses composite ranking:

```
Score = (0.5 × Similarity) + (0.3 × Recency) + (0.2 × Importance)
```

| Factor | Weight | Purpose |
|--------|--------|---------|
| Similarity | 50% | Find the most relevant memories |
| Recency | 30% | Prefer recent over stale |
| Importance | 20% | Weight critical facts higher |

**Deterministic embeddings** — zero API cost, instant retrieval.

---

## 🛡️ Data Protection

- **Row-level access control** on all stored data
- **Behavioral rules** prevent unauthorized data sharing
- **Audit trail** — every memory access is logged
- **Version history** — all changes are reversible
- **Export capability** — full data portability

---

<div align="center">

*Memory is not storage. Memory is intelligence that compounds.*

</div>

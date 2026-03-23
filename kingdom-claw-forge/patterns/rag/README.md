# RAG Pattern

Retrieve relevant information before generating output.

## When to Use

- Answering questions about specific documents
- Building on existing knowledge base
- Need context from multiple sources
- Reducing hallucination by grounding in facts

## Implementation

### Step 1: Identify Sources
```markdown
## Sources for [Task]

### Primary
- [Source 1]: [Why relevant]
- [Source 2]: [Why relevant]

### Secondary
- [Source 3]: [Why relevant]
```

### Step 2: Retrieve
- Use `memory_search` for workspace memory
- Use `web_search` for external information
- Use `read` for specific files
- Use `web_fetch` for specific URLs

### Step 3: Rank Relevance
- Most relevant first
- Discard irrelevant results
- Note gaps in information

### Step 4: Generate with Context
- Cite sources for claims
- Acknowledge information gaps
- Note confidence level

## Example

**Task**: "What did we decide about the pricing page?"

**Retrieve**:
1. memory_search("pricing page")
2. read memory/2026-03-22.md
3. read MEMORY.md

**Found**:
- 2026-03-22: "Decided on 3 tiers: $500, $1500, $3000"
- MEMORY.md: "Pricing: Starter, Professional, Enterprise"

**Generate**:
"Based on March 22 session (source: memory/2026-03-22.md), we decided on 3 pricing tiers: $500 Starter, $1,500 Professional, $3,000 Enterprise."

## Anti-Patterns

- Don't generate without retrieving
- Don't ignore retrieved information
- Don't cite non-existent sources

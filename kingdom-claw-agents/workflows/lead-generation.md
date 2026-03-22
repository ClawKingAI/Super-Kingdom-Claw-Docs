# 📋 Workflow: Lead Generation Pipeline

---

## Overview

Complete workflow for finding prospects and building contact lists for email outreach.

**Daily Target:** 50-100 new verified contacts

---

## Phase 0: Target Definition (Orchestrator)

**Owner:** Orchestrator
**Duration:** 15-30 min

### Tasks
1. Define ideal prospect profile:
   - Organization type
   - Role/title
   - Geography
   - Signals/affiliations
2. Set daily/weekly targets
3. Assign to Leads agent

### Output
- Target profile document
- Daily targets set

---

## Phase 1: Discovery (Leads + Researcher)

**Owner:** Leads
**Duration:** Ongoing (2-4 hours/day)

### Tasks
1. Search for organizations matching profile
2. Find organization websites
3. Locate contact pages
4. Extract email addresses:
   - info@, contact@, admin@ (generic)
   - Named contacts (better)
5. Document source URL

### Methods
- Web search (SearXNG, DuckDuckGo)
- Direct website visits
- Ministry directories
- Association listings

### Output
- Raw contact list with sources

---

## Phase 2: Verification (Leads)

**Owner:** Leads
**Duration:** 30 min

### Tasks
1. Check email format validity
2. Remove duplicates
3. Remove known bounces
4. Mark as verified

### Verification Rules
```
✅ name@organization.com — Valid format
✅ info@organization.com — Valid format
❌ invalid-email — Invalid format
❌ duplicate — Remove
❌ previously bounced — Remove
```

### Output
- Verified contact list

---

## Phase 3: List Building (Leads)

**Owner:** Leads
**Duration:** 15 min

### Tasks
1. Format as CSV
2. Add to master contacts.csv
3. Include required fields:
   - email
   - name (if available)
   - organization
   - source
   - verified (YES/NO)
   - date_added

### Output
- Updated contacts.csv ready for Outreach

---

## Phase 4: Handoff to Outreach (Leads → Outreach)

**Owner:** Leads → Outreach
**Duration:** Immediate

### Tasks
1. Leads notifies Outreach
2. Outreach loads new contacts
3. Outreach begins sending

### Output
- Contacts transferred
- Sending begins

---

## Daily Routine

```
Morning (9 AM):
├── Receive target from Orchestrator
├── Begin discovery
└── Run for 2-3 hours

Midday (12 PM):
├── Verify collected contacts
├── Add to master list
└── Handoff to Outreach

Afternoon (3 PM):
├── Continue discovery (if quota not met)
├── Verify new contacts
└── Final handoff

End of Day (6 PM):
├── Report: X contacts found, Y verified
└── Prepare for tomorrow
```

---

## Quality Gates

| Gate | Criteria |
|------|----------|
| Discovery → Verification | Emails extracted from valid sources |
| Verification → List Building | Format valid, no duplicates |
| List Building → Handoff | CSV complete with all fields |

---

## Compliance Rules

1. **Only public information** — No private data, no behind-login content
2. **Honor opt-outs** — Remove anyone who asks
3. **No purchased lists** — Build organically only
4. **Source documentation** — Every contact has a source URL
5. **Respect robots.txt** — Don't scrape where forbidden

---

## Tools Used

| Tool | Purpose |
|------|---------|
| `openclaw-free-web-search` | Find organizations |
| `web_fetch` | Extract from pages |
| Manual verification | Confirm validity |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Contacts/day | 50-100 |
| Validity rate | > 95% |
| Source documented | 100% |
| Duplicate rate | < 1% |

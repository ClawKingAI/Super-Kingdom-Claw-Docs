# 📋 Workflow: Email Outreach Pipeline

---

## Overview

Complete workflow for sending personalized emails to contact lists.

**Daily Target:** 300 emails

---

## Phase 0: Preparation (Orchestrator)

**Owner:** Orchestrator
**Duration:** 15 min

### Tasks
1. Define campaign goal
2. Approve email template
3. Set daily send target
4. Assign to Outreach agent

### Output
- Campaign parameters defined
- Template approved

---

## Phase 1: Template Preparation (Outreach)

**Owner:** Outreach
**Duration:** 15-30 min

### Tasks
1. Create email template with personalization
2. Define subject line
3. Test links work
4. Save template

### Template Elements
- Subject line (clear, not spammy)
- Greeting (personalized: Hi {name})
- Value proposition (2-3 sentences)
- CTA (single, clear link)
- Sign-off (professional)
- Unsubscribe link (if required)

### Output
- Email template ready

---

## Phase 2: Load Contacts (Outreach)

**Owner:** Outreach
**Duration:** 5 min

### Tasks
1. Load contacts.csv
2. Verify no duplicates with sent-log.csv
3. Filter out previously contacted
4. Prepare batch

### Output
- Clean batch ready to send

---

## Phase 3: Send Emails (Outreach)

**Owner:** Outreach
**Duration:** 2-3 hours (for 300 emails)

### Tasks
1. For each contact:
   a. Personalize template (name, organization)
   b. Send via AgentMail API
   c. Wait 500ms (rate buffer)
   d. Log to sent-log.csv
2. Track successes and failures
3. Report progress every 50 emails

### Sending Code
```javascript
for (const contact of contacts) {
  const personalizedBody = template.replace('{name}', contact.name);
  await send(contact.email, subject, personalizedBody);
  await sleep(500); // Rate limit buffer
  logSent(contact.email, contact.organization);
}
```

### Output
- Emails sent
- Sent log updated

---

## Phase 4: Track Responses (Outreach)

**Owner:** Outreach
**Duration:** Ongoing

### Tasks
1. Monitor for replies
2. Log opens (if tracked)
3. Log bounces
4. Update sent-log.csv with status

### Output
- Response tracking

---

## Phase 5: Follow-up (Outreach)

**Owner:** Outreach
**Duration:** Day 3-5 after initial send

### Tasks
1. For non-responders:
   a. Send follow-up (shorter, reference original)
   b. Log follow-up sent
2. For responders:
   a. Mark as engaged
   b. Handoff to Orchestrator for next steps

### Output
- Follow-up emails sent
- Engaged contacts flagged

---

## Daily Routine

```
Morning (9 AM):
├── Load new contacts from Leads
├── Verify against sent-log
└── Begin sending batch 1

Mid-morning (11 AM):
├── Continue sending
└── Progress check: 100 sent?

Afternoon (1 PM):
├── Continue sending
├── Progress check: 200 sent?
└── Break for lunch

Late afternoon (4 PM):
├── Continue sending
├── Progress check: 300 sent?
└── Final batch

End of Day (6 PM):
├── Final count: X sent, Y failed
├── Update sent-log.csv
└── Report to Orchestrator
```

---

## Rate Limits

| System | Limit | Buffer |
|--------|-------|--------|
| AgentMail | High volume | 500ms between sends |
| Gmail | 500/day | 1s between sends |

**Recommended:** 300 emails at 500ms each = ~2.5 minutes of actual sending time (plus overhead)

---

## Quality Gates

| Gate | Criteria |
|------|----------|
| Template → Send | Template approved, links tested |
| Send → Track | All emails logged |
| Track → Follow-up | Responses monitored |

---

## Error Handling

| Error | Action |
|-------|--------|
| Rate limit (429) | Wait 60s, retry |
| Invalid email (400) | Log as failed, skip |
| Server error (500) | Retry once, then skip |
| Auth error | Stop, escalate to human |

---

## Compliance

- CAN-SPAM compliant
- Clear sender identity
- No deceptive subjects
- Unsubscribe honored
- Contact lists not shared

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Emails sent/day | 300 |
| Failure rate | < 2% |
| Unsubscribe rate | < 0.5% |
| Spam complaints | 0 |

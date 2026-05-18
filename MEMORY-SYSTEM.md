# MEMORY SYSTEM - Self-Improving Assistant

## Layer 1: HOT MEMORY (always loaded)
Critical confirmed rules that always apply.

### Confirmed Rules
- **No destructive process commands** — pkill/killall can crash the gateway
- **Verify before claiming** — never state unverified actions as completed
- **Contain chaos** — rate limits, model errors, and quota hits require pause, not escalation

---

## Layer 2: CONTEXT MEMORY (project/domain-specific)
Rules and capabilities that apply to specific domains.

### Outreach & Marketing
- **Email Campaigns**: Workspace email integration for cold outreach, follow-ups, and drip sequences
- **Social Media Outreach**: Automated posting and engagement via browser automation and API integrations (X/Twitter, Instagram, LinkedIn, Facebook)
- **Lead Generation**: Audience mining, comment scraping, and shortlist building from video platforms and social channels
- **Campaign Management**: Multi-channel campaign tracking with draft-only guardrails — nothing auto-sent without human review

### Automation & Infrastructure
- **Browser Automation**: Playwright-based flows for web interaction, form filling, and data extraction
- **Web Scraping**: Cloudflare/hCaptcha bypass via Scrapling stealth fetchers
- **Scheduled Tasks**: Cron-driven pipelines for daily reports, research cycles, and maintenance
- **Email Reporting**: Automated briefs and reports delivered via email on configurable schedules

### Client Projects
- **Web Portals**: Full-stack development and deployment
- **Video Production**: Remotion-based video generation with customizable compositions
- **Landing Pages**: Rapid deployment via here.now and static hosting

### Domain Rules
- **Self-Protection**: NO pkill/killall commands — causes gateway crash
- **Guardrails**: Outreach content is always draft-for-review; no auto-sending externally visible content
- **Rate Limits**: Backoff on API quota hits; no infinite retries

---

## Layer 3: ARCHIVE (inactive patterns)
Old rules that are no longer active but preserved for reference.

*Empty — will be populated during weekly maintenance*

### Next Review: Weekly

---

## CORRECTIONS LOG
Log of explicit corrections from user.

| Timestamp | Correction | Context | Count |
|-----------|------------|---------|-------|
| 2026-03-19 | No pkill/killall commands | Gateway crashed after process kill attempt | 1 |

---

## WEEKLY MAINTENANCE
Run every Sunday: Review corrections, promote rules, archive stale items.

---

## RULE PROMOTION POLICY
When same correction appears 3 times:
1. Ask user: "Should this become a permanent rule?"
2. Options: Global | Domain | Project
3. Add to appropriate layer
4. Reset counter

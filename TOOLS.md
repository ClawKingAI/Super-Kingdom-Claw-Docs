---
summary: "Local operational notes and environment facts"
read_when:
  - When environment-specific details matter
---

# TOOLS.md - Local Notes

## Environment
- Workspace root: `/data/.openclaw/workspace`
- Host context: OpenClaw running in a Docker container on a Hostinger VPS
- Package helper mentioned in bootstrap: Homebrew available in-container

## Operational Preferences
- Prefer first-class OpenClaw tools over ad-hoc shell pipelines when both can do the job
- Prefer low-maintenance automations
- Prefer append-only logs and small, readable docs over sprawling scratch files

## Scrapling - Web Scraping Framework
**Installed:** 2026-03-19
**Location:** `/data/.local/lib/python3.13/site-packages/scrapling`
**Python path:** `/usr/bin/python3`

### Capabilities
- **Fetcher** — Fast HTTP requests with browser TLS fingerprint impersonation
- **StealthyFetcher** — Bypasses Cloudflare Turnstile, hCaptcha, anti-bot systems
- **DynamicFetcher** — Full browser automation via Playwright
- **Adaptive parsing** — Elements survive website structure changes
- **Spider framework** — Large-scale concurrent crawling with pause/resume

### Quick Usage
```python
# Basic fetch
from scrapling.fetchers import Fetcher
page = Fetcher.get('https://example.com')
data = page.css('.item::text').getall()

# Cloudflare bypass
from scrapling.fetchers import StealthyFetcher
page = StealthyFetcher.fetch('https://protected-site.com', headless=True, solve_cloudflare=True)
data = page.css('.content').getall()
```

### Limitations
- Facebook/Instagram: Blocked from data center IPs (need residential proxies)
- Works best on: Cloudflare, hCaptcha, standard anti-bot systems

## To Fill In Later
Add concrete local facts here when learned:
- messaging/account setup
- camera names
- SSH aliases
- preferred TTS voice
- service endpoints
- anything future sessions would otherwise need to rediscover

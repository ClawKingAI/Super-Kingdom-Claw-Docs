# TOOLS.md

## Environment

- **Workspace root:** `/data/.openclaw/workspace`
- **Host context:** OpenClaw running in Docker container
- **Default shell:** Bash

---

## Web Scraping (Scrapling)

**Installed:** 2026-03-19
**Python path:** `/usr/bin/python3`

### Capabilities

| Fetcher | Use Case |
|---------|----------|
| `Fetcher` | Fast HTTP requests with browser TLS fingerprint |
| `StealthyFetcher` | Bypasses Cloudflare, hCaptcha, anti-bot systems |
| `DynamicFetcher` | Full browser automation via Playwright |

### Quick Usage

```python
# Basic fetch
from scrapling.fetchers import Fetcher
page = Fetcher.get('https://example.com')
data = page.css('.item::text').getall()

# Cloudflare bypass
from scrapling.fetchers import StealthyFetcher
page = StealthyFetcher.fetch(
    'https://protected-site.com',
    headless=True,
    solve_cloudflare=True
)
```

### Limitations

- Facebook/Instagram: Blocked from data center IPs
- Works best on: Cloudflare, hCaptcha, standard anti-bot

---

## Operational Preferences

- Prefer first-class OpenClaw tools over ad-hoc shell pipelines
- Prefer low-maintenance automations
- Prefer append-only logs and small, readable docs

---

## Environment Facts

Add environment-specific facts as learned:

- Service endpoints
- Integration configurations
- Tool paths
- API versions

---
name: scrapling
description: Advanced web scraping with anti-bot bypass (Cloudflare, hCaptcha). Use when needing to scrape protected sites, extract structured data, or bypass CAPTCHAs. Handles adaptive parsing that survives website changes.
triggers:
  - scrape a website
  - extract data from a page
  - bypass cloudflare
  - captcha bypass
  - protected site access
  - web scraping
---

# Scrapling - Web Scraping Skill

## Installation
- **Python path:** `/usr/bin/python3`
- **Package location:** `/data/.local/lib/python3.13/site-packages/scrapling`
- **Status:** Installed and tested (2026-03-19)

## Capabilities

| Feature | Use Case |
|---------|----------|
| Fetcher | Fast HTTP requests with browser impersonation |
| StealthyFetcher | Cloudflare/hCaptcha bypass |
| DynamicFetcher | Full browser automation |
| Adaptive parsing | Survives website structure changes |
| Spider framework | Large-scale concurrent crawling |

## Usage Patterns

### Basic Fetch
```python
from scrapling.fetchers import Fetcher
page = Fetcher.get('https://example.com')
data = page.css('.item::text').getall()
```

### Cloudflare Bypass
```python
from scrapling.fetchers import StealthyFetcher
page = StealthyFetcher.fetch(
    'https://protected-site.com',
    headless=True,
    solve_cloudflare=True
)
data = page.css('.content').getall()
```

### Adaptive Parsing
```python
# Elements survive website redesigns
products = page.css('.product', auto_save=True)
# Later, even if classes change:
products = page.css('.product', adaptive=True)
```

## Limitations
- Facebook/Instagram: Blocked from data center IPs (need residential proxies)
- Rate limiting: Respect robots.txt and target site limits
- JavaScript-heavy SPAs: Use DynamicFetcher or browser tool

## Testing
```bash
python3 -c "from scrapling.fetchers import Fetcher; print(Fetcher.get('https://httpbin.org/ip').css('body::text').get())"
```

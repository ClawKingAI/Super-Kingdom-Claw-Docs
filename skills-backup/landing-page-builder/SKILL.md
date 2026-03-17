---
name: landing-page-builder
description: Build and deploy professional landing pages from business specifications. Handles React + TailwindCSS setup, here.now deployment, and can integrate with anima-design-agent for design variations. Use when asked to "build a landing page", "create a website", "make a page for a business", or when provided with business information and asked to create a web presence. Outputs a live URL at {slug}.here.now.
---

# Landing Page Builder

Fast, professional landing page creation with instant deployment.

## Overview

This skill streamlines building and deploying landing pages:
1. **Design phase** — Use anima-design-agent for design variations OR build directly
2. **Build phase** — React + TailwindCSS + Vite setup
3. **Deploy phase** — Three-step here.now API flow (create, upload, finalize)

## Quick Start

When a user provides business info and wants a landing page:

### Option A: Direct Build (faster)

1. Create project structure
2. Build React components with TailwindCSS
3. Deploy to here.now

### Option B: Design-First (more creative)

1. Use anima-design-agent to generate design variants
2. Pick the best design
3. Implement and deploy

## Project Structure

```
project-name/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── Header.jsx
│       ├── Hero.jsx
│       ├── Services.jsx
│       ├── About.jsx
│       ├── ContactForm.jsx
│       └── Footer.jsx
└── public/
    └── favicon.svg
```

## Build Commands

```bash
npm create vite@latest project-name -- --template react
cd project-name
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run build
```

## Tailwind Configuration

Essential colors for professional service businesses:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      navy: {
        200: '#e2e8f0',
        600: '#2a3f5f',
        700: '#1c2d4a',
        800: '#132039',
        900: '#0a1628'
      },
      water: {
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8'
      },
      steel: {
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569'
      }
    }
  }
}
```

## Deployment Flow

### Step 1: Create Site

Calculate file hashes and sizes, then call here.now API:

```bash
curl -sS https://here.now/api/v1/publish \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"files":[{"path":"index.html","size":2994,"contentType":"text/html; charset=utf-8","hash":"..."}]}'
```

Response includes: `slug`, `siteUrl`, `upload.uploads[]`, `finalizeUrl`

### Step 2: Upload Files

For each file in `upload.uploads[]`, PUT to the presigned URL:

```bash
curl -X PUT "<presigned-url>" \
  -H "Content-Type: <content-type>" \
  --data-binary @<local-file>
```

### Step 3: Finalize

```bash
curl -sS -X POST "<finalizeUrl>" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"versionId":"<versionId>"}'
```

Response: `{"success":true,"siteUrl":"https://slug.here.now/"}`

## Component Templates

See [references/components.md](references/components.md) for copy-paste component templates:
- Hero sections with CTA
- Trust indicators
- Service cards
- Contact forms with validation
- Google Maps embed
- Floating mobile call buttons

## Integration with Other Skills

### anima-design-agent

For design exploration, call `playground-create` with type "p2c":

```javascript
playground-create(
  type: "p2c",
  prompt: "Professional landing page for [business type]. Clean, trustworthy design.",
  framework: "react",
  styling: "tailwind"
)
```

Generate 3 variants in parallel, publish all, let user pick.

### agent-team-orchestration

For complex projects, spawn specialist agents:
- Design agent (anima)
- Build agent (coding)
- Review agent (QA)

## Common Patterns

### Business Landing Page

Typical sections:
1. Header (logo, nav, phone CTA)
2. Hero (headline, subheadline, dual CTAs)
3. Trust indicators (badges row)
4. Services (icon cards grid)
5. About (company story)
6. CTA section (large phone number)
7. Contact form (name, phone, email, service dropdown, message)
8. Map embed (Google Maps)
9. Footer (contact info, copyright)

### Performance Checklist

- [ ] Tailwind purge enabled
- [ ] Images optimized (WebP, lazy loading)
- [ ] Mobile-first responsive
- [ ] SEO meta tags
- [ ] LocalBusiness schema
- [ ] Accessible contrast ratios
- [ ] Floating mobile call button

## API Key Storage

Store here.now API key:

```bash
mkdir -p ~/.herenow
echo "YOUR_API_KEY" > ~/.herenow/credentials
chmod 600 ~/.herenow/credentials
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tailwind colors not found | Add all shade variants to config |
| Build fails (terser) | `npm install terser --save-dev` |
| Site not live | Ensure finalize step completed |
| Anonymous site expires | Share claimUrl with user |

## References

- [references/components.md](references/components.md) — Component templates
- [references/seo.md](references/seo.md) — SEO and schema markup
- [scripts/deploy.sh](scripts/deploy.sh) — Automated deployment script

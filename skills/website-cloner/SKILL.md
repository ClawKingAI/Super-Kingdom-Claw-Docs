---
name: website-cloner
description: >
  Reverse-engineer and clone any website using browser automation and parallel agent execution.
  Extracts design tokens, CSS, assets, and behaviors section-by-section, then dispatches 
  builder agents to reconstruct pixel-perfect clones. Use when asked to "clone a website", 
  "rebuild this page", "copy this site", "reverse-engineer this UI", or "pixel-perfect clone".
  Works with any model (GLM 5.0, GPT, Claude, etc.).
argument-hint: "<url>"
user-invocable: true
---

# Website Cloner — Model-Agnostic Edition

Reverse-engineer and rebuild any website as a pixel-perfect clone. This skill uses OpenClaw's browser automation and agent spawning to work with **any model** (GLM 5.0, GPT, Claude, etc.).

## What Changed from Claude Code Version

- **No Chrome MCP dependency** — Uses OpenClaw's built-in `browser` tool
- **Model-agnostic** — Works with GLM 5.0, NVIDIA, OpenAI, Anthropic models
- **Agent spawning via OpenClaw** — Uses `sessions_spawn` for parallel builders
- **No git worktrees** — Simpler file-based coordination
- **Spec files are the contract** — Every builder receives complete specs inline

## Prerequisites

1. **Target project scaffold** — Next.js + Tailwind + shadcn/ui recommended
2. **Browser automation available** — OpenClaw `browser` tool must work
3. **Spec files written BEFORE any build** — No exceptions

## Phase 1: Reconnaissance

### 1.1 Navigate & Screenshot

```
browser(action=open, url="<target-url>")
browser(action=screenshot, fullPage=true, filename="docs/design-references/full-desktop.png")
browser(action=resize, width=390, height=844)
browser(action=screenshot, fullPage=true, filename="docs/design-references/full-mobile.png")
```

Take full-page screenshots at:
- **Desktop:** 1440px width
- **Tablet:** 768px width
- **Mobile:** 390px width

### 1.2 Global Extraction

Extract fonts, colors, and global patterns using browser evaluation:

```javascript
// Run via browser(action=evaluate)
(function() {
  const styles = getComputedStyle(document.body);
  const allElements = document.querySelectorAll('*');
  
  // Extract fonts
  const fonts = new Set();
  allElements.forEach(el => {
    const ff = getComputedStyle(el).fontFamily;
    if (ff) fonts.add(ff.split(',')[0].replace(/["']/g, ''));
  });
  
  // Extract colors
  const colors = new Set();
  allElements.forEach(el => {
    const bg = getComputedStyle(el).backgroundColor;
    const fg = getComputedStyle(el).color;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') colors.add(bg);
    if (fg && fg !== 'rgba(0, 0, 0, 0)') colors.add(fg);
  });
  
  // Find favicons
  const favicons = [...document.querySelectorAll('link[rel*="icon"]')].map(l => l.href);
  
  // Find Google Fonts
  const googleFonts = [...document.querySelectorAll('link[href*="fonts.googleapis.com"]')]
    .map(l => l.href);
  
  // Check for smooth scroll libraries
  const hasLenis = document.querySelector('.lenis') !== null;
  const hasLocomotive = document.querySelector('.locomotive-scroll') !== null;
  
  return {
    fonts: [...fonts],
    colors: [...colors],
    favicons,
    googleFonts,
    smoothScroll: { hasLenis, hasLocomotive }
  };
})();
```

Save results to `docs/research/GLOBALS.md`.

### 1.3 Interaction Sweep

**CRITICAL:** Do this BEFORE writing any component specs.

#### Scroll Sweep
Scroll slowly through the page and observe:
- Header changes (shrink, shadow, background shift)
- Elements animating into view
- Tab/sidebar auto-switching on scroll
- Scroll-snap sections
- Parallax effects
- Smooth scroll behavior

Record in `docs/research/BEHAVIORS.md`:
```markdown
## Header Scroll Behavior
- Trigger: scroll position ~50px
- Before: transparent, height 80px
- After: white background, height 60px, shadow
- Transition: all 0.3s ease

## Scroll-Driven Tab Switching
- Mechanism: IntersectionObserver on sections
- Active tab auto-changes as content scrolls into view
- NOT click-based — do not build click handlers
```

#### Click Sweep
Click every interactive element:
- Tabs/pills → record content for EACH state
- Buttons → record what happens
- Dropdowns/modals → record enter/exit animations

#### Hover Sweep
Hover over all interactive elements and record:
- Color changes
- Scale transforms
- Shadow changes
- Underline animations
- Transition timing

#### Responsive Sweep
Test at 1440px, 768px, 390px:
- Layout changes (columns → stack)
- Navigation changes (desktop nav → hamburger)
- Spacing changes
- Image sizes

### 1.4 Page Topology

Map every section top to bottom:

```markdown
# PAGE_TOPOLOGY.md

## Section Order
1. FloatingNav (fixed, z-index: 100)
2. HeroSection (full viewport)
3. FeaturesSection (3-column grid)
4. TestimonialsSection (carousel)
5. CTAFinal (centered)
6. Footer (multi-column)

## Z-Index Layers
- FloatingNav: 100
- Modals/Overlays: 50
- Content: 1

## Interaction Models
- FloatingNav: scroll-driven (shrinks on scroll)
- FeaturesSection: click-driven tabs (NOT scroll)
- TestimonialsSection: time-driven auto-carousel
```

## Phase 2: Foundation

Build the foundation yourself (not delegated). This is sequential.

### 2.1 Fonts

Update `src/app/layout.tsx`:

```typescript
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});
```

### 2.2 Colors & Globals

Update `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  /* Extracted from target site */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: #3b82f6;
  --muted: #f4f4f5;
  /* ... map all extracted colors */
  
  /* Smooth scroll if needed */
  scroll-behavior: smooth;
}

/* Custom scrollbar hiding if needed */
::-webkit-scrollbar { display: none; }

/* Global animations */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 2.3 TypeScript Types

Create `src/types/content.ts`:

```typescript
export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}
```

### 2.4 Asset Download

Write and run a download script:

```javascript
// scripts/download-assets.mjs
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const assets = [
  // Populate from browser extraction
  { url: 'https://example.com/image.webp', dest: 'public/images/hero.webp' },
  { url: 'https://example.com/logo.svg', dest: 'public/logo.svg' },
];

async function download(url, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

for (const asset of assets) {
  await download(asset.url, asset.dest);
  console.log(`Downloaded: ${asset.dest}`);
}
```

### 2.5 Verify

```bash
npm run build
```

Must pass before continuing.

## Phase 3: Component Specification

For EACH section, write a spec file BEFORE dispatching any builder.

### Spec File Template

```markdown
# <ComponentName> Specification

## Overview
- **Target file:** `src/components/<ComponentName>.tsx`
- **Screenshot:** `docs/design-references/<name>.png`
- **Interaction model:** static | click-driven | scroll-driven | time-driven

## DOM Structure
(Describe hierarchy)

## Computed Styles (exact values)

### Container
- display: flex
- flexDirection: column
- padding: 24px 48px
- maxWidth: 1200px
- margin: 0 auto

### Heading (h2)
- fontSize: 48px
- fontWeight: 700
- fontFamily: "Playfair Display"
- lineHeight: 56px
- color: #0a0a0a

### Paragraph
- fontSize: 18px
- lineHeight: 28px
- color: #4a4a4a
- maxWidth: 640px

## States & Behaviors

### Scroll-triggered floating mode
- **Trigger:** scroll position > 50px
- **State A (before):** 
  - position: fixed
  - top: 0
  - width: 100%
  - background: transparent
  - padding: 24px 48px
- **State B (after):**
  - background: rgba(255,255,255,0.95)
  - padding: 16px 48px
  - boxShadow: 0 2px 20px rgba(0,0,0,0.1)
- **Transition:** all 0.3s ease

### Hover states
- **Button:** 
  - background: #3b82f6 → #2563eb
  - transform: scale(1) → scale(1.02)
  - transition: all 0.2s ease

## Per-State Content

### Tab: "Featured"
- Cards: [{ title: "...", description: "...", image: "..." }]

### Tab: "Productivity"
- Cards: [{ title: "...", description: "...", image: "..." }]

## Assets
- Background: `public/images/hero-bg.webp`
- Icons: ArrowIcon, CheckIcon from `src/components/icons.tsx`

## Text Content (verbatim)
(Copy-paste all text from the live site)

## Responsive Behavior
- **Desktop (1440px):** 3-column grid, gap 32px
- **Tablet (768px):** 2-column grid, gap 24px
- **Mobile (390px):** single column, gap 16px, reduced padding
- **Breakpoint:** layout shifts at ~768px
```

### Extraction Script Per Section

```javascript
// Run via browser(action=evaluate) for each section
// Replace SELECTOR with actual CSS selector
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return { error: 'Element not found: ' + selector };
  
  const props = [
    'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
    'textTransform','textDecoration','backgroundColor','background',
    'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
    'margin','marginTop','marginRight','marginBottom','marginLeft',
    'width','height','maxWidth','minWidth','maxHeight','minHeight',
    'display','flexDirection','justifyContent','alignItems','gap',
    'gridTemplateColumns','gridTemplateRows',
    'borderRadius','border','boxShadow','overflow',
    'position','top','right','bottom','left','zIndex',
    'opacity','transform','transition','cursor',
    'objectFit','backdropFilter','filter'
  ];
  
  function extractStyles(element) {
    const cs = getComputedStyle(element);
    const styles = {};
    props.forEach(p => {
      const v = cs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px') {
        styles[p] = v;
      }
    });
    return styles;
  }
  
  function walk(element, depth) {
    if (depth > 4) return null;
    const children = [...element.children];
    return {
      tag: element.tagName.toLowerCase(),
      classes: element.className?.toString().split(' ').slice(0, 5).join(' '),
      text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 
        ? element.textContent.trim().slice(0, 200) 
        : null,
      styles: extractStyles(element),
      images: element.tagName === 'IMG' 
        ? { src: element.src, alt: element.alt, width: element.naturalWidth, height: element.naturalHeight }
        : null,
      childCount: children.length,
      children: children.slice(0, 20).map(c => walk(c, depth + 1)).filter(Boolean)
    };
  }
  
  return walk(el, 0);
})('SELECTOR');
```

## Phase 4: Builder Dispatch

Use OpenClaw's `sessions_spawn` for parallel builders.

### Simple Section (1-2 components)

Single builder:

```
sessions_spawn(
  task: "Build <ComponentName> according to spec in docs/research/components/<name>.spec.md",
  runtime: "subagent"
)
```

The builder receives the spec inline. NO "go read the spec file."

### Complex Section (3+ components)

Multiple builders:

1. Sub-component builders first (parallel)
2. Wrapper builder last (depends on sub-components)

```
sessions_spawn(task: "Build CardA from spec...") // parallel
sessions_spawn(task: "Build CardB from spec...") // parallel
// wait for completion
sessions_spawn(task: "Build SectionWrapper that imports CardA, CardB...") // sequential
```

### Builder Prompt Structure

Every builder receives:

```markdown
Build <ComponentName>.tsx with the following exact specifications:

## File Location
`src/components/<ComponentName>.tsx`

## Imports
- React from 'react'
- cn() from '@/lib/utils'
- Icons: ArrowIcon, CheckIcon from '@/components/icons'
- shadcn: Button from '@/components/ui/button'

## Component Structure
[Exact DOM hierarchy from spec]

## Exact Styles (apply these values, don't estimate)
### Container
- display: flex
- flexDirection: column
- padding: 24px 48px
[... all extracted styles]

### Heading
- fontSize: 48px
[... all extracted styles]

## Assets
- Background: public/images/hero-bg.webp → use as src="/images/hero-bg.webp"

## Text Content (use verbatim)
- Headline: "Actual text from site"
- Subheadline: "Actual text from site"

## Behaviors
[Exact trigger, states, transitions from spec]

## Responsive
[Exact breakpoints and changes]

## Verification
Run `npx tsc --noEmit` before finishing. Fix any type errors.
```

### Don't Wait

As soon as you dispatch a builder, move to extracting the next section. Builders work in parallel.

## Phase 5: Assembly

After all sections built:

1. Import all components in `src/app/page.tsx`
2. Wire up page-level layout from topology
3. Implement page-level behaviors (scroll listeners, intersection observers)
4. Connect real content to component props
5. Verify: `npm run build` passes

## Phase 6: Visual QA

**Do NOT skip this.**

1. Side-by-side screenshots at 1440px, 768px, 390px
2. Test every interactive behavior:
   - Scroll through entire page
   - Click every tab/button
   - Hover over every interactive element
3. Check animations and transitions
4. Verify smooth scroll feel

For discrepancies:
- Check spec file — was extraction correct?
- If spec wrong → re-extract, update spec, fix component
- If spec right but build wrong → fix component to match spec

## Critical Rules

### Interaction Model First
**Most expensive mistake:** Building click-based tabs when the original is scroll-driven.

ALWAYS scroll through a section BEFORE clicking. If content changes on scroll, it's scroll-driven. Record the mechanism.

### Extract All States
If there are tabs, click EACH tab and extract its content. If the header changes on scroll, capture styles at position 0 AND position 100+.

### Don't Miss Layered Images
A "single image" is often multiple layers:
- Background gradient/watercolor
- Foreground UI mockup
- Overlay icon

Check every container's DOM tree for multiple `<img>` and positioned overlays.

### Exact CSS, Not Estimates
"Looks like text-lg" is wrong if computed is 18px with line-height 24px but text-lg is 18px/28px.

Extract `getComputedStyle()` values.

### Spec Before Dispatch
Every builder MUST have a corresponding spec file. No exceptions.

### No External Doc References
Builder gets spec inline. Never "see DESIGN_TOKENS.md for colors."

## Completion Checklist

- [ ] All sections have spec files in `docs/research/components/`
- [ ] Every CSS value is from `getComputedStyle()`, not estimated
- [ ] Interaction model documented for every stateful section
- [ ] All states captured (scroll positions, tabs, hovers)
- [ ] Assets downloaded to `public/`
- [ ] Build passes: `npm run build`
- [ ] Visual QA completed at desktop, tablet, mobile
- [ ] All interactive behaviors tested

## Output Report

When complete, report:
- Total sections built
- Total components created
- Total spec files written
- Total assets downloaded
- Build status
- Visual QA results
- Known gaps/limitations

# Component Spec Template

Copy this template for each component. Fill in ALL sections before dispatching a builder.

---

```markdown
# <ComponentName> Specification

## Overview
- **Target file:** `src/components/<ComponentName>.tsx`
- **Screenshot:** `docs/design-references/<name>.png`
- **Interaction model:** static | click-driven | scroll-driven | time-driven
- **Complexity:** simple | medium | complex

## DOM Structure

```
<section class="...">
  <div class="container">
    <h2>...</h2>
    <div class="grid">
      <Card />
      <Card />
      <Card />
    </div>
  </div>
</section>
```

## Computed Styles (exact values from getComputedStyle)

### Container / Section
- display: flex
- flexDirection: column
- padding: 80px 24px
- maxWidth: 1200px
- margin: 0 auto
- gap: 48px
- background: #ffffff

### Heading (h2)
- fontSize: 48px
- fontWeight: 700
- fontFamily: "Playfair Display", serif
- lineHeight: 56px
- letterSpacing: -0.02em
- color: #0a0a0a
- textAlign: center

### Subheading / Description
- fontSize: 18px
- fontWeight: 400
- fontFamily: "Inter", sans-serif
- lineHeight: 28px
- color: #4a4a4a
- maxWidth: 640px
- textAlign: center
- margin: 0 auto

### Grid Container
- display: grid
- gridTemplateColumns: repeat(3, 1fr)
- gap: 32px
- padding: 0

### Card Component
- display: flex
- flexDirection: column
- padding: 24px
- borderRadius: 16px
- background: #f8f8f8
- boxShadow: none
- transition: all 0.2s ease

### Card Image
- width: 100%
- height: 200px
- objectFit: cover
- borderRadius: 12px
- marginBottom: 16px

### Card Title
- fontSize: 20px
- fontWeight: 600
- color: #0a0a0a
- marginBottom: 8px

### Card Description
- fontSize: 14px
- lineHeight: 22px
- color: #666666

## States & Behaviors

### Hover State (Card)
- **Trigger:** mouseenter
- **State A (before):**
  - transform: scale(1)
  - boxShadow: none
  - background: #f8f8f8
- **State B (after):**
  - transform: scale(1.02) translateY(-4px)
  - boxShadow: 0 12px 40px rgba(0,0,0,0.15)
  - background: #ffffff
- **Transition:** all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

### Focus State (Card - if clickable)
- outline: 2px solid #3b82f6
- outlineOffset: 2px

### Active State (Card - if clickable)
- transform: scale(0.98)

## Scroll-Triggered Animation (if applicable)

### Fade-up on scroll into view
- **Trigger:** IntersectionObserver with threshold 0.1
- **State A (before visible):**
  - opacity: 0
  - transform: translateY(30px)
- **State B (after visible):**
  - opacity: 1
  - transform: translateY(0)
- **Transition:** opacity 0.6s ease, transform 0.6s ease
- **Stagger delay:** Each card has 100ms more delay (card 1: 0ms, card 2: 100ms, card 3: 200ms)

## Per-State Content (for tabs/toggles)

### State: "Default" / Initial
- Cards visible: [Card A, Card B, Card C]
- Active tab indicator: "All"

### State: "Category A"
- Cards visible: [Card A, Card D]
- Active tab indicator: "Category A"

### State: "Category B"
- Cards visible: [Card B, Card C]
- Active tab indicator: "Category B"

## Assets

| Asset | Path | Usage |
|-------|------|-------|
| Hero background | `public/images/hero-bg.webp` | Section background |
| Card image 1 | `public/images/card-1.webp` | First card |
| Card image 2 | `public/images/card-2.webp` | Second card |
| Card image 3 | `public/images/card-3.webp` | Third card |
| Arrow icon | `src/components/icons.tsx#ArrowIcon` | CTA button |

## Text Content (verbatim from site)

- **Section heading:** "Transform Your Business Today"
- **Section subheading:** "Our platform provides everything you need to scale your operations and reach new heights."
- **Card 1 title:** "Lightning Fast"
- **Card 1 description:** "Experience blazing fast performance with our optimized infrastructure."
- **Card 2 title:** "Enterprise Security"
- **Card 2 description:** "Bank-grade encryption and compliance certifications keep your data safe."
- **Card 3 title:** "24/7 Support"
- **Card 3 description:** "Our dedicated team is always available to help you succeed."

## Responsive Behavior

### Desktop (1440px)
- 3-column grid
- gap: 32px
- padding: 80px 48px
- heading: 48px

### Tablet (1024px)
- 2-column grid
- gap: 24px
- padding: 64px 32px
- heading: 40px

### Mobile (768px and below)
- 1-column stack
- gap: 16px
- padding: 48px 16px
- heading: 32px
- cards full width

### Breakpoints
- 3 → 2 columns at: 1024px
- 2 → 1 column at: 768px

## Accessibility

- Section uses `<section>` with `aria-labelledby` pointing to heading ID
- Cards are `<article>` elements
- All images have descriptive alt text
- Interactive cards have `tabIndex={0}` and `role="button"`
- Focus states visible for keyboard navigation

## TypeScript Interface

```typescript
interface <ComponentName>Props {
  heading: string;
  subheading?: string;
  cards: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    link?: string;
  }>;
  variant?: 'default' | 'compact';
}
```

## Implementation Notes

- Use `cn()` for conditional class merging
- Lazy load images below the fold with `loading="lazy"`
- Use CSS variables for colors if following site theme
- Consider `next/image` for automatic optimization
- Add `prefers-reduced-motion` media query for animations

## Verification Checklist (for builder)

- [ ] All CSS values match spec (no estimation)
- [ ] Text content is verbatim from spec
- [ ] Images reference correct paths
- [ ] Hover states work as specified
- [ ] Responsive breakpoints correct
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No console errors
```

---

## Fill Guidelines

1. **Never estimate** — If you don't have a value, go extract it via browser
2. **Include all values** — Even if they seem obvious, write them down
3. **Verbatim text** — Copy-paste from the site, don't paraphrase
4. **Asset paths** — Use paths relative to the project root
5. **States** — If a component has multiple states, document ALL of them
6. **Responsive** — Always include at least desktop and mobile

## Complexity Assessment

- **Simple:** Single element, no states, static content
  - Example: A static footer with text links
  - One builder agent

- **Medium:** Multiple child elements, hover states, responsive
  - Example: A features grid with hover animations
  - One builder agent

- **Complex:** Multiple sub-components, state management, animations
  - Example: An interactive tab system with animated content switching
  - Multiple builder agents (one per sub-component, one for wrapper)

# Builder Agent Prompts

Templates for dispatching builder agents via `sessions_spawn`. Each builder receives the full spec inline.

## Simple Component Builder

For static components with minimal interactivity.

```
Build a React component according to this exact specification:

## File
Create: `src/components/<ComponentName>.tsx`

## Imports
```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowIcon } from '@/components/icons';
```

## Component Structure
```tsx
export function <ComponentName>({ heading, subheading }: Props) {
  return (
    <section className="...">
      <div className="...">
        <h2>...</h2>
        <p>...</p>
      </div>
    </section>
  );
}
```

## Exact Styles (apply these Tailwind classes or inline styles)

### Container
- display: flex → `flex`
- flexDirection: column → `flex-col`
- padding: 80px 24px → `py-20 px-6`
- maxWidth: 1200px → `max-w-6xl`
- margin: 0 auto → `mx-auto`
- gap: 48px → `gap-12`

### Heading
- fontSize: 48px → `text-5xl`
- fontWeight: 700 → `font-bold`
- color: #0a0a0a → `text-gray-900`
- textAlign: center → `text-center`

[... continue with all extracted styles]

## Text Content
- heading: "Transform Your Business Today"
- subheading: "Our platform provides everything you need..."

## Assets
- Background image: `public/images/hero-bg.webp` → use `src="/images/hero-bg.webp"`

## Verification
Before finishing:
1. Run `npx tsc --noEmit` — fix all type errors
2. Ensure no console errors
3. Component renders correctly with given props
```

## Interactive Component Builder

For components with hover states, clicks, or animations.

```
Build an interactive React component according to this specification:

## File
Create: `src/components/<ComponentName>.tsx`

## Imports
```typescript
'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
```

## Component with State Management

### Hover States
Card has hover animation:
- Default: scale(1), no shadow
- Hover: scale(1.02), shadow: 0 12px 40px rgba(0,0,0,0.15)
- Transition: all 0.3s ease

Implement with Tailwind:
```tsx
<div className="transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1">
```

### Click Handler (if applicable)
```tsx
const [isActive, setIsActive] = useState(false);

<div onClick={() => setIsActive(!isActive)} className={cn(
  "base-classes",
  isActive && "active-classes"
)}>
```

## Styles (exact values)

### Container
- display: grid
- gridTemplateColumns: repeat(3, 1fr)
- gap: 32px
[... all styles]

### Card (default)
- padding: 24px
- borderRadius: 16px
- background: #f8f8f8
- transition: all 0.3s ease

### Card (hover)
- transform: scale(1.02) translateY(-4px)
- boxShadow: 0 12px 40px rgba(0,0,0,0.15)
- background: #ffffff

## Accessibility
- Add tabIndex={0} for keyboard navigation
- Add aria-label for interactive elements
- Handle Enter/Space keys for click activation

## Verification
1. Hover states work correctly
2. Keyboard navigation works
3. `npx tsc --noEmit` passes
4. No hydration errors
```

## Scroll-Animated Component Builder

For components with scroll-triggered animations.

```
Build a scroll-animated component:

## File
Create: `src/components/<ComponentName>.tsx`

## Imports
```typescript
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
```

## Scroll Animation Implementation

The component fades up when scrolling into view:
- Before visible: opacity 0, translateY(30px)
- After visible: opacity 1, translateY(0)
- Transition: 0.6s ease
- Stagger: Each child has 100ms more delay

Implement with IntersectionObserver:
```tsx
const containerRef = useRef<HTMLDivElement>(null);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  if (containerRef.current) {
    observer.observe(containerRef.current);
  }

  return () => observer.disconnect();
}, []);

return (
  <div ref={containerRef} className="...">
    {items.map((item, i) => (
      <div 
        key={item.id}
        className={cn(
          "transition-all duration-600 ease-out",
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: `${i * 100}ms` }}
      >
        {...}
      </div>
    ))}
  </div>
);
```

## Styles (exact values)
[... all extracted styles]

## Reduced Motion Support
```tsx
// Add to component
const prefersReducedMotion = typeof window !== 'undefined' 
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Apply instant transition if reduced motion
style={{ 
  transitionDelay: prefersReducedMotion ? '0ms' : `${i * 100}ms`,
  transitionDuration: prefersReducedMotion ? '0ms' : '600ms'
}}
```

## Verification
1. Animation triggers when scrolling into view
2. Animation only plays once (not on every scroll)
3. Stagger delays are correct
4. Respects prefers-reduced-motion
5. `npx tsc --noEmit` passes
```

## Tab-Based Component Builder

For components with tab/pill switching.

```
Build a tab-based component:

## Interaction Model
**IMPORTANT:** This is CLICK-DRIVEN, not scroll-driven.
- User clicks tabs to switch content
- Content fades between states
- No IntersectionObserver

## File
Create: `src/components/<ComponentName>.tsx`

## Imports
```typescript
'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
```

## State Management
```tsx
const [activeTab, setActiveTab] = useState('all');

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'category-a', label: 'Category A' },
  { id: 'category-b', label: 'Category B' },
];

const getVisibleCards = () => {
  if (activeTab === 'all') return cards;
  return cards.filter(card => card.category === activeTab);
};
```

## Tab Styling
### Tab Container
- display: flex
- gap: 8px
- marginBottom: 32px

### Tab Button (default)
- padding: 8px 16px
- borderRadius: 9999px (pill)
- background: transparent
- color: #666666
- transition: all 0.2s ease

### Tab Button (active)
- background: #0a0a0a
- color: #ffffff

### Tab Button (hover - inactive)
- background: #f0f0f0

## Content Transition
- opacity: 0 → 1
- transition: opacity 0.3s ease
- Use key prop to trigger re-render on tab change

```tsx
<div 
  key={activeTab}
  className="grid gap-8 opacity-0 animate-fade-in"
>
  {getVisibleCards().map(card => (
    <Card key={card.id} {...card} />
  ))}
</div>

// In globals.css:
// @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
// .animate-fade-in { animation: fade-in 0.3s ease forwards; }
```

## Per-Tab Content

### Tab: "All"
- Cards: [Card A, Card B, Card C, Card D]

### Tab: "Category A"  
- Cards: [Card A, Card D]

### Tab: "Category B"
- Cards: [Card B, Card C]

[... card content details]

## Verification
1. Tabs switch content on click
2. Active tab styling correct
3. Content transition is smooth
4. Keyboard navigation (arrow keys between tabs)
5. `npx tsc --noEmit` passes
```

## Responsive Component Builder

For components with complex responsive behavior.

```
Build a responsive component:

## File
Create: `src/components/<ComponentName>.tsx`

## Responsive Breakpoints

### Desktop (1440px+)
- 3-column grid
- gap: 32px
- padding: 80px 48px
- heading: 48px

### Tablet (768px - 1439px)
- 2-column grid
- gap: 24px
- padding: 64px 32px
- heading: 40px

### Mobile (<768px)
- 1-column stack
- gap: 16px
- padding: 48px 16px
- heading: 32px

## Tailwind Implementation

```tsx
<section className="
  py-20 md:py-16 lg:py-20
  px-4 md:px-8 lg:px-12
">
  <h2 className="
    text-3xl md:text-4xl lg:text-5xl
    font-bold
    text-center
    mb-8
  ">
    {heading}
  </h2>
  
  <div className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-4 md:gap-6 lg:gap-8
  ">
    {cards.map(card => (
      <Card key={card.id} {...card} />
    ))}
  </div>
</section>
```

## Mobile-Specific Changes

### Navigation
- Desktop: horizontal nav links
- Mobile: hamburger menu (hidden in this component, but account for nav height)

### Image Sizes
- Desktop: 400x300
- Tablet: 300x225
- Mobile: full width, height auto

### Typography Scale
- Use fluid typography or breakpoint-based sizing
- Ensure readability at all sizes

## Verification
1. Test at 1440px — 3 columns
2. Test at 1024px — 2 columns  
3. Test at 390px — 1 column
4. No horizontal scroll at any width
5. Text readable at all sizes
6. `npx tsc --noEmit` passes
```

---

## Dispatch Pattern

```typescript
// OpenClaw sessions_spawn call
sessions_spawn({
  task: `<full prompt above>`,
  runtime: "subagent",
  label: "builder-<component-name>"
});
```

## Multiple Builders

For complex sections, dispatch in order:

1. Sub-components first (parallel):
```typescript
sessions_spawn({ task: "Build CardA...", label: "builder-card-a" });
sessions_spawn({ task: "Build CardB...", label: "builder-card-b" });
```

2. Wrapper last (after sub-components complete):
```typescript
sessions_spawn({ 
  task: "Build SectionWrapper that imports CardA, CardB...", 
  label: "builder-section-wrapper" 
});
```

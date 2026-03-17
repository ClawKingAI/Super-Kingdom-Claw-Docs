---
name: video-generator
description: >
  Generate videos using Remotion and publish to here.now. Use when asked to "make a video", "create a video", 
  "generate a video", "produce a video", "render a video", or when provided a text prompt for video content.
  Outputs a shareable URL at {slug}.here.now.
---

# Video Generator Skill

Generate videos from text prompts using Remotion, then publish to here.now for instant sharing.

## Requirements

- Required: `node`, `npx`, `curl`, `jq`
- Remotion project: `/data/.openclaw/workspace/projects/remotion/`
- here.now credentials: `~/.herenow/credentials` or `$HERENOW_API_KEY`

## Workflow

1. **Understand the context** - What is the video for? Who is the audience? What's the mood?
2. **Create/update Remotion component** - Build a video that matches the purpose
3. **Render the video** - Use `npx remotion render`
4. **Build contextual page** - Use context to style the page around the video
5. **Publish to here.now** - Give user a shareable link

## Context-Aware Publishing

The video page adapts to the message. Pass context as JSON:

```bash
/data/.openclaw/skills/video-generator/scripts/publish-video.sh video.mp4 '{
  "headline": "Understanding the Times",
  "subheadline": "A Call to Discernment for This Hour",
  "supporting_text": "Join us as we examine biblical prophecy and its relevance to current events.",
  "cta_url": "https://zoom.kingdomlife.site/call",
  "cta_text": "Join Thursday Call",
  "bg_color_top": "#0f172a",
  "bg_color_bottom": "#1e1b4b",
  "title_color": "#f8fafc",
  "accent_color": "#6366f1",
  "accent_dark": "#4f46e5"
}'
```

### Context Fields

| Field | Purpose |
|-------|---------|
| `headline` | Main title above the video |
| `subheadline` | Supporting title text |
| `supporting_text` | Description/invitation text |
| `cta_url` | Call-to-action link (Zoom, signup, etc.) |
| `cta_text` | CTA button label |
| `bg_color_top` | Gradient start color |
| `bg_color_bottom` | Gradient end color |
| `title_color` | Headline text color |
| `accent_color` | CTA button gradient start |
| `accent_dark` | CTA button gradient end |

### Ministry-Friendly Defaults

For ministry/prophecy themes, use:
- Dark blues/purples for background
- White or gold for titles
- Clear, faith-filled language
- Urgency without sensationalism
- Scripture-aware tone

## Quick Start

```bash
# Render a video
cd /data/.openclaw/workspace/projects/remotion
npx remotion render src/index.ts <CompositionId> /data/.openclaw/workspace/videos/output.mp4 --props '{"title":"My Video"}'

# Publish with context
/data/.openclaw/skills/video-generator/scripts/publish-video.sh output.mp4 '{"headline":"My Video"}'
```

## Available Compositions

| ID | Description | Default Props |
|----|-------------|---------------|
| `TextVideo` | Simple animated text | title, subtitle, body |
| `TypewriterVideo` | Terminal typewriter effect | lines[], backgroundColor |
| `CrusadePromo` | Ministry crusade promo | eventName, soulsGoal |
| `WeeklyReport` | (avoid - legacy) | - |

## Creating New Compositions

1. Create component in `src/`:

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface MyVideoProps {
  message: string;
}

export const MyVideo: React.FC<MyVideoProps> = ({ message }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#1a1a2e", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 80, color: "#fff", opacity }}>
        {message}
      </div>
    </AbsoluteFill>
  );
};
```

2. Register in `src/Root.tsx`:

```tsx
<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ message: "Hello" }}
/>
```

## Page Design Principles

- **No generic AI branding** - Pages feel custom, not templated
- **No default info boxes** - "AI Generated", "Instant Delivery" removed
- **Context-first** - Layout matches video purpose
- **Minimal footer** - Only kingdomlife.site/five_fold
- **Mobile-friendly** - Works on all devices
- **Clean and premium** - Polished, not cluttered

## Event Invitation Example

For Thursday Zoom calls, prophecy gatherings, etc.:

```json
{
  "headline": "Understanding the Times",
  "subheadline": "Thursday 6:30 PM EST",
  "supporting_text": "Biblical prophecy is unfolding. Come gain discernment and truth for this hour.",
  "cta_url": "https://zoom.kingdomlife.site/call",
  "cta_text": "Join the Call",
  "bg_color_top": "#0c1445",
  "bg_color_bottom": "#1a0a2e"
}
```

Tone: Urgent, sober, faith-filled, scripturally aware, spiritually alive.

## here.now Publishing

After rendering, publish with context:

```bash
/data/.openclaw/skills/video-generator/scripts/publish-video.sh video.mp4 '<context-json>'
```

Returns: `https://{slug}.here.now/`

With API key stored, sites are permanent.

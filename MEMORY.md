# MEMORY.md

## Durable Workspace Facts

- This workspace was reconfigured on 2026-03-15 for stability, resumability, and long-horizon agent execution.
- Core operating preference: reliability over cleverness; document state in files rather than relying on transient context.
- The workspace is intended to stay git-versioned so changes can be traced over time.

## Video Generation System
- **Skill location**: `/data/.openclaw/skills/video-generator/SKILL.md`
- **Remotion project**: `/data/.openclaw/workspace/projects/remotion/`
- **Output directory**: `/data/.openclaw/workspace/videos/`
- **Hosting**: here.now (instant shareable URLs)
- **Workflow**: Create/update `.tsx` component → Register in `Root.tsx` → Render with `npx remotion render` → Publish with context JSON
- **Available compositions**: TextVideo, TypewriterVideo, CrusadePromo, ProphecyCall, CrimeDrama, WeeklyReport
- When user says "make a video", use this skill — not browser tools or external APIs.



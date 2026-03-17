#!/bin/bash
# Quick video generation script
# Usage: generate-video.sh <composition> <output-name> <props-json>

set -e

REMOTION_DIR="/data/.openclaw/workspace/projects/remotion"
VIDEOS_DIR="/data/.openclaw/workspace/videos"

COMPOSITION="${1:-WeeklyReport}"
OUTPUT_NAME="${2:-video-$(date +%Y%m%d-%H%M%S)}"
PROPS="${3:-{}}"

cd "$REMOTION_DIR"

# Ensure output directory exists
mkdir -p "$VIDEOS_DIR"

# Render video
echo "Rendering $COMPOSITION..."
npx remotion render src/index.ts "$COMPOSITION" "$VIDEOS_DIR/${OUTPUT_NAME}.mp4" --props "$PROPS" 2>&1 | tail -10

echo "Video rendered: $VIDEOS_DIR/${OUTPUT_NAME}.mp4"

# Publish to here.now if requested
if [ "$4" = "--publish" ]; then
  echo "Publishing to here.now..."
  /data/.claude/skills/here-now/scripts/publish.sh "$VIDEOS_DIR/${OUTPUT_NAME}.mp4" --client openclaw
fi

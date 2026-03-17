#!/bin/bash
# Create a contextual video page and publish to here.now
# Usage: publish-video.sh <video.mp4> [context-json-file]

set -e

VIDEO_PATH="$1"
CONTEXT_FILE="${2:-}"

if [ ! -f "$VIDEO_PATH" ]; then
  echo "Error: Video not found: $VIDEO_PATH"
  exit 1
fi

# Default context
HEADLINE="Video"
SUBHEADLINE=""
SUPPORTING_TEXT=""
CTA_URL=""
CTA_TEXT="Learn More"
BGCOLOR_TOP="#0f172a"
BGCOLOR_BOTTOM="#1e1b4b"
TITLE_COLOR="#ffffff"
ACCENT_COLOR="#6366f1"
ACCENT_DARK="#4f46e5"

# Parse context from file if provided
if [ -n "$CONTEXT_FILE" ] && [ -f "$CONTEXT_FILE" ]; then
  if command -v jq &> /dev/null; then
    HEADLINE=$(jq -r '.headline // "Video"' "$CONTEXT_FILE")
    SUBHEADLINE=$(jq -r '.subheadline // ""' "$CONTEXT_FILE")
    SUPPORTING_TEXT=$(jq -r '.supporting_text // ""' "$CONTEXT_FILE")
    CTA_URL=$(jq -r '.cta_url // ""' "$CONTEXT_FILE")
    CTA_TEXT=$(jq -r '.cta_text // "Learn More"' "$CONTEXT_FILE")
    BGCOLOR_TOP=$(jq -r '.bg_color_top // "#0f172a"' "$CONTEXT_FILE")
    BGCOLOR_BOTTOM=$(jq -r '.bg_color_bottom // "#1e1b4b"' "$CONTEXT_FILE")
    TITLE_COLOR=$(jq -r '.title_color // "#ffffff"' "$CONTEXT_FILE")
    ACCENT_COLOR=$(jq -r '.accent_color // "#6366f1"' "$CONTEXT_FILE")
    ACCENT_DARK=$(jq -r '.accent_dark // "#4f46e5"' "$CONTEXT_FILE")
  fi
fi

# Create temp directory for the site
SITE_DIR=$(mktemp -d)
trap "rm -rf $SITE_DIR" EXIT

# Copy video
cp "$VIDEO_PATH" "$SITE_DIR/video.mp4"

# Create HTML page from template
TEMPLATE="/data/.openclaw/skills/video-generator/templates/video-page.html"

# Read template
HTML=$(cat "$TEMPLATE")

# Replace variables
HTML="${HTML//\{\{HEADLINE\}\}/$HEADLINE}"
HTML="${HTML//\{\{SUBHEADLINE\}\}/$SUBHEADLINE}"
HTML="${HTML//\{\{SUPPORTING_TEXT\}\}/$SUPPORTING_TEXT}"
HTML="${HTML//\{\{CTA_URL\}\}/$CTA_URL}"
HTML="${HTML//\{\{CTA_TEXT\}\}/$CTA_TEXT}"
HTML="${HTML//\{\{BGCOLOR_TOP\}\}/$BGCOLOR_TOP}"
HTML="${HTML//\{\{BGCOLOR_BOTTOM\}\}/$BGCOLOR_BOTTOM}"
HTML="${HTML//\{\{TITLE_COLOR\}\}/$TITLE_COLOR}"
HTML="${HTML//\{\{ACCENT_COLOR\}\}/$ACCENT_COLOR}"
HTML="${HTML//\{\{ACCENT_DARK\}\}/$ACCENT_DARK}"

# Handle conditional blocks
if [ -z "$SUBHEADLINE" ]; then
  HTML=$(echo "$HTML" | sed '/{{#SUBHEADLINE}}/,/{{\/SUBHEADLINE}}/d')
else
  HTML="${HTML//\{\{#SUBHEADLINE\}\}/}"
  HTML="${HTML//\{\{\/SUBHEADLINE\}\}/}"
fi

if [ -z "$SUPPORTING_TEXT" ]; then
  HTML=$(echo "$HTML" | sed '/{{#SUPPORTING_TEXT}}/,/{{\/SUPPORTING_TEXT}}/d')
else
  HTML="${HTML//\{\{#SUPPORTING_TEXT\}\}/}"
  HTML="${HTML//\{\{\/SUPPORTING_TEXT\}\}/}"
fi

if [ -z "$CTA_URL" ]; then
  HTML=$(echo "$HTML" | sed '/{{#CTA_URL}}/,/{{\/CTA_URL}}/d')
else
  HTML="${HTML//\{\{#CTA_URL\}\}/}"
  HTML="${HTML//\{\{\/CTA_URL\}\}/}"
fi

echo "$HTML" > "$SITE_DIR/index.html"

echo "Publishing contextual video page to here.now..."

# Publish to here.now
/data/.claude/skills/here-now/scripts/publish.sh "$SITE_DIR" --client openclaw 2>&1

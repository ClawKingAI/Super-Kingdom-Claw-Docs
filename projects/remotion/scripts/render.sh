#!/bin/bash
# Render weekly video report

set -e

cd /data/.openclaw/workspace/projects/remotion

# Install deps if needed
if [ ! -d "node_modules" ]; then
  npm install
fi

# Render the video
npx remotion render WeeklyReport /data/.openclaw/workspace/videos/weekly-report-$(date +%Y%m%d).mp4 \
  --props "$(cat /data/.openclaw/workspace/projects/remotion/output/props.json 2>/dev/null || echo '{}')"

echo "Video rendered successfully"
ls -la /data/.openclaw/workspace/videos/

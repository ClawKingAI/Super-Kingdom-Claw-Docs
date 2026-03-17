#!/bin/bash
# Weekly Chatbot Report - Video + Email
# Runs every Monday at 7:00 AM EST

set -e

REPORT_DIR="/data/.openclaw/workspace/projects/remotion"
VIDEOS_DIR="/data/.openclaw/workspace/videos"
DATE_STAMP=$(date +%Y%m%d)

echo "=== Weekly Chatbot Video Report ==="
echo "Date: $(date)"

# Fetch latest data
echo "Fetching sheet data..."
cd "$REPORT_DIR"

# Generate props with real data
node -e "
const https = require('https');
const fs = require('fs');

const SHEETS = {
  abw_chat: { id: '1bYzYyaIh6OtdDXAR_hR7j6FqtMrZepNCCXs28S1KnLQ', name: 'ABW CHAT FROM WEBSITES' },
  abw_movers: { id: '1gha743GAjsCZ56q6ZpQmkNLYTA9hl9ezvUKs5WH3BXU', name: 'ABW Movers AI Chats' },
  thrift_store: { id: '1JgTxcNFyXGntyHwHaVVOO1DvF8-GAVY82OJ3NmBBIf4', name: 'Thrift Store Chats' }
};

async function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const sheets = await Promise.all(
    Object.entries(SHEETS).map(async ([key, sheet]) => {
      const csv = await fetch('https://docs.google.com/spreadsheets/d/' + sheet.id + '/export?format=csv&gid=0');
      const lines = csv.split('\\n').filter(l => l.trim());
      return { name: sheet.name, count: lines.length - 1, conversations: [] };
    })
  );
  
  const reportDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  
  fs.writeFileSync('output/props.json', JSON.stringify({ sheets, reportDate }));
  console.log(JSON.stringify({ sheets, reportDate }));
}

main();
" 2>&1

# Render video
echo "Rendering video..."
mkdir -p "$VIDEOS_DIR"
npx remotion render src/index.ts WeeklyReport "$VIDEOS_DIR/weekly-report-$DATE_STAMP.mp4" --props "$(cat output/props.json)" 2>&1 | tail -5

# Create latest symlink
ln -sf "$VIDEOS_DIR/weekly-report-$DATE_STAMP.mp4" "$VIDEOS_DIR/latest.mp4"

echo "Video rendered: $VIDEOS_DIR/weekly-report-$DATE_STAMP.mp4"

# Send email notification
node /data/.openclaw/workspace/scripts/weekly-chatbot-report.js 2>&1 | tail -10

echo "=== Complete ==="

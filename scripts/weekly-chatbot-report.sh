#!/bin/bash
# Weekly Chatbot Conversation Report
# Wrapper script that runs the Node.js report generator
# Schedule: Every Monday at 7:00 AM EST

set -e

echo "Starting weekly chatbot report - $(date)"

# Run the Node.js script
node /data/.openclaw/workspace/scripts/weekly-chatbot-report.js

echo "Report complete - $(date)"

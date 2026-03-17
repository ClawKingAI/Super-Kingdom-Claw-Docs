#!/bin/bash
# Start video server on port 8765

cd /data/.openclaw/workspace/videos

echo "Starting video server on http://localhost:8765"
echo "Videos will be available at:"
echo "  http://YOUR_SERVER_IP:8765/weekly-report-test.mp4"

python3 -m http.server 8765 --bind 0.0.0.0

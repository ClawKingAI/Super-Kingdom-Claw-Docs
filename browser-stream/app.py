#!/usr/bin/env python3
"""Browser Stream - Real-time browser screenshot streaming"""

from flask import Flask, Response, send_file
from playwright.sync_api import sync_playwright
import io
import time
import threading

app = Flask(__name__)

# Global browser state
browser_instance = None
page_instance = None
playwright_instance = None
lock = threading.Lock()

def get_browser():
    global browser_instance, page_instance, playwright_instance
    if browser_instance is None:
        playwright_instance = sync_playwright().start()
        browser_instance = playwright_instance.chromium.launch(headless=True)
        page_instance = browser_instance.new_page(viewport={'width': 1280, 'height': 720})
        page_instance.goto('https://google.com')
    return page_instance

def generate_frames():
    """Generate MJPEG frames from browser screenshots"""
    page = get_browser()
    while True:
        try:
            with lock:
                screenshot = page.screenshot(type='jpeg', quality=70)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + screenshot + b'\r\n')
            time.sleep(0.5)  # 2 FPS
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(1)

@app.route('/')
def index():
    return '''
<!DOCTYPE html>
<html>
<head>
    <title>Browser Stream</title>
    <style>
        body { margin: 0; background: #1a1a2e; display: flex; flex-direction: column; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        h1 { color: #eee; margin: 20px 0 10px; font-size: 24px; }
        .stream { width: 100%; max-width: 1280px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .controls { margin: 20px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        input[type="text"] { padding: 12px 16px; width: 400px; border-radius: 8px; border: none; font-size: 16px; }
        button { padding: 12px 24px; border-radius: 8px; border: none; background: #10b981; color: white; font-size: 16px; cursor: pointer; font-weight: 600; }
        button:hover { background: #059669; }
        .info { color: #888; margin-top: 10px; font-size: 14px; }
    </style>
</head>
<body>
    <h1>🌐 Browser Stream</h1>
    <img src="/stream" class="stream" />
    <div class="controls">
        <input type="text" id="url" placeholder="Enter URL (e.g., https://example.com)" value="https://google.com">
        <button onclick="navigate()">Go</button>
    </div>
    <p class="info">Enter a URL above to navigate the browser</p>
    <script>
        function navigate() {
            const url = document.getElementById('url').value;
            fetch('/navigate?url=' + encodeURIComponent(url));
        }
        document.getElementById('url').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') navigate();
        });
    </script>
</body>
</html>
'''

@app.route('/stream')
def stream():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/navigate')
def navigate():
    url = request.args.get('url', 'https://google.com')
    page = get_browser()
    with lock:
        try:
            page.goto(url, timeout=30000)
            return {'status': 'ok', 'url': url}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

from flask import request

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)

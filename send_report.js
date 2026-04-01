const https = require('https');
const fs = require('fs');

const report = fs.readFileSync('/data/.openclaw/workspace/daily_report_2026-03-27.txt', 'utf8');

const data = JSON.stringify({
  to: 'luvlightruword@icloud.com',
  subject: 'Daily Appointed-Times Discernment Report — March 27, 2026 (9 Nisan 5786)',
  text: report
});

const options = {
  hostname: 'api.agentmail.to',
  port: 443,
  path: '/v0/inboxes/kingdomclaw1@agentmail.to/messages/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();

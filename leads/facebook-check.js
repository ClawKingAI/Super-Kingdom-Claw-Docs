// Use AgentMail to check if we can access Facebook
// Then create account if needed

const https = require('https');

// First, let's check what we can access
console.log("Checking Facebook access...");

const options = {
  hostname: 'www.facebook.com',
  path: '/share/1Q7FDd6SxK/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Look for profile name in the response
    const nameMatch = data.match(/"name":"([^"]+)"/);
    const titleMatch = data.match(/<title>([^<]+)<\/title>/);
    
    if (nameMatch) console.log("Name found:", nameMatch[1]);
    if (titleMatch) console.log("Title:", titleMatch[1]);
    
    // Save for analysis
    require('fs').writeFileSync('/tmp/fb-response.html', data);
    console.log("\nResponse saved to /tmp/fb-response.html");
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();

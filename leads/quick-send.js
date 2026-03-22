const { AgentMailClient } = require('agentmail');
const fs = require('fs');
const path = require('path');

const client = new AgentMailClient({ 
  apiKey: 'am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9' 
});

const inboxId = 'kingdomclaw1@agentmail.to';

const emailBody = (name, org) => `Hi ${name},

I'm reaching out to ${org} because I believe there's something that could really serve your congregation.

There's a free training webinar on the Five-Fold Ministry and God's restoration of His Church:

• What the early Church had (and what was stripped away)
• How the Five-Fold equips believers today
• The real meaning of ekklesia

Link: https://kingdomlife.site/five_fold

In Him,
David Morgan
Kingdom Life Ascension`;

function parseCSV(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  const contacts = [];
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (match) {
      contacts.push({ email: match[1], name: match[2], org: match[3] });
    }
  }
  return contacts;
}

async function sendEmail(to, name, org) {
  try {
    await client.inboxes.messages.send(inboxId, {
      to: to,
      subject: 'Free Kingdom Restoration Training for Georgia Churches',
      text: emailBody(name, org),
    });
    console.log('✓', to);
    return true;
  } catch (error) {
    console.error('✗', to);
    return false;
  }
}

async function main() {
  const contacts = parseCSV(path.join(__dirname, 'ga-churches-contacts.csv'));
  const start = 80, batchSize = 20;
  const batch = contacts.slice(start, start + batchSize);
  
  console.log('Sending', batchSize, 'emails (contacts', start+1, '-', start+batchSize, ')\n');
  
  let sent = 0;
  for (const c of batch) {
    if (await sendEmail(c.email, c.name, c.org)) sent++;
    await new Promise(r => setTimeout(r, 400));
  }
  
  console.log('\nDone:', sent, 'sent');
}

main();

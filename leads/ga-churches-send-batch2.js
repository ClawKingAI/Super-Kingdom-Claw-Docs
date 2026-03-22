const { AgentMailClient } = require('agentmail');
const fs = require('fs');
const path = require('path');

const client = new AgentMailClient({ 
  apiKey: 'am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9' 
});

const inboxId = 'kingdomclaw1@agentmail.to';

const emailBody = (name, org) => `Hi ${name},

I'm reaching out to ${org} because I believe there's something that could really serve your congregation.

There's a free training webinar on the Five-Fold Ministry and God's restoration of His Church that dives into:

• What the early Church had (and what was stripped away)
• How the Five-Fold equips believers today
• The real meaning of ekklesia
• What Constantine changed—and what God is restoring now

This isn't a sales pitch. It's solid Kingdom teaching that your ministry might find valuable.

Link: https://kingdomlife.site/five_fold

If this resonates with what ${org} is already sharing, I'd be honored if you passed it along.

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
      contacts.push({
        email: match[1],
        name: match[2],
        org: match[3]
      });
    }
  }
  return contacts;
}

async function sendEmail(to, name, org) {
  try {
    const result = await client.inboxes.messages.send(inboxId, {
      to: to,
      subject: 'Free Kingdom Restoration Training for Georgia Churches',
      text: emailBody(name, org),
    });
    console.log('✓', to);
    return true;
  } catch (error) {
    console.error('✗', to, error.message);
    return false;
  }
}

async function main() {
  const contacts = parseCSV(path.join(__dirname, 'ga-churches-contacts.csv'));
  console.log('Total contacts:', contacts.length);
  
  // Batch 2: contacts 50-100 (skip first 50 already sent)
  const startIdx = 50;
  const batchSize = 50;
  const batch = contacts.slice(startIdx, startIdx + batchSize);
  
  console.log('Sending batch 2 (contacts', startIdx + 1, '-', startIdx + batchSize, ')...\n');
  
  let sent = 0, failed = 0;
  
  for (const contact of batch) {
    const success = await sendEmail(contact.email, contact.name, contact.org);
    if (success) sent++; else failed++;
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n========================================');
  console.log('Batch 2:', sent, 'sent,', failed, 'failed');
  console.log('Total sent so far:', startIdx + sent);
  console.log('Remaining:', contacts.length - startIdx - batchSize);
  console.log('========================================');
}

main();

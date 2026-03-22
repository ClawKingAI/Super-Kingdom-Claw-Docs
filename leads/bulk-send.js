const { AgentMailClient } = require('agentmail');
const fs = require('fs');
const path = require('path');

const client = new AgentMailClient({ 
  apiKey: 'am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9' 
});

const inboxId = 'kingdomclaw1@agentmail.to';

const emailBody = (name, org) => `Hi ${name} Team,

I came across ${org} while looking for believers walking in the real Kingdom—and I wanted to share something that might resonate.

There's a free training webinar on the Five-Fold Ministry and God's restoration of His Church that dives into:

• What the early Church had (and what was stripped away)
• How the Five-Fold equips believers today  
• The real meaning of ekklesia
• What Constantine changed—and what God is restoring now

No catch, no sales funnel. Just solid Kingdom teaching.

Link: https://kingdomlife.site/five_fold

If this aligns with what you're sharing, I'd love for you to pass it along to your network.

In Him,
David Morgan
Kingdom Life Ascension`;

async function sendEmail(to, name, org) {
  try {
    const result = await client.inboxes.messages.send(inboxId, {
      to: to,
      subject: 'Free Kingdom Restoration Training for Your Network',
      text: emailBody(name, org),
    });
    console.log('✓ Sent to:', to, '(' + org + ')');
    return true;
  } catch (error) {
    console.error('✗ Failed:', to, error.message);
    return false;
  }
}

function parseCSV(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  const contacts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 3) {
      contacts.push({
        email: parts[0].trim(),
        name: parts[1].trim(),
        org: parts[2].trim()
      });
    }
  }
  return contacts;
}

async function main() {
  const contacts = parseCSV(path.join(__dirname, 'contacts.csv'));
  console.log('Loaded', contacts.length, 'contacts\n');
  
  let sent = 0;
  let failed = 0;
  
  for (const contact of contacts) {
    const success = await sendEmail(contact.email, contact.name, contact.org);
    if (success) sent++;
    else failed++;
    await new Promise(r => setTimeout(r, 500)); // 500ms between sends
  }
  
  console.log('\n========================================');
  console.log('Completed:', sent, 'emails sent,', failed, 'failed');
  console.log('========================================');
}

main();

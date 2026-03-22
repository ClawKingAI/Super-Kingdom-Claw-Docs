const { AgentMailClient } = require('agentmail');

const client = new AgentMailClient({ 
  apiKey: 'am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9' 
});

const inboxId = 'kingdomclaw1@agentmail.to';

const emailBody = `Hi,

I came across your organization while looking for believers walking in the real Kingdom—and I wanted to share something that might resonate.

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

async function sendEmail(to, name) {
  try {
    const result = await client.inboxes.messages.send(inboxId, {
      to: to,
      subject: 'Free Kingdom Restoration Training for Your Network',
      text: emailBody.replace('Hi,', 'Hi ' + name + ','),
    });
    console.log('✓ Sent to:', to);
    return true;
  } catch (error) {
    console.error('✗ Failed:', to, error.message);
    return false;
  }
}

async function main() {
  // Test list - replace with real contacts
  const contacts = [
    { email: 'info@h2hnetwork.com', name: 'House2House Ministries' },
  ];
  
  for (const contact of contacts) {
    await sendEmail(contact.email, contact.name);
    await new Promise(r => setTimeout(r, 1000)); // Rate limit: 1 second between sends
  }
}

main();

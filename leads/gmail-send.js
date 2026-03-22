const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'david@kingdomlife.site',
    pass: 'hazv xpuw wstf cyfd'
  }
});

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
  
  // Skip header lines (first 3 lines have stats + header)
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
    await transporter.sendMail({
      from: 'david@kingdomlife.site',
      to: to,
      subject: 'Free Kingdom Restoration Training for Georgia Churches',
      text: emailBody(name, org)
    });
    console.log('✓ Sent to:', to, '(' + org + ')');
    return true;
  } catch (error) {
    console.error('✗ Failed:', to, error.message);
    return false;
  }
}

async function main() {
  const contacts = parseCSV(path.join(__dirname, 'ga-churches-contacts.csv'));
  console.log('Loaded', contacts.length, 'Georgia church contacts\n');
  
  let sent = 0;
  let failed = 0;
  
  // Start from where we left off (around 300 sent)
  const startIndex = 300;
  const batchSize = 100;
  const batch = contacts.slice(startIndex, startIndex + batchSize);
  
  console.log('Sending to contacts', startIndex, 'to', startIndex + batchSize, '...\n');
  
  for (const contact of batch) {
    const success = await sendEmail(contact.email, contact.name, contact.org);
    if (success) sent++;
    else failed++;
    await new Promise(r => setTimeout(r, 1000)); // 1 second between sends (Gmail is stricter)
  }
  
  console.log('\n========================================');
  console.log('Batch complete:', sent, 'sent,', failed, 'failed');
  console.log('Remaining:', contacts.length - startIndex - batchSize);
  console.log('========================================');
}

main();

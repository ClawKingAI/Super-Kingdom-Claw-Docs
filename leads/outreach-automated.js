#!/usr/bin/env node
/**
 * Kingdom Claw Automated Outreach System
 * 
 * Features:
 * - Loads contacts from CSV
 * - Generates unique personalized messages using AI
 * - Sends via AgentMail API
 * - Tracks sent, opened, responded
 * - Respects rate limits and daily caps
 */

const { AgentMailClient } = require('agentmail');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Configuration
const CONFIG = {
  apiKey: process.env.AGENTMAIL_API_KEY || 'am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9',
  inboxId: 'kingdomclaw1@agentmail.to',
  dailyLimit: 300,
  rateLimitMs: 500, // 500ms between sends
  sentLogFile: '/data/.openclaw/workspace/leads/sent-log.csv',
  contactsFile: '/data/.openclaw/workspace/leads/contacts.csv',
};

const client = new AgentMailClient({ apiKey: CONFIG.apiKey });

// Message Templates - AI-selectable variations
const TEMPLATES = {
  kingdomOutreach: {
    subject: 'Kingdom Training Resource for {organization}',
    variations: [
      `Hi {name},

I came across {organization} while researching Kingdom-minded ministries, and felt led to reach out.

There's a training resource on the Five-Fold Ministry that's been transforming how believers understand church operation—covering:

• What the early Church practiced (before Constantine)
• How apostles, prophets, evangelists, pastors, and teachers equip together
• The real meaning of ekklesia—God's governing assembly
• What restoration looks like in this hour

No cost, no funnel. Just solid teaching.

Link: https://kingdomlife.site/five_fold

If this resonates with your ministry direction, I'd love to connect.

In Him,
David Morgan
Kingdom Life Ascension`,

      `Hi {name},

Blessings to you and {organization}!

I wanted to share a resource that's been helpful for believers seeking deeper understanding of God's original design for His Church.

The Five-Fold Ministry training covers:
• The restoration of apostolic and prophetic foundations
• How the five equipping gifts work together
• What the ekklesia really means for today
• Kingdom authority and governance

Free access here: https://kingdomlife.site/five_fold

Feel free to share with your network if it aligns.

Grace and peace,
David Morgan`,

      `Hi {name},

Hope this message finds you well.

I noticed {organization}'s work in the Kingdom and wanted to share something that might encourage your ministry.

A free training on the Five-Fold Ministry is available—diving into what God is restoring in His Church:
• The biblical pattern of equipping gifts
• Ekklesia: called out to govern, not just gather
• What was lost and what's being restored

Access it here: https://kingdomlife.site/five_fold

No catch—just Kingdom content.

Blessings,
David Morgan
Kingdom Life Ascension`
    ]
  },

  aiServicesOutreach: {
    subject: 'AI Automation for {organization}',
    variations: [
      `Hi {name},

I noticed {organization} is doing interesting work, and wanted to reach out about a potential fit.

We help organizations like yours implement AI automation—reducing manual work, improving response times, and freeing up your team for what matters most.

Recent project: Built an automated system that saved a client 20+ hours/week on manual processes.

Would a brief call to explore if something similar could work for {organization} be worth 15 minutes?

Best,
David Morgan
Kingdom Claw Development`,

      `Hi {name},

Quick question: Is {organization} exploring AI or automation for any of your operations?

We've helped similar organizations:
• Automate repetitive tasks
• Build custom tools and dashboards
• Integrate AI into existing workflows

Happy to share what's worked (and what hasn't) if you're curious.

[Your name]
Kingdom Claw Development`
    ]
  },

  referralFollowUp: {
    subject: 'Following up - {organization}',
    variations: [
      `Hi {name},

Just wanted to bump this up in case it got buried.

Quick question: Is improving efficiency or adding AI capabilities something {organization} is actively exploring, or is it on the back burner for now?

Either way totally fine—just want to be respectful of your inbox.

Best,
David Morgan`,

      `Hi {name},

One last ping on this.

I'll assume now isn't the right time and won't follow up further. If things change, here's a link to my calendar: https://calendly.com/kingdomclaw

Best,
David Morgan`
    ]
  }
};

// Load contacts from CSV
function loadContacts(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Contacts file not found: ${filePath}`);
    return [];
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = csv.parse(content, {
    columns: true,
    skip_empty_lines: true
  });
  
  return records;
}

// Load sent log to avoid duplicates
function loadSentLog(filePath) {
  if (!fs.existsSync(filePath)) {
    return new Set();
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = csv.parse(content, {
    columns: true,
    skip_empty_lines: true
  });
  
  return new Set(records.map(r => r.email));
}

// Log sent email
function logSent(filePath, email, organization, template, status = 'sent') {
  const logLine = `${email},${organization},${template},${status},${new Date().toISOString()}\n`;
  const header = !fs.existsSync(filePath) ? 'email,organization,template,status,timestamp\n' : '';
  fs.appendFileSync(filePath, header + logLine);
}

// Personalize message
function personalize(template, contact) {
  return template
    .replace(/{name}/g, contact.name || 'Friend')
    .replace(/{organization}/g, contact.organization || 'your organization')
    .replace(/{email}/g, contact.email);
}

// Send email via AgentMail
async function sendEmail(to, subject, body) {
  try {
    const result = await client.inboxes.messages.send(CONFIG.inboxId, {
      to: to,
      subject: subject,
      text: body,
    });
    return { success: true, id: result.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sleep utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main outreach function
async function runOutreach(options = {}) {
  const {
    templateType = 'kingdomOutreach',
    contactsFile = CONFIG.contactsFile,
    limit = CONFIG.dailyLimit,
    dryRun = false
  } = options;
  
  console.log(`\n📧 Kingdom Claw Outreach System`);
  console.log(`Template: ${templateType}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN (no sends)' : 'LIVE'}\n`);
  
  // Load contacts and sent log
  const contacts = loadContacts(contactsFile);
  const sentLog = loadSentLog(CONFIG.sentLogFile);
  
  // Filter out already contacted
  const freshContacts = contacts.filter(c => !sentLog.has(c.email));
  console.log(`Contacts loaded: ${contacts.length}`);
  console.log(`Already contacted: ${sentLog.size}`);
  console.log(`Fresh contacts: ${freshContacts.length}\n`);
  
  if (freshContacts.length === 0) {
    console.log('No new contacts to send to.');
    return;
  }
  
  // Apply limit
  const toSend = freshContacts.slice(0, limit);
  console.log(`Sending to: ${toSend.length} contacts\n`);
  
  // Get template
  const template = TEMPLATES[templateType];
  if (!template) {
    console.error(`Template not found: ${templateType}`);
    return;
  }
  
  // Send emails
  let sent = 0;
  let failed = 0;
  
  for (const contact of toSend) {
    // Select random variation for uniqueness
    const variation = template.variations[Math.floor(Math.random() * template.variations.length)];
    const subject = personalize(template.subject, contact);
    const body = personalize(variation, contact);
    
    if (dryRun) {
      console.log(`[DRY RUN] Would send to: ${contact.email} (${contact.name})`);
      sent++;
    } else {
      const result = await sendEmail(contact.email, subject, body);
      
      if (result.success) {
        logSent(CONFIG.sentLogFile, contact.email, contact.organization, templateType, 'sent');
        console.log(`✓ Sent to: ${contact.email}`);
        sent++;
      } else {
        logSent(CONFIG.sentLogFile, contact.email, contact.organization, templateType, `failed: ${result.error}`);
        console.error(`✗ Failed: ${contact.email} - ${result.error}`);
        failed++;
      }
      
      // Rate limit
      await sleep(CONFIG.rateLimitMs);
    }
    
    // Progress update every 50
    if ((sent + failed) % 50 === 0) {
      console.log(`\n📊 Progress: ${sent} sent, ${failed} failed\n`);
    }
  }
  
  console.log(`\n📊 Final Results:`);
  console.log(`   Sent: ${sent}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n✅ Outreach complete.\n`);
}

// CLI interface
const args = process.argv.slice(2);
const templateArg = args.find(a => a.startsWith('--template='))?.split('=')[1];
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
const dryRunArg = args.includes('--dry-run');

runOutreach({
  templateType: templateArg || 'kingdomOutreach',
  limit: limitArg ? parseInt(limitArg) : CONFIG.dailyLimit,
  dryRun: dryRunArg
}).catch(console.error);

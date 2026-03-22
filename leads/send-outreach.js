#!/usr/bin/env node
/**
 * Send Outreach - Executes campaign sends via AgentMail
 * 
 * Usage:
 *   node send-outreach.js <campaignId> [--dry-run] [--limit=N]
 */

const { AgentMailClient } = require('agentmail');
const fs = require('fs');
const path = require('path');

const CAMPAIGNS_DIR = '/data/.openclaw/workspace/leads/campaigns';
const API_KEY = process.env.AGENTMAIL_API_KEY || 'am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9';
const INBOX_ID = 'kingdomclaw1@agentmail.to';

const client = new AgentMailClient({ apiKey: API_KEY });

// Message templates with multiple variations for uniqueness
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
  
  followUp: {
    subject: 'Following up - {organization}',
    variations: [
      `Hi {name},

Just wanted to bump this up in case it got buried.

Quick question: Is improving lead capture or customer support something {organization} is actively working on, or is it on the back burner for now?

Either way totally fine—just want to be respectful of your inbox.

Best,
David Morgan`,

      `Hi {name},

One last ping on this.

I'll assume now isn't the right time and won't follow up further. If things change, here's a link to see what we build: https://ai.kingdomlife.site/smart

Best,
David Morgan`
    ]
  },
  
  aiServicesOutreach: {
    subject: 'AI Chatbots for {organization}',
    variations: [
      `Hi {name},

I noticed {organization} is doing interesting work, and wanted to reach out.

We build AI chatbots and smart assistants that help businesses like yours:
• Qualify leads 24/7 (even while you sleep)
• Answer customer questions instantly
• Schedule appointments automatically
• Reduce support workload by 60%+

Recent project: Built a chatbot for a marketing agency that now qualifies 50+ leads/week automatically.

Would 15 minutes to see if something similar could work for {organization} be worth it?

Best,
David Morgan
Kingdom Life Ascension
https://ai.kingdomlife.site/smart`,

      `Hi {name},

Quick question: Is {organization} using AI for customer support or lead generation yet?

We've helped businesses like yours:
• Deploy chatbots that convert visitors into leads
• Automate appointment scheduling
• Provide 24/7 customer support without hiring

One client went from 20% to 70% lead capture rate after adding our AI assistant.

Happy to share what worked — would a brief call make sense?

David Morgan
https://ai.kingdomlife.site/chattybot`
    ]
  }
};

// Personalize message
function personalize(template, contact) {
  return template
    .replace(/{name}/g, contact.name || 'Friend')
    .replace(/{organization}/g, contact.organization || 'your organization')
    .replace(/{email}/g, contact.email);
}

// Send email
async function sendEmail(to, subject, body) {
  try {
    const result = await client.inboxes.messages.send(INBOX_ID, {
      to: to,
      subject: subject,
      text: body,
    });
    return { success: true, id: result.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main send function
async function sendCampaign(campaignId, options = {}) {
  const { dryRun = false, limit = 100 } = options;
  
  // Load campaign
  const campaignPath = path.join(CAMPAIGNS_DIR, `${campaignId}.json`);
  if (!fs.existsSync(campaignPath)) {
    console.error(`Campaign not found: ${campaignId}`);
    return;
  }
  
  const campaign = JSON.parse(fs.readFileSync(campaignPath, 'utf-8'));
  
  // Get pending contacts
  const pending = campaign.contacts
    .filter(c => c.status === 'pending')
    .slice(0, limit);
  
  if (pending.length === 0) {
    console.log('No pending contacts to send to.');
    return;
  }
  
  console.log(`\n📧 Sending Campaign: ${campaign.name}`);
  console.log(`Campaign ID: ${campaignId}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Contacts to send: ${pending.length}\n`);
  
  // Get template
  const templateType = campaign.config.templateType || 'kingdomOutreach';
  const template = TEMPLATES[templateType];
  
  if (!template) {
    console.error(`Template not found: ${templateType}`);
    return;
  }
  
  let sent = 0;
  let failed = 0;
  
  for (const contact of pending) {
    // Select random variation
    const variation = template.variations[Math.floor(Math.random() * template.variations.length)];
    const subject = personalize(template.subject, contact);
    const body = personalize(variation, contact);
    
    if (dryRun) {
      console.log(`[DRY RUN] To: ${contact.email} (${contact.name})`);
      console.log(`         Subject: ${subject}\n`);
      sent++;
    } else {
      const result = await sendEmail(contact.email, subject, body);
      
      if (result.success) {
        // Update contact status
        contact.status = 'sent';
        contact.sentAt = new Date().toISOString();
        sent++;
        console.log(`✓ Sent to: ${contact.email}`);
      } else {
        failed++;
        console.error(`✗ Failed: ${contact.email} - ${result.error}`);
      }
      
      // Rate limit
      await sleep(500);
    }
    
    // Save progress every 10
    if ((sent + failed) % 10 === 0) {
      campaign.stats.totalSent = sent;
      fs.writeFileSync(campaignPath, JSON.stringify(campaign, null, 2));
    }
  }
  
  // Final save
  campaign.stats.totalSent = (campaign.stats.totalSent || 0) + sent;
  campaign.status = 'active';
  fs.writeFileSync(campaignPath, JSON.stringify(campaign, null, 2));
  
  console.log(`\n📊 Results:`);
  console.log(`   Sent: ${sent}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n✅ Campaign send complete.\n`);
}

// CLI
const args = process.argv.slice(2);
const campaignId = args[0];
const dryRun = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 100;

if (!campaignId) {
  console.log(`
📧 Send Outreach - Usage:

  node send-outreach.js <campaignId> [--dry-run] [--limit=N]

Examples:
  node send-outreach.js abc123                    # Send live
  node send-outreach.js abc123 --dry-run          # Test without sending
  node send-outreach.js abc123 --limit=50         # Send only 50
`);
  process.exit(0);
}

sendCampaign(campaignId, { dryRun, limit }).catch(console.error);

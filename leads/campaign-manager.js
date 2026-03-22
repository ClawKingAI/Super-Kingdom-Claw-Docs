#!/usr/bin/env node
/**
 * Outreach Campaign Manager
 * 
 * Manages multiple outreach campaigns with tracking, follow-ups, and scheduling.
 * Integrates with OpenClaw for AI-powered personalization.
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const CAMPAIGNS_DIR = '/data/.openclaw/workspace/leads/campaigns';
const TRACKING_FILE = '/data/.openclaw/workspace/leads/outreach-tracking.json';

// Ensure directories exist
if (!fs.existsSync(CAMPAIGNS_DIR)) {
  fs.mkdirSync(CAMPAIGNS_DIR, { recursive: true });
}

// Campaign structure
function createCampaign(name, config) {
  const campaign = {
    id: Date.now().toString(36),
    name: name,
    created: new Date().toISOString(),
    status: 'draft',
    config: {
      templateType: config.templateType || 'kingdomOutreach',
      dailyLimit: config.dailyLimit || 100,
      followUpDays: config.followUpDays || [4, 10],
      targetProfiles: config.targetProfiles || [],
      excludeDomains: config.excludeDomains || ['gmail.com', 'yahoo.com', 'hotmail.com'],
    },
    stats: {
      totalSent: 0,
      totalOpened: 0,
      totalResponded: 0,
      totalBounced: 0,
    },
    contacts: [],
    history: []
  };
  
  const filePath = path.join(CAMPAIGNS_DIR, `${campaign.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(campaign, null, 2));
  
  console.log(`✅ Campaign created: ${name} (${campaign.id})`);
  return campaign;
}

// Load campaign
function loadCampaign(campaignId) {
  const filePath = path.join(CAMPAIGNS_DIR, `${campaignId}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Campaign not found: ${campaignId}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Save campaign
function saveCampaign(campaign) {
  const filePath = path.join(CAMPAIGNS_DIR, `${campaign.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(campaign, null, 2));
}

// Add contacts to campaign
function addContacts(campaignId, contactsFile) {
  const campaign = loadCampaign(campaignId);
  if (!campaign) return;
  
  const content = fs.readFileSync(contactsFile, 'utf-8');
  const newContacts = csv.parse(content, {
    columns: true,
    skip_empty_lines: true
  });
  
  // Filter out existing and excluded domains
  const existingEmails = new Set(campaign.contacts.map(c => c.email));
  const excludeDomains = new Set(campaign.config.excludeDomains);
  
  const filtered = newContacts.filter(c => {
    if (existingEmails.has(c.email)) return false;
    const domain = c.email.split('@')[1];
    if (excludeDomains.has(domain)) return false;
    return true;
  });
  
  // Add with initial status
  filtered.forEach(c => {
    campaign.contacts.push({
      email: c.email,
      name: c.name,
      organization: c.organization,
      status: 'pending',
      addedAt: new Date().toISOString(),
      sentAt: null,
      openedAt: null,
      respondedAt: null,
      followUps: []
    });
  });
  
  saveCampaign(campaign);
  
  console.log(`✅ Added ${filtered.length} contacts to campaign ${campaignId}`);
  console.log(`   Total contacts: ${campaign.contacts.length}`);
  
  return campaign;
}

// Get pending contacts for sending
function getPendingContacts(campaignId, limit = 100) {
  const campaign = loadCampaign(campaignId);
  if (!campaign) return [];
  
  const pending = campaign.contacts
    .filter(c => c.status === 'pending')
    .slice(0, limit);
  
  return pending;
}

// Mark contact as sent
function markSent(campaignId, email) {
  const campaign = loadCampaign(campaignId);
  if (!campaign) return;
  
  const contact = campaign.contacts.find(c => c.email === email);
  if (contact) {
    contact.status = 'sent';
    contact.sentAt = new Date().toISOString();
    campaign.stats.totalSent++;
    campaign.history.push({
      action: 'sent',
      email: email,
      timestamp: new Date().toISOString()
    });
    saveCampaign(campaign);
  }
}

// Get contacts due for follow-up
function getFollowUpDue(campaignId) {
  const campaign = loadCampaign(campaignId);
  if (!campaign) return [];
  
  const now = new Date();
  const followUpDays = campaign.config.followUpDays;
  
  const due = campaign.contacts.filter(c => {
    if (c.status !== 'sent') return false;
    if (c.respondedAt) return false;
    
    const sentDate = new Date(c.sentAt);
    const daysSinceSent = Math.floor((now - sentDate) / (1000 * 60 * 60 * 24));
    
    // Check if due for follow-up
    for (const day of followUpDays) {
      if (daysSinceSent === day && c.followUps.length < followUpDays.indexOf(day) + 1) {
        return true;
      }
    }
    return false;
  });
  
  return due;
}

// Mark follow-up sent
function markFollowUpSent(campaignId, email) {
  const campaign = loadCampaign(campaignId);
  if (!campaign) return;
  
  const contact = campaign.contacts.find(c => c.email === email);
  if (contact) {
    contact.followUps.push({
      sentAt: new Date().toISOString(),
      type: 'follow_up'
    });
    campaign.history.push({
      action: 'follow_up_sent',
      email: email,
      timestamp: new Date().toISOString()
    });
    saveCampaign(campaign);
  }
}

// Record response
function recordResponse(campaignId, email) {
  const campaign = loadCampaign(campaignId);
  if (!campaign) return;
  
  const contact = campaign.contacts.find(c => c.email === email);
  if (contact) {
    contact.status = 'responded';
    contact.respondedAt = new Date().toISOString();
    campaign.stats.totalResponded++;
    campaign.history.push({
      action: 'response_received',
      email: email,
      timestamp: new Date().toISOString()
    });
    saveCampaign(campaign);
  }
}

// Generate campaign report
function generateReport(campaignId) {
  const campaign = loadCampaign(campaignId);
  if (!campaign) return null;
  
  const total = campaign.contacts.length;
  const sent = campaign.contacts.filter(c => c.status !== 'pending').length;
  const responded = campaign.contacts.filter(c => c.respondedAt).length;
  const pending = campaign.contacts.filter(c => c.status === 'pending').length;
  const followUpsDue = getFollowUpDue(campaignId).length;
  
  const responseRate = sent > 0 ? ((responded / sent) * 100).toFixed(1) : 0;
  
  return {
    campaign: campaign.name,
    id: campaign.id,
    status: campaign.status,
    created: campaign.created,
    stats: {
      totalContacts: total,
      pending: pending,
      sent: sent,
      responded: responded,
      responseRate: `${responseRate}%`,
      followUpsDue: followUpsDue
    }
  };
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'create':
    const name = args[1];
    if (!name) {
      console.error('Usage: node campaign-manager.js create <name>');
      process.exit(1);
    }
    createCampaign(name, {
      templateType: args.find(a => a.startsWith('--template='))?.split('=')[1] || 'kingdomOutreach',
      dailyLimit: parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 100
    });
    break;
    
  case 'add-contacts':
    addContacts(args[1], args[2]);
    break;
    
  case 'pending':
    const pending = getPendingContacts(args[1], parseInt(args[2]) || 100);
    console.log(`Pending contacts: ${pending.length}`);
    pending.forEach(c => console.log(`  ${c.email} - ${c.name}`));
    break;
    
  case 'followups':
    const followUps = getFollowUpDue(args[1]);
    console.log(`Follow-ups due: ${followUps.length}`);
    followUps.forEach(c => console.log(`  ${c.email} - ${c.name}`));
    break;
    
  case 'report':
    const report = generateReport(args[1]);
    console.log(JSON.stringify(report, null, 2));
    break;
    
  case 'list':
    const files = fs.readdirSync(CAMPAIGNS_DIR).filter(f => f.endsWith('.json'));
    console.log(`\n📧 Campaigns (${files.length}):\n`);
    files.forEach(f => {
      const c = JSON.parse(fs.readFileSync(path.join(CAMPAIGNS_DIR, f), 'utf-8'));
      console.log(`  ${c.id}: ${c.name} - ${c.contacts.length} contacts (${c.status})`);
    });
    console.log('');
    break;
    
  default:
    console.log(`
📧 Campaign Manager - Usage:

  node campaign-manager.js create <name> [--template=type] [--limit=N]
  node campaign-manager.js add-contacts <campaignId> <contacts.csv>
  node campaign-manager.js pending <campaignId> [limit]
  node campaign-manager.js followups <campaignId>
  node campaign-manager.js report <campaignId>
  node campaign-manager.js list
`);
}

module.exports = {
  createCampaign,
  loadCampaign,
  addContacts,
  getPendingContacts,
  markSent,
  getFollowUpDue,
  markFollowUpSent,
  recordResponse,
  generateReport
};

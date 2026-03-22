#!/usr/bin/env node
/**
 * Full Sales Pipeline
 * 
 * 1. Find leads (scrape)
 * 2. Reach out (send emails)
 * 3. Follow up (auto sequences)
 * 4. Track responses
 * 5. Report metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CAMPAIGNS_DIR = '/data/.openclaw/workspace/leads/campaigns';
const PIPELINE_FILE = '/data/.openclaw/workspace/leads/sales-pipeline.json';

// Initialize pipeline tracking
function initPipeline() {
  if (!fs.existsSync(PIPELINE_FILE)) {
    fs.writeFileSync(PIPELINE_FILE, JSON.stringify({
      created: new Date().toISOString(),
      stages: {
        leads: { count: 0, lastUpdated: null },
        contacted: { count: 0, lastUpdated: null },
        responded: { count: 0, lastUpdated: null },
        discovery: { count: 0, lastUpdated: null },
        proposal: { count: 0, lastUpdated: null },
        closed: { count: 0, lastUpdated: null }
      },
      campaigns: [],
      dailyLogs: []
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(PIPELINE_FILE, 'utf-8'));
}

// Update pipeline
function updatePipeline(stage, count) {
  const pipeline = initPipeline();
  pipeline.stages[stage] = {
    count: count,
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(PIPELINE_FILE, JSON.stringify(pipeline, null, 2));
}

// Log daily activity
function logDaily(action, details) {
  const pipeline = initPipeline();
  const today = new Date().toISOString().split('T')[0];
  
  let dayLog = pipeline.dailyLogs.find(l => l.date === today);
  if (!dayLog) {
    dayLog = { date: today, actions: [] };
    pipeline.dailyLogs.push(dayLog);
  }
  
  dayLog.actions.push({
    time: new Date().toISOString(),
    action: action,
    details: details
  });
  
  fs.writeFileSync(PIPELINE_FILE, JSON.stringify(pipeline, null, 2));
}

// Get pipeline stats
function getStats() {
  const pipeline = initPipeline();
  return {
    leads: pipeline.stages.leads.count,
    contacted: pipeline.stages.contacted.count,
    responded: pipeline.stages.responded.count,
    discovery: pipeline.stages.discovery.count,
    proposal: pipeline.stages.proposal.count,
    closed: pipeline.stages.closed.count,
    conversionRate: pipeline.stages.contacted.count > 0 
      ? ((pipeline.stages.responded.count / pipeline.stages.contacted.count) * 100).toFixed(1) + '%'
      : '0%'
  };
}

// Calculate follow-ups due
function getFollowUpsDue() {
  const campaigns = fs.readdirSync(CAMPAIGNS_DIR).filter(f => f.endsWith('.json'));
  const due = [];
  const now = new Date();
  
  for (const file of campaigns) {
    const campaign = JSON.parse(fs.readFileSync(path.join(CAMPAIGNS_DIR, file), 'utf-8'));
    
    for (const contact of campaign.contacts) {
      if (contact.status === 'sent' && !contact.respondedAt) {
        const sentDate = new Date(contact.sentAt);
        const daysSince = Math.floor((now - sentDate) / (1000 * 60 * 60 * 24));
        
        // Day 4-5: First follow-up
        // Day 10-12: Second follow-up
        if ((daysSince >= 4 && daysSince <= 5 && contact.followUps.length < 1) ||
            (daysSince >= 10 && daysSince <= 12 && contact.followUps.length < 2)) {
          due.push({
            campaignId: campaign.id,
            campaignName: campaign.name,
            email: contact.email,
            name: contact.name,
            organization: contact.organization,
            daysSince: daysSince,
            followUpNumber: contact.followUps.length + 1
          });
        }
      }
    }
  }
  
  return due;
}

// Execute follow-ups
async function executeFollowUps(dryRun = true) {
  const due = getFollowUpsDue();
  
  console.log(`\n📋 Follow-ups due: ${due.length}\n`);
  
  if (due.length === 0) {
    console.log('No follow-ups due today.');
    return;
  }
  
  for (const item of due) {
    console.log(`${dryRun ? '[DRY RUN] ' : ''}Follow-up #${item.followUpNumber} to ${item.name} (${item.organization})`);
    console.log(`  Campaign: ${item.campaignName}`);
    console.log(`  Days since initial: ${item.daysSince}`);
    console.log('');
  }
  
  if (!dryRun) {
    console.log('\n⚠️  Run individual campaign follow-ups with:');
    console.log('  node send-outreach.js <campaignId> --follow-up');
  }
}

// Daily report
function dailyReport() {
  const stats = getStats();
  const followUps = getFollowUpsDue();
  
  console.log('\n📊 DAILY SALES PIPELINE REPORT');
  console.log('================================\n');
  
  console.log('Pipeline Stages:');
  console.log(`  Leads found:      ${stats.leads}`);
  console.log(`  Contacted:        ${stats.contacted}`);
  console.log(`  Responded:        ${stats.responded}`);
  console.log(`  Discovery calls:  ${stats.discovery}`);
  console.log(`  Proposals sent:   ${stats.proposal}`);
  console.log(`  Closed:           ${stats.closed}`);
  console.log(`\n  Response rate:    ${stats.conversionRate}`);
  
  console.log('\nFollow-ups due today: ' + followUps.length);
  if (followUps.length > 0) {
    followUps.slice(0, 5).forEach(f => {
      console.log(`  - ${f.name} (${f.organization}) - Day ${f.daysSince}`);
    });
    if (followUps.length > 5) {
      console.log(`  ... and ${followUps.length - 5} more`);
    }
  }
  
  console.log('\n');
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'report':
    dailyReport();
    break;
    
  case 'followups':
    const dryRun = !args.includes('--execute');
    executeFollowUps(dryRun);
    break;
    
  case 'stats':
    console.log(JSON.stringify(getStats(), null, 2));
    break;
    
  case 'update':
    updatePipeline(args[1], parseInt(args[2]));
    console.log(`Updated ${args[1]} to ${args[2]}`);
    break;
    
  default:
    console.log(`
📊 Sales Pipeline Manager

Usage:
  node sales-pipeline.js report           Show daily report
  node sales-pipeline.js followups        Show follow-ups due (dry run)
  node sales-pipeline.js followups --execute  Execute follow-ups
  node sales-pipeline.js stats            Get JSON stats
  node sales-pipeline.js update <stage> <count>  Update stage count

Stages: leads, contacted, responded, discovery, proposal, closed
`);
}

module.exports = {
  initPipeline,
  updatePipeline,
  logDaily,
  getStats,
  getFollowUpsDue,
  dailyReport
};

#!/usr/bin/env node
/**
 * Weekly Chatbot Conversation Report
 * Sends formatted conversation logs via email every Monday
 * 
 * Format improvement: Clear separation between USER and BOSS (bot) messages
 */

import { execSync } from 'child_process';
import fs from 'fs';

// Configuration
const SENDER_EMAIL = "david@kingdomlife.site";
const SMTP_USER = "david@kingdomlife.site";
const SMTP_PASS = "hazv xpuw wstf cyfd";
const RECIPIENT_EMAIL = "David@abetterwayministries.com";

// Google Sheet IDs
const SHEETS = [
  { id: "1bYzYyaIh6OtdDXAR_hR7j6FqtMrZepNCCXs28S1KnLQ", name: "ABW CHAT FROM WEBSITES" },
  { id: "1gha743GAjsCZ56q6ZpQmkNLYTA9hl9ezvUKs5WH3BXU", name: "ABW Movers Ai Chats" },
  { id: "1JgTxcNFyXGntyHwHaVVOO1DvF8-GAVY82OJ3NmBBIf4", name: "Thrift Store Chats" }
];

/**
 * Fetch sheet data from Google Sheets CSV export
 */
async function fetchSheet(sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
  return execSync(`curl -sSL "${url}"`, { encoding: 'utf8' });
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Format a conversation for readability
 * Clear separation between USER and BOSS (bot) messages
 */
function formatConversation(conversation) {
  if (!conversation) return '';
  
  // Split by bot: and user: markers
  let formatted = '';
  const lines = conversation.split(/(?=bot:|user:)/g);
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('bot:')) {
      // Bot message - label as "BOSS"
      const content = trimmed.replace(/^bot:\s*/, '');
      formatted += `\n╔════════════════════════════════════════╗\n`;
      formatted += `║ BOSS (Assistant)\n`;
      formatted += `╚════════════════════════════════════════╝\n`;
      formatted += `${content}\n`;
    } else if (trimmed.startsWith('user:')) {
      // User message - label as "USER"
      const content = trimmed.replace(/^user:\s*/, '');
      formatted += `\n┌────────────────────────────────────────┐\n`;
      formatted += `│ USER\n`;
      formatted += `└────────────────────────────────────────┘\n`;
      formatted += `${content}\n`;
    } else {
      // Other content
      formatted += `${trimmed}\n`;
    }
  }
  
  return formatted;
}

/**
 * Parse conversations from sheet data
 * Format: "AI Assistant" column contains full conversation text
 */
function parseConversations(csvData, sheetName) {
  const lines = csvData.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const conversations = [];
  
  // Handle multi-line CSV entries (conversation spans multiple lines)
  let currentEntry = '';
  let inQuotes = false;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    currentEntry += (currentEntry ? '\n' : '') + line;
    
    // Count quotes to see if we're inside a quoted field
    const quoteCount = (currentEntry.match(/"/g) || []).length;
    
    // If even number of quotes, entry is complete
    if (quoteCount % 2 === 0 && currentEntry.includes('bot:')) {
      const cols = parseCSVLine(currentEntry);
      const conversation = cols[0];
      const timestamp = cols[1] || 'Unknown';
      
      if (conversation && (conversation.includes('user:') || conversation.includes('bot:'))) {
        conversations.push({
          sheet: sheetName,
          timestamp: timestamp,
          raw: conversation,
          formatted: formatConversation(conversation)
        });
      }
      currentEntry = '';
    }
  }
  
  // Process any remaining entry
  if (currentEntry.trim()) {
    const cols = parseCSVLine(currentEntry);
    const conversation = cols[0];
    const timestamp = cols[1] || 'Unknown';
    
    if (conversation && (conversation.includes('user:') || conversation.includes('bot:'))) {
      conversations.push({
        sheet: sheetName,
        timestamp: timestamp,
        raw: conversation,
        formatted: formatConversation(conversation)
      });
    }
  }
  
  return conversations;
}

/**
 * Generate the email report
 */
function generateReport(allConversations) {
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let report = '';
  
  // Header
  report += `╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     WEEKLY CHATBOT CONVERSATION REPORT                         ║
║     ${date.padEnd(48)}║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

`;

  // Summary
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Conversations This Week: ${allConversations.length}

`;

  // Group by sheet
  const bySheet = {};
  for (const conv of allConversations) {
    if (!bySheet[conv.sheet]) bySheet[conv.sheet] = [];
    bySheet[conv.sheet].push(conv);
  }
  
  for (const [sheet, convs] of Object.entries(bySheet)) {
    report += `${sheet}: ${convs.length} conversation(s)\n`;
  }
  
  report += `\n`;
  
  // Each conversation
  for (let i = 0; i < allConversations.length; i++) {
    const conv = allConversations[i];
    report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERSATION #${i + 1}
Source: ${conv.sheet}
Timestamp: ${conv.timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${conv.formatted}
`;
  }
  
  // Footer
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This report is auto-generated every Monday at 7:00 AM EST
Kingdom Claw AI Assistant 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  
  return report;
}

/**
 * Send email using Python (most reliable in this environment)
 */
function sendEmail(subject, body) {
  const script = `
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

msg = MIMEMultipart()
msg['From'] = '${SENDER_EMAIL}'
msg['To'] = '${RECIPIENT_EMAIL}'
msg['Subject'] = "${subject}"

msg.attach(MIMEText("""${body.replace(/"/g, '\\"').replace(/`/g, '\\`')}""", 'plain'))

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('${SMTP_USER}', '${SMTP_PASS}')
server.sendmail('${SENDER_EMAIL}', '${RECIPIENT_EMAIL}', msg.as_string())
server.quit()
print("Email sent successfully")
`;
  
  fs.writeFileSync('/tmp/send_report.py', script);
  execSync('python3 /tmp/send_report.py', { stdio: 'inherit' });
}

/**
 * Main execution
 */
async function main() {
  console.log("Starting weekly chatbot report...");
  
  const allConversations = [];
  
  for (const sheet of SHEETS) {
    console.log(`Fetching: ${sheet.name}`);
    try {
      const csvData = await fetchSheet(sheet.id);
      const conversations = parseConversations(csvData, sheet.name);
      console.log(`  Found ${conversations.length} conversations`);
      allConversations.push(...conversations);
    } catch (err) {
      console.error(`  Error fetching ${sheet.name}: ${err.message}`);
    }
  }
  
  console.log(`\nTotal conversations: ${allConversations.length}`);
  
  // Generate and send report
  const report = generateReport(allConversations);
  const subject = `Weekly Chatbot Conversation Report - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  
  // Save report to file for debugging
  fs.writeFileSync('/tmp/chatbot-report.txt', report);
  console.log("Report saved to /tmp/chatbot-report.txt");
  
  // Send email
  console.log("Sending email...");
  sendEmail(subject, report);
  
  console.log("Report complete!");
}

main().catch(console.error);

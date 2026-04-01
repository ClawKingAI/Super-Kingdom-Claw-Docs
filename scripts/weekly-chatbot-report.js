#!/usr/bin/env node
/**
 * Weekly Chatbot Conversation Report - HTML Email
 * Sends 3 separate HTML emails (one per sheet) with last 7 days of conversations
 * Every Monday at 7 AM EST
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const SENDER_EMAIL = "david@kingdomlife.site";
const SMTP_USER = "david@kingdomlife.site";
const SMTP_PASS = "hazv xpuw wstf cyfd";
const RECIPIENT_EMAIL = "David@abetterwayministries.com";

// Google Sheet IDs with assistant labels
const SHEETS = [
  { id: "1bYzYyaIh6OtdDXAR_hR7j6FqtMrZepNCCXs28S1KnLQ", name: "ABW CHAT FROM WEBSITES", assistant: "A Better Way Ministries Assistant" },
  { id: "1gha743GAjsCZ56q6ZpQmkNLYTA9hl9ezvUKs5WH3BXU", name: "ABW Movers Ai Chats", assistant: "A Better Way Movers Assistant" },
  { id: "1JgTxcNFyXGntyHwHaVVOO1DvF8-GAVY82OJ3NmBBIf4", name: "Thrift Store Chats", assistant: "A Better Way Bargains Assistant" }
];

/**
 * Fetch sheet data via curl
 */
function fetchSheet(sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
  return execSync(`curl -sSL "${url}"`, { encoding: 'utf8' });
}

/**
 * Parse CSV handling quoted multi-line fields
 */
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (const line of lines) {
    let i = 0;
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
      i++;
    }
    
    if (!inQuotes) {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += '\n';
    }
  }
  
  return rows;
}

/**
 * Check if timestamp is within last 7 days
 */
function isWithin7Days(timestamp) {
  if (!timestamp || timestamp === 'Unknown') return true; // Include if no timestamp
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return date >= sevenDaysAgo;
  } catch (e) {
    return true; // Include on parse error
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/**
 * Generate HTML email for one sheet
 */
function generateSheetHTML(sheetName, sheetAssistant, conversations) {
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const weekRange = (() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return `${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  })();

  let conversationsHTML = '';
  let convNum = 0;
  
  for (const conv of conversations) {
    convNum++;
    conversationsHTML += `
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0; overflow: hidden; background: #fafafa;">
        <div style="background: #f0f0f0; padding: 12px 16px; border-bottom: 1px solid #ddd; font-size: 13px; color: #555;">
          <strong style="color: #333;">Conversation #${convNum}</strong> &nbsp;|&nbsp; 📅 ${conv.timestamp}
        </div>
        <div style="padding: 16px;">
          ${formatConversationHTML(conv.raw, sheetAssistant)}
        </div>
      </div>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sheetName} - Weekly Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #e8e8e8; margin: 0; padding: 20px;">
  <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 25px 30px;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 600;">📊 ${sheetName}</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.85; font-size: 13px;">Weekly Conversation Report • ${date}</p>
      <p style="margin: 4px 0 0 0; opacity: 0.7; font-size: 12px;">${weekRange}</p>
    </div>
    
    <!-- Summary Bar -->
    <div style="background: #f8f9fa; padding: 20px 30px; border-bottom: 1px solid #eee;">
      <div style="display: inline-block; background: #27ae60; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
        ${conversations.length} Conversation${conversations.length !== 1 ? 's' : ''} This Week
      </div>
    </div>
    
    <!-- Conversations -->
    <div style="padding: 20px 30px;">
      ${conversationsHTML || '<div style="text-align: center; color: #999; padding: 40px;">No conversations in the last 7 days</div>'}
    </div>
    
    <!-- Footer -->
    <div style="background: #2c3e50; color: white; padding: 15px 30px; text-align: center; font-size: 11px; opacity: 0.8;">
      Auto-generated by Kingdom Claw AI 👑 • Every Monday 7:00 AM EST
    </div>
    
  </div>
</body>
</html>`;
}

/**
 * Format conversation with Assistant and USER styling
 */
function formatConversationHTML(conversation, assistantName) {
  if (!conversation) return '';
  
  let html = '';
  const parts = conversation.split(/(?=bot:|user:)/g);
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('bot:')) {
      const content = trimmed.replace(/^bot:\s*/, '').trim();
      html += `
<div style="margin: 12px 0;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 18px; border-radius: 16px 16px 16px 4px; display: inline-block; max-width: 85%; box-shadow: 0 2px 8px rgba(102,126,234,0.3);">
    <div style="font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; opacity: 0.9;">🤖 ${escapeHtml(assistantName)}</div>
    <div style="line-height: 1.6; font-size: 14px;">${escapeHtml(content)}</div>
  </div>
</div>`;
    } else if (trimmed.startsWith('user:')) {
      const content = trimmed.replace(/^user:\s*/, '').trim();
      html += `
<div style="margin: 12px 0; text-align: right;">
  <div style="background: #e8e8e8; color: #222; padding: 14px 18px; border-radius: 16px 16px 4px 16px; display: inline-block; max-width: 85%; text-align: left; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; color: #666;">👤 USER</div>
    <div style="line-height: 1.6; font-size: 14px;">${escapeHtml(content)}</div>
  </div>
</div>`;
    }
  }
  
  return html;
}

/**
 * Send HTML email via Python SMTP
 */
function sendEmail(subject, htmlContent, recipient) {
  fs.writeFileSync('/tmp/chatbot-report.html', htmlContent);
  
  const script = `
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

msg = MIMEMultipart('alternative')
msg['From'] = '${SENDER_EMAIL}'
msg['To'] = '${recipient}'
msg['Subject'] = """${subject}"""

with open('/tmp/chatbot-report.html', 'r') as f:
    html = f.read()

msg.attach(MIMEText(html, 'html'))

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('${SMTP_USER}', '${SMTP_PASS}')
server.sendmail('${SENDER_EMAIL}', '${recipient}', msg.as_string())
server.quit()
print("Sent to ${recipient}")
`;

  fs.writeFileSync('/tmp/send_report.py', script);
  execSync('python3 /tmp/send_report.py', { stdio: 'inherit' });
}

/**
 * Main - Send 3 separate emails (one per sheet)
 */
function main() {
  console.log("Starting weekly chatbot report - 3 separate emails (last 7 days)...\n");
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  for (const sheet of SHEETS) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Processing: ${sheet.name}`);
    console.log('='.repeat(50));
    
    try {
      const csvData = fetchSheet(sheet.id);
      const rows = parseCSV(csvData);
      
      // Get conversations from last 7 days only
      const conversations = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 1 && (row[0].includes('bot:') || row[0].includes('user:'))) {
          const timestamp = row[1] || row[2] || 'Unknown';
          if (isWithin7Days(timestamp)) {
            conversations.push({
              raw: row[0],
              timestamp: timestamp
            });
          }
        }
      }
      
      console.log(`Found ${conversations.length} conversations (last 7 days)`);
      
      // Generate and send HTML email for this sheet
      const html = generateSheetHTML(sheet.name, sheet.assistant, conversations);
      const subject = `${sheet.name} - Weekly Report (${dateStr})`;
      
      sendEmail(subject, html, RECIPIENT_EMAIL);
      
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }
  
  console.log("\n\n✅ All 3 reports sent!");
}

main();

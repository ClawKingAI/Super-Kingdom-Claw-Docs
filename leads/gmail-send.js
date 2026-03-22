#!/usr/bin/env node
/**
 * Gmail SMTP Sender
 * 
 * Sends emails via Gmail SMTP using app password.
 * Use when AgentMail hits rate limit.
 */

const nodemailer = require('nodemailer');
const fs = require('fs');

const CONFIG_PATH = '/data/.openclaw/workspace/leads/email-config.json';

// Load config
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }
  return null;
}

// Create Gmail transporter
function createGmailTransporter(config) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmail.user,
      pass: config.gmail.appPassword.replace(/\s+/g, '') // Remove spaces
    }
  });
}

// Send email via Gmail
async function sendGmail(to, subject, body, config) {
  const transporter = createGmailTransporter(config);
  
  try {
    const result = await transporter.sendMail({
      from: config.gmail.user,
      to: to,
      subject: subject,
      text: body
    });
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// CLI
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(`
📧 Gmail Sender - Usage:

  node gmail-send.js <to> <subject> <body>

Example:
  node gmail-send.js "test@example.com" "Hello" "This is a test"
`);
  process.exit(0);
}

const [to, subject, body] = args;
const config = loadConfig();

if (!config || !config.gmail) {
  console.error('Gmail not configured. Add credentials to email-config.json');
  process.exit(1);
}

sendGmail(to, subject, body, config)
  .then(result => {
    if (result.success) {
      console.log(`✓ Sent to ${to}`);
    } else {
      console.error(`✗ Failed: ${result.error}`);
    }
  })
  .catch(console.error);

module.exports = { sendGmail, createGmailTransporter };

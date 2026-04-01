import { AgentMailClient } from "agentmail";

const client = new AgentMailClient({
  apiKey: "am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9",
});

const reportText = await Bun.file("/data/.openclaw/workspace/daily-report-2026-03-28.txt").text();

const result = await client.inboxes.messages.send(
  "kingdomclaw1@agentmail.to",
  {
    to: "luvlightruword@icloud.com",
    subject: "Daily Appointed-Times Discernment Report — Saturday, March 28, 2026 (10 Nisan 5786)",
    text: reportText,
  }
);

console.log(JSON.stringify(result, null, 2));

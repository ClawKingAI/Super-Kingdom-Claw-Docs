#!/usr/bin/env node
import { bundle } from "@remotion/renderer";
import { spawn } from "child_process";
import { createHash } from "crypto";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";

// Configuration
const OUTPUT_DIR = "/data/.openclaw/workspace/projects/remotion/output";
const SHEETS = {
  abw_chat: {
    id: "1bYzYyaIh6OtdDXAR_hR7j6FqtMrZepNCCXs28S1KnLQ",
    name: "ABW CHAT FROM WEBSITES",
  },
  abw_movers: {
    id: "1gha743GAjsCZ56q6ZpQmkNLYTA9hl9ezvUKs5WH3BXU",
    name: "ABW Movers AI Chats",
  },
  thrift_store: {
    id: "1JgTxcNFyXGntyHwHaVVOO1DvF8-GAVY82OJ3NmBBIf4",
    name: "Thrift Store Chats",
  },
};

// Download sheet as CSV
async function fetchSheet(sheetId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

// Parse CSV and count rows
function parseSheet(csv: string): { count: number; conversations: Array<{ date: string; preview: string }> } {
  const lines = csv.split("\n").filter((l) => l.trim());
  const conversations: Array<{ date: string; preview: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length >= 2) {
      const date = cols[1] || "Unknown";
      const preview = cols[0]?.substring(0, 100) || "";
      conversations.push({ date, preview });
    }
  }

  return { count: conversations.length, conversations };
}

async function main() {
  console.log("Fetching sheet data...");

  // Fetch all sheets
  const sheets = await Promise.all(
    Object.entries(SHEETS).map(async ([key, sheet]) => {
      const csv = await fetchSheet(sheet.id);
      const data = parseSheet(csv);
      return {
        name: sheet.name,
        count: data.count,
        conversations: data.conversations.slice(0, 10), // Top 10 for video
      };
    })
  );

  const reportDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(`Total conversations: ${sheets.reduce((s, x) => s + x.count, 0)}`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate props file
  const propsPath = path.join(OUTPUT_DIR, "props.json");
  fs.writeFileSync(propsPath, JSON.stringify({ sheets, reportDate }));

  console.log("Rendering video...");

  // Use npx remotion render
  const outputPath = path.join(OUTPUT_DIR, `weekly-report-${Date.now()}.mp4`);
  const props = JSON.stringify({ sheets, reportDate }).replace(/"/g, '\\"');

  const renderProcess = spawn(
    "npx",
    [
      "remotion",
      "render",
      "WeeklyReport",
      outputPath,
      "--props",
      props,
    ],
    {
      cwd: "/data/.openclaw/workspace/projects/remotion",
      stdio: "inherit",
      shell: true,
    }
  );

  renderProcess.on("close", (code) => {
    if (code === 0) {
      console.log(`\n✅ Video rendered: ${outputPath}`);
      console.log(`📊 Report for: ${reportDate}`);
      sheets.forEach((s) => console.log(`   ${s.name}: ${s.count}`));
    } else {
      console.error(`❌ Render failed with code ${code}`);
    }
  });
}

main().catch(console.error);

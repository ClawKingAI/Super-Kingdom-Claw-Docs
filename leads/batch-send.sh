#!/bin/bash
API_KEY="am_us_0979af61e72c013e15ea72c47964b7612d90d40afcf7ca42dd9b5766b1e70eb9"
INBOX="kingdomclaw1@agentmail.to"

send_email() {
  local to="$1"
  local name="$2"
  local org="$3"
  
  local body="Hi $name,

I'm reaching out to $org because I believe there's something that could really serve your congregation.

There's a free training webinar on the Five-Fold Ministry and God's restoration of His Church.

Link: https://kingdomlife.site/five_fold

In Him,
David Morgan
Kingdom Life Ascension"

  curl -sS -X POST "https://api.agentmail.to/v0/inboxes/$INBOX/messages" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"to\": \"$to\", \"subject\": \"Free Kingdom Restoration Training for Georgia Churches\", \"text\": $(echo "$body" | jq -Rs .)}" > /dev/null
  
  echo "✓ $to"
}

# Batch 4: contacts 101-120
send_email "PASTORMELVIN@YAHOO.COM" "Melvin" "St Peter Baptist" &
sleep 0.4
send_email "DANDREWS@STPETERSATL.ORG" "David Andrews" "St Peter's Episcopal" &
sleep 0.4
send_email "CCARTER@STPETERSOC.ORG" "C Carter" "St Peter's Episcopal" &
sleep 0.4
send_email "JWEBB@STPETERSSAV.ORG" "James Webb" "St Peter's Episcopal" &
sleep 0.4
send_email "STSTEPHENAMICC@YAHOO.COM" "Stephen" "St Stephen AME" &
sleep 0.4
send_email "JFULLER@STMARKS-Atlanta.ORG" "Jonathan Fuller" "St Mark's" &
sleep 0.4
send_email "PASTORTHOMAS@YAHOO.COM" "Thomas" "St Thomas Baptist" &
sleep 0.4
send_email "STJOHN@STJOHN.ORG" "John" "St John Lutheran" &
sleep 0.4
send_email "SRIDGEWAY@BELLSOUTH.NET" "Steve Ridgeway" "St Paul Methodist" &
sleep 0.4
send_email "REVJONES@GMAIL.COM" "Jones" "St Paul AME" &
wait

echo ""
echo "Batch 4 sent!"

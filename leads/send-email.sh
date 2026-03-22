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

# Send to next 10 contacts (batch 3)
send_email "STJOHNPASTOR1@BELLSOUTH.NET" "Walter E Wade" "St John Baptist Church"
sleep 0.5
send_email "MARILYNWO@BELLSOUTH.NET" "Marilyn Williams" "St John Missionary Baptist"
sleep 0.5
send_email "DBROWN@STLUKESUNITEDMETHODIST.ORG" "David Brown" "St Luke's United Methodist"
sleep 0.5
send_email "WESLEY@STLUKESUMC.ORG" "Wesley" "St Luke's UMC"
sleep 0.5
send_email "CBYNUM1@BELLSOUTH.NET" "Charles Bynum" "St Mark United Methodist"
sleep 0.5
send_email "REVCCOOK@YAHOO.COM" "C Cook" "St Mark AME Church"
sleep 0.5
send_email "TMILLER@STMARKSMARIETTA.ORG" "Thomas Miller" "St Mark United Methodist"
sleep 0.5
send_email "BQUINN@STMARKS-Atlanta.ORG" "Brian Quinn" "St Mark's Episcopal"
sleep 0.5
send_email "RBATTS@STMARYS.ORG" "Robert Batts" "St Mary's Episcopal"
sleep 0.5
send_email "STPHILIP@STPHILIPSAV.COM" "Philip" "St Philip's Episcopal"

echo ""
echo "Batch sent!"

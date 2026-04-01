#!/bin/bash
# Weekly Chatbot Conversation Report
# Scans Google Sheets and emails summary every Monday at 7 AM EST

# Configuration
SENDER_EMAIL="david@kingdomlife.site"
SMTP_USER="david@kingdomlife.site"
SMTP_PASS="hazv xpuw wstf cyfd"
RECIPIENT_EMAIL="David@abetterwayministries.com"

# Google Sheet IDs
SHEET_IDS=(
    "1bYzYyaIh6OtdDXAR_hR7j6FqtMrZepNCCXs28S1KnLQ"  # ABW CHAT FROM WEBSITES
    "1gha743GAjsCZ56q6ZpQmkNLYTA9hl9ezvUKs5WH3BXU"  # ABW Movers Ai Chats
    "1JgTxcNFyXGntyHwHaVVOO1DvF8-GAVY82OJ3NmBBIf4"  # Thrift Store Chats
)

SHEET_NAMES=(
    "ABW CHAT FROM WEBSITES"
    "ABW Movers Ai Chats"
    "Thrift Store Chats"
)

LOG_FILE="/data/.openclaw/workspace/weekly-chatbot-report.log"
REPORT_FILE="/tmp/chatbot-report-$(date +%Y%m%d).txt"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Fetch sheet data (public sheets via CSV export)
fetch_sheet() {
    local sheet_id="$1"
    local gid="$2"
    local url="https://docs.google.com/spreadsheets/d/${sheet_id}/export?format=csv&gid=${gid}"
    
    curl -sSL "$url" 2>/dev/null
}

# Count rows and analyze
analyze_sheet() {
    local sheet_id="$1"
    local sheet_name="$2"
    local data
    
    # Try to fetch (gid=0 for first sheet)
    data=$(fetch_sheet "$sheet_id" "0")
    
    if [ -z "$data" ] || echo "$data" | grep -q "error\|Error\|Sign in"; then
        echo "$sheet_name: Unable to access (may require authentication)"
        return
    fi
    
    local total_lines=$(echo "$data" | wc -l)
    local data_rows=$((total_lines - 1))  # Subtract header
    
    echo "$sheet_name:"
    echo "  Total conversations: $data_rows"
    
    # Count by status if column exists
    local status_col=$(echo "$data" | head -1 | tr ',' '\n' | grep -n -i "status\|state" | head -1 | cut -d: -f1)
    if [ -n "$status_col" ]; then
        local completed=$(echo "$data" | cut -d',' -f"$status_col" | grep -ic "complete\|done\|resolved" || echo 0)
        local pending=$(echo "$data" | cut -d',' -f"$status_col" | grep -ic "pending\|open\|active" || echo 0)
        echo "  Completed: $completed"
        echo "  Pending: $pending"
    fi
    
    echo ""
}

# Generate report
generate_report() {
    cat > "$REPORT_FILE" << EOF
===============================================
WEEKLY CHATBOT CONVERSATION REPORT
Generated: $(date '+%Y-%m-%d %H:%M:%S %Z')
===============================================

SUMMARY
-------

EOF

    local total_conversations=0
    
    for i in "${!SHEET_IDS[@]}"; do
        local sheet_id="${SHEET_IDS[$i]}"
        local sheet_name="${SHEET_NAMES[$i]}"
        
        {
            analyze_sheet "$sheet_id" "$sheet_name"
        } >> "$REPORT_FILE"
    done
    
    cat >> "$REPORT_FILE" << EOF

===============================================
This report is auto-generated every Monday at 7 AM EST.
Kingdom Claw AI Assistant
===============================================
EOF
}

# Send email
send_email() {
    local subject="Weekly Chatbot Conversation Report - $(date '+%B %d, %Y')"
    
    if command -v sendemail &> /dev/null; then
        sendemail -f "$SENDER_EMAIL" \
            -t "$RECIPIENT_EMAIL" \
            -u "$subject" \
            -o message-file="$REPORT_FILE" \
            -s smtp.gmail.com:587 \
            -xu "$SMTP_USER" \
            -xp "$SMTP_PASS" \
            -v
    elif command -v swaks &> /dev/null; then
        swaks --to "$RECIPIENT_EMAIL" \
            --from "$SENDER_EMAIL" \
            --server smtp.gmail.com:587 \
            --auth-user "$SMTP_USER" \
            --auth-password "$SMTP_PASS" \
            --header "Subject: $subject" \
            --body "$REPORT_FILE"
    else
        # Use Python as fallback
        python3 << PYEOF
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

msg = MIMEMultipart()
msg['From'] = '$SENDER_EMAIL'
msg['To'] = '$RECIPIENT_EMAIL'
msg['Subject'] = "$subject"

with open('$REPORT_FILE', 'r') as f:
    body = f.read()

msg.attach(MIMEText(body, 'plain'))

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('$SMTP_USER', '$SMTP_PASS')
server.sendmail('$SENDER_EMAIL', '$RECIPIENT_EMAIL', msg.as_string())
server.quit()
print("Email sent successfully")
PYEOF
    fi
}

# Main
log "=== Starting weekly chatbot report ==="
generate_report
log "Report generated: $REPORT_FILE"
cat "$REPORT_FILE" >> "$LOG_FILE"

send_email
log "Email sent to $RECIPIENT_EMAIL"
log "=== Report complete ==="

echo "Report sent to $RECIPIENT_EMAIL"

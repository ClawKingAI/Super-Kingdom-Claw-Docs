#!/bin/bash
# Facebook Message Monitor for Kingdom Life Ascension
# Monitors Messenger conversations and queues responses
# Ignores scam/phishing messages automatically

PAGE_ID="410845672107866"
PAGE_TOKEN="EAAX2MRQ8VukBRJfXrkMip22ZCa6MYMxFvZAiwZAvqdXCcPxCzPadUFZB3ENovF6KFWaDOQIFaksmXZB66aikyCRgZCDRSlwfCgMZBcJWEiZAGNr82kZBWYQoBodR4MyJ1WqnlPRN5ACbZB91asOSEYepSRrfKsxPu7rbt22egPHapxJHZByDh2PdrolO0mAPmcNc3ZAI8BEvACWvCFD09NFCYPGsyZCT2izmYrFfoJAlT0XAZD"
STATE_DIR="/data/.openclaw/workspace/facebook-comment-bot"
SEEN_MSG_FILE="$STATE_DIR/seen_messages.txt"
LOG_FILE="$STATE_DIR/messenger.log"
MSG_QUEUE="$STATE_DIR/message_queue.txt"

mkdir -p "$STATE_DIR"
touch "$SEEN_MSG_FILE"
touch "$MSG_QUEUE"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check if message is a scam/phishing attempt
is_scam() {
    local msg="$1"
    
    # Common scam patterns
    echo "$msg" | grep -qiE 'your (facebook|page|account) (will be |is |has been )?(scheduled for |at risk of )?(permanently )?(deleted|removed|disabled|suspended)'
    if [ $? -eq 0 ]; then return 0; fi
    
    echo "$msg" | grep -qiE 'submit (a )?(complaint|appeal|review|request)'
    if [ $? -eq 0 ]; then
        echo "$msg" | grep -qiE 'https?://[a-z0-9.-]+\.(com|site|page|link)'
        if [ $? -eq 0 ]; then return 0; fi
    fi
    
    echo "$msg" | grep -qiE '(meta|facebook) (support|policy|business) team'
    if [ $? -eq 0 ]; then
        echo "$msg" | grep -qiE '(copyright|trademark|violation|intellectual property)'
        if [ $? -eq 0 ]; then return 0; fi
    fi
    
    echo "$msg" | grep -qiE 'verify (your )?(account|page)'
    if [ $? -eq 0 ]; then
        echo "$msg" | grep -qiE 'click (here|below)|https?://'
        if [ $? -eq 0 ]; then return 0; fi
    fi
    
    return 1
}

# Fetch conversations
fetch_conversations() {
    curl -sS "https://graph.facebook.com/v18.0/${PAGE_ID}/conversations?fields=id,participants,updated_time,messages%7Bid,from,message,created_time%7D&limit=10&access_token=${PAGE_TOKEN}" 2>/dev/null
}

# Process new messages
process_messages() {
    local json_data="$1"
    
    echo "$json_data" | jq -c '.data[]? | .messages.data[]? | select(.from.id != "'"$PAGE_ID"'") | @base64' 2>/dev/null | while read -r encoded; do
        local msg=$(echo "$encoded" | base64 -d 2>/dev/null)
        local msg_id=$(echo "$msg" | jq -r '.id' 2>/dev/null)
        local msg_text=$(echo "$msg" | jq -r '.message' 2>/dev/null)
        local sender_name=$(echo "$msg" | jq -r '.from.name' 2>/dev/null)
        local sender_id=$(echo "$msg" | jq -r '.from.id' 2>/dev/null)
        local msg_time=$(echo "$msg" | jq -r '.created_time' 2>/dev/null)
        
        # Skip if already seen
        if grep -q "^${msg_id}$" "$SEEN_MSG_FILE" 2>/dev/null; then
            continue
        fi
        
        # Skip empty
        if [ -z "$msg_text" ] || [ "$msg_text" = "null" ]; then
            continue
        fi
        
        # Mark as seen
        echo "$msg_id" >> "$SEEN_MSG_FILE"
        
        # Check for scam
        if is_scam "$msg_text"; then
            log "SCAM DETECTED from $sender_name: $msg_text"
            continue
        fi
        
        # Log new message
        log "NEW MESSAGE from $sender_name (ID: $sender_id): $msg_text"
        
        # Queue for response
        echo "${msg_id}|${sender_id}|${sender_name}|${msg_text}|${msg_time}" >> "$MSG_QUEUE"
    done
}

# Main
log "=== Starting message check ==="
data=$(fetch_conversations)
process_messages "$data"
log "=== Check complete ==="
wc -l < "$MSG_QUEUE" 2>/dev/null || echo "0"

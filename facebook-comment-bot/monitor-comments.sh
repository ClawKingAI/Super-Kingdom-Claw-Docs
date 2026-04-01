#!/bin/bash
# Facebook Comment Monitor for Kingdom Life Ascension
# Only responds to REAL comments from REAL people (not own page)
# Natural delays and human-like behavior

PAGE_ID="410845672107866"
PAGE_TOKEN="EAAX2MRQ8VukBRJfXrkMip22ZCa6MYMxFvZAiwZAvqdXCcPxCzPadUFZB3ENovF6KFWaDOQIFaksmXZB66aikyCRgZCDRSlwfCgMZBcJWEiZAGNr82kZBWYQoBodR4MyJ1WqnlPRN5ACbZB91asOSEYepSRrfKsxPu7rbt22egPHapxJHZByDh2PdrolO0mAPmcNc3ZAI8BEvACWvCFD09NFCYPGsyZCT2izmYrFfoJAlT0XAZD"
STATE_DIR="/data/.openclaw/workspace/facebook-comment-bot"
SEEN_FILE="$STATE_DIR/seen_comments.txt"
LOG_FILE="$STATE_DIR/activity.log"
RESPONSE_QUEUE="$STATE_DIR/response_queue.txt"

mkdir -p "$STATE_DIR"
touch "$SEEN_FILE"
touch "$RESPONSE_QUEUE"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Get posts and their comments
fetch_comments() {
    curl -sS "https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=id,message,comments%7Bid,message,from%7Bname,id%7D,created_time%7D&limit=10&access_token=${PAGE_TOKEN}" 2>/dev/null
}

# Process comments
process_comments() {
    local json_data="$1"
    
    echo "$json_data" | jq -c '.data[]?.comments?.data[]? | select(.from.id != "'"$PAGE_ID"'") | @base64' 2>/dev/null | while read -r encoded; do
        local comment=$(echo "$encoded" | base64 -d 2>/dev/null)
        local comment_id=$(echo "$comment" | jq -r '.id' 2>/dev/null)
        local comment_text=$(echo "$comment" | jq -r '.message' 2>/dev/null)
        local commenter_name=$(echo "$comment" | jq -r '.from.name' 2>/dev/null)
        local commenter_id=$(echo "$comment" | jq -r '.from.id' 2>/dev/null)
        local comment_time=$(echo "$comment" | jq -r '.created_time' 2>/dev/null)
        
        # Skip if already seen
        if grep -q "^${comment_id}$" "$SEEN_FILE" 2>/dev/null; then
            continue
        fi
        
        # Skip empty comments
        if [ -z "$comment_text" ] || [ "$comment_text" = "null" ]; then
            continue
        fi
        
        # Log new comment
        log "NEW COMMENT from $commenter_name (ID: $commenter_id): $comment_text"
        
        # Mark as seen
        echo "$comment_id" >> "$SEEN_FILE"
        
        # Add to response queue for AI to process
        # Format: COMMENT_ID|COMMENTER_NAME|COMMENT_TEXT|TIMESTAMP
        echo "${comment_id}|${commenter_name}|${comment_text}|${comment_time}" >> "$RESPONSE_QUEUE"
    done
}

# Main
log "=== Starting comment check ==="
data=$(fetch_comments)
process_comments "$data"
log "=== Check complete ==="
wc -l < "$RESPONSE_QUEUE" 2>/dev/null || echo "0"

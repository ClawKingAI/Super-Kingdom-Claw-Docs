#!/bin/bash
# Facebook Comment Responder
# Responds to comments on Kingdom Life Ascension page
# Designed to appear human-like with delays and varied responses

PAGE_ID="410845672107866"
PAGE_TOKEN="EAAX2MRQ8VukBRJfXrkMip22ZCa6MYMxFvZAiwZAvqdXCcPxCzPadUFZB3ENovF6KFWaDOQIFaksmXZB66aikyCRgZCDRSlwfCgMZBcJWEiZAGNr82kZBWYQoBodR4MyJ1WqnlPRN5ACbZB91asOSEYepSRrfKsxPu7rbt22egPHapxJHZByDh2PdrolO0mAPmcNc3ZAI8BEvACWvCFD09NFCYPGsyZCT2izmYrFfoJAlT0XAZD"
STATE_FILE="/data/.openclaw/workspace/facebook-comment-bot/seen_comments.json"
LOG_FILE="/data/.openclaw/workspace/facebook-comment-bot/responder.log"

# Create state file if missing
mkdir -p "$(dirname "$STATE_FILE")"
touch "$STATE_FILE"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Get recent posts
get_posts() {
    curl -sS "https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=id,message,comments{id,message,from{name,id},created_time}&limit=10&access_token=${PAGE_TOKEN}"
}

# Check if comment already seen
is_seen() {
    local comment_id="$1"
    grep -q "\"$comment_id\"" "$STATE_FILE" 2>/dev/null
}

# Mark comment as seen
mark_seen() {
    local comment_id="$1"
    echo "\"$comment_id\":" >> "$STATE_FILE"
}

# Respond to a comment (called from main agent)
respond_to_comment() {
    local comment_id="$1"
    local comment_text="$2"
    local commenter_name="$3"
    local post_message="$4"
    
    # This function should be called by the AI agent
    # which generates an appropriate response
    
    log "Processing comment from $commenter_name: $comment_text"
}

# Main check function
check_comments() {
    log "Checking for new comments..."
    
    posts_json=$(get_posts)
    
    # Parse and check for new comments
    echo "$posts_json" | jq -r '.data[]?.comments?.data[]? | @base64' 2>/dev/null | while read -r encoded; do
        comment=$(echo "$encoded" | base64 -d)
        comment_id=$(echo "$comment" | jq -r '.id')
        comment_text=$(echo "$comment" | jq -r '.message')
        commenter_name=$(echo "$comment" | jq -r '.from.name // "Someone"')
        comment_time=$(echo "$comment" | jq -r '.created_time')
        
        if ! is_seen "$comment_id"; then
            log "NEW COMMENT: $commenter_name said: $comment_text"
            mark_seen "$comment_id"
            # Output for agent to process
            echo "NEW_COMMENT|$comment_id|$commenter_name|$comment_text"
        fi
    done
}

# Run check
check_comments

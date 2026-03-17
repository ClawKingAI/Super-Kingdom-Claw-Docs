#!/bin/bash
# Deploy a landing page to here.now
# Usage: ./deploy.sh <dist-directory>

set -e

DIST_DIR="${1:-dist}"
API_KEY=$(cat ~/.herenow/credentials 2>/dev/null || echo "")

if [ -z "$API_KEY" ]; then
  echo "Error: No API key found at ~/.herenow/credentials"
  exit 1
fi

if [ ! -d "$DIST_DIR" ]; then
  echo "Error: Directory $DIST_DIR not found"
  exit 1
fi

# Calculate file info
FILES_JSON='{"files":['
FIRST=true

for file in $(find "$DIST_DIR" -type f -not -path "*/\.*"); do
  path="${file#$DIST_DIR/}"
  size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
  hash=$(sha256sum "$file" | cut -d' ' -f1)
  
  # Detect content type
  case "$path" in
    *.html) content_type="text/html; charset=utf-8" ;;
    *.css) content_type="text/css; charset=utf-8" ;;
    *.js) content_type="text/javascript; charset=utf-8" ;;
    *.svg) content_type="image/svg+xml" ;;
    *.png) content_type="image/png" ;;
    *.jpg|*.jpeg) content_type="image/jpeg" ;;
    *.webp) content_type="image/webp" ;;
    *) content_type="application/octet-stream" ;;
  esac
  
  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    FILES_JSON+=","
  fi
  
  FILES_JSON+="{\"path\":\"$path\",\"size\":$size,\"contentType\":\"$content_type\",\"hash\":\"$hash\"}"
done

FILES_JSON+=']}'

# Step 1: Create site
echo "Creating site..."
RESPONSE=$(curl -sS https://here.now/api/v1/publish \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$FILES_JSON")

SLUG=$(echo "$RESPONSE" | jq -r '.slug')
SITE_URL=$(echo "$RESPONSE" | jq -r '.siteUrl')
VERSION_ID=$(echo "$RESPONSE" | jq -r '.upload.versionId')
FINALIZE_URL=$(echo "$RESPONSE" | jq -r '.upload.finalizeUrl')

echo "Site created: $SLUG"

# Step 2: Upload files
echo "Uploading files..."
UPLOADS=$(echo "$RESPONSE" | jq -c '.upload.uploads[]')

while IFS= read -r upload; do
  PATH_FILE=$(echo "$upload" | jq -r '.path')
  URL=$(echo "$upload" | jq -r '.url')
  CONTENT_TYPE=$(echo "$upload" | jq -r '.headers."Content-Type"')
  
  echo "  Uploading: $PATH_FILE"
  curl -sS -X PUT "$URL" \
    -H "Content-Type: $CONTENT_TYPE" \
    --data-binary "@$DIST_DIR/$PATH_FILE" > /dev/null
done <<< "$UPLOADS"

# Step 3: Finalize
echo "Finalizing..."
curl -sS -X POST "$FINALIZE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"$VERSION_ID\"}"

echo ""
echo "✓ Deployed to: $SITE_URL"

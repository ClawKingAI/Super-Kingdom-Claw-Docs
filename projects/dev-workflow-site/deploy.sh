#!/bin/bash
set -e
cd /data/.openclaw/workspace/projects/dev-workflow-site

API_KEY=$(cat ~/.herenow/credentials)

# Calculate file info as proper JSON
FILES_JSON=$(find dist -type f -not -path "*/\\.*" | while read file; do
  path="${file#dist/}"
  size=$(stat -c%s "$file")
  hash=$(sha256sum "$file" | cut -d' ' -f1)
  
  case "$path" in
    *.html) content_type="text/html; charset=utf-8" ;;
    *.css) content_type="text/css; charset=utf-8" ;;
    *.js) content_type="text/javascript; charset=utf-8" ;;
    *.svg) content_type="image/svg+xml" ;;
    *) content_type="application/octet-stream" ;;
  esac
  
  echo "{\"path\":\"$path\",\"size\":$size,\"contentType\":\"$content_type\",\"hash\":\"$hash\"}"
done | jq -s '{"files": .}')

echo "Creating site..."
RESPONSE=$(curl -sS https://here.now/api/v1/publish \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$FILES_JSON")

echo "$RESPONSE" | jq '.'

SLUG=$(echo "$RESPONSE" | jq -r '.slug')
VERSION_ID=$(echo "$RESPONSE" | jq -r '.upload.versionId')
FINALIZE_URL=$(echo "$RESPONSE" | jq -r '.upload.finalizeUrl')

echo ""
echo "Site slug: $SLUG"
echo "Uploading files..."

echo "$RESPONSE" | jq -c '.upload.uploads[]' | while read -r upload; do
  PATH_FILE=$(echo "$upload" | jq -r '.path')
  URL=$(echo "$upload" | jq -r '.url')
  CONTENT_TYPE=$(echo "$upload" | jq -r '.headers."Content-Type"')
  
  echo "  Uploading: $PATH_FILE"
  curl -sS -X PUT "$URL" \
    -H "Content-Type: $CONTENT_TYPE" \
    --data-binary "@dist/$PATH_FILE" > /dev/null
done

echo ""
echo "Finalizing..."
curl -sS -X POST "$FINALIZE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"$VERSION_ID\"}" | jq '.'

echo ""
echo "✓ Deployed to: https://$SLUG.here.now/"

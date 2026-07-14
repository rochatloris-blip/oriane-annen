#!/bin/bash
# Email relay + tunnel startup script
# Usage: ./email-relay/start.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Kill existing processes
pkill -f "email-relay/server.py" 2>/dev/null
pkill -f "cloudflared tunnel" 2>/dev/null
sleep 1

# Start SMTP relay
PYTHONUNBUFFERED=1 nohup python3 "$SCRIPT_DIR/server.py" > /tmp/email-relay.log 2>&1 &
echo "[relay] started (PID $!)"

# Start ephemeral tunnel
nohup cloudflared tunnel --url http://localhost:8825 --protocol http2 > /tmp/cloudflared-tunnel.log 2>&1 &
echo "[tunnel] starting..."

# Wait for tunnel URL
for i in $(seq 1 30); do
  URL=$(grep -o "https://[a-z0-9-]*\.trycloudflare\.com" /tmp/cloudflared-tunnel.log | head -1)
  if [ -n "$URL" ]; then
    echo "[tunnel] URL: $URL"
    echo ""
    echo "Update RELAY_URL in functions/contact.js with:"
    echo "  $URL"
    echo ""
    echo "Then rebuild and push:"
    echo "  npm run build && git add -A && git commit -m 'Update relay URL' && git push"
    exit 0
  fi
  sleep 2
done

echo "[tunnel] timeout waiting for URL"
exit 1

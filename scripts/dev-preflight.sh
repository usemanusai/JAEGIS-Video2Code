#!/usr/bin/env bash
set -euo pipefail

# Anti-Port Conflict Preflight for local development
# Checks default host ports used by docker-compose and suggests resolutions
# Ports: Frontend 5173, AI Gateway 8080, Video Processor 5000

ROOT_DIR=$(cd "$(dirname "$0")"/.. && pwd)
OVERRIDE_FILE="$ROOT_DIR/docker-compose.override.local.yml"

check_port() {
  local port=$1
  # Try bash /dev/tcp (works on bash), fall back to nc/lsof if available
  if (echo >/dev/tcp/127.0.0.1/$port) &>/dev/null; then
    echo "busy"
    return 0
  fi
  if command -v nc >/dev/null 2>&1; then
    if nc -z 127.0.0.1 "$port" >/dev/null 2>&1; then echo "busy"; return 0; fi
  fi
  echo "free"
}

pid_for_port() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    lsof -i :"$port" -sTCP:LISTEN -n -P 2>/dev/null | awk 'NR>1 {print $2; exit}'
  elif command -v ss >/dev/null 2>&1; then
    ss -ltnp 2>/dev/null | awk -v p=":"$port" '$4 ~ p {print $6}' | sed 's/pid=\([0-9]*\).*/\1/;q'
  else
    netstat -ltnp 2>/dev/null | awk -v p=":"$port" '$4 ~ p {print $7}' | cut -d'/' -f1 | head -n1
  fi
}

find_free_port() {
  local start=$1
  local p=$start
  for i in {1..50}; do
    if [ "$(check_port "$p")" = "free" ]; then echo "$p"; return 0; fi
    p=$((p+1))
  done
  echo 0
}

FRONTEND_PORT=5173
API_PORT=8080
PY_PORT=5000

busy_front=$(check_port $FRONTEND_PORT)
busy_api=$(check_port $API_PORT)
busy_py=$(check_port $PY_PORT)

alt_front=$FRONTEND_PORT
alt_api=$API_PORT
alt_py=$PY_PORT

if [ "$busy_front" = "busy" ]; then alt_front=$(find_free_port $((FRONTEND_PORT+1))); fi
if [ "$busy_api" = "busy" ]; then alt_api=$(find_free_port $((API_PORT+1))); fi
if [ "$busy_py" = "busy" ]; then alt_py=$(find_free_port $((PY_PORT+1))); fi

conflicts=0
[ "$busy_front" = "busy" ] && conflicts=1
[ "$busy_api" = "busy" ] && conflicts=1
[ "$busy_py" = "busy" ] && conflicts=1

if [ $conflicts -eq 0 ]; then
  echo "All required ports are free: $FRONTEND_PORT, $API_PORT, $PY_PORT"
  exit 0
fi

echo "Detected port conflicts:" >&2
if [ "$busy_front" = "busy" ]; then
  pid=$(pid_for_port $FRONTEND_PORT || true)
  echo "- 5173 (frontend) is busy${pid:+ by PID $pid}" >&2
fi
if [ "$busy_api" = "busy" ]; then
  pid=$(pid_for_port $API_PORT || true)
  echo "- 8080 (ai-gateway) is busy${pid:+ by PID $pid}" >&2
fi
if [ "$busy_py" = "busy" ]; then
  pid=$(pid_for_port $PY_PORT || true)
  echo "- 5000 (video-processor) is busy${pid:+ by PID $pid}" >&2
fi

cat >&2 <<EOF

Resolution options:
1) Stop the conflicting processes (recommended)
   - macOS/Linux: kill -9 <PID>
   - Windows: use PowerShell: Get-Process -Id <PID> | Stop-Process -Force

2) Use alternative host ports via a Compose override
   Generating: $OVERRIDE_FILE
EOF

cat > "$OVERRIDE_FILE" <<YAML
services:
  frontend:
    ports:
      - ${alt_front}:5173
  ai-gateway:
    ports:
      - ${alt_api}:8080
  video-processor:
    ports:
      - ${alt_py}:5000
YAML

echo "Created $OVERRIDE_FILE with suggested mappings:" >&2
printf "- frontend: %s -> 5173\n- ai-gateway: %s -> 8080\n- video-processor: %s -> 5000\n" "$alt_front" "$alt_api" "$alt_py" >&2

echo >&2
echo "Next steps:" >&2
echo "docker compose -f docker-compose.yml -f docker-compose.override.local.yml up -d --build" >&2

exit 2


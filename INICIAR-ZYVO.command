#!/bin/zsh

cd "$(dirname "$0")" || exit 1

pkill -f "next.*dev" 2>/dev/null || true

echo "Atualizando ZYVO..."
git pull --ff-only origin dev || true

echo "Iniciando localhost:3000..."

(
  while true; do
    sleep 20
    git pull --ff-only origin dev >/tmp/zyvo-auto-sync.log 2>&1 || true
  done
) &
SYNC_PID=$!

cleanup() {
  kill "$SYNC_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

npm run dev:next

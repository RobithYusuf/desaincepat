#!/bin/bash

PORT=${1:-3000}

echo "🔍 Looking for processes on port $PORT..."

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "✅ No process found on port $PORT"
else
  echo "🔪 Killing process $PID on port $PORT..."
  kill -9 $PID
  echo "✅ Port $PORT is now free"
fi

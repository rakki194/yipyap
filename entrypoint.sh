#!/bin/sh
set -e

# Set default RUN_MODE to 'backend' if not specified
RUN_MODE=${RUN_MODE:-backend}
echo "RUN_MODE set to $RUN_MODE"

if [ "$RUN_MODE" = "backend" ]; then
  echo "Starting backend..."
  # Start the FastAPI backend using python -m uvicorn
  python3 -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7000}
elif [ "$RUN_MODE" = "frontend" ]; then
  echo "Starting frontend..."
  # Serve the built static assets
  npx serve -l tcp://0.0.0.0:${PORT:-7000} dist
elif [ "$RUN_MODE" = "both" ]; then
  if [ "$ENVIRONMENT" = "production" ]; then
    echo "RUN_MODE is both and ENVIRONMENT is production. Starting backend only (production static files will be served by backend)."
    python3 -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7000}
  else
    echo "Starting frontend in background..."
    npm run dev &
    echo "Starting backend..."
    python3 -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7000}
  fi
else
  echo "Error: RUN_MODE must be set to 'backend', 'frontend', or 'both'."
  exit 1
fi

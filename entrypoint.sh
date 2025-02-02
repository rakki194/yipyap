#!/bin/sh
set -e

# Set default RUN_MODE to 'backend' if not specified
RUN_MODE=${RUN_MODE:-backend}
echo "RUN_MODE set to $RUN_MODE"

if [ "$RUN_MODE" = "backend" ]; then
  echo "Starting FastAPI backend server..."
  # Start the FastAPI backend using python -m uvicorn
  python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7000}
elif [ "$RUN_MODE" = "frontend" ]; then
  echo "Starting static file server for frontend assets..."
  # Serve the built static assets
  npx serve -l tcp://0.0.0.0:${PORT:-7000} dist
else
  echo "Error: RUN_MODE must be set to 'backend' or 'frontend'."
  exit 1
fi 
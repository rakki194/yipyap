#!/bin/bash
# run_production.sh - Script to run yipyap in production mode

# Default configuration
ROOT_DIR=${ROOT_DIR:-$HOME/datasets}
BACKEND_PORT=${BACKEND_PORT:-8000}
FRONTEND_PORT=${FRONTEND_PORT:-7000}
MODE=${MODE:-split}  # split or combined

# Make script more robust
set -e

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found. Please run 'npm run build' first."
  exit 1
fi

# Create static directory if it doesn't exist
mkdir -p static

# Check which mode to run in
if [ "$MODE" = "combined" ]; then
  # Run in combined mode (backend serves frontend assets)
  echo "Running in combined mode (backend serves frontend)..."
  echo "Starting backend on port $BACKEND_PORT..."
  
  # In combined mode, set ENVIRONMENT to production to enable static file serving
  ENVIRONMENT=production NODE_ENV=production ROOT_DIR=$ROOT_DIR BACKEND_PORT=$BACKEND_PORT \
    python3 -m uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT
elif [ "$MODE" = "split" ]; then
  # Run in split mode (separate backend and frontend)
  echo "Running in split mode (separate backend and frontend)..."
  echo "Starting backend on port $BACKEND_PORT..."
  
  # Start the backend with CORS properly configured
  CORS_ORIGIN=http://localhost:$FRONTEND_PORT ROOT_DIR=$ROOT_DIR BACKEND_PORT=$BACKEND_PORT \
    python3 -m uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT &
  BACKEND_PID=$!
  
  # Wait for backend to start
  echo "Waiting for backend to start..."
  sleep 2
  
  # Update config.js for the frontend
  echo "Updating API configuration..."
  cat > dist/config.js << EOF
// Configuration for yipyap frontend
window.API_BASE_URL = 'http://localhost:$BACKEND_PORT';

// Add debug logging for API requests
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  console.debug('Fetch request:', { url, options });
  
  // If it's a relative URL and starts with /api, /config, etc, use the API base URL
  if (typeof url === 'string' && url.startsWith('/') && 
     (url.startsWith('/api') || url.startsWith('/config') || 
      url.startsWith('/preview') || url.startsWith('/thumbnail') ||
      url.startsWith('/download') || url.startsWith('/caption'))) {
    url = window.API_BASE_URL + url;
    console.debug('Rewritten URL:', url);
  }
  
  return originalFetch(url, options)
    .then(response => {
      console.debug('Fetch response:', { 
        url, 
        status: response.status,
        statusText: response.statusText,
        headers: [...response.headers.entries()]
      });
      return response;
    })
    .catch(error => {
      console.error('Fetch error:', { url, error });
      throw error;
    });
};

console.log('API Base URL configured:', window.API_BASE_URL);
EOF
  
  echo "Starting frontend on port $FRONTEND_PORT connecting to backend on port $BACKEND_PORT..."
  echo "Frontend at: http://localhost:$FRONTEND_PORT"
  echo "Backend API at: http://localhost:$BACKEND_PORT"
  echo "API requests from the frontend will be sent to: $BACKEND_PORT"
  
  npx http-server dist -p $FRONTEND_PORT --cors -a 0.0.0.0
  
  # Kill backend when frontend exits
  kill $BACKEND_PID
else
  echo "Error: Unknown mode '$MODE'. Use 'split' or 'combined'."
  exit 1
fi 
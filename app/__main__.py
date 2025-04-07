"""
Module: app/__main__.py

A development and production server launcher for the application.

This script initializes environment variables and launches either:
- A development server with hot-reloading and Vite frontend
- A production test server serving pre-built static files

Features:
- **Environment Configuration**: Sets default environment variables for the environment (`development` or `production`), root directory, reload setting, development port, and backend port.
- **Development Mode**:
    - **Frontend Setup**: Checks and installs frontend dependencies using npm if `node_modules` does not exist.
    - **Vite Dev Server**: Starts the Vite development server for the SolidJS frontend on the specified development port.
    - **Backend Server**: Launches the backend server using Uvicorn with auto-reload enabled based on the `RELOAD` environment variable.
    - **Signal Handling**: Listens for termination signals (`SIGINT`, `SIGTERM`) to gracefully shut down both frontend and backend servers.
- **Production Mode**:
    - **Static File Serving**: Serves pre-built static files from /dist/ using Uvicorn without hot-reloading.

Usage:
    Development mode:
    ```bash
    python -m app
    # or
    ENVIRONMENT=development python -m app
    ```

    Production mode:
    ```bash
    ENVIRONMENT=production python -m app
    ```

Environment Variables:
- `ENVIRONMENT`: Set to `development` or `production`. Defaults to `development`.
- `ROOT_DIR`: Root directory for datasets. Defaults to `~/datasets`.
- `RELOAD`: Enable or disable auto-reloading. Defaults to `true`.
- `DEV_PORT`: Port for the frontend development server. Defaults to `1984`.
- `BACKEND_PORT`: Port for the backend server. Defaults to `DEV_PORT + 1`.
"""

from pathlib import Path
import subprocess
import sys
import os
import signal
import uvicorn
import logging
import logging.handlers

logger = logging.getLogger(__name__)


def setup_logging(is_dev: bool):
    """
    Configure logging to output to both console and log files.
    Logs will be stored in the logs directory with daily rotation.
    """
    # Create logs directory if it doesn't exist
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)

    # Create formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Setup file handler for rotating logs
    file_handler = logging.handlers.TimedRotatingFileHandler(
        logs_dir / "backend.log", when="midnight", backupCount=7  # Keep logs for a week
    )
    file_handler.setFormatter(formatter)

    # Setup console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG if is_dev else logging.INFO)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)

    # Set uvicorn access logger to use file handler
    uvicorn_logger = logging.getLogger("uvicorn.access")
    uvicorn_logger.addHandler(file_handler)

    # Set uvicorn error logger to use file handler
    uvicorn_error_logger = logging.getLogger("uvicorn.error")
    uvicorn_error_logger.addHandler(file_handler)

    # Set watchfiles log level to WARNING to prevent spam
    # This prevents the debug messages about file changes
    watchfiles_logger = logging.getLogger("watchfiles")
    watchfiles_logger.setLevel(logging.WARNING)


def run_development_server(dev_port: int, backend_port: int):
    """Starts the development servers with Vite frontend and hot-reloading."""
    # Check if npm dependencies are installed
    if not Path("node_modules").exists():
        logger.info("Installing frontend dependencies...")
        subprocess.run(["npm", "install"], check=True)

    # Start the Vite dev server
    env = os.environ.copy()
    env["NODE_ENV"] = "development"
    frontend = subprocess.Popen(
        [
            "npm",
            "exec",
            "vite",
            "--",
            "--host",
            "--port",
            str(dev_port),
            "--strictPort",
            "--clearScreen=false",
        ],
        env=env,
    )

    def cleanup(signum, frame):
        logger.info("Shutting down development servers...")
        frontend.terminate()
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # Get absolute path for better exclusion matching
    project_dir = os.path.abspath(os.path.curdir)
    logs_absolute_path = os.path.join(project_dir, "logs")

    # Start uvicorn with reload
    reload = os.getenv("RELOAD", "true").lower()[:1] in "1yt"
    uvicorn.run(
        "app.main:app",
        host="localhost",
        port=backend_port,
        log_level="debug" if reload else "info",
        reload=reload,
        reload_dirs=["app"],
        reload_excludes=[
            logs_absolute_path,  # Absolute path to logs directory
            "logs",  # Directory name
            "logs/*",  # All files in logs directory
            "*.log",  # All log files
            "*.log.*",  # All rotated log files
            "cache.db",  # Database cache
            "__pycache__",  # Python cache
            "node_modules",  # Node modules
        ],
    )

    frontend.terminate()


def run_production_server(backend_port: int):
    """
    Starts the production test server serving static files without hot-reloading.
    Serves the pre-built frontend from /dist/ directory.
    """
    logger.info("Starting production server...")
    logger.info(f"Server will be available at http://localhost:{backend_port}")

    if not Path("dist/index.html").exists():
        logger.error("Frontend build not found! Please run 'npm run build' first.")
        sys.exit(1)

    uvicorn.run(
        "app.main:app",
        host="localhost",
        port=backend_port,
        log_level="debug",  # Keep debug level for consistency
        reload=False,
    )


def main():
    # Set default environment variables
    is_dev = (
        os.environ.setdefault("ENVIRONMENT", "development").lower() == "development"
    )
    os.environ.setdefault("ROOT_DIR", os.path.expanduser("~/datasets"))
    os.environ.setdefault("RELOAD", "true")
    dev_port = int(os.environ.setdefault("DEV_PORT", "1984"))
    backend_port = int(
        os.environ.setdefault("BACKEND_PORT", str(dev_port + 1 if is_dev else dev_port))
    )

    # Configure logging with file and console output
    setup_logging(is_dev)

    logger.info(f"Starting server in {'development' if is_dev else 'production'} mode")
    logger.info(f"DEV_PORT: {dev_port}, BACKEND_PORT: {backend_port}")

    if is_dev:
        run_development_server(dev_port, backend_port)
    else:
        run_production_server(backend_port)


if __name__ == "__main__":
    main()

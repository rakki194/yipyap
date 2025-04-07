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
from uvicorn.config import LOGGING_CONFIG

logger = logging.getLogger(__name__)


def make_log_config(is_dev: bool):
    """
    Configure logging by extending uvicorn's default configuration.
    Logs will be stored in the logs directory with daily rotation.
    """
    # Create logs directory if it doesn't exist
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)

    # Create our custom logging config by extending uvicorn's config
    custom_config = LOGGING_CONFIG.copy()

    # Add our custom formatters
    custom_config["formatters"].update(
        {
            "custom": {
                "()": "logging.Formatter",
                "fmt": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            }
        }
    )

    # Add our custom handlers
    custom_config["handlers"].update(
        {
            "file": {
                "class": "logging.handlers.TimedRotatingFileHandler",
                "formatter": "custom",
                "filename": str(logs_dir / "backend.log"),
                "when": "midnight",
                "backupCount": 7,
            },
            "frontend_file": {
                "class": "logging.handlers.TimedRotatingFileHandler",
                "formatter": "custom",
                "filename": str(logs_dir / "frontend.log"),
                "when": "midnight",
                "backupCount": 7,
            },
        }
    )

    # Add our custom loggers
    custom_config["loggers"].update(
        {
            "frontend": {
                "handlers": ["frontend_file"],
                "propagate": False,
            },
            "watchfiles": {
                "level": "INFO",
                "propagate": False,
            },
        }
    )

    # Update existing loggers to use our file handler and set appropriate levels
    log_level = "DEBUG" if is_dev else "INFO"
    for logger_name in ["uvicorn", "uvicorn.error", "uvicorn.access", "frontend"]:
        if logger_name in custom_config["loggers"]:
            logger_config = custom_config["loggers"][logger_name]
            logger_config["level"] = log_level
            if "handlers" not in logger_config:
                logger_config["handlers"] = []
            logger_config["handlers"].append("file")

    return custom_config


def run_uvicorn_reload(app, **kwargs):
    """
    uvicorn.run with reload enabled but respects reload_dirs
    """
    from uvicorn.config import Config
    from uvicorn.server import Server
    from uvicorn.supervisors.watchfilesreload import (
        WatchFilesReload as ChangeReloadOriginal,
    )
    from uvicorn.supervisors.watchfilesreload import FileFilter
    from watchfiles import watch

    class ChangeReload(ChangeReloadOriginal):
        """
        A custom Uvicorn reloader that actually only watches reload_dirs
        """

        def __init__(
            self,
            config: Config,
            target,
            sockets,
        ) -> None:
            super().__init__(config, target, sockets)
            self.reloader_name = "WatchFiles"
            self.reload_dirs = list(config.reload_dirs)

            self.watch_filter = FileFilter(config)
            self.watcher = watch(
                *self.reload_dirs,
                watch_filter=None,
                stop_event=self.should_exit,
                # using yield_on_timeout here mostly to make sure tests don't
                # hang forever, won't affect the class's behavior
                yield_on_timeout=True,
            )

    config = Config(app, **kwargs)
    server = Server(config=config)

    try:
        sock = config.bind_socket()
        ChangeReload(config, target=server.run, sockets=[sock]).run()
    except KeyboardInterrupt:
        pass  # pragma: full coverage
    finally:
        if config.uds and os.path.exists(config.uds):
            os.remove(config.uds)  # pragma: py-win32


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

    # Start uvicorn with reload
    reload = os.getenv("RELOAD", "true").lower()[:1] in "1yt"
    run = run_uvicorn_reload if reload else uvicorn.run
    run(
        "app.main:app",
        host="localhost",
        port=backend_port,
        log_level="debug" if reload else "info",
        reload=reload,
        reload_dirs=["app"],
        log_config=make_log_config(True),
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
        log_level="info",
        log_config=make_log_config(False),
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

    logger.info(f"Starting server in {'development' if is_dev else 'production'} mode")
    logger.info(f"DEV_PORT: {dev_port}, BACKEND_PORT: {backend_port}")

    if is_dev:
        run_development_server(dev_port, backend_port)
    else:
        run_production_server(backend_port)


if __name__ == "__main__":
    main()

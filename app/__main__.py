from pathlib import Path
import subprocess
import sys
import os
import signal
import uvicorn
import logging


logger = logging.getLogger(__name__)


def main():
    # Set default environment variables
    os.environ.setdefault("ENVIRONMENT", "development")
    os.environ.setdefault("ROOT_DIR", os.path.expanduser("$HOME/datasets"))
    os.environ.setdefault("RELOAD", "true")
    os.environ.setdefault("DEV_PORT", "1984")

    # Determine environment
    is_dev = os.getenv("ENVIRONMENT", "development").lower() == "development"

    if is_dev:
        # Check if npm dependencies are installed
        if not Path("node_modules").exists():
            logger.info("Installing frontend dependencies...")
            subprocess.run(["npm", "install", "--include=dev"], check=True)

        # Start the Vite dev server
        env = os.environ.copy()
        env["NODE_ENV"] = "development"
        frontend = subprocess.Popen(
            ["npm", "run", "dev"],
            env=env,
            # stdout=subprocess.PIPE,
            # stderr=subprocess.PIPE
        )

        def cleanup(signum, frame):
            logger.info("Shutting down development servers...")
            frontend.terminate()
            sys.exit(0)

        signal.signal(signal.SIGINT, cleanup)
        signal.signal(signal.SIGTERM, cleanup)

        # Start uvicorn with reload
        reload = os.getenv("RELOAD", "true").lower()[:1] in "1yt"
        uvicorn.run(
            "app.main:app",
            host="localhost",
            port=8000,
            log_level="debug" if reload else "info",
            reload=reload,
        )

        frontend.terminate()
    else:
        # Production mode - serve static files directly
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=int(os.getenv("PORT", "8000")),
            log_level="info",
            reload=False,
        )


if __name__ == "__main__":
    main()

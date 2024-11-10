# from .main import app
from .main import app
import os

if __name__ == '__main__':
    import uvicorn
    reload = os.getenv("RELOAD", "false").lower()[:1] in "1yt"
    uvicorn.run('app.main:app' if reload else app, log_level="trace", reload=reload)    

# from .main import app
from .main import app

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, log_level="trace")    
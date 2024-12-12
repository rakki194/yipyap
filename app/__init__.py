"""
yipyap backend package initialization.

This package provides the backend server implementation for yipyap, a web-based image
browser and caption management system. The backend is built with FastAPI and provides
a comprehensive API for browsing, viewing, and managing image datasets.

Key Components:
- FastAPI application with REST endpoints
- Image processing and thumbnail generation
- Caption generation with multiple ML models
- SQLite-based caching system
- File system operations
- Development/Production mode handling

The package is organized into several modules:
- main.py: FastAPI application and route handlers
- data_access.py: File system and cache operations
- caption_generation/: ML-based caption generators
- utils.py: Helper functions and utilities
- models.py: Pydantic data models
"""

# Image Browser

A Python-based web application for browsing image directories with caption support, built with FastAPI and HTMX.

## Features

- Directory browsing with breadcrumb navigation
- Image thumbnails with lazy loading
- Grid and list view modes
- Sorting by name, date, or size
- Real-time search filtering
- Image captions with auto-save
- Responsive design
- Security features (path traversal protection, rate limiting)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/image-browser.git
cd image-browser
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash

ROOT_DIR=$HOME/datasets RELOAD=true ./venv/bin/python -m app
ROOT_DIR=$HOME/datasets uvicorn app.main:app --reload --log-level=trace
```

The application will be available at `http://localhost:8000`

## Usage

1. Navigate to `http://localhost:8000` to start browsing the current working directory
2. Use the controls at the top to:
   - Search for files
   - Switch between grid and list views
   - Sort items by name, date, or size
3. Click on images to view them in full size and edit captions
4. Navigate directories using the breadcrumb trail or directory links

## Developer Documentation

### Project Structure

```
image-browser/
├── app/
│   ├── __init__.py      # Package initialization
│   ├── main.py          # FastAPI application and routes
│   ├── image_handler.py # Image processing and directory scanning
│   ├── caption_handler.py# Caption file management
│   └── utils.py         # Utility functions
├── static/
│   ├── css/
│   │   └── styles.css   # Application styles
│   └── thumbnails/      # Generated thumbnails
└── templates/           # Jinja2 templates
```

### Key Components

1. **FastAPI Routes** (main.py)
```python:app/main.py
startLine: 47
endLine: 84
```
Main route handling directory browsing with sorting and filtering.

2. **Directory Scanning** (image_handler.py)
```python:app/image_handler.py
startLine: 14
endLine: 58
```
Handles directory scanning with pagination, sorting, and filtering.

3. **Template Structure**
- Base template: Provides layout and common resources
- Gallery template: Directory listing with HTMX integration
- Image view template: Modal view for images and captions

### HTMX Integration

The application uses HTMX for dynamic updates:
1. Search filtering (500ms debounce)
2. View mode switching
3. Sorting
4. Caption auto-save

Example HTMX attribute usage:
```html:templates/gallery.html
startLine: 6
endLine: 14
```

### Security Features

1. Path Traversal Protection:
```python:app/utils.py
startLine: 18
endLine: 23
```

2. Rate Limiting:
```python:app/main.py
startLine: 100
endLine: 106
```

### Adding New Features

1. **New File Types**
- Add extensions to `ALLOWED_EXTENSIONS` in image_handler.py
- Create corresponding template partial
- Update CSS for new type

2. **New Sort Options**
- Add option to SortBy enum in main.py
- Update sort logic in scan_directory
- Add UI option in gallery.html

### Performance Considerations

- Thumbnails are generated once and cached
- Directory scanning is paginated
- Images use lazy loading
- Search has debounce delay
- HTMX requests target specific elements

## License

MIT License
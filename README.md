# yipyap

---

## Introduction

**Y**our **I**ntuitive **P**latform for **Y**ielding, **A**nnotating, and **P**rocessing or `yipyap` for short is a web application for uploading, browsing and managing image, audio and video dataset directories with caption support, generating and caching thumbnails, running various tagging and captioning models, editing dataset configuration and sample prompts, built with Rust and SolidJS.

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
git clone https://github.com/elias-gaeros/nyaa
cd nyaa
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
ROOT_DIR=$HOME/datasets uvicorn app.main:app --reload --log-level=trace
```

The application will be available at `http://localhost:8000`

## Usage

1. Navigate to `http://localhost:8000` to start browsing the current working directory.
2. Use the controls at the top to:
   - Search for files
   - Switch between grid and list views
   - Sort items by name, date, or size
3. Click on images to view them in full size and edit captions.
4. Navigate directories using the breadcrumb trail or directory links.

## Development

### Quick Start

1. Install Python dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Run the development server:

```bash
python -m app
```

This will:

- Install npm dependencies if needed
- Start the Vite dev server (port 5173)
- Start the FastAPI backend (port 8000)
- Open your browser to http://localhost:5173
- Enable hot reload for both frontend and backend

### Environment Variables

- `ENVIRONMENT`: Set to "development" or "production" (default: "development")
- `RELOAD`: Enable hot reload, "true" or "false" (default: "true" in development)
- `ROOT_DIR`: Root directory for images (default: current directory)
- `PORT`: Server port in production (default: 8000)

## Deployment

1. Build the frontend:

```bash
npm run build
```

2. Start the production server:

```bash
ENVIRONMENT=production ROOT_DIR=/path/to/images python -m app
```

## Developer Documentation

### Project Structure

```
nyaa/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application and routes
│   ├── image_handler.py     # Image processing and directory scanning
│   ├── caption_handler.py   # Caption file management
│   ├── utils.py             # Utility functions
├── src/
│   ├── components/          # SolidJS components
│   │   ├── Gallery/         # Gallery related components
│   │   └── ImageViewer/     # Image Viewer components
│   ├── contexts/            # SolidJS contexts
│   ├── resources/           # Frontend data resources
│   ├── utils/               # Utility functions
│   ├── pages/               # SolidJS pages
│   ├── styles.css           # Global CSS
│   ├── types.d.ts           # TypeScript declarations
├── static/
│   ├── css/
│   │   └── styles.css       # Application styles
│   └── thumbnails/          # Generated thumbnails
├── templates/               # Jinja2 templates
├── package.json             # Frontend dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── .vscode/
│   └── settings.json        # VSCode settings
├── .gitignore               # Git ignore rules
└── LICENSE.md               # License information
```

### Key Components

1. **FastAPI Routes** (main.py)

Main route handling directory browsing with sorting and filtering.

2. **Directory Scanning** (image_handler.py)

Handles directory scanning with pagination, sorting, and filtering.

3. **Template Structure**

- Base template: Provides layout and common resources
- Gallery template: Directory listing with HTMX integration
- Image view template: Modal view for images and captions

### Security Features

1. Path Traversal Protection
2. Rate Limiting

### URL Patterns Handled (main.py)

The following URL patterns are handled by the FastAPI application in `main.py`:

- **GET /api/browse**: Handles browsing of directories, including search, sorting, and pagination.

  - **Query Parameters**:
    - `path`: The current directory path to browse.
    - `page`: The current page number for pagination.
    - `sort`: The sorting criteria (name, date, size).
    - `search`: The search term for filtering items.
  - **Response Schema**:
    ```json
    {
      "items": [
        {
          "type": "image" | "directory",
          "name": "string",
          "path": "string",
          "thumbnail_path": "string",
          "size": "number",
          "modified": "string",
          "mime": "string",
          "width": "number",
          "height": "number",
          "aspect_ratio": "number",
          "thumbnail_width": "number",
          "thumbnail_height": "number"
        }
      ],
      "totalPages": "number"
    }
    ```

- **GET /thumbnail/{path:path}**: Serves cached thumbnails for images.

  - **Response**: Image file

- **GET /preview/{path:path}**: Serves preview-sized images.

  - **Response**: Image file

- **GET /download/{path:path}**: Allows downloading of the original image file.

  - **Response**: Image file download

- **PUT /caption/{path:path}**: Updates the caption for a specific image.
  - **Request Body**:
    ```json
    {
      "caption": "string"
    }
    ```
  - **Response Schema**:
    ```json
    {
      "status": "string"
    }
    ```

### Additional API Calls from Frontend

1. **Fetching Data for Gallery**:

   - The frontend makes a call to `/api/browse` to fetch items for the gallery based on the current path, page, sort criteria, and search term.

2. **Saving Captions**:
   - The frontend sends a PUT request to `/caption/{path}` to save the caption for an image when it is edited.

These additional endpoints and their functionalities are crucial for the frontend to operate correctly, allowing for dynamic browsing, searching, and caption management within the image browser application.

### Caching Mechanisms (data_access.py)

The application implements caching in `data_access.py` to improve performance and reduce redundant processing:

1. **Image Info Caching**:

   - Image information is cached in a SQLite database, including metadata such as size, dimensions, and thumbnail data.
   - If the image has not been modified since the last cache entry, the cached data is returned instead of reprocessing the image.

2. **Directory Caching**:

   - Directory listings are cached to avoid repeated scans of the filesystem.
   - Cached entries include basic file information and are updated only if the directory's last modified time changes.

3. **Thumbnail Caching**:
   - Thumbnails are generated and stored in the cache to serve requests quickly without regenerating them each time.

## License

This project is licensed under the MIT License. See the `LICENSE.md` file for details.

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [SolidJS](https://www.solidjs.com/)
- [Vite](https://vitejs.dev/)

## Getting Help

If you encounter any issues or have questions, feel free to open an issue on the GitHub repository.

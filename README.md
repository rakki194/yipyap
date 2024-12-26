# yipyap

---

## Introduction

**Y**our **I**ntuitive **P**latform for **Y**ielding, **A**nnotating, and **P**rocessing or `yipyap` for short is a web application for uploading, browsing and managing image, audio and video dataset directories with caption support, generating and caching thumbnails, running various tagging and captioning models, editing dataset configuration and sample prompts, built with Rust and SolidJS.

The frontend of yipyap is built with SolidJS, a reactive JavaScript framework that emphasizes fine-grained reactivity and performance, using Vite as the build tool for fast development and optimized production builds. The application follows a component-based architecture with a central app context managing global state. The main entry point is `/src/main.tsx`, which sets up the app context and error boundaries, while the routing configuration is defined in `/src/router.ts`. The core application state management resides in `/src/contexts/app.tsx`, which handles theme management, locale/translation management, settings persistence, notification system, and various feature flags and configurations.

Components are organized in feature-based directories under `/src/components`, with CSS modules or shared stylesheets for styling. Global styles are defined in `/src/styles.css`, while theme-specific styles are in `/src/themes.css`. All tests are centralized in the `/src/test/__tests__/` directory, organized by functionality including component tests, context tests, utility tests, and internationalization tests.

## Features

### Core Features
- Browse directories with breadcrumbs
- View images with thumbnails and captions
- Search and sort files easily
- Switch between grid and list views
- Secure file access and rate limiting

### Image Viewing
- Zoom and pan smoothly
- Navigate with minimap
- Support for multiple caption formats
- View and edit image metadata
- Keyboard shortcuts

### File Management
- Drag and drop files to upload
- Upload entire folders at once
- Track upload progress
- Perform batch operations
- Quick folder navigation

### Captions & Tags
- Add captions and tags
- Beautiful tag colors that match your theme
- Generate captions automatically
- Auto-save your changes
- Edit multiple files at once

### Customization
- Choose from multiple themes
- Customize animations and layout
- Set your own keyboard shortcuts
- Save your preferences

### Languages
- Available in multiple languages
- Right-to-left support
- Locale-aware formatting

## Installation

1. Clone the repository:

```bash
git clone https://github.com/elias-gaeros/yipyap
cd yipyap
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
yipyap/
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

## Backend Architecture

The backend is built with FastAPI and provides a comprehensive API for image management and caption generation. It uses a layered architecture with the following components:

### Core Components

1. **FastAPI Application** (`app/main.py`)
   - HTTP endpoint definitions
   - Request/response handling
   - Development/Production mode configuration
   - Static file serving
   - SPA support

2. **Data Access Layer** (`app/data_access.py`)
   - SQLite-based caching system
   - File system operations
   - Image processing and thumbnail generation
   - Caption file management

3. **Caption Generation** (`app/caption_generation/`)
   - Modular caption generator system
   - Support for multiple ML models
   - Async generation with error handling
   - Model configuration management

4. **Utility Layer** (`app/utils.py`)
   - Path resolution and validation
   - Security checks
   - Helper functions

### Key Features

1. **Efficient Directory Browsing**
   - Pagination support
   - Cache-aware responses
   - If-Modified-Since handling
   - Async directory scanning

2. **Image Processing**
   - Thumbnail generation (300x300)
   - Preview generation (1024x1024)
   - WebP format optimization
   - Color space management

3. **Caption Management**
   - Multiple caption formats (.caption, .txt, .tags)
   - Automatic caption generation
   - Caption priority ordering
   - Batch operations

4. **Security**
   - Path traversal protection
   - Development/Production mode isolation
   - Error handling and logging
   - Permission validation

5. **Caching System**
   - SQLite-based metadata cache
   - Thumbnail caching
   - Directory listing cache
   - Cache invalidation handling

## Test Organization

The testing system is centralized in the `/src/test/__tests__/` directory and organized by functionality:

1. Component Tests (e.g., `ImageView.test.tsx`, `TagBubble.test.tsx`)
2. Context and State Tests (e.g., `app.test.tsx`, `gallery.test.ts`)
3. Utility Tests (e.g., `reactive-utils.test.tsx`, `theme.test.ts`)
4. Internationalization Tests (e.g., `translations.test.ts`, language-specific plural tests)

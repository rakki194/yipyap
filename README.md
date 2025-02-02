# yipyap

---

## Introduction

---

**Y**our **I**ntuitive **P**latform for **Y**ielding, **A**nnotating, and **P**rocessing or `yipyap` for short is a web application for uploading, browsing and managing image, audio and video dataset directories with caption support, generating and caching thumbnails, running various tagging and captioning models, editing dataset configuration and sample prompts, built with Python and SolidJS.

The frontend of yipyap is built with SolidJS, a reactive JavaScript framework that emphasizes fine-grained reactivity and performance, using Vite as the build tool for fast development and optimized production builds. The application follows a component-based architecture with a central app context managing global state. The main entry point is `/src/main.tsx`, which sets up the app context and error boundaries, while the routing configuration is defined in `/src/router.ts`. The core application state management resides in `/src/contexts/app.tsx`, which handles theme management, locale/translation management, settings persistence, notification system, and various feature flags and configurations.

Components are organized in feature-based directories under `/src/components`, with CSS modules or shared stylesheets for styling. Global styles are defined in `/src/styles.css`, while theme-specific styles are in `/src/themes.css`. All tests are centralized in the `/src/test/__tests__/` directory, organized by functionality including component tests, context tests, utility tests, and internationalization tests.

## Table of Contents

---

- [yipyap](#yipyap)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Core Features](#core-features)
    - [Image Viewing](#image-viewing)
    - [File Management](#file-management)
    - [Captions \& Tags](#captions--tags)
    - [Customization](#customization)
    - [Languages](#languages)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Development](#development)
    - [Quick Start](#quick-start)
    - [Environment Variables](#environment-variables)
  - [Deployment](#deployment)
  - [Developer Documentation](#developer-documentation)
    - [Project Structure](#project-structure)
    - [Key Components](#key-components)
    - [Security Features](#security-features)
    - [URL Patterns Handled (main.py)](#url-patterns-handled-mainpy)
    - [Additional API Calls from Frontend](#additional-api-calls-from-frontend)
    - [Caching Mechanisms (data\_access.py)](#caching-mechanisms-data_accesspy)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)
  - [Getting Help](#getting-help)
  - [Backend Architecture](#backend-architecture)
    - [Core Components](#core-components)
    - [Key Features](#key-features)
  - [Test Organization](#test-organization)
  - [Docker Installation and Management Guide](#docker-installation-and-management-guide)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
    - [Managing the Docker Environment](#managing-the-docker-environment)
    - [Using GPU with Docker (Optional)](#using-gpu-with-docker-optional)
    - [Conclusion](#conclusion)

## Features

---

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

---

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

---

1. Navigate to `http://localhost:8000` to start browsing the current working directory.
2. Use the controls at the top to:
   - Search for files
   - Switch between grid and list views
   - Sort items by name, date, or size
3. Click on images to view them in full size and edit captions.
4. Navigate directories using the breadcrumb trail or directory links.

## Development

---

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
- Open your browser to <http://localhost:5173>
- Enable hot reload for both frontend and backend

### Environment Variables

- `ENVIRONMENT`: Set to "development" or "production" (default: "development")
- `RELOAD`: Enable hot reload, "true" or "false" (default: "true" in development)
- `ROOT_DIR`: Root directory for images (default: current directory)
- `PORT`: Server port in production (default: 8000)

## Deployment

---

1. Build the frontend:

    ```bash
    npm run build
    ```

2. Start the production server:

    ```bash
    ENVIRONMENT=production ROOT_DIR=/path/to/images python -m app
    ```

## Developer Documentation

---

### Project Structure

```bash
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

   - Main route handling directory browsing with sorting and filtering.

2. **Directory Scanning** (image_handler.py)

   - Handles directory scanning with pagination, sorting, and filtering.

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

---

This project is licensed under the MIT License. See the `LICENSE.md` file for details.

## Acknowledgements

---

- [FastAPI](https://fastapi.tiangolo.com/)
- [SolidJS](https://www.solidjs.com/)
- [Vite](https://vitejs.dev/)

## Getting Help

---

If you encounter any issues or have questions, feel free to open an issue on the GitHub repository.

## Backend Architecture

---

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

The directory browsing system provides efficient access to image collections through pagination support and cache-aware responses. It leverages If-Modified-Since handling and asynchronous directory scanning to optimize performance when browsing large datasets. The system intelligently manages directory listings to provide fast access while minimizing server load.

Image processing capabilities include automatic generation of thumbnails at 300x300 pixels and previews at 1024x1024 pixels, with WebP format optimization for reduced file sizes. The system handles color space management to ensure consistent image quality across different formats and display conditions. Security features protect against path traversal attacks while providing proper error handling and logging, with separate development and production modes for enhanced safety.

The caching and caption management systems work together to provide a robust media handling solution. Captions are supported in multiple formats including plain text `.caption`, `.txt`, and comma-separated `.tags` and `.wd` files, with automatic generation capabilities and priority-based ordering. The editor also supports `.e621` with a custom JSON editor. You are also able to edit the `sample-prompts.txt` for your dataset with a custom GUI and the configuration files with a `.toml`, `.yaml`, `.json` or even `.ini` files supported text editor. The SQLite-based metadata cache stores thumbnail references and directory listings, with intelligent cache invalidation to maintain data freshness. Batch operations are supported for efficient processing of multiple files, while the permission validation system ensures proper access control.

## Test Organization

---

The testing system is centralized in the `/src/test/__tests__/` directory and organized by functionality:

1. Component Tests (e.g., `ImageView.test.tsx`, `TagBubble.test.tsx`)
2. Context and State Tests (e.g., `app.test.tsx`, `gallery.test.ts`)
3. Utility Tests (e.g., `reactive-utils.test.tsx`, `theme.test.ts`)
4. Internationalization Tests (e.g., `translations.test.ts`, language-specific plural tests)

## Docker Installation and Management Guide

---

This guide explains how to install and manage yipyap using Docker. The yipyap project is containerized using a multi-stage Docker build, and the provided Docker Compose file simplifies the process of building and running the application.

### Prerequisites

Before you begin, ensure you have the following installed on your host system:

- Docker
- Docker Compose
- (Optional) NVIDIA Container Toolkit if you plan to use GPU acceleration. Refer to [NVIDIA's documentation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) for installation instructions.

### Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/elias-gaeros/yipyap.git
   cd yipyap
   ```

2. **Setting Environment Variables**

   The Docker Compose configuration uses a few environment variables:
   - `UID` and `GID`: Your host user and group IDs, used to create a non-root user inside the container.
   - `YIPYAP_DATA_DIR`: (Optional) The host directory where image data is stored. Defaults to `./data` if not set.
   - `ROOT_DIR`: This is automatically set inside the container to `/app/images`, which is where your image data is mounted.

   You can create a `.env` file in the project root to persist these variables. For example:

   ```env
   UID=1000
   GID=1000
   YIPYAP_DATA_DIR=/absolute/path/to/your/data
   ```

3. **Building and Running the Container**

   Use Docker Compose to build the image and start the container. The provided `docker-compose.yml` handles both the build and runtime configuration:

   ```bash
   docker-compose up --build -d
   ```

   This command builds the Docker image and starts the yipyap service in detached mode.

4. **Accessing the Application**

   Once the container is running, the application is served at [http://localhost:7000](http://localhost:7000).

### Managing the Docker Environment

- **Viewing Logs:**  
  To view logs for the yipyap container, run:

  ```bash
  docker-compose logs -f yipyap
  ```

- **Restarting the Container:**  
  After making changes to the application or configuration, you can restart the container:

  ```bash
  docker-compose restart yipyap
  ```

- **Stopping the Container:**

  ```bash
  docker-compose down
  ```

- **Accessing the Container Shell:**  
  To open a shell inside the running container:

  ```bash
  docker-compose exec yipyap sh
  ```

- **Updating Host Volume for Image Data:**  
  The Docker Compose file mounts the host directory specified by `YIPYAP_DATA_DIR` (defaulting to `./data`) to `/app/images` in the container. You can change the path by modifying the `YIPYAP_DATA_DIR` variable in your `.env` file or directly in the Compose file.

### Using GPU with Docker (Optional)

If your host system has a compatible NVIDIA GPU and you have the NVIDIA Container Toolkit installed, you can enable GPU support by modifying the Docker Compose file to include the following under the `yipyap` service:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - capabilities: [gpu]
ipc: host
ulimits:
  memlock: -1
  stack: 67108864
```

Then, start the container with GPU support:

```bash
docker-compose up --build -d
```

### Conclusion

This guide provides a step-by-step process for deploying and managing yipyap in a Docker environment. By using Docker Compose, you can easily manage the application's build process, environment variables, and container lifecycles. If you encounter any issues, please refer to the project documentation or open an issue in the repository.

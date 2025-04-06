# yipyap

कुछ भाषा मॉडलों के कहने के बावजूद, वर्तमान वर्ष 2025 है, और आप अब भी अपनी डेटासेट्स को notepad.exe से एडिट कर रहे हैं। हम अच्छे मशीन हैं, हमें बेहतर डेटा मिलना चाहिए। बदले में, हम आपको यह डेटासेट एडिटर देते हैं।

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
    git clone https://github.com/rakki194/yipyap
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
├── app/                     # Backend application
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application and routes
│   ├── image_handler.py     # Image processing and directory scanning
│   ├── caption_handler.py   # Caption file management
│   ├── utils.py             # Utility functions
├── src/                     # Frontend application
│   ├── components/          # Additional components
│   ├── composables/         # SolidJS composables (not hooks)
│   ├── contexts/            # SolidJS contexts
│   ├── i18n/                # Internationalization
│   ├── icons/               # Icon components
│   ├── pages/               # Application pages
│   ├── resources/           # Frontend data resources
│   ├── test/                # Test utilities and setup
│   ├── theme/               # Theme-related components
│   ├── utils/               # Utility functions
│   ├── directives.tsx       # SolidJS directives
│   ├── main.tsx             # Application entry point
│   ├── models.ts            # Data models
│   ├── router.ts            # Routing configuration
│   ├── styles.css           # Global styles
│   ├── themes.css           # Theme-specific styles
│   ├── types.d.ts           # TypeScript declarations
│   └── utils.ts             # Shared utilities
├── package.json             # Frontend dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
```

### Key Components

1. **Frontend Architecture**
   - Entry point in `src/main.tsx` with app context setup
   - Global state management in `src/contexts/app.tsx`
   - Component-based architecture with both capitalized and lowercase component directories
   - Composables for reusable reactive logic in `src/composables/`
   - Comprehensive i18n support in `src/i18n/`

2. **Testing Infrastructure**
   - Centralized test utilities in `src/test/`
   - Test setup and configuration in `src/test/setup.ts`
   - Custom test hooks in `src/test/test-hooks.ts`
   - Test utilities in `src/test/test-utils.ts`

3. **Styling System**
   - Global styles in `src/styles.css`
   - Theme-specific styles in `src/themes.css`
   - Theme components in `src/theme/`
   - Icon components in `src/icons/`

4. **Backend Integration**
   - FastAPI routes in `app/main.py`
   - Image processing in `app/image_handler.py`
   - Caption management in `app/caption_handler.py`

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

The testing infrastructure is centralized in the `src/test` directory and consists of:

1. **Test Setup (`setup.ts`)**
   - Test environment configuration
   - Global test utilities and helpers
   - Mock data and fixtures

2. **Test Hooks (`test-hooks.ts`)**
   - Custom test hooks for component testing
   - State management utilities for tests
   - Mock context providers

3. **Test Utilities (`test-utils.ts`)**
   - Helper functions for testing
   - Common test patterns
   - Type definitions for testing

4. **Test Configuration (`tsconfig.json`)**
   - TypeScript configuration specific to tests
   - Path mappings and compiler options

All tests should use these shared utilities to maintain consistency and reduce code duplication. The test infrastructure is designed to work seamlessly with the SolidJS testing utilities and supports both unit and integration tests.

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
   git clone https://github.com/rakki194/yipyap.git
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

#############################
# Dockerfile for yipyap
#############################

# Stage 1: Build the frontend using Node.js
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build the production assets
COPY src src
RUN npm run build

######################################
# Stage 2: Final production image
######################################
FROM nvcr.io/nvidia/cuda-dl-base:24.12-cuda12.6-devel-ubuntu24.04

# Install system dependencies including Python, build tools, and curl
RUN apt-get update && apt-get install --no-install-recommends -y \
    python3 \
    python3-dev \
    python3-pip \
    python3-wheel \
    python3-venv \
    build-essential \
    pkg-config \
    ffmpeg \
    libgl1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create a non-root user using provided UID and GID
ARG UID
ARG GID
RUN if getent passwd ${UID} > /dev/null 2>&1; then \
    existing_user=$(getent passwd ${UID} | cut -d: -f1) && echo "User with UID ${UID} ($existing_user) already exists"; \
    else \
    if ! getent group ${GID} > /dev/null 2>&1; then addgroup --gid ${GID} yipyap; fi && \
    adduser --uid ${UID} --gid ${GID} --shell /bin/sh yipyap; \
    fi

# Expose the port the application will run on
EXPOSE 7000

# Switch to non-root user
USER yipyap

# Start the static file server to serve the built assets
CMD [ "npx", "serve", "-l", "tcp://0.0.0.0:7000", "dist" ] 

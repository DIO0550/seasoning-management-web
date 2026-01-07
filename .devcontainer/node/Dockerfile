# Use Go 1.23 for building, then switch to Node.js for runtime
FROM golang:1.24-bullseye AS builder

# Build GitHub MCP Server
RUN git clone https://github.com/github/github-mcp-server.git /tmp/github-mcp-server \
    && cd /tmp/github-mcp-server \
    && go build -o github-mcp-server ./cmd/github-mcp-server


# Use Ubuntu as the base image
FROM ubuntu:24.04 

# Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=ja_JP.UTF-8
ENV LC_ALL=ja_JP.UTF-8

# Install dependencies and Node.js
ARG NODE_MAJOR=22
RUN apt-get update && \
    apt-get install -y curl vim nano tree sudo wget gnupg git locales fonts-noto-cjk && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - && \
    apt-get install -y nodejs build-essential && \
    locale-gen ja_JP.UTF-8 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


RUN npm config set ignore-scripts true

# Enable pnpm via Corepack and configure global settings
RUN corepack enable pnpm && \
    pnpm config set --global minimum-release-age 7200
    

# Install Aikido Safe Chain (supply chain security tool)
RUN curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh

# Copy the built MCP server binary
COPY --from=builder /tmp/github-mcp-server/github-mcp-server /usr/local/bin/

# Create a non-root user called 'node' with sudo privileges
RUN useradd -m -s /bin/bash node && \
    echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set the working directory
WORKDIR /home/node/app

# Switch to the non-root user
USER node

# [Optional] Uncomment if you want to install more global node packages
# RUN npm install -g <your-package-list-here>

# Expose the port the app runs on (if applicable, though usually handled by docker-compose)
# EXPOSE 3000

# Default command (if applicable, though usually handled by docker-compose or devcontainer.json)
# CMD [ "node", "your-app.js" ]

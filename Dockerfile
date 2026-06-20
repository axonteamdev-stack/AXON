# AXON Backend + AI Merged Service
# Single Koyeb deployment - Node.js + Python

FROM node:20-slim

# Install Python + build tools for torch
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv python3-pip gcc g++ libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ============================================
# PYTHON AI SERVICE
# ============================================
COPY AI/requirements.txt ./AI/
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r AI/requirements.txt

# Copy AI source code
COPY AI/src ./AI/src
COPY AI/scripts ./AI/scripts

# Copy AI data (model files, datasets)
COPY AI/data ./AI/data
COPY AI/external ./AI/external

# ============================================
# NODE.JS BACKEND
# ============================================
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend/src ./backend/src
COPY backend/app.js ./backend/
COPY backend/server.js ./backend/
COPY backend/jest.config.mjs ./backend/
COPY backend/postman ./backend/postman
COPY backend/tests ./backend/tests

# Create upload directories
RUN mkdir -p backend/uploads/{articles,certificates,labTests,personalPhoto,posts,radiology,.temp}

# Copy env template (user must set real values via Koyeb env vars)
COPY backend/.env.example ./backend/.env

# Expose backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Start AI in background, then Node backend
CMD sh -c '/opt/venv/bin/python -m uvicorn AI.src.api.main:app --host 0.0.0.0 --port 5001 & cd backend && node server.js'

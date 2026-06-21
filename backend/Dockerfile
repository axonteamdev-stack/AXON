FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv python3-pip gcc g++ libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python AI (lightweight)
COPY AI/requirements.txt ./AI/
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r AI/requirements.txt

COPY AI/src ./AI/src
COPY AI/data/drugbank ./AI/data/drugbank
COPY AI/data/twosides ./AI/data/twosides

# Node Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend/src ./backend/src
COPY backend/app.js ./backend/
COPY backend/server.js ./backend/
COPY backend/jest.config.mjs ./backend/

EXPOSE 3000

CMD sh -c '/opt/venv/bin/python -m uvicorn AI.src.api.main:app --host 0.0.0.0 --port 5001 & cd backend && node server.js'

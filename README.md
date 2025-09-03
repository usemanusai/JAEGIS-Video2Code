# VIDEO2CODE — Transform UI Mockup Videos into Production Code

[![CI](https://github.com/usemanusai/JAEGIS-Video2Code/actions/workflows/ci.yml/badge.svg)](https://github.com/usemanusai/JAEGIS-Video2Code/actions/workflows/ci.yml)

VIDEO2CODE converts UI mockup videos into production-ready React components, NestJS backend controllers, and OpenAPI specifications using AI vision models via OpenRouter. It orchestrates video frame extraction, AI analysis, code generation, and interactive refinement — all containerized and ready to run with a single command.

Status: Production Ready ✅ (All development phases complete; verified end‑to‑end including a sample video producing 393 frames)

- React 19.1.1, Vite 7.1.4, TypeScript 5.9.2
- Node.js 22.19.0, Express 5.1.0
- Python 3.13.7, Flask 3.1.2, OpenCV 4.12.0.88
- Docker Desktop + Docker Compose (latest stable)

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start (5 minutes)](#quick-start-5-minutes)
- [Architecture Overview](#architecture-overview)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Configuration Reference](#configuration-reference)
- [Troubleshooting](#troubleshooting)
- [Technology Stack Reference](#technology-stack-reference)
- [Project Structure](#project-structure)
- [Performance & Limitations](#performance--limitations)
- [Contributing & License](#contributing--license)

---

## Prerequisites
- Docker Desktop (with Docker Compose)
  - Download: https://www.docker.com/products/docker-desktop/
- Git (for cloning)
  - Download: https://git-scm.com/downloads
- Optional local runtimes (not required when using Docker):
  - Node.js 22+ (https://nodejs.org/en)
  - Python 3.13+ (https://www.python.org/downloads/)
- OpenRouter (optional; app runs in mock mode without keys)
  - Sign up: https://openrouter.ai/
- System requirements: 16GB RAM minimum, ~5GB free disk space, modern multi‑core CPU

---

## Quick Start (5 minutes)

1) Clone and enter the repo

```bash
git clone <repository-url> && cd VIDEO2CODE
```

2) Create .env (keys optional; mock mode is automatic if omitted)

```bash
# .env
OPENROUTER_API_KEYS=your-key-here,optional-second-key
OPENROUTER_MODEL=openai/gpt-oss-120b:free
```

3) Start all services (first build may take a few minutes)

```bash
docker compose up -d --build
```

4) Verify services

```bash
# AI Gateway
curl -s http://localhost:8080/health
# -> {"ok":true}

# Video Processor
curl -s http://localhost:5000/health
# -> {"ok": true}
```

5) Open the app
- Frontend: http://localhost:5173
- AI Gateway: http://localhost:8080
- Video Processor: http://localhost:5000

6) Try the full workflow
- Upload a UI mockup video (MP4/H.264 recommended)
- Navigate to the Workspace tab to see generated React/NestJS/OpenAPI
- Use the Chat refinement panel to iteratively modify code
- Copy or Download generated files with one click

Example (Windows, tested):

```bash
# Upload file through AI Gateway proxy (multipart/form-data)
# Replace with a real local MP4 path you have on disk
curl -v -F "file=@C:\\path\\to\\your\\video.mp4;type=video/mp4" \
  http://localhost:8080/proxy/process
# Example response (verified):
# {"frameCount":393,"framesDir":"/data/frames","message":"Processing complete"}

# Get generated artifacts
curl -s http://localhost:8080/results | jq .
```

---

## Architecture Overview

High‑level data flow:

```mermaid
flowchart LR
  A[Browser] --> B[Frontend (React + Vite)]
  B --> C[AI Gateway (Express)]
  C --> D[Video Processor (Flask + OpenCV)]
  C --> E[(OpenRouter API)]
  D <--> V[(Docker Volume /data)]
```

- Frontend (React + Vite)
  - User upload UI, Workspace to view artifacts, Chat to refine code
- AI Gateway (Express)
  - Orchestrates: forwards upload to video-processor, reads frames, prompts LLM, generates artifacts, refines code
- Video Processor (Flask + OpenCV)
  - Extracts frames from uploaded videos (default 1 FPS) to /data/frames
- Shared Volume
  - /data/uploads: temporary uploaded videos
  - /data/frames: extracted frames for analysis

Detailed flow: Upload video → Frames extracted → Gateway analyzes via OpenRouter (or mock mode) → Generates React/NestJS/OpenAPI → Frontend shows artifacts → Chat prompts refine specific artifact → Updated code returned and displayed

---

## API Documentation

All endpoints below are served by the AI Gateway unless otherwise noted.

### POST /proxy/process
- Purpose: Upload a video for processing (frame extraction)
- Content-Type: multipart/form-data (field: `file`)
- Response: `{ frameCount: number, framesDir: string, message: string }`

Example (Windows path):

```bash
curl -v -F "file=@C:\\Users\\Lenovo ThinkPad T480\\Desktop\\VIDEO2CODE\\test-data\\WORKFLOW-OF-EXPORTING-GEMINI-CHATS.mp4;type=video/mp4" \
  http://localhost:8080/proxy/process
```

### GET /results
- Purpose: Retrieve generated artifacts (after processing)
- Response:
  ```json
  {
    "analysis": { "ui": [], "actions": [], "llmSummary": "..." },
    "reactCode": "...",
    "openapi": "openapi: 3.0.0...",
    "backend": "... NestJS controller ..."
  }
  ```

Example (actual excerpt):

```json
{
  "analysis": {
    "ui": [],
    "actions": [],
    "llmSummary": "/* mock: no OPENROUTER_API_KEYS set */"
  },
  "reactCode": "import React from 'react'\n\nexport default function GeneratedScreen(){\n  return (\n    <div style={{padding:16}}>\n      <h2>Generated UI</h2>\n      <p>LLM summary:</p>\n      <pre>/* mock: no OPENROUTER_API_KEYS set */</pre>\n      <button>Primary</button>\n      <input placeholder=\"Type here\" />\n    </div>\n  )\n}",
  "openapi": "openapi: 3.0.0\ninfo:\n  title: VIDEO2CODE Generated API\n  version: 0.0.1\npaths:\n  /refine:\n    post:\n      summary: Refine code with LLM...",
  "backend": "import { Controller, Post, Body } from '@nestjs/common'..."
}
```

### POST /refine
- Purpose: AI‑powered code refinement
- Request:
  ```json
  { "artifact": "frontend"|"backend"|"api", "code": "string", "prompt": "string" }
  ```
- Response:
  ```json
  { "updatedCode": "string" }
  ```

Portable curl example using a JSON file (cross‑platform safe):

```bash
# payload.json
# {"artifact":"frontend","code":"export default function A(){return <button>Old</button>}","prompt":"Change button text to New"}

curl -s -H "Content-Type: application/json" --data-binary @payload.json \
  http://localhost:8080/refine | jq .
```

---

## Development Workflow

Tests
```bash
# Python unit tests (video-processor)
docker compose run --rm video-processor pytest -q

# Node unit tests (ai-gateway)
docker compose run --rm ai-gateway npm test

### Integration Test

Run a fully self-contained end-to-end test (upload → frame extraction → results) with:

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm test-runner
```

Why this is reliable:
- Generates a tiny 1-second MP4 via ffmpeg inside the test container
- No dependency on external URLs or local test files
- Works in mock mode (no OPENROUTER_API_KEYS required)

Expected output:
- Integration workflow passed



Lint/Format
```bash
# Frontend
docker compose run --rm frontend npm run lint
docker compose run --rm frontend npm run format

# AI Gateway
docker compose run --rm ai-gateway npm run lint

# Python formatting (video-processor)
docker compose run --rm video-processor black .
```

Rebuild/run specific service
```bash
docker compose up -d --build <service-name>
```

Debugging
```bash
docker compose logs -f <service-name>
docker compose exec <service-name> /bin/sh
```

Hot reload
- Frontend and AI Gateway support hot reload during development (containerized builds use latest sources baked into the image).

---

## Configuration Reference

- OPENROUTER_API_KEYS
  - CSV of API keys for automatic rotation (e.g., `key1,key2,key3`).
  - If unset/empty: mock mode is used; artifacts and refine still function with placeholder summaries.
- OPENROUTER_MODEL
  - Default: `qwen/qwen2.5-vl-32b-instruct:free` (fast, free-tier vision);
  - Alternatives: `google/gemma-3-27b-it:free`, `meta-llama/llama-3.2-11b-vision-instruct:free`, `mistralai/mistral-small-3.1-24b-instruct:free`, `qwen/qwen2.5-vl-72b-instruct:free`.
- VITE_API_BASE
  - Frontend API base URL for local dev. Default: `http://localhost:8080` (already set via docker-compose).

Mock mode behavior
- When no keys are provided, AI responses are mocked safely. This enables full local development and demos without external calls.

Free‑tier recommendations
- Prefer OpenRouter free vision models for low-cost development (e.g., qwen/qwen2.5-vl-32b-instruct:free, google/gemma-3-27b-it:free, meta-llama/llama-3.2-11b-vision-instruct:free, mistralai/mistral-small-3.1-24b-instruct:free).


### OpenRouter free vision models (ready-to-use)
The following free vision-capable models are available via OpenRouter and work well with VIDEO2CODE. Set OPENROUTER_MODEL to any of these values in your .env to use them:

- google/gemma-3-4b-it:free
- google/gemma-3-12b-it:free
- google/gemma-3-27b-it:free
- meta-llama/llama-3.2-11b-vision-instruct:free
- mistralai/mistral-small-3.1-24b-instruct:free
- moonshotai/kimi-vl-a3b-thinking:free
- qwen/qwen2.5-vl-32b-instruct:free
- qwen/qwen2.5-vl-72b-instruct:free

Example:
```bash
# .env
OPENROUTER_API_KEYS=your-key-here
OPENROUTER_MODEL=qwen/qwen2.5-vl-32b-instruct:free
```

Note: Model names and availability are managed by OpenRouter and may evolve; see https://openrouter.ai/ for the latest listings.

---

## Troubleshooting

### Anti-Port Conflict System

VIDEO2CODE includes automated port conflict detection and resolution:

**Automatic preflight checks:**
```bash
# Frontend (checks ports and suggests alternatives)
cd frontend && npm run dev:safe

# AI Gateway (PowerShell-based check)
cd ai-gateway && npm run dev:safe
```

**Manual preflight:**
```bash
# Unix/macOS/Linux
bash scripts/dev-preflight.sh

# Windows PowerShell
pwsh scripts/dev-preflight.ps1
```

If conflicts are detected, the scripts will:
- Identify which processes are using ports 5173, 8080, 5000
- Show PIDs and suggest kill commands
- Generate `docker-compose.override.local.yml` with alternative port mappings
- Provide the exact command to run with the override

**Example output:**
```
Detected port conflicts:
- 8080 (ai-gateway) is busy by PID 1234

Created docker-compose.override.local.yml with suggested mappings:
- frontend: 5173 -> 5173
- ai-gateway: 8081 -> 8080
- video-processor: 5000 -> 5000

Next steps:
docker compose -f docker-compose.yml -f docker-compose.override.local.yml up -d --build
```

### Other Common Issues

- Upload failures
  - Ensure MP4 (H.264) format; confirm multipart/form-data with field name `file`
  - Large files: try a shorter clip; default practical limit ~500MB (adjust in proxy/service if needed)
- Service startup issues
  - Inspect logs: `docker compose logs -f ai-gateway` (or other service)
  - Rebuild: `docker compose up -d --build`
- Memory issues
  - Increase Docker memory in Docker Desktop settings; monitor with `docker stats`
- Volume permissions
  - On Linux/macOS ensure Docker Desktop/File Sharing allows the project directory
- Network connectivity (OpenRouter)
  - `curl https://openrouter.ai/` from inside the gateway container if diagnosing outbound access

---

## Technology Stack Reference

```markdown
| Component       | Technology | Version  | Purpose                                  |
|-----------------|------------|----------|------------------------------------------|
| Frontend        | React      | 19.1.1   | User interface and interactions          |
| Frontend        | Vite       | 7.1.4    | Build tool and dev server                |
| Frontend        | TypeScript | 5.9.2    | Type safety and developer experience     |
| AI Gateway      | Node.js    | 22.19.0  | JavaScript runtime                       |
| AI Gateway      | Express    | 5.1.0    | Web framework and API routing            |
| Video Processor | Python     | 3.13.7   | Python runtime                           |
| Video Processor | Flask      | 3.1.2    | Web framework and API endpoints          |
| Video Processor | OpenCV     | 4.12.0.88| Video processing and frame extraction    |
| Infrastructure  | Docker     | Latest   | Containerization and orchestration       |
```

---

## Project Structure

```
VIDEO2CODE/
├── frontend/          # React + Vite application (UI components, routing, API calls)
├── ai-gateway/        # Express API orchestrator (LLM integration, code generation)
├── video-processor/   # Flask + OpenCV service (video processing, frame extraction)
├── docker-compose.yml # Service orchestration and networking
├── .env               # Environment configuration (API keys, model settings)
├── .env.example       # Environment template with placeholder values
└── README.md          # This comprehensive setup guide
```

---

## Performance & Limitations
- Frame extraction: default 1 FPS (configurable in code/api), ~1–2s per minute of video on a modern CPU
- Memory usage: ~2–4GB across services during normal operation
- Supported formats: MP4 (H.264 recommended); others may work but are untested
- Maximum tested file size: ~500MB (larger may require config changes)
- Concurrency: Single upload at a time (no queueing yet)

---

## Contributing & License

Contributions welcome! Please:
- Keep code formatted (ESLint/Prettier for Node, Black for Python)
- Ensure tests pass:
  - `docker compose run --rm video-processor pytest -q`
  - `docker compose run --rm ai-gateway npm test`
- Open a PR with a clear description and screenshots where relevant

License: TBD (add your project license here)


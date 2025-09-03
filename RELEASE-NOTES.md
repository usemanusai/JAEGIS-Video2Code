# VIDEO2CODE v1.0.0 Release Notes

Date: 2025-09-03

## Highlights
- End-to-end workflow: MP4 upload → OpenCV frame extraction → OpenRouter analysis → React/OpenAPI/NestJS generation → ZIP download
- Robust error handling across all layers with clear, structured responses
- Docker Compose one-command deployment; mock mode works without OpenRouter keys

## Major Features
- Frontend (React + Vite)
  - Upload page with validation (MP4, size), progress, and retries
  - Workspace displays generated artifacts with tabs and download all
  - Results page loading state and retry support
- AI Gateway (Node + Express)
  - Upload proxy to video-processor with size limits and 413 responses
  - Frame sampling (MAX_ANALYSIS_FRAMES) and LLM analysis timeout (LLM_TIMEOUT_MS)
  - Structured error responses (400/413/415/502/504) and partial results for resilience
  - Artifact generation (React, OpenAPI, NestJS) and /download.zip bundler
- Video Processor (Python + Flask)
  - Secure upload handling, OpenCV frame extraction, robust error mapping
  - Health check and clear JSON outcomes

## Known Limitations
- Single upload at a time (no concurrency control/queueing)
- Only MP4 (H.264) officially supported; others untested
- Free-tier LLMs may return variable quality; model tuning recommended

## Breaking Changes
- None at this time (0.x → 1.0.0). Public APIs are new and subject to change in 1.x.

## Environment Variables
- OPENROUTER_API_KEYS: CSV of OpenRouter API keys; empty → mock mode
- OPENROUTER_MODEL: Model name (default qwen/qwen2.5-vl-32b-instruct:free)
- MAX_UPLOAD_MB: Max upload size in MB (default 100)
- VIDEO_PROCESSOR_TIMEOUT_MS: Upload→processing timeout (default 180000)
- LLM_TIMEOUT_MS: LLM analysis timeout (default 20000)
- MAX_ANALYSIS_FRAMES: Max frames used in analysis (default 12)

## Deployment
- See README.md for complete Docker Compose instructions and troubleshooting

## Upgrade/Migration
- No special migration steps. For 0.x users, copy your .env to the new version and rebuild images.


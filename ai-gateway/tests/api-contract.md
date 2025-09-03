# Internal API Contracts (AI Gateway)

## POST /proxy/process
- Purpose: Video upload for frame extraction
- Request: multipart/form-data
  - field `file`: video/mp4 binary
- Response 200 JSON:
  - `frameCount` (number): Extracted frames
  - `framesDir` (string): Absolute directory inside container (e.g., /data/frames)
  - `message` (string): Status message

## GET /results
- Purpose: Retrieve generated artifacts after processing
- Response 200 JSON:
  - `analysis` (object):
    - `ui` (array): Parsed UI screens
    - `actions` (array): Parsed actions
    - `llmSummary` (string): Raw LLM summary
  - `reactCode` (string): React component code
  - `openapi` (string): OpenAPI 3.0 YAML
  - `backend` (string): NestJS controller example

## POST /refine
- Purpose: AI‑assisted code refinement
- Request application/json:
  - `artifact` ("frontend"|"backend"|"api")
  - `code` (string)
  - `prompt` (string)
- Response 200 JSON:
  - `updatedCode` (string)


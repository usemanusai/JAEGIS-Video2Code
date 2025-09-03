# Mockup Video to Code - Technical Architecture Document

## Document Information

- Version: 1.0
- Date: {Current Date}
- Status: Final
- Prepared for: Development Team Handoff

## Executive Summary

### Architecture Overview

This document outlines the technical architecture for the "Mockup Video to Code" application. The system is designed as a containerized, multi-service application orchestrated via docker-compose. It follows a microservices pattern to separate concerns between the user-facing web interface, video processing, and AI-driven code generation. This approach ensures modularity and adheres to the strict requirements of running on low-specification hardware with a free-tier operational cost model.

### Key Design Principles

- Separation of Concerns: Each service (frontend, video processing, AI interaction) has a single, well-defined responsibility.
- Lightweight Services: Each component is built using technologies chosen for their low memory footprint and fast startup times.
- Asynchronous Processing: Video analysis and code generation are handled asynchronously to provide a non-blocking user experience.
- Stateless Services: Backend services are designed to be stateless where possible to simplify scaling and deployment within Docker.

## System Overview

### High-Level Architecture

The system is composed of three primary services running in separate Docker containers: a Frontend Service (React), a Video Processing Service (Python), and an AI Gateway Service (Node.js). The user interacts with the Frontend, which communicates with the other services via a shared volume and direct API calls.

Code snippet

graph TD
    subgraph User Browser
        A[Frontend UI - React]
    end

    subgraph Docker Environment
        A -- Uploads Video --> B[Video Processor - Python/OpenCV]
        B -- Writes Frames --> V[Shared Volume]
        C[AI Gateway - Node.js] -- Reads Frames --> V
        C -- Calls --> D[External LLM API - OpenRouter.ai]
        A -- Sends Refinement Prompts --> C
        C -- Returns Generated Code --> A
    end

    style V fill:#f9f,stroke:#333,stroke-width:2px

### System Context

The application is a self-contained, personal developer tool. All components run locally on the user's machine via Docker. The only external dependency is the internet connection required to access the OpenRouter.ai API for LLM-based analysis and code generation.

## Technology Stack

### Core Technologies

| Component | Technology | Version | Justification |
| :---- | :---- | :---- | :---- |
| Frontend Framework | React (with Vite) | 19.x | A popular, lightweight framework for building the user interface. Vite provides a fast development experience. |
| Video Processing | Python | 3.13 | The ideal choice for scientific and media processing tasks, with excellent libraries like OpenCV. |
| Video Library | OpenCV | 4.x | The industry standard for computer vision and frame extraction, offering high performance. |
| AI Gateway Service | Node.js (with Express) | 22.x | Excellent for I/O-bound tasks like managing API requests to the external LLM. It's lightweight and fast. |
| Containerization | Docker & Docker Compose | Latest | Meets the core requirement (NFR2) for a portable, easily managed, multi-service application setup. |

### Development Tools

- IDE: VS Code is recommended.
- Version Control: Git.
- Package Management: npm (for Frontend/AI Gateway), pip (for Video Processor).
- Testing Frameworks: Jest (for Frontend/AI Gateway), PyTest (for Video Processor).

## Component Architecture

### System Components

#### Frontend Service (React)

- Responsibilities: Provides the web UI for video upload and the interactive workspace for viewing and refining generated code. Manages client-side state.
- Key Modules:
  - UploadComponent: Handles file selection and upload.
  - WorkspaceComponent: Contains the tabbed code viewers and the chat interface.
  - apiClient: A module for making HTTP requests to the AI Gateway service.

#### Video Processing Service (Python)

- Responsibilities: Accepts video files, extracts frames using OpenCV, and saves them to a shared volume accessible by the AI Gateway.
- Key Modules:
  - api.py: A simple web server (e.g., Flask) with an endpoint to receive video files.
  - processor.py: The core logic that uses OpenCV to perform frame extraction.

#### AI Gateway Service (Node.js)

- Responsibilities:
  1. Reads frames from the shared volume.
  2. Constructs prompts and sends frames to the external vision LLM.
  3. Receives UI/action definitions from the LLM and generates code artifacts.
  4. Exposes an endpoint for the frontend to submit refinement prompts and returns updated code.
- Key Modules:
  - OrchestratorService: Manages the overall flow from frame analysis to code generation.
  - OpenRouterClient: Handles all communication with the OpenRouter.ai API, including key rotation.
  - CodeGenerator: Contains the logic and prompts for generating React, NestJS, and OpenAPI files.
  - ChatController: Exposes the API endpoint for the interactive chat.

### Component Interactions

Code snippet

sequenceDiagram
    participant U as User
    participant FE as Frontend Service
    participant VP as Video Processor
    participant AIG as AI Gateway

    U->>FE: Upload video.mp4
    FE->>VP: POST /process-video with video file
    VP->>VP: Extract frames (frame_01.jpg, ...)
    VP->>SharedVolume: Save frames
    AIG->>SharedVolume: Read frames
    AIG->>OpenRouter.ai: Analyze frames & generate code
    AIG->>FE: Return initial code artifacts
    FE->>U: Display code in Workspace
    U->>FE: Type chat message: "Make button blue"
    FE->>AIG: POST /refine-code with current code & prompt
    AIG->>OpenRouter.ai: Send refinement prompt
    AIG->>FE: Return updated code
    FE->>U: Update code viewer

## Data Architecture

### Data Flow

The system does not use a traditional database. Data persistence is managed through the file system within the Docker environment.

- Temporary Data: Uploaded videos and extracted frames are stored temporarily on a shared Docker volume. This volume is mounted by the Video Processor and AI Gateway services.
- Generated Data: The final generated code (React, NestJS, OpenAPI spec) is held in the AI Gateway's memory and sent to the frontend. The user can then download these artifacts to their local machine.

### Data Storage Strategy

- Shared Volume: A Docker volume named processing_data will be used for inter-service communication of media files.
- Local Storage: Final code output is saved directly to the user's host machine via the browser's download functionality.

## API Design

### Internal APIs

#### Video Processor API

- POST /process
  - Request: multipart/form-data containing the video file.
  - Response: 200 OK with JSON { "message": "Processing started", "frameCount": 30 }.
  - Action: Kicks off the asynchronous frame extraction process.

#### AI Gateway API

- GET /results
  - Request: None.
  - Response: 200 OK with JSON containing the generated code artifacts.
- POST /refine
  - Request: JSON body { "artifact": "frontend" | "backend", "code": "...", "prompt": "..." }.
  - Response: 200 OK with JSON { "updatedCode": "..." }.

### External APIs

- OpenRouter.ai API: The AI Gateway will interact with the OpenRouter.ai API to access various vision and language models. The specific model endpoints will be configured within the AI Gateway. An API key rotation system will be implemented to stay within free-tier limits.

## Infrastructure and Deployment

### Hosting Strategy

The application is designed to run locally on the user's machine using Docker. No cloud hosting is required.

### Environment Configuration

Configuration is managed via a .env file at the root of the project, which is used by docker-compose.yml to inject environment variables into the services. The primary variable will be OPENROUTER_API_KEYS, a comma-separated list of keys for the AI Gateway to use.

### CI/CD Pipeline

A simple CI/CD pipeline is not a core requirement for this personal tool, but a GitHub Actions workflow can be set up for linting and running tests on push to maintain code quality.

## Performance Considerations

### Performance Requirements

The primary performance constraint is the ability to run on a laptop with 16GB of RAM. The system should remain responsive during video processing.

### Optimization Strategies

- Asynchronous Processing: The initial, heavy video processing and AI generation are done asynchronously so the user is not blocked.
- Lightweight Base Images: Docker images will be built on slim base images (e.g., python:3.11-slim, node:20-alpine) to minimize size and memory footprint.
- Efficient Frame Extraction: The frame extraction rate will be configurable to balance detail with processing time.

## Development Guidelines

### Coding Standards

- Frontend: Standard React/TypeScript best practices, enforced by ESLint and Prettier.
- Backend (Python): PEP 8 standards, enforced by Black and Flake8.
- Backend (Node.js): Standard TypeScript best practices, enforced by ESLint and Prettier.

### Testing Strategy

- Unit Testing: Core logic in each service will be unit-tested (e.g., Python processing functions, Node.js code generation helpers).
- Integration Testing: API endpoints will be tested to ensure services can communicate correctly within the Docker environment.

---

This architecture provides a complete technical plan.


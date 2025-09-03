# Mockup Video to Code - Product Requirements Document

## Goals and Background Context

### Goals

- Automate UI/UX to Code Conversion: Automatically generate production-ready frontend code, backend scaffolds, and API specifications from a single screen recording of a UI flow.
- Accelerate MVP Development: Drastically reduce the manual effort and time required to turn UI mockups (Figma, screen recordings) into functional applications.
- Improve Designer-Developer Handoff: Create a seamless, automated handoff process that minimizes ambiguity and ensures the final product matches the design intent.
- Enable Rapid Prototyping: Allow developers and designers to quickly test and validate application ideas by generating functional prototypes directly from visual concepts.
- Support Multiple Technologies: Generate code for a variety of popular frontend (React, Flutter) and backend (NestJS, Express, Django) frameworks.
- Interactive Code Refinement: Allow for iterative, conversational refinement of the generated code using a chat interface.

### Background Context

Currently, converting UI mockups from design tools like Figma or simple screen recordings into functional code is a time-consuming and manual process for developers. This workflow often involves developers meticulously recreating UI components, defining API contracts, and scaffolding backend logic based on visual specifications, which can lead to inconsistencies and slow down the development lifecycle.

This project aims to solve that problem by creating an AI-powered pipeline that ingests a screen recording of an app's UI flow and automatically generates the corresponding frontend code, backend stubs, and API specifications. By leveraging computer vision to analyze frames and large language models to interpret UI components, user actions, and conversational feedback, this tool will bridge the gap between design and development, enabling a faster and more interactive way to build applications.

## Requirements

### Functional

- FR1: The system must accept a screen recording (e.g., .mp4 format) of a user interface flow as its primary input.
- FR2: The system must be able to process the video to extract individual frames at a configurable rate (e.g., 1 frame per second).
- FR3: Using a vision-enabled Large Language Model (LLM), the system must analyze the extracted frames to identify UI components (buttons, inputs, forms), their properties, and the user actions being performed.
- FR4: The system shall generate an OpenAPI specification based on inferred user actions that imply backend interaction (e.g., a form submission generating a POST /api/login endpoint).
- FR5: The system must generate frontend UI code (initially for React) that corresponds to the components and layout identified in the frames.
- FR6: The system must generate backend code scaffolds (initially for NestJS) for the API endpoints defined in the OpenAPI specification.
- FR7: The system must incorporate a mechanism to handle inconsistencies in the source video, such as jittery movement or minor UI changes between frames, to produce a stable and coherent output.
- FR8: The system must include safeguards or validation steps to mitigate and flag potential LLM hallucinations in the final generated code and specifications.
- FR9: The system shall support alternative inputs to video, such as Figma animations, for generating the application code.
- FR10: The system should be able to process voice instructions within the recording to provide additional context or guidance for the AI generation process.
- FR11: The system must provide a chat interface on the results screen where the user can type natural language suggestions (e.g., "change the button color to blue," "add a loading state") to modify the generated outputs.

### Non-Functional

- NFR1: The entire system must be free to operate, potentially by implementing a system to rotate free-tier API keys for services like OpenRouter and exclusively using free models.
- NFR2: The application must be fully containerized using Docker for portability and ease of setup.
- NFR3: The system must be designed to run on low-specification hardware, with a target of being fully functional on a typical older laptop with 16GB of RAM.
- NFR4: The chat interface's suggestion-processing functionality must be powered by the system's OpenRouter.ai integration, utilizing free models for analysis and code modification.

## User Interface Design Goals

### Overall UX Vision

The user experience should be clean, minimalist, and highly utilitarian. The primary focus is on an interactive co-pilot experience, guiding you from initial video upload to a refined, downloadable codebase through a combination of automated generation and conversational feedback.

### Key Interaction Paradigms

- Interactive Generation Flow: A two-stage process: 1. Upload & Generate -> 2. Review & Refine.
- Conversational Refinement: A core interaction will be a chat interface allowing you to provide natural language feedback to iteratively modify the generated code and specifications.
- Drag-and-Drop: An intuitive drag-and-drop area for video file uploads.
- Real-time Feedback: Clear, real-time feedback during the initial processing phase.
- Tabbed Results: The generated outputs will be organized into clean, easily navigable tabs.

### Core Screens and Views

1. Upload Screen: A single-purpose screen dominated by the file upload component.
2. Workspace Screen: A multi-panel view that serves as the main interactive area. This screen will feature:
   - Code Viewers: Tabbed viewers for the generated Frontend Code, Backend Code, and API Spec.
   - Chat Panel: A persistent chat interface where you can type suggestions to modify the code in the viewers.

### Accessibility

- We will aim for standard accessibility practices (e.g., WCAG 2.1 Level AA) to ensure the tool is easy to use, which is a good habit even for personal projects.

### Branding

- Not required for this personal project. A simple, clean, dark-themed "developer tool" aesthetic will be used.

### Target Device and Platforms

- Web Responsive (Desktop First): The primary platform will be a web application designed for desktop browsers to align with your development workflow.

## Technical Assumptions

### Repository Structure

- Monorepo: A single repository will be used to manage the frontend, backend, and any shared code or libraries.

### Service Architecture

- Serverless Functions & Frontend Host: The architecture will consist of a frontend web application hosted on a static hosting service, which communicates with a set of backend serverless functions for processing. This aligns with the goals of low hardware requirements and cost-effectiveness.

### Testing requirements

- Unit & Integration Tests: The project will include unit tests for core logic and integration tests for API endpoints to ensure reliability. Manual testing will be sufficient for the UI given its simplicity and personal use case.

### Additional Technical Assumptions and Requests

- Video Processing: Python with OpenCV will be used for frame extraction from the input video.
- AI Integration: The system will integrate with vision-enabled LLMs via an API key management system (like OpenRouter.ai) to ensure free usage.
- Containerization: The entire application will be containerized via a Dockerfile and docker-compose.yml for easy setup and execution.

## Epics

### Epic 1: Core Application Setup & Video Processing

This epic establishes the foundational structure of the application, including the Docker setup, the frontend UI for uploading files, and the backend logic for processing the video into frames.

#### Story 1.1: Initial Project & Docker Scaffolding

As a user, I want a containerized application setup, so that I can easily build and run the entire project with a single command.

##### Acceptance Criteria

1. A Dockerfile is created to define the application environment.
2. A docker-compose.yml is configured to orchestrate the frontend and backend services.
3. The project structure is initialized with placeholders for frontend and backend code.
4. The application can be started successfully using docker-compose up.

#### Story 1.2: Implement Frontend Upload UI

As a user, I want a simple web interface with a drag-and-drop zone, so that I can upload a screen recording video.

##### Acceptance Criteria

1. A React application is created for the frontend.
2. The UI displays a clear area for file uploads.
3. The component accepts .mp4 files via drag-and-drop or a file selection button.
4. Upon file selection, the frontend sends the video file to a backend processing endpoint.

#### Story 1.3: Implement Backend Video Processing Endpoint

As a user, I want the backend to receive my uploaded video and extract frames from it, so that they can be analyzed.

##### Acceptance Criteria

1. A backend service (e.g., Python/Flask or Node.js/Express) is created.
2. An API endpoint is available to accept multipart/form-data video uploads.
3. The backend saves the uploaded video to a temporary location.
4. The backend uses a library like OpenCV to extract frames from the video at a rate of 1 frame per second.
5. The extracted frames are saved to a designated output directory.

### Epic 2: AI-Powered Code Generation

This epic introduces the core AI functionality, where the extracted frames are analyzed to produce the initial set of frontend, backend, and API specification artifacts.

#### Story 2.1: Frame Analysis and UI Definition

As a user, I want the system to send each extracted frame to a vision-enabled LLM, so that the UI components and actions on each frame are identified.

##### Acceptance Criteria

1. The backend service iterates through the extracted frames.
2. Each frame is sent to a vision LLM via the OpenRouter.ai integration.
3. The prompt instructs the LLM to return a JSON object describing the UI components (type, label) and inferred user action.
4. The JSON responses for all frames are collected and stored.

#### Story 2.2: Generate Frontend Code

As a user, I want the system to use the identified UI components to generate React code, so that I have a functional frontend representation of my mockup.

##### Acceptance Criteria

1. A service processes the collected JSON UI definitions from the LLM.
2. It generates React functional components corresponding to the identified screens and elements.
3. The generated code is made available to be displayed on the results screen.
4. Basic file structure for the React components is created.

#### Story 2.3: Generate API Specification and Backend Scaffold

As a user, I want the system to use the inferred actions to generate an OpenAPI spec and a backend scaffold, so that my backend logic is ready to be implemented.

##### Acceptance Criteria

1. A service analyzes the inferred actions (e.g., "POST /api/login") from the LLM responses.
2. An OpenAPI 3.0 specification is generated in YAML or JSON format, defining the paths, methods, and basic schemas.
3. Based on the OpenAPI spec, a NestJS controller and service file are scaffolded for each endpoint.
4. The generated spec and backend files are made available to be displayed on the results screen.

### Epic 3: Interactive Refinement Workspace

This epic implements the results screen, including the code viewers and the interactive chat interface for refining the generated code.

#### Story 3.1: Implement Results Workspace UI

As a user, I want to see the generated frontend code, backend code, and API spec in a clear, organized workspace.

##### Acceptance Criteria

1. A new screen/route is created for displaying the results.
2. The UI features a tabbed interface with tabs for "Frontend," "Backend," and "API Spec."
3. Each tab contains a code viewer that displays the relevant generated content with syntax highlighting.
4. "Copy to Clipboard" and "Download File" buttons are available for each artifact.

#### Story 3.2: Implement Interactive Chat Interface

As a user, I want a chat panel in the workspace, so that I can type suggestions to modify the generated code.

##### Acceptance Criteria

1. A chat input panel is added to the workspace UI.
2. When I send a message, the content of the currently active code viewer and my message are sent to a backend endpoint.
3. The backend forwards the code and my suggestion to an LLM via the OpenRouter.ai integration.
4. The prompt asks the LLM to modify the code based on my suggestion and return the updated code.
5. The code viewer on the frontend is updated with the new code returned from the backend.

## Change Log

| Change | Date | Version | Description | Author |
| :---- | :---- | :---- | :---- | :---- |


# VIDEO2CODE Documentation Index

This file has been split into dedicated documents:

- prd.md — Product Requirements Document
- architecture.md — Technical Architecture Document
- checklist.md — Development Checklist
- research.md — Stack Version Ground Truth (latest versions and sources)

Below is the original content (kept for history). See the new files above for the current sources of truth.

---


# **Mockup Video to Code \- Product Requirements Document**

## **Goals and Background Context**

### **Goals**

* **Automate UI/UX to Code Conversion:** Automatically generate production-ready frontend code, backend scaffolds, and API specifications from a single screen recording of a UI flow.
* **Accelerate MVP Development:** Drastically reduce the manual effort and time required to turn UI mockups (Figma, screen recordings) into functional applications.
* **Improve Designer-Developer Handoff:** Create a seamless, automated handoff process that minimizes ambiguity and ensures the final product matches the design intent.
* **Enable Rapid Prototyping:** Allow developers and designers to quickly test and validate application ideas by generating functional prototypes directly from visual concepts.
* **Support Multiple Technologies:** Generate code for a variety of popular frontend (React, Flutter) and backend (NestJS, Express, Django) frameworks.
* **Interactive Code Refinement:** Allow for iterative, conversational refinement of the generated code using a chat interface.

### **Background Context**

Currently, converting UI mockups from design tools like Figma or simple screen recordings into functional code is a time-consuming and manual process for developers. This workflow often involves developers meticulously recreating UI components, defining API contracts, and scaffolding backend logic based on visual specifications, which can lead to inconsistencies and slow down the development lifecycle.

This project aims to solve that problem by creating an AI-powered pipeline that ingests a screen recording of an app's UI flow and automatically generates the corresponding frontend code, backend stubs, and API specifications. By leveraging computer vision to analyze frames and large language models to interpret UI components, user actions, and conversational feedback, this tool will bridge the gap between design and development, enabling a faster and more interactive way to build applications.

## **Requirements**

### **Functional**

* **FR1:** The system must accept a screen recording (e.g., .mp4 format) of a user interface flow as its primary input.
* **FR2:** The system must be able to process the video to extract individual frames at a configurable rate (e.g., 1 frame per second).
* **FR3:** Using a vision-enabled Large Language Model (LLM), the system must analyze the extracted frames to identify UI components (buttons, inputs, forms), their properties, and the user actions being performed.
* **FR4:** The system shall generate an OpenAPI specification based on inferred user actions that imply backend interaction (e.g., a form submission generating a POST /api/login endpoint).
* **FR5:** The system must generate frontend UI code (initially for React) that corresponds to the components and layout identified in the frames.
* **FR6:** The system must generate backend code scaffolds (initially for NestJS) for the API endpoints defined in the OpenAPI specification.
* **FR7:** The system must incorporate a mechanism to handle inconsistencies in the source video, such as jittery movement or minor UI changes between frames, to produce a stable and coherent output.
* **FR8:** The system must include safeguards or validation steps to mitigate and flag potential LLM hallucinations in the final generated code and specifications.
* **FR9:** The system shall support alternative inputs to video, such as Figma animations, for generating the application code.
* **FR10:** The system should be able to process voice instructions within the recording to provide additional context or guidance for the AI generation process.
* **FR11:** The system must provide a chat interface on the results screen where the user can type natural language suggestions (e.g., "change the button color to blue," "add a loading state") to modify the generated outputs.

### **Non-Functional**

* **NFR1:** The entire system must be **free to operate**, potentially by implementing a system to rotate free-tier API keys for services like OpenRouter and exclusively using free models.
* **NFR2:** The application must be fully containerized using **Docker** for portability and ease of setup.
* **NFR3:** The system must be designed to run on **low-specification hardware**, with a target of being fully functional on a typical older laptop with 16GB of RAM.
* **NFR4:** The chat interface's suggestion-processing functionality must be powered by the system's OpenRouter.ai integration, utilizing free models for analysis and code modification.

## **User Interface Design Goals**

### **Overall UX Vision**

The user experience should be clean, minimalist, and highly utilitarian. The primary focus is on an **interactive co-pilot experience**, guiding you from initial video upload to a refined, downloadable codebase through a combination of automated generation and conversational feedback.

### **Key Interaction Paradigms**

* **Interactive Generation Flow:** A two-stage process: 1\. Upload & Generate \-\> 2\. Review & Refine.
* **Conversational Refinement:** A core interaction will be a chat interface allowing you to provide natural language feedback to iteratively modify the generated code and specifications.
* **Drag-and-Drop:** An intuitive drag-and-drop area for video file uploads.
* **Real-time Feedback:** Clear, real-time feedback during the initial processing phase.
* **Tabbed Results:** The generated outputs will be organized into clean, easily navigable tabs.

### **Core Screens and Views**

1. **Upload Screen:** A single-purpose screen dominated by the file upload component.
2. **Workspace Screen:** A multi-panel view that serves as the main interactive area. This screen will feature:
   * **Code Viewers:** Tabbed viewers for the generated Frontend Code, Backend Code, and API Spec.
   * **Chat Panel:** A persistent chat interface where you can type suggestions to modify the code in the viewers.

### **Accessibility**

* We will aim for standard accessibility practices (e.g., WCAG 2.1 Level AA) to ensure the tool is easy to use, which is a good habit even for personal projects.

### **Branding**

* Not required for this personal project. A simple, clean, dark-themed "developer tool" aesthetic will be used.

### **Target Device and Platforms**

* **Web Responsive (Desktop First):** The primary platform will be a web application designed for desktop browsers to align with your development workflow.

## **Technical Assumptions**

### **Repository Structure**

* **Monorepo:** A single repository will be used to manage the frontend, backend, and any shared code or libraries.

### **Service Architecture**

* **Serverless Functions & Frontend Host:** The architecture will consist of a frontend web application hosted on a static hosting service, which communicates with a set of backend serverless functions for processing. This aligns with the goals of low hardware requirements and cost-effectiveness.

### **Testing requirements**

* **Unit & Integration Tests:** The project will include unit tests for core logic and integration tests for API endpoints to ensure reliability. Manual testing will be sufficient for the UI given its simplicity and personal use case.

### **Additional Technical Assumptions and Requests**

* **Video Processing:** Python with OpenCV will be used for frame extraction from the input video.
* **AI Integration:** The system will integrate with vision-enabled LLMs via an API key management system (like OpenRouter.ai) to ensure free usage.
* **Containerization:** The entire application will be containerized via a Dockerfile and docker-compose.yml for easy setup and execution.

## **Epics**

### **Epic 1: Core Application Setup & Video Processing**

This epic establishes the foundational structure of the application, including the Docker setup, the frontend UI for uploading files, and the backend logic for processing the video into frames.

#### **Story 1.1: Initial Project & Docker Scaffolding**

As a user, I want a containerized application setup, so that I can easily build and run the entire project with a single command.

##### **Acceptance Criteria**

1. A Dockerfile is created to define the application environment.
2. A docker-compose.yml is configured to orchestrate the frontend and backend services.
3. The project structure is initialized with placeholders for frontend and backend code.
4. The application can be started successfully using docker-compose up.

#### **Story 1.2: Implement Frontend Upload UI**

As a user, I want a simple web interface with a drag-and-drop zone, so that I can upload a screen recording video.

##### **Acceptance Criteria**

1. A React application is created for the frontend.
2. The UI displays a clear area for file uploads.
3. The component accepts .mp4 files via drag-and-drop or a file selection button.
4. Upon file selection, the frontend sends the video file to a backend processing endpoint.

#### **Story 1.3: Implement Backend Video Processing Endpoint**

As a user, I want the backend to receive my uploaded video and extract frames from it, so that they can be analyzed.

##### **Acceptance Criteria**

1. A backend service (e.g., Python/Flask or Node.js/Express) is created.
2. An API endpoint is available to accept multipart/form-data video uploads.
3. The backend saves the uploaded video to a temporary location.
4. The backend uses a library like OpenCV to extract frames from the video at a rate of 1 frame per second.
5. The extracted frames are saved to a designated output directory.

### **Epic 2: AI-Powered Code Generation**

This epic introduces the core AI functionality, where the extracted frames are analyzed to produce the initial set of frontend, backend, and API specification artifacts.

#### **Story 2.1: Frame Analysis and UI Definition**

As a user, I want the system to send each extracted frame to a vision-enabled LLM, so that the UI components and actions on each frame are identified.

##### **Acceptance Criteria**

1. The backend service iterates through the extracted frames.
2. Each frame is sent to a vision LLM via the OpenRouter.ai integration.
3. The prompt instructs the LLM to return a JSON object describing the UI components (type, label) and inferred user action.
4. The JSON responses for all frames are collected and stored.

#### **Story 2.2: Generate Frontend Code**

As a user, I want the system to use the identified UI components to generate React code, so that I have a functional frontend representation of my mockup.

##### **Acceptance Criteria**

1. A service processes the collected JSON UI definitions from the LLM.
2. It generates React functional components corresponding to the identified screens and elements.
3. The generated code is made available to be displayed on the results screen.
4. Basic file structure for the React components is created.

#### **Story 2.3: Generate API Specification and Backend Scaffold**

As a user, I want the system to use the inferred actions to generate an OpenAPI spec and a backend scaffold, so that my backend logic is ready to be implemented.

##### **Acceptance Criteria**

1. A service analyzes the inferred actions (e.g., "POST /api/login") from the LLM responses.
2. An OpenAPI 3.0 specification is generated in YAML or JSON format, defining the paths, methods, and basic schemas.
3. Based on the OpenAPI spec, a NestJS controller and service file are scaffolded for each endpoint.
4. The generated spec and backend files are made available to be displayed on the results screen.

### **Epic 3: Interactive Refinement Workspace**

This epic implements the results screen, including the code viewers and the interactive chat interface for refining the generated code.

#### **Story 3.1: Implement Results Workspace UI**

As a user, I want to see the generated frontend code, backend code, and API spec in a clear, organized workspace.

##### **Acceptance Criteria**

1. A new screen/route is created for displaying the results.
2. The UI features a tabbed interface with tabs for "Frontend," "Backend," and "API Spec."
3. Each tab contains a code viewer that displays the relevant generated content with syntax highlighting.
4. "Copy to Clipboard" and "Download File" buttons are available for each artifact.

#### **Story 3.2: Implement Interactive Chat Interface**

As a user, I want a chat panel in the workspace, so that I can type suggestions to modify the generated code.

##### **Acceptance Criteria**

1. A chat input panel is added to the workspace UI.
2. When I send a message, the content of the currently active code viewer and my message are sent to a backend endpoint.
3. The backend forwards the code and my suggestion to an LLM via the OpenRouter.ai integration.
4. The prompt asks the LLM to modify the code based on my suggestion and return the updated code.
5. The code viewer on the frontend is updated with the new code returned from the backend.

## **Change Log**

| Change | Date | Version | Description | Author |
| :---- | :---- | :---- | :---- | :---- |

---

This completes the full Product Requirements Document based on our discussion. The next step in the **Documentation Mode** workflow is to hand this off to the **Architect AI Agent, Fred**, who will use it to create the technical architecture.

I will now activate the Architect.

Activating the Architect AI Agent, Fred...

---

Hello. I am Fred, the Architect AI. I have received and analyzed the Product Requirements Document (PRD) prepared by John. The requirements are clear and provide a solid foundation for designing the system architecture.

My purpose is to create the architecture.md document, which will serve as the technical blueprint for this project. It will detail the technology stack, component design, data flow, and infrastructure, ensuring we meet all functional and non-functional requirements, especially those concerning cost-free operation and low hardware demands.

I will now begin drafting the **Technical Architecture Document**. Based on the PRD, the key architectural drivers are:

* **Containerization:** The entire application must run within Docker.
* **Low Resource Consumption:** The architecture must be lightweight to run on 16GB of RAM.
* **Cost-Effectiveness:** The system must leverage free-tier models and services.
* **Modularity:** The system needs distinct frontend, backend processing, and AI interaction components.

Given these constraints, a microservices-style architecture orchestrated with docker-compose, where each service is a lightweight container, is the most logical approach.

Here is the first draft of the architecture.md document.

---

# **Mockup Video to Code \- Technical Architecture Document**

## **Document Information**

* **Version**: 1.0
* **Date**: {Current Date}
* **Status**: Final
* **Prepared for**: Development Team Handoff

## **Executive Summary**

### **Architecture Overview**

This document outlines the technical architecture for the "Mockup Video to Code" application. The system is designed as a containerized, multi-service application orchestrated via docker-compose. It follows a microservices pattern to separate concerns between the user-facing web interface, video processing, and AI-driven code generation. This approach ensures modularity and adheres to the strict requirements of running on low-specification hardware with a free-tier operational cost model.

### **Key Design Principles**

* **Separation of Concerns:** Each service (frontend, video processing, AI interaction) has a single, well-defined responsibility.
* **Lightweight Services:** Each component is built using technologies chosen for their low memory footprint and fast startup times.
* **Asynchronous Processing:** Video analysis and code generation are handled asynchronously to provide a non-blocking user experience.
* **Stateless Services:** Backend services are designed to be stateless where possible to simplify scaling and deployment within Docker.

## **System Overview**

### **High-Level Architecture**

The system is composed of three primary services running in separate Docker containers: a **Frontend Service** (React), a **Video Processing Service** (Python), and an **AI Gateway Service** (Node.js). The user interacts with the Frontend, which communicates with the other services via a shared volume and direct API calls.

Code snippet

graph TD
    subgraph User Browser
        A\[Frontend UI \- React\]
    end

    subgraph Docker Environment
        A \-- Uploads Video \--\> B\[Video Processor \- Python/OpenCV\]
        B \-- Writes Frames \--\> V\[Shared Volume\]
        C\[AI Gateway \- Node.js\] \-- Reads Frames \--\> V
        C \-- Calls \--\> D\[External LLM API \- OpenRouter.ai\]
        A \-- Sends Refinement Prompts \--\> C
        C \-- Returns Generated Code \--\> A
    end

    style V fill:\#f9f,stroke:\#333,stroke-width:2px

### **System Context**

The application is a self-contained, personal developer tool. All components run locally on the user's machine via Docker. The only external dependency is the internet connection required to access the OpenRouter.ai API for LLM-based analysis and code generation.

## **Technology Stack**

### **Core Technologies**

| Component | Technology | Version | Justification |
| :---- | :---- | :---- | :---- |
| **Frontend Framework** | React (with Vite) | 18.x | A popular, lightweight framework for building the user interface. Vite provides a fast development experience. |
| **Video Processing** | Python | 3.11 | The ideal choice for scientific and media processing tasks, with excellent libraries like OpenCV. |
| **Video Library** | OpenCV | 4.x | The industry standard for computer vision and frame extraction, offering high performance. |
| **AI Gateway Service** | Node.js (with Express) | 20.x | Excellent for I/O-bound tasks like managing API requests to the external LLM. It's lightweight and fast. |
| **Containerization** | Docker & Docker Compose | Latest | Meets the core requirement (NFR2) for a portable, easily managed, multi-service application setup. |

### **Development Tools**

* **IDE**: VS Code is recommended.
* **Version Control**: Git.
* **Package Management**: npm (for Frontend/AI Gateway), pip (for Video Processor).
* **Testing Frameworks**: Jest (for Frontend/AI Gateway), PyTest (for Video Processor).

## **Component Architecture**

### **System Components**

#### **Frontend Service (React)**

* **Responsibilities**: Provides the web UI for video upload and the interactive workspace for viewing and refining generated code. Manages client-side state.
* **Key Modules**:
  * UploadComponent: Handles file selection and upload.
  * WorkspaceComponent: Contains the tabbed code viewers and the chat interface.
  * apiClient: A module for making HTTP requests to the AI Gateway service.

#### **Video Processing Service (Python)**

* **Responsibilities**: Accepts video files, extracts frames using OpenCV, and saves them to a shared volume accessible by the AI Gateway.
* **Key Modules**:
  * api.py: A simple web server (e.g., Flask) with an endpoint to receive video files.
  * processor.py: The core logic that uses OpenCV to perform frame extraction.

#### **AI Gateway Service (Node.js)**

* **Responsibilities**:
  1. Reads frames from the shared volume.
  2. Constructs prompts and sends frames to the external vision LLM.
  3. Receives UI/action definitions from the LLM and generates code artifacts.
  4. Exposes an endpoint for the frontend to submit refinement prompts and returns updated code.
* **Key Modules**:
  * OrchestratorService: Manages the overall flow from frame analysis to code generation.
  * OpenRouterClient: Handles all communication with the OpenRouter.ai API, including key rotation.
  * CodeGenerator: Contains the logic and prompts for generating React, NestJS, and OpenAPI files.
  * ChatController: Exposes the API endpoint for the interactive chat.

### **Component Interactions**

Code snippet

sequenceDiagram
    participant U as User
    participant FE as Frontend Service
    participant VP as Video Processor
    participant AIG as AI Gateway

    U-\>\>FE: Upload video.mp4
    FE-\>\>VP: POST /process-video with video file
    VP-\>\>VP: Extract frames (frame\_01.jpg, ...)
    VP-\>\>SharedVolume: Save frames
    AIG-\>\>SharedVolume: Read frames
    AIG-\>\>OpenRouter.ai: Analyze frames & generate code
    AIG-\>\>FE: Return initial code artifacts
    FE-\>\>U: Display code in Workspace
    U-\>\>FE: Type chat message: "Make button blue"
    FE-\>\>AIG: POST /refine-code with current code & prompt
    AIG-\>\>OpenRouter.ai: Send refinement prompt
    AIG-\>\>FE: Return updated code
    FE-\>\>U: Update code viewer

## **Data Architecture**

### **Data Flow**

The system does not use a traditional database. Data persistence is managed through the file system within the Docker environment.

* **Temporary Data:** Uploaded videos and extracted frames are stored temporarily on a shared Docker volume. This volume is mounted by the Video Processor and AI Gateway services.
* **Generated Data:** The final generated code (React, NestJS, OpenAPI spec) is held in the AI Gateway's memory and sent to the frontend. The user can then download these artifacts to their local machine.

### **Data Storage Strategy**

* **Shared Volume**: A Docker volume named processing\_data will be used for inter-service communication of media files.
* **Local Storage**: Final code output is saved directly to the user's host machine via the browser's download functionality.

## **API Design**

### **Internal APIs**

#### **Video Processor API**

* POST /process
  * **Request**: multipart/form-data containing the video file.
  * **Response**: 200 OK with JSON { "message": "Processing started", "frameCount": 30 }.
  * **Action**: Kicks off the asynchronous frame extraction process.

#### **AI Gateway API**

* GET /results
  * **Request**: None.
  * **Response**: 200 OK with JSON containing the generated code artifacts.
* POST /refine
  * **Request**: JSON body { "artifact": "frontend" | "backend", "code": "...", "prompt": "..." }.
  * **Response**: 200 OK with JSON { "updatedCode": "..." }.

### **External APIs**

* **OpenRouter.ai API**: The AI Gateway will interact with the OpenRouter.ai API to access various vision and language models. The specific model endpoints will be configured within the AI Gateway. An API key rotation system will be implemented to stay within free-tier limits.

## **Infrastructure and Deployment**

### **Hosting Strategy**

The application is designed to run locally on the user's machine using Docker. No cloud hosting is required.

### **Environment Configuration**

Configuration is managed via a .env file at the root of the project, which is used by docker-compose.yml to inject environment variables into the services. The primary variable will be OPENROUTER\_API\_KEYS, a comma-separated list of keys for the AI Gateway to use.

### **CI/CD Pipeline**

A simple CI/CD pipeline is not a core requirement for this personal tool, but a GitHub Actions workflow can be set up for linting and running tests on push to maintain code quality.

## **Performance Considerations**

### **Performance Requirements**

The primary performance constraint is the ability to run on a laptop with 16GB of RAM. The system should remain responsive during video processing.

### **Optimization Strategies**

* **Asynchronous Processing**: The initial, heavy video processing and AI generation are done asynchronously so the user is not blocked.
* **Lightweight Base Images**: Docker images will be built on slim base images (e.g., python:3.11-slim, node:20-alpine) to minimize size and memory footprint.
* **Efficient Frame Extraction**: The frame extraction rate will be configurable to balance detail with processing time.

## **Development Guidelines**

### **Coding Standards**

* **Frontend**: Standard React/TypeScript best practices, enforced by ESLint and Prettier.
* **Backend (Python)**: PEP 8 standards, enforced by Black and Flake8.
* **Backend (Node.js)**: Standard TypeScript best practices, enforced by ESLint and Prettier.

### **Testing Strategy**

* **Unit Testing**: Core logic in each service will be unit-tested (e.g., Python processing functions, Node.js code generation helpers).
* **Integration Testing**: API endpoints will be tested to ensure services can communicate correctly within the Docker environment.

---

This architecture provides a complete technical plan. The final step in the **Documentation Mode** workflow is to create the checklist.md document, which translates the PRD and this architecture into a scannable list of development tasks.

I will now activate the **Task Breakdown Specialist AI, Tyler**, to create this final deliverable.

Activating the Task Breakdown Specialist AI, Tyler...

---

Hello, I'm Tyler, the Task Breakdown Specialist. My function is to analyze the final PRD and Architecture documents to create a detailed, actionable checklist for development. This checklist.md will guide the implementation of the project from setup to completion, ensuring all requirements are met.

Here is the comprehensive development checklist for the "Mockup Video to Code" project.

---

# **Mockup Video to Code \- Development Checklist**

## **Document Information**

* **Version**: 1.0
* **Date**: {Current Date}
* **Status**: Final
* **Prepared for**: Development Team Handoff

## **Overview**

This checklist provides a comprehensive guide for developing the "Mockup Video to Code" application from initial setup through to a functional tool. Each section contains specific, actionable tasks derived from the Product Requirements Document and the Technical Architecture Document.

## **Pre-Development Setup**

### **Environment Setup**

* \[ \] Install Docker and Docker Compose.
* \[ \] Install VS Code with recommended extensions (ESLint, Prettier, Python).
* \[ \] Set up a Git repository for the project.
* \[ \] Create a root .env file and add the OPENROUTER\_API\_KEYS variable.

### **Project Initialization**

* \[ \] Create the monorepo project structure (/frontend, /video-processor, /ai-gateway).
* \[ \] Initialize a docker-compose.yml file at the root.
* \[ \] Create a Dockerfile for each of the three services.
* \[ \] Create initial package.json files for the frontend and AI gateway services.
* \[ \] Create an initial requirements.txt for the video processor service.

## **Phase 1: Core Infrastructure & Video Processing**

### **Backend Foundation (Video Processor)**

* \[ \] Implement a simple web server (Flask) in the video processor service.
* \[ \] Create the POST /process endpoint to accept video file uploads.
* \[ \] Implement the core video processing logic using OpenCV to extract frames.
* \[ \] Configure the service to save extracted frames to a shared Docker volume (/data/frames).
* \[ \] Add unit tests for the frame extraction logic.

### **Frontend Foundation**

* \[ \] Initialize a React \+ Vite application in the /frontend directory.
* \[ \] Create the main UploadComponent for file drag-and-drop.
* \[ \] Implement the logic to send the uploaded file to the video processor's /process endpoint.
* \[ \] Set up basic routing for the Upload and Workspace screens.
* \[ \] Implement a basic loading/spinner state after file upload.

### **Docker Orchestration**

* \[ \] Configure docker-compose.yml to build and run the frontend and video-processor services.
* \[ \] Define the shared volume (processing\_data) and mount it to the video processor service at /data.
* \[ \] Ensure the frontend can communicate with the video processor service within the Docker network.

## **Phase 2: AI Core Generation**

### **AI Gateway Service**

* \[ \] Initialize a Node.js \+ Express application in the /ai-gateway directory.
* \[ \] Implement the OpenRouterClient to handle API calls, including the key rotation logic.
* \[ \] Create the OrchestratorService to manage the code generation flow.
* \[ \] Implement logic for the OrchestratorService to read frames from the shared volume (/data/frames).
* \[ \] Develop the prompting logic to send frames to a vision LLM and request UI component definitions.
* \[ \] Implement the CodeGenerator module to create React, NestJS, and OpenAPI content from the LLM responses.
* \[ \] Create the GET /results endpoint to serve the generated artifacts to the frontend.

### **Docker Orchestration Update**

* \[ \] Add the ai-gateway service to the docker-compose.yml.
* \[ \] Mount the shared volume (processing\_data) to the AI gateway at /data.
* \[ \] Ensure the AI gateway can access the internet to call the OpenRouter API.

## **Phase 3: Interactive Workspace**

### **Frontend Workspace UI**

* \[ \] Create the WorkspaceComponent to house the results.
* \[ \] Implement a tabbed interface for "Frontend", "Backend", and "API Spec".
* \[ \] Integrate a syntax-highlighting code viewer (e.g., react-syntax-highlighter) into each tab.
* \[ \] Implement "Copy to Clipboard" and "Download File" functionality.
* \[ \] Create the ChatComponent with a text input and message display area.

### **Interactive Chat Logic**

* \[ \] Implement the POST /refine endpoint in the AI Gateway service.
* \[ \] The endpoint should accept the current code and a user prompt.
* \[ \] The endpoint should call the LLM with a prompt to modify the code.
* \[ \] Implement frontend logic in the ChatComponent to call the /refine endpoint.
* \[ \] The frontend should update the relevant code viewer with the response from the /refine endpoint.

## **Phase 4: Finalization and Testing**

### **Comprehensive Testing**

* \[ \] Create integration tests for the full workflow: video upload \-\> frame extraction \-\> code generation.
* \[ \] Add unit tests for the AI Gateway's code generation and API client logic.
* \[ \] Manually test the end-to-end user flow with several different UI videos.
* \[ \] Test the interactive chat refinement on all three artifact types.

### **Documentation**

* \[ \] Create a README.md at the project root with detailed setup instructions, including how to configure the .env file.
* \[ \] Add comments to complex sections of the code in all three services.
* \[ \] Document the internal API contracts between the services.

### **Quality Assurance**

* \[ \] Run linters across all three services and fix all errors.
* \[ \] Ensure the application builds and runs successfully with docker-compose up \--build.
* \[ \] Verify the application runs on a machine with 16GB of RAM without significant performance issues.
* \[ \] Confirm that all AI interactions correctly use the free-tier models via OpenRouter.

---

This concludes the **Documentation Mode** workflow. You now have three complete, professional handoff documents:

1. **prd.md** (Product Requirements Document)
2. **architecture.md** (Technical Architecture Document)
3. **checklist.md** (Development Checklist)

These documents provide a comprehensive plan for the development of your "Mockup Video to Code" application.
## VIDEO2CODE — Stack Version Ground Truth (snapshot)

Date: 2025-09-03
Scope: Versions verified from official/package registries to anchor initial tooling choices across Frontend, AI Gateway (Node/Nest/Express), and Video Processor (Python/OpenCV). Use these as upper bounds when initializing the project; pin exact versions in package managers (npm/pip) and lockfiles.

---

### Frontend

- React: 19.1.1
  - Source: https://www.npmjs.com/package/react ("Latest version: 19.1.1")
- Vite: 7.1.4
  - Source: https://www.npmjs.com/package/vite ("Latest version: 7.1.4")
- TypeScript: 5.9.2
  - Source: https://www.npmjs.com/package/typescript ("Latest version: 5.9.2")
- ESLint: 9.34.0
  - Source: https://www.npmjs.com/package/eslint ("Latest version: 9.34.0")
  - Node engine note: ESLint 9 requires Node ^18.18.0, ^20.9.0, or >=21.1.0 (meets Node 22 LTS)
- Prettier: 3.6.2
  - Source: https://www.npmjs.com/package/prettier ("Latest version: 3.6.2")
- Jest (for JS/TS unit tests): 30.1.3
  - Source: https://www.npmjs.com/package/jest ("Latest version: 30.1.3")

Notes
- React + Vite work well with TS 5.9; Vite 7 targets modern Node and browsers.
- Pin React DOM and testing libs to matching majors during setup.

---

### AI Gateway (Node.js) and Backend Options

- Node.js (Active LTS): 22.x (latest listed: 22.19.0 as of 2025-08-28)
  - Source: https://nodejs.org/en/about/previous-releases (table shows "v22 — Active LTS", latest 22.19.0)
  - Guidance: Use Node 22.x (Active LTS) for dev/build/CI and Docker base images (e.g., node:22-alpine)
- Express (if using lightweight API in AI Gateway): 5.1.0
  - Source: https://www.npmjs.com/package/express ("Latest version: 5.1.0")
- NestJS Core (if scaffolding backend service): @nestjs/core 11.1.6
  - Source: https://www.npmjs.com/package/@nestjs/core ("Latest version: 11.1.6")
- NestJS Swagger module: @nestjs/swagger 11.2.0
  - Source: https://www.npmjs.com/package/@nestjs/swagger ("Latest version: 11.2.0")

Notes
- Express 5.x runs on Node 18+; Node 22 LTS is compatible.
- NestJS 11.x aligns with Node 18+ and modern TS (5.9 supported). Use matching @nestjs/* 11.x family.

---

### Video Processor (Python / OpenCV)

- Python (latest stable): 3.13.7
  - Source: https://www.python.org/downloads/ ("Download the latest Python 3.13.7")
- Flask (simple API server): 3.1.2
  - Source: https://pypi.org/project/Flask/ ("Flask 3.1.2 — Released: Aug 19, 2025")
- OpenCV Python wheels: opencv-python 4.12.0.88
  - Source: https://pypi.org/project/opencv-python/ ("Latest version 4.12.0.88 — Jul 7, 2025")
- PyTest (unit tests): 8.4.1
  - Source: https://pypi.org/project/pytest/ ("pytest 8.4.1 — Jun 18, 2025")
- Black (formatter): current stable 2025-09 snapshot
  - Source: https://pypi.org/project/black/ (use latest at install time)

Notes
- opencv-python wheels support CPython 3.7+ and include manylinux/macOS/Windows distributions; 3.13 is supported.
- Flask 3.x requires Python >=3.9 (satisfied by 3.13.7).

---

### Containerization

- Docker Engine & Docker Compose: Use the latest stable from Docker Desktop (Windows) at install time.
  - Rationale: Keep base images in Dockerfiles aligned with Node 22 LTS and Python 3.13 slim variants (e.g., node:22-alpine, python:3.13-slim).

---

### Pinning & Compatibility Guidance

- Pin exact versions at initialization time using package managers (do not hand-edit package files):
  - Frontend/AI Gateway: npm/yarn/pnpm (e.g., npm i -D typescript@5.9.2 eslint@9.34.0 prettier@3.6.2; npm i react@19.1.1 vite@7.1.4 jest@30.1.3)
  - Python: pip (e.g., pip install Flask==3.1.2 opencv-python==4.12.0.88 pytest==8.4.1 black)
- Engines:
  - Node: set "engines": { "node": ">=22" } in Node services to standardize local/CI.
  - Python: target 3.13.7 in Docker base and local pyenv if used.
- Lockfiles: commit package-lock.json/pnpm-lock.yaml and requirements.txt/constraints.txt to ensure reproducible builds.

---

### Sources Log (direct links)

- React 19.1.1 — https://www.npmjs.com/package/react
- Vite 7.1.4 — https://www.npmjs.com/package/vite
- TypeScript 5.9.2 — https://www.npmjs.com/package/typescript
- ESLint 9.34.0 — https://www.npmjs.com/package/eslint
- Prettier 3.6.2 — https://www.npmjs.com/package/prettier
- Jest 30.1.3 — https://www.npmjs.com/package/jest
- Node.js 22 LTS — https://nodejs.org/en/about/previous-releases (shows v22 Active LTS; latest 22.19.0)
- Express 5.1.0 — https://www.npmjs.com/package/express
- NestJS Core 11.1.6 — https://www.npmjs.com/package/@nestjs/core
- @nestjs/swagger 11.2.0 — https://www.npmjs.com/package/@nestjs/swagger
- Python 3.13.7 — https://www.python.org/downloads/
- Flask 3.1.2 — https://pypi.org/project/Flask/
- opencv-python 4.12.0.88 — https://pypi.org/project/opencv-python/
- pytest 8.4.1 — https://pypi.org/project/pytest/
- Black — https://pypi.org/project/black/


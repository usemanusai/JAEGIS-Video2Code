# Master Development Prompt & Standard Operating Procedures

Objective: Execute full‑stack development with absolute precision, security, and quality under the multi‑phase operational mandate below. Adherence is mandatory and absolute.

## Table of Contents
- [Execution Workflow & Deliverables](#execution-workflow--deliverables)
- [Phase 1: Live‑Sourced Deep Research & Version Grounding](#phase-1-live-sourced-deep-research--version-grounding)
- [Phase 2: Zero‑Error Implementation & Governance Protocols](#phase-2-zero-error-implementation--governance-protocols)
  - [Protocol: A.A.E.F.N.M.W.](#protocol-aaefnmw-always-active-error-free-no-matter-what)
  - [Protocol: V.I.G.I.L.](#protocol-vigil-vigilant-integrated-guardian-for-infrastructure--libraries)
- [Phase 3: Universal Directives & Constraints](#phase-3-universal-directives--constraints)
- [Validation Requirements](#validation-requirements)
- [Success Criteria](#success-criteria)
- [Repository Cross‑References](#repository-cross-references)

---

## Execution Workflow & Deliverables
Your response must be structured in two distinct parts:

1) Part 1: Research Output
- Perform the deep research protocol from Phase 1.
- Present the complete, populated research.md as the first deliverable.
- Do not write implementation code until this is complete.

2) Part 2: Implementation Output
- Based exclusively on the validated findings from research.md, provide the full implementation adhering to Phase 2 and Phase 3.

---

## Phase 1: Live‑Sourced Deep Research & Version Grounding
This phase ensures all work is based on the most current, verifiable information at execution time.

1) Live Date/Time Acquisition (Mandatory First Action)
- Execute a web search query: "What is today's time and date?"
- Parse the result to obtain the official [Date of Execution]. For this session: Wednesday, September 3, 2025.

2) Immediate Technology & Version Grounding
- Identify the technology stack (e.g., React, NestJS/Express, Flask, GitHub Actions, Mermaid, etc.).
- Determine the latest stable version for each component as of the [Date of Execution] (prioritize official sources).
- Establish a Version Ground Truth list as a non‑negotiable constraint.

3) Scoping & Deconstruction
- Analyze the user’s objective within the context of the Version Ground Truth.

4) MANDATORY: Iterative Deep‑Search Protocol
- Execute 20–40 separate, in‑depth web searches.
- Version anchoring: every query must be anchored to the Version Ground Truth numbers.
- Time filtering: prefer sources published on or after the [Date of Execution].
- Logging: every query and its primary URL must be logged in the research.md Source Log.

5) Synthesis into a Time‑Stamped Knowledge Base
- Consolidate findings into research.md with the following structure:

```
# Research Report: [Brief Task Description]

- Date of Execution: [Timestamp]

## Version Ground Truth
- [Technology 1]: [Version]
- [Technology 2]: [Version]
...

---

## Executive Summary
[Findings and recommendations]

## Implementation Details
[Actionable, version‑specific snippets and configs]

## Source Log
[List of all search queries and URLs]
```

research.md is the sole source of truth for implementation.

---

## Phase 2: Zero‑Error Implementation & Governance Protocols
All code and infrastructure in Part 2 must strictly adhere to the protocols below.

### Protocol: A.A.E.F.N.M.W. (Always Active Error‑Free No Matter What)
1) Universal Error Elimination
- Maintain 100% error‑free status across frontend, backend, database, infrastructure, CI/CD, and dependencies.

2) Error Classification & Mandatory Resolution
- Critical (zero tolerance; immediate fix): runtime crashes, API/DB failures, security vulns, build/deploy failures.
- Major (same milestone): type errors, failed tests, performance regressions, accessibility violations.
- Minor (before milestone close): linter violations, deprecations, unhandled rejections.

3) Testing Infrastructure Requirements
- Root /tests directory with /unit, /integration, /e2e, /performance, /fixtures.
- Coverage: >90% unit, 100% API integration recommended; performance baselines <200ms per API.
- CI/CD quality gates must block merges on any test failure.

4) Package Management & Currency Standards
- Use latest stable versions as of [Date of Execution].
- Apply security patches within 24 hours.
- Target versions: Node 20.x LTS+, TypeScript 5.5+, React 18.2+, NestJS 10.3+, Prisma 5.18+, PostgreSQL 16.x, Python 3.11+.

5) Implementation Standards & Quality Gates
- Code must pass tests, TypeScript strict mode, linter/formatter checks, security scans before integration.
- Implement comprehensive error handling, circuit breakers, and graceful degradation.

6) Monitoring & Validation Infrastructure
- Architecture supports APM, error tracking, and automated scanning.

Validation Checkpoint: Run full test suite and certify error‑free before milestones.

### Protocol: V.I.G.I.L. (Vigilant Integrated Guardian for Infrastructure & Libraries)
1) Architectural Implementation
- A scheduled GitHub Actions workflow (.github/workflows/vigil-daily-scan.yml) that runs daily.

2) Required Automated Checks
- Dependency vulnerabilities & obsolescence (Dependabot, npm audit, pip‑audit).
- Container image security (Trivy).
- License compliance (license‑checker or equivalent).
- Static code & secret scanning (CodeQL).

3) Automated Reporting & Remediation
- Generate daily markdown report (VIGIL_REPORT-[YYYY-MM-DD].md) as artifact.
- Create GitHub Issue(s) with label vigil-alert for any High/Critical findings; include counts, affected components, CVEs, and workflow run link.

---

## Phase 3: Universal Directives & Constraints
Required
- ALWAYS use the [Date of Execution] for versioning decisions; avoid deprecated deps.
- ALWAYS deliver full‑stack solutions (Frontend + Backend).
- ALWAYS generate secure keys automatically where needed.
- ALWAYS self‑test and self‑validate to ensure 100% correctness.
- ALWAYS fix all runtime errors.
- ALWAYS implement an Anti‑Port Conflict System.
- ALWAYS integrate V.I.G.I.L. as a standard, non‑negotiable component.

Not Allowed
- NEVER use mock, fake, or generated data for validation (except explicit mock mode where documented).
- NEVER skip TODOs or pending items.
- NEVER simulate functionality.
- NEVER deliver demos; deliver production‑ready code.

---

## Validation Requirements
- Each commit must pass CI (linting, formatting, tests, security scans).
- V.I.G.I.L. must be manually triggerable and verified after enhancement.
- Coverage gates must be validated by intentionally reducing coverage to confirm CI failure (during local verification).
- Anti‑port conflict scripts must be tested on Unix and Windows, both with and without port conflicts.
- Final implementation must comply 100% with the Master SOP.

## Success Criteria
- Zero CI failures across all workflows.
- V.I.G.I.L. creates issues only for actual High/Critical findings with details and run links.
- Coverage enforcement blocks merges below thresholds.
- Local development provides clear port conflict resolution.
- Repository serves as a complete reference implementation of this SOP.

---

## Repository Cross‑References
- CI pipeline: .github/workflows/ci.yml
- V.I.G.I.L.: .github/workflows/vigil-daily-scan.yml
- CodeQL: .github/workflows/codeql.yml
- Dependabot: .github/dependabot.yml
- Tests: /tests (unit, integration, e2e, performance, fixtures)
- Anti‑Port scripts: scripts/dev-preflight.sh, scripts/dev-preflight.ps1
- Compose CI override: docker-compose.ci.yml

Use research.md as the sole source of truth for implementation decisions in each session.


#!/usr/bin/env bash
set -euo pipefail

# Basic end-to-end invocation leveraging existing compose test-runner
# Ensures upload->process->results path is exercised by the containerized runner

docker compose -f docker-compose.yml -f docker-compose.test.yml -f docker-compose.ci.yml run --rm test-runner


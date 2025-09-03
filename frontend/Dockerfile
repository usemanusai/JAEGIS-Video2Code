# Frontend Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm pkg get name >/dev/null 2>&1 || true
# Install only deps if lockfile present; otherwise allow later bind-mount install
RUN [ -f package-lock.json ] && npm ci || true
COPY . .
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]


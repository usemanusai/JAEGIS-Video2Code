# AI Gateway Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN [ -f package-lock.json ] && npm ci || true
COPY . .
EXPOSE 8080
CMD ["npm","run","start"]


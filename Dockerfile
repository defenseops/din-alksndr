# ── Stage 1: build client ────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

COPY client/ ./
ARG VITE_API_URL=""
RUN npm run build

# ── Stage 2: production server ────────────────────────────────
FROM node:22-alpine

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=builder /app/client/dist ../client/dist

EXPOSE 3001
CMD ["node", "index.js"]

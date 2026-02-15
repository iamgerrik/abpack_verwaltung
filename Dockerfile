# Multi-stage build für abpack_verwaltung

# Stage 1: Builder - Abhängigkeiten installieren und Frontend/Backend bauen
FROM node:22-alpine AS builder

WORKDIR /app

# pnpm installieren
RUN npm install -g pnpm@10.29.3

# package.json und pnpm-lock.yaml kopieren
COPY package.json pnpm-lock.yaml ./

# Abhängigkeiten installieren
RUN pnpm install --frozen-lockfile

# Quellcode kopieren
COPY . .

# Umgebungsvariablen für Build
ENV NODE_ENV=production
ENV VITE_APP_ID=abpack_verwaltung

# Frontend (Vite) und Backend bauen
RUN pnpm build

# Stage 2: Production Runtime - nur notwendige Dateien
FROM node:22-alpine

WORKDIR /app

# pnpm installieren
RUN npm install -g pnpm@10.29.3

# Production-Abhängigkeiten installieren (nur necessary dependencies)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Built files aus Stage 1 kopieren
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/index.html ./client/index.html
COPY --from=builder /app/drizzle ./drizzle

# Konfigurationsdateien
COPY .env .env

# Port exposieren (Node.js Backend Server)
EXPOSE 3000

# Health Check (optional)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Production starten
CMD ["node", "dist/index.js"]

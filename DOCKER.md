# Docker Setup für abpack_verwaltung

## Quickstart

### Docker Image bauen
```bash
docker build -t abpack_verwaltung:latest .
```

### Container einzeln starten (mit bestehendem MySQL)
```bash
docker run -d \
  --name abpack_app \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@host:3306/abpack_verwaltung" \
  -e JWT_SECRET="your-secret-key" \
  -e NODE_ENV="production" \
  abpack_verwaltung:latest
```

### Mit Docker Compose (MySQL + App zusammen)
```bash
# Starten
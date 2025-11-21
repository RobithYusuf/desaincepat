# Docker Guide untuk DesainCepat

## Development dengan Docker

### Jalankan Development Server

```bash
docker-compose --profile dev up dev
```

Server akan berjalan di `http://localhost:3000` dengan hot reload aktif.

### Jalankan Production Build

```bash
docker-compose up app
```

Atau build manual:

```bash
# Build image
docker build -t desaincepat:latest .

# Run container
docker run -p 3000:3000 desaincepat:latest
```

## Struktur Multi-Stage Build

Dockerfile menggunakan 4 stage untuk optimasi:

1. **base** - Node.js 20 Alpine base image
2. **deps** - Install dependencies
3. **builder** - Build aplikasi Next.js
4. **runner** - Production runtime (smallest)

## Optimization Features

- ✅ Standalone output mode Next.js
- ✅ Multi-stage build untuk ukuran image kecil
- ✅ Non-root user untuk security
- ✅ Layer caching untuk build lebih cepat
- ✅ Volume mounting untuk hot reload (dev mode)

## Commands Cheat Sheet

```bash
# Build image dengan tag custom
docker build -t desaincepat:v1.0 .

# Run dengan environment variables
docker run -p 3000:3000 -e NODE_ENV=production desaincepat

# Check logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Remove all (including volumes)
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
```

## Troubleshooting

### Port sudah digunakan

```bash
# Check port 3000
lsof -i :3000

# Stop process
kill -9 <PID>
```

### Build gagal

```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

### Hot reload tidak berfungsi

Pastikan volume sudah di-mount dengan benar di `docker-compose.yml`:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

## Production Deployment

### Deploy ke Cloud

**AWS ECS / Docker Hub:**

```bash
# Login Docker Hub
docker login

# Tag image
docker tag desaincepat username/desaincepat:latest

# Push
docker push username/desaincepat:latest
```

**Railway / Render:**

Gunakan `Dockerfile` yang sudah ada, platform akan auto-detect.

## Performance Tips

1. **Layer Caching**: Pisahkan instalasi dependencies dan build code
2. **Smaller Base Image**: Gunakan Alpine Linux (±5MB)
3. **Standalone Mode**: Next.js hanya copy file yang diperlukan
4. **Multi-Stage**: Buang dev dependencies di production

## Security Best Practices

- ✅ Run as non-root user (nextjs:nodejs)
- ✅ Disable Next.js telemetry
- ✅ Use specific Node version (20-alpine)
- ✅ Minimal attack surface dengan Alpine

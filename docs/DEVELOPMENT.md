# Development Guide - DesainCepat

## 🚀 Quick Start

### Development Mode (Recommended for Development)

```bash
# Start development server with hot reload
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev

# View logs
docker logs -f desaincepat-dev

# Stop development server
docker stop desaincepat-dev
```

**Keunggulan Dev Mode:**
- ✅ **Hot Reload** - Perubahan code langsung ter-reflect tanpa restart
- ✅ **File Sync** - Volume mount langsung ke project directory
- ✅ **Faster** - Tidak perlu rebuild image setiap kali edit code
- ✅ **Real-time** - Next.js development server dengan fast refresh

### Production Mode (For Testing Production Build)

```bash
# Build production image
docker-compose build --no-cache app

# Start production server
docker-compose up -d app

# Stop production server
docker-compose down
```

**Kapan Pakai Production Mode:**
- ⚠️ Testing production build sebelum deploy
- ⚠️ Debugging production-specific issues
- ⚠️ Performance testing

## 📋 Perbandingan Mode

| Aspek | Development Mode | Production Mode |
|-------|-----------------|-----------------|
| **Command** | `docker-compose run dev` | `docker-compose up app` |
| **Hot Reload** | ✅ Ya | ❌ Tidak |
| **File Changes** | Langsung apply | Perlu rebuild |
| **Speed** | Faster startup | Slower (build required) |
| **Build Required** | ❌ Tidak | ✅ Ya (setiap perubahan) |
| **Volume Mount** | ✅ Ya (`.:/app`) | ❌ Tidak (baked into image) |
| **npm install** | Setiap start | Sekali saat build |
| **Use Case** | Development | Testing/Deploy |

## 🔧 Common Commands

### Development Workflow

```bash
# 1. Start dev server (first time or after stopping)
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev

# 2. Make code changes
# Files automatically sync and reload

# 3. View logs
docker logs -f desaincepat-dev

# 4. Stop when done
docker stop desaincepat-dev
```

### Troubleshooting

```bash
# Port already in use
docker stop desaincepat-dev
# atau
lsof -ti:3000 | xargs kill -9

# Clean restart
docker stop desaincepat-dev && docker rm desaincepat-dev
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev

# Clear all containers
docker-compose down

# View container status
docker ps -a

# Access container shell
docker exec -it desaincepat-dev sh
```

## 📦 docker-compose.yml Explained

```yaml
services:
  # Production service
  app:
    build: .                    # Build from Dockerfile
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
    # Image baked, no volume mount
    # Requires rebuild for changes

  # Development service
  dev:
    image: node:20-alpine       # Use base Node image
    command: sh -c "npm install && npm run dev"
    ports: ["3000:3000"]
    volumes:
      - .:/app                  # Mount project directory
      - /app/node_modules       # Exclude node_modules
    environment:
      - NODE_ENV=development
    profiles: ["dev"]           # Requires --profile dev flag
```

## 🎯 Best Practices

### For Active Development
1. **Always use Dev Mode** untuk development harian
2. Edit code di local editor (VS Code, etc.)
3. Perubahan langsung visible di browser (hot reload)
4. Tidak perlu restart atau rebuild

### Before Git Commit
```bash
# Test build production
docker-compose build app
docker-compose up -d app

# Verify di http://localhost:3000
# Jika OK, commit changes
```

### Before Deploy to Vercel
```bash
# Local production build test
npm run build

# Atau test dengan Docker
docker-compose build --no-cache app
docker-compose up app
```

## ❓ FAQ

**Q: Kenapa perubahan tidak muncul?**
- A: Pastikan pakai **dev mode**, bukan production mode
- Production mode perlu `docker-compose build --no-cache`

**Q: Port 3000 already in use?**
- A: Stop container lain: `docker stop desaincepat-dev desaincepat-app-1`

**Q: Kapan pakai production mode?**
- A: Hanya untuk testing production build sebelum deploy

**Q: npm install tidak jalan?**
- A: Dev mode run `npm install` otomatis saat start
- Tunggu ~1-2 menit untuk npm install selesai

**Q: Hot reload tidak jalan?**
- A: Cek volume mount benar: `docker inspect desaincepat-dev | grep -A 5 Mounts`

## 🚨 Common Issues

### Issue: Changes not reflecting
**Solution:**
```bash
# Make sure using dev mode
docker ps | grep dev

# If using app (production), switch to dev
docker-compose down
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev
```

### Issue: Container keeps restarting
**Solution:**
```bash
# Check logs
docker logs desaincepat-dev

# Common: npm install failed
# Fix: Remove node_modules and restart
rm -rf node_modules
docker stop desaincepat-dev && docker rm desaincepat-dev
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev
```

### Issue: Slow performance
**Solution:**
```bash
# Dev mode can be slower due to volume mount
# For M1/M2 Mac, this is normal
# Alternative: Use native npm run dev (without Docker)
npm install
npm run dev
```

## 🎨 Summary

**Development:** Use `dev` service with volume mount
```bash
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev
```

**Production Testing:** Use `app` service with build
```bash
docker-compose build --no-cache app && docker-compose up -d app
```

**Deploy:** Push to GitHub, Vercel auto-builds production
```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

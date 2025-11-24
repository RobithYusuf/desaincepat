# Docker Modes - Quick Reference

## 🎯 Jawaban Cepat

### `docker-compose up` = Production Mode (`app` service)

```bash
docker-compose up
# atau
docker-compose up -d
```

**Hasil:** Hanya **`app`** (Production) yang jalan! ❌ Hot reload

---

## 📊 Command Reference Table

| Command | Service yang Jalan | Mode | Hot Reload? | Use Case |
|---------|-------------------|------|-------------|----------|
| `docker-compose up` | **`app`** | Production | ❌ Tidak | ⚠️ Testing production |
| `docker-compose up -d` | **`app`** | Production | ❌ Tidak | ⚠️ Testing production |
| `docker-compose run dev` | **`dev`** | Development | ✅ Ya | ✅ **Daily development** |
| `docker-compose --profile dev up` | `app` + `dev` | Both | ❌ Conflict! | ❌ **ERROR!** |

---

## 🔍 Bukti Real

### Test 1: `docker-compose up`

```bash
$ docker-compose config --services
app                    # ← Hanya app yang default

$ docker-compose up -d
Container desaincepat-app-1  Started   # ← Production mode

$ docker ps
NAMES               IMAGE             
desaincepat-app-1   desaincepat-app   # ← Built image (production)
```

**Ciri-ciri Production Mode:**
- Image: `desaincepat-app` (custom built)
- No volume mount
- No hot reload
- Node ENV: production

### Test 2: `docker-compose run dev`

```bash
$ docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev
004120c30c85...       # ← Dev container started

$ docker ps
NAMES               IMAGE             
desaincepat-dev     node:20-alpine    # ← Base image (development)
```

**Ciri-ciri Development Mode:**
- Image: `node:20-alpine` (base image)
- Volume mount: `.:/app`
- Hot reload: ✅ aktif
- Node ENV: development

---

## 🏗️ docker-compose.yml Structure

```yaml
services:
  # Default service - Jalan saat "docker-compose up"
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
    # ❌ NO profiles = DEFAULT SERVICE
    # ❌ NO volumes = NO hot reload
    # ✅ Optimized production build
    
  # Optional service - Perlu flag khusus
  dev:
    image: node:20-alpine
    command: sh -c "npm install && npm run dev"
    ports: ["3000:3000"]
    volumes:
      - .:/app              # ← Hot reload!
      - /app/node_modules
    environment:
      - NODE_ENV=development
    profiles:
      - dev                 # ← OPTIONAL = Not default
```

---

## 🎓 Profile System Explained

### Aturan Docker Compose Profiles:

```yaml
# Service TANPA profile
service-a:
  # no profiles key
  # Status: DEFAULT SERVICE
  # Behavior: SELALU jalan saat "docker-compose up"

# Service DENGAN profile
service-b:
  profiles: ["dev"]
  # Status: OPTIONAL SERVICE
  # Behavior: Hanya jalan saat "docker-compose --profile dev up"
```

### Di DesainCepat:

| Service | Profile | Status | Kapan Jalan? |
|---------|---------|--------|--------------|
| `app` | *(none)* | **DEFAULT** | `docker-compose up` |
| `dev` | `dev` | **OPTIONAL** | `docker-compose run dev` |

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Pakai `docker-compose up` untuk Development

```bash
docker-compose up -d
# Jalan: app (production)
# Edit code → Tidak apply!
# Harus rebuild: docker-compose build --no-cache
```

**Fix:** Pakai `docker-compose run dev`

### ❌ Mistake 2: Pakai `--profile dev`

```bash
docker-compose --profile dev up -d
# Jalan: app + dev (CONFLICT PORT!)
# Error: Port 3000 already in use
```

**Fix:** Pakai `docker-compose run dev` (tanpa profile)

### ❌ Mistake 3: Lupa Stop Service Lain

```bash
# Dev running
docker-compose up -d
# Error: Port conflict!
```

**Fix:** Stop dulu service yang lain
```bash
docker stop desaincepat-dev
docker-compose up -d
```

---

## ✅ Recommended Workflow

### For Development (Daily Work):

```bash
# Start dev mode (once)
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev

# Edit code → Auto reload! ✨

# View logs (optional)
docker logs -f desaincepat-dev

# Stop when done
docker stop desaincepat-dev
```

### For Production Testing:

```bash
# Stop dev first
docker stop desaincepat-dev

# Build and start production
docker-compose build --no-cache app
docker-compose up -d

# Test di http://localhost:3000

# Stop
docker-compose down
```

---

## 🔄 Quick Commands

### Check What's Running:

```bash
# List services in compose file
docker-compose config --services

# List running containers
docker ps

# Check which mode
docker ps --format "{{.Names}}: {{.Image}}"
# Output examples:
# desaincepat-app-1: desaincepat-app   ← Production
# desaincepat-dev: node:20-alpine      ← Development
```

### Switch Modes:

```bash
# Production → Development
docker-compose down
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev

# Development → Production
docker stop desaincepat-dev
docker-compose up -d
```

---

## 📝 Summary

| Question | Answer |
|----------|--------|
| **`docker-compose up` jalan apa?** | `app` (Production) |
| **Hot reload jalan?** | Tidak, perlu rebuild |
| **Untuk development pakai apa?** | `docker-compose run dev` |
| **Kenapa tidak `--profile dev`?** | Conflict port dengan `app` |
| **Service default apa?** | `app` (karena no profile) |
| **Service optional apa?** | `dev` (ada profile) |

---

## 🎯 TL;DR

```bash
# ❌ Jangan ini untuk development:
docker-compose up

# ✅ Pakai ini untuk development:
docker-compose run --rm -d -p 3000:3000 --name desaincepat-dev dev
```

**Alasan:** `docker-compose up` jalan `app` (production) yang tidak ada hot reload!

# Troubleshooting Guide

## Common Issues & Solutions

### 1. Webpack Error: `__webpack_modules__[moduleId] is not a function`

**Cause:** Next.js cache corruption or stale build files.

**Solution:**
```bash
# Clean cache and rebuild
npm run clean
npm run dev

# Or use fresh command
npm run fresh
```

### 2. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution A - Kill the process:**
```bash
# Kill process on port 3000
./scripts/kill-port.sh 3000

# Or manually
lsof -ti:3000 | xargs kill -9
```

**Solution B - Use different port:**
```bash
# Run on port 3001
PORT=3001 npm run dev
```

### 3. Module Not Found Error

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 4. Build Fails with TypeScript Errors

**Solution:**
```bash
# Check for type errors
npm run lint

# If there are errors, fix them in the reported files
```

### 5. Hot Reload Not Working

**Solution:**
```bash
# Clean and restart
npm run clean
npm run dev
```

### 6. Styles Not Updating

**Cause:** Tailwind cache issue

**Solution:**
```bash
# Force rebuild
rm -rf .next
npm run build
npm run dev
```

### 7. Export/Download Not Working

**Check:**
- Browser console for errors
- Canvas element is rendered properly
- `html-to-image` library is installed

**Solution:**
```bash
# Reinstall html-to-image
npm install html-to-image@latest
```

### 8. Docker Issues

**Container won't start:**
```bash
# Check if port is available
docker ps

# Stop all containers
docker-compose down

# Rebuild and start
docker-compose build --no-cache
docker-compose up
```

**Hot reload not working in Docker:**
```bash
# Use dev profile
docker-compose --profile dev up dev
```

## Quick Commands

### Clean & Fresh Start
```bash
npm run clean      # Remove cache
npm run fresh      # Clean + dev
```

### Kill Port
```bash
./scripts/kill-port.sh 3000
```

### Full Reset
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Check What's Running
```bash
# Check port 3000
lsof -i:3000

# List all Node processes
ps aux | grep node
```

## Still Having Issues?

1. Make sure you're using Node.js 18 or higher:
   ```bash
   node --version
   ```

2. Check npm version:
   ```bash
   npm --version
   ```

3. Try different browser (Chrome/Firefox/Safari)

4. Check browser console for errors (F12)

5. Verify all dependencies are installed:
   ```bash
   npm list --depth=0
   ```

## Getting Help

If problems persist:
1. Check browser console errors (F12)
2. Check terminal errors
3. Try incognito/private mode
4. Restart computer (sometimes helps!)

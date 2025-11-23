# MCP DevTools - Troubleshooting Guide

## Mengatasi Error 413 "Request Entity Too Large"

### Penyebab
Error ini terjadi ketika screenshot yang diambil MCP DevTools terlalu besar untuk dikembalikan dalam response API (biasanya > 10MB).

### Solusi

#### ✅ Solusi 1: Simpan Screenshot ke File (REKOMENDASI)
```javascript
// ❌ SALAH - Response terlalu besar
take_screenshot()

// ✅ BENAR - Simpan langsung ke file
take_screenshot({ 
  filePath: "./screenshots/page.jpg",
  format: "jpeg",
  quality: 75 
})
```

#### ✅ Solusi 2: Gunakan Kompresi
```javascript
// Format JPEG dengan quality rendah = file lebih kecil
take_screenshot({ 
  filePath: "./temp/page.jpg",
  format: "jpeg",  // atau "webp"
  quality: 60      // 0-100, semakin rendah semakin kecil
})
```

#### ✅ Solusi 3: Screenshot Elemen Spesifik
```javascript
// 1. Ambil snapshot dulu untuk dapat uid
take_snapshot()

// 2. Screenshot hanya elemen tertentu (lebih kecil)
take_screenshot({ 
  filePath: "./screenshots/element.png",
  uid: "navbar-123" 
})
```

#### ✅ Solusi 4: Resize Halaman Dulu
```javascript
// Kecilkan viewport sebelum screenshot
resize_page({ width: 800, height: 600 })
take_screenshot({ 
  filePath: "./screenshots/small.jpg",
  format: "jpeg",
  quality: 70
})
```

#### ✅ Solusi 5: Gunakan Snapshot untuk Inspeksi
```javascript
// Untuk debugging UI, gunakan text snapshot (lebih efisien)
take_snapshot({ filePath: "./snapshots/page.txt" })
// Ini mengembalikan struktur UI dalam text, bukan gambar
```

---

## Konfigurasi MCP DevTools

File konfigurasi: `~/.factory/mcp.json`

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "disabled": false  // Ubah ke true untuk disable
    }
  }
}
```

### Cara Disable/Enable MCP DevTools

```bash
# Disable
# Edit ~/.factory/mcp.json, ubah "disabled": true

# Enable
# Edit ~/.factory/mcp.json, ubah "disabled": false

# Restart Droid setelah perubahan
```

---

## Best Practices

### 1. Screenshot Workflow
```bash
# Buat folder dulu
mkdir -p screenshots

# Ambil screenshot dengan best practices
take_screenshot({
  filePath: "./screenshots/$(date +%Y%m%d-%H%M%S).jpg",
  format: "jpeg",
  quality: 75
})
```

### 2. Full Page Screenshot
```javascript
// Full page bisa SANGAT besar, selalu gunakan kompresi!
take_screenshot({
  fullPage: true,
  filePath: "./screenshots/fullpage.jpg",
  format: "jpeg",
  quality: 60  // Quality rendah untuk full page
})
```

### 3. Debugging UI (Preferred)
```javascript
// Untuk inspeksi struktur UI, snapshot lebih efisien
take_snapshot({ verbose: false })  // Text output, ringan
```

---

## Environment Variables (Optional)

Jika ingin set default behavior, bisa tambahkan env vars:

```bash
# Di .env atau ~/.zshrc
export MCP_DEVTOOLS_SCREENSHOT_DIR="./screenshots"
export MCP_DEVTOOLS_SCREENSHOT_FORMAT="jpeg"
export MCP_DEVTOOLS_SCREENSHOT_QUALITY="75"
```

---

## Troubleshooting

### Error masih terjadi setelah gunakan filePath?
- Pastikan path folder exist: `mkdir -p screenshots`
- Cek permission: `chmod 755 screenshots`
- Gunakan absolute path: `take_screenshot({ filePath: "/absolute/path/to/file.jpg" })`

### Screenshot tidak tersimpan?
```bash
# Cek apakah file tergenerate
ls -lah screenshots/

# Cek logs
tail -f ~/.factory/logs/mcp-chrome-devtools.log
```

### Mau disable auto-screenshot sementara?
```bash
# Edit ~/.factory/mcp.json
# Set "disabled": true pada chrome-devtools
# Restart Factory/Droid
```

---

## Quick Reference

| Command | Size | Speed | Quality | Use Case |
|---------|------|-------|---------|----------|
| `take_snapshot()` | Minimal | ⚡⚡⚡ | N/A | Debug UI, inspeksi |
| `take_screenshot({ uid })` | Small | ⚡⚡ | High | Specific element |
| `take_screenshot({ format: "jpeg", quality: 60 })` | Medium | ⚡ | Medium | Full viewport |
| `take_screenshot({ fullPage: true })` | HUGE ❌ | 🐌 | High | Avoid! Use filePath |

---

## Droid Helper

Sudah dibuat droid helper: `.factory/droids/devtools-screenshot-safe.json`

Droid ini otomatis menerapkan best practices saat Anda minta screenshot.

Trigger keywords:
- "screenshot"
- "capture"
- "snap"
- "ambil gambar"

---

## Support

Jika masalah berlanjut:
1. Cek versi MCP DevTools: `npx chrome-devtools-mcp@latest --version`
2. Update ke latest: otomatis via `@latest` tag
3. Cek Factory logs: `~/.factory/logs/`
4. Report issue: https://github.com/modelcontextprotocol/servers

---

**Last Updated:** 2025-11-23

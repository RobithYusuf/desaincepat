# DesainCepat

Aplikasi web untuk membuat thumbnail dan desain grafis berkualitas tinggi dengan cepat dan mudah. Dibangun dengan Next.js 14, TypeScript, Tailwind CSS, dan Zustand.

## ✨ Fitur Utama

### 🎨 Canvas & Preview
- **Real-time Preview** - Lihat perubahan design secara instant
- **Zoom Controls** - Zoom in/out untuk detail checking (25% - 200%)
- **Fit to Screen** - Auto-adjust canvas ke ukuran viewport optimal
- **Responsive Canvas** - Canvas menyesuaikan dengan ukuran layar

### 📐 Frame & Layout
- **Frame Presets** dengan dimensi terbaru 2025:
  - YouTube Thumbnail (1280×720) - 16:9
  - Instagram Portrait (1080×1350) - 4:5 [37% higher engagement!]
  - Twitter Banner (1500×500) - 3:1
  - Custom Size - Bebas atur dimensi sesuai kebutuhan
- **Padding Control** - Atur spacing 0-100px dengan slider

### 🎨 Background & Design
- **181 Gradient Presets** - Dari LazyLayers (linear, radial, conic)
- **60 Image Backgrounds** - 40 LazyLayers + 20 curated Unsplash
- **Solid Colors** - Color picker dengan real-time preview
- **Noise Texture Overlay** - Adjustable intensity 0-100%

### ✍️ Typography & Text
- **20+ Google Fonts** - Inter, Poppins, Montserrat, Roboto, dll
- **Text Controls**:
  - Font size (12-200px)
  - Line height (0.8-2.0)
  - Text alignment (left, center, right)
  - Font color picker
  - Font weight (300-900)

### 💾 Export & Templates
- **High Quality Export** - 3 preset kualitas:
  - Standard (85%, 1x) - File kecil
  - Best (92%, 2x) - Balanced (Recommended)
  - Maximum (100%, 3x) - Kualitas terbaik
- **Template System** - Simpan dan load konfigurasi design
- **LocalStorage Persist** - Templates tersimpan otomatis

### 📱 UI/UX
- **Fully Responsive** - Mobile, tablet, desktop optimized
- **Mobile Sidebar** - Overlay dengan backdrop blur
- **Professional Landing Page** - Hero section dengan CTA
- **Smooth Animations** - Transitions dan hover effects
- 🐳 **Docker Ready** - Production-ready containerization

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Docker

```bash
# Production build
docker-compose up app

# Development with hot reload
docker-compose --profile dev up dev
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (with persist middleware)
- **Fonts**: Google Fonts (20+ families)
- **Icons**: Lucide React
- **Export**: html-to-image
- **Containerization**: Docker (Multi-stage build)

## 📁 Project Structure

```
desaincepat/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Landing page (homepage)
│   ├── editor/                   # Editor page
│   │   └── page.tsx             # Main editor interface
│   ├── tutorial/                 # Tutorial page
│   │   └── page.tsx
│   └── globals.css               # Global styles & Tailwind
├── components/                    # React components
│   ├── Canvas.tsx                # Preview canvas with zoom
│   ├── Sidebar.tsx               # Desktop sidebar controls
│   ├── MobileSidebar.tsx         # Mobile sidebar overlay
│   ├── Navbar.tsx                # Top navigation bar
│   ├── ZoomControls.tsx          # Zoom in/out/fit controls
│   ├── FrameSizePaddingControls.tsx  # Frame & padding controls
│   ├── TemplateManager.tsx       # Save/load templates
│   ├── ExportModal.tsx           # Export dialog
│   ├── ProgressSlider.tsx        # Custom slider component
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── label.tsx
│       ├── slider.tsx
│       └── ...
├── store/                         # Zustand stores
│   └── design-store.ts           # Design state (with persist)
├── lib/                           # Utilities & data
│   ├── utils.ts                  # Helper functions
│   ├── gradients.ts              # 181 gradient presets
│   └── fonts.ts                  # Font family definitions
├── public/                        # Static assets
│   └── textures/                 # Noise textures
├── docs/                          # Documentation
│   ├── FEATURES.md
│   ├── RESPONSIVE.md
│   ├── ZOOM_FEATURE.md
│   └── ...
├── Dockerfile                     # Multi-stage build
├── docker-compose.yml            # Docker orchestration
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript config
```

## ⚙️ Configuration

### Frame Sizes (Updated 2025)

- **YouTube Thumbnail**: 1280 × 720 (16:9)
- **Instagram Portrait**: 1080 × 1350 (4:5) - Recommended for 37% higher engagement
- **Twitter Banner**: 1500 × 500 (3:1)
- **Custom**: Bebas atur width & height (100-5000px)

### Font Families (20+ Google Fonts)

**Sans-Serif:**
- Inter (Default), Poppins, Montserrat, Roboto, Open Sans, Lato, Nunito, Raleway, Work Sans, DM Sans

**Serif:**
- Playfair Display, Merriweather, Lora, Crimson Text

**Display:**
- Bebas Neue, Oswald, Anton

**Monospace:**
- Roboto Mono, JetBrains Mono, Fira Code

### Background Options

- **181 Gradients**: Linear, radial, conic dari LazyLayers
- **60 Images**: 40 LazyLayers + 20 Unsplash curated
- **Solid Colors**: Custom color picker
- **Noise Texture**: 0-100% intensity overlay

### Export Quality Presets

| Preset | Quality | Pixel Ratio | File Size | Use Case |
|--------|---------|-------------|-----------|----------|
| Standard | 85% | 1x | Small | Quick sharing |
| Best ⭐ | 92% | 2x | Medium | Recommended |
| Maximum | 100% | 3x | Large | Print quality |

## Development

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Docker Production

```bash
# Build image
docker build -t desaincepat .

# Run container
docker run -p 3000:3000 desaincepat
```

### Environment Variables

No environment variables required for basic functionality.

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Use Cases

- 📺 **YouTube Thumbnails** - Eye-catching video covers
- 📱 **Instagram Posts** - Engagement-optimized portraits
- 🐦 **Twitter Banners** - Professional profile headers
- 📊 **Social Media Graphics** - Quick design iterations
- 🎨 **Design Mockups** - Fast prototyping with templates
- 💼 **Marketing Materials** - Consistent brand visuals

## 📸 Screenshots

### Desktop Editor
Full-featured editor dengan real-time preview, extensive controls, dan template system.

### Mobile Interface
Touch-optimized dengan mobile sidebar, responsive canvas, dan simplified controls.

---

## 📚 Documentation

Dokumentasi lengkap tersedia di folder [`docs/`](./docs/):

- **[Features Guide](./docs/FEATURES.md)** - Daftar lengkap fitur dan penggunaan
- **[Responsive Design](./docs/RESPONSIVE.md)** - Panduan responsive untuk semua device
- **[Zoom Feature](./docs/ZOOM_FEATURE.md)** - Dokumentasi fitur zoom in/out
- **[Docker Deployment](./docs/DOCKER.md)** - Panduan deployment dengan Docker
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Solusi masalah umum
- **[Test Report](./docs/TEST_REPORT.md)** - Hasil testing aplikasi
- **[Changelog](./docs/CHANGELOG.md)** - Riwayat perubahan versi

---

## 🎨 Feature Highlights

### Template System
Simpan konfigurasi design favorit Anda dan load kapan saja. Templates tersimpan di localStorage browser.

```typescript
// Save template
saveTemplate("My Awesome Design")

// Load template
loadTemplate(templateId)

// Delete template
deleteTemplate(templateId)
```

### Zoom Controls
- **Zoom In**: Perbesar canvas hingga 200%
- **Zoom Out**: Perkecil canvas hingga 25%
- **Reset**: Kembali ke 100%
- **Fit to Screen**: Auto-adjust ke viewport

### Export Options
Export PNG dengan 3 preset kualitas. File akan didownload otomatis dengan nama `desaincepat-{timestamp}.png`.

---

## 🚀 Performance

- ⚡ **Fast Load Time** - Optimized bundle size
- 🎯 **Real-time Updates** - Zustand state management
- 📦 **Lazy Loading** - Components loaded on demand
- 🖼️ **Optimized Images** - Next.js Image optimization
- 💾 **LocalStorage Persist** - Templates saved locally

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests
- 📝 Improve documentation

---

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Credits & Inspiration

- **Design Inspiration**: [LazyLayers](https://lazylayers.ahmadrosid.com/thumbnail) by Ahmad Rosid
- **Gradients**: 181 presets extracted from LazyLayers
- **Images**: LazyLayers backgrounds + Unsplash curated collection
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- 📖 Cek [Documentation](./docs/)
- 🐛 Report issues via GitHub Issues
- 💬 Diskusi via GitHub Discussions

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

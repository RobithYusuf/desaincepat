# DesainCepat

Aplikasi web untuk membuat thumbnail dan gradient berkualitas tinggi dengan cepat dan mudah. Dibangun dengan Next.js 14, TypeScript, Tailwind CSS, dan Zustand.

## ✨ Fitur Utama

### 🎨 Gradient Editor
- **Mesh Gradient Generator** - Generate gradient organik seperti Better Gradient
- **SVG Filters** - Blur dan grain effect dengan kualitas tinggi
- **Shape Rotation** - Rotate per-shape atau semua shapes sekaligus
- **Drag & Drop Points** - Adjust posisi dan vertices secara interaktif
- **My Gradients** - Save/load gradient ke localStorage dengan thumbnail preview (max 20)
- **Export Options** - PNG, WebP, SVG, CSS code, dan Share URL
- **Undo/Redo** - Full history support untuk semua actions

### 🖼️ Thumbnail Editor
- **Real-time Preview** - Lihat perubahan design secara instant
- **Multiple Presets** - YouTube, Instagram, Twitter, Custom size
- **Background Options** - Gradients, Images, Solid colors, Noise texture
- **Typography** - 26+ Google Fonts dengan full controls (font size 12-500px)
- **Template System** - Save dan load konfigurasi design
- **Bulk Mode** - Generate multiple thumbnails dengan text berbeda dalam satu batch
- **Undo/Redo** - Full history support dengan keyboard shortcuts (Ctrl+Z/Y)
- **AI Prompt Generator** - Generate prompt untuk Gemini AI image generation

### 📐 Canvas & Preview
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
- **IBM Plex Sans Condensed** - Modern default font dengan condensed look
- **26+ Google Fonts** - Inter, Poppins, Montserrat, Roboto, Bebas Neue, dll
- **Text Controls**:
  - Font size (12-200px)
  - Line height (0.8-2.0)
  - Text alignment (left, center, right)
  - Font color picker with hex input
  - Multiple font categories (Sans, Display, Serif, Handwriting, Monospace)

### 📦 Bulk Mode
- **Multiple Thumbnails** - Generate banyak thumbnail sekaligus dengan text berbeda
- **Per-Item Customization** - Custom background dan typography untuk setiap item
- **Preview Grid** - Lihat semua thumbnails dalam grid responsive
- **Batch Export** - Download sebagai ZIP atau multiple files
- **Bulk Undo/Redo** - History tracking untuk perubahan bulk

### 🤖 AI Prompt Generator
- **Smart Prompt Generation** - Generate prompt optimal untuk Gemini AI
- **Platform-Aware** - Prompt menyesuaikan dengan frame size (YouTube/Instagram/Twitter)
- **Style Options** - 10 visual styles (Modern Gradient, Minimalist, Cinematic, dll)
- **Audience Targeting** - 7 audience types untuk prompt yang lebih relevan
- **API Integration** - Support Gemini API untuk direct image generation
- **Copy & Go** - Copy prompt dan redirect ke Google AI Studio

### 💾 Export & Templates
- **High Quality Export** - 3 preset kualitas:
  - Normal (1x) - File kecil, quick sharing
  - HD (2x) - Balanced quality (Recommended)
  - Ultra HD (3x) - Maximum quality untuk print
- **Template System** - Simpan dan load konfigurasi design
- **LocalStorage Persist** - Templates tersimpan otomatis

### 📱 UI/UX
- **Fully Responsive** - Mobile, tablet, desktop optimized dengan adaptive 3D layouts
- **Centered Navigation** - Modern sticky navbar dengan backdrop blur effect
- **Hero Section** - Centered 1-column layout dengan 3D geometric background
- **Color Picker Enhancements** - Tooltips pada hover untuk semua colors/gradients/images
- **Optimized Scrolling** - Consistent padding dan spacing di semua tabs
- **Mobile Sidebar** - Touch-optimized overlay dengan backdrop blur
- **Smooth Animations** - Hardware-accelerated transitions dan hover effects
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
- **Gradient Rendering**: SVG + Canvas (feTurbulence, feSpecularLighting)
- **AI Integration**: Google Gemini API (optional)
- **Default Font**: IBM Plex Sans Condensed
- **Fonts**: Google Fonts (26+ families)
- **Icons**: Lucide React
- **Export**: html-to-image, Canvas API, JSZip (bulk export)
- **Containerization**: Docker (Multi-stage build)

## 📁 Project Structure

```
desaincepat/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Landing page (homepage)
│   ├── thumbnail/                # Thumbnail editor
│   │   └── page.tsx             # Main thumbnail interface
│   ├── gradient-editor/          # Gradient editor
│   │   └── page.tsx             # Mesh gradient generator
│   ├── tutorial/                 # Tutorial page
│   │   └── page.tsx
│   └── globals.css               # Global styles & Tailwind
├── components/                    # React components
│   ├── Canvas.tsx                # Preview canvas with zoom
│   ├── Sidebar.tsx               # Desktop sidebar controls
│   ├── Navbar.tsx                # Centered sticky navbar with backdrop blur
│   ├── GradientPicker.tsx        # Enhanced color picker with tooltips
│   ├── ZoomControls.tsx          # Zoom in/out/fit controls
│   ├── UndoRedoControls.tsx      # Undo/redo with keyboard shortcuts
│   ├── FrameSizePaddingControls.tsx  # Frame & padding controls
│   ├── TemplateManager.tsx       # Save/load templates
│   ├── ExportModal.tsx           # Export dialog
│   ├── PromptGeneratorModal.tsx  # AI prompt generator
│   ├── ApiKeySettingsModal.tsx   # Gemini API key settings
│   ├── bulk/                     # Bulk mode components
│   │   ├── BulkPreviewGrid.tsx   # Preview grid for bulk items
│   │   ├── BulkExportModal.tsx   # Bulk export (ZIP/multiple)
│   │   ├── BulkBackgroundPicker.tsx
│   │   └── BulkTypographyPicker.tsx
│   └── ui/                       # shadcn/ui components
├── store/                         # Zustand stores
│   ├── design-store.ts           # Design state (with persist & undo/redo)
│   └── bulk-store.ts             # Bulk mode state
├── lib/                           # Utilities & data
│   ├── utils.ts                  # Helper functions
│   ├── gradients.ts              # 181 gradient presets
│   ├── fonts.ts                  # Font family definitions
│   ├── prompt-templates.ts       # AI prompt templates
│   └── gemini-client.ts          # Gemini API client
├── hooks/                         # Custom React hooks
│   ├── useHistoryTracker.ts      # Single mode undo/redo
│   └── useBulkHistoryTracker.ts  # Bulk mode undo/redo
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

### Font Families (26+ Google Fonts)

**Default:**
- **IBM Plex Sans Condensed** (400, 500, 600, 700) - Modern condensed font untuk seluruh aplikasi

**Sans-Serif:**
- Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, Nunito, Raleway, Work Sans, PT Sans, Ubuntu, Plus Jakarta Sans

**Display & Bold:**
- Bebas Neue, Oswald, Righteous, Bangers, Russo One

**Serif:**
- Playfair Display, Merriweather

**Handwriting:**
- Dancing Script, Pacifico, Permanent Marker, Lobster

**Monospace:**
- Inconsolata, Fira Code, JetBrains Mono

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

- 📺 **YouTube Thumbnails** - Eye-catching video covers dengan modern design
- 📱 **Instagram Posts** - Engagement-optimized portraits
- 🐦 **Twitter Banners** - Professional profile headers
- 🎨 **Mesh Gradients** - Beautiful organic gradients untuk backgrounds
- 📊 **Social Media Graphics** - Quick design iterations dengan template system
- 💼 **Marketing Materials** - Consistent brand visuals dengan high-quality export
- 🖥️ **Website Backgrounds** - Export gradient sebagai CSS atau SVG

## 📸 Screenshots

### Landing Page
Modern hero section dengan centered navigation dan responsive layouts.

### Gradient Editor
Mesh gradient generator dengan SVG filters, shape rotation, dan export options.

### Thumbnail Editor
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

- ⚡ **Fast Load Time** - Optimized bundle size dengan code splitting
- 🎯 **Real-time Updates** - Zustand state management untuk instant UI updates
- 📦 **Lazy Loading** - Heavy modules loaded on demand
- 🎭 **SVG Caching** - Hash-based caching untuk skip redundant renders
- 🖼️ **Blob URL Rendering** - Faster image loading dari SVG
- 💾 **LocalStorage Persist** - Templates dan gradients saved locally
- 📱 **Responsive Canvas** - Canvas sizing menyesuaikan viewport

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

- **Gradient Inspiration**: [Better Gradient](https://better-gradient.com/) - SVG filter technique
- **Design Inspiration**: [LazyLayers](https://lazylayers.ahmadrosid.com/thumbnail) by Ahmad Rosid
- **Gradients**: 181 presets extracted from LazyLayers
- **Images**: LazyLayers backgrounds + Unsplash curated collection
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Default Font**: [IBM Plex Sans Condensed](https://fonts.google.com/specimen/IBM+Plex+Sans+Condensed) by Google Fonts

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- 📖 Cek [Documentation](./docs/)
- 🐛 Report issues via GitHub Issues
- 💬 Diskusi via GitHub Discussions

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

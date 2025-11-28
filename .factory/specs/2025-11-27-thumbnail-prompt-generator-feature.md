## Fitur: Thumbnail Prompt Generator

### Overview
Menambahkan fitur untuk generate prompt professional untuk thumbnail dengan 2 metode:
1. **Copy Prompt** - Generate prompt template yang bisa di-copy dan paste ke AI Gemini (hemat cost)
2. **Direct Generate** - Generate langsung di platform menggunakan Gemini API

### File yang akan dibuat/dimodifikasi

#### 1. Baru: `/components/PromptGeneratorModal.tsx`
Modal utama dengan 2 tab:
- **Tab Copy Prompt**: Form input → Generate template prompt → Copy to clipboard
- **Tab Direct Generate**: Form input → Call Gemini API → Display hasil JSON

```tsx
// Struktur Modal
<Dialog>
  <Tabs>
    <Tab "Copy Prompt">
      - Input: Tema/topik thumbnail
      - Input: Gaya visual (colorful, minimalist, etc)
      - Input: Target audience
      - Button: Generate Prompt Template
      - Output: Textarea dengan prompt siap copy
      - Button: Copy to Clipboard
    </Tab>
    <Tab "AI Generate">
      - Same inputs
      - Button: Generate with AI
      - Output: JSON result (title, colors, typography, etc)
      - Button: Apply to Canvas
    </Tab>
  </Tabs>
</Dialog>
```

#### 2. Baru: `/components/ApiKeySettingsModal.tsx`
Modal untuk setup API key Gemini:
- Input API key (password field)
- Simpan ke localStorage
- Link ke Google AI Studio untuk get API key
- Test connection button

#### 3. Baru: `/lib/gemini-client.ts`
Client untuk Gemini API:
```typescript
import { GoogleGenAI, Type } from '@google/genai';

// Schema untuk thumbnail suggestion
const thumbnailSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    primaryColor: { type: Type.STRING },
    secondaryColor: { type: Type.STRING },
    fontFamily: { type: Type.STRING },
    style: { type: Type.STRING },
    visualElements: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

export async function generateThumbnailSuggestion(
  apiKey: string,
  topic: string,
  style: string,
  audience: string
): Promise<ThumbnailSuggestion>
```

#### 4. Baru: `/lib/prompt-templates.ts`
Template prompt untuk copy mode:
```typescript
export function buildCopyPrompt(
  topic: string, 
  style: string, 
  audience: string
): string {
  return `Kamu adalah desainer thumbnail YouTube profesional...
  
  Topik: ${topic}
  Gaya: ${style}
  Target: ${audience}
  
  Berikan response dalam format JSON:
  {
    "title": "...",
    "colors": {...},
    ...
  }`;
}
```

#### 5. Modifikasi: `/app/thumbnail/page.tsx`
- Tambah button "AI Prompt" di area canvas (sebelah zoom controls)
- Import dan render PromptGeneratorModal

### Dependencies
```bash
npm install @google/genai
```

### localStorage Keys
- `gemini_api_key` - API key Gemini

### UI Flow
1. User klik tombol "✨ AI Prompt" di canvas
2. Modal muncul dengan 2 tab
3. **Tab Copy**: User isi form → Generate → Copy prompt → Paste di Gemini web
4. **Tab Generate**: User isi form → Klik Generate → API call → Hasil JSON tampil → Apply ke canvas

### Prompt Schema Output
```json
{
  "title": "Tutorial React Hooks",
  "subtitle": "Panduan Lengkap untuk Pemula",
  "primaryColor": "#667eea",
  "secondaryColor": "#764ba2",
  "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "fontFamily": "Montserrat",
  "fontSize": 72,
  "textAlign": "center",
  "style": "modern-gradient",
  "visualElements": ["code icon", "arrow", "developer illustration"]
}
```

### Security
- API key disimpan di localStorage (client-side only)
- Tidak ada backend call - langsung ke Gemini API
- User bertanggung jawab atas API key mereka sendiri
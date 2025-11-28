// ============================================
// Gemini API Client for Thumbnail Image Generation
// ============================================

const LOCALSTORAGE_KEY = 'gemini_api_key';
const IMAGE_MODEL = 'gemini-2.0-flash-exp';

// ============================================
// API Key Management
// ============================================

export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCALSTORAGE_KEY);
}

export function saveApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALSTORAGE_KEY, apiKey);
}

export function removeApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCALSTORAGE_KEY);
}

export function hasApiKey(): boolean {
  return !!getStoredApiKey();
}

// ============================================
// API Functions
// ============================================

export async function testApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (response.ok) {
      return { valid: true };
    }
    
    const data = await response.json();
    if (data.error) {
      return { valid: false, error: data.error.message || 'API key tidak valid' };
    }
    
    return { valid: false, error: 'API key tidak valid' };
  } catch (error) {
    return { valid: false, error: 'Gagal menghubungi server' };
  }
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

/**
 * Generate optimal prompt using AI (for Copy Prompt tab)
 * Uses JSON config to generate a professional, optimized prompt
 */
export async function generateOptimalPrompt(
  jsonConfig: object
): Promise<{ success: true; prompt: string } | { success: false; error: string }> {
  const apiKey = getStoredApiKey();
  
  if (!apiKey) {
    return { success: false, error: 'API key belum diatur' };
  }

  const systemPrompt = `You are an expert AI prompt engineer specializing in image generation prompts for YouTube thumbnails.

Your task: Convert this JSON configuration into an optimal, detailed prompt for Gemini image generation.

RULES:
1. Output ONLY the prompt text, no explanations or markdown
2. Use vivid, cinematic, descriptive language
3. Be specific about colors, lighting, composition, mood
4. CRITICAL: Emphasize text rendering requirements (large, bold, readable text)
5. Keep it concise but comprehensive (max 250 words)
6. Use natural flowing language, avoid bullet points
7. Focus on visual details that make thumbnails click-worthy
8. Include specific font recommendations and text placement

JSON Configuration:
${JSON.stringify(jsonConfig, null, 2)}

Generate the optimal image generation prompt:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || 'Gagal generate prompt' };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return { success: false, error: 'AI tidak menghasilkan response' };
    }

    return { success: true, prompt: text.trim() };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function generateThumbnailImage(
  prompt: string
): Promise<{ success: true; data: GeneratedImage } | { success: false; error: string }> {
  const apiKey = getStoredApiKey();
  
  if (!apiKey) {
    return { success: false, error: 'API key belum diatur' };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error?.message || 'Gagal generate gambar';
      
      if (errorMsg.includes('API_KEY_INVALID') || response.status === 401) {
        return { success: false, error: 'API key tidak valid' };
      }
      if (errorMsg.includes('QUOTA') || response.status === 429) {
        return { success: false, error: 'Quota API habis. Coba lagi nanti.' };
      }
      if (errorMsg.includes('not found') || response.status === 404) {
        return { success: false, error: 'Model tidak tersedia. Pastikan API key memiliki akses.' };
      }
      
      return { success: false, error: errorMsg };
    }

    const data = await response.json();
    
    // Extract image from response
    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
      return { success: false, error: 'Tidak ada response dari AI' };
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      return { success: false, error: 'Response tidak memiliki content' };
    }

    // Find image part
    for (const part of parts) {
      if (part.inlineData) {
        return {
          success: true,
          data: {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png',
          },
        };
      }
    }

    // Check if there's text response (model might not support image generation)
    for (const part of parts) {
      if (part.text) {
        return { 
          success: false, 
          error: 'Model tidak menghasilkan gambar. Coba gunakan Copy Prompt dan paste ke Google AI Studio.' 
        };
      }
    }

    return { success: false, error: 'AI tidak menghasilkan gambar. Coba lagi.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error: ${message}` };
  }
}

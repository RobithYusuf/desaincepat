// ============================================
// Gemini API Client for Thumbnail Image Generation
// ============================================

const LOCALSTORAGE_KEY = 'gemini_api_key';
const LOCALSTORAGE_MODEL_KEY = 'gemini_image_model';

// ============================================
// Available Image Generation Models
// ============================================

export type ImageModelId = 
  | 'gemini-2.5-flash-image'
  | 'gemini-3-pro-image-preview';

export interface ImageModelInfo {
  id: ImageModelId;
  name: string;
  category: 'quality' | 'premium';
  price: string;
  pricePerImage: number; // in USD
  description: string;
  supports4K: boolean;
  needsResponseModalities: boolean; // Some models need explicit responseModalities
}

export const IMAGE_MODELS: ImageModelInfo[] = [
  {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash Image',
    category: 'quality',
    price: '$0.039/gambar',
    pricePerImage: 0.039,
    description: 'Cepat & murah, recommended untuk thumbnail',
    supports4K: false,
    needsResponseModalities: false, // Doesn't need responseModalities
  },
  {
    id: 'gemini-3-pro-image-preview',
    name: 'Gemini 3 Pro Image',
    category: 'premium',
    price: '$0.13-0.24/gambar',
    pricePerImage: 0.134,
    description: 'Kualitas terbaik dengan dukungan 4K',
    supports4K: true,
    needsResponseModalities: true, // Needs explicit responseModalities
  },
];

// Default model
const DEFAULT_IMAGE_MODEL: ImageModelId = 'gemini-2.5-flash-image';

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
// Model Selection Management
// ============================================

export function getStoredModel(): ImageModelId {
  if (typeof window === 'undefined') return DEFAULT_IMAGE_MODEL;
  const stored = localStorage.getItem(LOCALSTORAGE_MODEL_KEY);
  if (stored && IMAGE_MODELS.some(m => m.id === stored)) {
    return stored as ImageModelId;
  }
  return DEFAULT_IMAGE_MODEL;
}

export function saveModel(modelId: ImageModelId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALSTORAGE_MODEL_KEY, modelId);
}

export function getModelInfo(modelId: ImageModelId): ImageModelInfo | undefined {
  return IMAGE_MODELS.find(m => m.id === modelId);
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

// Valid aspect ratios for Gemini 3 Pro Image (Nano Banana Pro)
export type ImageAspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '4:5' | '5:4' | '9:16' | '16:9' | '21:9';
export type ImageResolution = '1K' | '2K' | '4K';

// Maximum resolutions for each aspect ratio at 4K
export const ASPECT_RATIO_RESOLUTIONS: Record<ImageAspectRatio, { width: number; height: number }> = {
  '1:1': { width: 4096, height: 4096 },
  '2:3': { width: 3392, height: 5056 },
  '3:2': { width: 5056, height: 3392 },
  '3:4': { width: 3584, height: 4800 },
  '4:3': { width: 4800, height: 3584 },
  '4:5': { width: 3712, height: 4608 },
  '5:4': { width: 4608, height: 3712 },
  '9:16': { width: 3072, height: 5504 },
  '16:9': { width: 5504, height: 3072 },
  '21:9': { width: 6336, height: 2688 },
};

// Find best aspect ratio for given dimensions
export function findBestAspectRatio(width: number, height: number): ImageAspectRatio {
  const targetRatio = width / height;
  
  const aspectRatios: { ratio: ImageAspectRatio; value: number }[] = [
    { ratio: '1:1', value: 1 },
    { ratio: '2:3', value: 2/3 },
    { ratio: '3:2', value: 3/2 },
    { ratio: '3:4', value: 3/4 },
    { ratio: '4:3', value: 4/3 },
    { ratio: '4:5', value: 4/5 },
    { ratio: '5:4', value: 5/4 },
    { ratio: '9:16', value: 9/16 },
    { ratio: '16:9', value: 16/9 },
    { ratio: '21:9', value: 21/9 },
  ];

  let bestMatch = aspectRatios[0];
  let smallestDiff = Math.abs(targetRatio - bestMatch.value);

  for (const ar of aspectRatios) {
    const diff = Math.abs(targetRatio - ar.value);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestMatch = ar;
    }
  }

  return bestMatch.ratio;
}

// Check if frame size can be supported
export function getRecommendedFrameSize(width: number, height: number): { 
  supported: boolean; 
  aspectRatio: ImageAspectRatio;
  maxWidth: number;
  maxHeight: number;
  message?: string;
} {
  const aspectRatio = findBestAspectRatio(width, height);
  const maxRes = ASPECT_RATIO_RESOLUTIONS[aspectRatio];
  
  const supported = width <= maxRes.width && height <= maxRes.height;
  
  return {
    supported,
    aspectRatio,
    maxWidth: maxRes.width,
    maxHeight: maxRes.height,
    message: supported 
      ? undefined 
      : `Frame size ${width}×${height} exceeds max ${maxRes.width}×${maxRes.height} for ${aspectRatio}. Image may not fill canvas perfectly.`
  };
}

export async function generateThumbnailImage(
  prompt: string,
  aspectRatio: ImageAspectRatio = '16:9',
  resolution: ImageResolution = '2K',
  modelId?: ImageModelId
): Promise<{ success: true; data: GeneratedImage } | { success: false; error: string }> {
  const apiKey = getStoredApiKey();
  
  if (!apiKey) {
    return { success: false, error: 'API key belum diatur' };
  }

  const selectedModel = modelId || getStoredModel();
  const modelInfo = getModelInfo(selectedModel);
  
  if (!modelInfo) {
    return { success: false, error: 'Model tidak valid' };
  }

  // Adjust resolution based on model capability
  const finalResolution = modelInfo.supports4K ? resolution : (resolution === '4K' ? '2K' : resolution);

  try {
    // Build request body based on model requirements
    const requestBody: Record<string, unknown> = {
      contents: [{
        parts: [{ text: prompt }]
      }],
    };

    // Configure generationConfig based on model type
    if (modelInfo.needsResponseModalities) {
      // Gemini 3 Pro Image: needs responseModalities + full imageConfig
      requestBody.generationConfig = {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: finalResolution,
        }
      };
    } else {
      // Gemini 2.5 Flash Image: only needs imageConfig with aspectRatio
      requestBody.generationConfig = {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      };
    }
    
    console.log('[Gemini] Generating image:', { model: selectedModel, aspectRatio, resolution: finalResolution });

    // Gemini API for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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
        return { success: false, error: `Model ${modelInfo.name} tidak tersedia. Coba model lain.` };
      }
      if (errorMsg.includes('not supported') || errorMsg.includes('not enabled')) {
        return { success: false, error: `Model ${modelInfo.name} belum diaktifkan untuk API key ini.` };
      }
      
      return { success: false, error: errorMsg };
    }

    const data = await response.json();
    
    // Handle Gemini API response format
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
        // Log image info for debugging
        const base64 = part.inlineData.data;
        const sizeKB = Math.round((base64.length * 3/4) / 1024);
        console.log('[Gemini] Image received:', { 
          mimeType: part.inlineData.mimeType,
          sizeKB: `${sizeKB} KB`,
          requestedAspectRatio: aspectRatio,
        });
        
        return {
          success: true,
          data: {
            base64: base64,
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
          error: `Model ${modelInfo.name} tidak menghasilkan gambar. Coba model lain atau gunakan Copy Prompt.` 
        };
      }
    }

    return { success: false, error: 'AI tidak menghasilkan gambar. Coba lagi.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error: ${message}` };
  }
}

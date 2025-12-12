import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FrameSize = 'youtube' | 'instagram' | 'twitter' | 'custom';

export interface Template {
  id: string;
  name: string;
  createdAt: number;
  mode: 'single' | 'bulk';
  config: {
    text: string;
    fontSize: number;
    lineHeight: number;
    maxWidth: number;
    fontColor: string;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
    frameSize: FrameSize;
    customWidth: number;
    customHeight: number;
    padding: number;
    backgroundMode: 'solid' | 'gradient';
    backgroundColor: string;
    gradientPreset: GradientPreset;
    customGradient: string;
    textureEnabled: boolean;
    textureType: 'noise' | 'fine' | 'medium' | 'coarse' | 'paper';
    textureIntensity: number;
  };
}

export type GradientPreset = 
  | 'gradient-1'
  | 'gradient-2'
  | 'gradient-3'
  | 'gradient-4'
  | 'gradient-5'
  | 'gradient-6'
  | 'gradient-7'
  | 'gradient-8'
  | 'gradient-9'
  | 'gradient-10'
  | 'gradient-11'
  | 'gradient-12'
  | 'gradient-13'
  | 'gradient-14'
  | 'gradient-15'
  | 'gradient-16'
  | 'gradient-17'
  | 'gradient-18'
  | 'solid';

// Undoable state - properties that can be undone/redone
export interface UndoableState {
  text: string;
  fontSize: number;
  lineHeight: number;
  maxWidth: number;
  fontColor: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  frameSize: FrameSize;
  customWidth: number;
  customHeight: number;
  padding: number;
  backgroundMode: 'solid' | 'gradient';
  backgroundColor: string;
  gradientPreset: GradientPreset;
  customGradient: string;
  textureEnabled: boolean;
  textureType: 'noise' | 'fine' | 'medium' | 'coarse' | 'paper';
  textureIntensity: number;
}

export interface DesignState extends UndoableState {
  // Export properties (not undoable)
  fileName: string;
  exportQuality: number; // 0.1 to 1.0 (10% to 100%)
  exportPixelRatio: number; // 1 to 3

  // Zoom properties (not undoable)
  zoomLevel: number; // 0.25 to 2.0 (25% to 200%)

  // Background sizing for AI-generated images
  backgroundSizing: 'cover' | 'contain';

  // Templates (not undoable)
  templates: Template[];

  // AI Generation state
  isAIGenerating: boolean;

  // History for undo/redo
  history: UndoableState[];
  historyIndex: number;
  isUndoRedoAction: boolean; // Flag to prevent history push during undo/redo
}

export interface DesignActions {
  setText: (text: string) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setMaxWidth: (width: number) => void;
  setFontColor: (color: string) => void;
  setFontFamily: (family: string) => void;
  setTextAlign: (align: 'left' | 'center' | 'right') => void;
  setFrameSize: (size: FrameSize) => void;
  setCustomDimensions: (width: number, height: number) => void;
  setPadding: (padding: number) => void;
  setBackgroundMode: (mode: 'solid' | 'gradient') => void;
  setBackgroundColor: (color: string) => void;
  setGradientPreset: (preset: GradientPreset) => void;
  setCustomGradient: (gradient: string) => void;
  setTextureEnabled: (enabled: boolean) => void;
  setTextureType: (type: 'noise' | 'fine' | 'medium' | 'coarse' | 'paper') => void;
  setTextureIntensity: (intensity: number) => void;
  setFileName: (name: string) => void;
  setExportQuality: (quality: number) => void;
  setExportPixelRatio: (ratio: number) => void;
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setBackgroundSizing: (sizing: 'cover' | 'contain') => void;
  setIsAIGenerating: (isGenerating: boolean) => void;
  exportAsImage: (fileName?: string, options?: ExportOptions) => Promise<void>;
  getFrameDimensions: () => { width: number; height: number };
  
  // Template actions
  saveTemplate: (name: string, mode: 'single' | 'bulk') => void;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  getCurrentConfig: () => Template['config'];

  // Undo/Redo actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  pushToHistory: () => void;
}

export type DesignStore = DesignState & DesignActions;

export type ExportFormat = 'png' | 'jpeg' | 'webp';

export interface ExportOptions {
  format?: ExportFormat;
  pixelRatio?: number;
  quality?: number; // 0-1, only for JPEG/WebP
}

const FRAME_DIMENSIONS = {
  youtube: { width: 1280, height: 720 },
  instagram: { width: 1080, height: 1350 }, // Updated to 4:5 Portrait (2025 recommended)
  twitter: { width: 1500, height: 500 },
  custom: { width: 1200, height: 630 },
};

// Direct export for AI-generated images using native canvas
// This avoids html-to-image issues with large base64 data URLs
async function exportAIImageDirect(
  imageDataUrl: string,
  text: string,
  textStyle: {
    fontSize: number;
    fontColor: string;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: number;
    maxWidth: number;
    padding: number;
  },
  canvasWidth: number,
  canvasHeight: number,
  backgroundSizing: 'cover' | 'contain',
  fileName: string,
  format: ExportFormat,
  quality: number,
  pixelRatio: number
): Promise<void> {
  const width = canvasWidth * pixelRatio;
  const height = canvasHeight * pixelRatio;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill dark background for contain mode
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);

  // Load and draw AI image
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (backgroundSizing === 'contain') {
        const scale = Math.min(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        // cover
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
      resolve();
    };
    img.onerror = () => reject(new Error('Failed to load AI image'));
    img.src = imageDataUrl;
  });

  // Draw text if not empty
  if (text && text.trim() && text !== 'Text Kamu Disini...') {
    const fontSize = textStyle.fontSize * pixelRatio;
    const padding = textStyle.padding * pixelRatio;
    
    // Map font family class to actual font
    const fontMap: Record<string, string> = {
      'font-inter': 'Inter, sans-serif',
      'font-roboto': 'Roboto, sans-serif',
      'font-poppins': 'Poppins, sans-serif',
      'font-montserrat': 'Montserrat, sans-serif',
      'font-bebas': '"Bebas Neue", sans-serif',
      'font-oswald': 'Oswald, sans-serif',
    };
    const fontFamily = fontMap[textStyle.fontFamily] || 'Inter, sans-serif';
    
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textStyle.fontColor;
    ctx.textAlign = textStyle.textAlign;
    ctx.textBaseline = 'middle';
    
    // Word wrap text
    const maxTextWidth = (width - padding * 2) * (textStyle.maxWidth / 100);
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    const lineHeight = fontSize * textStyle.lineHeight;
    const totalHeight = lines.length * lineHeight;
    const startY = (height - totalHeight) / 2 + lineHeight / 2;
    
    // Draw text shadow for readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8 * pixelRatio;
    ctx.shadowOffsetX = 2 * pixelRatio;
    ctx.shadowOffsetY = 2 * pixelRatio;
    
    const x = textStyle.textAlign === 'left' ? padding : 
              textStyle.textAlign === 'right' ? width - padding : 
              width / 2;
    
    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * lineHeight);
    });
  }

  // Export
  let mimeType: string;
  let extension: string;
  switch (format) {
    case 'jpeg':
      mimeType = 'image/jpeg';
      extension = 'jpg';
      break;
    case 'webp':
      mimeType = 'image/webp';
      extension = 'webp';
      break;
    default:
      mimeType = 'image/png';
      extension = 'png';
  }

  const dataUrl = canvas.toDataURL(mimeType, format === 'png' ? undefined : quality);
  const link = document.createElement('a');
  link.download = `${fileName}.${extension}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      // Initial state
      text: 'Text Kamu Disini...',
      fontSize: 72,
      lineHeight: 1.2,
      maxWidth: 80,
      fontColor: '#ffffff',
      fontFamily: 'font-inter',
      textAlign: 'center',

      frameSize: 'youtube',
      customWidth: 1200,
      customHeight: 630,
      padding: 60,

      backgroundMode: 'gradient',
      backgroundColor: '#6366f1',
      gradientPreset: 'gradient-2',
      customGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      
      textureEnabled: true,
      textureType: 'noise',
      textureIntensity: 100,

      fileName: 'thumbnail',
      exportQuality: 0.92, // 92% quality (good balance)
      exportPixelRatio: 2, // 2x for retina displays

      zoomLevel: 1, // 100% default

      backgroundSizing: 'cover', // 'cover' fills canvas, 'contain' shows full image
      
      templates: [], // No templates initially

      // AI Generation state
      isAIGenerating: false,

      // History for undo/redo
      history: [],
      historyIndex: -1,
      isUndoRedoAction: false,

  // Actions
  setText: (text) => set({ text }),
  setFontSize: (fontSize) => set({ fontSize }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
  setMaxWidth: (maxWidth) => set({ maxWidth }),
  setFontColor: (fontColor) => set({ fontColor }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setTextAlign: (textAlign) => set({ textAlign }),
  setFrameSize: (frameSize) => set({ frameSize }),
  setCustomDimensions: (width, height) =>
    set({ customWidth: width, customHeight: height }),
  setPadding: (padding) => set({ padding }),
  setBackgroundMode: (backgroundMode) => set({ backgroundMode }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setGradientPreset: (gradientPreset) => set({ gradientPreset }),
  setCustomGradient: (customGradient) => set({ customGradient }),
  setTextureEnabled: (textureEnabled) => set({ textureEnabled }),
  setTextureType: (textureType) => set({ textureType }),
  setTextureIntensity: (textureIntensity) => set({ textureIntensity }),
  setFileName: (fileName) => set({ fileName }),
  setExportQuality: (exportQuality) => set({ exportQuality }),
  setExportPixelRatio: (exportPixelRatio) => set({ exportPixelRatio }),

  setZoomLevel: (zoomLevel) => {
    const clampedZoom = Math.max(0.25, Math.min(2, zoomLevel));
    set({ zoomLevel: clampedZoom });
  },
  zoomIn: () => {
    const currentZoom = get().zoomLevel;
    const newZoom = Math.min(2, currentZoom + 0.25);
    set({ zoomLevel: newZoom });
  },
  zoomOut: () => {
    const currentZoom = get().zoomLevel;
    const newZoom = Math.max(0.25, currentZoom - 0.25);
    set({ zoomLevel: newZoom });
  },
  resetZoom: () => set({ zoomLevel: 1 }),
  setBackgroundSizing: (backgroundSizing) => set({ backgroundSizing }),
  setIsAIGenerating: (isAIGenerating) => set({ isAIGenerating }),

  exportAsImage: async (customFileName?: string, options?: ExportOptions) => {
    const state = get();
    const element = document.getElementById('canvas-export');
    if (!element) {
      console.error('Export failed: canvas-export element not found');
      return;
    }

    const format = options?.format || 'png';
    const pixelRatio = options?.pixelRatio || state.exportPixelRatio;
    const quality = options?.quality || state.exportQuality;

    // Check if using AI-generated image (data URL in customGradient)
    const hasDataUrlBackground = state.customGradient?.includes('data:image');

    // For AI-generated images, use direct canvas export (avoids html-to-image stack overflow)
    if (hasDataUrlBackground) {
      try {
        // Extract the data URL from customGradient (format: "url(data:image/...)")
        const dataUrlStart = state.customGradient.indexOf('data:');
        const dataUrlEnd = state.customGradient.lastIndexOf(')');
        const imageDataUrl = state.customGradient.substring(dataUrlStart, dataUrlEnd);
        
        const dimensions = state.frameSize === 'custom' 
          ? { width: state.customWidth, height: state.customHeight }
          : FRAME_DIMENSIONS[state.frameSize];
        
        await exportAIImageDirect(
          imageDataUrl,
          state.text,
          {
            fontSize: state.fontSize,
            fontColor: state.fontColor,
            fontFamily: state.fontFamily,
            textAlign: state.textAlign,
            lineHeight: state.lineHeight,
            maxWidth: state.maxWidth,
            padding: state.padding,
          },
          dimensions.width,
          dimensions.height,
          state.backgroundSizing,
          customFileName || state.fileName,
          format,
          quality,
          pixelRatio
        );
        return;
      } catch (error) {
        console.error('AI image export failed:', error);
        alert('Export gagal. Coba refresh halaman dan generate ulang.');
        return;
      }
    }

    // Standard export for non-AI images using html-to-image
    try {
      const htmlToImage = await import('html-to-image');
      
      const baseOptions = {
        pixelRatio,
        cacheBust: true,
        includeQueryParams: true,
        skipAutoScale: true,
        backgroundColor: undefined,
        skipFonts: false,
        filter: (node: HTMLElement) => {
          if (node.style?.display === 'none') return false;
          if (node.classList?.contains('animate-spin')) return false;
          return true;
        },
      };

      let dataUrl: string;
      let fileExtension: string;

      switch (format) {
        case 'jpeg':
          dataUrl = await htmlToImage.toJpeg(element, { ...baseOptions, quality });
          fileExtension = 'jpg';
          break;
        case 'webp':
          const canvas = await htmlToImage.toCanvas(element, baseOptions);
          dataUrl = canvas.toDataURL('image/webp', quality);
          fileExtension = 'webp';
          break;
        case 'png':
        default:
          dataUrl = await htmlToImage.toPng(element, baseOptions);
          fileExtension = 'png';
          break;
      }

      if (!dataUrl || !dataUrl.startsWith('data:image')) {
        throw new Error('Failed to generate valid image data');
      }

      const link = document.createElement('a');
      link.download = `${customFileName || state.fileName}.${fileExtension}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export gagal. Coba gunakan gradient biasa atau refresh halaman.');
    }
  },

  getFrameDimensions: () => {
    const state = get();
    if (state.frameSize === 'custom') {
      return { width: state.customWidth, height: state.customHeight };
    }
    return FRAME_DIMENSIONS[state.frameSize];
  },

  getCurrentConfig: () => {
    const state = get();
    return {
      text: state.text,
      fontSize: state.fontSize,
      lineHeight: state.lineHeight,
      maxWidth: state.maxWidth,
      fontColor: state.fontColor,
      fontFamily: state.fontFamily,
      textAlign: state.textAlign,
      frameSize: state.frameSize,
      customWidth: state.customWidth,
      customHeight: state.customHeight,
      padding: state.padding,
      backgroundMode: state.backgroundMode,
      backgroundColor: state.backgroundColor,
      gradientPreset: state.gradientPreset,
      customGradient: state.customGradient,
      textureEnabled: state.textureEnabled,
      textureType: state.textureType,
      textureIntensity: state.textureIntensity,
    };
  },

  saveTemplate: (name: string, mode: 'single' | 'bulk') => {
    const state = get();
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name,
      createdAt: Date.now(),
      mode,
      config: state.getCurrentConfig(),
    };
    
    set({ templates: [...state.templates, newTemplate] });
  },

  loadTemplate: (templateId: string) => {
    const state = get();
    const template = state.templates.find((t) => t.id === templateId);
    
    if (template) {
      set({
        text: template.config.text,
        fontSize: template.config.fontSize,
        lineHeight: template.config.lineHeight,
        maxWidth: template.config.maxWidth,
        fontColor: template.config.fontColor,
        fontFamily: template.config.fontFamily,
        textAlign: template.config.textAlign,
        frameSize: template.config.frameSize,
        customWidth: template.config.customWidth,
        customHeight: template.config.customHeight,
        padding: template.config.padding,
        backgroundMode: template.config.backgroundMode,
        backgroundColor: template.config.backgroundColor,
        gradientPreset: template.config.gradientPreset,
        customGradient: template.config.customGradient,
        textureEnabled: template.config.textureEnabled,
        textureType: template.config.textureType,
        textureIntensity: template.config.textureIntensity,
      });
    }
  },

  deleteTemplate: (templateId: string) => {
    const state = get();
    set({ templates: state.templates.filter((t) => t.id !== templateId) });
  },

  // Undo/Redo implementations
  pushToHistory: () => {
    const state = get();
    
    // Don't push to history if this is an undo/redo action
    if (state.isUndoRedoAction) return;

    // Create snapshot of current undoable state
    const snapshot: UndoableState = {
      text: state.text,
      fontSize: state.fontSize,
      lineHeight: state.lineHeight,
      maxWidth: state.maxWidth,
      fontColor: state.fontColor,
      fontFamily: state.fontFamily,
      textAlign: state.textAlign,
      frameSize: state.frameSize,
      customWidth: state.customWidth,
      customHeight: state.customHeight,
      padding: state.padding,
      backgroundMode: state.backgroundMode,
      backgroundColor: state.backgroundColor,
      gradientPreset: state.gradientPreset,
      customGradient: state.customGradient,
      textureEnabled: state.textureEnabled,
      textureType: state.textureType,
      textureIntensity: state.textureIntensity,
    };

    // Check if this snapshot is identical to the last one (avoid duplicates)
    const lastSnapshot = state.history[state.historyIndex];
    if (lastSnapshot && JSON.stringify(snapshot) === JSON.stringify(lastSnapshot)) {
      return; // Don't push duplicate state
    }

    // Remove any future history (if we're in the middle of history)
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    
    // Add new snapshot
    newHistory.push(snapshot);

    // Limit history to 50 items
    const limitedHistory = newHistory.slice(-50);

    set({
      history: limitedHistory,
      historyIndex: limitedHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    
    if (state.historyIndex <= 0) return;

    const newIndex = state.historyIndex - 1;
    const previousState = state.history[newIndex];

    if (previousState) {
      set({
        isUndoRedoAction: true,
        historyIndex: newIndex,
        ...previousState,
      });
      // Reset the flag after a delay to allow React to process
      setTimeout(() => set({ isUndoRedoAction: false }), 100);
    }
  },

  redo: () => {
    const state = get();
    
    if (state.historyIndex >= state.history.length - 1) return;

    const newIndex = state.historyIndex + 1;
    const nextState = state.history[newIndex];

    if (nextState) {
      set({
        isUndoRedoAction: true,
        historyIndex: newIndex,
        ...nextState,
      });
      // Reset the flag after a delay to allow React to process
      setTimeout(() => set({ isUndoRedoAction: false }), 100);
    }
  },

  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
}),
    {
      name: 'design-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        templates: state.templates,
      }),
    }
  )
);

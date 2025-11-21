import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FrameSize = 'youtube' | 'instagram' | 'twitter' | 'custom';

export interface Template {
  id: string;
  name: string;
  createdAt: number;
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

export interface DesignState {
  // Text properties
  text: string;
  fontSize: number;
  lineHeight: number;
  maxWidth: number;
  fontColor: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';

  // Frame properties
  frameSize: FrameSize;
  customWidth: number;
  customHeight: number;
  padding: number;

  // Background properties
  backgroundMode: 'solid' | 'gradient';
  backgroundColor: string;
  gradientPreset: GradientPreset;
  customGradient: string;
  
  // Texture properties
  textureEnabled: boolean;
  textureType: 'noise' | 'fine' | 'medium' | 'coarse' | 'paper';
  textureIntensity: number; // 0 to 100

  // Export properties
  fileName: string;
  exportQuality: number; // 0.1 to 1.0 (10% to 100%)
  exportPixelRatio: number; // 1 to 3

  // Zoom properties
  zoomLevel: number; // 0.25 to 2.0 (25% to 200%)

  // Templates
  templates: Template[];
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
  exportAsImage: (fileName?: string) => Promise<void>;
  getFrameDimensions: () => { width: number; height: number };
  
  // Template actions
  saveTemplate: (name: string) => void;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  getCurrentConfig: () => Template['config'];
}

export type DesignStore = DesignState & DesignActions;

const FRAME_DIMENSIONS = {
  youtube: { width: 1280, height: 720 },
  instagram: { width: 1080, height: 1350 }, // Updated to 4:5 Portrait (2025 recommended)
  twitter: { width: 1500, height: 500 },
  custom: { width: 1200, height: 630 },
};

export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      // Initial state
      text: 'Thumbnails Made Quicker Than Ever',
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
      
      templates: [], // No templates initially

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

  exportAsImage: async (customFileName?: string) => {
    const state = get();
    const element = document.getElementById('canvas-export');
    if (!element) return;

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(element, {
        quality: state.exportQuality,
        pixelRatio: state.exportPixelRatio,
      });

      const link = document.createElement('a');
      link.download = `${customFileName || state.fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
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

  saveTemplate: (name: string) => {
    const state = get();
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name,
      createdAt: Date.now(),
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

import { create } from 'zustand';

export interface BulkItemTypography {
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  maxWidth?: number;
}

export interface BulkItem {
  id: string;
  text: string;
  background?: string; // Custom background color/gradient per item
  typography?: BulkItemTypography; // Custom typography per item
}

export interface GeneratedImage {
  id: string;
  text: string;
  fileName: string;
  dataUrl: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  error?: string;
}

export interface BulkState {
  // Mode
  isBulkMode: boolean;
  
  // Input items with optional custom colors
  bulkItems: BulkItem[];
  rawInput: string;
  
  // Export settings
  exportFormat: 'png' | 'webp';
  exportQuality: 1 | 2 | 3;
  
  // Generation status
  isGenerating: boolean;
  currentIndex: number;
  totalItems: number;
  generatedImages: GeneratedImage[];
  
  // Cancel flag
  shouldCancel: boolean;
}

export interface BulkActions {
  // Mode
  toggleBulkMode: () => void;
  setBulkMode: (enabled: boolean) => void;
  
  // Input
  setRawInput: (input: string) => void;
  parseItems: () => BulkItem[];
  removeItem: (id: string) => void;
  updateItemBackground: (id: string, background: string) => void;
  updateItemTypography: (id: string, typography: Partial<BulkItemTypography>) => void;
  clearItemTypography: (id: string) => void;
  clearAllItems: () => void;
  
  // Export settings
  setExportFormat: (format: 'png' | 'webp') => void;
  setExportQuality: (quality: 1 | 2 | 3) => void;
  
  // Generation
  setIsGenerating: (generating: boolean) => void;
  setCurrentIndex: (index: number) => void;
  setGeneratedImages: (images: GeneratedImage[]) => void;
  updateGeneratedImage: (id: string, updates: Partial<GeneratedImage>) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  
  // Cancel
  cancelGeneration: () => void;
  resetCancel: () => void;
  
  // Reset
  resetGeneration: () => void;
  resetAll: () => void;
}

export type BulkStore = BulkState & BulkActions;

// Helper: Convert text to filename
export const textToFileName = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
    || 'thumbnail';
};

export const useBulkStore = create<BulkStore>()((set, get) => ({
  // Initial state
  isBulkMode: false,
  bulkItems: [],
  rawInput: '',
  exportFormat: 'png',
  exportQuality: 2,
  isGenerating: false,
  currentIndex: 0,
  totalItems: 0,
  generatedImages: [],
  shouldCancel: false,

  // Actions
  toggleBulkMode: () => set((state) => ({ isBulkMode: !state.isBulkMode })),
  
  setBulkMode: (enabled) => set({ isBulkMode: enabled }),

  setRawInput: (input) => {
    const { bulkItems: existingItems } = get();
    const lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    // Preserve existing backgrounds and typography when updating
    const items: BulkItem[] = lines.map((text, index) => {
      const existing = existingItems.find((item) => item.text === text);
      return {
        id: existing?.id || `item-${Date.now()}-${index}`,
        text,
        background: existing?.background,
        typography: existing?.typography,
      };
    });
    
    set({ 
      rawInput: input, 
      bulkItems: items,
      totalItems: items.length 
    });
  },

  parseItems: () => {
    const { rawInput, bulkItems: existingItems } = get();
    const lines = rawInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    const items: BulkItem[] = lines.map((text, index) => {
      const existing = existingItems.find((item) => item.text === text);
      return {
        id: existing?.id || `item-${Date.now()}-${index}`,
        text,
        background: existing?.background,
        typography: existing?.typography,
      };
    });
    
    set({ bulkItems: items, totalItems: items.length });
    return items;
  },

  removeItem: (id) => {
    const { bulkItems } = get();
    const newItems = bulkItems.filter((item) => item.id !== id);
    const newRawInput = newItems.map((item) => item.text).join('\n');
    
    set({ 
      bulkItems: newItems, 
      rawInput: newRawInput,
      totalItems: newItems.length 
    });
  },

  updateItemBackground: (id, background) => {
    const { bulkItems } = get();
    const newItems = bulkItems.map((item) =>
      item.id === id ? { ...item, background } : item
    );
    set({ bulkItems: newItems });
  },

  updateItemTypography: (id, typography) => {
    const { bulkItems } = get();
    const newItems = bulkItems.map((item) =>
      item.id === id 
        ? { ...item, typography: { ...item.typography, ...typography } } 
        : item
    );
    set({ bulkItems: newItems });
  },

  clearItemTypography: (id) => {
    const { bulkItems } = get();
    const newItems = bulkItems.map((item) =>
      item.id === id ? { ...item, typography: undefined } : item
    );
    set({ bulkItems: newItems });
  },

  clearAllItems: () => set({ 
    bulkItems: [], 
    rawInput: '',
    totalItems: 0,
    generatedImages: [] 
  }),

  setExportFormat: (format) => set({ exportFormat: format }),
  
  setExportQuality: (quality) => set({ exportQuality: quality }),

  setIsGenerating: (generating) => set({ isGenerating: generating }),
  
  setCurrentIndex: (index) => set({ currentIndex: index }),

  setGeneratedImages: (images) => set({ generatedImages: images }),

  updateGeneratedImage: (id, updates) => {
    const { generatedImages } = get();
    const newImages = generatedImages.map((img) =>
      img.id === id ? { ...img, ...updates } : img
    );
    set({ generatedImages: newImages });
  },

  addGeneratedImage: (image) => {
    const { generatedImages } = get();
    set({ generatedImages: [...generatedImages, image] });
  },

  cancelGeneration: () => set({ shouldCancel: true }),
  
  resetCancel: () => set({ shouldCancel: false }),

  resetGeneration: () => set({
    isGenerating: false,
    currentIndex: 0,
    generatedImages: [],
    shouldCancel: false,
  }),

  resetAll: () => set({
    isBulkMode: false,
    bulkItems: [],
    rawInput: '',
    exportFormat: 'png',
    exportQuality: 2,
    isGenerating: false,
    currentIndex: 0,
    totalItems: 0,
    generatedImages: [],
    shouldCancel: false,
  }),
}));

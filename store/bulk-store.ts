import { create } from 'zustand';
import { useDesignStore } from './design-store';

// ============================================
// Types
// ============================================

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

// Global typography settings for snapshot
export interface GlobalTypography {
  fontSize: number;
  lineHeight: number;
  maxWidth: number;
  fontColor: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  backgroundMode: 'solid' | 'gradient';
  gradientPreset: string;
  customGradient: string;
  textureEnabled: boolean;
  textureType: string;
  textureIntensity: number;
}

// Snapshot for undo/redo
export interface BulkSnapshot {
  bulkItems: BulkItem[];
  rawInput: string;
  globalTypography?: GlobalTypography;
}

// ============================================
// Helper Functions (DRY - Don't Repeat Yourself)
// ============================================

/**
 * Get current global typography settings from design store
 */
export function getGlobalTypography(): GlobalTypography {
  const ds = useDesignStore.getState();
  return {
    fontSize: ds.fontSize,
    lineHeight: ds.lineHeight,
    maxWidth: ds.maxWidth,
    fontColor: ds.fontColor,
    fontFamily: ds.fontFamily,
    textAlign: ds.textAlign,
    backgroundColor: ds.backgroundColor,
    backgroundMode: ds.backgroundMode,
    gradientPreset: ds.gradientPreset,
    customGradient: ds.customGradient,
    textureEnabled: ds.textureEnabled,
    textureType: ds.textureType,
    textureIntensity: ds.textureIntensity,
  };
}

/**
 * Restore global typography settings to design store
 */
export function restoreGlobalTypography(gt: GlobalTypography): void {
  const ds = useDesignStore.getState();
  ds.setFontSize(gt.fontSize);
  ds.setLineHeight(gt.lineHeight);
  ds.setMaxWidth(gt.maxWidth);
  ds.setFontColor(gt.fontColor);
  ds.setFontFamily(gt.fontFamily);
  ds.setTextAlign(gt.textAlign);
  ds.setBackgroundColor(gt.backgroundColor);
  ds.setBackgroundMode(gt.backgroundMode);
  ds.setGradientPreset(gt.gradientPreset);
  ds.setCustomGradient(gt.customGradient);
  ds.setTextureEnabled(gt.textureEnabled);
  ds.setTextureType(gt.textureType);
  ds.setTextureIntensity(gt.textureIntensity);
}

/**
 * Deep clone an object (for immutable state updates)
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if two snapshots are identical
 */
function areSnapshotsEqual(a: BulkSnapshot, b: BulkSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ============================================
// Constants
// ============================================

const MAX_HISTORY_LENGTH = 50;
const UNDO_REDO_DELAY_MS = 100;

// ============================================
// State & Store
// ============================================

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

  // History for undo/redo
  bulkHistory: BulkSnapshot[];
  bulkHistoryIndex: number;
  isBulkUndoRedoAction: boolean;
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

  // Undo/Redo
  bulkUndo: () => void;
  bulkRedo: () => void;
  canBulkUndo: () => boolean;
  canBulkRedo: () => boolean;
  pushBulkHistory: () => void;
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
  
  // History for undo/redo
  bulkHistory: [],
  bulkHistoryIndex: -1,
  isBulkUndoRedoAction: false,

  // Actions
  toggleBulkMode: () => set((state) => ({ isBulkMode: !state.isBulkMode })),
  
  setBulkMode: (enabled) => set({ isBulkMode: enabled }),

  setRawInput: (input) => {
    const { bulkItems: existingItems } = get();
    // Normalize line endings and clean input
    const cleanInput = input
      .replace(/\r\n/g, '\n')     // Windows -> Unix
      .replace(/\r/g, '\n')       // Old Mac -> Unix
      .replace(/\u200B/g, '')     // Remove zero-width spaces
      .replace(/\u00A0/g, ' ');   // Replace non-breaking space with regular space
    
    const lines = cleanInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    // Remove duplicate lines (keep first occurrence)
    const uniqueLines = Array.from(new Set(lines));
    
    // Preserve existing backgrounds and typography when updating
    const items: BulkItem[] = uniqueLines.map((text, index) => {
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
    // Normalize line endings and clean input
    const cleanInput = rawInput
      .replace(/\r\n/g, '\n')     // Windows -> Unix
      .replace(/\r/g, '\n')       // Old Mac -> Unix
      .replace(/\u200B/g, '')     // Remove zero-width spaces
      .replace(/\u00A0/g, ' ');   // Replace non-breaking space with regular space
    
    const lines = cleanInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    // Remove duplicate lines (keep first occurrence)
    const uniqueLines = Array.from(new Set(lines));
    
    const items: BulkItem[] = uniqueLines.map((text, index) => {
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
    bulkHistory: [],
    bulkHistoryIndex: -1,
    isBulkUndoRedoAction: false,
  }),

  // Undo/Redo implementations
  pushBulkHistory: () => {
    const state = get();
    
    // Guard clauses
    if (state.isBulkUndoRedoAction) return;
    if (state.bulkItems.length === 0) return;

    // Create snapshot
    const snapshot: BulkSnapshot = {
      bulkItems: deepClone(state.bulkItems),
      rawInput: state.rawInput,
      globalTypography: getGlobalTypography(),
    };

    // Skip if identical to last snapshot
    const lastSnapshot = state.bulkHistory[state.bulkHistoryIndex];
    if (lastSnapshot && areSnapshotsEqual(snapshot, lastSnapshot)) {
      return;
    }

    // Update history (remove future, add new, limit size)
    const newHistory = [
      ...state.bulkHistory.slice(0, state.bulkHistoryIndex + 1),
      snapshot,
    ].slice(-MAX_HISTORY_LENGTH);

    set({
      bulkHistory: newHistory,
      bulkHistoryIndex: newHistory.length - 1,
    });
  },

  bulkUndo: () => {
    const state = get();
    if (state.bulkHistoryIndex <= 0) return;

    const newIndex = state.bulkHistoryIndex - 1;
    const snapshot = state.bulkHistory[newIndex];
    if (!snapshot) return;

    // Restore bulk state
    set({
      isBulkUndoRedoAction: true,
      bulkHistoryIndex: newIndex,
      bulkItems: deepClone(snapshot.bulkItems),
      rawInput: snapshot.rawInput,
    });

    // Restore global typography
    if (snapshot.globalTypography) {
      restoreGlobalTypography(snapshot.globalTypography);
    }

    setTimeout(() => set({ isBulkUndoRedoAction: false }), UNDO_REDO_DELAY_MS);
  },

  bulkRedo: () => {
    const state = get();
    if (state.bulkHistoryIndex >= state.bulkHistory.length - 1) return;

    const newIndex = state.bulkHistoryIndex + 1;
    const snapshot = state.bulkHistory[newIndex];
    if (!snapshot) return;

    // Restore bulk state
    set({
      isBulkUndoRedoAction: true,
      bulkHistoryIndex: newIndex,
      bulkItems: deepClone(snapshot.bulkItems),
      rawInput: snapshot.rawInput,
    });

    // Restore global typography
    if (snapshot.globalTypography) {
      restoreGlobalTypography(snapshot.globalTypography);
    }

    setTimeout(() => set({ isBulkUndoRedoAction: false }), UNDO_REDO_DELAY_MS);
  },

  canBulkUndo: () => {
    const state = get();
    return state.bulkHistoryIndex > 0;
  },

  canBulkRedo: () => {
    const state = get();
    return state.bulkHistoryIndex < state.bulkHistory.length - 1;
  },
}));

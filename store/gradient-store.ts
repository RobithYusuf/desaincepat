import { create } from 'zustand';

export interface Point {
  x: number;
  y: number;
}

export interface Shape {
  id: string;
  points: Point[];
  center: Point; // Center point for dragging
  fillIndex: number;
  opacity?: number;
  blur?: number;
}

export interface Color {
  id: string;
  color: string;
}

export interface Canvas {
  width: number;
  height: number;
  background: {
    id: string;
    color: string;
  };
}

export interface Filters {
  blur: number;
  grainEnabled: boolean;
  grain: number;
  opacity: number;
  spread: number;
}

export interface GradientPreset {
  title: string;
  config: {
    palette: Color[];
    shapes: Shape[];
  };
}

export interface HistorySnapshot {
  palette: Color[];
  shapes: Shape[];
  filters: Filters;
  canvas: Canvas;
}

export interface GradientState {
  canvas: Canvas;
  palette: Color[];
  shapes: Shape[];
  filters: Filters;
  selectedColorId: string | null;
  adjustColorPosition: boolean;
  adjustVertices: boolean;
  exportWidth: number;
  exportHeight: number;
  aspectRatioLocked: boolean;
  currentPreset: string;
  history: HistorySnapshot[];
  historyIndex: number;
}

export interface GradientActions {
  // Canvas actions
  setCanvasSize: (width: number, height: number) => void;
  setCanvasBackground: (color: string) => void;
  
  // Palette actions
  addColor: (color: string) => void;
  removeColor: (colorId: string) => void;
  updateColor: (colorId: string, color: string) => void;
  reorderColors: (oldIndex: number, newIndex: number) => void;
  setSelectedColor: (colorId: string | null) => void;
  
  // Shape actions
  addShape: (shape: Omit<Shape, 'id'>) => void;
  removeShape: (shapeId: string) => void;
  updateShape: (shapeId: string, updates: Partial<Shape>) => void;
  setShapes: (shapes: Shape[]) => void;
  updateShapeCenter: (shapeId: string, center: Point) => void;
  updateShapeVertex: (shapeId: string, vertexIndex: number, newPosition: Point) => void;
  
  // Filter actions
  setBlur: (blur: number) => void;
  setGrain: (grain: number) => void;
  setGrainEnabled: (enabled: boolean) => void;
  setOpacity: (opacity: number) => void;
  setSpread: (spread: number) => void;
  resetFilters: () => void;
  
  // Export actions
  setExportWidth: (width: number) => void;
  setExportHeight: (height: number) => void;
  setAspectRatioLocked: (locked: boolean) => void;
  setExportPreset: (preset: 'square' | 'story' | 'portrait' | 'landscape' | 'opengraph' | 'youtube') => void;
  
  // Settings actions
  setAdjustColorPosition: (enabled: boolean) => void;
  setAdjustVertices: (enabled: boolean) => void;
  
  // Preset actions
  loadPreset: (preset: GradientPreset) => void;
  setCurrentPreset: (presetName: string) => void;
  
  // Generation actions
  randomize: () => void;
  shuffle: () => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveHistory: () => void;
}

export type GradientStore = GradientState & GradientActions;

const DEFAULT_PALETTE: Color[] = [
  { id: crypto.randomUUID(), color: '#ffffff' },
  { id: crypto.randomUUID(), color: '#609EFF' },
  { id: crypto.randomUUID(), color: '#FCB055' },
  { id: crypto.randomUUID(), color: '#FB847C' },
  { id: crypto.randomUUID(), color: '#B6B8FD' },
];

const DEFAULT_FILTERS: Filters = {
  blur: 80,
  grainEnabled: true,
  grain: 65,
  opacity: 100,
  spread: 100,
};

const EXPORT_PRESETS = {
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1920, height: 1080 },
  opengraph: { width: 1200, height: 630 },
  youtube: { width: 1280, height: 720 },
};

export const useGradientStore = create<GradientStore>((set, get) => ({
  // Initial state
  canvas: {
    width: 1920,
    height: 1080,
    background: {
      id: crypto.randomUUID(),
      color: '#ffffff',
    },
  },
  palette: DEFAULT_PALETTE,
  shapes: [],
  filters: DEFAULT_FILTERS,
  selectedColorId: null,
  adjustColorPosition: false,
  adjustVertices: false,
  exportWidth: 1920,
  exportHeight: 1080,
  aspectRatioLocked: true,
  currentPreset: 'Golden Mist',
  history: [],
  historyIndex: -1,

  // Canvas actions
  setCanvasSize: (width, height) =>
    set((state) => ({
      canvas: { ...state.canvas, width, height },
    })),

  setCanvasBackground: (color) =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        background: { ...state.canvas.background, color },
      },
    })),

  // Palette actions
  addColor: (color) =>
    set((state) => {
      const newState = {
        palette: [...state.palette, { id: crypto.randomUUID(), color }],
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  removeColor: (colorId) =>
    set((state) => {
      const newState = {
        palette: state.palette.filter((c) => c.id !== colorId),
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  updateColor: (colorId, color) =>
    set((state) => {
      const newState = {
        palette: state.palette.map((c) =>
          c.id === colorId ? { ...c, color } : c
        ),
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  reorderColors: (oldIndex, newIndex) =>
    set((state) => {
      const newPalette = [...state.palette];
      const [removed] = newPalette.splice(oldIndex, 1);
      newPalette.splice(newIndex, 0, removed);
      return { palette: newPalette };
    }),

  setSelectedColor: (colorId) => set({ selectedColorId: colorId }),

  // Shape actions
  addShape: (shape) =>
    set((state) => ({
      shapes: [...state.shapes, { ...shape, id: crypto.randomUUID() }],
    })),

  removeShape: (shapeId) =>
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== shapeId),
    })),

  updateShape: (shapeId, updates) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === shapeId ? { ...s, ...updates } : s
      ),
    })),

  setShapes: (shapes) => {
    set({ shapes });
    setTimeout(() => get().saveHistory(), 0);
  },

  updateShapeCenter: (shapeId, center) =>
    set((state) => {
      const canvas = state.canvas;
      
      return {
        shapes: state.shapes.map((s) => {
          if (s.id === shapeId) {
            // Use stored center point directly
            const currentCenter = s.center;
            
            // Calculate movement delta
            const dx = center.x - currentCenter.x;
            const dy = center.y - currentCenter.y;
            
            // Move all points by delta (no constraints, allow dragging outside canvas)
            const newPoints = s.points.map((p) => ({
              x: p.x + dx,
              y: p.y + dy,
            }));
            
            // Calculate new centroid after movement for accurate center storage
            const newCentroid = {
              x: newPoints.reduce((sum, p) => sum + p.x, 0) / newPoints.length,
              y: newPoints.reduce((sum, p) => sum + p.y, 0) / newPoints.length,
            };
            
            return {
              ...s,
              center: newCentroid,
              points: newPoints,
            };
          }
          return s;
        }),
      };
    }),

  updateShapeVertex: (shapeId, vertexIndex, newPosition) =>
    set((state) => ({
      shapes: state.shapes.map((s) => {
        if (s.id === shapeId) {
          // Update specific vertex
          const newPoints = s.points.map((p, idx) =>
            idx === vertexIndex ? newPosition : p
          );
          
          // Recalculate centroid after vertex update
          const newCentroid = {
            x: newPoints.reduce((sum, p) => sum + p.x, 0) / newPoints.length,
            y: newPoints.reduce((sum, p) => sum + p.y, 0) / newPoints.length,
          };
          
          return {
            ...s,
            points: newPoints,
            center: newCentroid,
          };
        }
        return s;
      }),
    })),

  // Filter actions
  setBlur: (blur) =>
    set((state) => {
      const newState = {
        filters: { ...state.filters, blur },
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  setGrain: (grain) =>
    set((state) => {
      const newState = {
        filters: { ...state.filters, grain },
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  setGrainEnabled: (enabled) =>
    set((state) => {
      const newState = {
        filters: { ...state.filters, grainEnabled: enabled },
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  setOpacity: (opacity) =>
    set((state) => {
      const newState = {
        filters: { ...state.filters, opacity },
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  setSpread: (spread) =>
    set((state) => {
      const newState = {
        filters: { ...state.filters, spread },
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  resetFilters: () =>
    set({
      filters: DEFAULT_FILTERS,
    }),

  // Export actions
  setExportWidth: (width) => {
    const state = get();
    if (state.aspectRatioLocked) {
      const ratio = state.exportHeight / state.exportWidth;
      set({ exportWidth: width, exportHeight: Math.round(width * ratio) });
    } else {
      set({ exportWidth: width });
    }
  },

  setExportHeight: (height) => {
    const state = get();
    if (state.aspectRatioLocked) {
      const ratio = state.exportWidth / state.exportHeight;
      set({ exportHeight: height, exportWidth: Math.round(height * ratio) });
    } else {
      set({ exportHeight: height });
    }
  },

  setAspectRatioLocked: (locked) => set({ aspectRatioLocked: locked }),

  setExportPreset: (preset) => {
    const dimensions = EXPORT_PRESETS[preset];
    const state = get();
    
    // Update both export size AND canvas size
    set({
      exportWidth: dimensions.width,
      exportHeight: dimensions.height,
      canvas: {
        ...state.canvas,
        width: dimensions.width,
        height: dimensions.height,
      },
    });
    
    console.log(`📐 Canvas size changed to ${dimensions.width}×${dimensions.height}`);
  },

  // Settings actions
  setAdjustColorPosition: (enabled) => set({ adjustColorPosition: enabled }),
  setAdjustVertices: (enabled) => set({ adjustVertices: enabled }),

  // Preset actions
  loadPreset: (preset) =>
    set({
      palette: preset.config.palette,
      // Don't set shapes from preset, they will be generated dynamically
      currentPreset: preset.title,
    }),

  setCurrentPreset: (presetName) => set({ currentPreset: presetName }),

  // Generation actions - will be implemented with mesh generator
  randomize: () => {
    // Will be implemented
    console.log('Randomize called');
  },

  shuffle: () => {
    const state = get();
    const shuffledPalette = [...state.palette].sort(() => Math.random() - 0.5);
    set({ palette: shuffledPalette });
  },

  // History actions
  saveHistory: () => {
    const state = get();
    const snapshot: HistorySnapshot = {
      palette: state.palette,
      shapes: state.shapes,
      filters: state.filters,
      canvas: state.canvas,
    };

    // Remove any history after current index (for when user made changes after undo)
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    
    // Add new snapshot
    newHistory.push(snapshot);
    
    // Limit history to 50 snapshots for performance
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
    const snapshot = state.history[newIndex];

    set({
      palette: snapshot.palette,
      shapes: snapshot.shapes,
      filters: snapshot.filters,
      canvas: snapshot.canvas,
      historyIndex: newIndex,
    });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const newIndex = state.historyIndex + 1;
    const snapshot = state.history[newIndex];

    set({
      palette: snapshot.palette,
      shapes: snapshot.shapes,
      filters: snapshot.filters,
      canvas: snapshot.canvas,
      historyIndex: newIndex,
    });
  },

  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
}));

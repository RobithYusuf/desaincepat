import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  imageDataUrl: string; // base64 data URL
  topic: string;
  style: string;
  audience: string;
  frameSize: string;
  resolution: string; // '2K' or '4K'
  mode: 'quick' | 'quality';
  createdAt: number; // timestamp
}

interface HistoryStore {
  items: HistoryItem[];
  maxItems: number;
  quotaError: boolean;
  
  // Actions
  addItem: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  clearHistory: () => void;
  getItem: (id: string) => HistoryItem | undefined;
  clearQuotaError: () => void;
}

// Generate unique ID
const generateId = () => `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Custom storage with error handling
const customStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Clear storage and try again
        localStorage.removeItem(name);
        console.warn('[History] Storage quota exceeded, history cleared');
        throw error; // Re-throw to trigger quotaError state
      }
      throw error;
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignore errors
    }
  },
}));

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 10, // Reduced from 20 to prevent quota issues
      quotaError: false,

      addItem: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: generateId(),
          createdAt: Date.now(),
        };

        try {
          set((state) => {
            // Add new item at the beginning
            const newItems = [newItem, ...state.items];
            
            // Keep only maxItems
            if (newItems.length > state.maxItems) {
              newItems.pop();
            }
            
            return { items: newItems, quotaError: false };
          });
        } catch (error) {
          // If quota exceeded, clear history and show error
          set({ items: [], quotaError: true });
          console.error('[History] Failed to save, quota exceeded');
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          quotaError: false,
        }));
      },

      clearHistory: () => {
        // Also clear from localStorage directly
        try {
          localStorage.removeItem('desaincepat-history');
        } catch {
          // Ignore
        }
        set({ items: [], quotaError: false });
      },

      getItem: (id) => {
        return get().items.find((item) => item.id === id);
      },

      clearQuotaError: () => {
        set({ quotaError: false });
      },
    }),
    {
      name: 'desaincepat-history',
      storage: customStorage,
      // Only persist items, not actions
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[History] Failed to load history:', error);
          // Clear corrupted storage
          try {
            localStorage.removeItem('desaincepat-history');
          } catch {
            // Ignore
          }
        }
      },
    }
  )
);

// Helper to clear history from outside React (e.g., from console or error handlers)
export function clearHistoryStorage() {
  try {
    localStorage.removeItem('desaincepat-history');
    console.log('[History] Storage cleared');
  } catch {
    console.error('[History] Failed to clear storage');
  }
}

// Helper functions
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

export function getStyleLabel(styleValue: string): string {
  const styles: Record<string, string> = {
    'modern-gradient': 'Modern Gradient',
    'minimalist': 'Minimalist',
    'bold-colorful': 'Bold & Colorful',
    'professional': 'Professional',
    'playful': 'Playful',
    'dark-mode': 'Dark Mode',
    'neon-glow': 'Neon Glow',
    'retro-vintage': 'Retro/Vintage',
    'cinematic': 'Cinematic',
    '3d-render': '3D Render',
  };
  return styles[styleValue] || styleValue;
}

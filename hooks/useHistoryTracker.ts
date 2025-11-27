"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useDesignStore } from '@/store/design-store';

// Create a snapshot string for comparison
function createSnapshot(store: ReturnType<typeof useDesignStore>): string {
  return JSON.stringify({
    text: store.text,
    fontSize: store.fontSize,
    lineHeight: store.lineHeight,
    maxWidth: store.maxWidth,
    fontColor: store.fontColor,
    fontFamily: store.fontFamily,
    textAlign: store.textAlign,
    frameSize: store.frameSize,
    customWidth: store.customWidth,
    customHeight: store.customHeight,
    padding: store.padding,
    backgroundMode: store.backgroundMode,
    backgroundColor: store.backgroundColor,
    gradientPreset: store.gradientPreset,
    customGradient: store.customGradient,
    textureEnabled: store.textureEnabled,
    textureType: store.textureType,
    textureIntensity: store.textureIntensity,
  });
}

export function useHistoryTracker() {
  const store = useDesignStore();
  const { pushToHistory, isUndoRedoAction, history } = store;
  
  // Track last saved snapshot
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingPushRef = useRef(false);

  // Create current snapshot
  const currentSnapshot = createSnapshot(store);

  // Memoized push function
  const doPush = useCallback(() => {
    if (pendingPushRef.current) {
      pushToHistory();
      pendingPushRef.current = false;
    }
  }, [pushToHistory]);

  useEffect(() => {
    // Skip if this is an undo/redo action
    if (isUndoRedoAction) {
      // Update lastSavedSnapshot to current after undo/redo
      lastSavedSnapshotRef.current = currentSnapshot;
      return;
    }

    // Initialize on first render - save initial state
    if (lastSavedSnapshotRef.current === null) {
      lastSavedSnapshotRef.current = currentSnapshot;
      // Only push initial state if history is empty
      if (history.length === 0) {
        pushToHistory();
      }
      return;
    }

    // Check if snapshot changed from last saved
    if (currentSnapshot !== lastSavedSnapshotRef.current) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Mark that we need to push
      pendingPushRef.current = true;
      
      // Update last saved snapshot immediately to prevent duplicate pushes
      lastSavedSnapshotRef.current = currentSnapshot;

      // Debounce the actual push
      debounceTimerRef.current = setTimeout(() => {
        doPush();
      }, 500);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentSnapshot, isUndoRedoAction, pushToHistory, history.length, doPush]);
}

"use client";

import { useEffect, useRef } from 'react';
import { useBulkStore, getGlobalTypography } from '@/store/bulk-store';

// ============================================
// Constants
// ============================================

const DEBOUNCE_MS = 300;

// ============================================
// Hook
// ============================================

/**
 * Tracks changes to bulk items and global typography for undo/redo
 * Only active when in bulk mode
 */
export function useBulkHistoryTracker() {
  // Bulk store selectors (minimal subscriptions)
  const isBulkMode = useBulkStore((s) => s.isBulkMode);
  const bulkItems = useBulkStore((s) => s.bulkItems);
  const bulkHistoryLength = useBulkStore((s) => s.bulkHistory.length);
  const isBulkUndoRedoAction = useBulkStore((s) => s.isBulkUndoRedoAction);
  const pushBulkHistory = useBulkStore((s) => s.pushBulkHistory);
  
  // Refs for tracking state
  const lastSnapshotRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Create snapshot for comparison
  const createSnapshot = (): string => {
    return JSON.stringify({
      bulkItems,
      globalTypography: getGlobalTypography(),
    });
  };

  useEffect(() => {
    // Reset when leaving bulk mode
    if (!isBulkMode) {
      isInitializedRef.current = false;
      lastSnapshotRef.current = '';
      return;
    }

    // Skip tracking during undo/redo actions
    if (isBulkUndoRedoAction) {
      lastSnapshotRef.current = createSnapshot();
      return;
    }

    // Skip if no items
    if (bulkItems.length === 0) return;

    const currentSnapshot = createSnapshot();

    // Initialize on first items
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      lastSnapshotRef.current = currentSnapshot;
      if (bulkHistoryLength === 0) {
        pushBulkHistory();
      }
      return;
    }

    // Detect changes and debounce push
    if (currentSnapshot !== lastSnapshotRef.current) {
      // Clear pending timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const prevSnapshot = lastSnapshotRef.current;
      lastSnapshotRef.current = currentSnapshot;

      // Debounced push
      debounceTimerRef.current = setTimeout(() => {
        if (currentSnapshot !== prevSnapshot) {
          pushBulkHistory();
        }
      }, DEBOUNCE_MS);
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  });

  // Note: We intentionally don't use dependency array here
  // to ensure every render checks for changes (global typography
  // changes don't trigger re-renders in this hook)
}
